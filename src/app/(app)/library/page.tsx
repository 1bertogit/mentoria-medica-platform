'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  MessageSquare,
  Search,
  Eye,
  Filter,
  Star,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { scientificArticles, specialties } from '@/lib/mock-data/library';
import { AutoBanner, bannerStyles } from '@/components/library/auto-banner';

const specialtyColors: { [key: string]: string } = {
  Rinoplastia: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  Mamoplastia: 'text-pink-400 border-pink-400/30 bg-pink-500/10',
  Blefaroplastia: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
  Lifting: 'text-orange-400 border-orange-400/30 bg-orange-500/10',
  Outros: 'text-gray-400 border-gray-400/30 bg-gray-500/10',
};

export default function LibraryPage() {
  // Injetar estilos de animação
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = bannerStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [articles, setArticles] = useState(scientificArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'impact' | 'popular'
  >('newest');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search with proper cleanup
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter and search functionality
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch =
        searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        specialtyFilter === 'Todos' || article.specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.year - a.year;
        case 'oldest':
          return a.year - b.year;
        case 'impact':
          return b.impactFactor - a.impactFactor;
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const handleSaveArticle = (articleId: string) => {
    setSavedArticles(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  return (
    <div className="w-full" role="region" aria-label="Biblioteca científica">
      {/* Header da Biblioteca */}
      <section className="mb-8" aria-label="Cabeçalho da biblioteca">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <BookOpen className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-light text-gray-900 dark:text-white/90">
              Biblioteca
            </h1>
            <p className="text-gray-600 dark:text-white/60">
              Repositório de artigos científicos e literatura médica
              especializada
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Busca e filtros">
        <GlassCard className="mb-8 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Barra de busca e ordenação - Responsiva */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-white/40" />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400"></div>
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  className="glass-input h-10 w-full pl-10 pr-10 text-sm sm:h-12 sm:pl-12 sm:pr-12 sm:text-base"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(
                  value: 'newest' | 'oldest' | 'impact' | 'popular'
                ) => setSortBy(value)}
              >
                <SelectTrigger className="glass-input h-10 w-full text-sm text-white/80 sm:h-12 sm:w-[180px] sm:text-base">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                  <SelectItem value="oldest">Mais Antigos</SelectItem>
                  <SelectItem value="impact">Maior Impacto</SelectItem>
                  <SelectItem value="popular">Mais Visualizados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtros de especialidade - Scrollável em mobile */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-white/70">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Filtros rápidos:</span>
                  <span className="sm:hidden">Filtros:</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                  {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Container com scroll horizontal em mobile */}
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                  {specialties.map((specialty, index) => (
                    <Button
                      key={specialty}
                      variant={specialtyFilter === specialty ? 'default' : 'ghost'}
                      onClick={() => setSpecialtyFilter(specialty)}
                      className={cn(
                        'glass-button h-8 whitespace-nowrap px-3 text-xs transition-all duration-200 hover:scale-105 sm:h-9 sm:px-4 sm:text-sm',
                        specialtyFilter === specialty
                          ? 'bg-white/20 text-white shadow-lg hover:bg-white/30'
                          : 'bg-white/5 hover:bg-white/10'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão limpar busca - Otimizado */}
            {searchTerm && (
              <div className="flex justify-center sm:justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="glass-button h-8 px-3 text-xs transition-transform duration-200 hover:scale-105"
                >
                  <X className="mr-1 h-3 w-3" />
                  Limpar busca
                </Button>
              </div>
            )}
          </div>
        </GlassCard>
      </section>

      <section className="space-y-6" aria-label="Lista de artigos científicos">
        {filteredArticles.map((article, index) => (
          <GlassCard
            key={article.id}
            interactive={true}
            className="group overflow-hidden !rounded-2xl p-0 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col md:flex-row">
              <AutoBanner
                title={article.title}
                specialty={article.specialty}
                index={index}
              />
              <div className="flex flex-grow flex-col p-6">
                <Badge
                  variant="outline"
                  className={`mb-3 self-start ${specialtyColors[article.specialty as keyof typeof specialtyColors]}`}
                >
                  {article.specialty}
                </Badge>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white/95">
                  {article.title}
                </h3>
                <p className="mb-3 text-sm font-light text-cyan-600 dark:text-cyan-300">
                  {article.authors}
                </p>
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-white/50">
                  <span>
                    {article.journal} ({article.year})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span>Fator de Impacto: {article.impactFactor}</span>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm font-extralight leading-relaxed text-gray-700 dark:text-white/70">
                  {article.abstract}
                </p>

                <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white/60">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>Fator: {article.impactFactor}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      className="glass-button h-10 bg-cyan-400/20 px-5 text-sm text-cyan-300 transition-transform duration-200 hover:scale-105 hover:bg-cyan-400/30"
                    >
                      <Link href={`/library/${article.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ler Artigo
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="glass-button h-10 bg-white/5 px-5 text-sm transition-transform duration-200 hover:scale-105 hover:bg-white/10"
                    >
                      <Link href={`/library/${article.id}#discussao`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Discutir
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
