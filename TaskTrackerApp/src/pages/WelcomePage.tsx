import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Task Tracker</h1>
          <p className="text-lg text-muted-foreground">Organiza tus tareas de forma sencilla</p>
        </div>

        <div className="space-y-3 pt-8">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate('/register')}
          >
            Crear Cuenta
          </Button>

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">o</span>
            </div>
          </div>

          <Button
            size="lg"
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/tasks')}
          >
            Entrar como Invitado
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground space-y-2">
          <p>Acceso sin restricciones como invitado</p>
          <p>o crea una cuenta para tus tareas personales</p>
        </div>
      </div>
    </div>
  );
}
