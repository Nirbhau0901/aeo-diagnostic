"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Competitor {
  name: string
  mentions: number
  trend: "up" | "down" | "neutral"
  percentage: number
  topModels: string[]
}

interface CompetitorMentionsProps {
  competitors: Competitor[]
  className?: string
}

export function CompetitorMentions({ competitors, className }: CompetitorMentionsProps) {
  const maxMentions = Math.max(...competitors.map((c) => c.mentions))

  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Competitor Mentions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {competitors.map((competitor, index) => (
          <div key={competitor.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
                <span className="font-medium text-foreground">{competitor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {competitor.mentions.toLocaleString()}
                </span>
                {competitor.trend === "up" && (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                )}
                {competitor.trend === "down" && (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                {competitor.trend === "neutral" && (
                  <Minus className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="relative h-2 rounded-full bg-secondary/50 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${(competitor.mentions / maxMentions) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {competitor.topModels.map((model) => (
                <Badge
                  key={model}
                  variant="secondary"
                  className="text-xs bg-secondary/50 text-muted-foreground hover:bg-secondary"
                >
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
