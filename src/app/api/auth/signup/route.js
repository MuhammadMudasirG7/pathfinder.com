import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { firstName, lastName, company, email, phone, timeZone, accountType, password, confirmPassword } = body;

        if (!firstName || !lastName || !company || !email || !phone || !accountType || !password || !confirmPassword) {
            return NextResponse.json(
                { success: false, message: "All Fields Are Required!" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { success: false, message: "Password Does Not Match!" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password Must Be At Least 6 Characters!" },
                { status: 400 }
            );
        }

        const cleanEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: cleanEmail });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email Already Registered!" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Dono jagah spelling theek kar di hai taake mismatch na ho
        const accountId = `PFAC${Date.now().toString().slice(-4)}`;
        
        const user = await User.create({
            firstName,
            lastName,
            company,
            email: cleanEmail,
            phone,
            timeZone,
            accountType,
            password: hashedPassword,
            termsAgreed: true,
            accountId,
            status: "active",
        });
        
        return NextResponse.json(
            {
                success: true,
                message: "Account Created Successfully!",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.log("SIGNUP ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Server error: " + error.message },
            { status: 500 }
        );
    }
}