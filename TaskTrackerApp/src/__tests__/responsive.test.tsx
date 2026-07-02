import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import App from '@/App'

const originalFetch = globalThis.fetch

beforeAll(() => {
  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ success: true, data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }) as typeof fetch
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

afterEach(() => {
  cleanup()
})

describe('app routing', () => {
  it('renders welcome page on root path', () => {
    render(<App />)
    const invitedButton = screen.getByText('Entrar como Invitado')
    expect(invitedButton).toBeInTheDocument()
    const loginButton = screen.getByText('Iniciar Sesión')
    expect(loginButton).toBeInTheDocument()
  })

  it('renders login and register links on welcome page', () => {
    render(<App />)
    const loginButton = screen.getByText('Iniciar Sesión')
    const registerButton = screen.getByText('Crear Cuenta')
    expect(loginButton).toBeInTheDocument()
    expect(registerButton).toBeInTheDocument()
  })
})
