import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from '@/molecules/TaskCard'
import { useTasks } from '@/hooks/useTasks'
import type { GetAllTasksParams } from '@/api/api'

interface TaskListProps {
  filters: GetAllTasksParams
  onSelect: (id: number) => void
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20 ml-auto" />
      </div>
    </div>
  )
}

export function TaskList({ filters, onSelect }: TaskListProps) {
  const { data: tasks, isLoading, isError, error } = useTasks(filters)

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Failed to load tasks: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    )
  }

  if (!tasks?.length) {
    return <p className="text-muted-foreground text-sm">No tasks yet.</p>
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={() => onSelect(task.id)} />
      ))}
    </div>
  )
}
