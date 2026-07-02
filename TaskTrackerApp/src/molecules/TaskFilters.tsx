import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { TaskItemStatus, TaskItemPriority } from '@/api/api'

const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Date' },
]

interface TaskFiltersProps {
  status: string
  priority: string
  sortBy: string
  sortDesc: boolean
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onSortByChange: (value: string) => void
  onSortDescChange: (value: boolean) => void
}

export function TaskFilters({
  status,
  priority,
  sortBy,
  sortDesc,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onSortDescChange,
}: TaskFiltersProps) {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
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

      <Select value={sortBy || 'none'} onValueChange={(v) => onSortByChange(v === 'none' ? '' : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Sort</SelectItem>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {sortBy && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortDescChange(!sortDesc)}
          className="h-9 px-3"
        >
          {sortDesc ? '↓ Desc' : '↑ Asc'}
        </Button>
      )}
    </div>
  )
}
