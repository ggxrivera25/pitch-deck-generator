import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ── Browser client (use in 'use client' components) ────────────────────────

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── Server client (use in Server Components / API Route Handlers) ──────────

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll can throw in read-only Server Component contexts —
            // the middleware handles refreshing the session instead
          }
        },
      },
    }
  )
}

// ── Database types ─────────────────────────────────────────────────────────

export interface PitchSession {
  id: string
  user_id: string
  mode: 'workshop' | 'solo'
  company_name: string | null
  answers: Record<string, string>
  branding: Record<string, unknown>
  generated: Record<string, unknown> | null
  created_at: string
  updated_at: string
}
