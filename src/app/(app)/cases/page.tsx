'use client';

import { useState, useRef, useEffect } from 'react';
import logger from '@/lib/logger';
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
import { Label } from '@/components/ui/label';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  Bot,
  MessageSquare,
  Bookmark,
  Image as ImageIcon,
  Upload,
  X,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { getCasesAction } from '@/app/actions/data-actions';
import type { MedicalCase } from '@/lib/mock-data/cases';
import { useFavorites } from '@/hooks/use-favorites';
import { toastHelpers } from '@/hooks/use-toast';
import { getCaseBanner } from '@/lib/utils/banner-generator';
import dynamic from 'next/dynamic';

// Dynamic import do Carousel para reduzir bundle inicial
const Carousel = dynamic(
  () => import('@/components/ui/carousel').then(mod => mod.Carousel),
  {
    loading: () => (
      <div className="h-[400px] animate-pulse rounded-xl bg-white/5" />
    ),
    ssr: false,
  }
);
const CarouselContent = dynamic(() =>
  import('@/components/ui/carousel').then(mod => mod.CarouselContent)
);
const CarouselItem = dynamic(() =>
  import('@/components/ui/carousel').then(mod => mod.CarouselItem)
);
const CarouselNext = dynamic(() =>
  import('@/components/ui/carousel').then(mod => mod.CarouselNext)
);
const CarouselPrevious = dynamic(() =>
  import('@/components/ui/carousel').then(mod => mod.CarouselPrevious)
);

const statusColors: { [key: string]: string } = {
  'Em Análise': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  Aprovado: 'bg-green-500/20 text-green-300 border-green-400/30',
  'Requer Revisão': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
};

const specialtyColors: { [key: string]: string } = {
  Rinoplastia: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  Mamoplastia: 'text-pink-400 border-pink-400/30 bg-pink-500/10',
  Blefaroplastia: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
  Lifting: 'text-orange-400 border-orange-400/30 bg-orange-500/10',
  'Cirurgia Facial': 'text-purple-400 border-purple-400/30 bg-purple-500/10',
  Outros: 'text-gray-400 border-gray-400/30 bg-gray-500/10',
};

export default function CasesPage() {
  const [medicalCases, setMedicalCases] = useState<MedicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(
    'newest'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedCases, setSavedCases] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        // Usar o data service que retorna dados mockados instantaneamente
        const cases = await getCasesAction();
        setMedicalCases(cases);
      } catch (error) {
        logger.error('Error loading cases:', error);
        setError('Erro ao carregar casos.');
        setMedicalCases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
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

  const filteredCases = medicalCases
    .filter(c => {
      const matchesSearch =
        searchTerm === '' ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.analysis &&
          c.analysis.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSpecialty =
        specialtyFilter === 'all' || c.specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt || '').getTime() -
            new Date(b.createdAt || '').getTime()
          );
        case 'popular':
          return (b.videoCount || 0) - (a.videoCount || 0);
        default:
          return 0;
      }
    });

  const handleSaveCase = (caseId: string) => {
    setSavedCases(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  return (
    <div
      className="w-full"
      role="region"
      aria-label="Discussão de casos clínicos"
    >
      {/* Header dos Casos Clínicos */}
      <section className="mb-8" aria-label="Cabeçalho dos casos clínicos">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <MessageSquare className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-light text-gray-900 dark:text-white/90">
              Casos Clínicos
            </h1>
            <p className="text-gray-600 dark:text-white/60">
              Compartilhamento e discussão de casos reais entre profissionais
            </p>
          </div>
        </div>
      </section>

      {error && (
        <GlassCard className="mb-4 border-yellow-400/30 bg-yellow-500/10 p-4">
          <div className="flex items-center gap-2 text-yellow-300">
            <span className="text-sm">⚠️ {error}</span>
          </div>
        </GlassCard>
      )}
      <section aria-label="Busca e filtros">
        <GlassCard className="mb-8 p-4">
          <div className="flex flex-col gap-4">
            {/* Primeira linha - Busca e filtros principais */}
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-white/40" />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400"></div>
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Buscar por título, autor ou análise..."
                  className="glass-input h-12 w-full pl-12 pr-12 text-base text-gray-900 dark:text-white/80"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={specialtyFilter}
                onValueChange={setSpecialtyFilter}
              >
                <SelectTrigger className="glass-input h-12 w-full text-base text-gray-900 dark:text-white/80 md:w-[220px]">
                  <SelectValue placeholder="Filtrar por especialidade" />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todas as Especialidades</SelectItem>
                  <SelectItem value="Cirurgia Facial">Cirurgia Facial</SelectItem>
                  <SelectItem value="Rinoplastia">Rinoplastia</SelectItem>
                  <SelectItem value="Mamoplastia">Mamoplastia</SelectItem>
                  <SelectItem value="Blefaroplastia">Blefaroplastia</SelectItem>
                  <SelectItem value="Lifting">Lifting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segunda linha - Controles de ordenação e visualização */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-white/60">
                  Ordenar por:
                </span>
                <Select
                  value={sortBy}
                  onValueChange={(value: 'newest' | 'oldest' | 'popular') =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="glass-input h-9 w-[140px] text-sm text-gray-900 dark:text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="oldest">Mais Antigos</SelectItem>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-white/60">
                  {filteredCases.length} caso
                  {filteredCases.length !== 1 ? 's' : ''} encontrado
                  {filteredCases.length !== 1 ? 's' : ''}
                </span>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="glass-button h-8 px-3 text-xs transition-transform duration-200 hover:scale-105"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Limpar busca
                  </Button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {filteredCases.length === 0 && !isLoading ? (
        <GlassCard className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
              <Search className="h-8 w-8 text-gray-400 dark:text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/80">
              {searchTerm || specialtyFilter !== 'all'
                ? 'Nenhum caso encontrado'
                : 'Nenhum caso disponível'}
            </h3>
            <p className="max-w-md text-gray-600 dark:text-white/60">
              {searchTerm || specialtyFilter !== 'all'
                ? 'Tente ajustar os filtros de busca ou limpar os termos de pesquisa.'
                : 'Ainda não há casos clínicos disponíveis para discussão.'}
            </p>
            {(searchTerm || specialtyFilter !== 'all') && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSpecialtyFilter('all');
                }}
                className="glass-button bg-cyan-400/20 text-cyan-300 transition-transform duration-200 hover:scale-105 hover:bg-cyan-400/30"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </GlassCard>
      ) : (
        <section aria-label="Lista de casos clínicos">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <GlassCard
                    key={index}
                    className="animate-pulse overflow-hidden p-0"
                  >
                    <div className="aspect-video bg-white/5"></div>
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 rounded bg-white/10"></div>
                      <div className="h-3 w-1/2 rounded bg-white/5"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 rounded-full bg-white/5"></div>
                        <div className="h-6 w-20 rounded-full bg-white/5"></div>
                      </div>
                    </div>
                  </GlassCard>
                ))
              : filteredCases.map(medicalCase => (
                  <Link
                    key={medicalCase.id}
                    href={`/cases/${medicalCase.id}`}
                    passHref
                  >
                    <GlassCard
                      interactive={true}
                      className="group h-full overflow-hidden p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={
                            medicalCase.imageUrl === 'BANNER_GENERATED' 
                              ? getCaseBanner(medicalCase.id)
                              : medicalCase.imageUrl || getCaseBanner(medicalCase.id)
                          }
                          alt={medicalCase.title}
                          fill
                          className="object-cover opacity-70 transition-opacity duration-300 group-hover:scale-105 group-hover:opacity-100"
                          data-ai-hint={medicalCase.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all group-hover:from-black/60"></div>

                        {/* Media indicators */}
                        <div className="absolute left-3 top-3 flex gap-2">
                          {medicalCase.imageCount > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
                              <ImageIcon className="h-3 w-3 text-white/80" />
                              <span className="text-xs text-white/80">
                                {medicalCase.imageCount}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Save button */}
                        <button
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite({
                              id: medicalCase.id,
                              type: 'case',
                              title: medicalCase.title,
                              url: `/cases/${medicalCase.id}`,
                              metadata: {
                                author: medicalCase.submittedBy,
                                specialty: medicalCase.specialty,
                                thumbnail: medicalCase.imageUrl,
                              },
                            });
                          }}
                          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                            isFavorite(medicalCase.id, 'case')
                              ? 'bg-red-500/50 text-red-300'
                              : 'bg-black/50 text-white/80 hover:bg-red-500/50 hover:text-red-300'
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${isFavorite(medicalCase.id, 'case') ? 'fill-current' : ''}`}
                          />
                        </button>

                      </div>

                      <div className="p-4">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 flex-1 text-base font-medium leading-tight text-white/95">
                            {medicalCase.title}
                          </h3>
                        </div>

                        <p className="mb-3 text-sm text-white/60">
                          Por {medicalCase.submittedBy}
                        </p>

                        <div className="mb-3 flex flex-wrap gap-2">
                          <Badge
                            className={`px-2 py-1 text-xs ${specialtyColors[medicalCase.specialty] || specialtyColors['Outros']}`}
                          >
                            {medicalCase.specialty}
                          </Badge>
                          <Badge
                            className={`px-2 py-1 text-xs ${statusColors[medicalCase.status]}`}
                          >
                            {medicalCase.status}
                          </Badge>
                        </div>

                        {medicalCase.analysis && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-white/50">
                            {medicalCase.analysis}
                          </p>
                        )}
                      </div>
                    </GlassCard>
                  </Link>
                ))}
          </div>
        </section>
      )}
    </div>
  );
}
