'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useConfiguration } from '@/contexts/configuration-context';
import { ConfigurationSection } from '@/components/admin/configuration/ConfigurationSection';
import { Save, Shield, Award, Zap, Lock, Key, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { AdvancedConfiguration as AdvancedConfigType, ApiKey } from '@/types/course-admin';
import { toast } from 'sonner';

export default function AdvancedConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfigType | null>(null);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const availablePermissions = [
    'read:courses',
    'write:courses',
    'read:users',
    'write:users',
    'read:analytics',
    'write:analytics',
    'read:reports',
    'write:reports',
  ];

  useEffect(() => {
    if (state.configuration?.advanced) {
      setAdvancedConfig(state.configuration.advanced);
    }
  }, [state.configuration]);

  const handleCertificatesChange = (value: boolean) => {
    if (!advancedConfig) return;
    
    const updatedConfig = {
      ...advancedConfig,
      certificates: {
        enabled: value,
      },
    };
    setAdvancedConfig(updatedConfig);
  };

  const handleProgressTrackingChange = (value: boolean) => {
    if (!advancedConfig) return;
    
    const updatedConfig = {
      ...advancedConfig,
      progressTracking: {
        autoMarkLessons: value,
      },
    };
    setAdvancedConfig(updatedConfig);
  };

  const handleDynamicContentChange = (value: boolean) => {
    if (!advancedConfig) return;
    
    const updatedConfig = {
      ...advancedConfig,
      dynamicContent: {
        enabled: value,
      },
    };
    setAdvancedConfig(updatedConfig);
  };

  const handleDrmChange = (field: string, value: unknown) => {
    if (!advancedConfig) return;
    
    const updatedConfig = {
      ...advancedConfig,
      drm: {
        ...advancedConfig.drm,
        [field]: value,
      },
    };
    setAdvancedConfig(updatedConfig);
  };

  const generateApiKey = () => {
    if (!advancedConfig || !newApiKeyName || selectedPermissions.length === 0) return;

    const newKey: ApiKey = {
      id: `api-${Date.now()}`,
      name: newApiKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 34)}`,
      permissions: selectedPermissions,
      createdAt: new Date().toISOString(),
      active: true,
    };

    const updatedConfig = {
      ...advancedConfig,
      apiKeys: [...advancedConfig.apiKeys, newKey],
    };
    setAdvancedConfig(updatedConfig);
    
    setNewApiKeyName('');
    setSelectedPermissions([]);
    toast.success('Chave API criada com sucesso!');
  };

  const toggleApiKey = (keyId: string) => {
    if (!advancedConfig) return;

    const updatedKeys = advancedConfig.apiKeys.map(key =>
      key.id === keyId ? { ...key, active: !key.active } : key
    );

    const updatedConfig = {
      ...advancedConfig,
      apiKeys: updatedKeys,
    };
    setAdvancedConfig(updatedConfig);
  };

  const deleteApiKey = (keyId: string) => {
    if (!advancedConfig) return;

    const updatedKeys = advancedConfig.apiKeys.filter(key => key.id !== keyId);

    const updatedConfig = {
      ...advancedConfig,
      apiKeys: updatedKeys,
    };
    setAdvancedConfig(updatedConfig);
    toast.success('Chave API removida com sucesso!');
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Chave copiada para a área de transferência!');
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = async () => {
    if (!advancedConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('advanced', advancedConfig, 'Atualização das configurações avançadas');
      await saveConfiguration();
      toast.success('Configurações avançadas salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações avançadas');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!advancedConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Configure certificados, rastreamento de progresso, DRM e APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConfigurationSection
            title="Certificados"
            description="Configure a geração de certificados de conclusão"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label className="text-base">Habilitar Certificados</Label>
                <p className="text-sm text-muted-foreground">
                  Gera certificados de conclusão para os alunos
                </p>
              </div>
              <Switch
                checked={advancedConfig.certificates.enabled}
                onCheckedChange={handleCertificatesChange}
              />
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Rastreamento de Progresso"
            description="Configure como o progresso dos alunos é rastreado"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label className="text-base">Marcar Aulas Automaticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Marca aulas como concluídas automaticamente ao visualizar
                </p>
              </div>
              <Switch
                checked={advancedConfig.progressTracking.autoMarkLessons}
                onCheckedChange={handleProgressTrackingChange}
              />
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Conteúdo Dinâmico"
            description="Configure conteúdo personalizado dentro das aulas"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label className="text-base">Habilitar Conteúdo Dinâmico</Label>
                <p className="text-sm text-muted-foreground">
                  Permite conteúdo personalizado baseado no perfil do aluno
                </p>
              </div>
              <Switch
                checked={advancedConfig.dynamicContent.enabled}
                onCheckedChange={handleDynamicContentChange}
              />
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Proteção DRM"
            description="Configure a proteção de conteúdo digital"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Social DRM para PDFs</Label>
                  <p className="text-sm text-muted-foreground">
                    Adiciona marca d'água com dados do usuário em PDFs
                  </p>
                </div>
                <Switch
                  checked={advancedConfig.drm.socialPdf}
                  onCheckedChange={(checked) => handleDrmChange('socialPdf', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">DRM Panda Video</Label>
                  <p className="text-sm text-muted-foreground">
                    Proteção DRM para vídeos hospedados no Panda Video
                  </p>
                </div>
                <Switch
                  checked={advancedConfig.drm.pandaVideo}
                  onCheckedChange={(checked) => handleDrmChange('pandaVideo', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">DRM Videofront</Label>
                  <p className="text-sm text-muted-foreground">
                    Proteção DRM para vídeos hospedados no Videofront
                  </p>
                </div>
                <Switch
                  checked={advancedConfig.drm.videofront}
                  onCheckedChange={(checked) => handleDrmChange('videofront', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Posição da Marca D'água</Label>
                <RadioGroup
                  value={advancedConfig.drm.position}
                  onValueChange={(value) => handleDrmChange('position', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top" id="drm-top" />
                    <Label htmlFor="drm-top">Topo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="drm-left" />
                    <Label htmlFor="drm-left">Lateral Esquerda</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="footer" id="drm-footer" />
                    <Label htmlFor="drm-footer">Rodapé</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Gerenciamento de Chaves API"
            description="Crie e gerencie chaves de API para integrações"
          >
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Criar Nova Chave API</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="api-key-name">Nome da Chave</Label>
                    <Input
                      id="api-key-name"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      placeholder="Ex: Integração Analytics"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Permissões</Label>
                    <div className="flex flex-wrap gap-2">
                      {availablePermissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant={selectedPermissions.includes(permission) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => togglePermission(permission)}
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateApiKey}
                    disabled={!newApiKeyName || selectedPermissions.length === 0}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Gerar Chave API
                  </Button>
                </div>
              </Card>

              <div className="space-y-2">
                <h4 className="font-medium">Chaves API Existentes</h4>
                <div className="space-y-2">
                  {advancedConfig.apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{apiKey.name}</span>
                              <Badge variant={apiKey.active ? 'default' : 'secondary'}>
                                {apiKey.active ? 'Ativa' : 'Inativa'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Criada em: {new Date(apiKey.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                            {apiKey.lastUsed && (
                              <p className="text-sm text-muted-foreground">
                                Último uso: {new Date(apiKey.lastUsed).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleApiKey(apiKey.id)}
                            >
                              {apiKey.active ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteApiKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Input
                            type={showApiKey[apiKey.id] ? 'text' : 'password'}
                            value={apiKey.key}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowApiKey(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                          >
                            {showApiKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyApiKey(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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