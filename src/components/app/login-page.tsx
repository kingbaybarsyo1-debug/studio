'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const CatEye = ({ isClosed }: { isClosed: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 140 140"
    className="h-24 w-24"
  >
    <g fill="hsl(var(--foreground))">
      <path
        d="M25.021 114.28c-3.905-3.905-3.905-10.207 0-14.112l14.112-14.112c3.905-3.905 10.207-3.905 14.112 0s3.905 10.207 0 14.112l-14.112 14.112c-3.905 3.905-10.207 3.905-14.112 0z"
      />
      <path
        d="M114.979 114.28c3.905-3.905 3.905-10.207 0-14.112l-14.112-14.112c-3.905-3.905-10.207-3.905-14.112 0s-3.905 10.207 0 14.112l14.112 14.112c3.905 3.905 10.207 3.905 14.112 0z"
      />
      <g>
        {isClosed ? (
          <>
            <path d="M56.465 56.465c-3.905-3.905-3.905-10.207 0-14.112 11.716-11.716 30.709-11.716 42.425 0 3.905 3.905 3.905 10.207 0 14.112-3.905 3.905-10.207 3.905-14.112 0-3.905-3.905-3.905-3.905-7.81 0-3.905 3.905-3.905 3.905-7.811 0-3.905 3.905-3.905 3.905-7.811 0-3.905-3.905-10.207-3.905-14.112 0z" />
          </>
        ) : (
          <>
            <path d="M70 25.137c-19.41 0-35.137 15.727-35.137 35.137S50.59 95.411 70 95.411s35.137-15.727 35.137-35.137S89.41 25.137 70 25.137zm0 56.218c-11.646 0-21.082-9.436-21.082-21.082s9.436-21.082 21.082-21.082 21.082 9.436 21.082 21.082-9.436 21.082-21.082 21.082z" />
            <circle cx="70" cy="60.274" r="10.541" />
          </>
        )}
      </g>
    </g>
  </svg>
);


export function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const adminEmail = 'admin@example.com';
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({
            variant: "destructive",
            title: "خطأ",
            description: "خدمة المصادقة غير متاحة.",
        });
        return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail, password);
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: "بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
            <CatEye isClosed={isFocus || password.length > 0} />
        </div>
        
        <h1 className="mb-8 text-center text-3xl font-bold text-primary">
          تسجيل دخول المسؤول
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
           <div className="relative">
            <Input
              id="email"
              type="email"
              value={adminEmail}
              readOnly
              className="pr-12 text-lg bg-muted/50"
            />
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              placeholder="كلمة المرور"
              required
              className="pr-12 text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" className="w-full text-lg" disabled={loading}>
            {loading ? '...جاري التسجيل' : 'تسجيل الدخول'}
            {!loading && <LogIn className="mr-2 h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
