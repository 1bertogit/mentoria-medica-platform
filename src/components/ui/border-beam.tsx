"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderRadius?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  reverse?: boolean;
  initialOffset?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  borderRadius = 8,
  borderWidth = 1.5,
  colorFrom = "#ffffff",
  colorTo = "#ffffff",
  delay = 0,
  reverse = false,
  initialOffset = 0,
}: BorderBeamProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @property --border-angle {
              syntax: "<angle>";
              inherits: false;
              initial-value: ${initialOffset}deg;
            }

            @keyframes border-beam-spin {
              from {
                --border-angle: ${initialOffset}deg;
              }
              to {
                --border-angle: ${initialOffset + 360}deg;
              }
            }

            @keyframes border-beam-spin-reverse {
              from {
                --border-angle: ${initialOffset}deg;
              }
              to {
                --border-angle: ${initialOffset - 360}deg;
              }
            }

            .border-beam {
              position: absolute;
              inset: 0;
              border-radius: ${borderRadius}px;
              padding: ${borderWidth}px;
              background: linear-gradient(
                to right,
                ${colorFrom},
                ${colorTo},
                ${colorFrom}
              );
              -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: 0;
              animation: border-beam-fade 1s ease-out forwards;
              animation-delay: ${delay}s;
            }

            @keyframes border-beam-fade {
              to {
                opacity: 1;
              }
            }

            .border-beam::before {
              content: '';
              position: absolute;
              inset: 0;
              background: conic-gradient(
                from var(--border-angle) at 50% 50%,
                transparent 0deg,
                ${colorFrom}20 10deg,
                ${colorFrom}40 20deg,
                ${colorFrom}80 30deg,
                ${colorFrom} 40deg,
                ${colorTo} 50deg,
                ${colorFrom} 60deg,
                ${colorFrom}80 70deg,
                ${colorFrom}40 80deg,
                ${colorFrom}20 90deg,
                transparent 100deg,
                transparent 260deg,
                ${colorFrom}20 270deg,
                ${colorFrom}40 280deg,
                ${colorFrom}80 290deg,
                ${colorFrom} 300deg,
                ${colorTo} 310deg,
                ${colorFrom} 320deg,
                ${colorFrom}80 330deg,
                ${colorFrom}40 340deg,
                ${colorFrom}20 350deg,
                transparent 360deg
              );
              border-radius: ${borderRadius}px;
              mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              padding: ${borderWidth}px;
              animation: ${reverse ? 'border-beam-spin-reverse' : 'border-beam-spin'} ${duration}s linear infinite;
              animation-delay: ${delay}s;
            }

            .border-beam-shimmer {
              position: absolute;
              inset: -${borderWidth}px;
              border-radius: ${borderRadius}px;
              background: linear-gradient(
                105deg,
                transparent 40%,
                ${colorFrom}60 50%,
                transparent 60%
              );
              background-size: 200% 100%;
              animation: shimmer ${duration / 2}s linear infinite ${reverse ? 'reverse' : 'normal'};
              animation-delay: ${delay}s;
              pointer-events: none;
              opacity: 0;
              mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              padding: ${borderWidth}px;
            }

            @keyframes shimmer {
              0% {
                background-position: 200% 50%;
                opacity: 0;
              }
              50% {
                background-position: 50% 50%;
                opacity: 0.5;
              }
              100% {
                background-position: -100% 50%;
                opacity: 0;
              }
            }
          `,
        }}
      />
      <div
        className={cn(
          "border-beam pointer-events-none absolute inset-0 z-10",
          className
        )}
        aria-hidden="true"
      />
      <div
        className="border-beam-shimmer pointer-events-none absolute inset-0 z-10"
        aria-hidden="true"
      />
    </>
  );
}