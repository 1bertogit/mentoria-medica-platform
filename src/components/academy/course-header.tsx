'use client';

import { ArrowLeft, Award, Star, Users, Clock, BookOpen, Flame, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AcademyCourse } from '@/lib/mock-data/academy';
import { ProgressMetrics } from '@/lib/services/gamification-service';
import { motion } from 'motion/react';
import { courseAnimations } from '@/lib/animations/course-animations';
import { ProgressRing } from '@/components/academy/completion-animations';
import Link from 'next/link';

interface CourseHeaderProps {
  course: AcademyCourse;
  progress?: ProgressMetrics;
  streak?: number;
  level?: number;
  xp?: number;
}

export function CourseHeader({ 
  course, 
  progress: gamificationProgress, 
  streak = 0, 
  level = 1, 
  xp = 0 
}: CourseHeaderProps) {
  const progressPercentage = gamificationProgress?.completion || course.progress || 0;
  
  const getStreakEmoji = (streakCount: number) => {
    if (streakCount >= 30) return '🏆';
    if (streakCount >= 14) return '⭐';
    if (streakCount >= 7) return '💪';
    if (streakCount >= 3) return '🔥';
    return '';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-white/10">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button & Course Info */}
          <div className="flex items-center gap-3 md:gap-8 flex-1 min-w-0">
            <Link href="/academy">
              <motion.div
                variants={courseAnimations.button}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 bg-white/10 border-white/20 text-slate-400 hover:bg-white/15 hover:text-white transition-all flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-lg md:text-xl font-semibold text-white mb-1 truncate">
                {course.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>👨‍⚕️</span>
                <span className="truncate">{course.instructor}</span>
              </div>
            </div>
          </div>

          {/* Center - Progress & Gamification */}
          <div className="hidden lg:flex flex-col items-center gap-3">
            {/* Streak Display */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/30"
              >
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-orange-300 font-semibold text-sm">
                  {getStreakEmoji(streak)} {streak} dias seguidos!
                </span>
              </motion.div>
            )}
            
            {/* Progress Bar with Animation */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  Progresso: {Math.round(progressPercentage)}%
                </span>
                
                {/* Level Badge */}
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-2 py-1"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Nível {level}
                </Badge>
              </div>
              
              <div className="w-80 relative">
                {/* Enhanced Progress Ring instead of bar */}
                <div className="flex items-center justify-center">
                  <ProgressRing
                    progress={progressPercentage}
                    size="md"
                    color="url(#progressGradient)"
                    showText={true}
                  />
                </div>
                
                {/* SVG gradients for the progress ring */}
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* XP Display */}
              {xp > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span>{xp.toLocaleString()} XP</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Stats & Actions */}
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            {/* Course Stats */}
            <div className="hidden xl:flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white">{course.students}</span>
                <span>alunos</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white">{course.duration}</span>
                <span>total</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white">{course.rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>

            {/* Certificate Button */}
            <motion.div
              variants={courseAnimations.button}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="sm"
                className={`
                  border-white/20 transition-all flex-shrink-0
                  ${progressPercentage >= 100 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400 text-white hover:from-yellow-600 hover:to-orange-600' 
                    : 'bg-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                  }
                `}
                disabled={progressPercentage < 100}
              >
                <motion.div
                  animate={progressPercentage >= 100 ? {
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Award className="h-4 w-4 md:mr-2" />
                </motion.div>
                <span className="hidden md:inline">
                  {progressPercentage >= 100 ? '🏆 Baixar Certificado' : '🏆 Certificado'}
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}