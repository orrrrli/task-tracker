import type { TaskResult } from '@/api/api'

const PRIORITY_DOT: Record<string, string> = {
  Low: 'bg-gray-400',
  Medium: 'bg-blue-500',
  High: 'bg-orange-500',
  Critical: 'bg-red-500',
}

const PRIORITY_BADGE: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-500',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-600',
  Critical: 'bg-red-100 text-red-600',
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0] ?? '').join('').toUpperCase().slice(0, 2)
}

interface TaskCardProps {
  task: TaskResult
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-2 mb-3">
        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority] ?? 'bg-gray-400'}`} />
        <p className="font-semibold text-sm text-gray-900 leading-snug">{task.title}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${PRIORITY_BADGE[task.priority] ?? 'bg-gray-100 text-gray-500'}`}>
          {task.priority.toUpperCase()}
        </span>
        {task.assignedToName ? (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">{getInitials(task.assignedToName)}</span>
            </div>
            <span className="text-xs text-gray-600">{task.assignedToName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-500 text-xs font-bold">?</span>
            </div>
            <span className="text-xs text-gray-500">Unassigned</span>
          </div>
        )}
      </div>
    </div>
  )
}
