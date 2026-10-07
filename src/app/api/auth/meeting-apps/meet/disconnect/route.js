import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import MeetingIntegration from "@/models/MeetingIntegration";




export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await MeetingIntegration.findOneAndDelete({ 
      userId: decoded.userId, 
      provider: "google_meet" 
    });

    return NextResponse.json({ success: true, message: "Google Meet disconnected successfully." });
  } catch (error) {
    console.error("Google Meet Disconnect Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}