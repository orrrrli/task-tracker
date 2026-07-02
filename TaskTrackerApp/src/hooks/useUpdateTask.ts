import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, type UpdateTaskRequest } from '@/api/api'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: UpdateTaskRequest }) => {
      const res = await updateTask(id, request)
      if (res.status === 200) return res.data.data
      if (res.status === 404) throw new Error('Task not found')
      // API type only defines 200/404; cast to extract error body for other statuses
      const body = (res as any)?.data
      throw new Error(body?.error?.message ?? 'Validation failed')
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
    },
  })
}
