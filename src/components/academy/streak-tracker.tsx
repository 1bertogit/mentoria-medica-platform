'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Flame, Target, TrendingUp, Calendar, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DailyProgress } from '@/lib/services/gamification-service';
import { useState } from 'react';

interface StreakTrackerProps {
  streak: number;
  longestStreak: number;
  dailyGoal: number; // minutes
  todayProgress: number; // minutes
  weeklyData: DailyProgress[];
  onGoalUpdate?: (newGoal: number) => void;
}

export function StreakTracker({
  streak,
  longestStreak,
  dailyGoal,
  todayProgress,
  weeklyData,
  onGoalUpdate
}: StreakTrackerProps) {
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoal);

  const todayProgressPercentage = Math.min((todayProgress / dailyGoal) * 100, 100);
  const isGoalMet = todayProgress >= dailyGoal;

  const getStreakEmoji = (streakCount: number) => {
    if (streakCount >= 30) return '🏆';
    if (streakCount >= 14) return '⭐';
    if (streakCount >= 7) return '💪';
    if (streakCount >= 3) return '🔥';
    return '💤';
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount >= 30) return 'from-yellow-400 via-orange-500 to-red-500';
    if (streakCount >= 14) return 'from-purple-400 to-pink-500';
    if (streakCount >= 7) return 'from-blue-400 to-cyan-500';
    if (streakCount >= 3) return 'from-orange-400 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStreakMessage = (streakCount: number) => {
    if (streakCount >= 30) return 'Lendário! Você é imparável! 🌟';
    if (streakCount >= 14) return 'Incrível! Duas semanas de dedicação! 💪';
    if (streakCount >= 7) return 'Excelente! Uma semana completa! 🎯';
    if (streakCount >= 3) return 'Ótimo! Continue assim! 🔥';
    if (streakCount >= 1) return 'Bom início! Mantenha o ritmo! 💚';
    return 'Vamos começar sua jornada! 🚀';
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const handleGoalUpdate = () => {
    if (onGoalUpdate && tempGoal !== dailyGoal) {
      onGoalUpdate(tempGoal);
    }
    setShowGoalEditor(false);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    // Generate last 14 days including today
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayData = weeklyData.find(data => {
        const dataDate = new Date(data.date);
        dataDate.setHours(0, 0, 0, 0);
        return dataDate.getTime() === date.getTime();
      });
      
      days.push({
        date,
        hasProgress: !!dayData && dayData.minutesWatched > 0,
        goalMet: !!dayData && dayData.goalMet,
        minutesWatched: dayData?.minutesWatched || 0,
        isToday: i === 0
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 relative overflow-hidden">
        {/* Background Fire Animation */}
        <AnimatePresence>
          {streak >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              Sequência de Estudos
            </h3>
            
            <Badge 
              variant="secondary" 
              className={`bg-gradient-to-r ${getStreakColor(streak)} text-white border-0 px-3 py-1`}
            >
              Recorde: {longestStreak} dias
            </Badge>
          </div>

          {/* Main Streak Counter */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="text-6xl font-bold mb-2"
            >
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {getStreakEmoji(streak)}
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {streak} dia{streak !== 1 ? 's' : ''}
            </motion.div>
            
            <div className="text-slate-300">
              {getStreakMessage(streak)}
            </div>
          </div>

          {/* Calendar Heatmap */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Últimos 14 dias
            </h4>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div
                    className={`
                      w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-medium
                      transition-all duration-200 hover:scale-110 cursor-help
                      ${day.isToday 
                        ? 'border-blue-400 bg-blue-500/20 text-blue-300' 
                        : day.goalMet
                        ? 'border-green-400 bg-green-500/30 text-green-300'
                        : day.hasProgress
                        ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                        : 'border-white/20 bg-white/5 text-slate-500'
                      }
                    `}
                  >
                    {day.date.getDate()}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {day.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    <br />
                    {day.minutesWatched > 0 ? formatTime(day.minutesWatched) : 'Sem estudo'}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-white/5 border border-white/20"></div>
                <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-400"></div>
                <div className="w-3 h-3 rounded bg-green-500/30 border border-green-400"></div>
              </div>
              <span>Mais</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Goal Progress */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <Target className="h-4 w-4 text-green-400" />
            Meta de Hoje
          </h4>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowGoalEditor(!showGoalEditor)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Ajustar Meta
          </Button>
        </div>

        {/* Goal Editor */}
        <AnimatePresence>
          {showGoalEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(Number(e.target.value))}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  placeholder="Minutos por dia"
                />
                <Button size="sm" onClick={handleGoalUpdate}>
                  Salvar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke={isGoalMet ? "#10b981" : "#3b82f6"}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 40 * (1 - todayProgressPercentage / 100)
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {Math.round(todayProgressPercentage)}%
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white font-medium">
                {formatTime(todayProgress)}
              </span>
              <span className="text-sm text-slate-400">
                de {formatTime(dailyGoal)}
              </span>
            </div>
            
            <Progress 
              value={todayProgressPercentage} 
              className="h-2 bg-white/10"
            />
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">
                {isGoalMet ? 'Meta cumprida! 🎯' : `Faltam ${formatTime(Math.max(0, dailyGoal - todayProgress))}`}
              </span>
              
              {isGoalMet && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  ✅
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300">Esta Semana</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {weeklyData.reduce((total, day) => total + day.minutesWatched, 0)}min
          </div>
          <div className="text-xs text-slate-400">
            {weeklyData.filter(day => day.goalMet).length} dias perfeitos
          </div>
        </Card>

        <Card className="p-3 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-slate-300">Média Diária</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {Math.round(weeklyData.reduce((total, day) => total + day.minutesWatched, 0) / Math.max(weeklyData.length, 1))}min
          </div>
          <div className="text-xs text-slate-400">
            {weeklyData.length > 0 ? 'últimos 7 dias' : 'nenhum dado'}
          </div>
        </Card>
      </div>
    </div>
  );
}