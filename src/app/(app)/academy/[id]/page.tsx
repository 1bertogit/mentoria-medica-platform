import { notFound } from 'next/navigation';
import { featuredCourse, courseSections, type AcademyCourse } from '@/lib/mock-data/academy';
import { Metadata } from 'next';
import CourseDetailClient from './CourseDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // In a real app, this would fetch course data from API
  const courseId = parseInt(id);  
  let courseData = featuredCourse.id === courseId ? featuredCourse : null;
  
  // Search in course sections if not found
  if (!courseData) {
    for (const section of courseSections) {
      const foundCourse = section.courses.find(course => course.id === courseId);
      if (foundCourse) {
        courseData = {...foundCourse, curriculum: []} as AcademyCourse;
      }
      if (courseData) break;
    }
  }

  if (!courseData) {
    return {
      title: 'Curso não encontrado',
      description: 'O curso solicitado não foi encontrado.'
    };
  }

  return {
    title: `${courseData.title} | Academy Mentoria`,
    description: courseData.description || `Curso de ${courseData.category} com ${courseData.duration}`,
    openGraph: {
      title: courseData.title,
      description: courseData.description || `Curso de ${courseData.category}`,
      type: 'article',
      images: courseData.imageUrl ? [courseData.imageUrl] : [],
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // In a real app, this would fetch course data from API using the ID
    const courseId = parseInt(id);
    let courseData = featuredCourse.id === courseId ? featuredCourse : null;
    
    // Search in course sections if not found
    if (!courseData) {
      for (const section of courseSections) {
        const foundCourse = section.courses.find(course => course.id === courseId);
        if (foundCourse) {
          courseData = {...foundCourse, curriculum: []} as AcademyCourse;
          break;
        }
      }
    }

    if (!courseData) {
        notFound();
    }
  
    return <CourseDetailClient courseData={courseData} />;
}