import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db"; // 🧠 jsconfig alias use kiya
import User from "@/models/user"; // 🧠 jsconfig alias use kiya
import EmailConnection from "@/models/EmailConnectionModel"; // 🧠 jsconfig alias use kiya

// Google permissions
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export async function GET(req) {
  try {
    console.log("=================================");
    console.log("GOOGLE EMAIL API STARTED");
    console.log("=================================");

    await connectDB();
    console.log("DATABASE CONNECTED");

    // 🧠 1. Base URL ko har haal mein dynamic function body ke andar se uthein
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vercel.app";

    // 🧠 2. OAuth Client ko function ke andar initialize karen taake dynamic callback perfect match ho
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${baseUrl}/api/auth/email/google/callback`
    );

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    console.log("Google Code:", code ? "RECEIVED" : "NOT RECEIVED");
    console.log("Google Error:", error);

    // 2. Google permission reject
    if (error) {
      console.log("GOOGLE ACCESS DENIED");
      return NextResponse.redirect(
        `${baseUrl}/settings?tab=integrations&error=google_access_denied` // 🧠 Live website tab route
      );
    }

    // 3. Get JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("JWT TOKEN EXISTS:", !!token);

    if (!token) {
      console.log("JWT TOKEN NOT FOUND");
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // 4. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT DECODED:", decoded);
    } catch (jwtError) {
      console.log("JWT VERIFY ERROR:", jwtError.message);
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // 5. JWT userId check
    if (!decoded.userId) {
      return NextResponse.json({ success: false, message: "userId not found inside JWT" }, { status: 400 });
    }

    // 6. Find Pathfinder user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 7. First request - Generate Google OAuth URL
    if (!code) {
      console.log("NO GOOGLE CODE - GENERATING GOOGLE AUTH URL");
      
      // State token mein safe userId pass karen taake track ho sakay
      const stateToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

      const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        include_granted_scopes: true,
        state: stateToken, // 🧠 State token pass karna zaroori hai secure flows ke liye
        prompt: "consent",
      });

      return NextResponse.redirect(authorizationUrl);
    }

    // 8. Exchange Google code for tokens
    console.log("GOOGLE CODE RECEIVED - EXCHANGING FOR TOKENS");
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.json({ success: false, message: "Google access token not received" }, { status: 400 });
    }

    // 9. Set Google credentials
    oauth2Client.setCredentials(tokens);

    // 10. Get Google account information
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const googleUser = await oauth2.userinfo.get();
    const googleEmail = googleUser.data.email;

    if (!googleEmail) {
      return NextResponse.json({ success: false, message: "Google email not found" }, { status: 400 });
    }

    // 11. Check existing connection
    let emailConnection = await EmailConnection.findOne({ userId: user._id });

    // 12. Update existing connection
    if (emailConnection) {
      emailConnection.provider = "google";
      emailConnection.email = googleEmail;
      emailConnection.accessToken = tokens.access_token;
      if (tokens.refresh_token) {
        emailConnection.refreshToken = tokens.refresh_token;
      }
      emailConnection.connected = true;
      emailConnection.autoSync = true;
      await emailConnection.save();
    } 
    // 13. Create new connection
    else {
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
    }

    // 14. Success Redirect to live page integrations tab
    console.log("GOOGLE EMAIL CONNECTED SUCCESSFULLY");
    return NextResponse.redirect(
      `${baseUrl}/settings?tab=integrations&success=google_connected` // 🧠 Exact integrations tab route
    );

  } catch (error) {
    console.error("GOOGLE EMAIL CONNECTION ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to connect Google account", error: error.message }, { status: 500 });
  }
}
