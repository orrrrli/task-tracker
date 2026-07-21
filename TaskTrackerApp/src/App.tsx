import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { WelcomePage } from '@/pages/WelcomePage'
import { HomePage } from '@/pages/HomePage'
import { CreateTaskPage } from '@/pages/CreateTaskPage'
import { EditTaskPage } from '@/pages/EditTaskPage'

const queryClient = new QueryClient()

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
