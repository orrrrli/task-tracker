import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskFilters } from '@/molecules/TaskFilters'
import { TaskList } from '@/organisms/TaskList'
import { useSearchParam } from '@/hooks/useSearchParam'
import type { GetAllTasksParams, NullableOfTaskItemStatus2, NullableOfTaskItemPriority2 } from '@/api/api'

const queryClient = new QueryClient()

function App() {
  const [status, setStatus] = useSearchParam('status', 'all')
  const [priority, setPriority] = useSearchParam('priority', 'all')

  const filters: GetAllTasksParams = {
    status: status === 'all' ? undefined : status as NullableOfTaskItemStatus2,
    priority: priority === 'all' ? undefined : priority as NullableOfTaskItemPriority2,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Task Tracker</h1>
        <TaskFilters status={status} priority={priority} onStatusChange={setStatus} onPriorityChange={setPriority} />
        <TaskList filters={filters} />
      </div>
    </QueryClientProvider>
  )
}

export default App
