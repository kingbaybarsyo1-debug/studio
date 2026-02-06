import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/app/header';
import { BottomNavbar } from '@/components/app/bottom-navbar';

export const metadata: Metadata = {
  title: 'رفيق المصمم',
  description: 'تطبيق يساعد المصممين في أعمالهم',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <Header />
        <main className="pb-20">{children}</main>
        <BottomNavbar />
        <Toaster />
      </body>
    </html>
  );
}
