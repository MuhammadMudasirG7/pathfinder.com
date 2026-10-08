import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db"; // 🧠 Absolute path alias
import MeetingIntegration from "@/models/MeetingIntegration"; // 🧠 Absolute path alias

export async function GET(req) {
  try {
    await connectDB();

    // Vercel par configured production base URL ko uthein
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pathfindercom.vercel.app";

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // 🧠 Error redirects ko meeting-apps tab par set kiya
    if (error || !code || !state) {
      return NextResponse.redirect(`${baseUrl}/settings?tab=meeting-apps&error=meet_failed`);
    }

    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.redirect(`${baseUrl}/settings?tab=meeting-apps&error=invalid_state`);
    }

    const userId = decodedState.userId;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${baseUrl}/api/auth/meeting-apps/meet/callback` // 🧠 Live dynamic callback URL
    );

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token) {
      throw new Error("Failed to obtain access token");
    }

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;

    if (!googleEmail) {
      throw new Error("Google email could not be retrieved");
    }

    // Database mein save karein
    await MeetingIntegration.findOneAndUpdate(
      { userId: userId, provider: "google_meet" },
      {
        userId: userId,
        provider: "google_meet",
        email: googleEmail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        connected: true,
      },
      { upsert: true, new: true }
    );

    // 🧠 SUCCESS REDIRECT: Ab yeh exact meeting-apps tab par hi return karega
    return NextResponse.redirect(`${baseUrl}/settings?tab=meeting-apps&success=google_meet_connected`);
  } catch (err) {
    console.error("Google Meet Callback Error:", err);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pathfindercom.vercel.app";
    return NextResponse.redirect(`${baseUrl}/settings?tab=meeting-apps&error=server_error`);
  }
}
