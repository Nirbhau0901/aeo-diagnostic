"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GradeBadge } from "@/components/grade-badge"
import { TrendingUp, TrendingDown, Minus, Bot, Brain, Sparkles, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ModelResult } from "@/types"

interface ModelCardProps {
  result: ModelResult
  brandName: string
}

type Grade = "A" | "B" | "C" | "D" | "F"

const MODEL_LOGOS: Record<string, React.ReactNode> = {
  "GPT-4o Mini": <Bot className="w-5 h-5" />,
  "Claude Haiku 4.5": <Brain className="w-5 h-5" />,
  "Gemini 2.5 Flash": <Sparkles className="w-5 h-5" />,
  "Llama 3.3 70B": <Cpu className="w-5 h-5" />,
}

const MODEL_PROVIDER: Record<string, string> = {
  "GPT-4o Mini": "OpenAI",
  "Claude Haiku 4.5": "Anthropic",
  "Gemini 2.5 Flash": "Google",
  "Llama 3.3 70B": "Groq / Meta",
}

function highlightBrand(text: string, highlight: string) {
  if (!highlight.trim()) return <>{text}</>
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  const lower = highlight.toLowerCase()
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === lower ? (
          <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5 not-italic">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  )
}

function renderInline(text: string, brandName: string) {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/)
  if (boldParts.length === 1) return highlightBrand(text, brandName)
  return (
    <>
      {boldParts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {highlightBrand(part.slice(2, -2), brandName)}
          </strong>
        ) : (
          <span key={i}>{highlightBrand(part, brandName)}</span>
        )
      )}
    </>
  )
}

function renderMarkdown(text: string, brandName: string) {
  const lines = text.split("\n")
  return (
    <div className="space-y-0.5 text-xs leading-relaxed text-muted-foreground">
      {lines.map((line, i) => {
        if (/^#{1,3}\s/.test(line)) {
          return (
            <p key={i} className="font-semibold text-foreground mt-1.5 first:mt-0">
              {renderInline(line.replace(/^#{1,3}\s+/, ""), brandName)}
            </p>
          )
        }
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)/)?.[1]
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0 font-medium tabular-nums">{num}.</span>
              <span>{renderInline(line.replace(/^\d+\.\s+/, ""), brandName)}</span>
            </div>
          )
        }
        if (/^[-*•]\s/.test(line)) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0">•</span>
              <span>{renderInline(line.replace(/^[-*•]\s+/, ""), brandName)}</span>
            </div>
          )
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return <p key={i}>{renderInline(line, brandName)}</p>
      })}
    </div>
  )
}

export function ModelCard({ result, brandName }: ModelCardProps) {
  const logo = MODEL_LOGOS[result.model] ?? <Bot className="w-5 h-5" />
  const provider = MODEL_PROVIDER[result.model] ?? "AI Model"
  const grade = (result.grade as Grade) || "F"

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary">
              {logo}
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {result.model}
              </h3>
              <p className="text-xs text-muted-foreground">{provider}</p>
            </div>
          </div>
          <GradeBadge grade={grade} size="md" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {result.error && !result.mentioned ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive-foreground">
            Error contacting model
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{result.score}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Sentiment</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-semibold capitalize",
                      !result.mentioned
                        ? "text-muted-foreground"
                        : result.sentiment === "positive"
                          ? "text-emerald-400"
                          : result.sentiment === "negative"
                            ? "text-rose-400"
                            : "text-muted-foreground"
                    )}
                  >
                    {result.mentioned ? result.sentiment : "Not mentioned"}
                  </span>
                  {result.mentioned && result.sentiment === "positive" && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {result.mentioned && result.sentiment === "negative" && (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  {result.mentioned && result.sentiment === "neutral" && (
                    <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {result.mentioned && result.position !== null && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Ranked</span>
                <span className="font-semibold text-primary">#{result.position}</span>
              </div>
            )}

            {result.response && (
              <div className="pt-3 border-t border-border/50">
                <div className="max-h-40 overflow-y-auto rounded-lg bg-secondary/30 px-3 py-2.5">
                  {renderMarkdown(result.response, brandName)}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
