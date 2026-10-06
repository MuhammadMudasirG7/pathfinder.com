import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const email = body.email?.toLowerCase().trim();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required!" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Email Not Found!" },
                { status: 400 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        user.resetOtp = otp;
        user.resetOtpExpire = otpExpire;
        user.otpVerified = false;
        await user.save();
        console.log("EMAIL:", email);
        console.log("OTP:", otp);
        // Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. This OTP will expire in 10 minutes.`
        });

        return NextResponse.json(
            { success: true, message: "OTP sent successfully!" },
            { status: 200 }
        );

    } catch (error) {
        console.log("FORGOT PASSWORD ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong!" },
            { status: 500 }
        );
    }
}