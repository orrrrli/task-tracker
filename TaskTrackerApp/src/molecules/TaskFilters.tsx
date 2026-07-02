import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskItemStatus, TaskItemPriority } from '@/api/api'

interface TaskFiltersProps {
  status: string
  priority: string
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
}

export function TaskFilters({ status, priority, onStatusChange, onPriorityChange }: TaskFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {(Object.keys(TaskItemStatus) as Array<keyof typeof TaskItemStatus>).map((s) => (
            <SelectItem key={s} value={TaskItemStatus[s]}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          {(Object.keys(TaskItemPriority) as Array<keyof typeof TaskItemPriority>).map((p) => (
            <SelectItem key={p} value={TaskItemPriority[p]}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
