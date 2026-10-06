import { NextResponse } from "next/server";
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

    const clientId = process.env.ZOOM_CLIENT_ID;
    const redirectUri = process.env.ZOOM_REDIRECT_URI || "http://127.0.0.1:3000/api/meeting-apps/zoom/callback";
    
    const stateToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${stateToken}`;

    return NextResponse.redirect(zoomAuthUrl);
  } catch (error) {
    console.error("Zoom Initiate Error:", error);
    return NextResponse.redirect(new URL("/settings?tab=integrations&error=zoom_auth_failed", req.url));
  }
}