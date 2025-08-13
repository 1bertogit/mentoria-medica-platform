'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Bookmark,
  FileText,
  Video,
  MessageSquare,
  Archive,
  Calendar,
  Eye,
  Heart,
  Share2,
  Trash2,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { BorderBeam } from '@/components/magicui/border-beam';

export default function SalvosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data para itens salvos
  const savedItems = [
    {
      id: 1,
      title: 'Técnicas Avançadas de Facelift Endoscópico',
      description:
        'Artigo completo sobre as mais recentes técnicas minimamente invasivas para rejuvenescimento facial.',
      type: 'article',
      category: 'Biblioteca',
      author: 'Dr. João Silva',
      savedAt: '2024-01-15',
      views: 1250,
      likes: 89,
      url: '/library/1',
      thumbnail: '/images/articles/facelift-endoscopic.jpg',
    },
    {
      id: 2,
      title: 'Aula: Anatomia Facial Aplicada',
      description:
        'Vídeo-aula detalhada sobre anatomia facial com foco em procedimentos estéticos.',
      type: 'video',
      category: 'Academy',
      author: 'Dra. Maria Santos',
      savedAt: '2024-01-12',
      views: 890,
      likes: 156,
      url: '/academy/facelift/2',
      thumbnail: '/images/courses/anatomy.jpg',
    },
    {
      id: 3,
      title: 'Caso Clínico: Facelift em Paciente Jovem',
      description:
        'Discussão sobre abordagem cirúrgica em paciente de 35 anos com ptose facial precoce.',
      type: 'case',
      category: 'Casos Clínicos',
      author: 'Dr. Carlos Lima',
      savedAt: '2024-01-10',
      views: 650,
      likes: 78,
      url: '/cases/3',
      thumbnail: '/images/cases/young-facelift.jpg',
    },
    {
      id: 4,
      title: 'Discussão: Complicações Pós-Operatórias',
      description:
        'Thread sobre manejo de complicações e estratégias de prevenção em cirurgia facial.',
      type: 'discussion',
      category: 'Discussões',
      author: 'Dra. Ana Costa',
      savedAt: '2024-01-08',
      views: 420,
      likes: 34,
      url: '/discussions/4',
      thumbnail: '/images/discussions/complications.jpg',
    },
    {
      id: 5,
      title: 'Protocolo de Recuperação Pós-Facelift',
      description:
        'Documento histórico com protocolos de cuidados pós-operatórios atualizados.',
      type: 'document',
      category: 'Arquivo',
      author: 'Equipe Médica',
      savedAt: '2024-01-05',
      views: 320,
      likes: 45,
      url: '/archive/5',
      thumbnail: '/images/archive/protocol.jpg',
    },
    {
      id: 6,
      title: 'Gravação: Q&A Semana 2 - Mentoria',
      description:
        'Sessão de perguntas e respostas da segunda semana da mentoria em grupo.',
      type: 'mentoria',
      category: 'Mentoria',
      author: 'Dr. Mentor',
      savedAt: '2024-01-03',
      views: 180,
      likes: 67,
      url: '/classes/6',
      thumbnail: '/images/mentoria/qa-week2.jpg',
    },
  ];

  const categories = [
    'all',
    'Biblioteca',
    'Academy',
    'Casos Clínicos',
    'Discussões',
    'Arquivo',
    'Mentoria',
  ];

  const filteredItems = savedItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'case':
        return <MessageSquare className="h-4 w-4" />;
      case 'discussion':
        return <MessageSquare className="h-4 w-4" />;
      case 'document':
        return <Archive className="h-4 w-4" />;
      case 'mentoria':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'video':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'case':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'discussion':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'document':
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      case 'mentoria':
        return 'bg-pink-500/20 text-pink-300 border-pink-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleRemoveFromSaved = (itemId: number) => {
    // Implementar lógica para remover item dos salvos
    };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <section aria-label="Cabeçalho dos Salvos">
        <GlassCard className="relative overflow-hidden border-gray-800 bg-black/80 p-8">
          <BorderBeam size={250} duration={12} delay={9} />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600">
                <Bookmark className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Itens Salvos</h1>
                <p className="text-gray-300">
                  Seus conteúdos favoritos organizados em um só lugar
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-yellow-400">
                  {savedItems.length}
                </div>
                <div className="text-sm text-gray-400">Total de Itens</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-blue-400">
                  {savedItems.filter(item => item.type === 'article').length}
                </div>
                <div className="text-sm text-gray-400">Artigos</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-purple-400">
                  {
                    savedItems.filter(
                      item => item.type === 'video' || item.type === 'mentoria'
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-400">Vídeos</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-green-400">
                  {
                    savedItems.filter(
                      item => item.type === 'case' || item.type === 'discussion'
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-400">Discussões</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Search and Filters */}
      <section aria-label="Busca e filtros">
        <GlassCard className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-white/40" />
              <Input
                type="text"
                placeholder="Buscar nos seus itens salvos..."
                className="glass-input h-12 w-full pl-12 text-base"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : ''
                  }
                >
                  {category === 'all' ? 'Todos' : category}
                </Button>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Saved Items Grid */}
      <section aria-label="Lista de itens salvos">
        {filteredItems.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Bookmark className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-white/20" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/80">
              {searchTerm || selectedCategory !== 'all'
                ? 'Nenhum item encontrado'
                : 'Nenhum item salvo'}
            </h3>
            <p className="mx-auto max-w-md text-gray-600 dark:text-white/60">
              {searchTerm || selectedCategory !== 'all'
                ? 'Tente ajustar os filtros ou termos de busca.'
                : 'Comece salvando conteúdos interessantes para acessá-los facilmente depois.'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredItems.map(item => (
              <GlassCard
                key={item.id}
                className="group overflow-hidden p-0 transition-all duration-300 hover:scale-[1.02]"
                interactive={true}
              >
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromSaved(item.id)}
                      className="text-gray-500 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link href={item.url}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-cyan-400 dark:text-white/95">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-white/70">
                    {item.description}
                  </p>

                  <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-white/60">
                    <span>por {item.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Salvo em {formatDate(item.savedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white/60">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{item.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Link href={item.url}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                        >
                          Acessar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
