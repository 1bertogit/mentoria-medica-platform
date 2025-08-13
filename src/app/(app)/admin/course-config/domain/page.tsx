'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useConfiguration } from '@/contexts/configuration-context';
import { ImageUploader } from '@/components/admin/configuration/ImageUploader';
import { ConfigurationSection } from '@/components/admin/configuration/ConfigurationSection';
import { Save, Globe, Link, FileText, Share2, Shield, Info } from 'lucide-react';
import { GeneralConfiguration as GeneralConfigType } from '@/types/course-admin';
import { toast } from 'sonner';

export default function DomainConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [generalConfig, setGeneralConfig] = useState<GeneralConfigType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.configuration?.general) {
      setGeneralConfig(state.configuration.general);
    }
  }, [state.configuration]);

  const handleDomainChange = (field: string, value: unknown) => {
    if (!generalConfig) return;
    
    const updatedConfig = {
      ...generalConfig,
      domain: {
        ...generalConfig.domain,
        [field]: value,
      },
    };
    setGeneralConfig(updatedConfig);
  };

  const handleDynamicPagesChange = (field: string, value: string) => {
    if (!generalConfig) return;
    
    const updatedConfig = {
      ...generalConfig,
      dynamicPages: {
        ...generalConfig.dynamicPages,
        [field]: value,
      },
    };
    setGeneralConfig(updatedConfig);
  };

  const handleLocalizationChange = (value: string) => {
    if (!generalConfig) return;
    
    const updatedConfig = {
      ...generalConfig,
      localization: {
        language: value as 'pt' | 'es' | 'en',
      },
    };
    setGeneralConfig(updatedConfig);
  };

  const handleLegalChange = (field: string, value: unknown) => {
    if (!generalConfig) return;
    
    const updatedConfig = {
      ...generalConfig,
      legal: {
        ...generalConfig.legal,
        [field]: value,
      },
    };
    setGeneralConfig(updatedConfig);
  };

  const handleSocialSharingChange = (field: string, value: unknown) => {
    if (!generalConfig) return;
    
    const updatedConfig = {
      ...generalConfig,
      socialSharing: {
        ...generalConfig.socialSharing,
        [field]: value,
      },
    };
    setGeneralConfig(updatedConfig);
  };

  const handleSave = async () => {
    if (!generalConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('general', generalConfig, 'Atualização das configurações de domínio e gerais');
      await saveConfiguration();
      toast.success('Configurações de domínio salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de domínio');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!generalConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domínio e Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configure domínio customizado, idioma, termos legais e compartilhamento social
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConfigurationSection
            title="Domínio Customizado"
            description="Configure um domínio personalizado para sua plataforma"
          >
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Como configurar seu domínio</AlertTitle>
                <AlertDescription>
                  Para configurar um domínio customizado, você precisa adicionar um registro CNAME no seu provedor de DNS apontando para o endereço fornecido abaixo.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="custom-domain">Domínio Customizado</Label>
                <Input
                  id="custom-domain"
                  value={generalConfig.domain.custom}
                  onChange={(e) => handleDomainChange('custom', e.target.value)}
                  placeholder="Ex: app.seudominio.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cname">CNAME</Label>
                <Input
                  id="cname"
                  value={generalConfig.domain.cname}
                  onChange={(e) => handleDomainChange('cname', e.target.value)}
                  placeholder="Ex: app.seudominio.com.cdn.cloudflare.net"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token de Verificação</Label>
                <Input
                  id="token"
                  value={generalConfig.domain.token}
                  onChange={(e) => handleDomainChange('token', e.target.value)}
                  placeholder="Token de verificação do domínio"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Domínio Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativa o uso do domínio customizado
                  </p>
                </div>
                <Switch
                  checked={generalConfig.domain.active}
                  onCheckedChange={(checked) => handleDomainChange('active', checked)}
                />
              </div>

              {generalConfig.domain.verified && (
                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Domínio Verificado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Seu domínio foi verificado com sucesso e está pronto para uso.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Páginas Dinâmicas"
            description="Configure URLs para fluxos específicos"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home-flow">URL do Fluxo Home</Label>
                <Input
                  id="home-flow"
                  type="url"
                  value={generalConfig.dynamicPages.homeFlowUrl}
                  onChange={(e) => handleDynamicPagesChange('homeFlowUrl', e.target.value)}
                  placeholder="https://exemplo.com/inicio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first-access">URL do Primeiro Acesso</Label>
                <Input
                  id="first-access"
                  type="url"
                  value={generalConfig.dynamicPages.firstAccessUrl}
                  onChange={(e) => handleDynamicPagesChange('firstAccessUrl', e.target.value)}
                  placeholder="https://exemplo.com/primeiro-acesso"
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Localização"
            description="Selecione o idioma da plataforma"
          >
            <div className="space-y-2">
              <Label>Idioma da Plataforma</Label>
              <RadioGroup
                value={generalConfig.localization.language}
                onValueChange={handleLocalizationChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pt" id="pt" />
                  <Label htmlFor="pt">Português</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="es" id="es" />
                  <Label htmlFor="es">Espanhol</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">Inglês</Label>
                </div>
              </RadioGroup>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Termos Legais"
            description="Configure os termos de uso da plataforma"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Exigir Aceitação dos Termos</Label>
                  <p className="text-sm text-muted-foreground">
                    Todos os alunos devem aceitar os termos antes de acessar
                  </p>
                </div>
                <Switch
                  checked={generalConfig.legal.termsRequired}
                  onCheckedChange={(checked) => handleLegalChange('termsRequired', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-url">URL dos Termos de Uso</Label>
                <Input
                  id="terms-url"
                  type="url"
                  value={generalConfig.legal.termsUrl || ''}
                  onChange={(e) => handleLegalChange('termsUrl', e.target.value)}
                  placeholder="https://exemplo.com/termos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-content">Conteúdo dos Termos</Label>
                <Textarea
                  id="terms-content"
                  value={generalConfig.legal.termsContent}
                  onChange={(e) => handleLegalChange('termsContent', e.target.value)}
                  placeholder="Digite o conteúdo dos termos de uso..."
                  rows={6}
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Compartilhamento Social"
            description="Configure como sua plataforma aparece quando compartilhada"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-title">Título para Compartilhamento</Label>
                <Input
                  id="social-title"
                  value={generalConfig.socialSharing.title}
                  onChange={(e) => handleSocialSharingChange('title', e.target.value)}
                  placeholder="Ex: Mentoria Médica - Educação Continuada"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-description">Descrição</Label>
                <Textarea
                  id="social-description"
                  value={generalConfig.socialSharing.description}
                  onChange={(e) => handleSocialSharingChange('description', e.target.value)}
                  placeholder="Descrição que aparece ao compartilhar..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem de Compartilhamento</Label>
                <ImageUploader
                  label="Imagem para redes sociais (PNG, 196x39, até 600kb)"
                  accept="image/png"
                  maxSize={614400} // 600KB
                  onUpload={(file) => handleSocialSharingChange('image', { file })}
                  currentImageUrl={generalConfig.socialSharing.image?.url}
                />
              </div>
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