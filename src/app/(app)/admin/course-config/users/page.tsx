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
import { Save, Users, Shield, Key, UserCog, UserPlus, X } from 'lucide-react';
import { UserConfiguration as UserConfigType } from '@/types/course-admin';
import { toast } from 'sonner';

export default function UserManagementConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [userConfig, setUserConfig] = useState<UserConfigType | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.configuration?.users) {
      setUserConfig(state.configuration.users);
    }
  }, [state.configuration]);

  const handleAuthenticationChange = (field: string, value: unknown) => {
    if (!userConfig) return;
    
    const updatedConfig = {
      ...userConfig,
      authentication: {
        ...userConfig.authentication,
        [field]: value,
      },
    };
    setUserConfig(updatedConfig);
  };

  const handleProfileRestrictionsChange = (field: string, value: boolean) => {
    if (!userConfig) return;
    
    const updatedConfig = {
      ...userConfig,
      profileRestrictions: {
        ...userConfig.profileRestrictions,
        [field]: value,
      },
    };
    setUserConfig(updatedConfig);
  };

  const handleRegistrationChange = (field: string, value: unknown) => {
    if (!userConfig) return;
    
    const updatedConfig = {
      ...userConfig,
      registration: {
        ...userConfig.registration,
        [field]: value,
      },
    };
    setUserConfig(updatedConfig);
  };

  const handleFreeRegistrationChange = (field: string, value: unknown) => {
    if (!userConfig) return;
    
    const updatedConfig = {
      ...userConfig,
      registration: {
        ...userConfig.registration,
        freeRegistration: {
          ...userConfig.registration.freeRegistration,
          [field]: value,
        },
      },
    };
    setUserConfig(updatedConfig);
  };

  const addAllowedDomain = () => {
    if (!userConfig || !newDomain) return;
    
    const domains = [...userConfig.registration.freeRegistration.allowedDomains, newDomain];
    handleFreeRegistrationChange('allowedDomains', domains);
    setNewDomain('');
  };

  const removeAllowedDomain = (domain: string) => {
    if (!userConfig) return;
    
    const domains = userConfig.registration.freeRegistration.allowedDomains.filter(d => d !== domain);
    handleFreeRegistrationChange('allowedDomains', domains);
  };

  const addProductAccess = () => {
    if (!userConfig || !newProduct) return;
    
    const products = [...userConfig.registration.productAccess, newProduct];
    handleRegistrationChange('productAccess', products);
    setNewProduct('');
  };

  const removeProductAccess = (product: string) => {
    if (!userConfig) return;
    
    const products = userConfig.registration.productAccess.filter(p => p !== product);
    handleRegistrationChange('productAccess', products);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleAuthenticationChange('defaultPassword', password);
  };

  const handleSave = async () => {
    if (!userConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('users', userConfig, 'Atualização das configurações de usuários');
      await saveConfiguration();
      toast.success('Configurações de usuários salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de usuários');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!userConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configuração de Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Configure autenticação, perfis e registro de usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConfigurationSection
            title="Configurações de Autenticação"
            description="Configure como os usuários fazem login na plataforma"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campo de Senha</Label>
                <RadioGroup
                  value={userConfig.authentication.passwordField}
                  onValueChange={(value) => handleAuthenticationChange('passwordField', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default-pass" />
                    <Label htmlFor="default-pass">Senha Padrão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-pass" />
                    <Label htmlFor="email-pass">Email como Senha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cpf" id="cpf-pass" />
                    <Label htmlFor="cpf-pass">CPF/CNPJ como Senha</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-password">Senha Padrão</Label>
                <div className="flex gap-2">
                  <Input
                    id="default-password"
                    type="text"
                    value={userConfig.authentication.defaultPassword}
                    onChange={(e) => handleAuthenticationChange('defaultPassword', e.target.value)}
                    placeholder="Digite a senha padrão"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomPassword}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Gerar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Senhas Aleatórias</Label>
                  <p className="text-sm text-muted-foreground">
                    Gera senhas aleatórias para novos usuários
                  </p>
                </div>
                <Switch
                  checked={userConfig.authentication.randomPasswords}
                  onCheckedChange={(checked) => handleAuthenticationChange('randomPasswords', checked)}
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Restrições de Perfil"
            description="Configure o que os usuários podem editar em seus perfis"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Bloquear Edição de Nome e CPF</Label>
                  <p className="text-sm text-muted-foreground">
                    Impede usuários de alterar nome e CPF
                  </p>
                </div>
                <Switch
                  checked={userConfig.profileRestrictions.blockNameCpf}
                  onCheckedChange={(checked) => handleProfileRestrictionsChange('blockNameCpf', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Bloquear Edição de Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Impede usuários de alterar o email
                  </p>
                </div>
                <Switch
                  checked={userConfig.profileRestrictions.blockEmail}
                  onCheckedChange={(checked) => handleProfileRestrictionsChange('blockEmail', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Ocultar Campo de Documento</Label>
                  <p className="text-sm text-muted-foreground">
                    Oculta o campo de documento no perfil
                  </p>
                </div>
                <Switch
                  checked={userConfig.profileRestrictions.hideDocument}
                  onCheckedChange={(checked) => handleProfileRestrictionsChange('hideDocument', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Ocultar Campo de Endereço</Label>
                  <p className="text-sm text-muted-foreground">
                    Oculta o campo de endereço no perfil
                  </p>
                </div>
                <Switch
                  checked={userConfig.profileRestrictions.hideAddress}
                  onCheckedChange={(checked) => handleProfileRestrictionsChange('hideAddress', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Ocultar Campo de Telefone</Label>
                  <p className="text-sm text-muted-foreground">
                    Oculta o campo de telefone no perfil
                  </p>
                </div>
                <Switch
                  checked={userConfig.profileRestrictions.hidePhone}
                  onCheckedChange={(checked) => handleProfileRestrictionsChange('hidePhone', checked)}
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Configurações de Registro"
            description="Configure como novos usuários podem se registrar"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Registro Gratuito via Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite registro gratuito pela página de login
                  </p>
                </div>
                <Switch
                  checked={userConfig.registration.freeRegistration.viaLogin}
                  onCheckedChange={(checked) => handleFreeRegistrationChange('viaLogin', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Registro Gratuito via URL</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite registro gratuito por URL específica
                  </p>
                </div>
                <Switch
                  checked={userConfig.registration.freeRegistration.viaUrl}
                  onCheckedChange={(checked) => handleFreeRegistrationChange('viaUrl', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Restringir Domínios</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite registro apenas de domínios específicos
                  </p>
                </div>
                <Switch
                  checked={userConfig.registration.freeRegistration.restrictDomains}
                  onCheckedChange={(checked) => handleFreeRegistrationChange('restrictDomains', checked)}
                />
              </div>

              {userConfig.registration.freeRegistration.restrictDomains && (
                <div className="space-y-2">
                  <Label>Domínios Permitidos</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="exemplo.com"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAllowedDomain}
                    >
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userConfig.registration.freeRegistration.allowedDomains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="pl-2">
                        {domain}
                        <button
                          onClick={() => removeAllowedDomain(domain)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">reCAPTCHA</Label>
                  <p className="text-sm text-muted-foreground">
                    Proteção contra spam nos formulários de registro
                  </p>
                </div>
                <Switch
                  checked={userConfig.registration.freeRegistration.recaptcha}
                  onCheckedChange={(checked) => handleFreeRegistrationChange('recaptcha', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Produtos com Acesso</Label>
                <div className="flex gap-2">
                  <Input
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    placeholder="ID do produto"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProductAccess}
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userConfig.registration.productAccess.map((product) => (
                    <Badge key={product} variant="secondary" className="pl-2">
                      {product}
                      <button
                        onClick={() => removeProductAccess(product)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Apenas Usuários Gratuitos</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite registro apenas para usuários gratuitos
                  </p>
                </div>
                <Switch
                  checked={userConfig.registration.freeUsersOnly}
                  onCheckedChange={(checked) => handleRegistrationChange('freeUsersOnly', checked)}
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