import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from '@/molecules/TaskCard'
import type { TaskResult } from '@/api/api'

const STATUS_ORDER = ['Todo', 'InProgress', 'Done', 'Cancelled'] as const
type Status = typeof STATUS_ORDER[number]

const STATUS_LABEL: Record<Status, string> = {
  Todo: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done',
  Cancelled: 'Cancelled',
}

const STATUS_DOT: Record<Status, string> = {
  Todo: 'bg-gray-400',
  InProgress: 'bg-blue-500',
  Done: 'bg-green-500',
  Cancelled: 'bg-red-500',
}

interface KanbanBoardProps {
  tasks: TaskResult[]
  isLoading: boolean
  onSelect: (id: number) => void
}

export function KanbanBoard({ tasks, isLoading, onSelect }: KanbanBoardProps) {
  const grouped = useMemo(() => {
    const g: Record<Status, TaskResult[]> = { Todo: [], InProgress: [], Done: [], Cancelled: [] }
    tasks.forEach(t => {
      if (t.status in g) g[t.status as Status].push(t)
    })
    return g
  }, [tasks])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUS_ORDER.map(status => (
        <div key={status} className="bg-gray-200/60 rounded-xl p-3 min-h-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
            <span className="text-sm font-medium text-gray-700">{STATUS_LABEL[status]}</span>
            <span className="text-sm text-gray-400 ml-0.5">{grouped[status].length}</span>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : (
            <div className="space-y-2">
              {grouped[status].map(task => (
                <TaskCard key={task.id} task={task} onClick={() => onSelect(task.id)} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
