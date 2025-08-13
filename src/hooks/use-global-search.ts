'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'case' | 'article' | 'class' | 'archive' | 'event';
  url: string;
  metadata?: {
    author?: string;
    date?: string;
    specialty?: string;
    tags?: string[];
  };
}

export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Mock data para demonstração
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'Rinoplastia Secundária - Caso Complexo',
      description: 'Paciente de 35 anos com deformidade nasal pós-cirúrgica',
      type: 'case',
      url: '/cases/1',
      metadata: {
        author: 'Dr. Lucas Martins',
        date: '2024-01-15',
        specialty: 'Rinoplastia'
      }
    },
    {
      id: '2',
      title: 'Técnicas Avançadas em Blefaroplastia',
      description: 'Artigo científico sobre novas abordagens cirúrgicas',
      type: 'article',
      url: '/library/2',
      metadata: {
        author: 'Dr. Ana Couto',
        date: '2024-01-10',
        specialty: 'Blefaroplastia'
      }
    },
    {
      id: '3',
      title: 'Masterclass: Lifting Facial Profundo',
      description: 'Aula gravada sobre técnicas de lifting facial',
      type: 'class',
      url: '/classes/3',
      metadata: {
        author: 'Dr. Robério Brandão',
        date: '2024-01-08',
        specialty: 'Lifting'
      }
    },
    {
      id: '4',
      title: 'Discussão sobre Mamoplastia de Aumento',
      description: 'Conversa do grupo sobre técnicas e complicações',
      type: 'archive',
      url: '/archive/4',
      metadata: {
        date: '2023-12-20',
        tags: ['mamoplastia', 'prótese', 'complicações']
      }
    },
    {
      id: '5',
      title: 'Workshop: Lipoenxertia Facial',
      description: 'Evento sobre técnicas de lipoenxertia',
      type: 'event',
      url: '/calendar/5',
      metadata: {
        date: '2024-02-15',
        specialty: 'Lipoenxertia'
      }
    }
  ];

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.metadata?.author?.toLowerCase().includes(query.toLowerCase()) ||
        item.metadata?.specialty?.toLowerCase().includes(query.toLowerCase()) ||
        item.metadata?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addToRecentSearches = useCallback((searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  const handleResultClick = useCallback((result: SearchResult) => {
    addToRecentSearches(query);
    setIsOpen(false);
    setQuery('');
    router.push(result.url);
  }, [query, router, addToRecentSearches]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    clearRecentSearches,
    handleResultClick
  };
}