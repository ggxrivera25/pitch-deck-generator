import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ── Server client (use in API Route Handlers / Server Components only) ─────

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
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
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
