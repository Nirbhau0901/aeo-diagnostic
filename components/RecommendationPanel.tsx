"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecommendationPanelProps {
  tips: string[]
}

const IMPACT_CYCLE = ["high", "high", "medium", "medium", "low"] as const
const CATEGORY_CYCLE = ["Content", "Authority", "Schema", "Content", "Authority"]

const impactColors: Record<string, string> = {
  high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export function RecommendationPanel({ tips }: RecommendationPanelProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AEO Improvement Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, i) => {
          const impact = IMPACT_CYCLE[i % IMPACT_CYCLE.length]
          const category = CATEGORY_CYCLE[i % CATEGORY_CYCLE.length]

          return (
            <div
              key={i}
              className="p-4 rounded-lg border bg-secondary/10 border-border/50 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs border", impactColors[impact])}
                    >
                      {impact} impact
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-secondary/50">
                      {category}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
