import { useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { TaskFilters } from '@/molecules/TaskFilters'
import { KanbanBoard } from '@/organisms/TaskList'
import { TaskDetail } from '@/organisms/TaskDetail'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'
import { useSearchParam } from '@/hooks/useSearchParam'
import { useCreateTask } from '@/hooks/useCreateTask'
import { useUpdateTask } from '@/hooks/useUpdateTask'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTask } from '@/hooks/useTask'
import type { GetAllTasksParams, GetAllTasksPriority, GetAllTasksStatus } from '@/api/api'
import { ValidationError } from '@/lib/ValidationError'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { useLogout } from '@/hooks/useAuth'
import { getUser, getCurrentUserId, type AuthUser } from '@/lib/auth'
import { WelcomePage } from '@/pages/WelcomePage'

const queryClient = new QueryClient()

const STATUS_ORDER = ['Todo', 'InProgress', 'Done', 'Cancelled'] as const

const STATUS_LABEL: Record<string, string> = {
  Todo: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done',
  Cancelled: 'Cancelled',
}

const STATUS_DOT: Record<string, string> = {
  Todo: 'bg-gray-400',
  InProgress: 'bg-blue-500',
  Done: 'bg-green-500',
  Cancelled: 'bg-red-500',
}

function HomePage() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [searchText, setSearchText] = useSearchParam('search', '')
  const [priority, setPriority] = useSearchParam('priority', 'all')
  const [status, setStatus] = useSearchParam('status', 'all')
  const [showAll, setShowAll] = useSearchParam('showAll', 'true')
  const [authUser, setAuthUser] = useState<AuthUser | null>(getUser())
  const navigate = useNavigate()
  const logout = useLogout()

  const creatorId = showAll === 'true' ? undefined : getCurrentUserId()
  const filters: GetAllTasksParams = {
    priority: priority === 'all' ? undefined : priority as GetAllTasksPriority,
    status: status === 'all' ? undefined : status as GetAllTasksStatus,
    creatorId,
  }

  const { data: allTasks = [], isLoading } = useTasks(filters)

  const tasks = useMemo(() => {
    if (!searchText.trim()) return allTasks
    const lower = searchText.toLowerCase()
    return allTasks.filter(t => t.title.toLowerCase().includes(lower))
  }, [allTasks, searchText])

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todo: 0, InProgress: 0, Done: 0, Cancelled: 0 }
    tasks.forEach(t => { c[t.status] = (c[t.status] ?? 0) + 1 })
    return c
  }, [tasks])

  const handleLogout = () => {
    logout()
    setAuthUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold tracking-wide text-gray-900">Dallio Workspace</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {authUser ? authUser.name : 'Invitado'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Task Tracker</h1>
            <p className="text-sm text-gray-500 mt-1">{tasks.length} tasks across 4 stages</p>
          </div>
          <Button
            className="bg-gray-900 hover:bg-gray-800 text-white"
            onClick={() => navigate('/create')}
          >
            + New task
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATUS_ORDER.map(status => (
            <div key={status} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                <span className="text-sm text-gray-600">{STATUS_LABEL[status]}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{counts[status] ?? 0}</p>
            </div>
          ))}
        </div>

        <TaskFilters
          searchText={searchText}
          priority={priority}
          status={status}
          showAll={showAll === 'true'}
          onSearchChange={setSearchText}
          onPriorityChange={setPriority}
          onStatusChange={setStatus}
          onShowAllChange={(v) => setShowAll(String(v))}
        />

        <KanbanBoard tasks={tasks} isLoading={isLoading} onSelect={setSelectedTaskId} />

        {selectedTaskId !== null && (
          <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
        )}
      </div>
    </div>
  )
}

function CreateTaskPage() {
  const navigate = useNavigate()
  const createTask = useCreateTask()

  const handleSubmit = (data: TaskFormData) => {
    createTask.mutate(
      { ...data, creatorId: getCurrentUserId() },
      { onSuccess: () => navigate('/tasks') }
    )
  }

  const createFieldErrors = createTask.error instanceof ValidationError
    ? createTask.error.fieldErrors
    : undefined

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
          fieldErrors={createFieldErrors}
        />
        {createTask.isError && !(createTask.error instanceof ValidationError) && (
          <p className="text-destructive text-sm mt-2">
            Failed to create task: {createTask.error instanceof Error ? createTask.error.message : 'Unknown error'}
          </p>
        )}
      </div>
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
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-destructive">Task not found.</p>
        </div>
      </div>
    )
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
      { onSuccess: () => navigate('/tasks') }
    )
  }

  const updateFieldErrors = updateTaskMutation.error instanceof ValidationError
    ? updateTaskMutation.error.fieldErrors
    : undefined

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <TaskForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
          fieldErrors={updateFieldErrors}
        />
        {updateTaskMutation.isError && !(updateTaskMutation.error instanceof ValidationError) && (
          <p className="text-destructive text-sm mt-2">
            Failed to update task: {updateTaskMutation.error instanceof Error ? updateTaskMutation.error.message : 'Unknown error'}
          </p>
        )}
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tasks" element={<HomePage />} />
      <Route path="/create" element={<CreateTaskPage />} />
      <Route path="/edit/:id" element={<EditTaskPage />} />
    </Routes>
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
