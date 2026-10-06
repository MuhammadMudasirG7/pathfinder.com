import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "../../../../../lib/db"
import Notification from "../../../../../models/notificationModel"

export async function GET(req) {
    try {
        console.log("ALL COOKIES:", req.cookies.getAll())
        const token = req.cookies.get("token")?.value
        console.log("TOKEN:", token)
        if (!token) {
            return NextResponse.json({ success: false, message: "Please Login First" }, { status: 400 })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await connectDB();

        let notification = await Notification.findOne({
            userId: decoded.userId
        })

        if (!notification) {
            notification = await Notification.create({
                userId: decoded.userId
            })
        }

        return NextResponse.json({ success: true, notification: notification }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const token = req.cookies.get("token")?.value
        if (!token) {
            return NextResponse.json({ success: false, message: "Please Login First!" }, { status: 400 })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await connectDB();

        const body = await req.json()

        let notification = await Notification.findOne({ userId: decoded.userId })

        // 🛠️ Yahan change kiya hai: notification.create ki jagah Notification.create aur sath 'await' lagaya hai
        if (!notification) {
            notification = await Notification.create({
                userId: decoded.userId
            })
        }

        if(body.enabled !== undefined) {
            notification.doNotDisturb.enabled = body.enabled
        }
        if(body.fromTime !== undefined) {
            notification.doNotDisturb.fromTime = body.fromTime
        }
        if(body.toTime !== undefined) {
            notification.doNotDisturb.toTime = body.toTime
        }
        if(body.daysOff !== undefined) {
            notification.daysOff = body.daysOff
        }
        if(body.emailNotifications !== undefined) {
            notification.emailNotifications = body.emailNotifications
        }

        await notification.save();

        return NextResponse.json({ success: true, notification: notification, message: "Notification Setting Updated Successfully !" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}