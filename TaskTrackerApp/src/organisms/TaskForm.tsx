import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUsers } from '@/hooks/useUsers'
import { TaskItemPriority, TaskItemStatus, type TaskItemPriority as TaskItemPriorityType, type TaskItemStatus as TaskItemStatusType } from '@/api/api'

export interface TaskFormData {
  title: string
  description: string | null
  priority: TaskItemPriorityType
  assignedToId: number | null
  status?: TaskItemStatusType
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void
  onCancel?: () => void
  initialData?: TaskFormData
}

const UNASSIGNED_VALUE = 'unassigned'

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const isEdit = !!initialData
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [priority, setPriority] = useState<TaskItemPriorityType>(initialData?.priority ?? TaskItemPriority.Medium)
  const [assignedToId, setAssignedToId] = useState<string>(initialData?.assignedToId != null ? String(initialData.assignedToId) : UNASSIGNED_VALUE)
  const [status, setStatus] = useState<TaskItemStatusType>(initialData?.status ?? TaskItemStatus.Todo)
  const [error, setError] = useState<string | null>(null)
  const { data: users, isLoading: isLoadingUsers, isError: isUsersError, error: usersError } = useUsers()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    setError(null)
    onSubmit({
      title: trimmedTitle,
      description: description.trim() || null,
      priority,
      assignedToId: assignedToId === UNASSIGNED_VALUE ? null : Number(assignedToId),
      status,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Task' : 'Create Task'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError(null)
              }}
              placeholder="Task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskItemPriorityType)}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskItemPriority).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskItemStatusType)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskItemStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={assignedToId}
              onValueChange={setAssignedToId}
              disabled={isLoadingUsers}
            >
              <SelectTrigger id="assignee" className="w-full">
                <SelectValue placeholder={isLoadingUsers ? 'Loading users...' : 'Assignee'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isUsersError && (
              <p className="text-destructive text-xs">
                Failed to load users: {usersError instanceof Error ? usersError.message : 'Unknown error'}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{isEdit ? 'Save Changes' : 'Create Task'}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
