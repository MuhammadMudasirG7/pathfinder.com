import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../../../lib/db';
import User from '../../../../../../models/user';
import Role from '../../../../../../models/Role'; // Role model import kiya

export async function POST(request) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Please login first!' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const loggedInUser = await User.findById(decoded.userId);
        if (!loggedInUser) {
            return NextResponse.json({ success: false, error: 'Login user nahi mila.' }, { status: 404 });
        }

        const body = await request.json();
        const { firstName, lastName, email, team, jobTitle, contactNumber, timeZone, city, state, country, systemRoles, customRoles } = body;

        if (!firstName || !lastName || !email) {
            return NextResponse.json(
                { success: false, error: 'First Name, Last Name, and Email are required!' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User with this email already exists!' },
                { status: 400 }
            );
        }

        let finalSystemRole = 'Standard User';
        if (systemRoles?.superAdmin) finalSystemRole = 'Super Admin';
        else if (systemRoles?.administrator) finalSystemRole = 'Administrator';
        else if (systemRoles?.collaborator) finalSystemRole = 'Collaborator';

        // Custom role ko properly handle karna aur database mein count barhana
        let finalCustomRole = '';
        if (customRoles?.regionalAuditor) finalCustomRole = 'Regional Auditor';
        else if (customRoles?.talentPipeline) finalCustomRole = 'Talent Pipeline Manager';
        else if (customRoles?.externalVendor) finalCustomRole = 'External vendor Coordinator';
        else if (body.customRole) finalCustomRole = body.customRole; // Agar direct string aayi ho

        const dummyPassword = await bcrypt.hash('TemporaryPassword123', 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            company: loggedInUser.company || 'Default Company',
            accountType: 'Member',
            password: dummyPassword,
            phone: contactNumber || '',
            timeZone: timeZone || '(GMT +12:00) Pacific/Auckland',
            jobTitle: jobTitle || '',
            city: city || '',
            state: state || '',
            country: country || '',
            team: team === 'Select Team' ? 'Sales' : team,
            systemRoles: finalSystemRole,
            customRoles: finalCustomRole,
            status: 'pending',
            invitedBy: loggedInUser._id,
        });

        // Agar custom role diya gaya hai toh Role collection mein uska count +1 kar dein
        if (finalCustomRole) {
            await Role.findOneAndUpdate(
                { name: finalCustomRole },
                { $inc: { usersCount: 1 } }
            );
        }

        const inviteToken = jwt.sign(
            { userId: newUser._id, purpose: "invite", role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const loginLink = `${protocol}://${host}/set-password?token=${inviteToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const inviterName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `${inviterName} has invited you to join the platform`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <h2 style="color: #7c3aed;">Hello ${firstName} ${lastName},</h2>
                  <p><strong>${inviterName}</strong> has invited you to join our platform. Click the button below to complete your setup:</p>
                  <a href="${loginLink}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; font-weight: bold;">Accept Invitation</a>
                  <p style="font-size: 12px; color: #64748b; margin-top: 20px;">For security reasons, this link will expire after 24 hours.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: 'User invited and email sent successfully!', user: newUser },
            { status: 201 }
        );

    } catch (error) {
        console.error('CRITICAL INVITE API ERROR:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}