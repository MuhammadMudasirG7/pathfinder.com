import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../../lib/db';
import User from '../../../../../models/user';


export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await connectDB();

        const user = await User.findById(decoded.userId);
        if (!user || user.status === 'disabled' || user.status === 'pending') {
            return NextResponse.json({ success: false, status: user?.status }, { status: 403 });
        }

        return NextResponse.json({ success: true, status: user.status }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}