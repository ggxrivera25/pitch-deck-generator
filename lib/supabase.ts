import { createBrowserClient } from '@supabase/ssr'

// ── Browser client (use in 'use client' components) ────────────────────────

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
