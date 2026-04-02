// ─── Branding ────────────────────────────────────────────────────────────────

export interface BrandingProfile {
  logo: string | null          // base64 data URL
  colors: string[]             // hex codes, e.g. ["#5B21B6", "#0EA5E9"]
  fonts: string[]              // font names, e.g. ["Inter", "Playfair Display"]
  tone: string                 // "formal" | "playful" | "bold" | "minimal" | "technical"
  style: string                // "corporate" | "startup" | "creative" | "minimal"
  websiteUrl: string
  companyType: string          // e.g. "SaaS", "Marketplace", "Hardware"
}

export const defaultBranding: BrandingProfile = {
  logo: null,
  colors: ['#7C3AED', '#5B21B6', '#0EA5E9', '#1E1B4B'],
  fonts: ['Inter', 'Inter'],
  tone: 'bold',
  style: 'startup',
  websiteUrl: '',
  companyType: '',
}

// ─── Questions ───────────────────────────────────────────────────────────────

export interface Question {
  id: string
  slideId: SlideId
  slideTitle: string
  slideNumber: number
  question: string
  placeholder: string
  helpText: string            // shown in solo mode
  workshopHint: string        // shown in workshop mode (brief)
  required: boolean
  inputType: 'textarea' | 'text'
}

// ─── Slides ──────────────────────────────────────────────────────────────────

export type SlideId =
  | 'intro'
  | 'problem'
  | 'solution'
  | 'product'
  | 'market'
  | 'businessModel'
  | 'traction'
  | 'competition'
  | 'gtm'
  | 'financials'
  | 'team'
  | 'ask'

export interface DesignNotes {
  layout: string
  colorUsage: string
  fontHierarchy: string
  logoPlacement: string
  visualStyle: string
}

export interface PitchDeckSlide {
  id: SlideId
  title: string
  // New schema fields (Intelligence Override)
  coreMessage?: string        // one clear sentence — the key investor takeaway
  content?: string[]          // primary bullet array (replaces bullets)
  visualSuggestion?: string   // specific visual element recommendation
  layoutSuggestion?: string   // Canva layout guidance
  talkTrack?: string          // 30-60 second per-slide script
  // Legacy / backward-compat fields
  bullets?: string[]
  suggestedVisual?: string
  designNotes?: DesignNotes
}

// ─── Generated Output ────────────────────────────────────────────────────────

export interface GeneratedOutput {
  talkTrack?: string          // optional — per-slide talkTrack is now preferred
  slides: PitchDeckSlide[]
  quickImprovements: string[]
  coachNotes: string[]
}

// ─── App Mode ────────────────────────────────────────────────────────────────

export type AppMode = 'workshop' | 'solo'

// ─── Store State ─────────────────────────────────────────────────────────────

export interface AppState {
  mode: AppMode
  branding: BrandingProfile
  answers: Record<string, string>
  currentQuestionIndex: number
  generated: GeneratedOutput | null
  isGenerating: boolean
  generationError: string | null
}
