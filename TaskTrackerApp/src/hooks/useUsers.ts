import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '@/api/api'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await getAllUsers()
      return res.data.data ?? []
    },
  })
}
