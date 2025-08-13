'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Ban, 
  UserCheck, 
  UserX, 
  Crown,
  Shield,
  ArrowLeft
} from 'lucide-react';
// FASE 3: Importando componentes padronizados de UX
import { PageLoader } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonList } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user' | 'premium';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  avatar?: string;
  specialty?: string;
  createdAt: string;
  lastLoginAt?: string;
  subscription?: {
    type: 'free' | 'premium' | 'enterprise';
  };
  stats: {
    casesSubmitted: number;
    commentsPosted: number;
    reputationScore: number;
  };
}
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';

type FilterStatus = 'all' | 'active' | 'inactive' | 'banned' | 'pending';
type FilterRole = 'all' | 'admin' | 'moderator' | 'user' | 'premium';

export default function UsersManagement() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all');

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      
      // Transform data to match expected structure
      const transformedUsers = data.map((user: any) => ({
        ...user,
        status: user.isActive ? 'active' : 'inactive',
        subscription: user.subscription || { type: 'free' },
        stats: user.stats || {
          casesSubmitted: 0,
          commentsPosted: 0,
          reputationScore: 0
        }
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white/80 mb-2">Acesso Negado</h2>
          <p className="text-white/60 mb-4">
            Você não tem permissão para gerenciar usuários.
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

  // Filter users
  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.specialty?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;

    // Role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;

    return true;
  });

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      const isActive = newStatus === 'active';
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update user status');
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      case 'banned': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'moderator': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'premium': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'user': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3" />;
      case 'moderator': return <Shield className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho do gerenciamento de usuários">
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white/90">Gerenciamento de Usuários</h1>
              <p className="text-white/60">
                {filteredUsers.length} de {users.length} usuários
              </p>
            </div>
          </div>
        </div>

        {/* FASE 3: Statistics responsivas para mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {users.length}
            </div>
            <div className="text-sm text-white/60">Total</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-white/60">Ativos</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <div className="text-sm text-white/60">Pendentes</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {users.filter(u => u.subscription?.type === 'premium' || u.subscription?.type === 'enterprise').length}
            </div>
            <div className="text-sm text-white/60">Premium</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {users.filter(u => u.status === 'banned').length}
            </div>
            <div className="text-sm text-white/60">Banidos</div>
          </GlassCard>
        </div>

        {/* FASE 3: Filters responsivos para mobile */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Buscar usuários por nome, email ou especialidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10"
              />
            </div>
            
            {/* FASE 3: Filters responsivos */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
                <SelectTrigger className="w-full sm:w-[140px] glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="banned">Banido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as FilterRole)}>
                <SelectTrigger className="w-full sm:w-[140px] glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-pane">
                  <SelectItem value="all">Todas Funções</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderador</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* FASE 3: Loading State melhorado com componente padronizado */}
      {loading && (
        <PageLoader message="Carregando usuários..." />
      )}

      {/* Users List */}
      {!loading && (
      <section aria-label="Lista de usuários">
        {filteredUsers.length > 0 ? (
          <GlassCard className="p-0 overflow-hidden">
            <div className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6">
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-cyan-400" />
                          </div>
                        )}
                        {getRoleIcon(user.role) && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white/90">{user.name}</h3>
                          <Badge className={`text-xs px-2 py-1 ${getStatusColor(user.status)}`}>
                            {user.status}
                          </Badge>
                          <Badge className={`text-xs px-2 py-1 ${getRoleColor(user.role)}`}>
                            {user.role}
                          </Badge>
                          {user.subscription?.type && user.subscription.type !== 'free' && (
                            <Badge className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300">
                              {user.subscription.type}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>{user.email}</span>
                          {user.specialty && <span>{user.specialty}</span>}
                          <span>Desde {formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/50 mt-1">
                          <span>{user.stats.casesSubmitted} casos</span>
                          <span>{user.stats.commentsPosted} comentários</span>
                          <span>{user.stats.reputationScore} pontos</span>
                          {user.lastLoginAt && (
                            <span>Último login: {formatDate(user.lastLoginAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-pane">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Usuário
                        </DropdownMenuItem>
                        
                        {user.status === 'active' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'inactive')}
                            className="cursor-pointer text-yellow-400 hover:text-yellow-300"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Desativar
                          </DropdownMenuItem>
                        )}
                        
                        {user.status === 'inactive' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="cursor-pointer text-green-400 hover:text-green-300"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        
                        {user.status === 'pending' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="cursor-pointer text-green-400 hover:text-green-300"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Aprovar
                          </DropdownMenuItem>
                        )}
                        
                        {user.status !== 'banned' && user.role !== 'admin' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'banned')}
                            className="cursor-pointer text-red-400 hover:text-red-300"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Banir
                          </DropdownMenuItem>
                        )}
                        
                        {user.status === 'banned' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="cursor-pointer text-green-400 hover:text-green-300"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Remover Ban
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          /* FASE 3: Empty State melhorado com componente padronizado */
          <EmptyState
            icon={Users}
            title="Nenhum usuário encontrado"
            description={
              searchQuery || statusFilter !== 'all' || roleFilter !== 'all' ?
                'Ajuste os filtros para encontrar os usuários que procura.' :
                'Ainda não há usuários cadastrados no sistema.'
            }
            action={searchQuery || statusFilter !== 'all' || roleFilter !== 'all' ? {
              label: 'Limpar filtros',
              onClick: () => {
                setSearchQuery('');
                setStatusFilter('all');
                setRoleFilter('all');
              }
            } : undefined}
          />
        )}
      </section>
      )}
    </div>
  );
}