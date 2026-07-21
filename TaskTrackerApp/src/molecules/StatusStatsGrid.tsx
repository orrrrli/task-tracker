import { STATUS_ORDER, STATUS_LABEL, STATUS_DOT } from '@/lib/taskStatus'

interface StatusStatsGridProps {
  counts: Record<string, number>
}

export function StatusStatsGrid({ counts }: StatusStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {STATUS_ORDER.map(status => (
        <div key={status} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
            <span className="text-sm text-gray-600">{STATUS_LABEL[status]}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{counts[status] ?? 0}</p>
        </div>
      ))}
    </div>
  )
}
