import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateTask } from '@/hooks/useCreateTask'
import { createTask, type createTaskResponse, type CreateTaskRequest } from '@/api/api'

vi.mock('@/api/api', () => ({
  createTask: vi.fn(),
}))

const mockCreateTask = createTask as ReturnType<typeof vi.fn>

const createTaskRequest: CreateTaskRequest = {
  title: 'New Task',
  description: 'A test task',
  priority: 'Medium',
  assignedToId: null,
  creatorId: 1,
}

const mockTaskResult = {
  id: 1,
  title: 'New Task',
  description: 'A test task',
  status: 'Todo' as const,
  priority: 'Medium' as const,
  creatorId: 1,
  creatorName: 'Test User',
  assignedToId: null,
  assignedToName: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

function TestComponent({ request }: { request: CreateTaskRequest }) {
  const mutation = useCreateTask()
  return (
    <div>
      <button data-testid="create-btn" onClick={() => mutation.mutate(request)}>Create</button>
      {mutation.isSuccess && <span data-testid="success">Success</span>}
      {mutation.data && <span data-testid="task-data">{mutation.data.title}</span>}
      {mutation.isError && <span data-testid="error">Error</span>}
      {mutation.error && <span data-testid="error-msg">{mutation.error.message}</span>}
    </div>
  )
}

describe('useCreateTask', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('calls createTask with correct request', async () => {
    mockCreateTask.mockResolvedValueOnce({
      status: 201,
      data: { success: true, data: mockTaskResult },
    } as createTaskResponse)
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent request={createTaskRequest} />
      </QueryClientProvider>
    )
    screen.getByTestId('create-btn').click()
    await waitFor(() => expect(mockCreateTask).toHaveBeenCalledWith(createTaskRequest))
  })

  it('shows success state on 201 response', async () => {
    mockCreateTask.mockResolvedValueOnce({
      status: 201,
      data: { success: true, data: mockTaskResult },
    } as createTaskResponse)
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent request={createTaskRequest} />
      </QueryClientProvider>
    )
    screen.getByTestId('create-btn').click()
    await waitFor(() => expect(screen.getByTestId('success')).toBeInTheDocument())
    expect(screen.getByTestId('task-data')).toHaveTextContent('New Task')
  })

  it('shows error state on non-201 response', async () => {
    mockCreateTask.mockResolvedValueOnce({
      status: 400,
      data: { success: false, data: null },
    } as unknown as createTaskResponse)
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent request={createTaskRequest} />
      </QueryClientProvider>
    )
    screen.getByTestId('create-btn').click()
    await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByTestId('error-msg')).toHaveTextContent('Validation failed'))
  })
})
