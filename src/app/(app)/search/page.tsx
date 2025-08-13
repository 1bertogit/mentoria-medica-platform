'use client';

import { useState, useEffect, Suspense } from 'react';
import logger from '@/lib/logger';
import { useSearchParams, useRouter } from 'next/navigation';
import { GlobalSearch } from '@/components/search/global-search';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  SortAsc, 
  File, 
  BookOpen, 
  GraduationCap, 
  Archive, 
  Clock,
  User,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { SearchResult } from '@/lib/search';

const typeIcons = {
  case: File,
  article: BookOpen,
  course: GraduationCap,
  archive: Archive,
};

const typeLabels = {
  case: 'Caso Clínico',
  article: 'Artigo Científico',
  course: 'Curso',
  archive: 'Arquivo',
};

const typeColors = {
  case: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  article: 'text-green-400 border-green-400/30 bg-green-500/10',
  course: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
  archive: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all',
    specialty: 'all',
    category: 'all',
  });
  const [sortBy, setSortBy] = useState('relevance');

  const query = searchParams.get('q') || '';
  const limit = 12;

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, filters, sortBy, currentPage]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: ((currentPage - 1) * limit).toString(),
      });

      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.specialty !== 'all') params.append('specialty', filters.specialty);
      if (filters.category !== 'all') params.append('category', filters.category);

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
        setTotal(data.total);
      }
    } catch (error) {
      logger.error('Search error:', error);
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full" role="region" aria-label="Resultados da busca">
      {/* Header */}
      <section aria-label="Cabeçalho da busca">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white/90">Busca Global</h1>
              <p className="text-sm text-gray-600 dark:text-white/60">Encontre casos, artigos, cursos e conteúdo arquivado</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <GlobalSearch 
            className="max-w-2xl"
            placeholder="Buscar em todo o conteúdo..."
          />
        </div>
      </section>

      {query.trim() && (
        <>
          {/* Results Header */}
          <section aria-label="Cabeçalho dos resultados">
            <GlassCard className="mb-6 p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                    Resultados para "{query}"
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-white/60">
                    {total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={filters.type} onValueChange={(value) => updateFilters('type', value)}>
                    <SelectTrigger className="w-[140px] h-9 glass-input text-sm">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass-pane">
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="case">Casos</SelectItem>
                      <SelectItem value="article">Artigos</SelectItem>
                      <SelectItem value="course">Cursos</SelectItem>
                      <SelectItem value="archive">Arquivo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] h-9 glass-input text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-pane">
                      <SelectItem value="relevance">Relevância</SelectItem>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="title">Título</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Results */}
          <section aria-label="Lista de resultados">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <GlassCard key={index} className="p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-white/5 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-white/5 rounded w-full"></div>
                        <div className="h-3 bg-white/5 rounded w-2/3"></div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((result) => {
                    const Icon = typeIcons[result.type];
                    
                    return (
                      <Link key={`${result.type}-${result.id}`} href={result.url}>
                        <GlassCard 
                          interactive={true}
                          className="p-6 h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                        >
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-gray-600 dark:text-white/60" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`text-xs px-2 py-1 ${typeColors[result.type]}`}>
                                    {typeLabels[result.type]}
                                  </Badge>
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-white/95 text-sm leading-tight line-clamp-2">
                                  {result.title}
                                </h3>
                              </div>
                            </div>

                            {/* Image if available */}
                            {result.imageUrl && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                <Image
                                  src={result.imageUrl}
                                  alt={result.title}
                                  fill
                                  className="object-cover opacity-60"
                                />
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed line-clamp-3">
                              {result.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50">
                              <div className="flex items-center gap-3">
                                {result.metadata?.author && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{result.metadata.author}</span>
                                  </div>
                                )}
                                {result.metadata?.views && (
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{result.metadata.views}</span>
                                  </div>
                                )}
                              </div>
                              {result.metadata?.createdAt && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(result.metadata.createdAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-white/60">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage <= 1}
                          className="glass-button"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage >= totalPages}
                          className="glass-button"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400 dark:text-white/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/80">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-white/60 max-w-md">
                    Não encontramos resultados para "{query}". Tente ajustar os termos de busca ou usar filtros diferentes.
                  </p>
                </div>
              </GlassCard>
            )}
          </section>
        </>
      )}

      {!query.trim() && (
        <GlassCard className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Search className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/80">
              Busca Global
            </h3>
            <p className="text-gray-600 dark:text-white/60 max-w-md">
              Digite algo na barra de busca acima para encontrar casos clínicos, artigos científicos, cursos e conteúdo arquivado.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="h-12 bg-white/10 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}