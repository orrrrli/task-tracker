import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import App from '@/App'

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

beforeAll(() => {
  globalThis.fetch = (async (url: RequestInfo | URL) => {
    const urlStr = String(url)
    if (urlStr.includes('/tasks') && !urlStr.match(/\/tasks\/\d/)) {
      return new Response(JSON.stringify({ data: [mockTask] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }) as typeof fetch
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

afterEach(() => {
  cleanup()
})

describe('responsive layout', () => {
  it('renders main container with mobile-first padding', () => {
    render(<App />)
    const container = document.querySelector('.min-h-screen')
    expect(container).toBeInTheDocument()
    expect(container!.className).toMatch(/p-4/)
    expect(container!.className).toMatch(/sm:p-6/)
    expect(container!.className).toMatch(/md:p-8/)
  })

  it('renders header with responsive flex direction and title size', () => {
    render(<App />)
    const header = document.querySelector('.flex.flex-col.sm\\:flex-row')
    expect(header).toBeInTheDocument()

    const title = screen.getByText('Task Tracker')
    expect(title.className).toMatch(/text-2xl/)
    expect(title.className).toMatch(/sm:text-3xl/)
    expect(title.className).toMatch(/md:text-4xl/)
  })

  it('renders create button with full width on mobile', () => {
    render(<App />)
    const button = screen.getByText('Create Task')
    expect(button.className).toMatch(/w-full/)
    expect(button.className).toMatch(/sm:w-auto/)
  })

  it('renders filter selects with full width on mobile', () => {
    render(<App />)
    const statusTrigger = screen.getByText('All Status')
    expect(statusTrigger.parentElement?.className).toMatch(/w-full/)
    expect(statusTrigger.parentElement?.className).toMatch(/sm:w-40/)
  })

  it('renders task list grid with responsive columns', () => {
    render(<App />)
    const grid = document.querySelector('.grid.gap-3')
    expect(grid).toBeInTheDocument()
    expect(grid!.className).toMatch(/sm:grid-cols-2/)
    expect(grid!.className).toMatch(/lg:grid-cols-3/)
  })
})
