'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, UserCog } from 'lucide-react';
import { cn, isAdminUser } from '@/lib/utils';
import { useUser } from '@/firebase';

const baseNavItems = [
  { href: '/', icon: Home, label: 'الرئيسية' },
  { href: '/favorites', icon: Heart, label: 'المفضلة' },
];

const adminNavItem = { href: '/admin', icon: UserCog, label: 'الادمن' };

export function BottomNavbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = isAdminUser(user?.email);

  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;
  const gridColsClass = isAdmin ? 'grid-cols-3' : 'grid-cols-2';


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg">
      <div className={`container mx-auto grid h-16 max-w-lg ${gridColsClass}`}>
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
