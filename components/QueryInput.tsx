'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QueryInputProps {
  onSubmit: (query: string, brandName: string, competitors: string[]) => void
  isLoading: boolean
  query: string
  brandName: string
  competitorsRaw: string
  onQueryChange: (value: string) => void
  onBrandNameChange: (value: string) => void
  onCompetitorsRawChange: (value: string) => void
}

const EXAMPLE_QUERIES = [
  'best magnesium supplement for seniors',
  'best protein powder for weight loss',
  'best vitamin D supplement',
]

const inputClass =
  'w-full rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow'

export function QueryInput({
  onSubmit,
  isLoading,
  query,
  brandName,
  competitorsRaw,
  onQueryChange,
  onBrandNameChange,
  onCompetitorsRawChange,
}: QueryInputProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim() || isLoading) return
    const competitors = competitorsRaw
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
    onSubmit(query.trim(), brandName.trim(), competitors)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Product query</label>
        <textarea
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="e.g. best magnesium supplement for seniors"
          rows={2}
          className="w-full resize-none rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQueryChange(q)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                query === q
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border/50 bg-secondary/20 text-muted-foreground hover:border-primary/30 hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Brand name <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => onBrandNameChange(e.target.value)}
            placeholder="e.g. Garden of Life"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Competitors{' '}
            <span className="font-normal text-muted-foreground">(optional, comma-separated)</span>
          </label>
          <input
            type="text"
            value={competitorsRaw}
            onChange={(e) => onCompetitorsRawChange(e.target.value)}
            placeholder="e.g. Nature Made, NOW Foods"
            className={inputClass}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="h-11 w-full gap-2 text-sm font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Analyzing…
          </>
        ) : (
          'Run Diagnostic'
        )}
      </Button>
    </form>
  )
}
