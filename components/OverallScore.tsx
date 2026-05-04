'use client'

import { motion } from 'framer-motion'
import type { ModelResult } from '@/types'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getColor(score: number): string {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#3b82f6'
  if (score >= 70) return '#f59e0b'
  if (score >= 60) return '#f97316'
  return '#ef4444'
}

function getGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

interface OverallScoreProps {
  score: number
  results: ModelResult[]
}

export function OverallScore({ score, results }: OverallScoreProps) {
  const color = getColor(score)
  const grade = getGrade(score)
  const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const mentionedCount = results.filter((r) => r.mentioned).length

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row">
      {/* Circle */}
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx={60} cy={60} r={RADIUS} fill="none" stroke="#f4f4f5" strokeWidth={10} />
          <motion.circle
            cx={60}
            cy={60}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-zinc-900 leading-none">{score}</span>
          <span className="text-xs text-zinc-400 mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <span className="text-sm font-medium text-zinc-500">Overall Grade</span>
          <span className="text-3xl font-bold leading-none" style={{ color }}>
            {grade}
          </span>
        </div>
        <p className="text-zinc-800">
          Mentioned by{' '}
          <span className="font-semibold">
            {mentionedCount} of {results.length}
          </span>{' '}
          AI models
        </p>
        <p className="text-sm text-zinc-400">
          Score based on brand visibility, ranking position, and sentiment
        </p>
      </div>
    </div>
  )
}
