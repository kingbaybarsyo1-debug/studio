'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Loading from '@/app/loading';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/firebase/firestore';
import { DEFAULT_ADMIN_EMAIL } from '@/lib/utils';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'Users', user.uid);
  }, [firestore, user]);

  const { data: userData, loading: docLoading } = useDoc<UserProfile>(userDocRef);

  const loading = authLoading || docLoading;
  
  // التحقق: هل هو الحساب الافتراضي أم لديه رتبة admin في Firestore؟
  const isAdmin = user?.email === DEFAULT_ADMIN_EMAIL || userData?.role === 'admin';

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
