import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { setToken, clearToken, type AuthUser } from '@/lib/auth';

interface AuthEnvelope {
  success?: boolean;
  data?: { token: string; userId: number; name: string; email: string };
  error?: { code?: string; message?: string };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const res = await customFetch<{ data: AuthEnvelope }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.error?.message ?? 'Login failed');
      }
      return res.data.data;
    },
    onSuccess: (data) => {
      const user: AuthUser = { userId: data.userId, name: data.name, email: data.email };
      setToken(data.token, user);
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (body: { name: string; email: string; password: string }) => {
      const res = await customFetch<{ data: AuthEnvelope }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.data.success) {
        throw new Error(res.data.error?.message ?? 'Registration failed');
      }
      return res.data.data;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearToken();
    queryClient.invalidateQueries();
    queryClient.clear();
  };
}
