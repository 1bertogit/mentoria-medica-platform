'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { TopControls } from '@/components/layout/top-controls';
import { useAuth } from '@/hooks/use-auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Mobile Sidebar - Visível apenas em telas pequenas */}
      <MobileSidebar />
      
      {/* Desktop Sidebar - Visível apenas em telas médias e grandes */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      
      <TopControls />

      <main className="md:ml-64" role="main">
        <div className="p-4 pt-20 pb-20 md:p-6 md:pt-20 md:pb-6 lg:p-8 lg:pt-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
