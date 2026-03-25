import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// POST /api/sessions — save or update a session
export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { sessionId, answers, branding, generated, mode, companyName } = await req.json()

    if (sessionId) {
      // Update existing session
      const { data, error } = await supabase
        .from('pitch_sessions')
        .update({ answers, branding, generated, mode, company_name: companyName })
        .eq('id', sessionId)
        .eq('user_id', user.id)  // ensure ownership
        .select('id')
        .single()

      if (error) {
        console.error('Update session error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ id: data.id })
    } else {
      // Insert new session
      const { data, error } = await supabase
        .from('pitch_sessions')
        .insert({
          user_id: user.id,
          answers,
          branding,
          generated,
          mode,
          company_name: companyName,
        })
        .select('id')
        .single()

      if (error) {
        console.error('Insert session error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ id: data.id })
    }
  } catch (error) {
    console.error('Sessions POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/sessions — list the current user's sessions (newest first)
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('pitch_sessions')
      .select('id, company_name, mode, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sessions: data })
  } catch (error) {
    console.error('Sessions GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
