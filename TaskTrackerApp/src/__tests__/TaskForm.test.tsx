import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { TaskForm, type TaskFormData } from '@/organisms/TaskForm'

vi.mock('@/hooks/useUsers', () => ({
  useUsers: () => ({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

afterEach(() => {
  cleanup()
})

describe('TaskForm server-side field errors', () => {
  it('displays title field error when fieldErrors.title is provided', () => {
    render(<TaskForm onSubmit={vi.fn()} fieldErrors={{ title: 'Title must not exceed 200 characters.' }} />)
    expect(screen.getByText('Title must not exceed 200 characters.')).toBeInTheDocument()
  })

  it('displays description field error when fieldErrors.description is provided', () => {
    render(<TaskForm onSubmit={vi.fn()} fieldErrors={{ description: 'Description is too long.' }} />)
    expect(screen.getByText('Description is too long.')).toBeInTheDocument()
  })

  it('renders no field error paragraphs when fieldErrors is undefined', () => {
    const { container } = render(<TaskForm onSubmit={vi.fn()} />)
    expect(container.querySelectorAll('p.text-destructive')).toHaveLength(0)
  })

  it('clears title field error when user types in title', () => {
    render(<TaskForm onSubmit={vi.fn()} fieldErrors={{ title: 'Title must not exceed 200 characters.' }} />)
    expect(screen.getByText('Title must not exceed 200 characters.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'New title' } })

    expect(screen.queryByText('Title must not exceed 200 characters.')).not.toBeInTheDocument()
  })

  it('clears description field error when user types in description', () => {
    render(<TaskForm onSubmit={vi.fn()} fieldErrors={{ description: 'Description is too long.' }} />)
    expect(screen.getByText('Description is too long.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'New description' } })

    expect(screen.queryByText('Description is too long.')).not.toBeInTheDocument()
  })
})

describe('TaskForm client-side validation', () => {
  it('shows "Title is required" error when submitting with empty title', async () => {
    const onSubmit = vi.fn()
    const { container } = render(<TaskForm onSubmit={onSubmit} />)

    fireEvent.submit(container.querySelector('form')!)

    expect(screen.getByText('Title is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears error when typing in title after validation error', async () => {
    const onSubmit = vi.fn()
    const { container } = render(<TaskForm onSubmit={onSubmit} />)

    fireEvent.submit(container.querySelector('form')!)
    expect(screen.getByText('Title is required')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'A' } })

    expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
  })

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn()
    const { container } = render(<TaskForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'My Task' } })
    fireEvent.submit(container.querySelector('form')!)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const data: TaskFormData = onSubmit.mock.calls[0][0]
    expect(data.title).toBe('My Task')
    expect(data.description).toBe(null)
    expect(data.priority).toBe('Medium')
    expect(data.assignedToId).toBe(null)
  })

  it('trims whitespace from title and description', async () => {
    const onSubmit = vi.fn()
    const { container } = render(<TaskForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: '  Trimmed  ' } })
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: '  Desc  ' } })
    fireEvent.submit(container.querySelector('form')!)

    const data: TaskFormData = onSubmit.mock.calls[0][0]
    expect(data.title).toBe('Trimmed')
    expect(data.description).toBe('Desc')
  })
})
