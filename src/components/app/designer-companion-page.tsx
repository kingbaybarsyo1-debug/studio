'use client';

import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useCollection, useFirestore } from '@/firebase';
import { Category } from '@/firebase/firestore';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function DesignerCompanionPage() {
  const firestore = useFirestore();

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), where('parentId', '==', null));
  }, [firestore]);

  const { data: menuItems, loading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
      <Logo />

      <Button size="lg" className="w-full max-w-xs bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground text-xl font-bold rounded-xl border border-blue-300">
          تقييم التطبيق
      </Button>

      {loading && (
        <div className="grid w-full max-w-lg grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      )}
      
      {!loading && menuItems && (
        <div className="grid w-full max-w-lg grid-cols-2 gap-4">
            {menuItems.map((item) => (
            <Link href={`/category/${item.id}`} key={item.id}>
                <Card className="aspect-square flex flex-col items-center justify-center p-4 transition-transform hover:scale-105 relative group">
                <div className="absolute top-3 start-3 rounded-full bg-white/20 p-1.5">
                    <Smile className="h-5 w-5 text-white" />
                </div>
                <CardContent className="p-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-card-foreground">{item.name}</h3>
                </CardContent>
                </Card>
            </Link>
            ))}
        </div>
      )}
    </div>
  );
}
