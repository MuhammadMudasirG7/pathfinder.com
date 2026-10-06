import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../../../../lib/db";
import MeetingIntegration from "../../../../../../../models/MeetingIntegration";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code || !state) {
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=meet_failed", req.url));
    }

    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=invalid_state", req.url));
    }

    const userId = decodedState.userId;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/meeting-apps/meet/callback`
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

    // Database mein save karein (Composite unique index ke sath)
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

    return NextResponse.redirect(new URL("/settings?tab=integrations&success=google_meet_connected", req.url));
  } catch (err) {
    console.error("Google Meet Callback Error:", err);
    return NextResponse.redirect(new URL("/settings?tab=integrations&error=server_error", req.url));
  }
}