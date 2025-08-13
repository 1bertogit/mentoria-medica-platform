'use client';

import React from 'react';

interface CaseBannerProps {
  title: string;
  doctor: string;
  caseType: string;
  age?: string;
  gradient?: string;
  width?: number;
  height?: number;
}

export function CaseBanner({ 
  title, 
  doctor, 
  caseType, 
  age,
  gradient = 'from-purple-600 to-blue-600',
  width = 600, 
  height = 400 
}: CaseBannerProps) {
  
  // Create unique ID for gradients
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const circleGradientId = `circle-${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract gradient colors
  const gradientColors = gradient.includes('purple') ? ['#8B5CF6', '#3B82F6'] :
                        gradient.includes('green') ? ['#10B981', '#059669'] :
                        gradient.includes('orange') ? ['#F59E0B', '#D97706'] :
                        gradient.includes('red') ? ['#EF4444', '#DC2626'] :
                        gradient.includes('cyan') ? ['#06B6D4', '#0891B2'] :
                        gradient.includes('pink') ? ['#EC4899', '#DB2777'] :
                        gradient.includes('indigo') ? ['#6366F1', '#4F46E5'] :
                        ['#8B5CF6', '#3B82F6']; // default purple to blue

  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Main gradient -->
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradientColors[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradientColors[1]};stop-opacity:1" />
        </linearGradient>
        
        <!-- Circle gradient -->
        <radialGradient id="${circleGradientId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
        </radialGradient>

        <!-- Pattern -->
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#${gradientId})"/>
      
      <!-- Pattern overlay -->
      <rect width="100%" height="100%" fill="url(#pattern)" opacity="0.3"/>
      
      <!-- Decorative circles -->
      <circle cx="120" cy="80" r="60" fill="url(#${circleGradientId})" opacity="0.6"/>
      <circle cx="480" cy="320" r="80" fill="url(#${circleGradientId})" opacity="0.4"/>
      <circle cx="520" cy="100" r="40" fill="rgba(255,255,255,0.1)" opacity="0.5"/>
      
      <!-- Medical cross icon -->
      <g transform="translate(50, 50)">
        <rect x="15" y="5" width="6" height="26" fill="rgba(255,255,255,0.8)" rx="3"/>
        <rect x="5" y="15" width="26" height="6" fill="rgba(255,255,255,0.8)" rx="3"/>
      </g>

      <!-- Age indicator if provided -->
      ${age ? `
      <g transform="translate(520, 50)">
        <rect x="0" y="0" width="60" height="30" fill="rgba(0,0,0,0.3)" rx="15"/>
        <text x="30" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${age}</text>
      </g>
      ` : ''}

      <!-- Case type badge -->
      <g transform="translate(20, ${height - 80})">
        <rect x="0" y="0" width="160" height="25" fill="rgba(0,0,0,0.4)" rx="12"/>
        <text x="80" y="17" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="600">${caseType}</text>
      </g>

      <!-- Title -->
      <g transform="translate(30, ${height - 120})">
        <text x="0" y="0" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
          ${title.length > 35 ? title.substring(0, 32) + '...' : title}
        </text>
      </g>

      <!-- Doctor name -->
      <g transform="translate(30, ${height - 45})">
        <text x="0" y="0" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="16" font-weight="500">
          ${doctor}
        </text>
      </g>

      <!-- Overlay for better text contrast -->
      <rect x="0" y="${height - 140}" width="100%" height="140" fill="url(#${gradientId})" opacity="0.8"/>
      
      <!-- Re-render text over overlay -->
      <g transform="translate(30, ${height - 120})">
        <text x="0" y="0" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
          ${title.length > 35 ? title.substring(0, 32) + '...' : title}
        </text>
      </g>

      <g transform="translate(30, ${height - 45})">
        <text x="0" y="0" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="16" font-weight="500">
          ${doctor}
        </text>
      </g>

      <g transform="translate(20, ${height - 80})">
        <rect x="0" y="0" width="160" height="25" fill="rgba(0,0,0,0.4)" rx="12"/>
        <text x="80" y="17" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="600">${caseType}</text>
      </g>
    </svg>
  `;

  return svgContent;
}

// Generate banner for each case
export function generateCaseBanners() {
  const cases = [
    {
      id: 'caso-teka-brandao',
      title: 'Caso Teka Brandão',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Individualização',
      gradient: 'from-purple-600 to-blue-600',
    },
    {
      id: 'caso-idosa-75anos',
      title: 'Deep Neck Paciente Idosa',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Procedimento Extenso',
      age: '75 anos',
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      id: 'caso-septuagenaria-74anos',
      title: 'Técnica Simplificada',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Abordagem Simples',
      age: '74 anos',
      gradient: 'from-orange-600 to-amber-600',
    },
    {
      id: 'caso-jovem-41anos',
      title: 'Abordagem Conservadora',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Paciente Jovem',
      age: '41 anos',
      gradient: 'from-cyan-600 to-teal-600',
    },
    {
      id: 'caso-bonus-retoque',
      title: 'Retoque Cirúrgico',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Correção Assimetria',
      gradient: 'from-pink-600 to-rose-600',
    },
    {
      id: 'caso-meia-idade-43anos',
      title: 'Procedimento Combinado',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Face + Nariz',
      age: '43 anos',
      gradient: 'from-indigo-600 to-violet-600',
    },
    {
      id: 'caso-idosa-recente-75anos',
      title: 'Procedimento Extenso',
      doctor: 'Dr. Robério Brandão',
      caseType: 'Com Enxertos',
      age: '75 anos',
      gradient: 'from-red-600 to-pink-600',
    },
    {
      id: 'caso-complicacao-deyse',
      title: 'Casos de Complicação',
      doctor: 'Dra. Deyse Oliveira',
      caseType: 'Manejo Pós-Op',
      gradient: 'from-yellow-600 to-orange-600',
    },
    {
      id: 'caso-primeiro-renato',
      title: 'Primeiro Deep Neck',
      doctor: 'Dr. Renato Mello',
      caseType: 'Experiência Aprendizado',
      gradient: 'from-slate-600 to-blue-600',
    },
  ];

  const banners: Record<string, string> = {};
  
  cases.forEach(caseData => {
    banners[caseData.id] = CaseBanner({
      title: caseData.title,
      doctor: caseData.doctor,
      caseType: caseData.caseType,
      age: caseData.age,
      gradient: caseData.gradient,
    });
  });

  return banners;
}

// Hook to get banner URL for a case
export function useCaseBanner(caseId: string): string {
  const banners = generateCaseBanners();
  const svgContent = banners[caseId];
  
  if (!svgContent) {
    return 'https://placehold.co/600x400/8B5CF6/FFFFFF?text=Caso+Clínico';
  }
  
  // Convert SVG to data URL
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSvg}`;
}