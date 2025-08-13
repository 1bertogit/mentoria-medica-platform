'use client';

import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfigurationProvider, useConfiguration } from '@/contexts/configuration-context';
import EmailConfiguration from './email/page';
import AppearanceConfiguration from './appearance/page';
import DomainConfiguration from './domain/page';
import UserManagementConfiguration from './users/page';
import SupportConfiguration from './support/page';
import AdvancedConfiguration from './advanced/page';
import GamificationConfiguration from './gamification/page';
import { Settings, Palette, Globe, Users, MessageSquare, Shield, Trophy, Mail } from 'lucide-react';

const configSections = [
  { id: 'email', label: 'Email', icon: Mail, component: EmailConfiguration },
  { id: 'appearance', label: 'Aparência', icon: Palette, component: AppearanceConfiguration },
  { id: 'domain', label: 'Domínio', icon: Globe, component: DomainConfiguration },
  { id: 'users', label: 'Usuários', icon: Users, component: UserManagementConfiguration },
  { id: 'support', label: 'Suporte', icon: MessageSquare, component: SupportConfiguration },
  { id: 'advanced', label: 'Avançado', icon: Shield, component: AdvancedConfiguration },
  { id: 'gamification', label: 'Gamificação', icon: Trophy, component: GamificationConfiguration },
];

function CourseConfigContent() {
  const { loadConfiguration } = useConfiguration();

  useEffect(() => {
    // Load configuration for the organization
    loadConfiguration('org-mentoria-medica');
  }, [loadConfiguration]);

  return (
    <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Configuração do Curso</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as configurações da plataforma de ensino
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Histórico de Alterações
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Status da Configuração</CardTitle>
            <CardDescription>
              Visualize o status de cada seção de configuração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {configSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Configurado
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="email" className="space-y-4">
          <TabsList className="grid grid-cols-7 w-full">
            {configSections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{section.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {configSections.map((section) => {
            const Component = section.component;
            return (
              <TabsContent key={section.id} value={section.id}>
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
  );
}

export default function CourseConfigurationPage() {
  return (
    <ConfigurationProvider>
      <CourseConfigContent />
    </ConfigurationProvider>
  );
}