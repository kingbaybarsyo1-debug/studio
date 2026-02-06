'use client';

import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
  const [isSignUp, setIsSignUp] = useState(false);
  
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

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    if (isSignUp) {
        if(email === 'admin@example.com' && password === 'admn2026') {
             try {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = result.user;
                setUserProfile(firestore, newUser.uid, {
                    email: newUser.email,
                    displayName: 'Admin',
                    photoURL: null,
                });
                toast({ title: 'تم إنشاء حساب المسؤول بنجاح' });
                router.push('/admin');
            } catch (error: any) {
                 if (error.code === 'auth/email-already-in-use') {
                    // If user already exists, just sign them in and ensure profile is set.
                    try {
                        const result = await signInWithEmailAndPassword(auth, email, password);
                        setUserProfile(firestore, result.user.uid, {
                            email: result.user.email,
                            displayName: 'Admin',
                            photoURL: null,
                        });
                        toast({ title: 'تم تسجيل الدخول كمسؤول' });
                        router.push('/admin');
                    } catch (signInError: any) {
                         toast({
                            variant: 'destructive',
                            title: 'خطأ في تسجيل دخول المسؤول',
                            description: signInError.message,
                        });
                    }
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'حدث خطأ أثناء إنشاء حساب المسؤول',
                        description: error.message,
                    });
                }
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'بيانات اعتماد غير صالحة',
                description: 'لإنشاء حساب مسؤول، يرجى استخدام بيانات الاعتماد الصحيحة.',
            });
        }
    } else {
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
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isSignUp ? "إنشاء حساب مسؤول" : "تسجيل الدخول"}</CardTitle>
          <CardDescription>{isSignUp ? "استخدم البريد admin@example.com وكلمة المرور admn2026" : "ادخل لإدارة المحتوى"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">{isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}</Button>
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
           <div className="mt-4 text-center text-sm">
            <button onClick={() => setIsSignUp(!isSignUp)} className="underline">
              {isSignUp ? "العودة إلى تسجيل الدخول" : "إنشاء حساب مسؤول"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
