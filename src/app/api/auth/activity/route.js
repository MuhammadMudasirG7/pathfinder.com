import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { connectDB } from "../../../../../lib/db";
import Activity from "../../../../../models/ActivityModel";
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) {
        return `${seconds} seconds ago`
    }
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} minutes ago`
    }
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours} hours ago`
    }
    const days = Math.floor(hours / 24)
    return `${days} days ago`
}
export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Pleas Login First" }, { status: 400 })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await connectDB();
        const activities = await Activity.find({ userId: decoded.userId, sessionStatus: "Active" }).sort({ createdAt: -1 })

        const sessions = activities.map((item, index) => ({
            id: item._id,
            sessionId: item.sessionId,
            device: item.device,
            time: timeAgo(item.createdAt),
            location: item.location,
            isCurrent: index === 0
        }))
        if (!activities) {
            return NextResponse.json({ success: false, message: "Activities of this user is not found!" }, { status: 400 })
        }
        return NextResponse.json({ success: true, sessions }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
export async function PUT(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Pleas Login First" }, { status: 400 })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await connectDB();
        const { sessionId } = await req.json()
        const activity = await Activity.findOneAndUpdate(
            { userId: decoded.userId, sessionId: sessionId },
            { sessionStatus: "Expired" },
            { new: true }
        )
        return NextResponse.json({ success: true, message: "Session Terminated Successfully!", activity }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}