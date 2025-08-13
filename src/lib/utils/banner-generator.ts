// Utility to generate automatic banners for medical cases
export interface BannerConfig {
  title: string;
  doctor: string;
  caseType: string;
  age?: string;
  colors: [string, string]; // [primary, secondary]
}

const CASE_BANNERS: Record<string, BannerConfig> = {
  'caso-teka-brandao': {
    title: 'Caso Teka Brandão',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Individualização',
    colors: ['#8B5CF6', '#3B82F6'], // purple to blue
  },
  'caso-idosa-75anos': {
    title: 'Deep Neck Paciente Idosa',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Procedimento Extenso',
    age: '75 anos',
    colors: ['#10B981', '#059669'], // green to emerald
  },
  'caso-septuagenaria-74anos': {
    title: 'Técnica Simplificada',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Abordagem Simples',
    age: '74 anos',
    colors: ['#F59E0B', '#D97706'], // orange to amber
  },
  'caso-jovem-41anos': {
    title: 'Abordagem Conservadora',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Paciente Jovem',
    age: '41 anos',
    colors: ['#06B6D4', '#0891B2'], // cyan to teal
  },
  'caso-bonus-retoque': {
    title: 'Retoque Cirúrgico',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Correção Assimetria',
    colors: ['#EC4899', '#DB2777'], // pink to rose
  },
  'caso-meia-idade-43anos': {
    title: 'Procedimento Combinado',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Face + Nariz',
    age: '43 anos',
    colors: ['#6366F1', '#4F46E5'], // indigo to violet
  },
  'caso-idosa-recente-75anos': {
    title: 'Procedimento Extenso',
    doctor: 'Dr. Robério Brandão',
    caseType: 'Com Enxertos',
    age: '75 anos',
    colors: ['#EF4444', '#EC4899'], // red to pink
  },
  'caso-complicacao-deyse': {
    title: 'Casos de Complicação',
    doctor: 'Dra. Deyse Oliveira',
    caseType: 'Manejo Pós-Op',
    colors: ['#F59E0B', '#EA580C'], // yellow to orange
  },
  'caso-primeiro-renato': {
    title: 'Primeiro Deep Neck',
    doctor: 'Dr. Renato Mello',
    caseType: 'Experiência Aprendizado',
    colors: ['#64748B', '#3B82F6'], // slate to blue
  },
};

export function generateBannerSVG(caseId: string): string {
  const config = CASE_BANNERS[caseId];
  
  if (!config) {
    return 'https://placehold.co/600x400/8B5CF6/FFFFFF?text=Caso+Clínico';
  }

  const { title, doctor, caseType, age, colors } = config;
  const [primary, secondary] = colors;
  
  // Generate unique IDs to avoid conflicts
  const gradientId = `grad-${caseId}`;
  const circleGradientId = `circle-${caseId}`;
  const patternId = `pattern-${caseId}`;

  const svg = `
    <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
        </linearGradient>
        
        <radialGradient id="${circleGradientId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
        </radialGradient>

        <pattern id="${patternId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#${gradientId})"/>
      
      <!-- Pattern overlay -->
      <rect width="100%" height="100%" fill="url(#${patternId})" opacity="0.3"/>
      
      <!-- Decorative circles -->
      <circle cx="120" cy="80" r="60" fill="url(#${circleGradientId})" opacity="0.6"/>
      <circle cx="480" cy="320" r="80" fill="url(#${circleGradientId})" opacity="0.4"/>
      <circle cx="520" cy="100" r="40" fill="rgba(255,255,255,0.1)" opacity="0.5"/>
      
      <!-- Medical cross icon -->
      <g transform="translate(50, 50)">
        <rect x="15" y="5" width="6" height="26" fill="rgba(255,255,255,0.8)" rx="3"/>
        <rect x="5" y="15" width="26" height="6" fill="rgba(255,255,255,0.8)" rx="3"/>
      </g>

      ${age ? `
      <!-- Age indicator -->
      <g transform="translate(520, 50)">
        <rect x="0" y="0" width="60" height="30" fill="rgba(0,0,0,0.3)" rx="15"/>
        <text x="30" y="20" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="bold">${age}</text>
      </g>
      ` : ''}

      <!-- Bottom overlay for text contrast -->
      <rect x="0" y="260" width="100%" height="140" fill="url(#${gradientId})" opacity="0.8"/>
      
      <!-- Title -->
      <g transform="translate(30, 290)">
        <text x="0" y="0" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold">${title.length > 25 ? title.substring(0, 22) + '...' : title}</text>
      </g>

      <!-- Doctor name -->
      <g transform="translate(30, 355)">
        <text x="0" y="0" fill="rgba(255,255,255,0.9)" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500">${doctor}</text>
      </g>

      <!-- Case type badge -->
      <g transform="translate(30, 320)">
        <rect x="0" y="0" width="${Math.max(caseType.length * 8 + 20, 120)}" height="25" fill="rgba(0,0,0,0.4)" rx="12"/>
        <text x="${Math.max(caseType.length * 4 + 10, 60)}" y="17" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600">${caseType}</text>
      </g>
    </svg>
  `;

  // Return as data URL
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getCaseBanner(caseId: string): string {
  return generateBannerSVG(caseId);
}