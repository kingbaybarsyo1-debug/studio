'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import {
  signInWithEmailAndPassword,
  getRedirectResult,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/app/loading';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_ADMIN_EMAIL } from '@/lib/utils';

export function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    if (!auth) {
        setIsAuthChecking(false);
        return;
    }

    const checkUserRole = async () => {
      try {
        const result = await getRedirectResult(auth);
        const currentUser = result?.user || auth.currentUser;
        
        if (currentUser && firestore) {
          const userDoc = await getDoc(doc(firestore, 'Users', currentUser.uid));
          if (currentUser.email === DEFAULT_ADMIN_EMAIL || (userDoc.exists() && userDoc.data().role === 'admin')) {
            router.push('/admin');
            return;
          }
        }
        setIsAuthChecking(false);
      } catch (error) {
        setIsAuthChecking(false);
      }
    };

    checkUserRole();
  }, [auth, firestore, router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    
    setEmailLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, DEFAULT_ADMIN_EMAIL, password);
      const userDoc = await getDoc(doc(firestore, 'Users', userCredential.user.uid));
      
      if (userCredential.user.email === DEFAULT_ADMIN_EMAIL || (userDoc.exists() && userDoc.data().role === 'admin')) {
        router.push('/admin');
      } else {
        await auth.signOut();
        toast({ variant: 'destructive', title: 'دخول غير مصرح به', description: 'ليس لديك صلاحيات المسؤول.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'فشل تسجيل الدخول', description: 'بيانات الدخول غير صحيحة.' });
    } finally {
      setEmailLoading(false);
    }
  };

  if (isAuthChecking) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold text-primary">تسجيل دخول المسؤول</h1>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <Input value={DEFAULT_ADMIN_EMAIL} readOnly className="text-center bg-muted/50" />
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={emailLoading}>
            {emailLoading ? '...جاري' : 'دخول المسؤول'}
          </Button>
        </form>
      </div>
    </div>
  );
}
