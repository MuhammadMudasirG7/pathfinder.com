import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../../../../lib/db';
import User from '../../../../../../../models/user';
import Security from '../../../../../../../models/securityModel';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        await connectDB();
        const { email, recoveryCode } = await request.json();

        if (!email || !recoveryCode) {
            return NextResponse.json({ success: false, message: "Email aur recovery code lazmi hain." }, { status: 400 });
        }

        const user = await User.findOne({ email, status: "active" });
        if (!user) {
            return NextResponse.json({ success: false, message: "Yeh email register nahi hai." }, { status: 404 });
        }

        const securityRecord = await Security.findOne({ userId: user._id });
        if (!securityRecord || !securityRecord.recoveryCodes.includes(recoveryCode)) {
            return NextResponse.json({ success: false, message: "Ghalat recovery code." }, { status: 400 });
        }

        // 1. Naya random password generate karein
        const rawNewPassword = Math.random().toString(36).slice(-8) + "Ab1@";
        const hashedPassword = await bcrypt.hash(rawNewPassword, 10);

        // 2. Database mein password update karein
        user.password = hashedPassword;
        await user.save();

        // 3. Nodemailer ke zariye Email bhejne ka setup
        const transporter = nodemailer.createTransport({
            service: 'gmail', // ya jo SMTP aap use kar rahe hain
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Recovery - Pathfinder ATS CRM',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6332c5;">Password Reset Request</h2>
                    <p>Password generated for your new Account:</p>
                    <div style="background: #f4f4f4; padding: 12px; font-size: 18px; font-weight: bold; text-align: center; border-radius: 6px; letter-spacing: 2px;">
                        ${rawNewPassword}
                    </div>
                    <p style="margin-top: 20px;">Is password ko use kar ke login karein aur foran apna password change kar lein.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "Naya password successfully aapki email par bhej diya gaya hai!"
        }, { status: 200 });

    } catch (error) {
        console.error("Email sending error:", error);
        return NextResponse.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
    }
}