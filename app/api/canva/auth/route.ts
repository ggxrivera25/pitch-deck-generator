import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_URL = 'https://pitch-deck-generator.netlify.app'

export async function GET() {
  const cookieStore = await cookies()

  // If already authenticated, skip OAuth
  const existing = cookieStore.get('canva_access_token')?.value
  if (existing) {
    return NextResponse.redirect(`${APP_URL}/output?canva_ready=1`)
  }

  const state = crypto.randomBytes(16).toString('hex')

  cookieStore.set('canva_oauth_state', state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: '/',
    sameSite: 'lax',
  })

  const params = new URLSearchParams({
    client_id: process.env.CANVA_CLIENT_ID!,
    redirect_uri: process.env.CANVA_REDIRECT_URI!,
    scope: 'design:content:write asset:write',
    response_type: 'code',
    state,
  })

  return NextResponse.redirect(
    `https://www.canva.com/api/oauth/authorize?${params}`
  )
}
