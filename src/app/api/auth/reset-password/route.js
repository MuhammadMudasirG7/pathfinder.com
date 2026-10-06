import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Role from "../../../../../models/Role";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { newPassword, confirmPassword, token: bodyToken } = body;

        const { searchParams } = new URL(req.url);
        const queryToken = searchParams.get("token");

        const token = bodyToken || queryToken;
        console.log("Backend received token:", token);

        if (!newPassword || !confirmPassword) {
            return NextResponse.json(
                { success: false, message: "All Fields Are Required!" },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { success: false, message: "Password Does Not Match!" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password Must Be At Least 6 Characters!" },
                { status: 400 }
            );
        }

        if (!token) {
            return NextResponse.json(
                { success: false, message: "You Are Not Authorized!" },
                { status: 401 }
            );
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== "password-reset" && decoded.purpose !== "invite") {
            return NextResponse.json(
                { success: false, message: "Invalid Reset Token!" },
                { status: 401 }
            );
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User Not Found!" },
                { status: 404 }
            );
        }

        if (decoded.purpose === "password-reset" && !user.otpVerified) {
            return NextResponse.json(
                { success: false, message: "Please Verify OTP First!" },
                { status: 401 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const wasPending = user.status === "pending";

        user.password = hashedPassword;
        user.otpVerified = false;
        user.status = "active";
        
        if (decoded.role) {
            user.role = decoded.role;
        }

        await user.save();

        if (wasPending && user.role) {
            await Role.findOneAndUpdate(
                { name: user.role },
                { $inc: { usersCount: 1 } }
            );
        }

        const response = NextResponse.json(
            { success: true, message: "Password Set Successfully!" },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("Password setup error:", error);
        return NextResponse.json(
            { success: false, message: "Invalid Or Expired Reset Token!" },
            { status: 401 }
        );
    }
}