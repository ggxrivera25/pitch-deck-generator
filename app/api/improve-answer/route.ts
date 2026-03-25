import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { questionId, question, currentAnswer, context, mode } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured.' },
        { status: 500 }
      )
    }

    const prompt = `You are an expert startup pitch coach helping a founder improve their pitch deck answer.

QUESTION: ${question}

FOUNDER'S CURRENT ANSWER:
"${currentAnswer || '[No answer provided yet]'}"

ADDITIONAL CONTEXT (from other answers):
${context || 'Not provided'}

MODE: ${mode === 'workshop' ? 'Workshop (be concise and punchy)' : 'Solo (be thorough and investor-ready)'}

Your task:
1. Identify what's strong about the current answer (if anything)
2. Identify what's weak, vague, or missing
3. Provide an IMPROVED version of the answer that is:
   - More specific and quantified where possible
   - More compelling and investor-friendly
   - Concise but complete
   - Written in the founder's voice (first person)

Return ONLY the improved answer text — no preamble, no explanation. Just write the improved answer as if the founder is saying it.

If the current answer is empty, write a strong example answer for this type of company/context.`

    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1000,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    })

    const response = await stream.finalMessage()

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )

    if (!textBlock) {
      return NextResponse.json(
        { error: 'No improvement generated. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      improvedAnswer: textBlock.text.trim(),
      questionId,
    })
  } catch (error) {
    console.error('Improve answer error:', error)

    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'Rate limit hit. Please wait and try again.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to improve answer. Please try again.' },
      { status: 500 }
    )
  }
}
