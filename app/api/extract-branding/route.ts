import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { BrandingProfile } from '@/lib/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured.' },
        { status: 500 }
      )
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    // Fetch the webpage content
    let pageContent = ''
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      const pageResponse = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PitchDeckGenerator/1.0)',
        },
      })
      clearTimeout(timeoutId)
      pageContent = await pageResponse.text()
      // Truncate to avoid overwhelming Claude's context
      pageContent = pageContent.slice(0, 20000)
    } catch {
      return NextResponse.json(
        { error: `Could not fetch website at ${normalizedUrl}. The site may be unavailable or blocking requests.` },
        { status: 400 }
      )
    }

    const prompt = `Analyze this website's HTML/content and extract branding information.

URL: ${normalizedUrl}
PAGE CONTENT (truncated):
${pageContent}

Extract the following branding information. If you cannot determine something from the content, make a reasonable inference based on the industry/company type.

Return a JSON object with EXACTLY this structure:
{
  "colors": ["#hex1", "#hex2", "#hex3"],
  "fonts": ["FontName1", "FontName2"],
  "tone": "formal|playful|bold|minimal|technical",
  "style": "corporate|startup|creative|minimal",
  "companyType": "SaaS|Marketplace|Consumer App|Hardware|Services|etc"
}

Rules:
- colors: Extract 2-4 hex colors from CSS, inline styles, or visual analysis. Always include at least 2 colors.
- fonts: Extract font family names from CSS. Default to ["Inter", "Inter"] if not found.
- tone: Analyze copy tone. Choose one: formal, playful, bold, minimal, technical
- style: Analyze overall design style. Choose one: corporate, startup, creative, minimal
- companyType: Infer from company description/content

Return ONLY the JSON object, no other text.`

    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const response = await stream.finalMessage()

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )

    if (!textBlock) {
      return NextResponse.json({ error: 'Could not extract branding' }, { status: 500 })
    }

    try {
      // Extract JSON from response
      const jsonMatch = textBlock.text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) ||
                        textBlock.text.match(/(\{[\s\S]*\})/)
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : textBlock.text.trim()
      const extracted = JSON.parse(jsonStr) as Partial<BrandingProfile>

      return NextResponse.json({
        colors: extracted.colors || ['#7C3AED', '#5B21B6'],
        fonts: extracted.fonts || ['Inter', 'Inter'],
        tone: extracted.tone || 'bold',
        style: extracted.style || 'startup',
        companyType: extracted.companyType || '',
      })
    } catch {
      return NextResponse.json(
        { error: 'Could not parse branding data from website.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Extract branding error:', error)

    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to extract branding. Please try again.' },
      { status: 500 }
    )
  }
}
