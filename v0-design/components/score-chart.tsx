"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

interface ScoreDataPoint {
  date: string
  score: number
  mentions: number
}

interface ScoreChartProps {
  data: ScoreDataPoint[]
  className?: string
}

export function ScoreChart({ data, className }: ScoreChartProps) {
  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          AEO Score Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 280)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 280)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.22 300)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.55 0.22 300)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.04 280)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0.02 280)", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0.02 280)", fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.025 280)",
                  border: "1px solid oklch(0.28 0.04 280)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0.01 280)",
                }}
                labelStyle={{ color: "oklch(0.65 0.02 280)" }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="oklch(0.65 0.2 280)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                name="Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
