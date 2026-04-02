'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Loading from '@/app/loading';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/firebase/firestore';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, loading: docLoading } = useDoc<UserProfile>(userDocRef);

  const loading = authLoading || docLoading;
  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.replace('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return <Loading />;
  }

  return <>{children}</>;
}
