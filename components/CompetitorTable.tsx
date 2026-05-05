"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus } from "lucide-react"

interface CompetitorTableProps {
  mentions: Record<string, number>
}

export function CompetitorTable({ mentions }: CompetitorTableProps) {
  const entries = Object.entries(mentions).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(([, c]) => c), 1)

  if (entries.length === 0) return null

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Competitor Mentions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map(([name, count], index) => (
          <div key={name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
                <span className="font-medium text-foreground">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {count} {count === 1 ? 'mention' : 'mentions'}
                </span>
                <Minus className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="relative h-2 rounded-full bg-secondary/50 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
