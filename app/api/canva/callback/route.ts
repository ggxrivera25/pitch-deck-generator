import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const APP_URL = 'https://pitch-deck-generator.netlify.app'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${APP_URL}/output?error=canva_denied`)
  }

  const cookieStore = await cookies()
  const savedState = cookieStore.get('canva_oauth_state')?.value

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${APP_URL}/output?error=canva_auth_failed`)
  }

  // Exchange code for access token
  const tokenRes = await fetch('https://api.canva.com/rest/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.CANVA_REDIRECT_URI!,
      client_id: process.env.CANVA_CLIENT_ID!,
      client_secret: process.env.CANVA_CLIENT_SECRET!,
    }),
  })

  if (!tokenRes.ok) {
    console.error('Canva token exchange failed:', await tokenRes.text())
    return NextResponse.redirect(`${APP_URL}/output?error=canva_token_failed`)
  }

  const { access_token } = await tokenRes.json()

  cookieStore.delete('canva_oauth_state')
  cookieStore.set('canva_access_token', access_token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600, // 1 hour
    path: '/',
    sameSite: 'lax',
  })

  return NextResponse.redirect(`${APP_URL}/output?canva_ready=1`)
}
