import { Button } from '@/components/ui/button'
import type { AuthUser } from '@/lib/auth'

interface NavbarProps {
  authUser: AuthUser | null
  onLogout: () => void
}

export function Navbar({ authUser, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold tracking-wide text-gray-900">Dallio Workspace</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {authUser ? authUser.name : 'Invitado'}
          </span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Salir
          </Button>
        </div>
      </div>
    </nav>
  )
}
