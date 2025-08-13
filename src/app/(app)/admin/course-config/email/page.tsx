'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfiguration } from '@/contexts/configuration-context';
import { ColorPicker } from '@/components/admin/configuration/ColorPicker';
import { ImageUploader } from '@/components/admin/configuration/ImageUploader';
import { ConfigurationSection } from '@/components/admin/configuration/ConfigurationSection';
import { Badge } from '@/components/ui/badge';
import { Save, Mail, Palette, Settings, FileText, Send } from 'lucide-react';
import { EmailConfiguration as EmailConfigType, EmailTemplate } from '@/types/course-admin';
import { toast } from 'sonner';

const emailTemplates = [
  { id: 'welcomeSales', label: 'Email de Boas-Vindas (Vendas)', description: 'Enviado após compra do curso' },
  { id: 'welcomeMigration', label: 'Email de Boas-Vindas (Migração)', description: 'Enviado para usuários migrados' },
  { id: 'welcomeFree', label: 'Email de Boas-Vindas (Gratuito)', description: 'Enviado para cadastros gratuitos' },
  { id: 'newAccess', label: 'Email de Novo Acesso', description: 'Enviado quando novo acesso é liberado' },
];

export default function EmailConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [emailConfig, setEmailConfig] = useState<EmailConfigType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.configuration?.email) {
      setEmailConfig(state.configuration.email);
    }
  }, [state.configuration]);

  const handleThemeChange = (field: keyof EmailConfigType['theme'], value: string) => {
    if (!emailConfig) return;
    
    const updatedConfig = {
      ...emailConfig,
      theme: {
        ...emailConfig.theme,
        [field]: value,
      },
    };
    setEmailConfig(updatedConfig);
  };

  const handleSenderChange = (field: keyof EmailConfigType['sender'], value: string) => {
    if (!emailConfig) return;
    
    const updatedConfig = {
      ...emailConfig,
      sender: {
        ...emailConfig.sender,
        [field]: value,
      },
    };
    setEmailConfig(updatedConfig);
  };

  const handleTemplateChange = (
    templateId: keyof EmailConfigType['templates'],
    field: keyof EmailTemplate,
    value: unknown) => {
    if (!emailConfig) return;
    
    const updatedConfig = {
      ...emailConfig,
      templates: {
        ...emailConfig.templates,
        [templateId]: {
          ...emailConfig.templates[templateId],
          [field]: value,
        },
      },
    };
    setEmailConfig(updatedConfig);
  };

  const handleSettingsChange = (field: keyof EmailConfigType['settings'], value: boolean) => {
    if (!emailConfig) return;
    
    const updatedConfig = {
      ...emailConfig,
      settings: {
        ...emailConfig.settings,
        [field]: value,
      },
    };
    setEmailConfig(updatedConfig);
  };

  const handleLogoUpload = (file: File | null) => {
    if (!emailConfig) return;
    
    const updatedConfig = {
      ...emailConfig,
      branding: {
        ...emailConfig.branding,
        logo: {
          ...emailConfig.branding.logo,
          file,
        },
      },
    };
    setEmailConfig(updatedConfig);
  };

  const handleSave = async () => {
    if (!emailConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('email', emailConfig, 'Atualização das configurações de email');
      await saveConfiguration();
      toast.success('Configurações de email salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de email');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!emailConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configuração de Email
          </CardTitle>
          <CardDescription>
            Configure templates de email, branding e configurações de envio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theme" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="theme">
                <Palette className="h-4 w-4 mr-2" />
                Tema
              </TabsTrigger>
              <TabsTrigger value="branding">
                <FileText className="h-4 w-4 mr-2" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="sender">
                <Send className="h-4 w-4 mr-2" />
                Remetente
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Mail className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme">
              <ConfigurationSection
                title="Cores do Tema de Email"
                description="Personalize as cores dos seus emails"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Cor de Fundo</Label>
                    <ColorPicker
                      color={emailConfig.theme.backgroundColor}
                      onChange={(color) => handleThemeChange('backgroundColor', color)}
                      label="Cor de fundo do email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor do Corpo</Label>
                    <ColorPicker
                      color={emailConfig.theme.bodyColor}
                      onChange={(color) => handleThemeChange('bodyColor', color)}
                      label="Cor do corpo do email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor do Texto</Label>
                    <ColorPicker
                      color={emailConfig.theme.textColor}
                      onChange={(color) => handleThemeChange('textColor', color)}
                      label="Cor do texto principal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor do Texto do Rodapé</Label>
                    <ColorPicker
                      color={emailConfig.theme.footerTextColor}
                      onChange={(color) => handleThemeChange('footerTextColor', color)}
                      label="Cor do texto do rodapé"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor dos Links</Label>
                    <ColorPicker
                      color={emailConfig.theme.linkColor}
                      onChange={(color) => handleThemeChange('linkColor', color)}
                      label="Cor dos links"
                    />
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="branding">
              <ConfigurationSection
                title="Logo do Email"
                description="Configure o logo que aparecerá nos emails"
              >
                <div className="space-y-4">
                  <ImageUploader
                    label="Logo do Email"
                    accept="image/jpeg,image/png"
                    maxSize={204800} // 200KB
                    onUpload={handleLogoUpload}
                    currentImageUrl={emailConfig.branding.logo.url}
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="logo-height">Altura do Logo (px)</Label>
                      <Input
                        id="logo-height"
                        type="number"
                        value={emailConfig.branding.logo.height}
                        onChange={(e) => {
                          const updatedConfig = {
                            ...emailConfig,
                            branding: {
                              ...emailConfig.branding,
                              logo: {
                                ...emailConfig.branding.logo,
                                height: parseInt(e.target.value) || 60,
                              },
                            },
                          };
                          setEmailConfig(updatedConfig);
                        }}
                        min={30}
                        max={150}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground mt-6">
                      Recomendado: 60px
                    </div>
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="sender">
              <ConfigurationSection
                title="Informações do Remetente"
                description="Configure o nome e email de resposta"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Nome do Remetente</Label>
                    <Input
                      id="sender-name"
                      value={emailConfig.sender.name}
                      onChange={(e) => handleSenderChange('name', e.target.value)}
                      placeholder="Ex: Mentoria Médica"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reply-to">Email de Resposta</Label>
                    <Input
                      id="reply-to"
                      type="email"
                      value={emailConfig.sender.replyTo}
                      onChange={(e) => handleSenderChange('replyTo', e.target.value)}
                      placeholder="Ex: noreply@exemplo.com"
                    />
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="templates">
              <ConfigurationSection
                title="Templates de Email"
                description="Configure os templates para diferentes tipos de email"
              >
                <div className="space-y-6">
                  {emailTemplates.map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{template.label}</h4>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={emailConfig.templates[template.id as keyof EmailConfigType['templates']].enabled}
                                onCheckedChange={(checked) =>
                                  handleTemplateChange(template.id as keyof EmailConfigType['templates'], 'enabled', checked)
                                }
                              />
                              <Label>Ativo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={emailConfig.templates[template.id as keyof EmailConfigType['templates']].autoAccess}
                                onCheckedChange={(checked) =>
                                  handleTemplateChange(template.id as keyof EmailConfigType['templates'], 'autoAccess', checked)
                                }
                              />
                              <Label>Acesso Automático</Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Assunto do Email</Label>
                          <Input
                            value={emailConfig.templates[template.id as keyof EmailConfigType['templates']].subject || ''}
                            onChange={(e) =>
                              handleTemplateChange(template.id as keyof EmailConfigType['templates'], 'subject', e.target.value)
                            }
                            placeholder="Digite o assunto do email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Conteúdo Personalizado</Label>
                          <Textarea
                            value={emailConfig.templates[template.id as keyof EmailConfigType['templates']].customContent}
                            onChange={(e) =>
                              handleTemplateChange(template.id as keyof EmailConfigType['templates'], 'customContent', e.target.value)
                            }
                            placeholder="Digite o conteúdo personalizado do email"
                            rows={4}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="settings">
              <ConfigurationSection
                title="Configurações Gerais"
                description="Configure as opções gerais de envio de email"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Habilitar Envio de Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Ativa ou desativa o envio de emails da plataforma
                      </p>
                    </div>
                    <Switch
                      checked={emailConfig.settings.enableEmailSending}
                      onCheckedChange={(checked) => handleSettingsChange('enableEmailSending', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Acesso Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Libera acesso automaticamente após criação do usuário
                      </p>
                    </div>
                    <Switch
                      checked={emailConfig.settings.enableAutoAccess}
                      onCheckedChange={(checked) => handleSettingsChange('enableAutoAccess', checked)}
                    />
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
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