export interface ModelResult {
  model: string
  grade: string
  score: number
  mentioned: boolean
  position: number | null
  sentiment: 'positive' | 'neutral' | 'negative'
  response: string
  error?: string
}

export interface DiagnosticResult {
  query: string
  brandName: string
  competitors: string[]
  results: ModelResult[]
  overallScore: number
  competitorMentions: Record<string, number>
  tips: string[]
  createdAt: string
}

export interface QueryHistory {
  id: string
  created_at: string
  query_text: string
  brand_name: string
  overall_score: number
  results: DiagnosticResult
}
