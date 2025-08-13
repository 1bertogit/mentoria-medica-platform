'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  ChevronRight,
  Lock,
  Unlock,
  PlayCircle,
  ShoppingCart,
  Info,
  CreditCard,
  Gift,
  Sparkles,
  Crown,
  GraduationCap,
  User,
  Target,
  CheckCircle2,
  Eye,
  Heart,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BorderBeam } from '@/components/magicui/border-beam';
import { getGlassPattern } from '@/lib/styles/glass-morphism';

// Mock do usuário atual (simula se está matriculado ou não)
const currentUser = {
  id: '1',
  name: 'Dr. João Silva',
  enrolledCourses: ['facelift-advanced', 'rhinoplasty-basics'], // IDs dos cursos matriculados
};

// Dados dos cursos disponíveis
const coursesData = [
  {
    id: 'facelift-advanced',
    title: 'Facelift Avançado',
    subtitle: 'Técnicas modernas de rejuvenescimento facial',
    instructor: 'Dr. Roberto Silva',
    instructorTitle: 'Cirurgião Plástico Especialista',
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
    description: 'Curso completo sobre técnicas avançadas de facelift, incluindo abordagens minimamente invasivas, técnicas tradicionais e as mais recentes inovações em rejuvenescimento facial.',
    highlights: [
      'Técnicas cirúrgicas avançadas',
      'Abordagem minimamente invasiva',
      'Casos clínicos reais',
      'Certificação internacional',
      'Suporte 24/7',
      'Acesso vitalício'
    ],
    modules: [
      'Fundamentos do Facelift',
      'Técnicas Cirúrgicas Clássicas',
      'Abordagens Minimamente Invasivas',
      'Complicações e Revisões',
      'Casos Clínicos Avançados'
    ],
    isEnrolled: true,
    progress: 68
  },
  {
    id: 'rhinoplasty-basics',
    title: 'Rinoplastia Básica',
    subtitle: 'Fundamentos da cirurgia nasal estética',
    instructor: 'Dra. Maria Santos',
    instructorTitle: 'Especialista em Rinoplastia',
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
    description: 'Aprenda os fundamentos da rinoplastia com técnicas seguras e eficazes para resultados naturais e harmoniosos.',
    highlights: [
      'Anatomia nasal detalhada',
      'Técnicas de preservação',
      'Planejamento cirúrgico',
      'Manejo de complicações',
      'Casos práticos',
      'Certificado de conclusão'
    ],
    modules: [
      'Anatomia Nasal Aplicada',
      'Avaliação Pré-operatória',
      'Técnicas Cirúrgicas',
      'Pós-operatório',
      'Revisões e Complicações'
    ],
    isEnrolled: true,
    progress: 34
  },
  {
    id: 'blepharoplasty-master',
    title: 'Blefaroplastia Master',
    subtitle: 'Rejuvenescimento da região periorbital',
    instructor: 'Dr. Carlos Mendes',
    instructorTitle: 'Especialista em Cirurgia Ocular',
    rating: 4.9,
    students: 1456,
    duration: '16h 20min',
    lessons: 28,
    level: 'Avançado',
    price: 1697,
    originalPrice: 2197,
    discount: 23,
    category: 'Novo',
    thumbnail: '/images/courses/blepharoplasty-master.jpg',
    description: 'Domine as técnicas de blefaroplastia superior e inferior com abordagens modernas e resultados naturais.',
    highlights: [
      'Técnicas minimamente invasivas',
      'Preservação muscular',
      'Tratamento de bolsas',
      'Correção de ptose',
      'Casos complexos',
      'Suporte especializado'
    ],
    modules: [
      'Anatomia Periorbital',
      'Blefaroplastia Superior',
      'Blefaroplastia Inferior',
      'Técnicas Combinadas',
      'Complicações e Revisões'
    ],
    isEnrolled: false,
    progress: 0
  },
  {
    id: 'otoplasty-complete',
    title: 'Otoplastia Completa',
    subtitle: 'Correção estética das orelhas',
    instructor: 'Dr. Pedro Lima',
    instructorTitle: 'Cirurgião Plástico',
    rating: 4.7,
    students: 892,
    duration: '12h 15min',
    lessons: 24,
    level: 'Básico',
    price: 997,
    originalPrice: 1297,
    discount: 23,
    category: 'Básico',
    thumbnail: '/images/courses/otoplasty-complete.jpg',
    description: 'Aprenda as técnicas fundamentais de otoplastia para correção de orelhas proeminentes e outras deformidades.',
    highlights: [
      'Técnicas clássicas',
      'Abordagem pediátrica',
      'Suturas especiais',
      'Resultados duradouros',
      'Casos ilustrativos',
      'Certificação'
    ],
    modules: [
      'Anatomia da Orelha',
      'Indicações Cirúrgicas',
      'Técnicas de Mustardé',
      'Técnicas de Furnas',
      'Pós-operatório'
    ],
    isEnrolled: false,
    progress: 0
  },
  {
    id: 'facial-harmony',
    title: 'Harmonia Facial',
    subtitle: 'Análise e planejamento estético',
    instructor: 'Dra. Ana Costa',
    instructorTitle: 'Especialista em Harmonização',
    rating: 4.8,
    students: 2156,
    duration: '20h 10min',
    lessons: 36,
    level: 'Intermediário',
    price: 1497,
    originalPrice: 1897,
    discount: 21,
    category: 'Trending',
    thumbnail: '/images/courses/facial-harmony.jpg',
    description: 'Desenvolva o olhar clínico para análise facial e planejamento de procedimentos estéticos harmonizados.',
    highlights: [
      'Análise facial completa',
      'Proporções áureas',
      'Planejamento digital',
      'Técnicas combinadas',
      'Casos antes/depois',
      'Mentoria individual'
    ],
    modules: [
      'Análise Facial',
      'Proporções Estéticas',
      'Planejamento Digital',
      'Técnicas Não-cirúrgicas',
      'Combinação de Procedimentos'
    ],
    isEnrolled: false,
    progress: 0
  },
  {
    id: 'mammoplasty-advanced',
    title: 'Mamoplastia Avançada',
    subtitle: 'Técnicas modernas de cirurgia mamária',
    instructor: 'Dr. Ricardo Alves',
    instructorTitle: 'Especialista em Cirurgia Mamária',
    rating: 4.9,
    students: 1678,
    duration: '28h 45min',
    lessons: 48,
    level: 'Avançado',
    price: 2997,
    originalPrice: 3997,
    discount: 25,
    category: 'Premium',
    thumbnail: '/images/courses/mammoplasty-advanced.jpg',
    description: 'Curso completo sobre técnicas avançadas de mamoplastia, incluindo aumento, redução e reconstrução mamária.',
    highlights: [
      'Técnicas de aumento',
      'Redução mamária',
      'Reconstrução pós-mastectomia',
      'Implantes modernos',
      'Complicações',
      'Certificação avançada'
    ],
    modules: [
      'Anatomia Mamária',
      'Aumento Mamário',
      'Redução Mamária',
      'Mastopexia',
      'Reconstrução Mamária',
      'Complicações'
    ],
    isEnrolled: false,
    progress: 0
  }
];

export default function FaceliftAcademyPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Todos os Cursos', count: coursesData.length },
    { id: 'enrolled', label: 'Meus Cursos', count: coursesData.filter(c => c.isEnrolled).length },
    { id: 'available', label: 'Disponíveis', count: coursesData.filter(c => !c.isEnrolled).length },
    { id: 'premium', label: 'Premium', count: coursesData.filter(c => c.category === 'Premium').length },
  ];

  const filteredCourses = coursesData.filter(course => {
    switch (filter) {
      case 'enrolled':
        return course.isEnrolled;
      case 'available':
        return !course.isEnrolled;
      case 'premium':
        return course.category === 'Premium';
      default:
        return true;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Premium':
        return 'from-purple-500 to-pink-500';
      case 'Popular':
        return 'from-blue-500 to-cyan-500';
      case 'Novo':
        return 'from-green-500 to-emerald-500';
      case 'Trending':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleEnroll = (courseId: string) => {
    // Aqui seria a lógica de matrícula
    };

  const handleLearnMore = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <motion.div
            className="absolute -left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-gradient-to-r from-purple-500/20 to-transparent blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-gradient-to-l from-pink-500/20 to-transparent blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="mr-2 h-4 w-4" />
                Academia Premium
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Facelift Academy
              </h1>
              
              <p className="mx-auto max-w-3xl text-xl text-purple-100 lg:text-2xl">
                Descubra os melhores cursos de cirurgia plástica facial com especialistas renomados
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-purple-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>{coursesData.length} Cursos Disponíveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>+10.000 Alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Certificação Internacional</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-2 rounded-xl bg-white/50 p-1 backdrop-blur-sm dark:bg-gray-900/50">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === filterItem.id
                    ? 'bg-white text-purple-600 shadow-sm dark:bg-gray-800 dark:text-purple-400'
                    : 'text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400'
                }`}
              >
                {filterItem.label}
                <Badge variant="secondary" className="ml-1">
                  {filterItem.count}
                </Badge>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`${getGlassPattern('interactiveCard')} group relative overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]`}>
                {/* Course Status Indicator */}
                <div className="absolute right-4 top-4 z-10">
                  {course.isEnrolled ? (
                    <motion.div
                      className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Unlock className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-medium text-green-400">Matriculado</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-1 rounded-full bg-gray-500/20 px-3 py-1 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Lock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-400">Bloqueado</span>
                    </motion.div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute left-4 top-4 z-10">
                  <Badge className={`bg-gradient-to-r ${getCategoryColor(course.category)} text-white`}>
                    {course.category}
                  </Badge>
                </div>

                {/* Course Thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                      whileHover={{ scale: 1.1 }}
                    >
                      {course.isEnrolled ? (
                        <PlayCircle className="h-8 w-8 text-white" />
                      ) : (
                        <Lock className="h-8 w-8 text-white" />
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Progress Bar for Enrolled Courses */}
                  {course.isEnrolled && course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Course Title */}
                    <div>
                      <h3 className="text-xl font-bold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-900">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">{course.instructorTitle}</p>
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons}</span>
                      </div>
                    </div>

                    {/* Progress for Enrolled Courses */}
                    {course.isEnrolled && course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium text-green-600">{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Price for Non-Enrolled Courses */}
                    {!course.isEnrolled && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">
                              R$ {course.price.toLocaleString()}
                            </span>
                            {course.originalPrice > course.price && (
                              <Badge variant="destructive" className="text-xs">
                                -{course.discount}%
                              </Badge>
                            )}
                          </div>
                          {course.originalPrice > course.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              R$ {course.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {course.isEnrolled ? (
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          onClick={() => window.location.href = `/academy/${course.id}`}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {course.progress > 0 ? 'Continuar' : 'Iniciar'}
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleLearnMore(course.id)}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            Saber Mais
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => handleEnroll(course.id)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Matricular
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Border Beam for Premium Courses */}
                {course.category === 'Premium' && (
                  <BorderBeam
                    size={100}
                    duration={12}
                    delay={index * 2}
                    colorFrom="#8b5cf6"
                    colorTo="#ec4899"
                    reverse={false}
                    borderWidth={1}
                    className="opacity-60"
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Course Detail Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
            >
              <motion.div
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const course = coursesData.find(c => c.id === selectedCourse);
                  if (!course) return null;

                  return (
                    <Card className={`${getGlassPattern('interactiveCard')} border-0 shadow-2xl`}>
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <Badge className={`bg-gradient-to-r ${getCategoryColor(course.category)} text-white`}>
                              {course.category}
                            </Badge>
                            <CardTitle className="text-2xl">{course.title}</CardTitle>
                            <p className="text-muted-foreground">{course.subtitle}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCourse(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Course Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-bold">{course.rating}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Avaliação</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-4 w-4" />
                              <span className="font-bold">{course.students.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Alunos</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-bold">{course.duration}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Duração</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Target className="h-4 w-4" />
                              <span className="font-bold">{course.level}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Nível</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h3 className="font-semibold mb-2">Sobre o Curso</h3>
                          <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                        </div>

                        {/* Highlights */}
                        <div>
                          <h3 className="font-semibold mb-3">O que você vai aprender</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {course.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Modules */}
                        <div>
                          <h3 className="font-semibold mb-3">Módulos do Curso</h3>
                          <div className="space-y-2">
                            {course.modules.map((module, index) => (
                              <div key={index} className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-gray-800/50">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                                  {index + 1}
                                </div>
                                <span className="text-sm">{module}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Instructor */}
                        <div>
                          <h3 className="font-semibold mb-3">Instrutor</h3>
                          <div className="flex items-center gap-4 rounded-lg bg-white/50 p-4 dark:bg-gray-800/50">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                              <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-900">
                                <User className="h-6 w-6 text-purple-600" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">{course.instructor}</p>
                              <p className="text-sm text-muted-foreground">{course.instructorTitle}</p>
                            </div>
                          </div>
                        </div>

                        {/* Price and CTA */}
                        {!course.isEnrolled && (
                          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:from-purple-900/20 dark:to-pink-900/20">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-600">
                                  R$ {course.price.toLocaleString()}
                                </span>
                                {course.originalPrice > course.price && (
                                  <Badge variant="destructive">
                                    -{course.discount}% OFF
                                  </Badge>
                                )}
                              </div>
                              {course.originalPrice > course.price && (
                                <p className="text-sm text-muted-foreground line-through">
                                  De R$ {course.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <Button
                              size="lg"
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              onClick={() => handleEnroll(course.id)}
                            >
                              <CreditCard className="mr-2 h-5 w-5" />
                              Matricular Agora
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}