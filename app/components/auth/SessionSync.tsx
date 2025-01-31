// components/SessionSync.tsx
'use client'

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/app/stores/authStore';

export default function SessionSync() {
  const { data: session } = useSession();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  return null;
}