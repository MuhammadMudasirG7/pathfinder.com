import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '../../../../../../../lib/db'
import OutlookCalendarConnection from '../../../../../../../models/OutlookCalendarConnection'

export async function GET() {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ success: false, connected: false, message: "Unauthorized" }, { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ success: false, connected: false, message: "Invalid token" }, { status: 401 })
    }

    const connection = await OutlookCalendarConnection.findOne({ userId: decoded.userId })

    if (!connection || !connection.connected) {
      return NextResponse.json({ success: true, connected: false })
    }

    return NextResponse.json({
      success: true,
      connected: true,
      email: connection.email
    })
  } catch (error) {
    console.error("Outlook Status Error:", error)
    return NextResponse.json({ success: false, connected: false }, { status: 500 })
  }
}