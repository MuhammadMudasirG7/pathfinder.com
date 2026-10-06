import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../lib/db";
import Team from "../../../../../../models/Team";

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId || null;
    } catch {
        return null;
    }
}

// PUT: Team update karo
export async function PUT(request, { params }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Please login first." },
                { status: 401 }
            );
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid team ID." },
                { status: 400 }
            );
        }

        const body = await request.json();

        if (!body.name || !body.name.trim()) {
            return NextResponse.json(
                { success: false, message: "Team name is required." },
                { status: 400 }
            );
        }

        if (!Array.isArray(body.members)) {
            return NextResponse.json(
                { success: false, message: "Members must be an array." },
                { status: 400 }
            );
        }

        await connectDB();

        const members = body.members.map((member) => ({
            name: member.name,
            job: member.job || "Not Available",
            initials: member.initials ||
                member.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2),
            role: member.role === "Administrator"
                ? "Administrator"
                : "Member",
            status: member.status || body.status || "Active"
        }));

        const updatedTeam = await Team.findOneAndUpdate(
            {
                _id: id,
                userId: decoded.userId
            },
            {
                $set: {
                    name: body.name.trim(),
                    subtitle: body.subtitle || "",
                    status: body.status || "Active",
                    members,
                    "stats.members": members.length
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTeam) {
            return NextResponse.json(
                { success: false, message: "Team not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Team updated successfully.",
            data: updatedTeam
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Team delete karo
export async function DELETE(request, { params }) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please login first." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid team ID." },
                { status: 400 }
            );
        }

        await connectDB();

        const deletedTeam = await Team.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deletedTeam) {
            return NextResponse.json(
                { success: false, message: "Team not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Team deleted successfully."
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}