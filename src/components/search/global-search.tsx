'use client';

import { useState, useEffect, useRef } from 'react';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, File, BookOpen, GraduationCap, Archive, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import type { SearchResult } from '@/lib/search';
import Link from 'next/link';

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  onResultSelect?: (result: SearchResult) => void;
}

const typeIcons = {
  case: File,
  article: BookOpen,
  course: GraduationCap,
  archive: Archive,
};

const typeLabels = {
  case: 'Caso',
  article: 'Artigo',
  course: 'Curso', 
  archive: 'Arquivo',
};

const typeColors = {
  case: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  article: 'text-green-400 border-green-400/30 bg-green-500/10',
  course: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
  archive: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
};

export function GlobalSearch({ 
  className = '', 
  placeholder = 'Buscar casos, artigos, cursos...',
  showFilters = false,
  onResultSelect 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [total, setTotal] = useState(0);
  
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
      if (debouncedQuery.length >= 2) {
        getSuggestions(debouncedQuery);
      }
    } else {
      setResults([]);
      setSuggestions([]);
      setTotal(0);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
        setTotal(data.total);
        setIsOpen(true);
      }
    } catch (error) {
      logger.error('Search error:', error);
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true&limit=5`);
      const data = await response.json();
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      logger.error('Suggestions error:', error);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = results.length + suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : -1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : totalItems - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < results.length) {
            handleResultSelect(results[selectedIndex]);
          } else {
            const suggestionIndex = selectedIndex - results.length;
            setQuery(suggestions[suggestionIndex]);
            setSelectedIndex(-1);
          }
        } else if (query.trim()) {
          // Navigate to full search page
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      router.push(result.url);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const viewAllResults = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && (results.length > 0 || suggestions.length > 0)) {
              setIsOpen(true);
            }
          }}
          className="glass-input h-12 pl-12 pr-12 text-base w-full text-white/80"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          )}
          {query && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <X className="w-4 h-4 text-white/60" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0 || suggestions.length > 0) && (
        <GlassCard className="absolute top-full left-0 right-0 mt-2 p-0 max-h-96 overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-white/60 px-3 py-2 uppercase tracking-wider">
                  Resultados ({total})
                </div>
                {results.map((result, index) => {
                  const Icon = typeIcons[result.type];
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultSelect(result)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white/90 text-sm truncate">
                              {result.title}
                            </h4>
                            <Badge className={`text-xs px-2 py-0.5 ${typeColors[result.type]}`}>
                              {typeLabels[result.type]}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/60 line-clamp-2">
                            {result.description}
                          </p>
                          {result.metadata?.author && (
                            <p className="text-xs text-white/40 mt-1">
                              Por {result.metadata.author}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                
                {total > results.length && (
                  <button
                    onClick={viewAllResults}
                    className="w-full p-3 text-center text-sm text-cyan-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Ver todos os {total} resultados
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 border-t border-white/10">
                <div className="text-xs font-medium text-white/60 px-3 py-2 uppercase tracking-wider">
                  Sugestões
                </div>
                {suggestions.map((suggestion, index) => {
                  const suggestionIndex = results.length + index;
                  const isSelected = suggestionIndex === selectedIndex;
                  
                  return (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/80">{suggestion}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {query.trim() && !isLoading && results.length === 0 && suggestions.length === 0 && (
              <div className="p-6 text-center">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-white/60 mb-1">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-xs text-white/40">
                  Tente ajustar os termos de busca
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}