import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTask } from '@/hooks/useTask'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Todo: 'outline',
  InProgress: 'secondary',
  Done: 'default',
  Cancelled: 'destructive',
}

const PRIORITY_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Low: 'outline',
  Medium: 'secondary',
  High: 'default',
  Critical: 'destructive',
}

interface TaskDetailProps {
  taskId: number
  onClose: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
  const { data: task, isLoading, isError } = useTask(taskId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          {isLoading ? (
            <Skeleton className="h-6 w-3/4" />
          ) : (
            <CardTitle className="text-lg">{task?.title}</CardTitle>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 -mt-1">
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isError && (
            <p className="text-destructive text-sm">Failed to load task.</p>
          )}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ) : task ? (
            <>
              <p className="text-sm text-muted-foreground">
                {task.description ?? 'No description.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant={STATUS_VARIANT[task.status] ?? 'outline'}>{task.status}</Badge>
                <Badge variant={PRIORITY_VARIANT[task.priority] ?? 'outline'}>{task.priority}</Badge>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Creator</dt>
                <dd>{task.creatorName}</dd>
                <dt className="text-muted-foreground">Assigned to</dt>
                <dd>{task.assignedToName ?? 'Unassigned'}</dd>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{formatDate(task.createdAt)}</dd>
                <dt className="text-muted-foreground">Updated</dt>
                <dd>{formatDate(task.updatedAt)}</dd>
              </dl>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
