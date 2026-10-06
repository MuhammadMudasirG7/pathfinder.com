import { NextResponse } from 'next/server';
import User from '../../../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../../lib/db';
import crypto from "crypto";
import Activity from '../../../../../models/ActivityModel';
import Security from '../../../../../models/securityModel';

export async function POST(request) {
    try {
        const { email, password, location } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and Password both are required." },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) { 
            return NextResponse.json({ success: false, message: "Incorrect email or password." }, { status: 401 }); 
        }

        if (user.status === "disabled") {
            return NextResponse.json(
                { success: false, message: "🔒 Account Disabled — Please contact the administrator for assistance." },
                { status: 403 }
            );
        }

        if (user.status === "pending" || user.status === "expired") {
            return NextResponse.json(
                { success: false, message: "Aapka account active nahi hai. Pehle invite link se password set karein." },
                { status: 403 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { 
            return NextResponse.json({ success: false, message: "Ghalat email ya password." }, { status: 401 }); 
        }

        const securityRecord = await Security.findOne({ userId: user._id });
        const hasCodes = securityRecord && securityRecord.recoveryCodes && securityRecord.recoveryCodes.length > 0;

        if (hasCodes) {
            return NextResponse.json({
                success: true,
                requiresRecoveryCode: true,
                message: "Recovery code required"
            }, { status: 200 });
        }

        const sessionId = crypto.randomUUID();
        const token = jwt.sign({ userId: user._id, sessionId: sessionId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const userAgent = request.headers.get("user-agent") || "";

        let device = "Unknown";
        if (userAgent.includes("Windows")) device = "Windows";
        else if (userAgent.includes("Mac")) device = "Mac";
        else if (userAgent.includes("Android")) device = "Android";
        else if (userAgent.includes("iPhone")) device = "iPhone";
        else if (userAgent.includes("Linux")) device = "Linux";

        await Activity.create({
            userId: user._id,
            sessionId: sessionId,
            device: device,
            location: location,
            sessionStatus: "Active"
        });

        const response = NextResponse.json(
            {
                success: true, message: "Login Successful!",
                user: {
                    id: user._id,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    email: user.email,
                    role: user.role // Role response mein bhej diya gaya hai
                }
            }, { status: 200 }
        );

        response.cookies.set({
            name: 'token', value: token, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/',
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error: " + error.message },
            { status: 500 }
        );
    }
}