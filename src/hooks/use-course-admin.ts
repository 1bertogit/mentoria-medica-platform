/**
 * Hook personalizado para administração de cursos
 * Gerencia estado, persistência e operações CRUD dos cursos
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CourseConfig,
  GlobalSettings,
  CategoryTheme,
  defaultGlobalSettings,
  categoryThemes,
} from '@/lib/config/course-config';

// Simulação de dados iniciais (em produção viria de uma API/banco de dados)
const initialCourses: CourseConfig[] = [
  {
    id: 'facelift-advanced',
    title: 'Facelift Avançado',
    subtitle: 'Técnicas modernas de rejuvenescimento facial',
    instructor: 'Dr. Roberto Silva',
    instructorTitle: 'Cirurgião Plástico Especialista',
    instructorBio:
      'Especialista em cirurgia plástica facial com mais de 15 anos de experiência. Membro da Sociedade Brasileira de Cirurgia Plástica.',
    instructorImage: '/images/instructors/dr-roberto-silva.jpg',
    rating: 4.9,
    students: 2847,
    duration: '24h 30min',
    lessons: 42,
    level: 'Avançado',
    price: 2497,
    originalPrice: 3497,
    discount: 29,
    category: 'Premium',
    thumbnail: '/images/courses/facelift-advanced.jpg',
    courseTrailer: '/videos/facelift-advanced-trailer.mp4',
    description:
      'Curso completo sobre técnicas avançadas de facelift, incluindo abordagens minimamente invasivas, técnicas tradicionais e as mais recentes inovações em rejuvenescimento facial.',
    highlights: [
      'Técnicas cirúrgicas avançadas',
      'Abordagem minimamente invasiva',
      'Casos clínicos reais',
      'Certificação internacional',
      'Suporte 24/7',
      'Acesso vitalício',
    ],
    modules: [
      'Fundamentos do Facelift',
      'Técnicas Cirúrgicas Clássicas',
      'Abordagens Minimamente Invasivas',
      'Complicações e Revisões',
      'Casos Clínicos Avançados',
    ],
    isActive: true,
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    difficulty: 5,
    estimatedHours: 24.5,
    enrollmentLimit: 100,
    prerequisites: [
      'Conhecimento básico em anatomia facial',
      'Experiência em cirurgia plástica',
    ],
    tags: [
      'facelift',
      'cirurgia plástica',
      'rejuvenescimento',
      'técnicas avançadas',
    ],
    materials: [
      {
        type: 'pdf',
        title: 'Manual Completo de Facelift',
        url: '/materials/facelift-manual.pdf',
        description: 'Guia completo com todas as técnicas abordadas no curso',
      },
      {
        type: 'video',
        title: 'Demonstrações Cirúrgicas',
        url: '/materials/facelift-demos.mp4',
        description: 'Vídeos demonstrativos das principais técnicas',
      },
    ],
  },
  {
    id: 'rhinoplasty-basics',
    title: 'Rinoplastia Básica',
    subtitle: 'Fundamentos da cirurgia nasal estética',
    instructor: 'Dra. Maria Santos',
    instructorTitle: 'Especialista em Rinoplastia',
    instructorBio:
      'Cirurgiã plástica especializada em rinoplastia com formação internacional. Mais de 1000 cirurgias realizadas.',
    instructorImage: '/images/instructors/dra-maria-santos.jpg',
    rating: 4.8,
    students: 1923,
    duration: '18h 45min',
    lessons: 32,
    level: 'Intermediário',
    price: 1897,
    originalPrice: 2497,
    discount: 24,
    category: 'Popular',
    thumbnail: '/images/courses/rhinoplasty-basics.jpg',
    courseTrailer: '/videos/rhinoplasty-basics-trailer.mp4',
    description:
      'Aprenda os fundamentos da rinoplastia com técnicas seguras e eficazes para resultados naturais e harmoniosos.',
    highlights: [
      'Anatomia nasal detalhada',
      'Técnicas de preservação',
      'Planejamento cirúrgico',
      'Manejo de complicações',
      'Casos práticos',
      'Certificado de conclusão',
    ],
    modules: [
      'Anatomia Nasal Aplicada',
      'Avaliação Pré-operatória',
      'Técnicas Cirúrgicas',
      'Pós-operatório',
      'Revisões e Complicações',
    ],
    isActive: true,
    featured: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-05',
    difficulty: 3,
    estimatedHours: 18.75,
    enrollmentLimit: 150,
    prerequisites: [
      'Conhecimento básico em anatomia',
      'Residência em cirurgia plástica',
    ],
    tags: ['rinoplastia', 'cirurgia nasal', 'estética', 'básico'],
    materials: [
      {
        type: 'pdf',
        title: 'Atlas de Anatomia Nasal',
        url: '/materials/nasal-anatomy-atlas.pdf',
        description: 'Atlas completo da anatomia nasal',
      },
    ],
  },
];

interface UseCourseAdminReturn {
  // Estado dos cursos
  courses: CourseConfig[];
  loading: boolean;
  error: string | null;

  // Configurações globais
  globalSettings: GlobalSettings;
  categoryThemes: Record<string, CategoryTheme>;

  // Operações CRUD
  createCourse: (
    course: Omit<CourseConfig, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<CourseConfig>;
  updateCourse: (
    id: string,
    updates: Partial<CourseConfig>
  ) => Promise<CourseConfig>;
  deleteCourse: (id: string) => Promise<boolean>;
  getCourse: (id: string) => CourseConfig | undefined;

  // Operações em lote
  toggleCourseStatus: (id: string) => Promise<boolean>;
  toggleCourseFeatured: (id: string) => Promise<boolean>;
  duplicateCourse: (id: string) => Promise<CourseConfig>;

  // Filtros e busca
  searchCourses: (query: string) => CourseConfig[];
  filterCourses: (filters: {
    category?: string;
    level?: string;
    isActive?: boolean;
    featured?: boolean;
  }) => CourseConfig[];

  // Configurações
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => Promise<boolean>;
  updateCategoryTheme: (
    category: string,
    theme: Partial<CategoryTheme>
  ) => Promise<boolean>;

  // Estatísticas
  getStats: () => {
    totalCourses: number;
    activeCourses: number;
    featuredCourses: number;
    totalStudents: number;
    averageRating: number;
    totalRevenue: number;
  };

  // Importação/Exportação
  exportCourses: () => string;
  importCourses: (data: string) => Promise<boolean>;

  // Validação
  validateCourse: (course: Partial<CourseConfig>) => string[];
}

export const useCourseAdmin = (): UseCourseAdminReturn => {
  const [courses, setCourses] = useState<CourseConfig[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(
    defaultGlobalSettings
  );
  const [themes, setThemes] =
    useState<Record<string, CategoryTheme>>(categoryThemes);

  // Simular carregamento inicial
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Em produção, aqui faria fetch dos dados
        // const coursesData = await fetchCourses();
        // const settingsData = await fetchSettings();

        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Criar curso
  const createCourse = useCallback(
    async (
      courseData: Omit<CourseConfig, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<CourseConfig> => {
      setLoading(true);
      try {
        const newCourse: CourseConfig = {
          ...courseData,
          id: `course-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        setCourses(prev => [...prev, newCourse]);
        setLoading(false);
        return newCourse;
      } catch (err) {
        setError('Erro ao criar curso');
        setLoading(false);
        throw err;
      }
    },
    []
  );

  // Atualizar curso
  const updateCourse = useCallback(
    async (
      id: string,
      updates: Partial<CourseConfig>
    ): Promise<CourseConfig> => {
      setLoading(true);
      try {
        const updatedCourse = {
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };

        setCourses(prev =>
          prev.map(course =>
            course.id === id ? { ...course, ...updatedCourse } : course
          )
        );

        const course = courses.find(c => c.id === id);
        setLoading(false);
        return { ...course!, ...updatedCourse };
      } catch (err) {
        setError('Erro ao atualizar curso');
        setLoading(false);
        throw err;
      }
    },
    [courses]
  );

  // Deletar curso
  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      setCourses(prev => prev.filter(course => course.id !== id));
      setLoading(false);
      return true;
    } catch (err) {
      setError('Erro ao deletar curso');
      setLoading(false);
      return false;
    }
  }, []);

  // Obter curso por ID
  const getCourse = useCallback(
    (id: string): CourseConfig | undefined => {
      return courses.find(course => course.id === id);
    },
    [courses]
  );

  // Toggle status do curso
  const toggleCourseStatus = useCallback(
    async (id: string): Promise<boolean> => {
      const course = getCourse(id);
      if (!course) return false;

      await updateCourse(id, { isActive: !course.isActive });
      return true;
    },
    [getCourse, updateCourse]
  );

  // Toggle featured do curso
  const toggleCourseFeatured = useCallback(
    async (id: string): Promise<boolean> => {
      const course = getCourse(id);
      if (!course) return false;

      await updateCourse(id, { featured: !course.featured });
      return true;
    },
    [getCourse, updateCourse]
  );

  // Duplicar curso
  const duplicateCourse = useCallback(
    async (id: string): Promise<CourseConfig> => {
      const course = getCourse(id);
      if (!course) throw new Error('Curso não encontrado');

      const duplicatedCourse = {
        ...course,
        title: `${course.title} (Cópia)`,
        isActive: false,
        featured: false,
      };

      // Remove campos que não devem ser duplicados
      const {
        id: _,
        createdAt: __,
        updatedAt: ___,
        ...courseData
      } = duplicatedCourse;

      return await createCourse(courseData);
    },
    [getCourse, createCourse]
  );

  // Buscar cursos
  const searchCourses = useCallback(
    (query: string): CourseConfig[] => {
      if (!query.trim()) return courses;

      const lowercaseQuery = query.toLowerCase();
      return courses.filter(
        course =>
          course.title.toLowerCase().includes(lowercaseQuery) ||
          course.subtitle.toLowerCase().includes(lowercaseQuery) ||
          course.instructor.toLowerCase().includes(lowercaseQuery) ||
          course.description.toLowerCase().includes(lowercaseQuery) ||
          course.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    },
    [courses]
  );

  // Filtrar cursos
  const filterCourses = useCallback(
    (filters: {
      category?: string;
      level?: string;
      isActive?: boolean;
      featured?: boolean;
    }): CourseConfig[] => {
      return courses.filter(course => {
        if (filters.category && course.category !== filters.category)
          return false;
        if (filters.level && course.level !== filters.level) return false;
        if (
          filters.isActive !== undefined &&
          course.isActive !== filters.isActive
        )
          return false;
        if (
          filters.featured !== undefined &&
          course.featured !== filters.featured
        )
          return false;
        return true;
      });
    },
    [courses]
  );

  // Atualizar configurações globais
  const updateGlobalSettings = useCallback(
    async (settings: Partial<GlobalSettings>): Promise<boolean> => {
      try {
        setGlobalSettings(prev => ({ ...prev, ...settings }));
        // Em produção, salvaria no backend
        return true;
      } catch (err) {
        setError('Erro ao atualizar configurações');
        return false;
      }
    },
    []
  );

  // Atualizar tema de categoria
  const updateCategoryTheme = useCallback(
    async (
      category: string,
      theme: Partial<CategoryTheme>
    ): Promise<boolean> => {
      try {
        setThemes(prev => ({
          ...prev,
          [category]: { ...prev[category], ...theme },
        }));
        return true;
      } catch (err) {
        setError('Erro ao atualizar tema');
        return false;
      }
    },
    []
  );

  // Obter estatísticas
  const getStats = useCallback(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.isActive).length;
    const featuredCourses = courses.filter(c => c.featured).length;
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
    const averageRating =
      courses.reduce((sum, c) => sum + c.rating, 0) / totalCourses;
    const totalRevenue = courses.reduce(
      (sum, c) => sum + c.price * c.students,
      0
    );

    return {
      totalCourses,
      activeCourses,
      featuredCourses,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRevenue,
    };
  }, [courses]);

  // Exportar cursos
  const exportCourses = useCallback((): string => {
    const exportData = {
      courses,
      globalSettings,
      categoryThemes: themes,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(exportData, null, 2);
  }, [courses, globalSettings, themes]);

  // Importar cursos
  const importCourses = useCallback(async (data: string): Promise<boolean> => {
    try {
      const importData = JSON.parse(data);

      if (importData.courses) {
        setCourses(importData.courses);
      }
      if (importData.globalSettings) {
        setGlobalSettings(importData.globalSettings);
      }
      if (importData.categoryThemes) {
        setThemes(importData.categoryThemes);
      }

      return true;
    } catch (err) {
      setError('Erro ao importar dados');
      return false;
    }
  }, []);

  // Validar curso
  const validateCourse = useCallback(
    (course: Partial<CourseConfig>): string[] => {
      const errors: string[] = [];

      if (!course.title?.trim()) errors.push('Título é obrigatório');
      if (!course.instructor?.trim()) errors.push('Instrutor é obrigatório');
      if (!course.description?.trim()) errors.push('Descrição é obrigatória');
      if (!course.price || course.price < 0)
        errors.push('Preço deve ser maior que zero');
      if (!course.lessons || course.lessons < 1)
        errors.push('Deve ter pelo menos 1 aula');
      if (!course.duration?.trim()) errors.push('Duração é obrigatória');
      if (!course.category) errors.push('Categoria é obrigatória');
      if (!course.level) errors.push('Nível é obrigatório');
      if (course.rating && (course.rating < 0 || course.rating > 5))
        errors.push('Avaliação deve estar entre 0 e 5');
      if (course.discount && (course.discount < 0 || course.discount > 100))
        errors.push('Desconto deve estar entre 0 e 100%');

      return errors;
    },
    []
  );

  return {
    courses,
    loading,
    error,
    globalSettings,
    categoryThemes: themes,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    toggleCourseStatus,
    toggleCourseFeatured,
    duplicateCourse,
    searchCourses,
    filterCourses,
    updateGlobalSettings,
    updateCategoryTheme,
    getStats,
    exportCourses,
    importCourses,
    validateCourse,
  };
};
