'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Zap, ChevronDown, ChevronUp, Layout } from 'lucide-react'
import { useStore, useGenerated, useBranding, useAnswers, useMode } from '@/lib/store'
import { SlideCard } from '@/components/SlideCard'
import { TalkTrackPanel } from '@/components/TalkTrackPanel'
import { ExportButtons } from '@/components/ExportButtons'
import { ModeToggle } from '@/components/ModeToggle'

type OutputTab = 'deck' | 'talktrack'

export default function OutputPage() {
  const router = useRouter()
  const generated = useGenerated()
  const branding = useBranding()
  const answers = useAnswers()
  const mode = useMode()
  const { setMode, setIsGenerating, setGenerated, setGenerationError } = useStore()

  const [activeTab, setActiveTab] = useState<OutputTab>('deck')
  const [allExpanded, setAllExpanded] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const companyName = answers.company_name || 'Your Company'

  // Redirect if no generated output
  useEffect(() => {
    if (!generated) {
      router.push('/questionnaire')
    }
  }, [generated, router])

  if (!generated) return null

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, branding, mode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated(data)
    } catch (err) {
      console.error('Regeneration error:', err)
      alert(err instanceof Error ? err.message : 'Failed to regenerate. Please try again.')
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back */}
          <button
            onClick={() => router.push('/questionnaire')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Company name */}
          <div className="flex items-center gap-2">
            {branding.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo} alt="Logo" className="h-7 w-auto object-contain" />
            ) : (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: branding.colors[0] || '#7C3AED' }}
              >
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-gray-800 text-sm truncate max-w-[160px]">
              {companyName}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 mx-auto">
            <button
              onClick={() => setActiveTab('deck')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'deck'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layout size={14} />
              Pitch Deck
            </button>
            <button
              onClick={() => setActiveTab('talktrack')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'talktrack'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🎤 Talk Track
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <ModeToggle mode={mode} onChange={setMode} size="sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {activeTab === 'deck' ? '12-Slide Pitch Deck' : 'Talk Track & Script'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeTab === 'deck'
                ? `${generated.slides.length} slides with design notes • Click any slide to expand`
                : 'Full script + improvements + coach notes'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ExportButtons
              output={generated}
              branding={branding}
              companyName={companyName}
            />
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm border border-brand-200 text-brand-600 bg-brand-50 hover:bg-brand-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRegenerating ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <Zap size={14} />
              )}
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>

        {/* Pitch Deck Tab */}
        {activeTab === 'deck' && (
          <div>
            {/* Color palette preview */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500">Brand palette:</span>
              <div className="flex gap-2">
                {branding.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-xs text-gray-400 font-mono hidden sm:inline">{c}</span>
                  </div>
                ))}
              </div>
              {branding.fonts.length > 0 && (
                <span className="text-xs text-gray-400 ml-auto hidden sm:block">
                  Fonts: {branding.fonts.join(', ')}
                </span>
              )}
              <button
                onClick={() => setAllExpanded(!allExpanded)}
                className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {allExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            {/* Slides grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {generated.slides.map((slide, i) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  index={i}
                  branding={branding}
                  isExpanded={allExpanded}
                />
              ))}
            </div>

            {/* Quick improvements inline */}
            {generated.quickImprovements.length > 0 && (
              <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  ⚡ Quick Improvements
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-normal">
                    {generated.quickImprovements.length} items
                  </span>
                </h3>
                <div className="space-y-2">
                  {generated.quickImprovements.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-amber-700">
                      <span className="font-bold flex-shrink-0">{i + 1}.</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => router.push('/questionnaire')}
                    className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    <Edit2 size={14} />
                    Go back and improve my answers
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Talk Track Tab */}
        {activeTab === 'talktrack' && (
          <TalkTrackPanel
            talkTrack={generated.talkTrack}
            quickImprovements={generated.quickImprovements}
            coachNotes={generated.coachNotes}
          />
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <p>Generated with Claude AI • PitchDeck Generator</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/questionnaire')}
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
              <Edit2 size={13} />
              Edit answers
            </button>
            <button
              onClick={() => router.push('/')}
              className="hover:text-gray-600 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
