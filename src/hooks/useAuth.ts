import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuth() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token && !router.pathname.startsWith('/auth')) {
      router.push('/auth/login');
    }
    if (token && router.pathname.startsWith('/auth')) {
      router.push('/');
    }
  }, [router.pathname]);
}