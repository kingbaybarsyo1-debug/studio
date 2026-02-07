'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/app/loading';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== 'admin@example.com') {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== 'admin@example.com') {
    return <Loading />;
  }

  return <>{children}</>;
}
