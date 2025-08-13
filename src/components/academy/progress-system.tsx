'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Clock, Target, Zap, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AcademyCourse } from '@/lib/mock-data/academy';
import { ProgressMetrics } from '@/lib/services/gamification-service';

interface ProgressSystemProps {
  course: AcademyCourse;
  progress: ProgressMetrics;
  estimatedTimeRemaining: string;
  onProgressUpdate?: (progress: number) => void;
}

export function ProgressSystem({
  course,
  progress,
  estimatedTimeRemaining,
  onProgressUpdate
}: ProgressSystemProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-blue-500 to-cyan-600';
    if (percentage >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getSpeedEmoji = (speed: number) => {
    if (speed >= 2) return '⚡';
    if (speed >= 1.5) return '🏃‍♂️';
    if (speed >= 1.25) return '🚶‍♂️';
    return '🐌';
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Ring */}
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Progresso do Curso
          </h3>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            {Math.round(progress.completion)}% Concluído
          </Badge>
        </div>

        {/* Animated Progress Ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              
              {/* Progress ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - progress.completion / 100)
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-2xl font-bold text-white"
                >
                  {Math.round(progress.completion)}%
                </motion.div>
                <div className="text-xs text-slate-400">Completo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Aulas</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {progress.lessonsCompleted}
            </div>
            <div className="text-xs text-slate-400">
              de {course.curriculum.reduce((total, module) => total + module.lessons.length, 0)} aulas
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-300">Tempo</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {formatTime(progress.timeSpent)}
            </div>
            <div className="text-xs text-slate-400">estudados</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">Velocidade</span>
            </div>
            <div className="text-lg font-semibold text-white flex items-center gap-1">
              {getSpeedEmoji(progress.averageWatchSpeed)}
              {progress.averageWatchSpeed.toFixed(1)}x
            </div>
            <div className="text-xs text-slate-400">média</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-slate-300">Capítulos</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {progress.chaptersCompleted}
            </div>
            <div className="text-xs text-slate-400">completos</div>
          </motion.div>
        </div>
      </Card>

      {/* Time Estimation Card */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-300">Tempo Restante</div>
              <div className="text-lg font-semibold text-white">{estimatedTimeRemaining}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-300">Ritmo Atual</div>
            <div className="text-sm font-medium text-blue-400">
              {formatTime(progress.timeSpent / (progress.completion / 100) - progress.timeSpent)} restantes
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Progress Bar */}
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white">Meta Semanal</h4>
          <span className="text-sm text-slate-300">
            {formatTime(progress.totalMinutesThisWeek)} / {formatTime(progress.dailyGoal * 7)}
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progress.weeklyProgress} 
            className="h-3 bg-white/10"
          />
          
          {/* Progress percentage overlay */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.weeklyProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getProgressColor(progress.weeklyProgress)}`}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-400">
            {progress.perfectDays} dias perfeitos
          </span>
          <span className="text-xs text-slate-400">
            {Math.round(progress.weeklyProgress)}% da meta
          </span>
        </div>
      </Card>
    </div>
  );
}