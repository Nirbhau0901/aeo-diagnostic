import type { ModelResult } from '@/types'

interface ModelCardProps {
  result: ModelResult
  brandName: string
}

const GRADE_STYLES: Record<string, string> = {
  A: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  B: 'text-blue-700 bg-blue-50 border-blue-200',
  C: 'text-amber-700 bg-amber-50 border-amber-200',
  D: 'text-orange-700 bg-orange-50 border-orange-200',
  F: 'text-red-700 bg-red-50 border-red-200',
}

const SENTIMENT_STYLES: Record<string, string> = {
  positive: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-zinc-100 text-zinc-600',
  negative: 'bg-red-100 text-red-700',
}

const PROVIDER_MAP: Record<string, string> = {
  'GPT-4o Mini': 'OpenAI',
  'Claude Haiku 4.5': 'Anthropic',
  'Gemini 2.0 Flash': 'Google',
  'Llama 3.3 70B': 'Groq',
}

const PROVIDER_STYLES: Record<string, string> = {
  OpenAI: 'bg-emerald-50 text-emerald-700',
  Anthropic: 'bg-orange-50 text-orange-700',
  Google: 'bg-blue-50 text-blue-700',
  Groq: 'bg-purple-50 text-purple-700',
}

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span className="whitespace-pre-wrap">{text}</span>
  }
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  const lowerHighlight = highlight.toLowerCase()
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.toLowerCase() === lowerHighlight ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

export function ModelCard({ result, brandName }: ModelCardProps) {
  const provider = PROVIDER_MAP[result.model] ?? 'Unknown'
  const gradeStyle = GRADE_STYLES[result.grade] ?? GRADE_STYLES.F
  const providerStyle = PROVIDER_STYLES[provider] ?? 'bg-zinc-100 text-zinc-600'

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 truncate">{result.model}</p>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${providerStyle}`}>
            {provider}
          </span>
        </div>
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-xl border-2 text-3xl font-bold ${gradeStyle}`}
        >
          {result.grade}
        </div>
      </div>

      {result.error && !result.mentioned ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          Error contacting model
        </div>
      ) : (
        <>
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                result.mentioned ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {result.mentioned ? 'Mentioned' : 'Not mentioned'}
            </span>
            {result.mentioned && result.position !== null && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Ranked #{result.position}
              </span>
            )}
            {result.mentioned && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${SENTIMENT_STYLES[result.sentiment]}`}
              >
                {result.sentiment}
              </span>
            )}
          </div>

          {/* Response text */}
          {result.response && (
            <div className="max-h-52 overflow-y-auto rounded-lg bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-700">
              <HighlightedText text={result.response} highlight={brandName} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
