// Tipos centralizados do projeto
// Gerado automaticamente - não editar manualmente

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  price?: number;
  thumbnail?: string;
  modules?: CourseModule[];
  enrolledCount?: number;
  rating?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'case';
  category: string;
  author?: string;
  fileUrl?: string;
  thumbnail?: string;
  tags?: string[];
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  patient: {
    age: number;
    gender: string;
    background: string;
  };
  diagnosis: string;
  treatment: string;
  outcome: string;
  images: string[];
  author: string;
  publishedAt: string;
  tags: string[];
}

export type {
  Course,
  LibraryItem,
  User,
  CaseStudy
};
