'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toastHelpers } from '@/hooks/use-toast';
import {
  BookOpen,
  Award,
  Calendar,
  Heart,
  Star,
  TrendingUp,
  Edit2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Key,
  Lock,
  Eye,
  EyeOff,
  X,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock user data
const userData = {
  name: 'Dr. João Silva',
  email: 'joao.silva@example.com',
  phone: '+55 11 99999-9999',
  location: 'São Paulo, SP',
  role: 'Cardiologista',
  hospital: 'Hospital Albert Einstein',
  education: 'USP - Faculdade de Medicina',
  memberSince: '2021',
  avatar: '/images/doctors/doctor1.jpg',
  coverImage: '/images/medical-bg.jpg',
  stats: {
    coursesCompleted: 24,
    hoursStudied: 156,
    certificatesEarned: 8,
    articlesRead: 92,
  },
  badges: [
    { id: 1, name: 'Early Adopter', icon: Star, color: 'text-yellow-400' },
    { id: 2, name: 'Top Learner', icon: TrendingUp, color: 'text-green-400' },
    { id: 3, name: 'Expert', icon: Award, color: 'text-purple-400' },
  ],
  recentActivity: [
    {
      id: 1,
      type: 'course',
      title: 'Cardiologia Avançada',
      date: '2 dias atrás',
      progress: 85,
    },
    {
      id: 2,
      type: 'article',
      title: 'Novos Tratamentos para Hipertensão',
      date: '3 dias atrás',
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Certificado em Emergências Cardíacas',
      date: '1 semana atrás',
    },
  ],
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    // Validações
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toastHelpers.error('Campos obrigatórios', 'Preencha todos os campos');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toastHelpers.error('Senha muito curta', 'A nova senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toastHelpers.error('Senhas não coincidem', 'A nova senha e a confirmação devem ser iguais');
      return;
    }

    setIsChangingPassword(true);
    // Simular chamada à API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toastHelpers.success('Senha alterada', 'Sua senha foi alterada com sucesso');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Cover Section with Border Beam */}
      <div className="relative overflow-hidden rounded-2xl">
        <GlassCard className="relative overflow-hidden bg-black/90 p-0">
          {/* Cover Image */}
          <div className="relative h-48 w-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20">
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="relative -mt-16 sm:-mt-12">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-black bg-black">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    className="absolute bottom-2 right-2 rounded-full bg-black/80 p-2 backdrop-blur-sm transition-colors hover:bg-black/90"
                    onClick={() => router.push('/settings/profile')}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {userData.name}
                  </h1>
                  <p className="mt-1 text-lg text-white/60">{userData.role}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{userData.hospital}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{userData.education}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {userData.memberSince}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {userData.badges.map((badge) => (
                    <Badge
                      key={badge.id}
                      variant="outline"
                      className="border-white/20 bg-white/5 px-3 py-1"
                    >
                      <badge.icon
                        className={`mr-1 h-3 w-3 ${badge.color}`}
                      />
                      <span className="text-white/80">{badge.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => router.push('/settings/profile')}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Trocar Senha
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div>
          <GlassCard className="bg-black/80 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-white/5">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="activity">Atividade</TabsTrigger>
                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Informações de Contato
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-white/40" />
                      <span className="text-white/80">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-white/40" />
                      <span className="text-white/80">{userData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-white/40" />
                      <span className="text-white/80">
                        {userData.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Informações Profissionais
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-white/40" />
                      <span className="text-white/80">
                        {userData.hospital}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-4 w-4 text-white/40" />
                      <span className="text-white/80">
                        {userData.education}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Atividade Recente
                </h3>
                {userData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-white/10 p-2">
                        {activity.type === 'course' && (
                          <BookOpen className="h-5 w-5 text-cyan-400" />
                        )}
                        {activity.type === 'article' && (
                          <Heart className="h-5 w-5 text-red-400" />
                        )}
                        {activity.type === 'certificate' && (
                          <Award className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-white/60">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    {activity.progress && (
                      <div className="text-right">
                        <p className="text-sm text-white/60">Progresso</p>
                        <p className="text-lg font-semibold text-white">
                          {activity.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Suas Conquistas
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {userData.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-4 rounded-lg bg-white/5 p-4"
                    >
                      <div className="rounded-lg bg-white/10 p-3">
                        <badge.icon className={`h-8 w-8 ${badge.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{badge.name}</p>
                        <p className="text-sm text-white/60">
                          Conquistado em 2024
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
      </div>

      {/* Modal de Troca de Senha */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl"
          onClick={() => {
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          }}
        >
          <GlassCard 
            className="relative max-w-md w-full mx-4 bg-black/80 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-cyan-500/20 p-2">
                  <Key className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Alterar Senha
                  </h3>
                  <p className="text-xs text-white/60">
                    Atualize sua senha de acesso
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Senha Atual */}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white/80">
                  Senha Atual
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="current-password"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="bg-white/5 pl-10 pr-10 text-white placeholder:text-white/40 border-white/10 focus:border-cyan-500/50"
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white/80">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="new-password"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="bg-white/5 pl-10 pr-10 text-white placeholder:text-white/40 border-white/10 focus:border-cyan-500/50"
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-white/40">
                  Mínimo de 8 caracteres
                </p>
              </div>

              {/* Confirmar Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white/80">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="bg-white/5 pl-10 pr-10 text-white placeholder:text-white/40 border-white/10 focus:border-cyan-500/50"
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Dicas de Segurança */}
              <div className="rounded-lg bg-white/5 border border-white/10 p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-cyan-500/20 p-1.5 mt-0.5">
                    <Lock className="h-3 w-3 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/80 font-medium mb-2">Dicas de segurança</p>
                    <ul className="text-xs text-white/50 space-y-1">
                      <li className="flex items-start gap-1">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>Use pelo menos 8 caracteres</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>Combine letras, números e símbolos</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>Evite informações pessoais óbvias</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                disabled={isChangingPassword}
              >
                Cancelar
              </Button>
              <Button
                className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}