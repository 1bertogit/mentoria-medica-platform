export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // seconds
  endTime: number;   // seconds
  thumbnail?: string;
  description?: string;
  keyPoints?: string[];
}

export interface VideoData {
  id: string;
  title: string;
  duration: number; // total duration in seconds
  url: string;
  chapters: VideoChapter[];
  thumbnailUrl?: string;
}

// Sample chapter data for the featured course
export const sampleVideoChapters: VideoChapter[] = [
  {
    id: 'chapter-1',
    title: 'Introdução ao Procedimento',
    startTime: 0,
    endTime: 180, // 3 minutes
    description: 'Visão geral do procedimento Browlift & EndomidFace',
    keyPoints: [
      'Objetivos do procedimento',
      'Indicações principais',
      'Contraindicações'
    ]
  },
  {
    id: 'chapter-2',
    title: 'Anatomia Cirúrgica',
    startTime: 180,
    endTime: 480, // 5 minutes more (8 min total)
    description: 'Anatomia detalhada da região frontal e temporal',
    keyPoints: [
      'Estruturas anatômicas importantes',
      'Planos de dissecção',
      'Nervos e vascularização'
    ]
  },
  {
    id: 'chapter-3',
    title: 'Marcação e Planejamento',
    startTime: 480,
    endTime: 780, // 5 minutes more (13 min total)
    description: 'Técnicas de marcação pré-operatória',
    keyPoints: [
      'Pontos de referência',
      'Medidas importantes',
      'Planejamento cirúrgico'
    ]
  },
  {
    id: 'chapter-4',
    title: 'Técnica Cirúrgica - Parte 1',
    startTime: 780,
    endTime: 1320, // 9 minutes more (22 min total)
    description: 'Início do procedimento endoscópico',
    keyPoints: [
      'Incisões iniciais',
      'Inserção do endoscópio',
      'Dissecção inicial'
    ]
  },
  {
    id: 'chapter-5',
    title: 'Técnica Cirúrgica - Parte 2',
    startTime: 1320,
    endTime: 1920, // 10 minutes more (32 min total)
    description: 'Continuação da técnica endoscópica',
    keyPoints: [
      'Dissecção completa',
      'Identificação de estruturas',
      'Liberação de aderências'
    ]
  },
  {
    id: 'chapter-6',
    title: 'Fixação e Suspensão',
    startTime: 1920,
    endTime: 2400, // 8 minutes more (40 min total)
    description: 'Técnicas de fixação dos tecidos elevados',
    keyPoints: [
      'Pontos de fixação',
      'Materiais utilizados',
      'Resultado final'
    ]
  },
  {
    id: 'chapter-7',
    title: 'Fechamento e Cuidados',
    startTime: 2400,
    endTime: 2640, // 4 minutes more (44 min total)
    description: 'Fechamento das incisões e cuidados pós-operatórios',
    keyPoints: [
      'Técnica de sutura',
      'Curativo',
      'Orientações pós-operatórias'
    ]
  }
];

// Helper functions
export const getChapterAtTime = (chapters: VideoChapter[], currentTime: number): VideoChapter | null => {
  return chapters.find(chapter => 
    currentTime >= chapter.startTime && currentTime < chapter.endTime
  ) || null;
};

export const getNextChapter = (chapters: VideoChapter[], currentChapter: VideoChapter): VideoChapter | null => {
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapter.id);
  return currentIndex !== -1 && currentIndex < chapters.length - 1 
    ? chapters[currentIndex + 1] 
    : null;
};

export const getPreviousChapter = (chapters: VideoChapter[], currentChapter: VideoChapter): VideoChapter | null => {
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapter.id);
  return currentIndex > 0 ? chapters[currentIndex - 1] : null;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
};