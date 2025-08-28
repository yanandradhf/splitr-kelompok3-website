'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const authenticated = checkAuth();
    if (!authenticated) {
      router.push('/');
    }
  }, [router, checkAuth]);

  return isAuthenticated ? children : null;
}