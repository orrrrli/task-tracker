import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, type CreateTaskRequest } from '@/api/api'

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: CreateTaskRequest) => {
      const res = await createTask(request)
      if (res.status === 201) return res.data.data
      const errorBody = (res as any).data
      throw new Error(errorBody?.error?.message ?? 'Failed to create task')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
