import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskFilters } from '@/molecules/TaskFilters'
import { TaskList } from '@/organisms/TaskList'
import { TaskDetail } from '@/organisms/TaskDetail'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'
import { useSearchParam } from '@/hooks/useSearchParam'
import { useCreateTask } from '@/hooks/useCreateTask'
import { Button } from '@/components/ui/button'
import type { GetAllTasksParams, GetAllTasksStatus, GetAllTasksPriority } from '@/api/api'

const queryClient = new QueryClient()

function App() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [status, setStatus] = useSearchParam('status', 'all')
  const [priority, setPriority] = useSearchParam('priority', 'all')
  const [sortBy, setSortBy] = useSearchParam('sortBy', '')
  const [sortDescParam, setSortDescParam] = useSearchParam('sortDesc', 'false')
  const createTask = useCreateTask()

  const sortDesc = sortDescParam === 'true'

  const filters: GetAllTasksParams = {
    status: status === 'all' ? undefined : status as GetAllTasksStatus,
    priority: priority === 'all' ? undefined : priority as GetAllTasksPriority,
    sortBy: sortBy || undefined,
    sortDesc: sortBy ? sortDesc : undefined,
  }

  const handleCreateSubmit = (data: TaskFormData) => {
    createTask.mutate(
      { ...data, creatorId: 2 },
      { onSuccess: () => setShowCreateForm(false) }
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Task Tracker</h1>
          <Button onClick={() => setShowCreateForm(true)}>Create Task</Button>
        </div>

        {showCreateForm && (
          <div className="mb-6">
            <TaskForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setShowCreateForm(false)}
            />
            {createTask.isError && (
              <p className="text-destructive text-sm mt-2">
                Failed to create task: {createTask.error instanceof Error ? createTask.error.message : 'Unknown error'}
              </p>
            )}
          </div>
        )}

        <TaskFilters
          status={status}
          priority={priority}
          sortBy={sortBy}
          sortDesc={sortDesc}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onSortByChange={setSortBy}
          onSortDescChange={(val) => setSortDescParam(String(val))}
        />
        <TaskList filters={filters} onSelect={setSelectedTaskId} />
      </div>
      {selectedTaskId !== null && (
        <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      )}
    </QueryClientProvider>
  )
}

export default App
