import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { TaskFilters } from '@/molecules/TaskFilters'
import { TaskList } from '@/organisms/TaskList'
import { TaskDetail } from '@/organisms/TaskDetail'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'
import { useSearchParam } from '@/hooks/useSearchParam'
import { useCreateTask } from '@/hooks/useCreateTask'
import { Button } from '@/components/ui/button'
import type { GetAllTasksParams, GetAllTasksStatus, GetAllTasksPriority } from '@/api/api'

const queryClient = new QueryClient()

function HomePage() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [status, setStatus] = useSearchParam('status', 'all')
  const [priority, setPriority] = useSearchParam('priority', 'all')
  const [sortBy, setSortBy] = useSearchParam('sortBy', '')
  const [sortDescParam, setSortDescParam] = useSearchParam('sortDesc', 'false')

  const sortDesc = sortDescParam === 'true'

  const filters: GetAllTasksParams = {
    status: status === 'all' ? undefined : status as GetAllTasksStatus,
    priority: priority === 'all' ? undefined : priority as GetAllTasksPriority,
    sortBy: sortBy || undefined,
    sortDesc: sortBy ? sortDesc : undefined,
  }

  return (
    <>
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
      {selectedTaskId !== null && (
        <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      )}
    </>
  )
}

function CreateTaskPage() {
  const navigate = useNavigate()
  const createTask = useCreateTask()

  const handleSubmit = (data: TaskFormData) => {
    createTask.mutate(
      { ...data, creatorId: 2 },
      { onSuccess: () => navigate('/') }
    )
  }

  return (
    <>
      <TaskForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
      {createTask.isError && (
        <p className="text-destructive text-sm mt-2">
          Failed to create task: {createTask.error instanceof Error ? createTask.error.message : 'Unknown error'}
        </p>
      )}
    </>
  )
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-background text-foreground p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold cursor-pointer" onClick={() => navigate('/')}>Task Tracker</h1>
        {isHome && (
          <Button onClick={() => navigate('/create')}>Create Task</Button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateTaskPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
