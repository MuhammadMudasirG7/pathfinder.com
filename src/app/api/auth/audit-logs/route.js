import { NextResponse } from 'next/server';


import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../../lib/db';
import User from '../../../../../models/user';
import AuditLog from '../../../../../models/AuditLog';



// GET: Saare audit logs fetch karne ke liye
export async function GET() {
    try {
        await connectDB();
        const logs = await AuditLog.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, logs }, { status: 200 });
    } catch (error) {
        console.error("Fetch audit logs error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// Helper function jo cookies se logged-in user nikal kar audit log save karega
export async function logAction(req, actionText) {
    try {
        await connectDB();
        const token = req.cookies.get('token')?.value;
        if (!token) return;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return;

        const firstName = user.firstName || "Admin";
        const lastName = user.lastName || "";
        const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
        
        const fullName = `${firstName} ${lastName}`.trim();
        const fullText = `${fullName} ${actionText}`;

        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedDate = today.toLocaleString('en-US', options);

        await AuditLog.create({
            user: user._id,
            avatar: initials,
            text: fullText,
            date: formattedDate
        });
    } catch (error) {
        console.error("Audit log error:", error);
    }
}