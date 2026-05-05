"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tip {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: string
  completed?: boolean
}

interface ImprovementTipsProps {
  tips: Tip[]
  className?: string
}

const impactColors = {
  high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export function ImprovementTips({ tips, className }: ImprovementTipsProps) {
  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Improvement Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200 hover:bg-secondary/30 group cursor-pointer",
              tip.completed
                ? "bg-secondary/20 border-border/30"
                : "bg-secondary/10 border-border/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  tip.completed
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-primary/20 text-primary"
                )}
              >
                {tip.completed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4
                    className={cn(
                      "font-medium text-sm",
                      tip.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                  >
                    {tip.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={cn("text-xs border", impactColors[tip.impact])}
                  >
                    {tip.impact} impact
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs bg-secondary/50">
                    {tip.category}
                  </Badge>
                  {!tip.completed && (
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Apply fix <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
