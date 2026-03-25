'use client'

import { cn } from '@/lib/utils'
import type { AppMode } from '@/lib/types'

interface ModeToggleProps {
  mode: AppMode
  onChange: (mode: AppMode) => void
  className?: string
  size?: 'sm' | 'md'
}

export function ModeToggle({ mode, onChange, className, size = 'md' }: ModeToggleProps) {
  return (
    <div className={cn(
      'flex items-center gap-1 bg-gray-100 rounded-xl p-1',
      className
    )}>
      <button
        onClick={() => onChange('solo')}
        className={cn(
          'rounded-lg font-medium transition-all duration-200',
          size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
          mode === 'solo'
            ? 'bg-white shadow-sm text-brand-700 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        🧑‍💻 Solo
      </button>
      <button
        onClick={() => onChange('workshop')}
        className={cn(
          'rounded-lg font-medium transition-all duration-200',
          size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
          mode === 'workshop'
            ? 'bg-white shadow-sm text-brand-700 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        🏫 Workshop
      </button>
    </div>
  )
}

// Mode description cards for the landing page
export function ModeCards({ mode, onChange }: { mode: AppMode; onChange: (m: AppMode) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={() => onChange('solo')}
        className={cn(
          'text-left p-5 rounded-2xl border-2 transition-all duration-200',
          mode === 'solo'
            ? 'border-brand-600 bg-brand-50'
            : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
        )}
      >
        <div className="text-2xl mb-2">🧑‍💻</div>
        <h3 className={cn(
          'font-semibold text-lg mb-1',
          mode === 'solo' ? 'text-brand-700' : 'text-gray-800'
        )}>
          Solo Mode
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Detailed guidance, examples, and tips for each question. Best for independent use — no rush.
        </p>
        {mode === 'solo' && (
          <span className="mt-2 inline-block text-xs font-semibold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
            Selected ✓
          </span>
        )}
      </button>

      <button
        onClick={() => onChange('workshop')}
        className={cn(
          'text-left p-5 rounded-2xl border-2 transition-all duration-200',
          mode === 'workshop'
            ? 'border-brand-600 bg-brand-50'
            : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
        )}
      >
        <div className="text-2xl mb-2">🏫</div>
        <h3 className={cn(
          'font-semibold text-lg mb-1',
          mode === 'workshop' ? 'text-brand-700' : 'text-gray-800'
        )}>
          Workshop Mode
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Concise prompts, faster flow. Designed for SBDC programs, university incubators, and live group sessions.
        </p>
        {mode === 'workshop' && (
          <span className="mt-2 inline-block text-xs font-semibold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
            Selected ✓
          </span>
        )}
      </button>
    </div>
  )
}
