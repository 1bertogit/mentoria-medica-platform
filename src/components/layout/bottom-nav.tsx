'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Archive 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Biblioteca', href: '/library', icon: BookOpen },
  { name: 'Academy', href: '/academy', icon: GraduationCap },
  { name: 'Casos', href: '/cases', icon: FileText },
  { name: 'Arquivo', href: '/archive', icon: Archive },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav 
      role="navigation"
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                isActive
                  ? "text-cyan-500 dark:text-cyan-400 scale-105"
                  : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "transition-all duration-200",
                isActive ? "w-6 h-6" : "w-5 h-5"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-cyan-600 dark:text-cyan-400"
              )}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}