'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppMode, AppState, BrandingProfile, GeneratedOutput } from './types'
import { defaultBranding } from './types'

// Extended state with Supabase session/user info (not persisted to localStorage)
export interface AuthState {
  userId: string | null
  userEmail: string | null
  sessionId: string | null   // Supabase pitch_sessions.id after saving
}
import { QUESTIONS } from './questions'

interface StoreActions {
  // Mode
  setMode: (mode: AppMode) => void

  // Branding
  setBranding: (branding: Partial<BrandingProfile>) => void
  resetBranding: () => void

  // Answers
  setAnswer: (questionId: string, answer: string) => void
  clearAnswer: (questionId: string) => void

  // Navigation
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (index: number) => void

  // Generation
  setGenerated: (output: GeneratedOutput) => void
  setIsGenerating: (val: boolean) => void
  setGenerationError: (error: string | null) => void

  // Auth (set by auth page, not persisted)
  setUser: (userId: string | null, email: string | null) => void
  setSessionId: (id: string | null) => void

  // Reset
  reset: () => void
  resetAnswers: () => void
}

type Store = AppState & AuthState & StoreActions

const initialState: AppState & AuthState = {
  mode: 'solo',
  branding: defaultBranding,
  answers: {},
  currentQuestionIndex: 0,
  generated: null,
  isGenerating: false,
  generationError: null,
  userId: null,
  userEmail: null,
  sessionId: null,
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMode: (mode) => set({ mode }),

      setBranding: (partial) =>
        set((state) => ({
          branding: { ...state.branding, ...partial },
        })),

      resetBranding: () => set({ branding: defaultBranding }),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),

      clearAnswer: (questionId) =>
        set((state) => {
          const { [questionId]: _, ...rest } = state.answers
          return { answers: rest }
        }),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            QUESTIONS.length - 1
          ),
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      goToQuestion: (index) =>
        set({
          currentQuestionIndex: Math.max(0, Math.min(index, QUESTIONS.length - 1)),
        }),

      setGenerated: (output) => set({ generated: output, isGenerating: false, generationError: null }),

      setIsGenerating: (val) => set({ isGenerating: val }),

      setGenerationError: (error) => set({ generationError: error, isGenerating: false }),

      setUser: (userId, email) => set({ userId, userEmail: email }),

      setSessionId: (id) => set({ sessionId: id }),

      reset: () => set(initialState),

      resetAnswers: () =>
        set({
          answers: {},
          currentQuestionIndex: 0,
          generated: null,
          generationError: null,
        }),
    }),
    {
      name: 'pitch-deck-store',
      // Only persist these fields (not transient state)
      partialize: (state) => ({
        mode: state.mode,
        branding: state.branding,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        generated: state.generated,
        sessionId: state.sessionId,
        // userId/userEmail intentionally NOT persisted — re-read from Supabase on load
      }),
    }
  )
)

// Selectors
export const useMode = () => useStore((s) => s.mode)
export const useBranding = () => useStore((s) => s.branding)
export const useAnswers = () => useStore((s) => s.answers)
export const useCurrentQuestion = () =>
  useStore((s) => QUESTIONS[s.currentQuestionIndex])
export const useCurrentIndex = () => useStore((s) => s.currentQuestionIndex)
export const useGenerated = () => useStore((s) => s.generated)
export const useIsGenerating = () => useStore((s) => s.isGenerating)
export const useGenerationError = () => useStore((s) => s.generationError)
export const useUserId = () => useStore((s) => s.userId)
export const useUserEmail = () => useStore((s) => s.userEmail)
export const useSessionId = () => useStore((s) => s.sessionId)

// Computed: % complete
export const useProgress = () =>
  useStore((s) => {
    const answered = Object.values(s.answers).filter((v) => v?.trim()).length
    return Math.round((answered / QUESTIONS.length) * 100)
  })
