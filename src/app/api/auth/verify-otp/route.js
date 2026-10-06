import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: "All Fields Are Required!" },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User Not Found!" },
                { status: 400 }
            );
        }

        if (!user.resetOtp) {
            return NextResponse.json(
                { success: false, message: "OTP Not Found. Please Request A New OTP!" },
                { status: 400 }
            );
        }

        const enteredOtp = otp.toString().trim();

        if (!user.resetOtpExpire || new Date(user.resetOtpExpire) < new Date()) {
            return NextResponse.json(
                { success: false, message: "OTP Has Expired!" },
                { status: 400 }
            );
        }

        if (user.resetOtp.toString().trim() !== enteredOtp) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP!" },
                { status: 400 }
            );
        }

        user.otpVerified = true;
        user.resetOtp = null;
        user.resetOtpExpire = null;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                purpose: "password-reset"
            },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        const response = NextResponse.json(
            { success: true, message: "OTP Verified Successfully!" },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 10 * 60,
            path: "/"
        });

        return response;

    } catch (error) {
        console.log("VERIFY OTP ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Server error: " + error.message },
            { status: 500 }
        );
    }
}