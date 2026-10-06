import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import EmailConnection from '../../../../../../models/EmailConnectionModel';
import { connectDB } from '../../../../../../lib/db';

export async function GET(req) {
  try {
    await connectDB();

    // 1. Get JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, connected: false }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, connected: false }, { status: 401 });
    }

    if (!decoded.userId) {
      return NextResponse.json({ success: false, connected: false }, { status: 400 });
    }

    // 3. Find connection in Database
    const connection = await EmailConnection.findOne({ userId: decoded.userId });

    if (connection && connection.connected) {
      return NextResponse.json({
        success: true,
        connected: true,
        email: connection.email,
        provider: connection.provider
      });
    }

    return NextResponse.json({ success: true, connected: false });
  } catch (error) {
    console.error("Error checking email status:", error);
    return NextResponse.json({ success: false, connected: false }, { status: 500 });
  }
}