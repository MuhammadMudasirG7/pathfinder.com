import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const clientId = process.env.OUTLOOK_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/calendar/outlook/callback`
    
    // State token generate karein user ID ke sath taake callback mein session loss na ho
    const stateToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '10m' })

    const scopes = "Calendars.ReadWrite offline_access User.Read"
    const microsoftAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scopes)}&state=${stateToken}`

    return NextResponse.redirect(microsoftAuthUrl)
  } catch (error) {
    console.error("Outlook Initiate Error:", error)
    return NextResponse.redirect(new URL('/settings?tab=calendar&error=outlook_failed', request.url))
  }
}