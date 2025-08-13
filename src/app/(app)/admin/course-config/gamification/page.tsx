'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useConfiguration } from '@/contexts/configuration-context';
import { ConfigurationSection } from '@/components/admin/configuration/ConfigurationSection';
import { Save, Trophy, Target, Medal, Star, Award, Zap } from 'lucide-react';
import { GamificationConfiguration as GamificationConfigType } from '@/types/course-admin';
import { toast } from 'sonner';

const gamificationTriggers = [
  {
    id: 'lessonCompleted',
    label: 'Aula Concluída',
    description: 'Pontos ao completar uma aula',
    icon: Target,
    defaultPoints: 10,
  },
  {
    id: 'courseStarted',
    label: 'Curso Iniciado',
    description: 'Pontos ao iniciar um novo curso',
    icon: Star,
    defaultPoints: 5,
  },
  {
    id: 'progress50',
    label: 'Progresso 50%',
    description: 'Pontos ao atingir 50% do curso',
    icon: Zap,
    defaultPoints: 25,
  },
  {
    id: 'progress75',
    label: 'Progresso 75%',
    description: 'Pontos ao atingir 75% do curso',
    icon: Zap,
    defaultPoints: 35,
  },
  {
    id: 'progress90',
    label: 'Progresso 90%',
    description: 'Pontos ao atingir 90% do curso',
    icon: Zap,
    defaultPoints: 45,
  },
  {
    id: 'courseCompleted',
    label: 'Curso Concluído',
    description: 'Pontos ao completar um curso',
    icon: Trophy,
    defaultPoints: 100,
  },
  {
    id: 'certificateIssued',
    label: 'Certificado Emitido',
    description: 'Pontos ao receber certificado',
    icon: Award,
    defaultPoints: 50,
  },
  {
    id: 'questionSubmitted',
    label: 'Pergunta Enviada',
    description: 'Pontos ao fazer uma pergunta',
    icon: Medal,
    defaultPoints: 2,
  },
  {
    id: 'commentPosted',
    label: 'Comentário Postado',
    description: 'Pontos ao postar comentário',
    icon: Medal,
    defaultPoints: 3,
  },
  {
    id: 'examPassed',
    label: 'Prova Aprovada',
    description: 'Pontos ao passar em uma prova',
    icon: Trophy,
    defaultPoints: 75,
  },
];

export default function GamificationConfiguration() {
  const { state, updateConfiguration, saveConfiguration } = useConfiguration();
  const [gamificationConfig, setGamificationConfig] = useState<GamificationConfigType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.configuration?.gamification) {
      setGamificationConfig(state.configuration.gamification);
    }
  }, [state.configuration]);

  const handleDisplayChange = (field: string, value: boolean) => {
    if (!gamificationConfig) return;
    
    const updatedConfig = {
      ...gamificationConfig,
      display: {
        ...gamificationConfig.display,
        [field]: value,
      },
    };
    setGamificationConfig(updatedConfig);
  };

  const handleTriggerChange = (
    triggerId: keyof GamificationConfigType['triggers'],
    field: 'enabled' | 'points',
    value: unknown) => {
    if (!gamificationConfig) return;
    
    const updatedConfig = {
      ...gamificationConfig,
      triggers: {
        ...gamificationConfig.triggers,
        [triggerId]: {
          ...gamificationConfig.triggers[triggerId],
          [field]: value,
        },
      },
    };
    setGamificationConfig(updatedConfig);
  };

  const calculateTotalPoints = () => {
    if (!gamificationConfig) return 0;
    
    return Object.values(gamificationConfig.triggers).reduce((total, trigger) => {
      return trigger.enabled ? total + trigger.points : total;
    }, 0);
  };

  const handleSave = async () => {
    if (!gamificationConfig) return;
    
    setIsSaving(true);
    try {
      updateConfiguration('gamification', gamificationConfig, 'Atualização das configurações de gamificação');
      await saveConfiguration();
      toast.success('Configurações de gamificação salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de gamificação');
      logger.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!gamificationConfig) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Configuração de Gamificação
          </CardTitle>
          <CardDescription>
            Configure o sistema de pontos e rankings para engajamento dos alunos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConfigurationSection
            title="Exibição de Rankings"
            description="Configure como os rankings são exibidos aos alunos"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Mostrar Ranking</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe o ranking de pontuação aos alunos
                  </p>
                </div>
                <Switch
                  checked={gamificationConfig.display.showRanking}
                  onCheckedChange={(checked) => handleDisplayChange('showRanking', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Mostrar Total de Usuários</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe o número total de usuários no ranking
                  </p>
                </div>
                <Switch
                  checked={gamificationConfig.display.showTotalUsers}
                  onCheckedChange={(checked) => handleDisplayChange('showTotalUsers', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Mostrar Nomes Completos</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe nomes completos no ranking (ao invés de apenas primeiros nomes)
                  </p>
                </div>
                <Switch
                  checked={gamificationConfig.display.showFullNames}
                  onCheckedChange={(checked) => handleDisplayChange('showFullNames', checked)}
                />
              </div>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Gatilhos de Pontuação"
            description="Configure os eventos que concedem pontos aos alunos"
          >
            <div className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total de Pontos Possíveis</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotalPoints()}
                  </span>
                </div>
              </Card>

              {gamificationTriggers.map((trigger) => {
                const Icon = trigger.icon;
                const configTrigger = gamificationConfig.triggers[trigger.id as keyof GamificationConfigType['triggers']];
                
                return (
                  <Card key={trigger.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{trigger.label}</h4>
                            <p className="text-sm text-muted-foreground">{trigger.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={configTrigger.enabled}
                          onCheckedChange={(checked) =>
                            handleTriggerChange(trigger.id as keyof GamificationConfigType['triggers'], 'enabled', checked)
                          }
                        />
                      </div>
                      
                      {configTrigger.enabled && (
                        <div className="flex items-center gap-3 ml-8">
                          <Label htmlFor={`points-${trigger.id}`} className="text-sm">
                            Pontos:
                          </Label>
                          <Input
                            id={`points-${trigger.id}`}
                            type="number"
                            value={configTrigger.points}
                            onChange={(e) =>
                              handleTriggerChange(
                                trigger.id as keyof GamificationConfigType['triggers'],
                                'points',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-24"
                            min={0}
                            max={1000}
                          />
                          <span className="text-sm text-muted-foreground">
                            (Padrão: {trigger.defaultPoints})
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Visualização de Gamificação"
            description="Prévia de como os alunos verão o sistema de pontos"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Ranking de Alunos
                  </h3>
                  {gamificationConfig.display.showTotalUsers && (
                    <span className="text-sm text-muted-foreground">
                      Total: 1.234 alunos
                    </span>
                  )}
                </div>
                
                {gamificationConfig.display.showRanking && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">1º</span>
                        <span>
                          {gamificationConfig.display.showFullNames ? 'João Silva Santos' : 'João'}
                        </span>
                      </div>
                      <span className="font-semibold">2.450 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">2º</span>
                        <span>
                          {gamificationConfig.display.showFullNames ? 'Maria Oliveira Costa' : 'Maria'}
                        </span>
                      </div>
                      <span className="font-semibold">2.380 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">3º</span>
                        <span>
                          {gamificationConfig.display.showFullNames ? 'Pedro Almeida Lima' : 'Pedro'}
                        </span>
                      </div>
                      <span className="font-semibold">2.290 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border-2 border-primary">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">15º</span>
                        <span className="font-medium">Você</span>
                      </div>
                      <span className="font-semibold text-primary">1.150 pts</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
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