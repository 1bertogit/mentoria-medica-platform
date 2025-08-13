'use client';

import { useState } from 'react';
import { Settings, Mail, Smartphone, Monitor, Save, ArrowLeft, Bell, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/use-notifications';
import type { NotificationSettings } from '@/lib/mock-data/notifications';
import Link from 'next/link';

export default function NotificationSettingsPage() {
  const { settings, updateSettings, resetSettings } = useNotifications();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (
    category: keyof NotificationSettings,
    setting: string,
    value: boolean
  ) => {
    if (category === 'userId') return;
    
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof Omit<NotificationSettings, 'userId'>],
        [setting]: value
      }
    };
    
    updateSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSettings();
    setHasChanges(true);
  };

  const settingsGroups = [
    {
      id: 'emailNotifications',
      title: 'Notificações por E-mail',
      icon: Mail,
      description: 'Receba notificações em seu e-mail',
      settings: [
        { key: 'comments', label: 'Novos comentários', description: 'Quando alguém comenta em seus casos ou artigos' },
        { key: 'replies', label: 'Respostas', description: 'Quando alguém responde seus comentários' },
        { key: 'likes', label: 'Curtidas', description: 'Quando seus comentários recebem curtidas' },
        { key: 'follows', label: 'Novos seguidores', description: 'Quando alguém começar a seguir você' },
        { key: 'courseUpdates', label: 'Atualizações de cursos', description: 'Novos módulos e conteúdos em cursos inscritos' },
        { key: 'systemUpdates', label: 'Atualizações do sistema', description: 'Importantes atualizações da plataforma' },
        { key: 'weeklyDigest', label: 'Resumo semanal', description: 'Relatório semanal de atividades' }
      ]
    },
    {
      id: 'pushNotifications',
      title: 'Notificações Push',
      icon: Smartphone,
      description: 'Notificações instantâneas no dispositivo',
      settings: [
        { key: 'comments', label: 'Novos comentários', description: 'Notificação imediata para novos comentários' },
        { key: 'replies', label: 'Respostas', description: 'Notificação imediata para respostas' },
        { key: 'likes', label: 'Curtidas', description: 'Notificação para curtidas recebidas' },
        { key: 'follows', label: 'Novos seguidores', description: 'Notificação para novos seguidores' },
        { key: 'courseUpdates', label: 'Atualizações de cursos', description: 'Novos conteúdos disponíveis' },
        { key: 'systemUpdates', label: 'Atualizações do sistema', description: 'Atualizações importantes' },
        { key: 'urgent', label: 'Notificações urgentes', description: 'Apenas notificações de alta prioridade' }
      ]
    },
    {
      id: 'inAppNotifications',
      title: 'Notificações na Plataforma',
      icon: Monitor,
      description: 'Notificações dentro da plataforma web',
      settings: [
        { key: 'comments', label: 'Novos comentários', description: 'Mostrar no centro de notificações' },
        { key: 'replies', label: 'Respostas', description: 'Mostrar no centro de notificações' },
        { key: 'likes', label: 'Curtidas', description: 'Mostrar no centro de notificações' },
        { key: 'follows', label: 'Novos seguidores', description: 'Mostrar no centro de notificações' },
        { key: 'courseUpdates', label: 'Atualizações de cursos', description: 'Mostrar no centro de notificações' },
        { key: 'systemUpdates', label: 'Atualizações do sistema', description: 'Mostrar no centro de notificações' },
        { key: 'achievements', label: 'Conquistas', description: 'Mostrar badges e conquistas desbloqueadas' }
      ]
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <section aria-label="Cabeçalho das configurações">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/notifications">
            <Button variant="ghost" className="glass-button hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 dark:text-white/90">Configurações de Notificação</h1>
              <p className="text-gray-600 dark:text-white/60">
                Personalize como e quando você recebe notificações
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="glass-button"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            
            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="glass-button bg-green-500/20 text-green-300 hover:bg-green-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>

        {/* Status */}
        {hasChanges && (
          <GlassCard className="p-4 mb-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white/90">Alterações não salvas</h3>
                <p className="text-sm text-gray-600 dark:text-white/60">
                  Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicá-las.
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </section>

      {/* Settings Groups */}
      <section aria-label="Grupos de configurações">
        <div className="space-y-6">
          {settingsGroups.map((group) => {
            const Icon = group.icon;
            const groupSettings = settings[group.id as keyof NotificationSettings] as Record<string, boolean>;
            
            return (
              <GlassCard key={group.id} className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">{group.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-white/60">{group.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {group.settings.map((setting) => (
                    <div key={setting.key} className="flex items-start justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white/90">{setting.label}</h3>
                          {groupSettings?.[setting.key] && (
                            <Badge className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300">
                              Ativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-white/60">{setting.description}</p>
                      </div>
                      
                      <Switch
                        checked={groupSettings?.[setting.key] || false}
                        onCheckedChange={(checked) => handleSettingChange(group.id as keyof NotificationSettings, setting.key, checked)}
                        className="ml-4"
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Additional Info */}
      <section aria-label="Informações adicionais">
        <GlassCard className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white/90 mb-4">Informações Importantes</h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-white/70">
            <p>
              • <strong>Notificações Urgentes:</strong> Sempre serão enviadas independentemente das configurações para garantir a segurança da conta.
            </p>
            <p>
              • <strong>Frequência:</strong> Algumas notificações podem ser agrupadas para evitar spam.
            </p>
            <p>
              • <strong>Privacidade:</strong> Suas configurações são privadas e não são compartilhadas com outros usuários.
            </p>
            <p>
              • <strong>Sincronização:</strong> As alterações podem levar alguns minutos para entrar em vigor.
            </p>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}