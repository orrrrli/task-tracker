import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUpdateTask } from '@/hooks/useUpdateTask'

const originalFetch = globalThis.fetch

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: null,
  status: 'Todo' as const,
  priority: 'Medium' as const,
  assignedToId: null,
  assignedToName: null,
  creatorId: 1,
  creatorName: 'Test User',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

afterAll(() => {
  globalThis.fetch = originalFetch
})

describe('useUpdateTask', () => {
  it('succeeds on 200 and returns task data', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ data: mockTask }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    const { result } = renderHook(() => useUpdateTask(), { wrapper })
    const mutationResult = await result.current.mutateAsync({
      id: 1,
      request: { title: 'Updated', description: null, status: null, priority: null, assignedToId: null },
    })

    expect(mutationResult).toEqual(mockTask)
  })

  it('throws on 404 with task not found message', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({}), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    const { result } = renderHook(() => useUpdateTask(), { wrapper })

    await expect(
      result.current.mutateAsync({
        id: 999,
        request: { title: null, description: null, status: null, priority: null, assignedToId: null },
      }),
    ).rejects.toThrow('Task not found')
  })

  it('throws on 400 with validation message', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ success: false, error: { code: 'Validation', message: 'Title: Title is required.' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    const { result } = renderHook(() => useUpdateTask(), { wrapper })

    await expect(
      result.current.mutateAsync({
        id: 1,
        request: { title: null, description: null, status: null, priority: null, assignedToId: null },
      }),
    ).rejects.toThrow('Title: Title is required.')
  })

  it('invalidates task queries on success', async () => {
    const queryClient = new QueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ data: mockTask }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    const customWrapper = ({ children }: { children: React.ReactNode }) =>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

    const { result } = renderHook(() => useUpdateTask(), { wrapper: customWrapper })

    await result.current.mutateAsync({
      id: 1,
      request: { title: 'Updated', description: null, status: null, priority: null, assignedToId: null },
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['task', 1] })
  })
})
