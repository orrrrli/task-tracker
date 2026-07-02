import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, type CreateTaskRequest } from '@/api/api'

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: CreateTaskRequest) => {
      const res = await createTask(request)
      if (res.status !== 201) throw new Error('Failed to create task')
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
