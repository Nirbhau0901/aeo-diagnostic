type Sentiment = 'positive' | 'neutral' | 'negative'

interface ScoreResult {
  mentioned: boolean
  position: number | null
  sentiment: Sentiment
  score: number
  grade: string
}

const POSITIVE_WORDS = [
  'best', 'top', 'excellent', 'recommend', 'great', 'outstanding',
  'leading', 'popular', 'trusted', 'quality', 'superior', 'preferred',
  'highly rated', 'award', 'premium'
]

const NEGATIVE_WORDS = [
  'poor', 'avoid', 'bad', 'worst', 'inferior', 'issues', 'problems',
  'concerns', 'complaints', 'negative', 'disappointing', 'unreliable',
  'overpriced', 'low quality'
]

function detectPosition(response: string, brandName: string, competitors: string[]): number | null {
  const lower = response.toLowerCase()
  const lowerBrand = brandName.toLowerCase()
  const lines = response.split('\n')

  // Check if brand appears in a numbered list line
  for (const line of lines) {
    if (!line.toLowerCase().includes(lowerBrand)) continue
    const match = line.match(/^(\d+)[.)]\s+/)
    if (match) return parseInt(match[1])
  }

  // Fallback: rank by first occurrence among all brands
  const allBrands = [brandName, ...competitors]
  const occurrences = allBrands
    .map((b) => ({ brand: b, index: lower.indexOf(b.toLowerCase()) }))
    .filter((b) => b.index !== -1)
    .sort((a, b) => a.index - b.index)

  const myIndex = occurrences.findIndex(
    (b) => b.brand.toLowerCase() === lowerBrand
  )
  return myIndex === -1 ? null : myIndex + 1
}

function detectSentiment(response: string, brandName: string): Sentiment {
  const lower = response.toLowerCase()
  const lowerBrand = brandName.toLowerCase()
  const brandIndex = lower.indexOf(lowerBrand)
  if (brandIndex === -1) return 'neutral'

  const start = Math.max(0, brandIndex - 250)
  const end = Math.min(lower.length, brandIndex + lowerBrand.length + 250)
  const context = lower.slice(start, end)

  const positiveCount = POSITIVE_WORDS.filter((w) => context.includes(w)).length
  const negativeCount = NEGATIVE_WORDS.filter((w) => context.includes(w)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function positionToBaseScore(position: number | null): number {
  if (position === 1) return 85
  if (position === 2) return 72
  if (position === 3) return 60
  if (position !== null && position <= 5) return 50
  return 40
}

function sentimentAdjustment(sentiment: Sentiment): number {
  if (sentiment === 'positive') return 15
  if (sentiment === 'negative') return -20
  return 0
}

function scoreToGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function scoreResponse(
  response: string,
  brandName: string,
  competitors: string[]
): ScoreResult {
  const lower = response.toLowerCase()
  const mentioned = lower.includes(brandName.toLowerCase())

  if (!mentioned) {
    return { mentioned: false, position: null, sentiment: 'neutral', score: 0, grade: 'F' }
  }

  const position = detectPosition(response, brandName, competitors)
  const sentiment = detectSentiment(response, brandName)
  const raw = positionToBaseScore(position) + sentimentAdjustment(sentiment)
  const score = Math.min(100, Math.max(0, raw))
  const grade = scoreToGrade(score)

  return { mentioned, position, sentiment, score, grade }
}
