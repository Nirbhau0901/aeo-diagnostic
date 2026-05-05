"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ModelReportCard } from "@/components/model-report-card"
import { CompetitorMentions } from "@/components/competitor-mentions"
import { ImprovementTips } from "@/components/improvement-tips"
import { ScoreChart } from "@/components/score-chart"
import { StatCard } from "@/components/stat-card"
import {
  Bot,
  MessageSquare,
  TrendingUp,
  Target,
  Zap,
  Brain,
  Cpu,
  Sparkles,
} from "lucide-react"

const modelData = [
  {
    model: "ChatGPT",
    logo: <Bot className="w-5 h-5" />,
    grade: "A" as const,
    previousGrade: "B" as const,
    score: 92,
    mentions: 4521,
    mentionsTrend: "up" as const,
    topCategory: "Content Quality",
  },
  {
    model: "Claude",
    logo: <Brain className="w-5 h-5" />,
    grade: "A" as const,
    previousGrade: "A" as const,
    score: 88,
    mentions: 3892,
    mentionsTrend: "up" as const,
    topCategory: "Technical Accuracy",
  },
  {
    model: "Gemini",
    logo: <Sparkles className="w-5 h-5" />,
    grade: "B" as const,
    previousGrade: "C" as const,
    score: 76,
    mentions: 2847,
    mentionsTrend: "up" as const,
    topCategory: "Search Integration",
  },
  {
    model: "Perplexity",
    logo: <Zap className="w-5 h-5" />,
    grade: "B" as const,
    previousGrade: "B" as const,
    score: 74,
    mentions: 2103,
    mentionsTrend: "neutral" as const,
    topCategory: "Citation Quality",
  },
  {
    model: "Copilot",
    logo: <Cpu className="w-5 h-5" />,
    grade: "C" as const,
    previousGrade: "C" as const,
    score: 65,
    mentions: 1654,
    mentionsTrend: "down" as const,
    topCategory: "Code Generation",
  },
  {
    model: "Grok",
    logo: <MessageSquare className="w-5 h-5" />,
    grade: "C" as const,
    previousGrade: "D" as const,
    score: 58,
    mentions: 987,
    mentionsTrend: "up" as const,
    topCategory: "Real-time Data",
  },
]

const competitorData = [
  {
    name: "TechCorp AI",
    mentions: 1847,
    trend: "up" as const,
    percentage: 24,
    topModels: ["ChatGPT", "Claude", "Gemini"],
  },
  {
    name: "DataFlow Inc",
    mentions: 1432,
    trend: "down" as const,
    percentage: 18,
    topModels: ["Perplexity", "ChatGPT"],
  },
  {
    name: "Neural Systems",
    mentions: 1128,
    trend: "up" as const,
    percentage: 14,
    topModels: ["Claude", "Copilot"],
  },
  {
    name: "AIFirst Labs",
    mentions: 892,
    trend: "neutral" as const,
    percentage: 11,
    topModels: ["Gemini", "Grok"],
  },
]

const improvementTips = [
  {
    id: "1",
    title: "Add structured FAQ schema",
    description: "Implement FAQ schema markup to improve visibility in AI-generated answers and voice search results.",
    impact: "high" as const,
    category: "Schema",
  },
  {
    id: "2",
    title: "Optimize for conversational queries",
    description: "Rewrite key content to directly answer natural language questions that users ask AI assistants.",
    impact: "high" as const,
    category: "Content",
  },
  {
    id: "3",
    title: "Improve citation-worthy content",
    description: "Add original research, statistics, and expert quotes that AI models prefer to cite.",
    impact: "medium" as const,
    category: "Authority",
    completed: true,
  },
  {
    id: "4",
    title: "Update product entity data",
    description: "Ensure all product pages have complete, accurate structured data for better AI understanding.",
    impact: "medium" as const,
    category: "Schema",
  },
  {
    id: "5",
    title: "Create comparison content",
    description: "Develop detailed comparison guides that AI models frequently reference for purchase decisions.",
    impact: "low" as const,
    category: "Content",
  },
]

const scoreChartData = [
  { date: "Jan", score: 62, mentions: 1200 },
  { date: "Feb", score: 65, mentions: 1450 },
  { date: "Mar", score: 68, mentions: 1680 },
  { date: "Apr", score: 71, mentions: 2100 },
  { date: "May", score: 74, mentions: 2450 },
  { date: "Jun", score: 78, mentions: 2890 },
  { date: "Jul", score: 82, mentions: 3200 },
  { date: "Aug", score: 85, mentions: 3680 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative">
        <DashboardHeader />

        <main className="p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Overall Score"
              value="78"
              change={12}
              trend="up"
              icon={<Target className="w-5 h-5" />}
            />
            <StatCard
              title="Total Mentions"
              value="16,004"
              change={23}
              trend="up"
              icon={<MessageSquare className="w-5 h-5" />}
            />
            <StatCard
              title="AI Coverage"
              value="6/8"
              change={2}
              trend="up"
              icon={<Bot className="w-5 h-5" />}
            />
            <StatCard
              title="Improvement Rate"
              value="+15%"
              change={5}
              trend="up"
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score chart */}
              <ScoreChart data={scoreChartData} />

              {/* AI Model Report Cards */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">AI Model Report Cards</h2>
                  <span className="text-sm text-muted-foreground">6 models tracked</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelData.map((model) => (
                    <ModelReportCard key={model.model} {...model} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CompetitorMentions competitors={competitorData} />
              <ImprovementTips tips={improvementTips} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
