import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { queryOpenAI } from '@/lib/openai'
import { queryAnthropic } from '@/lib/anthropic'
import { queryGemini } from '@/lib/gemini'
import { queryGroq } from '@/lib/groq'
import { scoreResponse } from '@/lib/scorer'
import type { DiagnosticResult, ModelResult } from '@/types'

const MODEL_NAMES = ['GPT-4o Mini', 'Claude Haiku 4.5', 'Gemini 2.5 Flash', 'Llama 3.3 70B']

const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function countOccurrences(haystack: string, needle: string): number {
  const lower = haystack.toLowerCase()
  const target = needle.toLowerCase()
  let count = 0
  let idx = 0
  while ((idx = lower.indexOf(target, idx)) !== -1) {
    count++
    idx += target.length
  }
  return count
}

async function generateTips(query: string, brandName: string, results: ModelResult[]): Promise<string[]> {
  const tipsPrompt = `You are an AEO (Answer Engine Optimization) expert.

A brand called "${brandName || 'this brand'}" was searched across AI models with the query: "${query}"

Results: ${results.map(r => `${r.model}: ${r.mentioned ? `Mentioned at position #${r.position}` : 'Not mentioned'}`).join(', ')}

Give exactly 5 specific, actionable AEO improvement tips for this brand. Each tip must be:
- A complete sentence of at least 2-3 sentences
- Specific to the query and brand category
- Immediately actionable

Format as a JSON array of strings only, no other text:
["tip 1 full text here", "tip 2 full text here", "tip 3 full text here", "tip 4 full text here", "tip 5 full text here"]`
  try {
    const message = await anthropicClient.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: tipsPrompt }],
    })
    const block = message.content[0]
    if (block.type !== 'text') return []
    const jsonMatch = block.text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as unknown[]
      if (Array.isArray(parsed)) {
        return parsed
          .filter((t): t is string => typeof t === 'string' && t.length > 0)
          .slice(0, 5)
      }
    }
    return []
  } catch {
    return [
      'Ensure your brand is explicitly named in product descriptions and listings to increase the likelihood of AI models mentioning it. Use consistent brand naming across all content and metadata.',
      'Build authoritative long-form content targeting your key product queries. AI models prioritize well-structured, comprehensive content when formulating recommendations.',
      'Collect and prominently display verified customer reviews. Social proof signals are a strong indicator that AI models use to identify reputable brands.',
      "Optimize your brand's presence on high-authority platforms like Amazon, industry publications, and review sites. AI models aggregate data from these sources when generating responses.",
      'Create structured FAQ content that directly answers common queries in your niche. This format is highly indexed by AI models and significantly increases brand mention probability.',
    ]
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { query: string; brandName: string; competitors?: string[] }
  const { query, brandName, competitors = [] } = body

  const [openAIResult, anthropicResult, geminiResult, groqResult] = await Promise.allSettled([
    queryOpenAI(query),
    queryAnthropic(query),
    queryGemini(query),
    queryGroq(query),
  ])

  const rawResults = [openAIResult, anthropicResult, geminiResult, groqResult]

  const results: ModelResult[] = rawResults.map((settled, i) => {
    const modelName = MODEL_NAMES[i]

    if (settled.status === 'rejected') {
      const msg = settled.reason instanceof Error ? settled.reason.message : 'Request failed'
      return { model: modelName, grade: 'F', score: 0, mentioned: false, position: null, sentiment: 'neutral' as const, response: '', error: msg }
    }

    const response = settled.value
    if (response.startsWith('Error:')) {
      return { model: modelName, grade: 'F', score: 0, mentioned: false, position: null, sentiment: 'neutral' as const, response, error: response }
    }

    const scored = scoreResponse(response, brandName, competitors)
    return { model: modelName, ...scored, response }
  })

  const allResponses = results.map((r) => r.response).join('\n')

  const competitorMentions: Record<string, number> = {}
  for (const competitor of competitors) {
    competitorMentions[competitor] = countOccurrences(allResponses, competitor)
  }

  const successful = results.filter((r) => !r.error)
  const overallScore =
    successful.length > 0
      ? Math.round(successful.reduce((sum, r) => sum + r.score, 0) / successful.length)
      : 0

  const tips = await generateTips(query, brandName, results)

  const diagnosticResult: DiagnosticResult = {
    query,
    brandName,
    competitors,
    results,
    overallScore,
    competitorMentions,
    tips,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(diagnosticResult)
}
