"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
  icon: React.ReactNode
  className?: string
}

export function StatCard({ title, value, change, trend = "neutral", icon, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {change !== undefined && (
                <span className={cn(
                  "text-xs flex items-center gap-0.5",
                  trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-muted-foreground"
                )}>
                  {trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {trend === "down" && <TrendingDown className="w-3 h-3" />}
                  {trend === "neutral" && <Minus className="w-3 h-3" />}
                  {change > 0 ? "+" : ""}{change}%
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
