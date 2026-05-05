'use client'

import { useState, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { BarChart2, Brain, Eye, LogOut, RotateCcw, Sparkles, Target, X, Zap } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'
import { AuthModal } from '@/components/AuthModal'
import { QueryInput } from '@/components/QueryInput'
import { ModelCard } from '@/components/ModelCard'
import { CompetitorTable } from '@/components/CompetitorTable'
import { RecommendationPanel } from '@/components/RecommendationPanel'
import { OverallScore } from '@/components/OverallScore'
import type { DiagnosticResult, QueryHistory } from '@/types'

type Tab = 'diagnostic' | 'history'

const USE_CASES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: BarChart2,
    title: 'Track AI brand visibility',
    description: 'See which AI models mention your brand and how prominently you appear in their responses.',
  },
  {
    icon: Target,
    title: 'Benchmark competitors',
    description: 'Compare your brand side-by-side with competitors across GPT-4o, Claude, Gemini & Llama.',
  },
  {
    icon: Zap,
    title: 'Get actionable AEO tips',
    description: 'Receive specific recommendations to improve your brand\'s AI discoverability.',
  },
]

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/50 bg-card/50 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-secondary" />
            <div className="h-3 w-16 rounded bg-secondary/50" />
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-secondary" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 rounded bg-secondary/50" />
        <div className="h-10 rounded bg-secondary/50" />
      </div>
      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="h-3 w-full rounded bg-secondary/30" />
        <div className="h-3 w-5/6 rounded bg-secondary/30" />
        <div className="h-3 w-4/6 rounded bg-secondary/30" />
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 80
      ? 'bg-emerald-500/20 text-emerald-400'
      : score >= 60
        ? 'bg-amber-500/20 text-amber-400'
        : 'bg-red-500/20 text-red-400'
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {score}
    </span>
  )
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Form state lives here so it survives tab switches
  const [query, setQuery] = useState('')
  const [brandName, setBrandName] = useState('')
  const [competitorsRaw, setCompetitorsRaw] = useState('')

  const [activeTab, setActiveTab] = useState<Tab>('diagnostic')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<QueryHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [viewingHistoryResult, setViewingHistoryResult] = useState<DiagnosticResult | null>(null)
  const [viewingHistoryMeta, setViewingHistoryMeta] = useState<{ queryText: string; createdAt: string } | null>(null)

  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setSession(session)
      setSessionLoading(false)
    }
    initSession()

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setSessionLoading(false)
      if (session) setShowAuthModal(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleDiagnose(query: string, brandName: string, competitors: string[]) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setViewingHistoryResult(null)
    setViewingHistoryMeta(null)
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, brandName, competitors }),
      })
      if (!res.ok) throw new Error('Diagnostic request failed')
      const data = (await res.json()) as DiagnosticResult
      setResult(data)
      const { data: { session } } = await supabaseClient.auth.getSession()
      await supabaseClient.from('queries').insert({
        query_text: query,
        brand_name: brandName || '',
        competitors: competitors || [],
        results: data,
        overall_score: data.overallScore,
        user_id: session?.user?.id,
      })
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
      const { data: { session } } = await supabaseClient.auth.getSession()
      const { data } = await supabaseClient
        .from('queries')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(20)
      setHistory(data || [])
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

  function handleViewHistory(item: QueryHistory) {
    setResult(null)
    setViewingHistoryResult(item.results)
    setViewingHistoryMeta({ queryText: item.query_text, createdAt: item.created_at })
    setActiveTab('diagnostic')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSignOut() {
    await supabaseClient.auth.signOut()
  }

  function handleNewDiagnosis() {
    setResult(null)
    setViewingHistoryResult(null)
    setViewingHistoryMeta(null)
    setQuery('')
    setBrandName('')
    setCompetitorsRaw('')
    setError(null)
  }

  const displayResult = result ?? viewingHistoryResult

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg space-y-8"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">AEO Diagnostic</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                See how AI engines rank your brand across GPT-4o, Claude, Gemini, and Llama — and get actionable tips to improve your visibility.
              </p>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Sign in to run your AEO Diagnostic
            </button>
            <p className="text-xs text-muted-foreground">
              Free to use · Powered by GPT-4o, Claude, Gemini, Llama
            </p>
          </motion.div>
        </div>
        <footer className="relative border-t border-border/50 bg-card/30 py-4 text-center text-xs text-muted-foreground">
          AEO Diagnostic | Built for Pixii.ai | Powered by GPT-4o Mini, Claude Haiku, Gemini 2.5 Flash, Llama 3.3
        </footer>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-foreground">AEO Diagnostic</span>
                  <p className="text-xs text-muted-foreground leading-none mt-0.5">
                    See how AI engines rank your brand
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-1 rounded-lg border border-border/50 bg-secondary/30 p-1">
                  {(['diagnostic', 'history'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-l border-border/50 pl-3">
                  <span className="hidden md:block text-xs text-muted-foreground truncate max-w-[160px]">
                    {session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile tab bar */}
            <div className="flex sm:hidden gap-1 rounded-lg border border-border/50 bg-secondary/30 p-1 mt-3">
              {(['diagnostic', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-5xl px-6 py-8 flex-1">
          {activeTab === 'diagnostic' ? (
            <div className="space-y-6">
              {/* Hero — only shown before any results */}
              {!displayResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center space-y-4 pt-2 pb-2"
                >
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                    Know If AI Recommends<br className="hidden sm:block" /> Your Brand
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                    Query GPT-4o, Claude, Gemini &amp; Llama simultaneously. Get a report card on your brand&apos;s AI visibility in seconds.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center pt-1">
                    <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-foreground">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                      4 AI Models
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-foreground">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Real-time Analysis
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Free to use
                    </span>
                  </div>
                </motion.div>
              )}

              <QueryInput
                onSubmit={handleDiagnose}
                isLoading={isLoading}
                query={query}
                brandName={brandName}
                competitorsRaw={competitorsRaw}
                onQueryChange={setQuery}
                onBrandNameChange={setBrandName}
                onCompetitorsRawChange={setCompetitorsRaw}
              />

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground animate-pulse">
                    Querying 4 AI models simultaneously…
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                </div>
              )}

              {displayResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* New Diagnosis button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleNewDiagnosis}
                      className="flex items-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      New Diagnosis
                    </button>
                  </div>

                  {/* Amber banner shown only when viewing a historical result */}
                  {!result && viewingHistoryMeta && (
                    <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                          Viewing past diagnostic
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                          {viewingHistoryMeta.queryText}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(viewingHistoryMeta.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => { setViewingHistoryResult(null); setViewingHistoryMeta(null) }}
                        className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <OverallScore score={displayResult.overallScore} results={displayResult.results} />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {displayResult.results.map((r) => (
                      <ModelCard key={r.model} result={r} brandName={displayResult.brandName} />
                    ))}
                  </div>

                  {displayResult.competitors.length > 0 && (
                    <CompetitorTable mentions={displayResult.competitorMentions} />
                  )}

                  {displayResult.tips.length > 0 && <RecommendationPanel tips={displayResult.tips} />}
                </motion.div>
              )}

              {/* Welcome / empty state */}
              {!displayResult && !isLoading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-5"
                >
                  <p className="text-center text-sm text-muted-foreground">
                    Welcome,{' '}
                    <span className="font-medium text-foreground">{session.user.email}</span>
                    {' '}— enter a query above to get started.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {USE_CASES.map(({ icon: Icon, title, description }) => (
                      <div
                        key={title}
                        className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Past Diagnostics</h2>
                <button
                  onClick={loadHistory}
                  disabled={historyLoading}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {historyLoading && (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl border border-border/50 bg-card/50"
                    />
                  ))}
                </div>
              )}

              {historyError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                  {historyError}
                </div>
              )}

              {!historyLoading && !historyError && history.length === 0 && (
                <div className="rounded-xl border border-border/50 bg-card/50 px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No history yet. Run a diagnostic first.
                  </p>
                </div>
              )}

              {!historyLoading &&
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.query_text}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.brand_name ? `${item.brand_name} · ` : ''}
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ScoreBadge score={item.overall_score} />
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </main>

        <footer className="mt-auto border-t border-border/50 bg-card/30 py-4 text-center text-xs text-muted-foreground">
          AEO Diagnostic | Built for Pixii.ai | Powered by GPT-4o Mini, Claude Haiku, Gemini 2.5 Flash, Llama 3.3
        </footer>
      </div>
    </div>
  )
}
