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

// تم استبدال التحقق من الإيميلات بالتحقق من حقل role في Firestore
export function isAdminUser(email: string | null | undefined): boolean {
    // هذه الدالة أصبحت قديمة، يفضل الاعتماد على حقل role من Firestore مباشرة
    return false;
}
