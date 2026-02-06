'use client';

import {
  addDoc,
  collection,
  doc,
  Firestore,
  setDoc,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  fileUrl: string;
  categoryId: string;
}

export function addCategory(
  db: Firestore,
  category: { name: string; parentId: string | null }
) {
  const categoriesRef = collection(db, 'categories');
  addDoc(categoriesRef, category).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: categoriesRef.path,
      operation: 'create',
      requestResourceData: category,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function addContentItem(db: Firestore, contentItem: Omit<ContentItem, 'id'>) {
    const contentRef = collection(db, 'content');
    addDoc(contentRef, contentItem).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contentRef.path,
            operation: 'create',
            requestResourceData: contentItem,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}
