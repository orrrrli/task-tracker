import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import { TaskFilters } from '@/molecules/TaskFilters'
import { TaskList } from '@/organisms/TaskList'
import { TaskDetail } from '@/organisms/TaskDetail'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'
import { useSearchParam } from '@/hooks/useSearchParam'
import { useCreateTask } from '@/hooks/useCreateTask'
import { useUpdateTask } from '@/hooks/useUpdateTask'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTask } from '@/hooks/useTask'
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
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold cursor-pointer" onClick={() => navigate('/')}>Task Tracker</h1>
        {isHome && (
          <Button className="w-full sm:w-auto" onClick={() => navigate('/create')}>Create Task</Button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateTaskPage />} />
        <Route path="/edit/:id" element={<EditTaskPage />} />
      </Routes>
    </div>
  )
}

function EditTaskPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const taskId = id ? Number(id) : null
  const { data: task, isLoading } = useTask(taskId)
  const updateTaskMutation = useUpdateTask()

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!task) {
    return <p className="text-destructive">Task not found.</p>
  }

  const initialData: TaskFormData = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignedToId: task.assignedToId,
    status: task.status,
  }

  const handleSubmit = (data: TaskFormData) => {
    updateTaskMutation.mutate(
      {
        id: taskId!,
        request: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          assignedToId: data.assignedToId,
          status: data.status ?? null,
        },
      },
      { onSuccess: () => navigate('/') }
    )
  }

  return (
    <>
      <TaskForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
      {updateTaskMutation.isError && (
        <p className="text-destructive text-sm mt-2">
          Failed to update task: {updateTaskMutation.error instanceof Error ? updateTaskMutation.error.message : 'Unknown error'}
        </p>
      )}
    </>
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
