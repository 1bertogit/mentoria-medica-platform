import { Metadata } from 'next';

// Configurações base de SEO
export const siteConfig = {
  name: 'VisionCare Mentorship',
  title: 'VisionCare Mentorship - Plataforma de Mentoria Médica Premium',
  description: 'Plataforma de mentoria médica premium com análise por IA, casos clínicos, aulas especializadas e biblioteca de conhecimento médico.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://visioncare-mentorship.com',
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://visioncare-mentorship.com'}/images/og-image.png`,
  links: {
    twitter: 'https://twitter.com/visioncare',
    github: 'https://github.com/visioncare-mentorship',
    linkedin: 'https://linkedin.com/company/visioncare-mentorship',
  },
  keywords: [
    'mentoria médica',
    'casos clínicos',
    'educação médica',
    'análise de IA',
    'residência médica',
    'aprendizado médico',
    'plataforma médica',
    'oftalmologia',
    'diagnóstico médico',
    'tecnologia médica'
  ],
  authors: [
    {
      name: 'VisionCare Team',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://visioncare-mentorship.com',
    },
  ],
  creator: 'VisionCare Mentorship',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://visioncare-mentorship.com'),
};

// Função para gerar metadata dinâmica
export function generateSEOMetadata({
  title,
  description,
  path = '',
  image,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: Array<{ name: string; url?: string }>;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const allKeywords = [...siteConfig.keywords, ...keywords];
  const pageAuthors = authors || siteConfig.authors;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords.join(', '),
    authors: pageAuthors,
    creator: siteConfig.creator,
    metadataBase: siteConfig.metadataBase,
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type,
      locale: 'pt_BR',
      url,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: pageAuthors.map(author => author.name),
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
      creator: '@visioncare',
      site: '@visioncare',
    },

    // Additional metadata
    alternates: {
      canonical: url,
    },

    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/site.webmanifest',

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },

    // Other
    category: 'Medical Education',
  };
}

// SEO específico para diferentes tipos de página
export const SEOTemplates = {
  // Página inicial
  home: (): Metadata => generateSEOMetadata({
    title: 'Início',
    description: 'Bem-vindo à VisionCare Mentorship - sua plataforma de mentoria médica premium com tecnologia de IA.',
    keywords: ['mentoria médica', 'plataforma médica', 'tecnologia em saúde', 'educação médica'],
  }),

  // Dashboard
  dashboard: (): Metadata => generateSEOMetadata({
    title: 'Dashboard',
    description: 'Acompanhe seu progresso na mentoria médica com estatísticas personalizadas e conteúdo recomendado.',
    keywords: ['dashboard médico', 'progresso mentoria', 'estatísticas médicas'],
    noIndex: true, // Dashboard é privado
  }),

  // Academy (listagem)
  academy: (): Metadata => generateSEOMetadata({
    title: 'Academy - Cursos e Especializações',
    description: 'Explore nossa academia médica com cursos especializados, aulas práticas e certificações profissionais.',
    keywords: ['cursos médicos', 'especialização médica', 'certificação médica', 'academy médica'],
  }),

  // Academy (curso específico)
  academyCourse: ({ title, description, specialty }: { title: string; description?: string; specialty?: string }): Metadata => generateSEOMetadata({
    title: `${title} - Academy`,
    description: description || `Curso de ${title} na VisionCare Academy - aprendizado prático e teórico com mentores especialistas.`,
    keywords: ['curso médico', specialty || 'medicina', 'educação continuada', 'certificação'].filter(Boolean),
    type: 'article',
  }),

  // Cases (listagem)
  cases: (): Metadata => generateSEOMetadata({
    title: 'Casos Clínicos',
    description: 'Explore casos clínicos reais com análise por IA, discussões e aprendizado colaborativo.',
    keywords: ['casos clínicos', 'diagnóstico médico', 'análise clínica', 'medicina prática'],
  }),

  // Case específico
  case: ({ title, specialty, description }: { title: string; specialty?: string; description?: string }): Metadata => generateSEOMetadata({
    title: `${title} - Caso Clínico`,
    description: description || `Caso clínico: ${title}. Análise detalhada com IA e discussão colaborativa.`,
    keywords: ['caso clínico', specialty || 'medicina', 'diagnóstico', 'análise médica'].filter(Boolean),
    type: 'article',
  }),

  // Classes (listagem)
  classes: (): Metadata => generateSEOMetadata({
    title: 'Aulas e Conteúdos',
    description: 'Aulas especializadas com professores renomados, conteúdo atualizado e metodologia inovadora.',
    keywords: ['aulas médicas', 'educação médica', 'conteúdo especializado', 'professores médicos'],
  }),

  // Class específica
  class: ({ title, instructor, description }: { title: string; instructor?: string; description?: string }): Metadata => generateSEOMetadata({
    title: `${title} - Aula`,
    description: description || `Aula: ${title}${instructor ? ` com ${instructor}` : ''}. Conteúdo médico especializado.`,
    keywords: ['aula médica', 'educação médica', 'conteúdo especializado', instructor || 'professor'].filter(Boolean),
    type: 'article',
  }),

  // Library (listagem)
  library: (): Metadata => generateSEOMetadata({
    title: 'Biblioteca Médica',
    description: 'Acesse nossa extensa biblioteca médica com artigos, pesquisas e referências atualizadas.',
    keywords: ['biblioteca médica', 'artigos médicos', 'pesquisa médica', 'referências médicas'],
  }),

  // Library item
  libraryItem: ({ title, author, description }: { title: string; author?: string; description?: string }): Metadata => generateSEOMetadata({
    title: `${title} - Biblioteca`,
    description: description || `${title}${author ? ` por ${author}` : ''} - Material de referência da biblioteca médica.`,
    keywords: ['artigo médico', 'referência médica', 'pesquisa', author || 'literatura médica'].filter(Boolean),
    type: 'article',
  }),

  // Archive (listagem)
  archive: (): Metadata => generateSEOMetadata({
    title: 'Arquivo Médico',
    description: 'Explore nosso arquivo histórico com casos, pesquisas e materiais médicos relevantes.',
    keywords: ['arquivo médico', 'histórico médico', 'casos antigos', 'pesquisa histórica'],
  }),

  // Archive item
  archiveItem: ({ title, date, description }: { title: string; date?: string; description?: string }): Metadata => generateSEOMetadata({
    title: `${title} - Arquivo`,
    description: description || `${title}${date ? ` de ${date}` : ''} - Material do arquivo médico histórico.`,
    keywords: ['arquivo médico', 'histórico', 'material médico', 'pesquisa'],
    type: 'article',
  }),

  // Admin pages (todas com noIndex)
  admin: (title: string): Metadata => generateSEOMetadata({
    title: `Admin - ${title}`,
    description: 'Área administrativa da VisionCare Mentorship.',
    noIndex: true,
  }),

  // Settings
  settings: (): Metadata => generateSEOMetadata({
    title: 'Configurações',
    description: 'Gerencie suas preferências e configurações da conta.',
    noIndex: true,
  }),

  // Calendar
  calendar: (): Metadata => generateSEOMetadata({
    title: 'Calendário',
    description: 'Acompanhe seus eventos, aulas e compromissos médicos.',
    keywords: ['calendário médico', 'agenda médica', 'eventos médicos'],
    noIndex: true,
  }),

  // Error pages
  notFound: (): Metadata => generateSEOMetadata({
    title: 'Página não encontrada',
    description: 'A página que você está procurando não foi encontrada.',
    noIndex: true,
  }),

  error: (): Metadata => generateSEOMetadata({
    title: 'Erro',
    description: 'Ocorreu um erro inesperado. Tente novamente.',
    noIndex: true,
  }),
};

// JSON-LD Structured Data
export const generateStructuredData = {
  // Organization
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
      siteConfig.links.github,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Portuguese', 'English'],
    },
  }),

  // Medical Article
  medicalArticle: ({
    title,
    description,
    author,
    datePublished,
    dateModified,
    url,
    image,
  }: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    url: string;
    image?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'MedicalScholarlyArticle',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    url,
    image: image || siteConfig.ogImage,
    isAccessibleForFree: false,
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Medical professionals',
    },
  }),

  // Course
  course: ({
    title,
    description,
    instructor,
    duration,
    url,
  }: {
    title: string;
    description: string;
    instructor: string;
    duration?: string;
    url: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    instructor: {
      '@type': 'Person',
      name: instructor,
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
    timeRequired: duration,
    educationalLevel: 'Advanced',
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Medical professionals',
    },
  }),

  // FAQ Page
  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  // Medical Case Study
  caseStudy: ({
    title,
    description,
    author,
    datePublished,
    url,
    specialty,
  }: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    url: string;
    specialty?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'MedicalScholarlyArticle',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    datePublished,
    url,
    about: specialty ? {
      '@type': 'MedicalSpecialty',
      name: specialty,
    } : undefined,
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Medical professionals',
    },
  }),
};

export default SEOTemplates;