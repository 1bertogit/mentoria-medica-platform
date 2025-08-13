'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const routeMap: Record<string, string> = {
  dashboard: 'Dashboard',
  library: 'Biblioteca Científica',
  archive: 'Arquivo Digital',
  cases: 'Casos Clínicos',
  academy: 'Academy',
  classes: 'Aulas',
  calendar: 'Calendário',
  settings: 'Configurações',
  admin: 'Administração',
  members: 'Membros',
  approval: 'Aprovações',
  reports: 'Relatórios',
  customize: 'Personalização',
  content: 'Conteúdo',
  'new-case': 'Novo Caso',
  'new-article': 'Novo Artigo',
  'new-class': 'Nova Aula',
  'new-archive': 'Novo Arquivo'
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Split path and filter empty strings
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Don't show breadcrumbs on home
  if (pathSegments.length === 0) return null;
  
  // Generate breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = routeMap[segment] || segment;
    const isLast = index === pathSegments.length - 1;
    
    return {
      path,
      label,
      isLast
    };
  });
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors flex items-center"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <li>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </li>
            <li>
              {item.isLast ? (
                <span className="text-white font-medium">{item.label}</span>
              ) : (
                <Link 
                  href={item.path} 
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}