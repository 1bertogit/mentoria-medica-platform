'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { useState } from 'react';

export function AppHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="flex h-16 items-center px-4 lg:px-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mx-auto max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar casos, artigos, cursos..."
              className="h-10 w-full rounded-lg border border-gray-300 bg-gray-100 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-gray-50 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30 dark:focus:bg-white/15"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <NotificationBell userId={user?.id || '1'} />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
