'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Target, Crown, Zap, Award, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface CelebrationProps {
  isVisible: boolean;
  type: 'lesson' | 'module' | 'course' | 'achievement' | 'streak' | 'level_up';
  title: string;
  subtitle?: string;
  icon?: string;
  xpGained?: number;
  newLevel?: number;
  onClose: () => void;
  onShare?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

export function CompletionCelebrations({
  isVisible,
  type,
  title,
  subtitle,
  icon,
  xpGained,
  newLevel,
  onClose,
  onShare
}: CelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const celebrationConfig = {
    lesson: {
      primaryColor: 'from-green-400 to-emerald-600',
      icon: CheckCircle,
      emoji: '✅',
      bgGlow: 'from-green-500/20 to-emerald-500/20',
      confettiColors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
    },
    module: {
      primaryColor: 'from-blue-400 to-cyan-600',
      icon: Target,
      emoji: '🎯',
      bgGlow: 'from-blue-500/20 to-cyan-500/20',
      confettiColors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']
    },
    course: {
      primaryColor: 'from-yellow-400 to-orange-600',
      icon: Crown,
      emoji: '👑',
      bgGlow: 'from-yellow-500/20 to-orange-500/20',
      confettiColors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a']
    },
    achievement: {
      primaryColor: 'from-purple-400 to-pink-600',
      icon: Trophy,
      emoji: '🏆',
      bgGlow: 'from-purple-500/20 to-pink-500/20',
      confettiColors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff']
    },
    streak: {
      primaryColor: 'from-orange-400 to-red-600',
      icon: Zap,
      emoji: '🔥',
      bgGlow: 'from-orange-500/20 to-red-500/20',
      confettiColors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa']
    },
    level_up: {
      primaryColor: 'from-yellow-400 via-purple-500 to-blue-600',
      icon: Star,
      emoji: '⭐',
      bgGlow: 'from-yellow-500/20 via-purple-500/20 to-blue-500/20',
      confettiColors: ['#eab308', '#8b5cf6', '#3b82f6', '#06b6d4']
    }
  };

  const config = celebrationConfig[type];
  const IconComponent = config.icon;

  // Generate confetti when celebration becomes visible
  useEffect(() => {
    if (isVisible) {
      const pieces: ConfettiPiece[] = [];
      const pieceCount = type === 'course' ? 100 : type === 'module' ? 60 : 40;
      
      for (let i = 0; i < pieceCount; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          color: config.confettiColors[Math.floor(Math.random() * config.confettiColors.length)],
          delay: Math.random() * 2
        });
      }
      
      setConfetti(pieces);
      setShowDetails(false);
      
      // Show details after initial animation
      setTimeout(() => setShowDetails(true), 1000);
      
      // Auto-close after delay (except for course completion)
      if (type !== 'course') {
        setTimeout(onClose, type === 'achievement' ? 8000 : 6000);
      }
    }
  }, [isVisible, type, onClose]);

  const getCelebrationMessage = () => {
    switch (type) {
      case 'lesson':
        return {
          primary: 'Aula Concluída!',
          secondary: 'Excelente progresso! Continue assim.'
        };
      case 'module':
        return {
          primary: 'Módulo Concluído!',
          secondary: 'Você dominou mais uma área do conhecimento!'
        };
      case 'course':
        return {
          primary: 'Parabéns, Dr(a)!',
          secondary: 'Você concluiu sua especialização com sucesso!'
        };
      case 'achievement':
        return {
          primary: 'Conquista Desbloqueada!',
          secondary: 'Sua dedicação está sendo recompensada!'
        };
      case 'streak':
        return {
          primary: 'Sequência Incrível!',
          secondary: 'Sua consistência é impressionante!'
        };
      case 'level_up':
        return {
          primary: `Nível ${newLevel}!`,
          secondary: 'Você subiu de nível! Continue evoluindo!'
        };
      default:
        return {
          primary: title,
          secondary: subtitle
        };
    }
  };

  const messages = getCelebrationMessage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Confetti Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ 
                  x: `${piece.x}vw`, 
                  y: '-10vh',
                  opacity: 0,
                  rotate: piece.rotation
                }}
                animate={{ 
                  x: `${piece.x + (Math.random() - 0.5) * 30}vw`,
                  y: '110vh',
                  opacity: [0, 1, 1, 0],
                  rotate: piece.rotation + 720
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: piece.delay,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 rounded"
                style={{ backgroundColor: piece.color }}
              />
            ))}
          </div>

          {/* Main Celebration Card */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <Card className={`
              p-8 max-w-md mx-4 bg-white/10 backdrop-blur-md border-white/20 relative overflow-hidden
              shadow-2xl
            `}>
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGlow}`} />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Main Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    damping: 12, 
                    stiffness: 200,
                    delay: 0.2 
                  }}
                  className={`
                    w-20 h-20 mx-auto mb-6 rounded-full 
                    bg-gradient-to-br ${config.primaryColor} 
                    flex items-center justify-center shadow-lg
                  `}
                >
                  {icon ? (
                    <span className="text-4xl">{icon}</span>
                  ) : (
                    <IconComponent className="h-10 w-10 text-white" />
                  )}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {messages.primary}
                </motion.h2>

                {/* Custom Title if provided */}
                {title && title !== messages.primary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg font-semibold text-blue-300 mb-2"
                  >
                    {title}
                  </motion.div>
                )}

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-slate-300 mb-6"
                >
                  {subtitle || messages.secondary}
                </motion.p>

                {/* XP and Level Information */}
                <AnimatePresence>
                  {showDetails && (xpGained || newLevel) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mb-6 space-y-2"
                    >
                      {xpGained && (
                        <div className="flex items-center justify-center gap-2">
                          <Award className="h-5 w-5 text-yellow-400" />
                          <span className="text-yellow-300 font-semibold">
                            +{xpGained} XP Ganhos!
                          </span>
                        </div>
                      )}
                      
                      {newLevel && (
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-5 w-5 text-purple-400" />
                          <span className="text-purple-300 font-semibold">
                            Nível {newLevel} Alcançado!
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex gap-3 justify-center"
                >
                  {type === 'course' && onShare && (
                    <Button
                      onClick={onShare}
                      className={`bg-gradient-to-r ${config.primaryColor} text-white border-0 hover:opacity-90`}
                    >
                      🎉 Compartilhar
                    </Button>
                  )}
                  
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {type === 'course' ? 'Continuar' : 'Fechar'}
                  </Button>
                </motion.div>

                {/* Progress Indicator for Course Completion */}
                {type === 'course' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-6 text-center"
                  >
                    <div className="text-sm text-slate-400 mb-2">
                      Certificado disponível
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">
                        Acesse seu perfil para baixar
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing celebrations
export function useCelebrations() {
  const [currentCelebration, setCurrentCelebration] = useState<{
    type: CelebrationProps['type'];
    title: string;
    subtitle?: string;
    icon?: string;
    xpGained?: number;
    newLevel?: number;
  } | null>(null);

  const showCelebration = (
    type: CelebrationProps['type'],
    title: string,
    options?: {
      subtitle?: string;
      icon?: string;
      xpGained?: number;
      newLevel?: number;
    }
  ) => {
    setCurrentCelebration({
      type,
      title,
      ...options
    });
  };

  const hideCelebration = () => {
    setCurrentCelebration(null);
  };

  const CelebrationComponent = currentCelebration ? (
    <CompletionCelebrations
      isVisible={!!currentCelebration}
      type={currentCelebration.type}
      title={currentCelebration.title}
      subtitle={currentCelebration.subtitle}
      icon={currentCelebration.icon}
      xpGained={currentCelebration.xpGained}
      newLevel={currentCelebration.newLevel}
      onClose={hideCelebration}
      onShare={() => {
        // Implement sharing logic
        console.log('Sharing achievement...');
      }}
    />
  ) : null;

  return {
    showCelebration,
    hideCelebration,
    CelebrationComponent,
    isShowingCelebration: !!currentCelebration
  };
}