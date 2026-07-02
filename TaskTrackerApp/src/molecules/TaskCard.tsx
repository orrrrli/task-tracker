import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TaskResult } from '@/api/api'

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

interface TaskCardProps {
  task: TaskResult
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card
      className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : undefined}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 items-center">
        <Badge variant={STATUS_VARIANT[task.status] ?? 'outline'}>{task.status}</Badge>
        <Badge variant={PRIORITY_VARIANT[task.priority] ?? 'outline'}>{task.priority}</Badge>
        <span className="text-sm text-muted-foreground ml-auto">
          {task.assignedToName ?? 'Unassigned'}
        </span>
      </CardContent>
    </Card>
  )
}
