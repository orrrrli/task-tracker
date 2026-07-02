import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskList } from '@/organisms/TaskList'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Task Tracker</h1>
        <TaskList />
      </div>
    </QueryClientProvider>
  )
}

export default App
