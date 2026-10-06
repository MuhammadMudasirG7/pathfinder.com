import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "../../../../../../../lib/db";
import GoogleCalendarConnection from "../../../../../../../models/GoogleCalendarConnection";


export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // Database se connection delete ya update kar dein
    await GoogleCalendarConnection.findOneAndDelete({ userId: decoded.userId });

    return NextResponse.json({ success: true, message: "Disconnected successfully" });
  } catch (error) {
    console.error("Disconnect Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}