'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, ChevronLeft, ChevronRight, SkipForward, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'
import type { AppMode } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  answer: string
  onAnswerChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onImprove: () => Promise<void>
  canGoNext: boolean
  canGoPrev: boolean
  isImprovingAnswer: boolean
  mode: AppMode
  improveError: string | null
  totalQuestions: number
  currentIndex: number
}

export function QuestionCard({
  question,
  answer,
  onAnswerChange,
  onNext,
  onPrev,
  onSkip,
  onImprove,
  canGoNext,
  canGoPrev,
  isImprovingAnswer,
  mode,
  improveError,
  totalQuestions,
  currentIndex,
}: QuestionCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showHelp, setShowHelp] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`
    }
  }, [answer])

  // Focus input on question change
  useEffect(() => {
    const el = question.inputType === 'text' ? inputRef.current : textareaRef.current
    el?.focus()
  }, [question.id])

  const helpText = mode === 'workshop' ? question.workshopHint : question.helpText

  return (
    <div className="w-full animate-slide-up">
      {/* Slide badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Slide {question.slideNumber}/12 — {question.slideTitle}
        </span>
        {!question.required && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            Optional
          </span>
        )}
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-snug">
        {question.question}
      </h2>

      {/* Help text toggle */}
      {helpText && (
        <div className="mb-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            {showHelp ? '▾ Hide tip' : '▸ Show tip'}
          </button>
          {showHelp && (
            <div className="mt-2 text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-4 leading-relaxed">
              {helpText}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        {question.inputType === 'text' ? (
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNext()
            }}
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
              'transition-all duration-200 text-base',
              'border-gray-200 bg-white'
            )}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
              'transition-all duration-200 text-base resize-none',
              'border-gray-200 bg-white leading-relaxed'
            )}
          />
        )}

        {/* Character hint */}
        {answer.length > 0 && (
          <div className="absolute bottom-2 right-3 text-xs text-gray-300 pointer-events-none">
            {answer.split(/\s+/).filter(Boolean).length} words
          </div>
        )}
      </div>

      {/* Improve my answer button */}
      <div className="mt-3">
        <button
          onClick={onImprove}
          disabled={isImprovingAnswer}
          className={cn(
            'flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200',
            'border border-brand-200 text-brand-600 bg-brand-50',
            'hover:bg-brand-100 hover:border-brand-300',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {isImprovingAnswer ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Improve my answer with AI
            </>
          )}
        </button>
        {improveError && (
          <p className="mt-2 text-xs text-red-500">{improveError}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={cn(
            'flex items-center gap-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
            canGoPrev
              ? 'text-gray-600 hover:bg-gray-100 border border-gray-200'
              : 'text-gray-300 cursor-not-allowed'
          )}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          {!question.required && (
            <button
              onClick={onSkip}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SkipForward size={14} />
              Skip
            </button>
          )}

          <button
            onClick={onNext}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
              'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
              'shadow-md shadow-brand-200 hover:shadow-lg hover:shadow-brand-300'
            )}
          >
            {currentIndex === totalQuestions - 1 ? 'Finish & Generate' : 'Next'}
            {currentIndex < totalQuestions - 1 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
