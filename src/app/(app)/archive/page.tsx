'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Archive,
  Eye,
  Calendar,
  Tag,
  Filter,
  X,
  BookOpen,
  FileText,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import {
  initialArchiveItems,
  categoryColors,
  tagColors,
  type ArchiveItem,
} from '@/lib/mock-data/archive';
import { useFavorites } from '@/hooks/use-favorites';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getContentIcon = (tags: string[]) => {
  if (tags.includes('Vídeo')) return <Video className="h-4 w-4" />;
  if (tags.includes('Imagem')) return <ImageIcon className="h-4 w-4" />;
  if (tags.includes('PDF')) return <FileText className="h-4 w-4" />;
  return <BookOpen className="h-4 w-4" />;
};

export default function ArchivePage() {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(
    'newest'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadArchive = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setArchiveItems(initialArchiveItems);
      setIsLoading(false);
    };

    loadArchive();
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const categories = Array.from(
    new Set(archiveItems.map(item => item.category))
  );
  const allTags = Array.from(new Set(archiveItems.flatMap(item => item.tags)));

  // Count items by type
  const countByType = {
    all: archiveItems.length,
    articles: archiveItems.filter(item => item.tags.includes('Artigo')).length,
    videos: archiveItems.filter(item => item.tags.includes('Vídeo')).length,
    pdfs: archiveItems.filter(item => item.tags.includes('PDF')).length,
    images: archiveItems.filter(item => item.tags.includes('Imagem')).length,
  };

  const getFilteredByType = (items: ArchiveItem[], type: string) => {
    if (type === 'all') return items;
    if (type === 'articles')
      return items.filter(item => item.tags.includes('Artigo'));
    if (type === 'videos')
      return items.filter(item => item.tags.includes('Vídeo'));
    if (type === 'pdfs') return items.filter(item => item.tags.includes('PDF'));
    if (type === 'images')
      return items.filter(item => item.tags.includes('Imagem'));
    return items;
  };

  const filteredItems = archiveItems
    .filter(item => {
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter;
      const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter);

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full" role="region" aria-label="Arquivo de conhecimento">
      {/* Header */}
      <section aria-label="Cabeçalho do arquivo">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20">
              <Archive className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white/90">
                Arquivo de Conhecimento
              </h1>
              <p className="text-sm text-gray-600 dark:text-white/60">
                Repositório de discussões, casos e materiais educativos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section aria-label="Busca e filtros">
        <GlassCard className="mb-8 p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-white/40" />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400"></div>
                </div>
              )}
              <Input
                type="text"
                placeholder="Buscar por título, conteúdo ou fonte..."
                className="glass-input h-12 w-full pl-12 pr-12 text-base text-gray-900 dark:text-white/80"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <div className="flex flex-1 flex-col items-center gap-4 md:flex-row">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="glass-input h-10 w-full text-sm text-gray-900 dark:text-white/80 md:w-[200px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="glass-input h-10 w-full text-sm text-gray-900 dark:text-white/80 md:w-[180px]">
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="all">Todas as Tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value: 'newest' | 'oldest' | 'popular') =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="glass-input h-10 w-full text-sm text-gray-900 dark:text-white/80 md:w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="oldest">Mais Antigos</SelectItem>
                    <SelectItem value="popular">Mais Visualizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-white/60">
                  {filteredItems.length} item
                  {filteredItems.length !== 1 ? 's' : ''} encontrado
                  {filteredItems.length !== 1 ? 's' : ''}
                </span>
                {(searchTerm ||
                  categoryFilter !== 'all' ||
                  tagFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setTagFilter('all');
                    }}
                    className="glass-button h-8 px-3 text-xs transition-transform duration-200 hover:scale-105"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-pane mb-6 grid h-auto w-full grid-cols-5 p-1">
          <TabsTrigger
            value="all"
            className="flex items-center justify-center py-3 text-white/60 transition-all duration-200 hover:text-white/80 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Todos
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {countByType.all}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="articles"
            className="flex items-center justify-center py-3 text-white/60 transition-all duration-200 hover:text-white/80 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <FileText className="mr-2 h-4 w-4" />
            Artigos
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {countByType.articles}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="flex items-center justify-center py-3 text-white/60 transition-all duration-200 hover:text-white/80 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <Video className="mr-2 h-4 w-4" />
            Vídeos
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {countByType.videos}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pdfs"
            className="flex items-center justify-center py-3 text-white/60 transition-all duration-200 hover:text-white/80 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <FileText className="mr-2 h-4 w-4" />
            PDFs
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {countByType.pdfs}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="flex items-center justify-center py-3 text-white/60 transition-all duration-200 hover:text-white/80 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Imagens
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {countByType.images}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {(() => {
            const tabFilteredItems = getFilteredByType(
              filteredItems,
              activeTab
            );

            if (tabFilteredItems.length === 0 && !isLoading) {
              return (
                <GlassCard className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                      <Archive className="h-8 w-8 text-white/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-white/80">
                      {searchTerm ||
                      categoryFilter !== 'all' ||
                      tagFilter !== 'all'
                        ? 'Nenhum item encontrado'
                        : 'Nenhum item nesta categoria'}
                    </h3>
                    <p className="max-w-md text-white/60">
                      {searchTerm ||
                      categoryFilter !== 'all' ||
                      tagFilter !== 'all'
                        ? 'Tente ajustar os filtros de busca para encontrar o conteúdo desejado.'
                        : 'Ainda não há itens nesta categoria. Explore outras abas ou aguarde novos conteúdos.'}
                    </p>
                  </div>
                </GlassCard>
              );
            }

            return (
              <section aria-label="Lista de itens do arquivo">
                <div className="space-y-6">
                  {isLoading
                    ? // Loading skeletons
                      Array.from({ length: 5 }).map((_, index) => (
                        <GlassCard key={index} className="animate-pulse p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="h-5 w-3/4 rounded bg-white/10"></div>
                                <div className="h-4 w-1/2 rounded bg-white/5"></div>
                              </div>
                              <div className="h-8 w-16 rounded bg-white/5"></div>
                            </div>
                            <div className="flex gap-2">
                              <div className="h-6 w-20 rounded-full bg-white/5"></div>
                              <div className="h-6 w-16 rounded-full bg-white/5"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 w-full rounded bg-white/5"></div>
                              <div className="h-3 w-2/3 rounded bg-white/5"></div>
                            </div>
                          </div>
                        </GlassCard>
                      ))
                    : tabFilteredItems.map(item => (
                        <Link
                          key={item.id}
                          href={`/archive/${item.id}`}
                          passHref
                        >
                          <GlassCard
                            interactive={true}
                            className="p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/10"
                          >
                            <div className="space-y-4">
                              {/* Header */}
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="mb-2 flex items-start gap-3">
                                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60">
                                      {getContentIcon(item.tags)}
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="line-clamp-2 text-lg font-medium leading-tight text-white/95">
                                        {item.title}
                                      </h3>
                                      <p className="mt-1 text-sm text-white/60">
                                        {item.source}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-2 text-sm text-white/50">
                                  <Eye className="h-4 w-4" />
                                  <span>{item.views}</span>
                                </div>
                              </div>

                              {/* Tags and Category */}
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  className={`px-2 py-1 text-xs ${categoryColors[item.category] || categoryColors['Outros']}`}
                                >
                                  {item.category}
                                </Badge>
                                {item.tags.map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className={`px-2 py-1 text-xs ${tagColors[tag] || 'border-gray-400/30 bg-gray-500/10 text-gray-400'}`}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Description */}
                              <div className="line-clamp-3 text-sm leading-relaxed text-white/70">
                                {item.description.split('\n')[0]}
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between text-xs text-white/50">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(item.createdAt)}</span>
                                </div>
                                <button
                                  onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite({
                                      id: item.id.toString(),
                                      type: 'archive',
                                      title: item.title,
                                      url: `/archive/${item.id}`,
                                      metadata: {
                                        specialty: item.category,
                                        description:
                                          item.description.split('\n')[0],
                                      },
                                    });
                                  }}
                                  className={`text-xs transition-transform duration-200 hover:scale-105 ${
                                    isFavorite(item.id.toString(), 'archive')
                                      ? 'text-yellow-400'
                                      : 'text-white/40 hover:text-yellow-400'
                                  }`}
                                >
                                  ★{' '}
                                  {isFavorite(item.id.toString(), 'archive')
                                    ? 'Salvo'
                                    : 'Salvar'}
                                </button>
                              </div>
                            </div>
                          </GlassCard>
                        </Link>
                      ))}
                </div>
              </section>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
