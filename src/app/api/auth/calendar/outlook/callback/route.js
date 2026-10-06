import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '../../../../../../../lib/db'
import OutlookCalendarConnection from '../../../../../../../models/OutlookCalendarConnection'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(new URL('/settings?tab=calendar&error=outlook_failed', request.url))
  }

  try {
    await connectDB()

    // State se user ID verify karein
    let decodedState
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET)
    } catch (err) {
      return NextResponse.redirect(new URL('/settings?tab=calendar&error=invalid_state', request.url))
    }

    const userId = decodedState.userId

    const clientId = process.env.OUTLOOK_CLIENT_ID
    const clientSecret = process.env.OUTLOOK_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/calendar/outlook/callback`

    // Microsoft token exchange request
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Failed to obtain access token from Microsoft")
    }

    // Microsoft Graph API se user ki email fetch karein
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()
    const outlookEmail = userData.mail || userData.userPrincipalName

    if (!outlookEmail) {
      throw new Error("Outlook email could not be retrieved")
    }

    // Database mein save ya update karein
    await OutlookCalendarConnection.findOneAndUpdate(
      { userId: userId },
      {
        provider: "outlook",
        email: outlookEmail,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || "",
        connected: true,
      },
      { upsert: true, returnDocument: 'after' }
    )

    console.log("OUTLOOK CALENDAR SUCCESSFULLY CONNECTED & SAVED")

    return NextResponse.redirect(new URL('/settings?tab=calendar&success=outlook_connected', request.url))
  } catch (error) {
    console.error("Outlook callback error:", error)
    return NextResponse.redirect(new URL('/settings?tab=calendar&error=outlook_server_error', request.url))
  }
}