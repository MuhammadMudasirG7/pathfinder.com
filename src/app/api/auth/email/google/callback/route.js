import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db"; 
import User from "@/models/user"; 
import EmailConnection from "@/models/EmailConnectionModel"; 

const SCOPES = [
  "https://googleapis.com"
];

export async function GET(req) {
  try {
    console.log("=================================");
    console.log("GOOGLE EMAIL CALLBACK STARTED");
    console.log("=================================");

    await connectDB();

    // 🧠 1. Base URL ko function ke andar variable se uthein
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vercel.app";

    // 🧠 2. OAuth Client ko dynamic tareeqay se function ke andar initialize karen
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${baseUrl}/api/auth/email/google/callback` 
    );

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${baseUrl}/settings?tab=email&error=google_access_denied` 
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    if (!decoded.userId) {
      return NextResponse.json({ success: false, message: "userId not found inside JWT" }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 🧠 3. Agar code missing hai, to naye dynamic auth URL par bhejein
    if (!code) {
      const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        include_granted_scopes: true,
        prompt: "consent",
      });
      return NextResponse.redirect(authorizationUrl);
    }

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token) {
      return NextResponse.json({ success: false, message: "Google access token not received" }, { status: 400 });
    }

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const googleUser = await oauth2.userinfo.get();
    const googleEmail = googleUser.data.email;

    if (!googleEmail) {
      return NextResponse.json({ success: false, message: "Google email not found" }, { status: 400 });
    }

    let emailConnection = await EmailConnection.findOne({ userId: user._id });

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
    } else {
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

    return NextResponse.redirect(`${baseUrl}/settings?tab=email&success=google_connected`);

  } catch (error) {
    console.error("GOOGLE EMAIL CONNECTION ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to connect Google account", error: error.message }, { status: 500 });
  }
}
