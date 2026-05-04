'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QueryInputProps {
  onSubmit: (query: string, brandName: string, competitors: string[]) => void
  isLoading: boolean
}

const EXAMPLE_QUERIES = [
  'best magnesium supplement for seniors',
  'best protein powder for weight loss',
  'best vitamin D supplement',
]

const inputClass =
  'w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow'

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('')
  const [brandName, setBrandName] = useState('')
  const [competitorsRaw, setCompetitorsRaw] = useState('')

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
    <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-800">Product query</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. best magnesium supplement for seniors"
          rows={2}
          className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow"
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuery(q)}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-800">
            Brand name <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. Garden of Life"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-800">
            Competitors <span className="font-normal text-zinc-400">(optional, comma-separated)</span>
          </label>
          <input
            type="text"
            value={competitorsRaw}
            onChange={(e) => setCompetitorsRaw(e.target.value)}
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
            Running diagnostic…
          </>
        ) : (
          'Run Diagnostic'
        )}
      </Button>
    </form>
  )
}
