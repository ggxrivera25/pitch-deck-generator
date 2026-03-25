'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Palette, Eye, Info } from 'lucide-react'
import { cn, SLIDE_NAMES, SLIDE_EMOJIS, getContrastColor } from '@/lib/utils'
import type { PitchDeckSlide } from '@/lib/types'
import type { BrandingProfile } from '@/lib/types'

interface SlideCardProps {
  slide: PitchDeckSlide
  index: number
  branding: BrandingProfile
  isExpanded?: boolean
}

export function SlideCard({ slide, index, branding, isExpanded: initialExpanded = true }: SlideCardProps) {
  const [showDesignNotes, setShowDesignNotes] = useState(false)
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  const primaryColor = branding.colors[0] || '#7C3AED'
  const secondaryColor = branding.colors[1] || '#5B21B6'
  const textOnPrimary = getContrastColor(primaryColor)

  // Render markdown table if present in bullet text
  const renderBullet = (bullet: string) => {
    if (bullet.includes('|') && bullet.includes('---')) {
      // It's a markdown table
      const lines = bullet.trim().split('\n')
      const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean)
      const rows = lines.slice(2).map(row => row.split('|').map(c => c.trim()).filter(Boolean))
      return (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-3 py-2 text-xs font-semibold text-white rounded-t"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-gray-700 border-b border-gray-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    // Regular bullet point
    return (
      <li className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
        <span
          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        />
        {bullet}
      </li>
    )
  }

  // Check if any bullet is a table
  const hasTable = slide.bullets.some(b => b.includes('|') && b.includes('---'))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200">
      {/* Slide header */}
      <div
        className="px-5 py-4 flex items-center justify-between cursor-pointer select-none"
        style={{ backgroundColor: `${primaryColor}10`, borderBottom: `2px solid ${primaryColor}25` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: primaryColor, color: textOnPrimary }}
          >
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{SLIDE_EMOJIS[slide.id]}</span>
              <h3 className="font-semibold text-gray-900">{slide.title}</h3>
            </div>
            <p className="text-xs text-gray-500">{SLIDE_NAMES[slide.id]}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5">
          {/* Bullets */}
          <div className="mb-4">
            {hasTable ? (
              <div>
                {slide.bullets.map((bullet, i) => {
                  if (bullet.includes('|') && bullet.includes('---')) {
                    return <div key={i}>{renderBullet(bullet)}</div>
                  }
                  return (
                    <ul key={i} className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: primaryColor }}
                        />
                        {bullet}
                      </li>
                    </ul>
                  )
                })}
              </div>
            ) : (
              <ul className="space-y-2">
                {slide.bullets.map((bullet, i) => (
                  <div key={i}>{renderBullet(bullet)}</div>
                ))}
              </ul>
            )}
          </div>

          {/* Suggested visual */}
          <div className="flex items-start gap-2 p-3 bg-sky-50 border border-sky-100 rounded-xl mb-4">
            <Eye size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-sky-700 mb-0.5">Suggested Visual</p>
              <p className="text-xs text-sky-600 leading-relaxed">{slide.suggestedVisual}</p>
            </div>
          </div>

          {/* Design notes toggle */}
          <button
            onClick={() => setShowDesignNotes(!showDesignNotes)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all',
              showDesignNotes
                ? 'bg-violet-50 text-violet-700'
                : 'bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-600'
            )}
          >
            <span className="flex items-center gap-2">
              <Palette size={14} />
              Design & Branding Notes
            </span>
            {showDesignNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDesignNotes && (
            <div className="mt-3 p-4 bg-violet-50 border border-violet-100 rounded-xl space-y-3 animate-fade-in">
              <DesignNoteRow
                icon="📐"
                label="Layout"
                value={slide.designNotes.layout}
              />
              <DesignNoteRow
                icon="🎨"
                label="Color Usage"
                value={slide.designNotes.colorUsage}
                colors={branding.colors}
              />
              <DesignNoteRow
                icon="✍️"
                label="Font Hierarchy"
                value={slide.designNotes.fontHierarchy}
              />
              <DesignNoteRow
                icon="🏷️"
                label="Logo Placement"
                value={slide.designNotes.logoPlacement}
              />
              <DesignNoteRow
                icon="✨"
                label="Visual Style"
                value={slide.designNotes.visualStyle}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DesignNoteRow({
  icon,
  label,
  value,
  colors,
}: {
  icon: string
  label: string
  value: string
  colors?: string[]
}) {
  return (
    <div className="text-xs">
      <div className="flex items-center gap-1.5 mb-1">
        <span>{icon}</span>
        <span className="font-semibold text-violet-700">{label}</span>
        {colors && colors.length > 0 && (
          <div className="flex gap-1 ml-1">
            {colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-violet-600 leading-relaxed pl-5">{value}</p>
    </div>
  )
}

// Compact slide preview for overview
export function SlidePreview({
  slide,
  index,
  branding,
  onClick,
}: {
  slide: PitchDeckSlide
  index: number
  branding: BrandingProfile
  onClick: () => void
}) {
  const primaryColor = branding.colors[0] || '#7C3AED'
  const textOnPrimary = getContrastColor(primaryColor)

  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-brand-200 transition-all duration-200"
    >
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="text-xs font-bold" style={{ color: textOnPrimary }}>
          {index + 1}
        </span>
        <span className="text-xs font-medium truncate" style={{ color: textOnPrimary }}>
          {slide.title}
        </span>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {slide.bullets[0]}
        </p>
      </div>
    </button>
  )
}
