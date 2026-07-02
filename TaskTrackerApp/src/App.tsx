import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold mb-8">Task Tracker</h1>
        <Button>Hello shadcn</Button>
      </div>
    </QueryClientProvider>
  )
}

export default App
