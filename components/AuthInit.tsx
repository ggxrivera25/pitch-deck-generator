'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useStore } from '@/lib/store'

// Hydrates Zustand auth state from Supabase session on mount.
// Rendered once in the root layout — no UI output.
export function AuthInit() {
  const { setUser } = useStore()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user.id, session.user.email ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user.id ?? null, session?.user.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return null
}
