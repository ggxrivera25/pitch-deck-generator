'use client'

import { cn } from '@/lib/utils'
import { QUESTIONS, SLIDE_ORDER } from '@/lib/questions'
import { SLIDE_NAMES, SLIDE_EMOJIS } from '@/lib/utils'
import { useAnswers, useCurrentIndex } from '@/lib/store'

interface ProgressBarProps {
  variant?: 'minimal' | 'detailed'
  className?: string
}

export function ProgressBar({ variant = 'minimal', className }: ProgressBarProps) {
  const currentIndex = useCurrentIndex()
  const answers = useAnswers()
  const currentQuestion = QUESTIONS[currentIndex]
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)

  if (variant === 'minimal') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-500">
            Question {currentIndex + 1} of {QUESTIONS.length}
          </span>
          <span className="text-brand-600 font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-brand-600 to-brand-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Slide {currentQuestion?.slideNumber}/12 — {currentQuestion?.slideTitle}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Overall progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Building your pitch deck
        </span>
        <span className="text-sm font-semibold text-brand-600">{progress}% complete</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5">
        <div
          className="bg-gradient-to-r from-brand-700 to-brand-400 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide dots */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {SLIDE_ORDER.map((slideId, index) => {
          const slideQuestions = QUESTIONS.filter(q => q.slideId === slideId)
          const answeredCount = slideQuestions.filter(q => answers[q.id]?.trim()).length
          const isCurrentSlide = currentQuestion?.slideId === slideId
          const isComplete = answeredCount === slideQuestions.length && slideQuestions.length > 0
          const isStarted = answeredCount > 0

          return (
            <div key={slideId} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200',
                  isCurrentSlide && 'ring-2 ring-brand-600 ring-offset-1',
                  isComplete ? 'bg-brand-600 text-white' :
                  isStarted ? 'bg-brand-100 text-brand-700' :
                  'bg-gray-100 text-gray-400'
                )}
                title={SLIDE_NAMES[slideId]}
              >
                {isComplete ? '✓' : index + 1}
              </div>
              <span className={cn(
                'text-[10px] max-w-[52px] text-center leading-tight',
                isCurrentSlide ? 'text-brand-600 font-medium' : 'text-gray-400'
              )}>
                {SLIDE_EMOJIS[slideId]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Compact slide indicator for the sidebar
export function SlideIndicator({ className }: { className?: string }) {
  const answers = useAnswers()
  const currentIndex = useCurrentIndex()
  const currentQuestion = QUESTIONS[currentIndex]

  return (
    <div className={cn('space-y-1', className)}>
      {SLIDE_ORDER.map((slideId, index) => {
        const slideQuestions = QUESTIONS.filter(q => q.slideId === slideId)
        const answeredCount = slideQuestions.filter(q => answers[q.id]?.trim()).length
        const isCurrentSlide = currentQuestion?.slideId === slideId
        const isComplete = answeredCount === slideQuestions.length && slideQuestions.length > 0
        const isStarted = answeredCount > 0

        return (
          <div
            key={slideId}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm',
              isCurrentSlide ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            <span className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
              isComplete ? 'bg-brand-600 text-white' :
              isStarted ? 'bg-brand-100 text-brand-600' :
              'bg-gray-100 text-gray-400'
            )}>
              {isComplete ? '✓' : index + 1}
            </span>
            <span className={cn(
              'truncate',
              isCurrentSlide && 'font-medium'
            )}>
              {SLIDE_EMOJIS[slideId]} {SLIDE_NAMES[slideId]}
            </span>
            {isStarted && !isComplete && (
              <span className="ml-auto text-xs text-brand-400 flex-shrink-0">
                {answeredCount}/{slideQuestions.length}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
