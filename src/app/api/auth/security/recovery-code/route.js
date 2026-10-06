import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import { connectDB } from "../../../../../../lib/db";
import Security from "../../../../../../models/securityModel";


export async function POST(req) {
    try {
        await connectDB();
        
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Please Login First" }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const recoveryCodes = [];
        for (let i = 0; i < 8; i++) {
            const codes = crypto.randomBytes(4).toString("hex").toUpperCase();
            // Format to look like XXXX-XXXX if desired, or keep as hex:
            const formattedCode = `${codes.slice(0, 4)}-${codes.slice(4)}`;
            recoveryCodes.push(formattedCode);
        }

        const security = await Security.findOneAndUpdate(
            { userId: decoded.userId },
            { recoveryCodes: recoveryCodes },
            { new: true, upsert: true }
        );

        return NextResponse.json({ 
            success: true, 
            message: "Recovery codes created successfully", 
            recoveryCodes: security.recoveryCodes 
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}