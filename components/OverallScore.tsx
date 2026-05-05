'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { animate } from 'framer-motion'
import type { ModelResult } from '@/types'

interface OverallScoreProps {
  score: number
  results: ModelResult[]
}

function getGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function getGradeGradient(grade: string): string {
  const map: Record<string, string> = {
    A: 'from-emerald-500 to-emerald-600',
    B: 'from-teal-500 to-cyan-500',
    C: 'from-amber-400 to-yellow-500',
    D: 'from-orange-400 to-orange-500',
    F: 'from-red-500 to-rose-500',
  }
  return map[grade] ?? 'from-zinc-500 to-zinc-600'
}

const BAR_COLORS: Record<string, string> = {
  A: '#10b981',
  B: '#14b8a6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
}

export function OverallScore({ score, results }: OverallScoreProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const grade = getGrade(score)
  const mentionedCount = results.filter((r) => r.mentioned).length

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    })
    return controls.stop
  }, [score])

  const chartData = results.map((r) => ({
    name: r.model.split(' ')[0],
    score: r.score,
    grade: r.grade,
  }))

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              AEO Score Overview
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Mentioned by{' '}
              <span className="font-semibold text-foreground">
                {mentionedCount} of {results.length}
              </span>{' '}
              AI models
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Overall</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {displayScore}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl ${getGradeGradient(grade)}`}
            >
              {grade}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.04 280)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.025 280)',
                  border: '1px solid oklch(0.28 0.04 280)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0.01 280)',
                }}
                cursor={{ fill: 'oklch(0.22 0.03 280)' }}
                formatter={(value) => [value, 'Score']}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={BAR_COLORS[entry.grade] ?? '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
