import { NextResponse } from "next/server";
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
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=zoom_failed", req.url));
    }

    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=invalid_state", req.url));
    }

    const userId = decodedState.userId;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
   const redirectUri = process.env.ZOOM_REDIRECT_URI || "http://127.0.0.1:3000/api/meeting-apps/zoom/callback";

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("Failed to obtain access token from Zoom");
    }

    const userResponse = await fetch('https://api.zoom.us/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    const zoomEmail = userData.email;

    if (!zoomEmail) {
      throw new Error("Zoom email could not be retrieved");
    }

    await MeetingIntegration.findOneAndUpdate(
      { userId: userId, provider: "zoom" },
      {
        userId: userId,
        provider: "zoom",
        email: zoomEmail,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || "",
        connected: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(new URL("/settings?tab=integrations&success=zoom_connected", req.url));
  } catch (err) {
    console.error("Zoom Callback Error:", err);
    return NextResponse.redirect(new URL("/settings?tab=integrations&error=server_error", req.url));
  }
}