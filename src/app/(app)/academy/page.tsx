'use client';

import { useState, useMemo, useEffect } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  GraduationCap,
  Clock,
  BarChart2,
  ArrowRight,
  PlayCircle,
  Star,
  Info,
  Lock,
  BookOpen,
  Video,
  Edit,
  User,
  Users,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { featuredCourse, courseSections } from '@/lib/mock-data/academy';
import { useAuth } from '@/hooks/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Skeleton,
  SkeletonCard,
  SkeletonCourse,
} from '@/components/ui/skeleton';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function AcademyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [lastAccessedCourse] = useLocalStorage('lastAccessedCourse', null);
  
  // Use o último curso acessado ou o curso em destaque padrão
  const displayCourse = lastAccessedCourse || featuredCourse;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return courseSections;

    const term = searchTerm.toLowerCase();
    return courseSections
      .map(section => ({
        ...section,
        courses: section.courses.filter(
          course =>
            course.title.toLowerCase().includes(term) ||
            course.category?.toLowerCase().includes(term) ||
            course.description?.toLowerCase().includes(term)
        ),
      }))
      .filter(section => section.courses.length > 0);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="w-full space-y-12">
        <GlassCard className="overflow-hidden p-0">
          <div className="relative aspect-[16/8] w-full">
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
              <div className="max-w-2xl space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-40" />
                  <Skeleton className="h-14 w-32" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Skeleton className="h-12 w-full md:flex-1" />
            <Skeleton className="h-12 w-full md:w-48" />
          </div>
        </GlassCard>

        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <section key={sectionIndex}>
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, courseIndex) => (
                <SkeletonCourse key={courseIndex} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      <section aria-label="Curso em destaque">
        <GlassCard className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 p-0 shadow-2xl">
          {/* Background simplificado */}
          <div className="absolute inset-0 h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-blue-500/20"></div>
            
            {/* Efeito de luz suave */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"></div>
          </div>

          <div className="relative flex min-h-[400px] items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            <div className="relative z-10 flex w-full flex-col justify-center p-6 sm:p-8 md:p-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-yellow-400" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
                    {displayCourse.category}
                  </p>
                </div>

                <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  {displayCourse.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">{displayCourse.rating}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-400/50 capitalize text-green-300"
                  >
                    {displayCourse.level}
                  </Badge>
                  <span>{displayCourse.duration}</span>
                  <span>{displayCourse.modules}</span>
                </div>

                <p className="mt-4 line-clamp-2 text-base font-light leading-relaxed text-white/70 sm:line-clamp-3">
                  {displayCourse.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href={`/academy/${displayCourse.id}`}>
                    <Button className="glass-button h-10 bg-cyan-500/20 px-6 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 sm:h-12 sm:px-8 sm:text-base">
                      <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Acessar Curso
                    </Button>
                  </Link>

                  {isAdmin && (
                    <Link href={`/academy/${displayCourse.id}/edit`}>
                      <Button
                        variant="outline"
                        className="glass-button h-10 border-yellow-400/30 bg-yellow-400/10 px-6 text-sm font-medium text-yellow-300 transition-all hover:bg-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/20 sm:h-12 sm:px-8 sm:text-base"
                      >
                        <Edit className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Editar Curso
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50 sm:text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{displayCourse.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{displayCourse.students?.toLocaleString('pt-BR')} alunos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{displayCourse.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {!searchTerm ? (
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Link href="/academy/facelift">
            <GlassCard
              className="group h-full cursor-pointer p-8 text-center transition-all duration-300 hover:scale-[1.02]"
              interactive={true}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white/95">
                Facelift Academy
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-white/70">
                Cursos estruturados, trilhas de aprendizado e certificações em
                procedimentos estéticos e cirúrgicos.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-white/60">
                <BookOpen className="h-4 w-4" />
                <span>Cursos • Certificações • Trilhas</span>
              </div>
            </GlassCard>
          </Link>

          <Link href="/classes">
            <GlassCard
              className="group h-full cursor-pointer p-8 text-center transition-all duration-300 hover:scale-[1.02]"
              interactive={true}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 transition-transform duration-300 group-hover:scale-110">
                <PlayCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white/95">
                Gravações da Mentoria
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-white/70">
                Aulas semanais gravadas, sessões de Q&A e conteúdo exclusivo da
                mentoria em grupo.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-white/60">
                <Video className="h-4 w-4" />
                <span>Aulas Semanais • Q&A • Exclusivo</span>
              </div>
            </GlassCard>
          </Link>
        </div>
      ) : null}

      {searchTerm && filteredSections.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600 dark:text-white/60">
            Nenhum curso encontrado para "{searchTerm}"
          </p>
          <Button
            variant="outline"
            className="glass-button mt-4"
            onClick={() => setSearchTerm('')}
          >
            Limpar busca
          </Button>
        </div>
      ) : searchTerm ? (
        filteredSections.map(section => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="mb-4 text-2xl font-light text-gray-900 dark:text-white/90">
              {section.title}
            </h2>
            <Carousel
              opts={{
                align: 'start',
                loop: false,
              }}
              className="w-full overflow-hidden"
            >
              <CarouselContent className="-ml-4">
                {section.courses.map(course => (
                  <CarouselItem
                    key={course.id}
                    className="basis-full pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link href={`/academy/${course.id}`} passHref>
                      <GlassCard
                        interactive={true}
                        className="group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10"
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            loading="lazy"
                            className="object-cover opacity-70 transition-opacity duration-300 group-hover:scale-105 group-hover:opacity-100"
                            data-ai-hint={course.imageHint}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all group-hover:from-black/60"></div>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <PlayCircle className="h-16 w-16 text-white/70" />
                          </div>
                          {course.locked && (
                            <div className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-sm">
                              <Lock className="h-4 w-4 text-white/80" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="truncate text-base font-medium leading-tight text-gray-900 dark:text-white/95">
                            {course.title}
                          </h3>
                          <p className="mt-1 text-sm font-light text-gray-600 dark:text-white/60">
                            {course.duration}
                          </p>
                        </div>
                      </GlassCard>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        ))
      ) : null}
    </div>
  );
}
