'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Trophy, Flame, Star, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressSystem } from '@/components/academy/progress-system';
import { StreakTracker } from '@/components/academy/streak-tracker';
import { AchievementBadges } from '@/components/academy/achievement-badges';
import { useGamification } from '@/hooks/use-gamification';
import { useCelebrations } from '@/components/academy/completion-celebrations';
import { featuredCourse } from '@/lib/mock-data/academy';
import { gamificationService } from '@/lib/services/gamification-service';
import Link from 'next/link';

export default function ProgressPage() {
  const userId = 'user123'; // TODO: Get from auth context
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Gamification hook with sample data
  const gamification = useGamification(userId, featuredCourse);
  const { showCelebration, CelebrationComponent } = useCelebrations();

  // Calculate estimated time remaining
  const estimatedTimeRemaining = gamificationService.estimateTimeRemaining(
    featuredCourse, 
    gamification.userProgress
  );

  // Demo functions for testing celebrations
  const triggerSampleCelebration = (type: 'lesson' | 'module' | 'course' | 'achievement' | 'streak' | 'level_up') => {
    const celebrations = {
      lesson: {
        title: 'Técnica Endoscópica - Parte 1',
        subtitle: 'Parabéns! Mais um passo na sua jornada médica.',
        icon: '✅'
      },
      module: {
        title: 'Técnica Browlift',
        subtitle: 'Excelente! Você dominou mais uma área do conhecimento.',
        icon: '🎯'
      },
      course: {
        title: 'Browlift & EndomidFace',
        subtitle: 'Parabéns, Dr(a)! Você concluiu sua especialização com sucesso!',
        icon: '👑'
      },
      achievement: {
        title: 'Primeiro Corte',
        subtitle: 'Conquista desbloqueada! Sua dedicação está sendo recompensada.',
        icon: '🔪',
        xpGained: 50
      },
      streak: {
        title: '7 dias seguidos!',
        subtitle: 'Sua consistência é impressionante! Continue assim.',
        icon: '🔥'
      },
      level_up: {
        title: 'Nível 5!',
        subtitle: 'Você subiu de nível! Continue evoluindo!',
        icon: '⭐',
        newLevel: 5,
        xpGained: 200
      }
    };

    const celebration = celebrations[type];
    showCelebration(type, celebration.title, celebration);
  };

  if (gamification.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando progresso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/10">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/academy">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 bg-white/10 border-white/20 text-slate-400 hover:bg-white/15 hover:text-white transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Meu Progresso
                </h1>
                <p className="text-sm text-slate-400">
                  Acompanhe sua jornada de aprendizado
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.round(gamification.progress.completion)}%
                </div>
                <div className="text-xs text-slate-400">Concluído</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                  🔥 {gamification.streak}
                </div>
                <div className="text-xs text-slate-400">Dias seguidos</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {gamification.userProgress.level}
                </div>
                <div className="text-xs text-slate-400">Nível</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="streak" 
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Flame className="h-4 w-4 mr-2" />
              Sequência
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Conquistas
            </TabsTrigger>
            <TabsTrigger 
              value="demo" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              Demo
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress System */}
              <ProgressSystem
                course={featuredCourse}
                progress={gamification.progress}
                estimatedTimeRemaining={estimatedTimeRemaining}
              />

              {/* Quick Achievement Preview */}
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Conquistas Recentes
                </h3>
                
                <div className="space-y-3">
                  {gamification.achievements
                    .filter(a => a.unlockedAt)
                    .slice(-3)
                    .map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{achievement.title}</div>
                          <div className="text-sm text-slate-400">{achievement.description}</div>
                        </div>
                        <div className="text-xs text-yellow-400">+{achievement.points} XP</div>
                      </motion.div>
                    ))}
                  
                  {gamification.achievements.filter(a => a.unlockedAt).length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Continue estudando para desbloquear conquistas!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streak" className="space-y-6">
            <StreakTracker
              streak={gamification.streak}
              longestStreak={gamification.userProgress.longestStreak}
              dailyGoal={gamification.dailyGoal}
              todayProgress={gamification.todayProgress}
              weeklyData={gamification.getWeeklyData()}
              onGoalUpdate={gamification.setDailyGoal}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementBadges
              userAchievements={gamification.achievements}
              recentlyUnlocked={gamification.recentlyUnlocked}
              totalXP={gamification.userProgress.totalXP}
              level={gamification.userProgress.level}
              xpToNextLevel={gamification.getXPToNextLevel()}
            />
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Demonstração de Celebrações
              </h3>
              
              <p className="text-slate-400 mb-6">
                Teste as diferentes animações de celebração do sistema de gamificação:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => triggerSampleCelebration('lesson')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✅ Aula Concluída
                </Button>
                
                <Button
                  onClick={() => triggerSampleCelebration('module')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🎯 Módulo Concluído
                </Button>
                
                <Button
                  onClick={() => triggerSampleCelebration('course')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  👑 Curso Concluído
                </Button>
                
                <Button
                  onClick={() => triggerSampleCelebration('achievement')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  🏆 Nova Conquista
                </Button>
                
                <Button
                  onClick={() => triggerSampleCelebration('streak')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  🔥 Sequência
                </Button>
                
                <Button
                  onClick={() => triggerSampleCelebration('level_up')}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  ⭐ Subiu de Nível
                </Button>
              </div>

              {/* Demo Actions */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-md font-medium text-white mb-4">Ações de Teste</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => gamification.updateWatchTime(30)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    📺 +30min assistidos
                  </Button>
                  
                  <Button
                    onClick={() => gamification.markLessonCompleted('lesson-demo')}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    ✅ Concluir aula demo
                  </Button>
                  
                  <Button
                    onClick={() => gamification.addNote()}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    📝 Adicionar nota
                  </Button>
                  
                  <Button
                    onClick={() => gamification.triggerSpeedAchievement(2)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    ⚡ Velocidade 2x
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Celebration Component */}
      {CelebrationComponent}
    </div>
  );
}