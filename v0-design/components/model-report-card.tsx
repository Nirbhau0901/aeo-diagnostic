"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GradeBadge } from "@/components/grade-badge"
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type Grade = "A" | "B" | "C" | "D" | "F"

interface ModelReportCardProps {
  model: string
  logo: React.ReactNode
  grade: Grade
  previousGrade?: Grade
  score: number
  mentions: number
  mentionsTrend: "up" | "down" | "neutral"
  topCategory: string
  className?: string
}

const gradeOrder: Grade[] = ["F", "D", "C", "B", "A"]

function getGradeTrend(current: Grade, previous?: Grade): "up" | "down" | "neutral" {
  if (!previous) return "neutral"
  const currentIndex = gradeOrder.indexOf(current)
  const previousIndex = gradeOrder.indexOf(previous)
  if (currentIndex > previousIndex) return "up"
  if (currentIndex < previousIndex) return "down"
  return "neutral"
}

export function ModelReportCard({
  model,
  logo,
  grade,
  previousGrade,
  score,
  mentions,
  mentionsTrend,
  topCategory,
  className,
}: ModelReportCardProps) {
  const gradeTrend = getGradeTrend(grade, previousGrade)

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary">
              {logo}
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{model}</h3>
              <p className="text-xs text-muted-foreground">{topCategory}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GradeBadge grade={grade} size="md" />
            {gradeTrend !== "neutral" && (
              <div className={cn(
                "flex items-center text-xs",
                gradeTrend === "up" ? "text-emerald-400" : "text-rose-400"
              )}>
                {gradeTrend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{score}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Mentions</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{mentions.toLocaleString()}</span>
              {mentionsTrend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
              {mentionsTrend === "down" && <TrendingDown className="w-4 h-4 text-rose-400" />}
              {mentionsTrend === "neutral" && <Minus className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View full report <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
