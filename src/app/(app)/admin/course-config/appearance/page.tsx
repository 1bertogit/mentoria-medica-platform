'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useConfiguration } from '@/contexts/configuration-context';
import { ColorPicker } from '@/components/admin/configuration/ColorPicker';
import { ImageUploader } from '@/components/admin/configuration/ImageUploader';
import { ConfigurationSection } from '@/components/admin/configuration/ConfigurationSection';
import { Save, Palette, Layout, Shield, Monitor, Smartphone } from 'lucide-react';
import { AppearanceConfiguration as AppearanceConfigType } from '@/types/course-admin';
import { toast } from 'sonner';

export default function AppearanceConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [appearanceConfig, setAppearanceConfig] = useState<AppearanceConfigType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.configuration?.appearance) {
      setAppearanceConfig(state.configuration.appearance);
    }
  }, [state.configuration]);

  const handleStudentAreaChange = (field: string, value: unknown) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      studentArea: {
        ...appearanceConfig.studentArea,
        [field]: value,
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handleFooterChange = (field: string, value: unknown) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      studentArea: {
        ...appearanceConfig.studentArea,
        footer: {
          ...appearanceConfig.studentArea.footer,
          [field]: value,
        },
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handleAuthenticationChange = (field: string, value: unknown) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      authentication: {
        ...appearanceConfig.authentication,
        [field]: value,
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handleAuthColorsChange = (field: string, value: string) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      authentication: {
        ...appearanceConfig.authentication,
        colors: {
          ...appearanceConfig.authentication.colors,
          [field]: value,
        },
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handleButtonStyleChange = (buttonType: 'primary' | 'secondary', field: string, value: string) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      authentication: {
        ...appearanceConfig.authentication,
        buttons: {
          ...appearanceConfig.authentication.buttons,
          [buttonType]: {
            ...appearanceConfig.authentication.buttons[buttonType],
            [field]: value,
          },
        },
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handleAdminAreaChange = (field: string, value: unknown) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      adminArea: {
        ...appearanceConfig.adminArea,
        [field]: value,
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handlePWAChange = (field: string, value: unknown) => {
    if (!appearanceConfig) return;
    
    const updatedConfig = {
      ...appearanceConfig,
      pwa: {
        ...appearanceConfig.pwa,
        [field]: value,
      },
    };
    setAppearanceConfig(updatedConfig);
  };

  const handleSave = async () => {
    if (!appearanceConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('appearance', appearanceConfig, 'Atualização das configurações de aparência');
      await saveConfiguration();
      toast.success('Configurações de aparência salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de aparência');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!appearanceConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Configuração de Aparência
          </CardTitle>
          <CardDescription>
            Personalize a aparência da área do aluno e área administrativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="student">
                <Monitor className="h-4 w-4 mr-2" />
                Área do Aluno
              </TabsTrigger>
              <TabsTrigger value="footer">
                <Layout className="h-4 w-4 mr-2" />
                Rodapé
              </TabsTrigger>
              <TabsTrigger value="auth">
                <Shield className="h-4 w-4 mr-2" />
                Autenticação
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Monitor className="h-4 w-4 mr-2" />
                Área Admin
              </TabsTrigger>
              <TabsTrigger value="pwa">
                <Smartphone className="h-4 w-4 mr-2" />
                PWA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <ConfigurationSection
                title="Área do Aluno"
                description="Configure a aparência da área do aluno"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Título da Página</Label>
                    <Input
                      id="page-title"
                      value={appearanceConfig.studentArea.pageTitle}
                      onChange={(e) => handleStudentAreaChange('pageTitle', e.target.value)}
                      placeholder="Ex: Mentoria Médica - Plataforma de Ensino"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cor de Destaque</Label>
                    <ColorPicker
                      color={appearanceConfig.studentArea.highlightColor}
                      onChange={(color) => handleStudentAreaChange('highlightColor', color)}
                      label="Cor de destaque da área do aluno"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Modo Escuro</Label>
                      <p className="text-sm text-muted-foreground">
                        Inverte as cores da área do usuário e painéis de login
                      </p>
                    </div>
                    <Switch
                      checked={appearanceConfig.studentArea.darkMode}
                      onCheckedChange={(checked) => handleStudentAreaChange('darkMode', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <RadioGroup
                      value={appearanceConfig.studentArea.theme}
                      onValueChange={(value) => handleStudentAreaChange('theme', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="educational" id="educational" />
                        <Label htmlFor="educational">Educacional</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="academic" id="academic" />
                        <Label htmlFor="academic">Acadêmico</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="footer">
              <ConfigurationSection
                title="Configurações do Rodapé"
                description="Configure o rodapé da plataforma"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Exibir Rodapé</Label>
                      <p className="text-sm text-muted-foreground">
                        Mostra ou oculta o rodapé da plataforma
                      </p>
                    </div>
                    <Switch
                      checked={appearanceConfig.studentArea.footer.visible}
                      onCheckedChange={(checked) => handleFooterChange('visible', checked)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <Label className="text-base">Mensagem</Label>
                        <Input
                          value={appearanceConfig.studentArea.footer.message}
                          onChange={(e) => handleFooterChange('message', e.target.value)}
                          placeholder="Mensagem do rodapé"
                          className="mt-2"
                        />
                      </div>
                      <Switch
                        checked={appearanceConfig.studentArea.footer.showMessage}
                        onCheckedChange={(checked) => handleFooterChange('showMessage', checked)}
                        className="ml-4"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <Label className="text-base">Disclaimer</Label>
                        <Input
                          value={appearanceConfig.studentArea.footer.disclaimer}
                          onChange={(e) => handleFooterChange('disclaimer', e.target.value)}
                          placeholder="Texto de disclaimer"
                          className="mt-2"
                        />
                      </div>
                      <Switch
                        checked={appearanceConfig.studentArea.footer.showDisclaimer}
                        onCheckedChange={(checked) => handleFooterChange('showDisclaimer', checked)}
                        className="ml-4"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <Label className="text-base">Termos de Uso</Label>
                        <Input
                          value={appearanceConfig.studentArea.footer.termsUrl}
                          onChange={(e) => handleFooterChange('termsUrl', e.target.value)}
                          placeholder="URL dos termos de uso"
                          className="mt-2"
                        />
                      </div>
                      <Switch
                        checked={appearanceConfig.studentArea.footer.showTerms}
                        onCheckedChange={(checked) => handleFooterChange('showTerms', checked)}
                        className="ml-4"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <Label className="text-base">Política de Privacidade</Label>
                        <Input
                          value={appearanceConfig.studentArea.footer.privacyUrl}
                          onChange={(e) => handleFooterChange('privacyUrl', e.target.value)}
                          placeholder="URL da política de privacidade"
                          className="mt-2"
                        />
                      </div>
                      <Switch
                        checked={appearanceConfig.studentArea.footer.showPrivacy}
                        onCheckedChange={(checked) => handleFooterChange('showPrivacy', checked)}
                        className="ml-4"
                      />
                    </div>
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="auth">
              <ConfigurationSection
                title="Telas de Autenticação"
                description="Configure a aparência das telas de login"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Posição do Formulário</Label>
                    <RadioGroup
                      value={appearanceConfig.authentication.formPosition}
                      onValueChange={(value) => handleAuthenticationChange('formPosition', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="left" />
                        <Label htmlFor="left">Esquerda</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="right" />
                        <Label htmlFor="right">Direita</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cor Primária</Label>
                      <ColorPicker
                        color={appearanceConfig.authentication.colors.primary}
                        onChange={(color) => handleAuthColorsChange('primary', color)}
                        label="Cor primária"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor Secundária</Label>
                      <ColorPicker
                        color={appearanceConfig.authentication.colors.secondary}
                        onChange={(color) => handleAuthColorsChange('secondary', color)}
                        label="Cor secundária"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor de Fundo</Label>
                      <ColorPicker
                        color={appearanceConfig.authentication.colors.background}
                        onChange={(color) => handleAuthColorsChange('background', color)}
                        label="Cor de fundo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor do Texto</Label>
                      <ColorPicker
                        color={appearanceConfig.authentication.colors.text}
                        onChange={(color) => handleAuthColorsChange('text', color)}
                        label="Cor do texto"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Imagem de Fundo</Label>
                    <ImageUploader
                      label="Imagem de fundo (JPEG, 1280x1024, até 800kb)"
                      accept="image/jpeg"
                      maxSize={819200} // 800KB
                      onUpload={(file) => handleAuthenticationChange('backgroundImage', { file })}
                      currentImageUrl={appearanceConfig.authentication.backgroundImage?.url}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Estilos dos Botões</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Botão Primário</h5>
                        <div className="space-y-3">
                          <ColorPicker
                            color={appearanceConfig.authentication.buttons.primary.backgroundColor}
                            onChange={(color) => handleButtonStyleChange('primary', 'backgroundColor', color)}
                            label="Cor de fundo"
                          />
                          <ColorPicker
                            color={appearanceConfig.authentication.buttons.primary.textColor}
                            onChange={(color) => handleButtonStyleChange('primary', 'textColor', color)}
                            label="Cor do texto"
                          />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h5 className="font-medium mb-3">Botão Secundário</h5>
                        <div className="space-y-3">
                          <ColorPicker
                            color={appearanceConfig.authentication.buttons.secondary.backgroundColor}
                            onChange={(color) => handleButtonStyleChange('secondary', 'backgroundColor', color)}
                            label="Cor de fundo"
                          />
                          <ColorPicker
                            color={appearanceConfig.authentication.buttons.secondary.textColor}
                            onChange={(color) => handleButtonStyleChange('secondary', 'textColor', color)}
                            label="Cor do texto"
                          />
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="admin">
              <ConfigurationSection
                title="Área Administrativa"
                description="Configure a aparência da área administrativa"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo da Área Admin</Label>
                    <ImageUploader
                      label="Logo da área administrativa"
                      accept="image/jpeg,image/png"
                      maxSize={102400} // 100KB
                      onUpload={(file) => handleAdminAreaChange('logo', { file })}
                      currentImageUrl={appearanceConfig.adminArea.logo?.url}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cor de Destaque</Label>
                    <ColorPicker
                      color={appearanceConfig.adminArea.highlightColor}
                      onChange={(color) => handleAdminAreaChange('highlightColor', color)}
                      label="Cor de destaque da área admin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Formato de Saudação</Label>
                    <RadioGroup
                      value={appearanceConfig.adminArea.greeting}
                      onValueChange={(value) => handleAdminAreaChange('greeting', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="firstName" id="firstName" />
                        <Label htmlFor="firstName">Primeiro Nome</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fullName" id="fullName" />
                        <Label htmlFor="fullName">Nome Completo</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </ConfigurationSection>
            </TabsContent>

            <TabsContent value="pwa">
              <ConfigurationSection
                title="Progressive Web App (PWA)"
                description="Configure as opções do PWA"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pwa-title">Título do App</Label>
                    <Input
                      id="pwa-title"
                      value={appearanceConfig.pwa.title}
                      onChange={(e) => handlePWAChange('title', e.target.value)}
                      placeholder="Ex: Mentoria Médica"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ícone do PWA</Label>
                    <ImageUploader
                      label="Ícone do PWA (PNG, 1024x1024, até 350kb)"
                      accept="image/png"
                      maxSize={358400} // 350KB
                      onUpload={(file) => handlePWAChange('icon', { file })}
                      currentImageUrl={appearanceConfig.pwa.icon?.url}
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