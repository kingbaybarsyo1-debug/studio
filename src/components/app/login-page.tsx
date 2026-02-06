'use client';

import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { Chrome } from 'lucide-react';
import { setUserProfile } from '@/firebase/firestore';

export function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (!loading && user) {
        router.push('/admin');
    }
  }, [user, loading, router]);


  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserProfile(firestore, user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      toast({ title: 'تم تسجيل الدخول بنجاح' });
      router.push('/admin');
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        variant: 'destructive',
        title: 'حدث خطأ أثناء تسجيل الدخول',
        description: error.message,
      });
    }
  };

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        setUserProfile(firestore, user.uid, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });
        toast({ title: 'تم تسجيل الدخول بنجاح' });
        router.push('/admin');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'حدث خطأ أثناء تسجيل الدخول',
            description: error.message,
        });
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>ادخل لإدارة المحتوى</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">تسجيل الدخول</Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">أو</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <Chrome className="mr-2 h-4 w-4" />
            تسجيل الدخول باستخدام جوجل
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
