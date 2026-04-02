import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject('Clipboard API not available');
}

export function isValidHex(hex: string): boolean {
  return /^([0-9A-F]{3}){1,2}$/i.test(hex.replace("#", ""));
}

// الحساب الافتراضي للمسؤول
export const DEFAULT_ADMIN_EMAIL = 'admin@example.com';

export function isAdminUser(email: string | null | undefined): boolean {
    if (!email) return false;
    return email === DEFAULT_ADMIN_EMAIL;
}
