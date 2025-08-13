"use client";

import { cn } from "@/lib/utils";

interface GoldenBorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export function GoldenBorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
}: GoldenBorderBeamProps) {
  return (
    <>
      {/* Animated border gradient */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 rounded-[inherit]",
          className
        )}
        style={{
          background: `conic-gradient(from var(--angle) at 50% 50%, transparent 0deg, #D4AF37 20deg, #FFD700 40deg, #D4AF37 60deg, transparent 80deg)`,
          animation: `rotate ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          maskImage: `radial-gradient(circle at center, transparent calc(100% - 2px), black calc(100% - 2px))`,
          WebkitMaskImage: `radial-gradient(circle at center, transparent calc(100% - 2px), black calc(100% - 2px))`,
        }}
      />
      
      {/* CSS for rotation animation */}
      <style jsx>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        
        @keyframes rotate {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </>
  );
}