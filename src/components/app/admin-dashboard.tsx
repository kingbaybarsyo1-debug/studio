'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { addCategory, Category } from '@/firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'اسم القسم مطلوب'),
});

const subCategorySchema = z.object({
  parentId: z.string().min(1, 'القسم الرئيسي مطلوب'),
  name: z.string().min(1, 'اسم القسم الفرعي مطلوب'),
});

export function AdminDashboard() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && user?.email !== 'admin@example.com') {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);
  const { data: categories, loading: categoriesLoading } =
    useCollection<Category>(categoriesQuery);

  const mainCategories = useMemo(
    () => categories?.filter((c) => !c.parentId) || [],
    [categories]
  );

  const {
    register: registerCategory,
    handleSubmit: handleCategorySubmit,
    reset: resetCategory,
    formState: { errors: categoryErrors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const {
    register: registerSubCategory,
    handleSubmit: handleSubCategorySubmit,
    reset: resetSubCategory,
    setValue: setSubCategoryValue,
    formState: { errors: subCategoryErrors },
  } = useForm({
    resolver: zodResolver(subCategorySchema),
  });

  useEffect(() => {
    registerSubCategory('parentId');
  }, [registerSubCategory]);

  const onAddCategory = (data: z.infer<typeof categorySchema>) => {
    if (!firestore) return;
    addCategory(firestore, { name: data.name, parentId: null });
    toast({ title: 'تمت إضافة القسم بنجاح' });
    resetCategory();
  };

  const onAddSubCategory = (data: z.infer<typeof subCategorySchema>) => {
    if (!firestore) return;
    addCategory(firestore, { name: data.name, parentId: data.parentId });
    toast({ title: 'تمت إضافة القسم الفرعي بنجاح' });
    resetSubCategory();
  };

  if (userLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-8 px-4 py-8">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>

      <Card>
        <CardHeader>
          <CardTitle>إضافة قسم رئيسي</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCategorySubmit(onAddCategory)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label htmlFor="categoryName">اسم القسم</Label>
              <Input id="categoryName" {...registerCategory('name')} />
              {categoryErrors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {categoryErrors.name.message as string}
                </p>
              )}
            </div>
            <Button type="submit">إضافة قسم</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إضافة قسم داخل قسم</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubCategorySubmit(onAddSubCategory)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label>اختر القسم الرئيسي</Label>
              <Select
                onValueChange={(value) => setSubCategoryValue('parentId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر قسمًا رئيسيًا" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      جار تحميل الأقسام...
                    </SelectItem>
                  ) : (
                    mainCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {subCategoryErrors.parentId && (
                <p className="mt-1 text-sm text-destructive">
                  {subCategoryErrors.parentId.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="subCategoryName">اسم القسم الفرعي</Label>
              <Input
                id="subCategoryName"
                {...registerSubCategory('name')}
              />
              {subCategoryErrors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {subCategoryErrors.name.message as string}
                </p>
              )}
            </div>
            <Button type="submit">إضافة قسم فرعي</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
