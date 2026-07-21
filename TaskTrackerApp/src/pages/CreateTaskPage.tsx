import { useNavigate } from 'react-router-dom'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'
import { useCreateTask } from '@/hooks/useCreateTask'
import { ValidationError } from '@/lib/ValidationError'
import { getCurrentUserId } from '@/lib/auth'

export function CreateTaskPage() {
  const navigate = useNavigate()
  const createTask = useCreateTask()

  const handleSubmit = (data: TaskFormData) => {
    createTask.mutate(
      { ...data, creatorId: getCurrentUserId() },
      { onSuccess: () => navigate('/tasks') }
    )
  }

  const createFieldErrors = createTask.error instanceof ValidationError
    ? createTask.error.fieldErrors
    : undefined

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
          fieldErrors={createFieldErrors}
        />
        {createTask.isError && !(createTask.error instanceof ValidationError) && (
          <p className="text-destructive text-sm mt-2">
            Failed to create task: {createTask.error instanceof Error ? createTask.error.message : 'Unknown error'}
          </p>
        )}
      </div>
    </div>
  )
}
