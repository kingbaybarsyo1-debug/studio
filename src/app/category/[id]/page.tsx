'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { Category, ContentItem } from '@/firebase/firestore';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Smile } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage() {
  const firestore = useFirestore();
  const params = useParams();
  const categoryId = params.id as string;

  const subCategoriesQuery = useMemo(() => {
    if (!firestore || !categoryId) return null;
    return query(collection(firestore, 'categories'), where('parentId', '==', categoryId));
  }, [firestore, categoryId]);
  const { data: subCategories, loading: subCategoriesLoading } = useCollection<Category>(subCategoriesQuery);

  const contentItemsQuery = useMemo(() => {
    if (!firestore || !categoryId) return null;
    return query(collection(firestore, 'content'), where('categoryId', '==', categoryId));
  }, [firestore, categoryId]);
  const { data: contentItems, loading: contentItemsLoading } = useCollection<ContentItem>(contentItemsQuery);
  
  const loading = subCategoriesLoading || contentItemsLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ))}
        </div>
      )}
      
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subCategories?.map((item) => (
            <Link href={`/category/${item.id}`} key={item.id}>
                <Card className="aspect-square flex flex-col items-center justify-center p-4 transition-transform hover:scale-105 relative group bg-card text-card-foreground">
                <div className="absolute top-3 start-3 rounded-full bg-white/20 p-1.5">
                    <Smile className="h-5 w-5 text-white" />
                </div>
                <CardContent className="p-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-center">{item.name}</h3>
                </CardContent>
                </Card>
            </Link>
          ))}

          {contentItems?.map((item) => (
            <a href={item.fileUrl} key={item.id} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden transition-transform hover:scale-105 group">
                  <div className="relative aspect-video">
                      <Image 
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover"
                      />
                  </div>
                  <CardContent className="p-3 bg-card text-card-foreground">
                      <h3 className="font-bold truncate text-sm">{item.title}</h3>
                  </CardContent>
                </Card>
            </a>
          ))}
        </div>
      )}

      {!loading && subCategories?.length === 0 && contentItems?.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">لا يوجد محتوى في هذا القسم حاليًا.</p>
      )}
    </div>
  );
}
