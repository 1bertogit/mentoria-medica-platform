'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  User, 
  Clock, 
  Filter,
  TrendingUp,
  Star,
  Eye,
  ThumbsUp,
  Pin,
  Award,
  Users,
  Calendar,
  Activity,
  MoreVertical,
  Bookmark,
  Share2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Enhanced mock data for discussions
const mockDiscussions = [
  {
    id: 1,
    title: 'Caso Teka Brandão - Individualização da Técnica Cirúrgica',
    author: 'Dr. Robério Brandão',
    authorRole: 'Mentor Principal',
    authorSpecialty: 'Cirurgia Plástica Facial',
    avatar: '/images/avatars/doctor1.jpg',
    replies: 15,
    views: 342,
    likes: 28,
    lastActivity: '2 horas atrás',
    createdAt: '2024-01-15T10:30:00Z',
    category: 'Cirurgia Facial',
    tags: ['frontoplastia', 'blefaroplastia', 'técnica-individualizada'],
    difficulty: 'Avançado',
    isPinned: true,
    isHot: true,
    isSolved: false,
    excerpt: 'Frontoplastia lateral + blefaroplastia + plicatura do platisma. Caso demonstrativo da individualização técnica em paciente com histórico de múltiplos procedimentos. Discussão sobre adaptações técnicas necessárias.',
    participants: 8,
    lastReplyBy: 'Dr. Carlos Silva',
    engagement: 85,
  },
  {
    id: 2,
    title: 'Deep Neck em Paciente Septuagenária - Técnica Simplificada',
    author: 'Dr. Robério Brandão',
    authorRole: 'Mentor Principal',
    authorSpecialty: 'Cirurgia Plástica Facial',
    avatar: '/images/avatars/doctor2.jpg',
    replies: 8,
    views: 156,
    likes: 12,
    lastActivity: '5 horas atrás',
    createdAt: '2024-01-14T14:20:00Z',
    category: 'Cirurgia Facial',
    tags: ['deep-neck', 'técnica-simplificada', 'paciente-idoso'],
    difficulty: 'Intermediário',
    isPinned: false,
    isHot: false,
    isSolved: true,
    excerpt: 'Descolamento periauricular + crevassi + prolene 2.0 mastoide a mastoide. Demonstração de que técnicas simples podem ser muito eficazes em pacientes com idade avançada.',
    participants: 6,
    lastReplyBy: 'Dra. Ana Costa',
    engagement: 72,
  },
  {
    id: 3,
    title: 'Protocolo Pós-Operatório Padronizado - Cirurgia Facial',
    author: 'Dr. Robério Brandão',
    authorRole: 'Mentor Principal',
    authorSpecialty: 'Cirurgia Plástica Facial',
    avatar: '/images/avatars/doctor3.jpg',
    replies: 22,
    views: 567,
    likes: 45,
    lastActivity: '1 dia atrás',
    createdAt: '2024-01-13T09:15:00Z',
    category: 'Protocolos',
    tags: ['pós-operatório', 'medicação', 'protocolo-padrão'],
    difficulty: 'Básico',
    isPinned: true,
    isHot: true,
    isSolved: false,
    excerpt: 'Medicações: Cefadroxila 7d + Nimesulida 5d + Predsim 20mg 5d + Transamin 500mg. Discussão sobre padronização e otimização de resultados no pós-operatório.',
    participants: 12,
    lastReplyBy: 'Dr. Fernando Lima',
    engagement: 92,
  },
  {
    id: 4,
    title: 'Complicações em Deep Neck - Manejo e Prevenção',
    author: 'Dra. Deyse Oliveira',
    authorRole: 'Especialista Convidada',
    authorSpecialty: 'Cirurgia Plástica',
    avatar: '/images/avatars/doctor4.jpg',
    replies: 12,
    views: 234,
    likes: 18,
    lastActivity: '2 dias atrás',
    createdAt: '2024-01-12T16:45:00Z',
    category: 'Complicações',
    tags: ['complicações', 'deep-neck', 'manejo', 'prevenção'],
    difficulty: 'Avançado',
    isPinned: false,
    isHot: false,
    isSolved: true,
    excerpt: 'Abaulamento lateral pós deep neck - diferenciação fibrose vs glândula. Protocolo com ultrassom + radiofrequência para diagnóstico diferencial e tratamento.',
    participants: 7,
    lastReplyBy: 'Dr. Paulo Santos',
    engagement: 76,
  },
  {
    id: 5,
    title: 'Endomidface - Estatísticas e Resultados (100% dos casos)',
    author: 'Dr. Robério Brandão',
    authorRole: 'Mentor Principal',
    authorSpecialty: 'Cirurgia Plástica Facial',
    avatar: '/images/avatars/doctor5.jpg',
    replies: 18,
    views: 421,
    likes: 32,
    lastActivity: '3 dias atrás',
    createdAt: '2024-01-11T11:30:00Z',
    category: 'Técnicas',
    tags: ['endomidface', 'estatísticas', 'resultados', 'análise-casos'],
    difficulty: 'Avançado',
    isPinned: false,
    isHot: true,
    isSolved: false,
    excerpt: 'Análise de resultados: Endomidface 100%, Plicatura 75%, Deep plane 25%. Discussão sobre indicações, evolução técnica e taxa de sucesso comparativa.',
    participants: 10,
    lastReplyBy: 'Dr. Roberto Medeiros',
    engagement: 88,
  },
  {
    id: 6,
    title: 'Primeiro Deep Neck - Experiência do Dr. Renato Mello',
    author: 'Dr. Renato Mello',
    authorRole: 'Aluno Ativo',
    authorSpecialty: 'Cirurgia Plástica',
    avatar: '/images/avatars/doctor6.jpg',
    replies: 7,
    views: 187,
    likes: 9,
    lastActivity: '4 dias atrás',
    createdAt: '2024-01-10T13:20:00Z',
    category: 'Experiências',
    tags: ['primeiro-caso', 'experiência', 'deep-neck', 'aprendizado'],
    difficulty: 'Intermediário',
    isPinned: false,
    isHot: false,
    isSolved: true,
    excerpt: 'Dificuldades na identificação do hioide e localização do digástrico. Precauções na liberação da fáscia profunda e lições aprendidas no primeiro caso.',
    participants: 5,
    lastReplyBy: 'Dr. Robério Brandão',
    engagement: 65,
  },
  {
    id: 7,
    title: 'Solução de Infiltração - Protocolo Otimizado',
    author: 'Dr. Robério Brandão',
    authorRole: 'Mentor Principal',
    authorSpecialty: 'Cirurgia Plástica Facial',
    avatar: '/images/avatars/doctor7.jpg',
    replies: 14,
    views: 298,
    likes: 24,
    lastActivity: '5 dias atrás',
    createdAt: '2024-01-09T15:10:00Z',
    category: 'Protocolos',
    tags: ['infiltração', 'protocolo', 'anestesia-local', 'otimização'],
    difficulty: 'Básico',
    isPinned: false,
    isHot: false,
    isSolved: false,
    excerpt: '300ml SF + 20ml Lidocaína + 20ml Bupivacaína + 1ml Adrenalina + 5ml Bicarbonato. Discussão sobre proporções ideais, tempo de ação e segurança.',
    participants: 8,
    lastReplyBy: 'Dra. Mariana Torres',
    engagement: 71,
  },
  {
    id: 8,
    title: 'Pacientes Jovens vs Idosos - Abordagem Diferenciada',
    author: 'Dr. Robério Brandão',
    authorRole: 'Mentor Principal',
    authorSpecialty: 'Cirurgia Plástica Facial',
    avatar: '/images/avatars/doctor8.jpg',
    replies: 25,
    views: 612,
    likes: 38,
    lastActivity: '1 semana atrás',
    createdAt: '2024-01-08T08:45:00Z',
    category: 'Técnicas',
    tags: ['individualização', 'idade', 'abordagem-diferenciada', 'técnica-adaptada'],
    difficulty: 'Intermediário',
    isPinned: false,
    isHot: true,
    isSolved: false,
    excerpt: 'Não ter receio de retirar pele em +60 anos. Jovens com medo de cicatrizes - abordagem conservadora. Individualização é a chave para resultados otimais.',
    participants: 14,
    lastReplyBy: 'Dr. Alexandre Nunes',
    engagement: 94,
  },
];

// Extended categories with colors and descriptions
const categories = [
  { name: 'Todos', color: 'gray', description: 'Todas as discussões' },
  { name: 'Cirurgia Facial', color: 'cyan', description: 'Técnicas de rejuvenescimento facial' },
  { name: 'Protocolos', color: 'green', description: 'Protocolos clínicos e medicamentos' },
  { name: 'Técnicas', color: 'purple', description: 'Técnicas cirúrgicas específicas' },
  { name: 'Complicações', color: 'orange', description: 'Manejo de complicações' },
  { name: 'Experiências', color: 'blue', description: 'Compartilhamento de experiências' },
];

// Sorting options
const sortOptions = [
  { value: 'recent', label: 'Mais Recentes', icon: Clock },
  { value: 'popular', label: 'Mais Populares', icon: TrendingUp },
  { value: 'replies', label: 'Mais Comentadas', icon: MessageSquare },
  { value: 'views', label: 'Mais Visualizadas', icon: Eye },
  { value: 'engagement', label: 'Maior Engajamento', icon: Activity },
];

// Mock stats
const discussionStats = {
  total: 247,
  active: 32,
  solved: 189,
  participants: 45,
  todayPosts: 8,
  weeklyGrowth: 15,
};

export default function DiscussionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('recent');
  const [viewType, setViewType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'Intermediário': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'Avançado': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'gray';
  };

  const formatTimeAgo = (dateString: string) => {
    // In a real app, this would use a proper date formatting library
    return dateString;
  };

  // Enhanced filtering and sorting
  const filteredDiscussions = mockDiscussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Todos' || discussion.category === selectedCategory;
      
      const matchesViewType = viewType === 'all' || 
                              (viewType === 'pinned' && discussion.isPinned) ||
                              (viewType === 'hot' && discussion.isHot) ||
                              (viewType === 'solved' && discussion.isSolved) ||
                              (viewType === 'unsolved' && !discussion.isSolved);
      
      return matchesSearch && matchesCategory && matchesViewType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'replies':
          return b.replies - a.replies;
        case 'views':
          return b.views - a.views;
        case 'engagement':
          return b.engagement - a.engagement;
        default:
          return 0;
      }
    });

  return (
    <div className="w-full space-y-8">
      {/* Enhanced Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
              <MessageSquare className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-gray-900 dark:text-white/90">
                Discussões Médicas
              </h1>
              <p className="text-gray-600 dark:text-white/60 text-lg">
                Compartilhamento de conhecimento e experiências entre profissionais
              </p>
            </div>
          </div>
          <Button className="glass-button h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white hover:from-cyan-500/30 hover:to-purple-500/30 hover:scale-105 transition-transform duration-200 border border-cyan-400/20">
            <Plus className="mr-2 h-5 w-5" />
            Nova Discussão
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{discussionStats.total}</div>
            <div className="text-xs text-white/60">Total</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{discussionStats.active}</div>
            <div className="text-xs text-white/60">Ativas</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{discussionStats.solved}</div>
            <div className="text-xs text-white/60">Resolvidas</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{discussionStats.participants}</div>
            <div className="text-xs text-white/60">Participantes</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{discussionStats.todayPosts}</div>
            <div className="text-xs text-white/60">Hoje</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-400">
              +{discussionStats.weeklyGrowth}%
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-xs text-white/60">Semana</div>
          </GlassCard>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <GlassCard className="p-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por título, autor, tags ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input h-12 pl-12 text-base"
              />
            </div>
            
            {/* Sort Buttons */}
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className={`glass-button transition-all duration-200 ${
                    sortBy === option.value 
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" 
                      : "hover:scale-105"
                  }`}
                  title={option.label}
                >
                  <option.icon className="mr-1 h-3 w-3" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* View Type Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewType === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType('all')}
              className={`glass-button transition-all duration-200 ${
                viewType === 'all' 
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" 
                  : "hover:scale-105"
              }`}
            >
              Todas ({mockDiscussions.length})
            </Button>
            <Button
              variant={viewType === 'pinned' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType('pinned')}
              className={`glass-button transition-all duration-200 ${
                viewType === 'pinned' 
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30" 
                  : "hover:scale-105"
              }`}
            >
              <Pin className="mr-1 h-3 w-3" />
              Fixadas ({mockDiscussions.filter(d => d.isPinned).length})
            </Button>
            <Button
              variant={viewType === 'hot' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType('hot')}
              className={`glass-button transition-all duration-200 ${
                viewType === 'hot' 
                  ? "bg-orange-500/20 text-orange-300 border-orange-400/30" 
                  : "hover:scale-105"
              }`}
            >
              <Zap className="mr-1 h-3 w-3" />
              Em Alta ({mockDiscussions.filter(d => d.isHot).length})
            </Button>
            <Button
              variant={viewType === 'solved' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType('solved')}
              className={`glass-button transition-all duration-200 ${
                viewType === 'solved' 
                  ? "bg-green-500/20 text-green-300 border-green-400/30" 
                  : "hover:scale-105"
              }`}
            >
              <Award className="mr-1 h-3 w-3" />
              Resolvidas ({mockDiscussions.filter(d => d.isSolved).length})
            </Button>
            <Button
              variant={viewType === 'unsolved' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType('unsolved')}
              className={`glass-button transition-all duration-200 ${
                viewType === 'unsolved' 
                  ? "bg-purple-500/20 text-purple-300 border-purple-400/30" 
                  : "hover:scale-105"
              }`}
            >
              <MessageSquare className="mr-1 h-3 w-3" />
              Em Aberto ({mockDiscussions.filter(d => !d.isSolved).length})
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className={`glass-button transition-all duration-200 ${
                  selectedCategory === category.name 
                    ? `bg-${category.color}-500/20 text-${category.color}-300 border-${category.color}-400/30` 
                    : "hover:scale-105"
                }`}
                title={category.description}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Enhanced Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <GlassCard 
            key={discussion.id} 
            className={`group p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-500/5 cursor-pointer ${
              discussion.isPinned ? 'ring-1 ring-yellow-400/30 bg-yellow-500/5' : ''
            }`}
            onClick={() => router.push(`/discussions/${discussion.id}`)}
          >
            <div className="flex items-start gap-6">
              {/* Author Avatar & Info */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-14 w-14 ring-2 ring-cyan-400/20">
                    <AvatarImage src={discussion.avatar} alt={discussion.author} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 font-semibold">
                      {discussion.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {discussion.authorRole === 'Mentor Principal' && (
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {discussion.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                      {discussion.isHot && <Zap className="h-4 w-4 text-orange-400" />}
                      {discussion.isSolved && <Award className="h-4 w-4 text-green-400" />}
                      <h3 className="text-xl font-semibold text-white/95 group-hover:text-cyan-400 transition-colors duration-200">
                        {discussion.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                      <span className="font-medium text-white/80">{discussion.author}</span>
                      <Badge variant="outline" className="text-xs px-2 py-0 bg-blue-500/10 text-blue-300 border-blue-400/30">
                        {discussion.authorRole}
                      </Badge>
                      <span>•</span>
                      <Badge className={`text-xs px-2 py-0 bg-${getCategoryColor(discussion.category)}-500/20 text-${getCategoryColor(discussion.category)}-300 border-${getCategoryColor(discussion.category)}-400/30`}>
                        {discussion.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs px-2 py-0 ${getDifficultyColor(discussion.difficulty)}`}>
                        {discussion.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Stats & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>{discussion.views}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replies}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{discussion.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-green-400 transition-colors">
                        <Users className="h-4 w-4" />
                        <span>{discussion.participants}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="glass-button h-8 w-8 p-0 hover:bg-blue-500/20" 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle bookmark action
                        }}
                        title="Salvar discussão"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="glass-button h-8 w-8 p-0 hover:bg-green-500/20" 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle share action
                        }}
                        title="Compartilhar discussão"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Content Preview */}
                <p className="text-white/70 leading-relaxed line-clamp-2">
                  {discussion.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {discussion.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0 bg-white/5 text-white/50 border-white/10 hover:bg-white/10 transition-colors">
                      #{tag}
                    </Badge>
                  ))}
                  {discussion.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-0 bg-white/5 text-white/50 border-white/10">
                      +{discussion.tags.length - 4}
                    </Badge>
                  )}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{discussion.lastActivity}</span>
                    </div>
                    {discussion.lastReplyBy && (
                      <>
                        <span>•</span>
                        <span>Última resposta: {discussion.lastReplyBy}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Engagement Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">Engajamento:</span>
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-300"
                        style={{ width: `${discussion.engagement}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60 font-medium">{discussion.engagement}%</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredDiscussions.length === 0 && (
        <GlassCard className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white/90 mb-2">
                {searchTerm ? 'Nenhuma discussão encontrada' : 'Seja o primeiro a iniciar uma discussão!'}
              </h3>
              <p className="text-white/60 max-w-md">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca ou explore outras categorias.'
                  : 'Compartilhe seus conhecimentos e experiências com a comunidade médica.'
                }
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="glass-button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todos');
                    setViewType('all');
                  }}
                >
                  Limpar filtros
                </Button>
              )}
              <Button className="glass-button bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white hover:from-cyan-500/30 hover:to-purple-500/30">
                <Plus className="mr-2 h-4 w-4" />
                Nova Discussão
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Results Summary */}
      {filteredDiscussions.length > 0 && (
        <div className="flex items-center justify-center text-sm text-white/50 py-4">
          Mostrando {filteredDiscussions.length} de {mockDiscussions.length} discussões
          {selectedCategory !== 'Todos' && (
            <Badge variant="outline" className="ml-2 text-xs px-2 py-0 bg-white/5">
              {selectedCategory}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}