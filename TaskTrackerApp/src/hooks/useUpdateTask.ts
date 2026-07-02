import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, type UpdateTaskRequest } from '@/api/api'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: UpdateTaskRequest }) => {
      const res = await updateTask(id, request)
      if (res.status === 200) return res.data.data
      if (res.status === 404) throw new Error('Task not found')
      if (res.status === 400) {
        const errorBody = (res as any).data
        throw new Error(errorBody?.error?.message ?? 'Validation failed')
      }
      throw new Error('Failed to update task')
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
    },
  })
}
