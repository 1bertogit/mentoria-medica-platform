'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date | string;
  className?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({
  targetDate,
  className = '',
  onComplete,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
        onComplete?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (isComplete) {
    return (
      <div
        className={`flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm ${className}`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">🎉</div>
          <div className="mt-0.5 text-xs font-medium text-white/70">
            Concluído!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm ${className}`}
    >
      {/* Days */}
      <div className="flex items-center">
        <div className="text-center">
          <div className="relative">
            <div className="text-2xl font-bold tabular-nums tracking-tight text-white">
              {formatNumber(timeLeft.days)}
            </div>
            <div className="mt-0.5 text-xs font-medium text-white/50">d</div>
          </div>
        </div>
        <div className="mx-3 text-lg font-light text-white/30">:</div>
      </div>

      {/* Hours */}
      <div className="flex items-center">
        <div className="text-center">
          <div className="relative">
            <div className="text-2xl font-bold tabular-nums tracking-tight text-white">
              {formatNumber(timeLeft.hours)}
            </div>
            <div className="mt-0.5 text-xs font-medium text-white/50">h</div>
          </div>
        </div>
        <div className="mx-3 text-lg font-light text-white/30">:</div>
      </div>

      {/* Minutes */}
      <div className="flex items-center">
        <div className="text-center">
          <div className="relative">
            <div className="text-2xl font-bold tabular-nums tracking-tight text-white">
              {formatNumber(timeLeft.minutes)}
            </div>
            <div className="mt-0.5 text-xs font-medium text-white/50">m</div>
          </div>
        </div>
        <div className="mx-3 text-lg font-light text-white/30">:</div>
      </div>

      {/* Seconds */}
      <div className="flex items-center">
        <div className="text-center">
          <div className="relative">
            <div className="text-2xl font-bold tabular-nums tracking-tight text-white">
              {formatNumber(timeLeft.seconds)}
            </div>
            <div className="mt-0.5 text-xs font-medium text-white/50">s</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Variante compacta do countdown
export function CountdownCompact({
  targetDate,
  className = '',
  onComplete,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
        onComplete?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm ${className}`}
      >
        <span className="text-sm font-medium text-white">🎉 Concluído!</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm ${className}`}
    >
      <span className="font-mono text-sm font-bold text-white">
        {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}h{' '}
        {timeLeft.minutes.toString().padStart(2, '0')}m{' '}
        {timeLeft.seconds.toString().padStart(2, '0')}s
      </span>
    </div>
  );
}

// Hook para usar countdown em qualquer lugar
export function useCountdown(targetDate: Date | string) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isComplete };
}
