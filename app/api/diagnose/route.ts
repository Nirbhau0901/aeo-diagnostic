import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { queryOpenAI } from '@/lib/openai'
import { queryAnthropic } from '@/lib/anthropic'
import { queryGemini } from '@/lib/gemini'
import { queryGroq } from '@/lib/groq'
import { scoreResponse } from '@/lib/scorer'
import { saveQuery } from '@/lib/supabase'
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

async function generateTips(query: string, brandName: string): Promise<string[]> {
  const prompt = `Based on these AI responses about "${query}", give 3-5 specific tips to improve AEO for brand ${brandName}. Format as a numbered list.`
  try {
    const message = await anthropicClient.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = message.content[0]
    if (block.type !== 'text') return []
    return block.text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^\d+[.)]\s+/.test(line))
      .map((line) => line.replace(/^\d+[.)]\s+/, '').trim())
      .filter((line) => line.length > 0)
  } catch {
    return [
      'Ensure your brand is explicitly named in product descriptions and listings.',
      'Build authoritative content that AI models are likely to reference.',
      'Collect and publish verified customer reviews to strengthen brand signals.',
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

  const tips = await generateTips(query, brandName)

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

  try {
    await saveQuery(diagnosticResult)
  } catch {
    // Save failure should not block the response
  }

  return NextResponse.json(diagnosticResult)
}
