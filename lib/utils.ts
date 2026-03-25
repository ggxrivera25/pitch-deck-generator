import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert file to base64 data URL
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Extract JSON from a Claude response that may include markdown code fences
export function extractJSON(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
  if (fenceMatch) return fenceMatch[1]
  const objectMatch = text.match(/(\{[\s\S]*\})/)
  if (objectMatch) return objectMatch[1]
  return text.trim()
}

// Format seconds into "X min Y sec"
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

// Count words
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Get a readable text color (black or white) for a background hex color
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Slide ID to display name
export const SLIDE_NAMES: Record<string, string> = {
  intro: 'Introduction',
  problem: 'The Problem',
  solution: 'Our Solution',
  product: 'Product',
  market: 'Market Size',
  businessModel: 'Business Model',
  traction: 'Traction',
  competition: 'Competition',
  gtm: 'Go-to-Market',
  financials: 'Financials',
  team: 'Team',
  ask: 'The Ask',
}

// Slide emoji for visual distinction
export const SLIDE_EMOJIS: Record<string, string> = {
  intro: '🚀',
  problem: '🔴',
  solution: '💡',
  product: '⚙️',
  market: '📊',
  businessModel: '💰',
  traction: '📈',
  competition: '🏆',
  gtm: '🎯',
  financials: '💹',
  team: '👥',
  ask: '🤝',
}

// Build a structured summary of answers for the prompt
export function buildAnswerSummary(answers: Record<string, string>): string {
  const sections: string[] = []

  const groups: Array<{ title: string; ids: string[] }> = [
    { title: 'COMPANY OVERVIEW', ids: ['company_name', 'tagline', 'founders'] },
    { title: 'PROBLEM', ids: ['problem', 'problem_who', 'problem_why'] },
    { title: 'SOLUTION', ids: ['solution', 'solution_differentiation'] },
    { title: 'PRODUCT', ids: ['product_features', 'product_how'] },
    { title: 'MARKET SIZE', ids: ['market_customer', 'market_size'] },
    { title: 'BUSINESS MODEL', ids: ['revenue_model', 'pricing'] },
    { title: 'TRACTION', ids: ['traction'] },
    { title: 'COMPETITION', ids: ['competitors', 'differentiation'] },
    { title: 'GO-TO-MARKET', ids: ['gtm_channels', 'gtm_first_customers'] },
    { title: 'FINANCIALS', ids: ['projections', 'assumptions'] },
    { title: 'TEAM', ids: ['team'] },
    { title: 'THE ASK', ids: ['funding_amount', 'use_of_funds'] },
  ]

  const labels: Record<string, string> = {
    company_name: 'Company Name',
    tagline: 'Tagline',
    founders: 'Founders',
    problem: 'Problem Description',
    problem_who: 'Target Customer',
    problem_why: 'Cost/Consequence',
    solution: 'Solution',
    solution_differentiation: 'Differentiation',
    product_features: 'Key Features',
    product_how: 'How It Works',
    market_customer: 'Specific Target Customer',
    market_size: 'Market Size (TAM/SAM/SOM)',
    revenue_model: 'Revenue Streams',
    pricing: 'Pricing Model',
    traction: 'Traction & Milestones',
    competitors: 'Competitors',
    differentiation: 'Competitive Advantages',
    gtm_channels: 'Acquisition Channels',
    gtm_first_customers: 'Path to First 100 Customers',
    projections: '3-Year Projections',
    assumptions: 'Key Assumptions',
    team: 'Team Background',
    funding_amount: 'Funding Ask',
    use_of_funds: 'Use of Funds',
  }

  for (const group of groups) {
    const entries = group.ids
      .filter(id => answers[id]?.trim())
      .map(id => `  ${labels[id] || id}: ${answers[id].trim()}`)

    if (entries.length > 0) {
      sections.push(`### ${group.title}\n${entries.join('\n')}`)
    }
  }

  return sections.join('\n\n')
}
