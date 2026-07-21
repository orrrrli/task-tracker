import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { TaskItemPriority, TaskItemStatus } from '@/api/api'
import { STATUS_LABEL } from '@/lib/taskStatus'

interface TaskFiltersProps {
  searchText: string
  priority: string
  status: string
  showAll: boolean
  onSearchChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onStatusChange: (value: string) => void
  onShowAllChange: (value: boolean) => void
}

export function TaskFilters({
  searchText,
  priority,
  status,
  showAll,
  onSearchChange,
  onPriorityChange,
  onStatusChange,
  onShowAllChange,
}: TaskFiltersProps) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-9 bg-white border-gray-200"
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-44 bg-white border-gray-200">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {(Object.keys(TaskItemPriority) as Array<keyof typeof TaskItemPriority>).map(p => (
            <SelectItem key={p} value={TaskItemPriority[p]}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40 bg-white border-gray-200">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {(Object.keys(TaskItemStatus) as Array<keyof typeof TaskItemStatus>).map(s => (
            <SelectItem key={s} value={TaskItemStatus[s]}>{STATUS_LABEL[s] ?? s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={showAll ? 'all' : 'mine'}
        onValueChange={(v) => onShowAllChange(v === 'all')}
      >
        <SelectTrigger className="w-36 bg-white border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Everyone</SelectItem>
          <SelectItem value="mine">Mine</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
