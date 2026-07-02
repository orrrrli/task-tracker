import { useQuery } from '@tanstack/react-query'
import { getTaskById } from '@/api/api'
import type { ApiSuccessResponseOfTaskResult } from '@/api/api'

export function useTask(id: number | null) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await getTaskById(id!)
      if (res.status === 404) throw new Error('Task not found')
      return (res.data as ApiSuccessResponseOfTaskResult).data
    },
    enabled: id !== null,
  })
}
