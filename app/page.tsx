'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QueryInput } from '@/components/QueryInput'
import { ModelCard } from '@/components/ModelCard'
import { CompetitorTable } from '@/components/CompetitorTable'
import { RecommendationPanel } from '@/components/RecommendationPanel'
import { OverallScore } from '@/components/OverallScore'
import type { DiagnosticResult, QueryHistory } from '@/types'

type Tab = 'diagnostic' | 'history'

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-zinc-200" />
          <div className="h-3 w-20 rounded bg-zinc-100" />
        </div>
        <div className="size-14 rounded-xl bg-zinc-200" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-24 rounded-full bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-5/6 rounded bg-zinc-100" />
        <div className="h-3 w-4/6 rounded bg-zinc-100" />
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-3/4 rounded bg-zinc-100" />
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 80
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 60
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700'
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {score}
    </span>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('diagnostic')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<QueryHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  async function handleDiagnose(query: string, brandName: string, competitors: string[]) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, brandName, competitors }),
      })
      if (!res.ok) throw new Error('Diagnostic request failed')
      const data = (await res.json()) as DiagnosticResult
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadHistory() {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await fetch('/api/history')
      if (!res.ok) throw new Error('Failed to load history')
      const data = (await res.json()) as QueryHistory[]
      setHistory(data)
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab === 'history') loadHistory()
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">⚡ AEO Diagnostic</h1>
              <p className="text-sm text-zinc-500">See how AI recommends your brand</p>
            </div>
            <div className="flex gap-1 self-start rounded-lg border border-zinc-200 bg-zinc-50 p-1 sm:self-auto">
              {(['diagnostic', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {activeTab === 'diagnostic' ? (
          <div className="space-y-6">
            <QueryInput onSubmit={handleDiagnose} isLoading={isLoading} />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <OverallScore score={result.overallScore} results={result.results} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {result.results.map((r) => (
                    <ModelCard key={r.model} result={r} brandName={result.brandName} />
                  ))}
                </div>

                {result.competitors.length > 0 && (
                  <CompetitorTable mentions={result.competitorMentions} />
                )}

                {result.tips.length > 0 && <RecommendationPanel tips={result.tips} />}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">Past Diagnostics</h2>
              <button
                onClick={loadHistory}
                disabled={historyLoading}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            {historyLoading && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl border bg-white" />
                ))}
              </div>
            )}

            {historyError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {historyError}
              </div>
            )}

            {!historyLoading && !historyError && history.length === 0 && (
              <div className="rounded-xl border bg-white px-6 py-12 text-center">
                <p className="text-sm text-zinc-500">No history yet. Run a diagnostic first.</p>
              </div>
            )}

            {!historyLoading &&
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.query_text}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {item.brand_name ? `${item.brand_name} · ` : ''}
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <ScoreBadge score={item.overall_score} />
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}
