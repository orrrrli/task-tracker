import { useQuery } from '@tanstack/react-query'
import { getAllTasks, type GetAllTasksParams } from '@/api/api'

export function useTasks(params?: GetAllTasksParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const res = await getAllTasks(params)
      return res.data.data ?? []
    },
  })
}
