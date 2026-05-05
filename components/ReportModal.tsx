'use client'

import { motion } from 'framer-motion'
import { Calendar, RotateCcw, Search, Tag, Users, X } from 'lucide-react'
import { OverallScore } from '@/components/OverallScore'
import { ModelCard } from '@/components/ModelCard'
import { CompetitorTable } from '@/components/CompetitorTable'
import { RecommendationPanel } from '@/components/RecommendationPanel'
import type { DiagnosticResult } from '@/types'

interface ReportModalProps {
  result: DiagnosticResult
  onClose: () => void
}

export function ReportModal({ result, onClose }: ReportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl rounded-2xl border border-border/50 bg-background shadow-2xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-sm px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-foreground">Diagnostic Report</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-6">
          {/* Query details */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <Search className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Query</p>
                <p className="text-sm font-semibold text-foreground">{result.query}</p>
              </div>
            </div>

            {result.brandName && (
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Brand</p>
                  <p className="text-sm text-foreground">{result.brandName}</p>
                </div>
              </div>
            )}

            {result.competitors.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Competitors</p>
                  <p className="text-sm text-foreground">{result.competitors.join(', ')}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Date run</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(result.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          <OverallScore score={result.overallScore} results={result.results} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {result.results.map((r) => (
              <ModelCard key={r.model} result={r} brandName={result.brandName} />
            ))}
          </div>

          {result.competitors.length > 0 && (
            <CompetitorTable mentions={result.competitorMentions} />
          )}

          {result.tips.length > 0 && (
            <RecommendationPanel tips={result.tips} />
          )}

          <div className="pt-2 flex justify-center">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Run New Diagnosis
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
