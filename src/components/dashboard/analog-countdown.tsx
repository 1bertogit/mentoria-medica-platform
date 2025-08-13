'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnalogCountdownProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function AnalogCountdown({ targetDate, className }: AnalogCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Calculate progress percentages
  const dayProgress = timeLeft.days > 0 ? Math.min((30 - timeLeft.days) / 30, 1) : 1;
  const hourProgress = (24 - timeLeft.hours) / 24;
  const minuteProgress = (60 - timeLeft.minutes) / 60;
  const secondProgress = (60 - timeLeft.seconds) / 60;

  return (
    <div className={cn("relative", className)}>
      <div className="relative w-48 h-48 mx-auto">
        {/* Background circles */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Days circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-300 dark:text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${dayProgress * 552.9} 552.9`}
            className="text-cyan-500 transition-all duration-1000"
          />
          
          {/* Hours circle */}
          <circle
            cx="96"
            cy="96"
            r="72"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-300 dark:text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r="72"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${hourProgress * 452.4} 452.4`}
            className="text-purple-500 transition-all duration-1000"
          />
          
          {/* Minutes circle */}
          <circle
            cx="96"
            cy="96"
            r="56"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-300 dark:text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r="56"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${minuteProgress * 351.9} 351.9`}
            className="text-pink-500 transition-all duration-1000"
          />
          
          {/* Seconds circle */}
          <circle
            cx="96"
            cy="96"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-300 dark:text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${secondProgress * 251.3} 251.3`}
            className="text-yellow-500 transition-all duration-200"
          />
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {String(timeLeft.days).padStart(2, '0')}d
            </div>
            <div className="text-sm text-gray-700 dark:text-white/70">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Hover tooltip */}
        <div className="absolute inset-0 group">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-white/20 rounded-lg p-3 text-xs text-gray-900 dark:text-white/90 whitespace-nowrap shadow-xl">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-bold text-cyan-400">{timeLeft.days}</div>
                <div className="text-gray-600 dark:text-white/60">dias</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-400">{timeLeft.hours}</div>
                <div className="text-gray-600 dark:text-white/60">horas</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-pink-400">{timeLeft.minutes}</div>
                <div className="text-gray-600 dark:text-white/60">min</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-400">{timeLeft.seconds}</div>
                <div className="text-gray-600 dark:text-white/60">seg</div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span className="text-gray-600 dark:text-white/60">Dias</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-600 dark:text-white/60">Horas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span className="text-gray-600 dark:text-white/60">Minutos</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600 dark:text-white/60">Segundos</span>
        </div>
      </div>
    </div>
  );
}