import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '../../../../../../lib/db';
import EmailConnection from '../../../../../../models/EmailConnectionModel';

export async function POST(req) {
  try {
    await connectDB();

    // 1. Get JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (!decoded.userId) {
      return NextResponse.json({ success: false, message: "User ID not found" }, { status: 400 });
    }

    // 3. Delete connection
    await EmailConnection.findOneAndDelete({ userId: decoded.userId });

    return NextResponse.json({ 
      success: true, 
      message: "Email disconnected successfully" 
    });

  } catch (error) {
    console.error("Error disconnecting email:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}