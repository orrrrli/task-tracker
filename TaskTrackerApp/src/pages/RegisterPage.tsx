import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useRegister, useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const login = useLogin();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          login.mutate({ email, password }, { onSuccess: () => navigate('/tasks') });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Tracker</h1>
          <p className="text-gray-500 mt-2">Empieza a organizar tus tareas hoy</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Crear Cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  className="pl-9 w-full"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9 w-full"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9 w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {register.isError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">Error al crear la cuenta. Intenta con otro email.</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-2"
              disabled={register.isPending || login.isPending}
            >
              {register.isPending || login.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-3 text-sm">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-gray-900 hover:underline">
                Inicia sesión
              </Link>
            </p>
            <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
