'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/firebase/firestore';
import { DEFAULT_ADMIN_EMAIL } from '@/lib/utils';
import { useMemo } from 'react';

export function BottomNavbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'Users', user.uid);
  }, [firestore, user]);

  const { data: userData } = useDoc<UserProfile>(userDocRef);
  
  // التحقق من الصلاحية لإظهار زر الأدمن
  const isAdmin = user?.email === DEFAULT_ADMIN_EMAIL || userData?.role === 'admin';

  const navItems = [
    { href: '/', icon: Home, label: 'الرئيسية' },
    { href: '/favorites', icon: Heart, label: 'المفضلة' },
    // يظهر زر الأدمن فقط إذا كان المستخدم لديه صلاحية
    ...(isAdmin ? [{ href: '/admin', icon: UserCog, label: 'الادمن' }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg">
      <div className={cn(
        "container mx-auto grid h-16 max-w-lg",
        isAdmin ? "grid-cols-3" : "grid-cols-2"
      )}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
