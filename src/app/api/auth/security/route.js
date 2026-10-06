import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "../../../../../lib/db"
import Security from "../../../../../models/securityModel"
import User from "../../../../../models/user"

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value
        if (!token) {
            return NextResponse.json({ success: false, message: "Please Login First" }, { status: 400 })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await connectDB();
        const user = await User.findById(decoded.userId)
        if (!user) {
            return NextResponse.json({ success: false, message: "User Not Found!" }, { status: 400 })
        }
        let security = await Security.findOne({
            userId: decoded.userId
        })
        if (!security) {
            security = await Security.create({
                userId: decoded.userId
            })
        }
        return NextResponse.json({
            success: true, security: {
                email: user.email,
                phoneNumber: security.phoneNumber,
                alternateEmails: security.alternateEmails,
                authenticator: security.authenticator,
                signInAlert: security.signInAlert,
                thirdPartyAccess: security.thirdPartyAccess,
                newsLetter: security.newsLetter
            }
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
export async function PUT(req) {
    try {
        const token = req.cookies.get("token")?.value
        if (!token) {
            return NextResponse.json({success:false, message:"Please login First"},{status:400})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        await connectDB()
        const body = await req.json();
        let security = await Security.findOne({
            userId:decoded.userId
        })
        if (!security) {
            security = await Security.create({
                userId:decoded.userId
            })
        }
        if (body.phone !== undefined) {
            security.phoneNumber = body.phone
        }
        if (body.alternateEmails !== undefined) {
            security.alternateEmails = body.alternateEmails
        }
        await security.save()
        return NextResponse.json({success:true, message:"Security setting updated Successfully "},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false, message:error.message},{status:500})
    }
}
