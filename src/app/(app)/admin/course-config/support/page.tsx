'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useConfiguration } from '@/contexts/configuration-context';
import { ConfigurationSection } from '@/components/admin/configuration/ConfigurationSection';
import { Save, MessageSquare, HelpCircle, MessageCircle, Users, FileQuestion } from 'lucide-react';
import { SupportConfiguration as SupportConfigType } from '@/types/course-admin';
import { toast } from 'sonner';

export default function SupportConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [supportConfig, setSupportConfig] = useState<SupportConfigType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.configuration?.support) {
      setSupportConfig(state.configuration.support);
    }
  }, [state.configuration]);

  const handleCommentsChange = (field: string, value: unknown) => {
    if (!supportConfig) return;
    
    const updatedConfig = {
      ...supportConfig,
      comments: {
        ...supportConfig.comments,
        [field]: value,
      },
    };
    setSupportConfig(updatedConfig);
  };

  const handleQuestionsChange = (field: string, value: unknown) => {
    if (!supportConfig) return;
    
    const updatedConfig = {
      ...supportConfig,
      questions: {
        ...supportConfig.questions,
        [field]: value,
      },
    };
    setSupportConfig(updatedConfig);
  };

  const handleSupportChange = (value: boolean) => {
    if (!supportConfig) return;
    
    const updatedConfig = {
      ...supportConfig,
      support: {
        enabled: value,
      },
    };
    setSupportConfig(updatedConfig);
  };

  const handleFaqChange = (value: boolean) => {
    if (!supportConfig) return;
    
    const updatedConfig = {
      ...supportConfig,
      faq: {
        enabled: value,
      },
    };
    setSupportConfig(updatedConfig);
  };

  const handleUserDisplayChange = (value: string) => {
    if (!supportConfig) return;
    
    const updatedConfig = {
      ...supportConfig,
      userDisplay: {
        format: value as 'firstName' | 'fullName',
      },
    };
    setSupportConfig(updatedConfig);
  };

  const handleSave = async () => {
    if (!supportConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('support', supportConfig, 'Atualização das configurações de suporte');
      await saveConfiguration();
      toast.success('Configurações de suporte salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de suporte');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!supportConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Configuração de Recursos de Suporte
          </CardTitle>
          <CardDescription>
            Configure comentários, perguntas, FAQ e sistema de suporte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConfigurationSection
            title="Sistema de Comentários"
            description="Configure o sistema de comentários da plataforma"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Habilitar Comentários</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que alunos deixem comentários nos conteúdos
                  </p>
                </div>
                <Switch
                  checked={supportConfig.comments.enabled}
                  onCheckedChange={(checked) => handleCommentsChange('enabled', checked)}
                />
              </div>

              {supportConfig.comments.enabled && (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Moderação de Comentários</Label>
                      <p className="text-sm text-muted-foreground">
                        Comentários precisam de aprovação antes de serem publicados
                      </p>
                    </div>
                    <Switch
                      checked={supportConfig.comments.moderation}
                      onCheckedChange={(checked) => handleCommentsChange('moderation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Mostrar Tags de Admin</Label>
                      <p className="text-sm text-muted-foreground">
                        Exibe tags especiais para comentários de administradores
                      </p>
                    </div>
                    <Switch
                      checked={supportConfig.comments.showTags}
                      onCheckedChange={(checked) => handleCommentsChange('showTags', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments-title">Título da Seção de Comentários</Label>
                    <Input
                      id="comments-title"
                      value={supportConfig.comments.title}
                      onChange={(e) => handleCommentsChange('title', e.target.value)}
                      placeholder="Ex: Comentários e Discussões"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments-placeholder">Placeholder do Comentário</Label>
                    <Input
                      id="comments-placeholder"
                      value={supportConfig.comments.placeholder}
                      onChange={(e) => handleCommentsChange('placeholder', e.target.value)}
                      placeholder="Ex: Compartilhe sua experiência ou tire suas dúvidas..."
                    />
                  </div>
                </>
              )}
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Sistema de Perguntas"
            description="Configure o sistema de perguntas e respostas"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Habilitar Perguntas</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que alunos façam perguntas sobre o conteúdo
                  </p>
                </div>
                <Switch
                  checked={supportConfig.questions.enabled}
                  onCheckedChange={(checked) => handleQuestionsChange('enabled', checked)}
                />
              </div>

              {supportConfig.questions.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="questions-title">Título da Seção de Perguntas</Label>
                    <Input
                      id="questions-title"
                      value={supportConfig.questions.title}
                      onChange={(e) => handleQuestionsChange('title', e.target.value)}
                      placeholder="Ex: Perguntas Frequentes"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questions-placeholder">Placeholder da Pergunta</Label>
                    <Input
                      id="questions-placeholder"
                      value={supportConfig.questions.placeholder}
                      onChange={(e) => handleQuestionsChange('placeholder', e.target.value)}
                      placeholder="Ex: Digite sua pergunta aqui..."
                    />
                  </div>
                </>
              )}
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Sistema de Suporte"
            description="Configure a integração com o sistema de suporte"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Habilitar Sistema de Suporte</Label>
                  <p className="text-sm text-muted-foreground">
                    Integra com a infraestrutura de suporte existente
                  </p>
                </div>
                <Switch
                  checked={supportConfig.support.enabled}
                  onCheckedChange={handleSupportChange}
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="FAQ (Perguntas Frequentes)"
            description="Configure o sistema de FAQ"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Habilitar FAQ</Label>
                  <p className="text-sm text-muted-foreground">
                    Fornece uma base de conhecimento pesquisável
                  </p>
                </div>
                <Switch
                  checked={supportConfig.faq.enabled}
                  onCheckedChange={handleFaqChange}
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Exibição de Usuários"
            description="Configure como os nomes dos usuários são exibidos"
          >
            <div className="space-y-2">
              <Label>Formato de Exibição</Label>
              <RadioGroup
                value={supportConfig.userDisplay.format}
                onValueChange={handleUserDisplayChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="firstName" id="firstName" />
                  <Label htmlFor="firstName">
                    Primeiro Nome
                    <span className="text-sm text-muted-foreground ml-2">(Ex: João)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fullName" id="fullName" />
                  <Label htmlFor="fullName">
                    Nome Completo
                    <span className="text-sm text-muted-foreground ml-2">(Ex: João Silva)</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </ConfigurationSection>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}