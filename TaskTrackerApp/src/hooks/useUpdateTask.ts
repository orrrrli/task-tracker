import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, type UpdateTaskRequest } from '@/api/api'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: UpdateTaskRequest }) => {
      const res = await updateTask(id, request)
      if (res.status !== 200) throw new Error('Failed to update task')
      return res.data.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
    },
  })
}
