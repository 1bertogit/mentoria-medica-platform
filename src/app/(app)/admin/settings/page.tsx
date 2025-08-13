'use client';

import { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Shield, 
  Bell, 
  Database, 
  Palette, 
  Globe, 
  Lock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Info,
  Users
} from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPlatformSettings, getSettingsByCategory, type PlatformSettings } from '@/lib/mock-data/admin';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function PlatformSettings() {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings[]>(mockPlatformSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <Settings className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white/80 mb-2">Acesso Negado</h2>
          <p className="text-white/60 mb-4">
            Você não tem permissão para acessar as configurações.
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

  const updateSetting = (id: string, value: unknown) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id 
        ? { 
            ...setting, 
            value, 
            lastModified: new Date().toISOString(),
            modifiedBy: 'Dr. Ana Silva'
          }
        : setting
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setHasChanges(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleReset = () => {
    setSettings(mockPlatformSettings);
    setHasChanges(false);
    setSaveStatus('idle');
  };

  const getSetting = (name: string) => {
    return settings.find(s => s.name === name);
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

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />;
      case 'saved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho das configurações">
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500/20 to-slate-500/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white/90">Configurações da Plataforma</h1>
              <p className="text-white/60">
                Gerencie as configurações gerais do sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="glass-button"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Descartar
              </Button>
            )}
            
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving'}
              className="glass-button"
            >
              {getStatusIcon()}
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>

        {/* Status Message */}
        {saveStatus === 'saved' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border-l-4 border-green-400">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-300 font-medium">Configurações salvas com sucesso!</p>
                <p className="text-green-300/80 text-sm">As alterações foram aplicadas à plataforma.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Settings Tabs */}
      <section aria-label="Configurações da plataforma">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="glass-tabs">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Moderação
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-6">Configurações Gerais</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Nome da Plataforma
                  </label>
                  <Input
                    value={String(getSetting('platform_name')?.value || '')}
                    onChange={(e) => updateSetting('set-1', e.target.value)}
                    className="glass-input"
                    placeholder="Nome da plataforma"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Última modificação: {getSetting('platform_name') && formatDate(getSetting('platform_name')!.lastModified)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Descrição da Plataforma
                  </label>
                  <Textarea
                    value="Plataforma de educação médica continuada para cirurgiões plásticos"
                    onChange={(e) => updateSetting('platform_description', e.target.value)}
                    className="glass-input min-h-[80px]"
                    placeholder="Descreva a plataforma..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Idioma Padrão
                  </label>
                  <Select value="pt-BR" onValueChange={(value) => updateSetting('default_language', value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-pane">
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Fuso Horário
                  </label>
                  <Select value="America/Sao_Paulo" onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-pane">
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Modo de Manutenção
                    </label>
                    <p className="text-xs text-white/60">
                      Desabilita o acesso à plataforma para usuários não-admin
                    </p>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-6">Configurações de Segurança</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Máximo de Tentativas de Login
                  </label>
                  <Input
                    type="number"
                    value={Number(getSetting('max_login_attempts')?.value || 5)}
                    onChange={(e) => updateSetting('set-2', parseInt(e.target.value))}
                    className="glass-input"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Número máximo de tentativas antes de bloquear a conta
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Tempo de Bloqueio (minutos)
                  </label>
                  <Input
                    type="number"
                    value={30}
                    onChange={(e) => updateSetting('lockout_duration', parseInt(e.target.value))}
                    className="glass-input"
                    min="5"
                    max="1440"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Duração da Sessão (horas)
                  </label>
                  <Input
                    type="number"
                    value={24}
                    onChange={(e) => updateSetting('session_duration', parseInt(e.target.value))}
                    className="glass-input"
                    min="1"
                    max="720"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Autenticação de Dois Fatores Obrigatória
                    </label>
                    <p className="text-xs text-white/60">
                      Força todos os usuários a configurar 2FA
                    </p>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={(checked) => updateSetting('force_2fa', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Log de Atividades Detalhado
                    </label>
                    <p className="text-xs text-white/60">
                      Registra todas as ações dos usuários
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('detailed_logging', checked)}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Moderation Settings */}
          <TabsContent value="moderation" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-6">Configurações de Moderação</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Aprovação Automática para Usuários Confiáveis
                    </label>
                    <p className="text-xs text-white/60">
                      Usuários com alta reputação têm conteúdo aprovado automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(getSetting('auto_approve_trusted_users')?.value || false)}
                    onCheckedChange={(checked) => updateSetting('set-3', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Pontuação Mínima para Auto-Aprovação
                  </label>
                  <Input
                    type="number"
                    value={1000}
                    onChange={(e) => updateSetting('auto_approve_score', parseInt(e.target.value))}
                    className="glass-input"
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Máximo de Flags para Auto-Rejeição
                  </label>
                  <Input
                    type="number"
                    value={5}
                    onChange={(e) => updateSetting('max_flags_auto_reject', parseInt(e.target.value))}
                    className="glass-input"
                    min="1"
                    max="20"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Filtro de Palavras Automático
                    </label>
                    <p className="text-xs text-white/60">
                      Detecta e sinaliza conteúdo inadequado automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('auto_word_filter', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Notificar Moderadores por Email
                    </label>
                    <p className="text-xs text-white/60">
                      Envia email quando há conteúdo pendente de moderação
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('notify_moderators', checked)}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-6">Configurações de Notificações</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Notificações Push Habilitadas
                    </label>
                    <p className="text-xs text-white/60">
                      Permite o envio de notificações push para dispositivos
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Notificações por Email
                    </label>
                    <p className="text-xs text-white/60">
                      Envia notificações importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Frequência de Digest de Email
                  </label>
                  <Select value="weekly" onValueChange={(value) => updateSetting('email_digest_frequency', value)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-pane">
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Horário de Silêncio (início)
                  </label>
                  <Input
                    type="time"
                    value="22:00"
                    onChange={(e) => updateSetting('quiet_hours_start', e.target.value)}
                    className="glass-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Horário de Silêncio (fim)
                  </label>
                  <Input
                    type="time"
                    value="07:00"
                    onChange={(e) => updateSetting('quiet_hours_end', e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-6">Configurações de Conteúdo</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Máximo de Imagens por Caso Clínico
                  </label>
                  <Input
                    type="number"
                    value={Number(getSetting('max_case_images')?.value || 10)}
                    onChange={(e) => updateSetting('set-4', parseInt(e.target.value))}
                    className="glass-input"
                    min="1"
                    max="50"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Última modificação: {getSetting('max_case_images') && formatDate(getSetting('max_case_images')!.lastModified)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Tamanho Máximo de Arquivo (MB)
                  </label>
                  <Input
                    type="number"
                    value={10}
                    onChange={(e) => updateSetting('max_file_size', parseInt(e.target.value))}
                    className="glass-input"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Formatos de Imagem Permitidos
                  </label>
                  <Input
                    value="jpg, jpeg, png, webp"
                    onChange={(e) => updateSetting('allowed_image_formats', e.target.value)}
                    className="glass-input"
                    placeholder="jpg, png, gif..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Duração de Retenção de Dados (dias)
                  </label>
                  <Input
                    type="number"
                    value={2555} // ~7 anos
                    onChange={(e) => updateSetting('data_retention_days', parseInt(e.target.value))}
                    className="glass-input"
                    min="30"
                    max="3650"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Backup Automático Habilitado
                    </label>
                    <p className="text-xs text-white/60">
                      Realiza backup automático do conteúdo da plataforma
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('auto_backup', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/80">
                      Compressão de Imagens
                    </label>
                    <p className="text-xs text-white/60">
                      Comprime automaticamente imagens para otimizar performance
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={(checked) => updateSetting('image_compression', checked)}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </section>

      {/* Settings History */}
      <section aria-label="Histórico de configurações">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4">Histórico de Alterações</h3>
          
          <div className="space-y-3">
            {settings.slice(0, 5).map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <h4 className="font-medium text-white/90">{setting.description}</h4>
                  <p className="text-sm text-white/60">
                    Valor atual: <span className="text-cyan-400">{typeof setting.value === 'boolean' ? (setting.value ? 'Habilitado' : 'Desabilitado') : String(setting.value)}</span>
                  </p>
                </div>
                <div className="text-right text-sm text-white/50">
                  <p>{formatDate(setting.lastModified)}</p>
                  <p>por {setting.modifiedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}