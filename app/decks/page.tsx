'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Trash2, Loader2, PlusCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useStore } from '@/lib/store'

interface SessionSummary {
  id: string
  company_name: string | null
  mode: string
  created_at: string
  updated_at: string
}

export default function DecksPage() {
  const router = useRouter()
  const { setUser } = useStore()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      setUser(session.user.id, session.user.email ?? null)

      const res = await fetch('/api/sessions')
      const data = await res.json()
      if (res.ok) setSessions(data.sessions || [])
      setLoading(false)
    }
    init()
  }, [router, setUser])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this deck? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null, null)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="text-brand-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">P</span>
              </div>
              <h1 className="font-bold text-gray-900">My Decks</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/questionnaire')}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              <PlusCircle size={16} />
              New deck
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No saved decks yet.</p>
            <button
              onClick={() => router.push('/questionnaire')}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors mx-auto"
            >
              <PlusCircle size={16} />
              Create your first pitch deck
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center font-bold text-brand-700 text-sm flex-shrink-0">
                  {(session.company_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {session.company_name || 'Untitled deck'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {session.mode} mode •{' '}
                    {new Date(session.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(`/decks/${session.id}`)}
                    className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-all"
                  >
                    <ExternalLink size={14} />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    disabled={deletingId === session.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    {deletingId === session.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
