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
import { TaskItemPriority, type TaskItemPriority as TaskItemPriorityType } from '@/api/api'

export interface TaskFormData {
  title: string
  description: string | null
  priority: TaskItemPriorityType
  assignedToId: number | null
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void
  onCancel?: () => void
}

const UNASSIGNED_VALUE = 'unassigned'

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskItemPriorityType>(TaskItemPriority.Medium)
  const [assignedToId, setAssignedToId] = useState<string>(UNASSIGNED_VALUE)
  const [error, setError] = useState<string | null>(null)
  const { data: users, isLoading: isLoadingUsers } = useUsers()

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
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
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
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Create Task</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
