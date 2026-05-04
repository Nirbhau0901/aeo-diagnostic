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

const GRADE_LEFT_BORDER: Record<string, string> = {
  A: 'border-l-emerald-500',
  B: 'border-l-blue-500',
  C: 'border-l-amber-500',
  D: 'border-l-orange-500',
  F: 'border-l-red-500',
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

function highlightBrand(text: string, highlight: string) {
  if (!highlight.trim()) return <>{text}</>
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  const lower = highlight.toLowerCase()
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === lower ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 not-italic">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  )
}

function renderInline(text: string, brandName: string) {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/)
  if (boldParts.length === 1) return highlightBrand(text, brandName)
  return (
    <>
      {boldParts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-zinc-800">
            {highlightBrand(part.slice(2, -2), brandName)}
          </strong>
        ) : (
          <span key={i}>{highlightBrand(part, brandName)}</span>
        )
      )}
    </>
  )
}

function renderMarkdown(text: string, brandName: string) {
  const lines = text.split('\n')
  return (
    <div className="space-y-0.5 text-sm leading-relaxed text-zinc-700">
      {lines.map((line, i) => {
        if (/^#{1,3}\s/.test(line)) {
          return (
            <p key={i} className="font-semibold text-zinc-800 mt-1.5 first:mt-0">
              {renderInline(line.replace(/^#{1,3}\s+/, ''), brandName)}
            </p>
          )
        }
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)/)?.[1]
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0 font-medium text-zinc-400 tabular-nums">{num}.</span>
              <span>{renderInline(line.replace(/^\d+\.\s+/, ''), brandName)}</span>
            </div>
          )
        }
        if (/^[-*•]\s/.test(line)) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0 text-zinc-400">•</span>
              <span>{renderInline(line.replace(/^[-*•]\s+/, ''), brandName)}</span>
            </div>
          )
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i}>{renderInline(line, brandName)}</p>
      })}
    </div>
  )
}

export function ModelCard({ result, brandName }: ModelCardProps) {
  const provider = PROVIDER_MAP[result.model] ?? 'Unknown'
  const gradeStyle = GRADE_STYLES[result.grade] ?? GRADE_STYLES.F
  const leftBorder = GRADE_LEFT_BORDER[result.grade] ?? 'border-l-red-500'
  const providerStyle = PROVIDER_STYLES[provider] ?? 'bg-zinc-100 text-zinc-600'

  return (
    <div className={`rounded-2xl border border-l-4 ${leftBorder} bg-white p-5 shadow-sm space-y-4`}>
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

          {/* Response with markdown rendering */}
          {result.response && (
            <div className="max-h-52 overflow-y-auto rounded-lg bg-zinc-50 px-3 py-2.5">
              {renderMarkdown(result.response, brandName)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
