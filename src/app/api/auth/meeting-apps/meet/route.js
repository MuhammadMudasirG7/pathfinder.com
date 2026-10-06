import { NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/meeting-apps/meet/callback`
    );

    // Google Calendar aur Meet ke liye scopes
    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid"
    ];

    const stateToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: stateToken,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google Meet Initiate Error:", error);
    return NextResponse.redirect(new URL("/settings?tab=integrations&error=auth_failed", req.url));
  }
}