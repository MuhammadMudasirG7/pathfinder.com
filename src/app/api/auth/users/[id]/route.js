import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';



import { connectDB } from '../../../../../../lib/db';
import User from '../../../../../../models/user';
import { logAction } from '../../audit-logs/route';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// DELETE USER
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json(
                { success: false, message: "User not found!" },
                { status: 404 }
            );
        }

        // Audit Log entry
        const fullName = `${deletedUser.firstName || ''} ${deletedUser.lastName || ''}`.trim() || deletedUser.email;
        await logAction(req, `deleted user ${fullName}`);

        return NextResponse.json(
            { success: true, message: "User deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// RESEND INVITE / COPY INVITE LINK / SEND ROLE (POST request)
export async function POST(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { action, role } = body;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found!" },
                { status: 404 }
            );
        }

        if (role) {
            user.role = role;
            await user.save();
        }

        const inviteToken = jwt.sign(
            { userId: user._id, purpose: "invite", role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host") || "localhost:3000";
        const inviteLink = `${protocol}://${host}/set-password?token=${inviteToken}`;

        if (action === "resend" || action === "invite") {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Invitation to join Pathfinder ATS CRM",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Hello ${user.name || 'User'},</h2>
                        <p>You have been invited to join Pathfinder ATS CRM with the role: <b>${user.role}</b>.</p>
                        <p>Click on the link below to set your password:</p>
                        <a href="${inviteLink}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Set Password</a>
                        <p style="margin-top: 20px; color: gray; font-size: 12px;">This link will expire after 24 hours.</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            
            // Audit Log entry
            await (req, `sent an invitation to ${user.email} with role ${user.role}`);
            
            return NextResponse.json(
                { success: true, message: "Invite sent successfully with role!" },
                { status: 200 }
            );
        }

        if (action === "copy-link") {
            await logAction(req, `copied the invite link for ${user.email}`);
            return NextResponse.json(
                { success: true, inviteLink, message: "Invite link generated successfully!" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Invalid action!" },
            { status: 400 }
        );

    } catch (error) {
        console.error("Invite action error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { action } = body; 

        let updateFields = {};

        if (action === "disable") {
            updateFields = { status: "disabled" };
        } else if (action === "reactivate") {
            updateFields = { status: "active" };
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid action!" },
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found!" },
                { status: 404 }
            );
        }

        // Audit Log entry
        const actionName = action === "disable" ? "disabled" : "reactivated";
        const fullName = `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.email;
        await logAction(req, `${actionName} user ${fullName}`);

        return NextResponse.json(
            { 
                success: true, 
                message: action === "disable" ? "User disabled successfully!" : "User reactivated successfully!",
                user: updatedUser 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("User status update error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}