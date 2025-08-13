'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MinimalCountdownProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function MinimalCountdown({
  targetDate,
  className,
}: MinimalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'dias', shortLabel: 'd', color: 'from-purple-500 to-pink-500' },
    { value: timeLeft.hours, label: 'horas', shortLabel: 'h', color: 'from-cyan-500 to-blue-500' },
    { value: timeLeft.minutes, label: 'min', shortLabel: 'm', color: 'from-green-500 to-emerald-500' },
    { value: timeLeft.seconds, label: 'seg', shortLabel: 's', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex items-center gap-2 sm:gap-3">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="relative group">
              {/* Card do número com gradiente */}
              <div className="relative rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${unit.color} opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-30`} />
                
                {/* Conteúdo */}
                <div className="relative text-center">
                  <div className={`text-xl sm:text-2xl md:text-3xl font-bold tabular-nums bg-gradient-to-br ${unit.color} bg-clip-text text-transparent`}>
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="mt-0.5 text-[10px] sm:text-xs font-medium text-white/70 uppercase tracking-wider">
                    {unit.shortLabel}
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Separador */}
            {index < timeUnits.length - 1 && (
              <div className="mx-1 sm:mx-2 flex flex-col gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
