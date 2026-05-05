"use client"

import { cn } from "@/lib/utils"

type Grade = "A" | "B" | "C" | "D" | "F"

interface GradeBadgeProps {
  grade: Grade
  size?: "sm" | "md" | "lg"
  className?: string
}

const gradeColors: Record<Grade, string> = {
  A: "bg-grade-a text-grade-a-foreground",
  B: "bg-grade-b text-grade-b-foreground",
  C: "bg-grade-c text-grade-c-foreground",
  D: "bg-grade-d text-grade-d-foreground",
  F: "bg-grade-f text-grade-f-foreground",
}

const gradeGradients: Record<Grade, string> = {
  A: "from-emerald-500 to-emerald-600",
  B: "from-teal-500 to-cyan-500",
  C: "from-amber-400 to-yellow-500",
  D: "from-orange-400 to-orange-500",
  F: "from-red-500 to-rose-500",
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-xl",
  lg: "w-16 h-16 text-2xl",
}

export function GradeBadge({ grade, size = "md", className }: GradeBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-br font-bold flex items-center justify-center text-white shadow-lg",
        gradeGradients[grade],
        sizeClasses[size],
        className
      )}
    >
      {grade}
    </div>
  )
}
