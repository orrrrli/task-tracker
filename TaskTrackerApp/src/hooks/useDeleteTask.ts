import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/api/api'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteTask(id)
      if (res.status !== 204) throw new Error('Failed to delete task')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
