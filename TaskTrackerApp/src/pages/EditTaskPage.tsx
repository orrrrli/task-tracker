import { useNavigate, useParams } from 'react-router-dom'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'
import { useUpdateTask } from '@/hooks/useUpdateTask'
import { useTask } from '@/hooks/useTask'
import { Skeleton } from '@/components/ui/skeleton'
import { ValidationError } from '@/lib/ValidationError'

export function EditTaskPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const taskId = id ? Number(id) : null
  const { data: task, isLoading } = useTask(taskId)
  const updateTaskMutation = useUpdateTask()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-destructive">Task not found.</p>
        </div>
      </div>
    )
  }

  const initialData: TaskFormData = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignedToId: task.assignedToId,
    status: task.status,
  }

  const handleSubmit = (data: TaskFormData) => {
    updateTaskMutation.mutate(
      {
        id: taskId!,
        request: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          assignedToId: data.assignedToId,
          status: data.status ?? null,
        },
      },
      { onSuccess: () => navigate('/tasks') }
    )
  }

  const updateFieldErrors = updateTaskMutation.error instanceof ValidationError
    ? updateTaskMutation.error.fieldErrors
    : undefined

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <TaskForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
          fieldErrors={updateFieldErrors}
        />
        {updateTaskMutation.isError && !(updateTaskMutation.error instanceof ValidationError) && (
          <p className="text-destructive text-sm mt-2">
            Failed to update task: {updateTaskMutation.error instanceof Error ? updateTaskMutation.error.message : 'Unknown error'}
          </p>
        )}
      </div>
    </div>
  )
}
