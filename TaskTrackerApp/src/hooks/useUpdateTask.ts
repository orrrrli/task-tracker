import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, type UpdateTaskRequest } from '@/api/api'
import { ValidationError, parseValidationErrors } from '@/lib/ValidationError'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: UpdateTaskRequest }) => {
      const res = await updateTask(id, request)
      if (res.status === 200) return res.data.data
      const errorBody = (res as any).data
      if (errorBody?.error?.code === 'Validation') {
        throw new ValidationError(parseValidationErrors(errorBody.error.message))
      }
      throw new Error(errorBody?.error?.message ?? 'Failed to update task')
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
    },
  })
}
