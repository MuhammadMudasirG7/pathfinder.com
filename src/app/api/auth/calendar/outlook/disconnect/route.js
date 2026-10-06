import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '../../../../../../../lib/db'
import OutlookCalendarConnection from '../../../../../../../models/OutlookCalendarConnection'


export async function POST() {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Database se connection delete kar dein
    await OutlookCalendarConnection.findOneAndDelete({ userId: decoded.userId })

    return NextResponse.json({ success: true, message: "Outlook Calendar disconnected successfully." })
  } catch (error) {
    console.error("Outlook Disconnect Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}