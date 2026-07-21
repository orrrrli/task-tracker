import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TaskFilters } from '@/molecules/TaskFilters'
import { StatusStatsGrid } from '@/molecules/StatusStatsGrid'
import { KanbanBoard } from '@/organisms/TaskList'
import { TaskDetail } from '@/organisms/TaskDetail'
import { Navbar } from '@/organisms/Navbar'
import { useSearchParam } from '@/hooks/useSearchParam'
import { useTasks } from '@/hooks/useTasks'
import { Button } from '@/components/ui/button'
import type { GetAllTasksParams, GetAllTasksPriority, GetAllTasksStatus } from '@/api/api'
import { useLogout } from '@/hooks/useAuth'
import { getUser, getCurrentUserId, type AuthUser } from '@/lib/auth'

export function HomePage() {
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
      <Navbar authUser={authUser} onLogout={handleLogout} />
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

        <StatusStatsGrid counts={counts} />

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
