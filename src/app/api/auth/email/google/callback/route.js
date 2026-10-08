import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db"; // 🧠 Absolute path alias set kiya
import User from "@/models/user"; // 🧠 Absolute path alias set kiya
import EmailConnection from "@/models/EmailConnectionModel"; // 🧠 Absolute path alias set kiya

// Dynamic Production URL Setup
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pathfindercom.vercel.app";

// Google OAuth Client (Dynamic Redirect URI ke sath)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${baseUrl}/api/auth/email/google/callback` // 🧠 Live dynamic production callback URL
);

// Google permissions
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export async function GET(req) {
  try {
    console.log("=================================");
    console.log("GOOGLE EMAIL CALLBACK STARTED");
    console.log("=================================");

    // 1. Database connect
    await connectDB();
    console.log("DATABASE CONNECTED");

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    console.log("Google Code:", code ? "RECEIVED" : "NOT RECEIVED");
    console.log("Google Error:", error);

    // 2. Google permission reject check
    if (error) {
      console.log("GOOGLE ACCESS DENIED");
      return NextResponse.redirect(
        `${baseUrl}/settings?tab=integrations&error=google_access_denied` // 🧠 Live Route + Sahi Tab Update
      );
    }

    // 3. Get JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("JWT TOKEN EXISTS:", !!token);

    if (!token) {
      console.log("JWT TOKEN NOT FOUND");
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // 4. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT DECODED:", decoded);
    } catch (jwtError) {
      console.log("JWT VERIFY ERROR:", jwtError.message);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 5. JWT userId check
    if (!decoded.userId) {
      console.log("decoded.userId DOES NOT EXIST");
      return NextResponse.json(
        { success: false, message: "userId not found inside JWT" },
        { status: 400 }
      );
    }

    // 6. Find User
    const user = await User.findById(decoded.userId);
    console.log("USER FOUND:", user ? "YES" : "NO");

    if (!user) {
      console.log("USER NOT FOUND FOR ID:", decoded.userId);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 7. If code is missing, redirect to Google Auth URL
    if (!code) {
      console.log("NO GOOGLE CODE - GENERATING AUTH URL");
      const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        include_granted_scopes: true,
        prompt: "consent",
      });

      return NextResponse.redirect(authorizationUrl);
    }

    // 8. Exchange Google code for tokens
    console.log("EXCHANGING GOOGLE CODE FOR TOKENS");
    const { tokens } = await oauth2Client.getToken(code);

    console.log("GOOGLE TOKENS RECEIVED:", {
      accessToken: !!tokens.access_token,
      refreshToken: !!tokens.refresh_token,
    });

    if (!tokens.access_token) {
      console.log("GOOGLE ACCESS TOKEN NOT RECEIVED");
      return NextResponse.json(
        { success: false, message: "Google access token not received" },
        { status: 400 }
      );
    }

    // 9. Set Google credentials
    oauth2Client.setCredentials(tokens);

    // 10. Get Google account information
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const googleUser = await oauth2.userinfo.get();
    const googleEmail = googleUser.data.email;
    console.log("GOOGLE EMAIL:", googleEmail);

    if (!googleEmail) {
      console.log("GOOGLE EMAIL NOT FOUND");
      return NextResponse.json(
        { success: false, message: "Google email not found" },
        { status: 400 }
      );
    }

    // 11. Check existing connection
    let emailConnection = await EmailConnection.findOne({ userId: user._id });

    // 12. Update or Create Connection in Database
    if (emailConnection) {
      console.log("UPDATING EXISTING EMAIL CONNECTION");
      emailConnection.provider = "google";
      emailConnection.email = googleEmail;
      emailConnection.accessToken = tokens.access_token;

      if (tokens.refresh_token) {
        emailConnection.refreshToken = tokens.refresh_token;
      }

      emailConnection.connected = true;
      emailConnection.autoSync = true;
      await emailConnection.save();
      console.log("EMAIL CONNECTION UPDATED");
    } else {
      console.log("CREATING NEW EMAIL CONNECTION");
      emailConnection = await EmailConnection.create({
        userId: user._id,
        provider: "google",
        email: googleEmail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        connected: true,
        autoSync: true,
        syncInterval: 120,
        lastSyncedAt: null,
      });
      console.log("NEW EMAIL CONNECTION CREATED:", emailConnection._id);
    }

    // 13. Success Redirect to Frontend Settings (Integrations tab)
    console.log("GOOGLE EMAIL CONNECTED SUCCESSFULLY");
    return NextResponse.redirect(
      `${baseUrl}/settings?tab=integrations&success=google_connected` // 🧠 Live Route + Sahi Tab par dynamic redirect
    );

  } catch (error) {
    console.error("=================================");
    console.error("GOOGLE EMAIL CONNECTION ERROR");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect Google account",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
