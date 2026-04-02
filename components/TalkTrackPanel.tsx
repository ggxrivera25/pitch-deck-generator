'use client'

import { useState } from 'react'
import { Copy, Check, Clock, FileText, Layers } from 'lucide-react'
import { cn, wordCount } from '@/lib/utils'
import type { PitchDeckSlide } from '@/lib/types'

const SLIDE_LABEL: Record<string, string> = {
  intro: 'Introduction', problem: 'The Problem', solution: 'Our Solution',
  product: 'Product', market: 'Market Size', businessModel: 'Business Model',
  traction: 'Traction', competition: 'Competition', gtm: 'Go-to-Market',
  financials: 'Financials', team: 'Team', ask: 'The Ask',
}

interface TalkTrackPanelProps {
  talkTrack?: string
  slides?: PitchDeckSlide[]
  quickImprovements: string[]
  coachNotes: string[]
}

export function TalkTrackPanel({ talkTrack, slides, quickImprovements, coachNotes }: TalkTrackPanelProps) {
  const hasOverallScript = !!talkTrack
  const hasPerSlide = !!(slides?.some(s => s.talkTrack))

  const defaultTab = hasPerSlide ? 'perslide' : hasOverallScript ? 'script' : 'improvements'
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'script' | 'perslide' | 'improvements' | 'coach'>(defaultTab as 'script' | 'perslide' | 'improvements' | 'coach')
  const [copiedSlide, setCopiedSlide] = useState<string | null>(null)

  const wc = talkTrack ? wordCount(talkTrack) : 0
  const estimatedMinutes = wc > 0 ? Math.round((wc / 130) * 10) / 10 : null

  const handleCopy = async () => {
    if (!talkTrack) return
    await navigator.clipboard.writeText(talkTrack)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopySlide = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSlide(id)
    setTimeout(() => setCopiedSlide(null), 2000)
  }

  const handleCopyAllSlides = async () => {
    if (!slides) return
    const text = slides
      .filter(s => s.talkTrack)
      .map((s, i) => `SLIDE ${i + 1}: ${s.title}\n${s.talkTrack}`)
      .join('\n\n---\n\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {hasPerSlide && (
          <TabButton
            active={activeTab === 'perslide'}
            onClick={() => setActiveTab('perslide')}
            icon={<Layers size={14} />}
            label="Per-Slide Scripts"
          />
        )}
        {hasOverallScript && (
          <TabButton
            active={activeTab === 'script'}
            onClick={() => setActiveTab('script')}
            icon={<FileText size={14} />}
            label="Full Script"
          />
        )}
        <TabButton
          active={activeTab === 'improvements'}
          onClick={() => setActiveTab('improvements')}
          icon={<span>⚡</span>}
          label={`Improvements (${quickImprovements.length})`}
          badgeColor="orange"
        />
        <TabButton
          active={activeTab === 'coach'}
          onClick={() => setActiveTab('coach')}
          icon={<span>🎓</span>}
          label={`Coach Notes (${coachNotes.length})`}
          badgeColor="blue"
        />
      </div>

      {/* Per-Slide Talk Tracks */}
      {activeTab === 'perslide' && slides && (
        <div>
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-500">30-60 second script per slide</p>
            <button
              onClick={handleCopyAllSlides}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {slides.filter(s => s.talkTrack).map((slide, i) => {
              const wc = wordCount(slide.talkTrack || '')
              const secs = Math.round((wc / 130) * 60)
              return (
                <div key={slide.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-2">
                        {i + 1}. {SLIDE_LABEL[slide.id] || slide.id}
                      </span>
                      <span className="text-xs text-gray-400">~{secs}s</span>
                    </div>
                    <button
                      onClick={() => handleCopySlide(slide.id, slide.talkTrack || '')}
                      className="flex-shrink-0 text-gray-400 hover:text-brand-600 transition-colors"
                    >
                      {copiedSlide === slide.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{slide.talkTrack}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Full Talk Track Script */}
      {activeTab === 'script' && talkTrack && (
        <div>
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {estimatedMinutes && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  ~{estimatedMinutes} min delivery
                </span>
              )}
              <span>{wc} words</span>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              {talkTrack.split('\n').map((paragraph, i) => {
                if (!paragraph.trim()) return <div key={i} className="h-3" />
                return (
                  <p key={i} className="text-gray-700 leading-relaxed mb-3">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Improvements */}
      {activeTab === 'improvements' && (
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            These are specific gaps and weak points identified in your pitch. Address these before presenting to investors.
          </p>
          <div className="space-y-3">
            {quickImprovements.map((improvement, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl"
              >
                <span className="text-orange-500 flex-shrink-0 mt-0.5">⚡</span>
                <p className="text-sm text-gray-700 leading-relaxed">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Notes */}
      {activeTab === 'coach' && (
        <div className="p-6">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
            <span>🎓</span>
            <p className="text-xs text-blue-700">
              These notes are for workshop facilitators. They identify risks, gaps, and questions to probe with the founder.
            </p>
          </div>
          <div className="space-y-3">
            {coachNotes.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl"
              >
                <span className="text-blue-500 flex-shrink-0 font-bold text-sm">{i + 1}.</span>
                <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badgeColor,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badgeColor?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-all border-b-2 whitespace-nowrap',
        active
          ? 'text-brand-700 border-brand-600 bg-brand-50/50'
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </button>
  )
}
