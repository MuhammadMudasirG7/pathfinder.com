import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Team from "../../../../../models/Team";
import { connectDB } from "../../../../../lib/db";

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch {
        return null;
    }
}
export async function GET() {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please login first." },
                { status: 401 }
            );
        }

        await connectDB();

        const teams = await Team.find({ userId })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: teams
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// POST: Nayi team create karo
export async function POST(request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Please login first." },
                { status: 401 }
            );
        }

        const body = await request.json();

        if (!body.name || !body.name.trim()) {
            return NextResponse.json(
                { success: false, message: "Team name is required." },
                { status: 400 }
            );
        }

        // Members array na ho to empty array use karo
        const members = Array.isArray(body.members)
            ? body.members
            : [];

        // Member initials khud generate kar lo
        const formattedMembers = members.map((member) => ({
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

        await connectDB();

        const newTeam = await Team.create({
            userId,
            name: body.name.trim(),
            subtitle: body.subtitle || "",
            isOpen: body.isOpen ?? true,
            status: body.status || "Active",

            stats: {
                members: formattedMembers.length,
                openJobs: 0,
                closedJobs: 0,
                archivedJobs: 0
            },

            members: formattedMembers
        });

        return NextResponse.json(
            {
                success: true,
                message: "Team created successfully.",
                data: newTeam
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}