'use client';

import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { setUserProfile } from '@/firebase/firestore';

export function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (!loading && user) {
        router.push('/admin');
    }
  }, [user, loading, router]);


  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    const email = 'admin@example.com';
    const correctPassword = 'admn2026';

    if (password !== correctPassword) {
        toast({
            variant: 'destructive',
            title: 'كلمة مرور غير صالحة',
            description: 'الرجاء التأكد من كلمة المرور والمحاولة مرة أخرى.',
        });
        return;
    }

    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUserProfile(firestore, result.user.uid, {
            email: result.user.email,
            displayName: 'Admin',
            photoURL: null,
        });
        toast({ title: 'تم تسجيل الدخول كمسؤول' });
        router.push('/admin');
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                setUserProfile(firestore, result.user.uid, {
                    email: result.user.email,
                    displayName: 'Admin',
                    photoURL: null,
                });
                toast({ title: 'تم إنشاء حساب المسؤول وتسجيل الدخول' });
                router.push('/admin');
            } catch (createError: any) {
                 if (createError.code === 'auth/email-already-in-use') {
                    toast({
                        variant: 'destructive',
                        title: 'كلمة مرور غير صحيحة',
                        description: 'الرجاء التأكد من كلمة المرور والمحاولة مرة أخرى.',
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'حدث خطأ أثناء إنشاء حساب المسؤول',
                        description: createError.message,
                    });
                }
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'حدث خطأ أثناء تسجيل الدخول',
                description: error.message,
            });
        }
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تسجيل دخول المسؤول</CardTitle>
          <CardDescription>ادخل كلمة المرور لإدارة المحتوى</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
            </div>
            <Button type="submit" className="w-full">تسجيل الدخول</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
