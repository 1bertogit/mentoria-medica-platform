'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Lock, Star, Zap, Target, Clock, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/lib/services/gamification-service';
import { useState } from 'react';

interface AchievementBadgesProps {
  userAchievements: Achievement[];
  recentlyUnlocked?: Achievement[];
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  onBadgeClick?: (achievement: Achievement) => void;
}

export function AchievementBadges({
  userAchievements,
  recentlyUnlocked = [],
  totalXP,
  level,
  xpToNextLevel,
  onBadgeClick
}: AchievementBadgesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  const categories = [
    { id: 'all', name: 'Todas', icon: Trophy },
    { id: 'progress', name: 'Progresso', icon: Target },
    { id: 'engagement', name: 'Engajamento', icon: Zap },
    { id: 'time', name: 'Tempo', icon: Clock },
    { id: 'quality', name: 'Qualidade', icon: Star },
    { id: 'special', name: 'Especiais', icon: Award }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'common': return 'from-green-400 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400/50 shadow-yellow-400/20';
      case 'epic': return 'border-purple-400/50 shadow-purple-400/20';
      case 'rare': return 'border-blue-400/50 shadow-blue-400/20';
      case 'common': return 'border-green-400/50 shadow-green-400/20';
      default: return 'border-gray-400/50 shadow-gray-400/20';
    }
  };

  const getXPForNextLevel = (currentLevel: number): number => {
    return Math.pow(currentLevel, 2) * 100;
  };

  const currentLevelXP = getXPForNextLevel(level - 1);
  const nextLevelXP = getXPForNextLevel(level);
  const progressToNextLevel = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const filteredAchievements = userAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showOnlyUnlocked || achievement.unlockedAt;
    return categoryMatch && unlockedMatch;
  });

  const unlockedCount = userAchievements.filter(a => a.unlockedAt).length;
  const totalCount = userAchievements.length;

  return (
    <div className="space-y-6">
      {/* XP and Level Header */}
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 relative overflow-hidden">
        {/* Background glow for high levels */}
        {level >= 10 && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-purple-500/10" />
        )}
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Conquistas & Nível
            </h3>
            
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
            >
              {unlockedCount}/{totalCount} Desbloqueadas
            </Badge>
          </div>

          {/* Level Display */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-lg"
              >
                {level}
              </motion.div>
              <div className="text-sm text-slate-300">Nível</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">XP: {totalXP.toLocaleString()}</span>
                <span className="text-sm text-slate-400">
                  {xpToNextLevel.toLocaleString()} para o próximo nível
                </span>
              </div>
              
              <div className="relative">
                <Progress value={progressToNextLevel} className="h-3 bg-white/10" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Recently Unlocked Achievements */}
          <AnimatePresence>
            {recentlyUnlocked.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 mb-4"
              >
                <div className="text-sm font-medium text-yellow-300 mb-2">
                  🎉 Conquistas Recentes!
                </div>
                <div className="flex gap-2 flex-wrap">
                  {recentlyUnlocked.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-2 bg-white/10 rounded px-2 py-1"
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <span className="text-sm text-white">{achievement.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        +{achievement.points} XP
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                <Icon className="h-4 w-4 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
            className={`
              ${showOnlyUnlocked 
                ? 'bg-green-600 text-white' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }
            `}
          >
            {showOnlyUnlocked ? 'Todas' : 'Apenas Desbloqueadas'}
          </Button>
          
          <span className="text-sm text-slate-400">
            {filteredAchievements.length} conquista{filteredAchievements.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {filteredAchievements.map((achievement, index) => {
            const isUnlocked = !!achievement.unlockedAt;
            const progress = achievement.progress || 0;
            
            return (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`
                    p-4 cursor-pointer transition-all duration-200 relative overflow-hidden
                    ${isUnlocked 
                      ? `bg-white/10 border-2 ${getRarityBorder(achievement.rarity)} shadow-lg hover:shadow-xl` 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                  onClick={() => onBadgeClick?.(achievement)}
                >
                  {/* Rarity glow effect */}
                  {isUnlocked && (
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-5`}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Achievement Icon and Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-2xl
                        ${isUnlocked 
                          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg` 
                          : 'bg-white/10 grayscale'
                        }
                      `}>
                        {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-slate-500" />}
                      </div>

                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            isUnlocked 
                              ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white border-0` 
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {achievement.rarity}
                        </Badge>
                        
                        {isUnlocked && (
                          <div className="text-xs text-green-400 mt-1">
                            +{achievement.points} XP
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Achievement Info */}
                    <div className="mb-3">
                      <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">
                        {achievement.description}
                      </p>
                    </div>

                    {/* Progress Bar (for unlocked achievements) */}
                    {!isUnlocked && progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {achievement.requirement.current} / {achievement.requirement.target}
                          </span>
                          <span className="text-slate-400">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        
                        <div className="relative">
                          <Progress value={progress} className="h-2 bg-white/10" />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Unlock Date */}
                    {isUnlocked && achievement.unlockedAt && (
                      <div className="text-xs text-slate-400 mt-2">
                        Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="p-8 bg-white/5 border-white/10 text-center">
          <Trophy className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">
            Nenhuma conquista encontrada com os filtros selecionados.
          </p>
        </Card>
      )}
    </div>
  );
}