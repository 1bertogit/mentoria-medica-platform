'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BorderBeam } from '@/components/ui/border-beam';
import {
  BookOpen,
  FileText,
  Video,
  Heart,
  Clock,
  Calendar,
  Search,
  Filter,
  Trash2,
  ArrowLeft,
  Star,
  Play,
  Download,
  Share2,
  BookmarkX,
} from 'lucide-react';
import { toastHelpers } from '@/hooks/use-toast';

// Mock saved items data
const mockSavedItems = {
  courses: [
    {
      id: 1,
      title: 'Cardiologia Avançada',
      type: 'course',
      thumbnail: '/images/courses/cardiology.jpg',
      duration: '12 horas',
      progress: 85,
      instructor: 'Dr. Carlos Mendes',
      rating: 4.8,
      savedAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Emergências Cardíacas',
      type: 'course',
      thumbnail: '/images/courses/emergency.jpg',
      duration: '8 horas',
      progress: 45,
      instructor: 'Dra. Ana Paula',
      rating: 4.9,
      savedAt: '2024-01-10',
    },
    {
      id: 3,
      title: 'ECG Interpretativo',
      type: 'course',
      thumbnail: '/images/courses/ecg.jpg',
      duration: '6 horas',
      progress: 100,
      instructor: 'Dr. Roberto Lima',
      rating: 4.7,
      savedAt: '2024-01-05',
    },
  ],
  articles: [
    {
      id: 4,
      title: 'Novos Tratamentos para Hipertensão',
      type: 'article',
      thumbnail: '/images/articles/hypertension.jpg',
      readTime: '15 min',
      author: 'Dr. Maria Santos',
      date: '2024-01-20',
      category: 'Cardiologia',
      savedAt: '2024-01-22',
    },
    {
      id: 5,
      title: 'Diretrizes AHA 2024',
      type: 'article',
      thumbnail: '/images/articles/guidelines.jpg',
      readTime: '20 min',
      author: 'AHA Committee',
      date: '2024-01-01',
      category: 'Guidelines',
      savedAt: '2024-01-18',
    },
  ],
  videos: [
    {
      id: 6,
      title: 'Técnicas de Cateterismo',
      type: 'video',
      thumbnail: '/images/videos/cath.jpg',
      duration: '45 min',
      views: 15234,
      channel: 'CardioEducation',
      savedAt: '2024-01-12',
    },
    {
      id: 7,
      title: 'Webinar: Insuficiência Cardíaca',
      type: 'video',
      thumbnail: '/images/videos/webinar.jpg',
      duration: '1h 30min',
      views: 8567,
      channel: 'Medical Talks',
      savedAt: '2024-01-08',
    },
  ],
};

export default function SavedItemsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState(mockSavedItems);

  // Filter items based on tab and search
  const filteredItems = useMemo(() => {
    let items: unknown[] = [];

    if (activeTab === 'all') {
      items = [
        ...savedItems.courses,
        ...savedItems.articles,
        ...savedItems.videos,
      ];
    } else if (activeTab === 'courses') {
      items = savedItems.courses;
    } else if (activeTab === 'articles') {
      items = savedItems.articles;
    } else if (activeTab === 'videos') {
      items = savedItems.videos;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          (item.author && item.author.toLowerCase().includes(term)) ||
          (item.instructor && item.instructor.toLowerCase().includes(term)) ||
          (item.category && item.category.toLowerCase().includes(term))
      );
    }

    // Sort by saved date (most recent first)
    return items.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }, [activeTab, searchTerm, savedItems]);

  const handleRemoveItem = (itemId: number, itemType: string) => {
    // Remove item from state
    setSavedItems((prev) => {
      const newItems = { ...prev };
      if (itemType === 'course') {
        newItems.courses = newItems.courses.filter((c) => c.id !== itemId);
      } else if (itemType === 'article') {
        newItems.articles = newItems.articles.filter((a) => a.id !== itemId);
      } else if (itemType === 'video') {
        newItems.videos = newItems.videos.filter((v) => v.id !== itemId);
      }
      return newItems;
    });

    toastHelpers.info('Item removido', 'O item foi removido dos seus salvos');
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'course':
        return BookOpen;
      case 'article':
        return FileText;
      case 'video':
        return Video;
      default:
        return Heart;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'text-cyan-400';
      case 'article':
        return 'text-purple-400';
      case 'video':
        return 'text-pink-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <GlassCard className="relative overflow-hidden bg-black/90 p-6">
        <BorderBeam
          size={200}
          duration={10}
          colorFrom="#ec4899"
          colorTo="#06b6d4"
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Itens Salvos</h1>
              <p className="mt-1 text-sm text-white/60">
                Seus cursos, artigos e vídeos favoritos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-white/20 bg-white/10 text-white"
            >
              <Heart className="mr-1 h-3 w-3 text-red-400" />
              {filteredItems.length} itens
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Search and Filters */}
      <GlassCard className="bg-black/80 p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar nos itens salvos..."
              className="bg-white/5 pl-10 text-white placeholder:text-white/40"
            />
          </div>
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </GlassCard>

      {/* Tabs and Content */}
      <GlassCard className="bg-black/80 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white/5">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="articles">
              <FileText className="mr-2 h-4 w-4" />
              Artigos
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="mr-2 h-4 w-4" />
              Vídeos
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px]">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookmarkX className="mb-4 h-16 w-16 text-white/20" />
                <h3 className="text-lg font-medium text-white/60">
                  Nenhum item encontrado
                </h3>
                <p className="mt-2 text-sm text-white/40">
                  {searchTerm
                    ? `Nenhum resultado para "${searchTerm}"`
                    : 'Você ainda não salvou nenhum item'}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-4 border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setSearchTerm('')}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                  const ItemIcon = getItemIcon(item.type);
                  const itemColor = getItemColor(item.type);

                  return (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-lg bg-white/5 transition-all hover:bg-white/10"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={item.thumbnail || '/images/placeholder.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover opacity-70 transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        {/* Type Badge */}
                        <div className="absolute left-3 top-3">
                          <Badge
                            variant="outline"
                            className="border-white/20 bg-black/50 backdrop-blur-sm"
                          >
                            <ItemIcon className={`mr-1 h-3 w-3 ${itemColor}`} />
                            <span className="capitalize text-white/80">
                              {item.type === 'course'
                                ? 'Curso'
                                : item.type === 'article'
                                ? 'Artigo'
                                : 'Vídeo'}
                            </span>
                          </Badge>
                        </div>

                        {/* Progress (for courses) */}
                        {item.progress !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                            <div
                              className="h-full bg-cyan-400"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}

                        {/* Play Button (for videos) */}
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="line-clamp-2 text-base font-medium text-white">
                          {item.title}
                        </h3>

                        {/* Metadata */}
                        <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
                          {item.instructor && (
                            <span>{item.instructor}</span>
                          )}
                          {item.author && <span>{item.author}</span>}
                          {item.channel && <span>{item.channel}</span>}
                          {item.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.duration}</span>
                            </div>
                          )}
                          {item.readTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.readTime}</span>
                            </div>
                          )}
                        </div>

                        {/* Rating (for courses) */}
                        {item.rating && (
                          <div className="mt-2 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-white/60">
                              {item.rating}
                            </span>
                          </div>
                        )}

                        {/* Saved Date */}
                        <div className="mt-3 flex items-center gap-1 text-xs text-white/40">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Salvo em{' '}
                            {new Date(item.savedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/${item.type}s/${item.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-white/10 text-white hover:bg-white/20"
                            >
                              {item.type === 'video' ? 'Assistir' : 'Acessar'}
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                            onClick={() => {
                              navigator.share({
                                title: item.title,
                                url: `/${item.type}s/${item.id}`,
                              });
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            onClick={() => handleRemoveItem(item.id, item.type)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Tabs>
      </GlassCard>
    </div>
  );
}