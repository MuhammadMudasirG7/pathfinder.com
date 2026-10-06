import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user";
export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Please Login First" }, { status: 400 })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await connectDB();
        const user = await User.findById(decoded.userId)
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 400 })
        }
        return NextResponse.json({ success: true, user }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}
export async function PUT(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Please Login First" },
                { status: 400 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const body = await req.json();

        await connectDB();

        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 400 }
            );
        }

        if (body.firstName !== undefined) {
            user.firstName = body.firstName;
        }

        if (body.lastName !== undefined) {
            user.lastName = body.lastName;
        }

        if (body.email !== undefined) {
            user.email = body.email;
        }

        if (body.company !== undefined) {
            user.company = body.company;
        }

        if (body.phone !== undefined) {
            user.phone = body.phone;
        }

        if (body.jobTitle !== undefined) {
            user.jobTitle = body.jobTitle;
        }

        if (body.city !== undefined) {
            user.city = body.city;
        }

        if (body.state !== undefined) {
            user.state = body.state;
        }

        if (body.country !== undefined) {
            user.country = body.country;
        }

        if (body.currency !== undefined) {
            user.currency = body.currency;
        }

        if (body.companyWebsite !== undefined) {
            user.companyWebsite = body.companyWebsite;
        }
        if(body.profileImage !== undefined) {
            user.profileImage = body.profileImage
        }
        if(body.companyImage !== undefined) {
            user.companyImage = body.companyImage
        }

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Profile Updated Successfully",
                user
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("UPDATE PROFILE ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            { status: 500 }
        );
    }
}