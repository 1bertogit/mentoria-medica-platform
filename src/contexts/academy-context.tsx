'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import logger from '@/lib/logger';
import { toast } from 'sonner';
import { featuredCourse, type AcademyCourse, type CurriculumModule, type Lesson } from '@/lib/mock-data/academy';

interface AcademyContextType {
  courses: AcademyCourse[];
  currentCourse: AcademyCourse | null;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  
  // Course operations
  getCourse: (id: number) => Promise<AcademyCourse | null>;
  updateCourse: (id: number, data: Partial<AcademyCourse>) => Promise<boolean>;
  saveCourse: (course: AcademyCourse) => Promise<boolean>;
  
  // Module operations
  addModule: (courseId: number, module: Omit<CurriculumModule, 'id'>) => Promise<boolean>;
  updateModule: (courseId: number, moduleId: string, data: Partial<CurriculumModule>) => Promise<boolean>;
  deleteModule: (courseId: number, moduleId: string) => Promise<boolean>;
  reorderModules: (courseId: number, moduleIds: string[]) => Promise<boolean>;
  
  // Lesson operations
  addLesson: (courseId: number, moduleId: string, lesson: Omit<Lesson, 'id'>) => Promise<boolean>;
  updateLesson: (courseId: number, moduleId: string, lessonId: string, data: Partial<Lesson>) => Promise<boolean>;
  deleteLesson: (courseId: number, moduleId: string, lessonId: string) => Promise<boolean>;
  
  // State management
  setCurrentCourse: (course: AcademyCourse | null) => void;
  markAsChanged: () => void;
  markAsSaved: () => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

const STORAGE_KEY = 'academy_courses_data';

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [currentCourse, setCurrentCourse] = useState<AcademyCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    loadCoursesFromStorage();
  }, []);

  // Save to localStorage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      saveCoursesToStorage();
    }
  }, [courses]);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadCoursesFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedCourses = JSON.parse(stored);
        setCourses(parsedCourses);
      } else {
        // Initialize with featured course
        setCourses([featuredCourse]);
      }
    } catch (error) {
      logger.error('Error loading courses from storage:', error);
      setCourses([featuredCourse]);
    }
  };

  const saveCoursesToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
      logger.error('Error saving courses to storage:', error);
    }
  };

  const getCourse = async (id: number): Promise<AcademyCourse | null> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const course = courses.find(c => c.id === id) || null;
      setCurrentCourse(course);
      return course;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (id: number, data: Partial<AcademyCourse>): Promise<boolean> => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...data } : course
      ));
      
      if (currentCourse?.id === id) {
        setCurrentCourse(prev => prev ? { ...prev, ...data } : null);
      }
      
      markAsChanged();
      return true;
    } catch (error) {
      logger.error('Error updating course:', error);
      return false;
    }
  };

  const saveCourse = async (course: AcademyCourse): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCourses(prev => prev.map(c => c.id === course.id ? course : c));
      setCurrentCourse(course);
      markAsSaved();
      
      toast.success('Curso salvo com sucesso!', {
        description: 'Todas as alterações foram salvas.',
      });
      
      return true;
    } catch (error) {
      logger.error('Error saving course:', error);
      toast.error('Erro ao salvar curso', {
        description: 'Tente novamente em alguns instantes.',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addModule = async (courseId: number, module: Omit<CurriculumModule, 'id'>): Promise<boolean> => {
    try {
      const newModule: CurriculumModule = {
        ...module,
        id: `mod-${Date.now()}`,
        lessons: module.lessons || [],
      };

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              curriculum: [...course.curriculum, newModule],
              modules: `${course.curriculum.length + 1} Módulos`
            }
          : course
      ));

      if (currentCourse?.id === courseId) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: [...prev.curriculum, newModule],
          modules: `${prev.curriculum.length + 1} Módulos`
        } : null);
      }

      markAsChanged();
      toast.success('Módulo adicionado com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error adding module:', error);
      toast.error('Erro ao adicionar módulo');
      return false;
    }
  };

  const updateModule = async (courseId: number, moduleId: string, data: Partial<CurriculumModule>): Promise<boolean> => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              curriculum: course.curriculum.map(module =>
                module.id === moduleId ? { ...module, ...data } : module
              )
            }
          : course
      ));

      if (currentCourse?.id === courseId) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: prev.curriculum.map(module =>
            module.id === moduleId ? { ...module, ...data } : module
          )
        } : null);
      }

      markAsChanged();
      toast.success('Módulo atualizado com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error updating module:', error);
      toast.error('Erro ao atualizar módulo');
      return false;
    }
  };

  const deleteModule = async (courseId: number, moduleId: string): Promise<boolean> => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              curriculum: course.curriculum.filter(module => module.id !== moduleId),
              modules: `${course.curriculum.length - 1} Módulos`
            }
          : course
      ));

      if (currentCourse?.id === courseId) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: prev.curriculum.filter(module => module.id !== moduleId),
          modules: `${prev.curriculum.length - 1} Módulos`
        } : null);
      }

      markAsChanged();
      toast.success('Módulo excluído com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error deleting module:', error);
      toast.error('Erro ao excluir módulo');
      return false;
    }
  };

  const reorderModules = async (courseId: number, moduleIds: string[]): Promise<boolean> => {
    try {
      setCourses(prev => prev.map(course => {
        if (course.id !== courseId) return course;
        
        const reorderedModules = moduleIds.map(id => 
          course.curriculum.find(m => m.id === id)
        ).filter(Boolean) as CurriculumModule[];
        
        return { ...course, curriculum: reorderedModules };
      }));

      if (currentCourse?.id === courseId) {
        const reorderedModules = moduleIds.map(id => 
          currentCourse.curriculum.find(m => m.id === id)
        ).filter(Boolean) as CurriculumModule[];
        
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: reorderedModules
        } : null);
      }

      markAsChanged();
      toast.success('Módulos reordenados com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error reordering modules:', error);
      toast.error('Erro ao reordenar módulos');
      return false;
    }
  };

  const addLesson = async (courseId: number, moduleId: string, lesson: Omit<Lesson, 'id'>): Promise<boolean> => {
    try {
      const newLesson: Lesson = {
        ...lesson,
        id: `lesson-${Date.now()}`,
      };

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              curriculum: course.curriculum.map(module =>
                module.id === moduleId 
                  ? { ...module, lessons: [...module.lessons, newLesson] }
                  : module
              )
            }
          : course
      ));

      if (currentCourse?.id === courseId) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: prev.curriculum.map(module =>
            module.id === moduleId 
              ? { ...module, lessons: [...module.lessons, newLesson] }
              : module
          )
        } : null);
      }

      markAsChanged();
      toast.success('Aula adicionada com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error adding lesson:', error);
      toast.error('Erro ao adicionar aula');
      return false;
    }
  };

  const updateLesson = async (courseId: number, moduleId: string, lessonId: string, data: Partial<Lesson>): Promise<boolean> => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              curriculum: course.curriculum.map(module =>
                module.id === moduleId 
                  ? {
                      ...module,
                      lessons: module.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, ...data } : lesson
                      )
                    }
                  : module
              )
            }
          : course
      ));

      if (currentCourse?.id === courseId) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: prev.curriculum.map(module =>
            module.id === moduleId 
              ? {
                  ...module,
                  lessons: module.lessons.map(lesson =>
                    lesson.id === lessonId ? { ...lesson, ...data } : lesson
                  )
                }
              : module
          )
        } : null);
      }

      markAsChanged();
      toast.success('Aula atualizada com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error updating lesson:', error);
      toast.error('Erro ao atualizar aula');
      return false;
    }
  };

  const deleteLesson = async (courseId: number, moduleId: string, lessonId: string): Promise<boolean> => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              curriculum: course.curriculum.map(module =>
                module.id === moduleId 
                  ? {
                      ...module,
                      lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
                    }
                  : module
              )
            }
          : course
      ));

      if (currentCourse?.id === courseId) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          curriculum: prev.curriculum.map(module =>
            module.id === moduleId 
              ? {
                  ...module,
                  lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
                }
              : module
          )
        } : null);
      }

      markAsChanged();
      toast.success('Aula excluída com sucesso!');
      return true;
    } catch (error) {
      logger.error('Error deleting lesson:', error);
      toast.error('Erro ao excluir aula');
      return false;
    }
  };

  const markAsChanged = () => {
    setHasUnsavedChanges(true);
  };

  const markAsSaved = () => {
    setHasUnsavedChanges(false);
  };

  const value: AcademyContextType = {
    courses,
    currentCourse,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    getCourse,
    updateCourse,
    saveCourse,
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
    addLesson,
    updateLesson,
    deleteLesson,
    setCurrentCourse,
    markAsChanged,
    markAsSaved,
  };

  return (
    <AcademyContext.Provider value={value}>
      {children}
    </AcademyContext.Provider>
  );
}

export function useAcademy() {
  const context = useContext(AcademyContext);
  if (context === undefined) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
}
