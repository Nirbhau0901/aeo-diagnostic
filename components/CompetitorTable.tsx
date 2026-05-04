interface CompetitorTableProps {
  mentions: Record<string, number>
}

export function CompetitorTable({ mentions }: CompetitorTableProps) {
  const entries = Object.entries(mentions).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(([, count]) => count), 1)

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-zinc-900">Competitor Mentions</h3>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-500">No competitors tracked.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([name, count]) => (
            <div key={name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-800">{name}</span>
                <span className="text-zinc-500">
                  {count} {count === 1 ? 'mention' : 'mentions'}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
