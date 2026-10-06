import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "../../../../../../../lib/db";
import MeetingIntegration from "../../../../../../../models/MeetingIntegration";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, connected: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const connection = await MeetingIntegration.findOne({ 
      userId: decoded.userId, 
      provider: "zoom" 
    });

    if (!connection || !connection.connected) {
      return NextResponse.json({ success: true, connected: false });
    }

    return NextResponse.json({
      success: true,
      connected: true,
      email: connection.email,
    });
  } catch (error) {
    console.error("Zoom Status Error:", error);
    return NextResponse.json({ success: false, connected: false }, { status: 500 });
  }
}