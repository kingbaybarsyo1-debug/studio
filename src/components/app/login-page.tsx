'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';

const LoginCat = ({ isWinking }: { isWinking: boolean }) => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      className="text-foreground transition-all duration-300"
    >
      <path
        d="M 50 95 C 20 95, 10 70, 10 50 C 10 20, 20 5, 50 5 C 80 5, 90 20, 90 50 C 90 70, 80 95, 50 95 Z"
        fill="hsl(var(--background))"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M 20 40 C 20 20, 40 20, 40 40"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 80 40 C 80 20, 60 20, 60 40"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      {/* Eyes */}
      <circle cx="35" cy="55" r="5" fill="currentColor" />
      {isWinking ? (
        <path
          d="M 60 55 H 70"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all"
        />
      ) : (
        <circle cx="65" cy="55" r="5" fill="currentColor" className="transition-all" />
      )}
      {/* Nose */}
      <path d="M 50 65 L 45 72 L 55 72 Z" fill="currentColor" />
      {/* Mouth */}
      <path
        d="M 40 80 Q 50 85, 60 80"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};


export function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const winkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    // If user is already logged in as admin, redirect to admin page
    if (!userLoading && user?.email === 'admin@example.com') {
      router.push('/admin');
    }
  }, [user, userLoading, router]);

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'خطأ في المصادقة',
            description: 'لم يتم إعداد Firebase بشكل صحيح.',
        });
        return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, 'admin@example.com', password);
      toast({ title: 'تم تسجيل الدخول كمسؤول بنجاح!' });
      router.push('/admin');
    } catch (error) {
      const authError = error as AuthError;
      console.error(authError);
      
      toast({
        variant: 'destructive',
        title: 'فشل تسجيل الدخول',
        description: 'كلمة المرور غير صحيحة، أو أن حساب المسؤول غير موجود في Firebase.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    
    if (winkTimeoutRef.current) {
        clearTimeout(winkTimeoutRef.current);
    }
    setIsWinking(true);
    winkTimeoutRef.current = setTimeout(() => {
        setIsWinking(false);
    }, 150);
  };
  
  if (userLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
      <div className="mb-8">
        <LoginCat isWinking={isWinking} />
      </div>
      <Card className="w-full max-w-sm border-2 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">مرحباً بعودتك!</CardTitle>
          <CardDescription>ادخل كلمة مرور المسؤول للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-6">
            <div className="relative space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                className="pr-10"
                placeholder='admn2026'
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-7 h-7 w-7 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" /> : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
