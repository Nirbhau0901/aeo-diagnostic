import { Lightbulb } from 'lucide-react'

interface RecommendationPanelProps {
  tips: string[]
}

const TIP_ICONS = ['🎯', '📝', '⭐', '🔗', '📊', '💬', '🚀']

export function RecommendationPanel({ tips }: RecommendationPanelProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="size-5 text-amber-600" />
        <h3 className="text-base font-semibold text-amber-900">AEO Improvement Tips</h3>
      </div>

      {tips.length === 0 ? (
        <p className="text-sm text-amber-700">No tips available.</p>
      ) : (
        <ol className="space-y-3">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                {i + 1}
              </span>
              <div className="flex min-w-0 gap-2">
                <span className="shrink-0 text-base">{TIP_ICONS[i % TIP_ICONS.length]}</span>
                <p className="text-sm leading-relaxed text-amber-900">{tip}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
