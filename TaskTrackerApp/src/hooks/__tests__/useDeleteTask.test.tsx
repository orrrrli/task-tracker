import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDeleteTask } from '@/hooks/useDeleteTask'
import { deleteTask, type deleteTaskResponse } from '@/api/api'

vi.mock('@/api/api', () => ({
  deleteTask: vi.fn(),
}))

const mockDeleteTask = deleteTask as ReturnType<typeof vi.fn>

function TestComponent({ taskId }: { taskId: number }) {
  const mutation = useDeleteTask()
  return (
    <div>
      <button data-testid="delete-btn" onClick={() => mutation.mutate(taskId)}>Delete</button>
      {mutation.isSuccess && <span data-testid="success">Success</span>}
      {mutation.isError && <span data-testid="error">Error</span>}
      {mutation.error && <span data-testid="error-msg">{mutation.error.message}</span>}
    </div>
  )
}

describe('useDeleteTask', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('calls deleteTask with correct id', async () => {
    mockDeleteTask.mockResolvedValueOnce({ status: 204 } as deleteTaskResponse)
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent taskId={42} />
      </QueryClientProvider>
    )
    screen.getByTestId('delete-btn').click()
    await waitFor(() => expect(mockDeleteTask).toHaveBeenCalledWith(42))
  })

  it('shows success state on 204 response', async () => {
    mockDeleteTask.mockResolvedValueOnce({ status: 204 } as deleteTaskResponse)
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent taskId={1} />
      </QueryClientProvider>
    )
    screen.getByTestId('delete-btn').click()
    await waitFor(() => expect(screen.getByTestId('success')).toBeInTheDocument())
  })

  it('shows error state on non-204 response', async () => {
    mockDeleteTask.mockResolvedValueOnce({ status: 404 } as deleteTaskResponse)
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent taskId={1} />
      </QueryClientProvider>
    )
    screen.getByTestId('delete-btn').click()
    await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByTestId('error-msg')).toHaveTextContent('Task not found'))
  })
})
