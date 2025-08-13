'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Star, Clock, BookOpen, Users, PlayCircle, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { CourseHeroProps } from '@/types';

export function CourseHero({ course, progress, isAdmin }: CourseHeroProps) {
  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="relative aspect-[16/8] w-full">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover opacity-30"
          data-ai-hint={course.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <Badge className="border-yellow-400/30 bg-yellow-500/20 capitalize text-yellow-300">
                {course.category}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-400/50 capitalize text-green-300"
              >
                {course.level}
              </Badge>
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-white/95 lg:text-4xl">
              {course.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{course.modules}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{course.students?.toLocaleString('pt-BR')} alunos</span>
              </div>
            </div>

            {course.description && (
              <p className="mb-6 text-lg font-light leading-relaxed text-white/70">
                {course.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button className="glass-button h-12 bg-green-500/20 px-6 text-base text-green-300 transition-transform duration-200 hover:scale-105 hover:bg-green-500/30">
                <PlayCircle className="mr-2 h-5 w-5" />
                {progress > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
              </Button>
              {isAdmin && (
                <Link href={`/academy/${course.id}/edit`}>
                  <Button
                    variant="outline"
                    className="glass-button h-12 border-yellow-400/30 px-6 text-base text-yellow-300 transition-transform duration-200 hover:scale-105 hover:bg-yellow-400/20"
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    Editar Curso
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
