'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  PlayCircle,
  Search,
  Filter,
  Clock,
  Users,
  Star,
  Download,
  Bookmark,
  Eye,
  Calendar,
  Video,
  Award,
  TrendingUp,
  BookOpen,
  User,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { getGlassPattern } from '@/lib/styles/glass-morphism';

// Dados das gravações de encontros
const recordedMeetings = [
  {
    id: 1,
    title: 'Encontro #1: Fundamentos do Facelift Moderno',
    instructor: 'Dr. Robério Brandão',
    duration: '2h 45min',
    views: 2847,
    rating: 4.9,
    category: 'Facelift',
    level: 'Avançado',
    description:
      'Introdução completa às técnicas modernas de facelift, anatomia facial e planejamento cirúrgico detalhado.',
    thumbnail: '/images/meetings/facelift-fundamentals.jpg',
    recordedAt: '2024-03-15',
    meetingNumber: 1,
    topics: [
      'Anatomia facial aplicada',
      'Técnicas de marcação',
      'Planejamento pré-operatório',
      'Instrumentais específicos',
    ],

    hasSubtitles: true,
    hasNotes: true,
    progress: 0,
  },
  {
    id: 2,
    title: 'Encontro #2: Técnicas de Deep Plane',
    instructor: 'Dr. Robério Brandão',
    duration: '3h 15min',
    views: 2156,
    rating: 4.8,
    category: 'Facelift',
    level: 'Avançado',
    description:
      'Demonstração prática das técnicas de deep plane facelift com casos reais e discussão de resultados.',
    thumbnail: '/images/meetings/deep-plane-techniques.jpg',
    recordedAt: '2024-03-22',
    meetingNumber: 2,
    topics: [
      'Técnica deep plane',
      'Dissecção anatômica',
      'Manejo de complicações',
      'Casos clínicos',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 68,
  },
  {
    id: 3,
    title: 'Encontro #3: Rinoplastia Estruturada',
    instructor: 'Dra. Maria Santos',
    duration: '2h 30min',
    views: 1923,
    rating: 4.9,
    category: 'Rinoplastia',
    level: 'Intermediário',
    description:
      'Abordagem estruturada da rinoplastia com técnicas de preservação e casos complexos.',
    thumbnail: '/images/meetings/structured-rhinoplasty.jpg',
    recordedAt: '2024-03-29',
    meetingNumber: 3,
    topics: [
      'Rinoplastia estruturada',
      'Técnicas de preservação',
      'Enxertos cartilaginosos',
      'Refinamentos',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 34,
  },
  {
    id: 4,
    title: 'Encontro #4: Blefaroplastia Avançada',
    instructor: 'Dr. Carlos Mendes',
    duration: '2h 15min',
    views: 1678,
    rating: 4.7,
    category: 'Blefaroplastia',
    level: 'Avançado',
    description:
      'Técnicas avançadas de blefaroplastia superior e inferior com abordagem minimamente invasiva.',
    thumbnail: '/images/meetings/advanced-blepharoplasty.jpg',
    recordedAt: '2024-04-05',
    meetingNumber: 4,
    topics: [
      'Blefaroplastia superior',
      'Blefaroplastia inferior',
      'Preservação muscular',
      'Correção de ptose',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 0,
  },
  {
    id: 5,
    title: 'Encontro #5: Harmonização Facial Completa',
    instructor: 'Dra. Ana Costa',
    duration: '2h 50min',
    views: 2234,
    rating: 4.8,
    category: 'Harmonização',
    level: 'Intermediário',
    description:
      'Planejamento e execução de harmonização facial completa com técnicas combinadas.',
    thumbnail: '/images/meetings/facial-harmonization.jpg',
    recordedAt: '2024-04-12',
    meetingNumber: 5,
    topics: [
      'Análise facial',
      'Proporções áureas',
      'Técnicas combinadas',
      'Planejamento digital',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 0,
  },
  {
    id: 6,
    title: 'Encontro #6: Mamoplastia Moderna',
    instructor: 'Dr. Ricardo Alves',
    duration: '3h 20min',
    views: 1845,
    rating: 4.9,
    category: 'Mamoplastia',
    level: 'Avançado',
    description:
      'Técnicas modernas de mamoplastia incluindo aumento, redução e reconstrução mamária.',
    thumbnail: '/images/meetings/modern-mammoplasty.jpg',
    recordedAt: '2024-04-19',
    meetingNumber: 6,
    topics: [
      'Aumento mamário',
      'Redução mamária',
      'Mastopexia',
      'Implantes modernos',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 0,
  },
  {
    id: 7,
    title: 'Encontro #7: Q&A - Dúvidas dos Participantes',
    instructor: 'Dr. Robério Brandão',
    duration: '1h 45min',
    views: 1456,
    rating: 4.6,
    category: 'Q&A',
    level: 'Todos os níveis',
    description:
      'Sessão especial de perguntas e respostas com dúvidas enviadas pelos participantes.',
    thumbnail: '/images/meetings/qa-session.jpg',
    recordedAt: '2024-04-26',
    meetingNumber: 7,
    topics: [
      'Dúvidas técnicas',
      'Casos complexos',
      'Complicações',
      'Dicas práticas',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 0,
  },
  {
    id: 8,
    title: 'Encontro #8: Casos Clínicos Comentados',
    instructor: 'Equipe Completa',
    duration: '2h 35min',
    views: 1789,
    rating: 4.8,
    category: 'Casos Clínicos',
    level: 'Avançado',
    description:
      'Análise detalhada de casos clínicos reais com discussão multidisciplinar da equipe.',
    thumbnail: '/images/meetings/clinical-cases.jpg',
    recordedAt: '2024-05-03',
    meetingNumber: 8,
    topics: [
      'Casos desafiadores',
      'Discussão multidisciplinar',
      'Resultados a longo prazo',
      'Lições aprendidas',
    ],
    hasSubtitles: true,
    hasNotes: true,
    progress: 0,
  },
];

const categories = [
  'Todas',
  'Facelift',
  'Rinoplastia',
  'Blefaroplastia',
  'Harmonização',
  'Mamoplastia',
  'Q&A',
  'Casos Clínicos',
];

const levels = ['Todos os níveis', 'Intermediário', 'Avançado'];

export default function ClassesPage() {
  const [meetings] = useState(recordedMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [levelFilter, setLevelFilter] = useState('Todos os níveis');
  const [sortBy, setSortBy] = useState<
    'newest' | 'popular' | 'rating' | 'meeting'
  >('meeting');

  const filteredMeetings = meetings
    .filter(meeting => {
      const matchesSearch =
        searchTerm === '' ||
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.topics.some(topic =>
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === 'Todas' || meeting.category === categoryFilter;

      const matchesLevel =
        levelFilter === 'Todos os níveis' || meeting.level === levelFilter;

      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
          );
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'meeting':
          return a.meetingNumber - b.meetingNumber;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Facelift: 'from-purple-500 to-pink-500',
      Rinoplastia: 'from-blue-500 to-cyan-500',
      Blefaroplastia: 'from-green-500 to-emerald-500',
      Harmonização: 'from-orange-500 to-red-500',
      Mamoplastia: 'from-indigo-500 to-purple-500',
      'Q&A': 'from-yellow-500 to-orange-500',
      'Casos Clínicos': 'from-teal-500 to-blue-500',
    };
    return (
      colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
    );
  };

  const totalMeetings = meetings.length;
  const totalDuration = meetings.reduce((acc, meeting) => {
    const [hours, minutes] = meeting.duration
      .replace('h ', ':')
      .replace('min', '')
      .split(':');
    return acc + parseInt(hours) * 60 + parseInt(minutes);
  }, 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Gravações dos Encontros
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Acesse todas as gravações dos encontros ao vivo com especialistas em
            cirurgia plástica
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalMeetings}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Encontros
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalHours}h {totalMinutes}min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Conteúdo
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">HD</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Qualidade
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={`${getGlassPattern('card')} border-0 p-6 shadow-lg`}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-white/40" />
                  <Input
                    type="text"
                    placeholder="Buscar por título, instrutor, tópicos..."
                    className="h-12 w-full pl-12 text-base"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select
                  value={sortBy}
                  onValueChange={(
                    value: 'newest' | 'popular' | 'rating' | 'meeting'
                  ) => setSortBy(value)}
                >
                  <SelectTrigger className="h-12 w-full text-base md:w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Por Encontro</SelectItem>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                    <SelectItem value="rating">Melhor Avaliadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                  <Filter className="h-4 w-4" />
                  <span>Filtros:</span>
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="h-9 w-[160px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="h-9 w-[140px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-sm text-gray-600 dark:text-white/60">
                  {filteredMeetings.length} encontro
                  {filteredMeetings.length !== 1 ? 's' : ''} encontrado
                  {filteredMeetings.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de Encontros */}
        <div className="space-y-6">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`${getGlassPattern('interactiveCard')} group overflow-hidden border-0 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Thumbnail */}
                  <div className="relative h-64 flex-shrink-0 lg:h-auto lg:w-96">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900" />

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PlayCircle className="h-10 w-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Meeting Number */}
                    <div className="absolute left-4 top-4">
                      <Badge
                        className={`bg-gradient-to-r ${getCategoryColor(meeting.category)} font-semibold text-white`}
                      >
                        Encontro #{meeting.meetingNumber}
                      </Badge>
                    </div>

                    {/* HD Badge */}
                    <div className="absolute right-4 top-4">
                      <Badge className="bg-black/50 text-white backdrop-blur-sm">
                        HD
                      </Badge>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-1 rounded-lg bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        <Clock className="h-4 w-4" />
                        <span>{meeting.duration}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {meeting.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${meeting.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-grow flex-col p-6">
                    {/* Header */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge
                        className={`bg-gradient-to-r ${getCategoryColor(meeting.category)} text-white`}
                      >
                        {meeting.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/20 text-white/60"
                      >
                        {meeting.level}
                      </Badge>
                      {meeting.hasSubtitles && (
                        <Badge
                          variant="outline"
                          className="border-blue-400/30 bg-blue-500/10 text-blue-400"
                        >
                          Legendas
                        </Badge>
                      )}
                      {meeting.hasNotes && (
                        <Badge
                          variant="outline"
                          className="border-green-400/30 bg-green-500/10 text-green-400"
                        >
                          Anotações
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-white">
                      {meeting.title}
                    </h3>

                    {/* Instructor */}
                    <div className="mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {meeting.instructor}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-white/70">
                      {meeting.description}
                    </p>

                    {/* Topics */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                        Tópicos Abordados:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {meeting.topics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress */}
                    {meeting.progress > 0 && (
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-white/60">
                            Progresso
                          </span>
                          <span className="font-medium text-green-600">
                            {meeting.progress}%
                          </span>
                        </div>
                        <Progress value={meeting.progress} className="h-2" />
                      </div>
                    )}

                    {/* Stats */}
                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-white/50">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>
                          {meeting.views.toLocaleString()} visualizações
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{meeting.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(meeting.recordedAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          asChild
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Link href={`/classes/${meeting.id}`}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            {meeting.progress > 0 ? 'Continuar' : 'Assistir'}
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="border-white/20 hover:bg-white/10"
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          Salvar
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-white/50">
                        Clique em "Assistir&quot; para reproduzir online
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {filteredMeetings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className={`${getGlassPattern('card')} border-0 p-12 text-center shadow-lg`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                    <Video className="h-8 w-8 text-white/40" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-white/80">
                      Nenhum encontro encontrado
                    </h3>
                    <p className="max-w-md text-white/60">
                      {searchTerm ||
                      categoryFilter !== 'Todas' ||
                      levelFilter !== 'Todos os níveis'
                        ? 'Tente ajustar os filtros de busca.'
                        : 'Ainda não há gravações disponíveis.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
