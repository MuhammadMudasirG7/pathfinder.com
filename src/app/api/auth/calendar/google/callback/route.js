import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../../../../lib/db";
import GoogleCalendarConnection from "../../../../../../../models/GoogleCalendarConnection";

export async function GET(req) {
  try {
    console.log("--- GOOGLE CALENDAR CALLBACK INITIATED ---");

    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(`http://localhost:3000/settings?tab=calendar&error=access_denied`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`http://localhost:3000/settings?tab=calendar&error=no_code`);
    }

    // State se user ID verify karein
    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid state token" }, { status: 401 });
    }

    const userId = decodedState.userId;

    // Setup OAuth Client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/calendar/google/callback`
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token) {
      throw new Error("Failed to obtain access token from Google");
    }

    oauth2Client.setCredentials(tokens);

    // Fetch user email securely using Google OAuth2 API
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;

    if (!googleEmail) {
      throw new Error("Google email could not be retrieved");
    }

    // Save or update in MongoDB
    await GoogleCalendarConnection.findOneAndUpdate(
      { userId: userId },
      {
        provider: "google",
        email: googleEmail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        connected: true,
      },
      { upsert: true, returnDocument: 'after' }
    );

    console.log("GOOGLE CALENDAR SUCCESSFULLY CONNECTED & SAVED");

    // Success redirect back to frontend settings page (Calendar tab)
    return NextResponse.redirect(`http://localhost:3000/settings?tab=calendar&success=google_connected`);

  } catch (err) {
    console.error("CALENDAR CALLBACK ERROR:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}