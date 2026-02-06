'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

export function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      if (isAdmin === 'true') {
        router.push('/admin');
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();

    const correctPassword = 'admn2026';

    if (password === correctPassword) {
      localStorage.setItem('isAdmin', 'true');
      toast({ title: 'تم تسجيل الدخول كمسؤول' });
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'كلمة مرور غير صالحة',
        description: 'الرجاء التأكد من كلمة المرور والمحاولة مرة أخرى.',
      });
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

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
