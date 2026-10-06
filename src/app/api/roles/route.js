import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Role from "../../../../models/Role";
import User from "../../../../models/user";

export async function GET() {
    try {
        await connectDB();
        
        // 1. Role collection se roles fetch karein
        let roles = await Role.find({}).lean();

        // 2. Users collection se bhi custom roles check karein taake koi role miss na ho
        const users = await User.find({ customRoles: { $exists: true,$ne: "" } }).lean();
        
        const roleMap = new Map();
        roles.forEach(r => roleMap.set(r.name, r));

        // Users ke custom roles ko map mein check aur update karein
        for (const user of users) {
            const cRole = user.customRoles;
            if (cRole) {
                const count = await User.countDocuments({ customRoles: cRole });
                
                if (roleMap.has(cRole)) {
                    const existing = roleMap.get(cRole);
                    existing.usersCount = count;
                } else {
                    // Agar role collection mein nahi hai toh dynamically list mein add kar dein
                    roleMap.set(cRole, {
                        _id: cRole,
                        name: cRole,
                        description: "Custom role assigned during user invitation",
                        creator: "System",
                        date: new Date().toLocaleDateString(),
                        usersCount: count
                    });
                }
            }
        }

        const finalRoles = Array.from(roleMap.values());

        return NextResponse.json({ success: true, roles: finalRoles }, { status: 200 });
    } catch (error) {
        console.error("Fetch roles error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Naya Custom Role banane ke liye
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, description, creator } = body;

        if (!name || !description) {
            return NextResponse.json(
                { success: false, message: "Role name and description are required!" },
                { status: 400 }
            );
        }

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

        const newRole = await Role.create({
            name,
            description,
            creator: creator || "John Doe",
            date: formattedDate,
            usersCount: 0
        });

        return NextResponse.json(
            { success: true, message: "Custom role created successfully!", role: newRole },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create role error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}