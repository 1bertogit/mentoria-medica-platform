'use client';

import { useState } from 'react';
import { 
  Shield, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertTriangle, 
  Clock, 
  User,
  MessageSquare,
  FileText,
  Users,
  Filter,
  Search,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockModerationQueue, updateModerationStatus, type ContentModerationItem } from '@/lib/mock-data/admin';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'flagged';
type FilterType = 'all' | 'case' | 'comment' | 'discussion' | 'article';
type FilterPriority = 'all' | 'low' | 'medium' | 'high' | 'urgent';

export default function ContentModeration() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<ContentModerationItem[]>(mockModerationQueue);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');
  const [selectedItem, setSelectedItem] = useState<ContentModerationItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white/80 mb-2">Acesso Negado</h2>
          <p className="text-white/60 mb-4">
            Você não tem permissão para moderar conteúdo.
          </p>
          <Link href="/admin">
            <Button className="glass-button">
              Voltar ao Admin
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Filter items
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.author.name.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

    return true;
  });

  const handleModeration = (itemId: string, status: ContentModerationItem['status']) => {
    if (updateModerationStatus(itemId, status, 'Dr. Ana Silva')) {
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status,
              moderatedAt: new Date().toISOString(),
              moderatedBy: 'Dr. Ana Silva'
            } 
          : item
      ));
      setSelectedItem(null);
      setModerationNotes('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'flagged': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'case': return <FileText className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'discussion': return <Users className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFlagIcon = (flagType: string) => {
    switch (flagType) {
      case 'spam': return '📧';
      case 'inappropriate': return '⚠️';
      case 'copyright': return '©️';
      case 'medical_accuracy': return '🏥';
      case 'other': return '🚩';
      default: return '🚩';
    }
  };

  const pendingCount = items.filter(item => item.status === 'pending').length;
  const flaggedCount = items.filter(item => item.status === 'flagged').length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho da moderação de conteúdo">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" className="glass-button hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white/90">Moderação de Conteúdo</h1>
              <p className="text-white/60">
                {filteredItems.length} de {items.length} itens
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {pendingCount}
            </div>
            <div className="text-sm text-white/60">Pendentes</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {flaggedCount}
            </div>
            <div className="text-sm text-white/60">Sinalizados</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {items.filter(i => i.status === 'approved').length}
            </div>
            <div className="text-sm text-white/60">Aprovados</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {items.filter(i => i.status === 'rejected').length}
            </div>
            <div className="text-sm text-white/60">Rejeitados</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Buscar por título, conteúdo ou autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
                <SelectTrigger className="w-[130px] glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="flagged">Sinalizado</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as FilterType)}>
                <SelectTrigger className="w-[120px] glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="case">Caso</SelectItem>
                  <SelectItem value="comment">Comentário</SelectItem>
                  <SelectItem value="discussion">Discussão</SelectItem>
                  <SelectItem value="article">Artigo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as FilterPriority)}>
                <SelectTrigger className="w-[130px] glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Prioridades</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Content List */}
      <section aria-label="Lista de conteúdo para moderação">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Items List */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer"
                >
                  <GlassCard 
                    className={`p-4 transition-all duration-200 ${
                      selectedItem?.id === item.id ? 'ring-2 ring-cyan-400/50' : ''
                    }`}
                  >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white/90 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/60">
                          por {item.author.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {item.content}
                  </p>

                  {/* Flags */}
                  {item.flags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Flag className="w-4 h-4 text-orange-400" />
                      <div className="flex items-center gap-2">
                        {item.flags.map((flag, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <span className="text-sm">{getFlagIcon(flag.type)}</span>
                            <span className="text-xs text-white/60">
                              {flag.count} {flag.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{formatDate(item.submittedAt)}</span>
                    {item.moderatedAt && (
                      <span>Moderado em {formatDate(item.moderatedAt)}</span>
                    )}
                  </div>
                </GlassCard>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:sticky lg:top-6">
              {selectedItem ? (
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white/90">
                      Detalhes do Item
                    </h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-pane">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Original
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Ver Perfil do Autor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Item Info */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-white/90 mb-2">
                        {selectedItem.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getStatusColor(selectedItem.status)}`}>
                          {selectedItem.status}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(selectedItem.priority)}`}>
                          {selectedItem.priority}
                        </Badge>
                        <Badge className="text-xs bg-blue-500/20 text-blue-300">
                          {selectedItem.type}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Conteúdo:</h4>
                      <div className="p-3 rounded-lg bg-white/5 text-sm text-white/70">
                        {selectedItem.content}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Autor:</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/90">
                            {selectedItem.author.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {selectedItem.author.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Flags Details */}
                    {selectedItem.flags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-white/80 mb-2">Sinalizações:</h4>
                        <div className="space-y-2">
                          {selectedItem.flags.map((flag, index) => (
                            <div key={index} className="p-2 rounded-lg bg-orange-500/10 border-l-2 border-orange-400/50">
                              <div className="flex items-center gap-2 mb-1">
                                <span>{getFlagIcon(flag.type)}</span>
                                <span className="text-sm font-medium text-orange-300">
                                  {flag.type}
                                </span>
                                <Badge className="text-xs bg-orange-500/20 text-orange-300">
                                  {flag.count} flag{flag.count !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              {flag.details && (
                                <p className="text-xs text-white/60">{flag.details}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-white/50">
                      <p>Enviado em: {formatDate(selectedItem.submittedAt)}</p>
                      {selectedItem.moderatedAt && (
                        <p>Moderado em: {formatDate(selectedItem.moderatedAt)} por {selectedItem.moderatedBy}</p>
                      )}
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  {selectedItem.status === 'pending' || selectedItem.status === 'flagged' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white/80 mb-2 block">
                          Notas da Moderação (opcional):
                        </label>
                        <Textarea
                          value={moderationNotes}
                          onChange={(e) => setModerationNotes(e.target.value)}
                          className="glass-input min-h-[80px]"
                          placeholder="Adicione notas sobre sua decisão..."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleModeration(selectedItem.id, 'approved')}
                          className="flex-1 glass-button bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          onClick={() => handleModeration(selectedItem.id, 'rejected')}
                          className="flex-1 glass-button bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-white/5 text-center">
                      <p className="text-sm text-white/60">
                        Este item já foi moderado
                      </p>
                    </div>
                  )}
                </GlassCard>
              ) : (
                <GlassCard className="p-8 text-center">
                  <Shield className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white/80 mb-2">
                    Selecioneo um item
                  </h3>
                  <p className="text-white/60">
                    Clique em um item da lista para ver os detalhes e moderar o conteúdo.
                  </p>
                </GlassCard>
              )}
            </div>
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <Shield className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-white/60 max-w-md mx-auto">
              Ajuste os filtros para encontrar os itens que precisa moderar.
            </p>
          </GlassCard>
        )}
      </section>
    </div>
  );
}