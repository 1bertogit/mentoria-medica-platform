import { VideoChapter } from '@/lib/video/chapter-data';

export interface Lesson {
  id?: string;
  title: string;
  description: string;
  type: 'video' | 'ebook' | 'cirurgia';
  locked: boolean;
  videoUrl?: string;
  duration?: string;
  materials?: string[];
  completed?: boolean;
  current?: boolean;
  chapters?: VideoChapter[];
  // Gamification fields
  estimatedDuration?: number; // minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  practicalWeight?: number; // 0-1 for time estimation
  xpReward?: number; // XP points for completion
}

export interface CurriculumModule {
  id?: string;
  title: string;
  lessons: Lesson[];
  status?: 'completed' | 'current' | 'locked' | 'available';
  duration?: string;
}

export interface AcademyCourse {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  modules: string;
  description: string;
  rating: number;
  instructor: string;
  students: number;
  price: string;
  imageUrl: string;
  imageHint: string;
  locked?: boolean;
  videoUrl?: string;
  curriculum: CurriculumModule[];
  productId?: string; // Link com o sistema de produtos
  progress?: number; // Overall course progress percentage
  currentLesson?: {
    moduleId: string;
    lessonId: string;
    moduleTitle: string;
    lessonTitle: string;
  };
}

export interface CourseSection {
  title: string;
  courses: AcademyCourse[];
}

// Curso principal com curriculum completo
export const featuredCourse: AcademyCourse = {
  id: 1,
  title: 'Browlift & EndomidFace',
  category: 'TERÇO SUPERIOR E MÉDIO DA FACE',
  level: 'Em Andamento',
  duration: '44 horas',
  modules: '5 Módulos',
  description:
    'Desvende os segredos das cirurgias com cicatrizes reduzidas e escondidas para rejuvenescimento facial. Pela mesma incisão scarless da Frontoplastia é possível elevar toda a estrutura do terço médio. E por isso, este curso oferece uma abordagem única e exclusiva para aprimorar a beleza e a harmonia facial até mesmo em pacientes jovens.',
  rating: 4.9,
  instructor: 'Dr. Robério Brandão',
  students: 131,
  price: 'R$8.500,00',
  imageUrl: '/images/courses/browlift-endomidface-banner.jpg',
  imageHint: 'Dr. Robério Brandão - Browlift & EndomidFace course banner',
  videoUrl: 'https://www.youtube.com/embed/wgd_hB3P7s0',
  productId: '1', // Conectado com o produto ID 1 do sistema de produtos
  progress: 60, // 60% course completion
  currentLesson: {
    moduleId: 'mod-2',
    lessonId: 'lesson-2-2',
    moduleTitle: 'Técnica Browlift',
    lessonTitle: 'Técnica Endoscópica - Parte 1',
  },
  curriculum: [
    {
      id: 'mod-1',
      title: 'Anatomia e Avaliação',
      status: 'completed',
      duration: '8h 30min',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Marcação e Planejamento',
          description:
            'Técnicas de marcação e planejamento cirúrgico detalhado.',
          type: 'video',
          locked: false,
          videoUrl: '/videos/Live-Roberio.mp4',
          duration: '1h 10min',
          completed: true,
          estimatedDuration: 70,
          difficulty: 'beginner',
          practicalWeight: 0.8,
          xpReward: 140,
        },
      ],
    },
    {
      id: 'mod-2',
      title: 'Técnica Browlift',
      status: 'current',
      duration: '10h 15min',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Marcação e Planejamento',
          description:
            'Técnicas de marcação e planejamento para browlift endoscópico.',
          type: 'video',
          locked: false,
          videoUrl: '/videos/Live-Roberio.mp4',
          duration: '1h 10min',
          completed: true,
          estimatedDuration: 70,
          difficulty: 'intermediate',
          practicalWeight: 0.9,
          xpReward: 150,
        },
        {
          id: 'lesson-2-2',
          title: 'Técnica Endoscópica - Parte 1',
          description: 'Demonstração completa da técnica endoscópica avançada.',
          type: 'video',
          locked: false,
          videoUrl: '/videos/cursos/Browlift-&-EndomidFace/intro.mp4',
          duration: '2h 30min',
          current: true,
          materials: ['Guia Cirúrgico.pdf', 'Checklist Pré-operatório.pdf', 'Vídeo Demonstrativo.mp4', 'Anatomia 3D.pdf', 'Manual Técnico.pdf'],
          estimatedDuration: 150,
          difficulty: 'advanced',
          practicalWeight: 1.0,
          xpReward: 300,
          chapters: [
            {
              id: 'chapter-1',
              title: 'Introdução ao Procedimento',
              startTime: 0,
              endTime: 180,
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
              endTime: 480,
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
              endTime: 780,
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
              endTime: 1320,
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
              endTime: 1920,
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
              endTime: 2400,
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
              endTime: 2640,
              description: 'Fechamento das incisões e cuidados pós-operatórios',
              keyPoints: [
                'Técnica de sutura',
                'Curativo',
                'Orientações pós-operatórias'
              ]
            }
          ]
        },
        {
          id: 'lesson-2-3',
          title: 'Fixação e Suspensão',
          description:
            'Técnicas de fixação e suspensão dos tecidos elevados.',
          type: 'video',
          locked: false,
          duration: '1h 45min',
        },
        {
          id: 'lesson-2-4',
          title: 'Complicações e Manejo',
          description:
            'Prevenção e tratamento de complicações na browlift.',
          type: 'video',
          locked: false,
          duration: '50min',
        },
      ],
    },
    {
      id: 'mod-3',
      title: 'Técnica EndomidFace',
      status: 'available',
      duration: '12h',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Browlift (Frontoplastia) - Visão Direta',
          description:
            'Elevação total da fronte e têmporas, com 5 casos práticos.',
          type: 'video',
          locked: true,
          duration: '2h 30min',
        },
        {
          id: 'lesson-3-2',
          title: 'Endomidface com Ângulo de 30°',
          description:
            'Reposicionamento completo do terço médio, incluindo subperiósteo.',
          type: 'video',
          locked: true,
          duration: '2h 15min',
        },
        {
          id: 'lesson-3-3',
          title: 'Abordagem para Pacientes Jovens',
          description:
            'Adaptações técnicas para pacientes jovens sem cicatrizes.',
          type: 'cirurgia',
          locked: true,
          duration: '1h 45min',
        },
        {
          id: 'lesson-3-4',
          title: 'Incisão Capilar Estratégica',
          description:
            'Marcação de áreas alopécicas e técnicas de dissecção.',
          type: 'video',
          locked: true,
          duration: '1h',
        },
      ],
    },
    {
      id: 'mod-4',
      title: 'Casos Clínicos',
      status: 'locked',
      duration: '8h',
      lessons: [
        {
          id: 'lesson-4-1',
          title: 'Manejo de Complicações',
          description:
            'Prevenção e tratamento de hematomas, cicatrizes e assimetrias.',
          type: 'video',
          locked: true,
          duration: '1h 30min',
        },
        {
          id: 'lesson-4-2',
          title: 'Casos de Revisão',
          description:
            'Análise de casos que necessitaram reintervenção e soluções aplicadas.',
          type: 'cirurgia',
          locked: true,
          duration: '2h',
        },
      ],
    },
    {
      id: 'mod-5',
      title: 'Pós-operatório',
      status: 'locked',
      duration: '5h 30min',
      lessons: [
        {
          id: 'lesson-5-1',
          title: 'Cuidados Pós-operatórios',
          description:
            'Protocolo completo de acompanhamento e recuperação.',
          type: 'ebook',
          locked: true,
          materials: ['Protocolo Pós-Op.pdf', 'Orientações ao Paciente.pdf'],
        },
        {
          id: 'lesson-5-2',
          title: 'Análise de Resultados',
          description:
            'Avaliação de resultados a curto e longo prazo.',
          type: 'video',
          locked: true,
          duration: '1h',
        },
        {
          id: 'lesson-5-3',
          title: 'Marketing e Divulgação',
          description:
            'Como apresentar a técnica aos pacientes e aumentar conversões.',
          type: 'video',
          locked: true,
          duration: '45 min',
        },
      ],
    },
  ],
};

// Apenas uma seção vazia para não quebrar a página
export const courseSections: CourseSection[] = [
  {
    title: 'Outros Cursos',
    courses: [], // Vazio - todos os cursos são gerenciados pelo sistema de produtos
  },
];

// Service functions para gerenciar o curso
export const academyService = {
  // Get course with full curriculum
  async getCourse(id: number): Promise<AcademyCourse | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return id === 1 ? featuredCourse : null;
  },

  // Update course details
  async updateCourse(id: number, data: Partial<AcademyCourse>): Promise<AcademyCourse | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (id === 1) {
      Object.assign(featuredCourse, data);
      return featuredCourse;
    }
    return null;
  },

  // Add new module
  async addModule(courseId: number, module: CurriculumModule): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      module.id = `mod-${Date.now()}`;
      featuredCourse.curriculum.push(module);
      featuredCourse.modules = `${featuredCourse.curriculum.length} Módulos`;
      return true;
    }
    return false;
  },

  // Update module
  async updateModule(courseId: number, moduleId: string, data: Partial<CurriculumModule>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const moduleIndex = featuredCourse.curriculum.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        Object.assign(featuredCourse.curriculum[moduleIndex], data);
        return true;
      }
    }
    return false;
  },

  // Delete module
  async deleteModule(courseId: number, moduleId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const moduleIndex = featuredCourse.curriculum.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        featuredCourse.curriculum.splice(moduleIndex, 1);
        featuredCourse.modules = `${featuredCourse.curriculum.length} Módulos`;
        return true;
      }
    }
    return false;
  },

  // Add lesson to module
  async addLesson(courseId: number, moduleId: string, lesson: Lesson): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const module = featuredCourse.curriculum.find(m => m.id === moduleId);
      if (module) {
        lesson.id = `lesson-${Date.now()}`;
        module.lessons.push(lesson);
        return true;
      }
    }
    return false;
  },

  // Update lesson
  async updateLesson(courseId: number, moduleId: string, lessonId: string, data: Partial<Lesson>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const module = featuredCourse.curriculum.find(m => m.id === moduleId);
      if (module) {
        const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex !== -1) {
          Object.assign(module.lessons[lessonIndex], data);
          return true;
        }
      }
    }
    return false;
  },

  // Delete lesson
  async deleteLesson(courseId: number, moduleId: string, lessonId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const module = featuredCourse.curriculum.find(m => m.id === moduleId);
      if (module) {
        const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex !== -1) {
          module.lessons.splice(lessonIndex, 1);
          return true;
        }
      }
    }
    return false;
  },

  // Reorder modules
  async reorderModules(courseId: number, moduleIds: string[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const newOrder = moduleIds.map(id => 
        featuredCourse.curriculum.find(m => m.id === id)
      ).filter(Boolean) as CurriculumModule[];
      
      if (newOrder.length === featuredCourse.curriculum.length) {
        featuredCourse.curriculum = newOrder;
        return true;
      }
    }
    return false;
  },

  // Reorder lessons within a module
  async reorderLessons(courseId: number, moduleId: string, lessonIds: string[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (courseId === 1) {
      const module = featuredCourse.curriculum.find(m => m.id === moduleId);
      if (module) {
        const newOrder = lessonIds.map(id => 
          module.lessons.find(l => l.id === id)
        ).filter(Boolean) as Lesson[];
        
        if (newOrder.length === module.lessons.length) {
          module.lessons = newOrder;
          return true;
        }
      }
    }
    return false;
  },
};