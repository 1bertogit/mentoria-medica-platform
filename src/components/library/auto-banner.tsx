import type { User } from '@/types';
'use client';

import { useMemo } from 'react';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Eye, 
  Activity,
  Stethoscope,
  Microscope,
  FileText,
  Users,
  FlaskRoundIcon as Flask,
  Sparkles,
  Star,
  Layers,
  Shield,
  Target
} from 'lucide-react';

interface AutoBannerProps {
  title: string;
  specialty: string;
  index: number;
}

// Gradientes predefinidos para diferentes especialidades
const specialtyGradients: { [key: string]: string } = {
  'Rinoplastia': 'from-cyan-600 via-blue-600 to-indigo-700',
  'Mamoplastia': 'from-pink-600 via-purple-600 to-indigo-700',
  'Blefaroplastia': 'from-blue-600 via-purple-600 to-pink-700',
  'Lifting': 'from-orange-600 via-red-600 to-pink-700',
  'Lipoaspiração': 'from-green-600 via-teal-600 to-cyan-700',
  'Abdominoplastia': 'from-amber-600 via-orange-600 to-red-700',
  'Otoplastia': 'from-violet-600 via-purple-600 to-fuchsia-700',
  'Ginecomastia': 'from-slate-600 via-gray-600 to-zinc-700',
  'Outros': 'from-gray-600 via-slate-600 to-indigo-700',
  'default': 'from-indigo-600 via-purple-600 to-pink-700'
};

// Ícones para diferentes especialidades
const specialtyIcons: { [key: string]: React.FC<unknown> } = {
  'Rinoplastia': Eye,
  'Mamoplastia': Heart,
  'Blefaroplastia': Eye,
  'Lifting': Sparkles,
  'Lipoaspiração': Activity,
  'Abdominoplastia': Layers,
  'Otoplastia': Shield,
  'Ginecomastia': Users,
  'default': BookOpen
};

// Padrões geométricos SVG
const patterns = [
  // Padrão de hexágonos
  `<pattern id="hexagons" x="0" y="0" width="40" height="70" patternUnits="userSpaceOnUse">
    <polygon fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" points="20 0, 40 10, 40 30, 20 40, 0 30, 0 10" />
  </pattern>`,
  
  // Padrão de círculos
  `<pattern id="circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    <circle cx="25" cy="25" r="10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  </pattern>`,
  
  // Padrão de linhas diagonais
  `<pattern id="diagonal" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M0,40 L40,0" stroke="rgba(255,255,255,0.07)" stroke-width="1" />
    <path d="M0,20 L20,0" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <path d="M20,40 L40,20" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  </pattern>`,
  
  // Padrão de grade
  `<pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M40,0 L0,0 L0,40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  </pattern>`,
  
  // Padrão de ondas
  `<pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
    <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />
  </pattern>`
];

export function AutoBanner({ title, specialty, index }: AutoBannerProps) {
  const gradient = specialtyGradients[specialty] || specialtyGradients['default'];
  const Icon = specialtyIcons[specialty] || specialtyIcons['default'];
  const patternIndex = index % patterns.length;
  const pattern = patterns[patternIndex];
  
  // Gerar posições aleatórias mas determinísticas baseadas no título
  const floatingElements = useMemo(() => {
    const seed = title.length + index;
    const elements = [];
    const icons = [Brain, Stethoscope, Microscope, Flask, FileText, Target, Star];
    
    for (let i = 0; i < 3; i++) {
      const IconComponent = icons[(seed + i) % icons.length];
      const x = ((seed * (i + 1) * 13) % 80) + 10;
      const y = ((seed * (i + 1) * 17) % 60) + 20;
      const size = 16 + ((seed * (i + 1)) % 8);
      const duration = 15 + ((seed * (i + 1)) % 10);
      const delay = (seed * i) % 5;
      
      elements.push({
        Icon: IconComponent,
        x,
        y,
        size,
        duration,
        delay
      });
    }
    
    return elements;
  }, [title, index]);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl md:h-auto md:w-64 md:rounded-l-2xl md:rounded-tr-none">
      {/* Gradiente de fundo */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      
      {/* Padrão SVG sobreposto */}
      <svg className="absolute inset-0 h-full w-full">
        <defs dangerouslySetInnerHTML={{ __html: pattern }} />
        <rect width="100%" height="100%" fill={`url(#${patternIndex === 0 ? 'hexagons' : patternIndex === 1 ? 'circles' : patternIndex === 2 ? 'diagonal' : patternIndex === 3 ? 'grid' : 'waves'})`} />
      </svg>
      
      {/* Gradiente de overlay para profundidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      
      {/* Elementos flutuantes animados */}
      <div className="absolute inset-0">
        {floatingElements.map((element, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDuration: `${element.duration}s`,
              animationDelay: `${element.delay}s`
            }}
          >
            <element.Icon 
              className="text-white/40" 
              style={{ width: element.size, height: element.size }}
            />
          </div>
        ))}
      </div>
      
      {/* Ícone principal */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-white/20 blur-xl" />
          <Icon className="relative h-16 w-16 text-white/80 md:h-20 md:w-20" />
        </div>
      </div>
      
      {/* Título sobreposto (opcional, para mobile) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:hidden">
        <p className="text-xs font-medium uppercase tracking-wider text-white/80">
          {specialty}
        </p>
      </div>
      
      {/* Efeito de brilho animado */}
      <div className="absolute inset-0 opacity-30">
        <div className="animate-shimmer h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}

// Adicionar as animações CSS necessárias
export const bannerStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(5deg); }
    50% { transform: translateY(5px) rotate(-5deg); }
    75% { transform: translateY(-5px) rotate(3deg); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  
  .animate-float {
    animation: float ease-in-out infinite;
  }
  
  .animate-shimmer {
    animation: shimmer 8s ease-in-out infinite;
  }
`;