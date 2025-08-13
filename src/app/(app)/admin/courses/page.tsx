'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// FASE 3: Importando componentes padronizados de UX
import { LoadingSpinner, PageLoader } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Video,
  Users,
  Calendar,
  DollarSign,
  Star,
  Download,
  Upload,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  students: number;
  rating: number;
  totalRatings: number;
  modules: number;
  lessons: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Facelift Mastery',
    description: 'Domine as técnicas mais avançadas de facelift com o Dr. Robério',
    instructor: 'Dr. Robério Damasceno',
    thumbnail: '/images/courses/facelift-thumb.jpg',
    price: 2997,
    originalPrice: 3997,
    category: 'Cirurgia Facial',
    level: 'advanced',
    duration: '40 horas',
    students: 234,
    rating: 4.8,
    totalRatings: 89,
    modules: 8,
    lessons: 42,
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-12-10',
    featured: true,
  },
  {
    id: '2',
    title: 'Browlift & Endomidface',
    description: 'Técnicas minimamente invasivas para rejuvenescimento facial',
    instructor: 'Dr. Robério Damasceno',
    thumbnail: '/images/courses/browlift-thumb.jpg',
    price: 1997,
    category: 'Cirurgia Facial',
    level: 'intermediate',
    duration: '24 horas',
    students: 156,
    rating: 4.9,
    totalRatings: 67,
    modules: 6,
    lessons: 28,
    status: 'published',
    createdAt: '2024-02-20',
    updatedAt: '2024-12-08',
    featured: false,
  },
  {
    id: '3',
    title: 'Rinoplastia Avançada',
    description: 'Abordagem estruturada para rinoplastia estética e funcional',
    instructor: 'Dr. Carlos Silva',
    thumbnail: '/images/courses/rhino-thumb.jpg',
    price: 2497,
    category: 'Cirurgia Facial',
    level: 'advanced',
    duration: '32 horas',
    students: 98,
    rating: 4.7,
    totalRatings: 45,
    modules: 7,
    lessons: 35,
    status: 'draft',
    createdAt: '2024-03-10',
    updatedAt: '2024-12-05',
    featured: false,
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    category: '',
    level: 'beginner' as Course['level'],
    duration: '',
    status: 'draft' as Course['status'],
    featured: false,
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateOrUpdate = async () => {
    if (!formData.title || !formData.instructor || !formData.price) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingCourse) {
        // Update existing course
        const response = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
          }),
        });

        if (!response.ok) throw new Error('Failed to update course');
        
        const updatedCourse = await response.json();
        setCourses(courses.map(c => c.id === editingCourse.id ? updatedCourse : c));
        toast.success('Curso atualizado com sucesso!');
      } else {
        // Create new course
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
          }),
        });

        if (!response.ok) throw new Error('Failed to create course');
        
        const newCourse = await response.json();
        setCourses([...courses, newCourse]);
        toast.success('Curso criado com sucesso!');
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(editingCourse ? 'Erro ao atualizar curso' : 'Erro ao criar curso');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: String(course.price),
      category: course.category,
      level: course.level,
      duration: course.duration,
      status: course.status,
      featured: course.featured,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete course');
      
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Curso excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erro ao excluir curso');
    }
  };

  const handleDuplicate = async (course: Course) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${course.title} (Cópia)`,
          description: course.description,
          instructor: course.instructor,
          price: course.price,
          category: course.category,
          level: course.level,
          duration: course.duration,
          status: 'draft',
          featured: false,
        }),
      });

      if (!response.ok) throw new Error('Failed to duplicate course');
      
      const duplicatedCourse = await response.json();
      setCourses([...courses, duplicatedCourse]);
      toast.success('Curso duplicado com sucesso!');
    } catch (error) {
      console.error('Error duplicating course:', error);
      toast.error('Erro ao duplicar curso');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      price: '',
      category: '',
      level: 'beginner',
      duration: '',
      status: 'draft',
      featured: false,
    });
    setEditingCourse(null);
  };

  const getStatusBadge = (status: Course['status']) => {
    const variants = {
      published: 'bg-green-500/20 text-green-300',
      draft: 'bg-yellow-500/20 text-yellow-300',
      archived: 'bg-gray-500/20 text-gray-300',
    };
    const labels = {
      published: 'Publicado',
      draft: 'Rascunho',
      archived: 'Arquivado',
    };
    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getLevelBadge = (level: Course['level']) => {
    const variants = {
      beginner: 'bg-blue-500/20 text-blue-300',
      intermediate: 'bg-purple-500/20 text-purple-300',
      advanced: 'bg-red-500/20 text-red-300',
    };
    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    };
    return (
      <Badge className={variants[level]}>
        {labels[level]}
      </Badge>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-light text-white/90">Gerenciar Cursos</h1>
          <p className="text-white/60">
            {courses.length} cursos cadastrados • {courses.filter(c => c.status === 'published').length} publicados
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="glass-button"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button
            className="glass-button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Curso
          </Button>
        </div>
      </div>

      {/* FASE 3: Filters responsivos para mobile */}
      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Buscar por título ou instrutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="glass-input w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="glass-pane">
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="Cirurgia Facial">Cirurgia Facial</SelectItem>
                <SelectItem value="Cirurgia Corporal">Cirurgia Corporal</SelectItem>
                <SelectItem value="Injetáveis">Injetáveis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="glass-input w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-pane">
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* FASE 3: Loading State melhorado com componente padronizado */}
      {loading && (
        <PageLoader message="Carregando cursos..." />
      )}

      {/* FASE 3: Grid responsivo para mobile */}
      {!loading && (
        <div className="responsive-grid">
          {filteredCourses.map((course) => (
          <GlassCard key={course.id} className="overflow-hidden">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-white/40" />
              </div>
              {course.featured && (
                <Badge className="absolute left-3 top-3 bg-yellow-500/90 text-black">
                  <Star className="mr-1 h-3 w-3" />
                  Destaque
                </Badge>
              )}
              <div className="absolute right-3 top-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="glass-button h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-pane" align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(course)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(course)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-400"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white/90">{course.title}</h3>
                {getStatusBadge(course.status)}
              </div>
              
              <p className="mb-3 line-clamp-2 text-sm text-white/60">
                {course.description}
              </p>

              <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
                <Users className="h-4 w-4" />
                <span>{course.instructor}</span>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white/90">{course.rating}</span>
                  <span className="text-sm text-white/60">({course.totalRatings})</span>
                </div>
                {getLevelBadge(course.level)}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-sm">
                <div>
                  <div className="text-white/60">Alunos</div>
                  <div className="font-medium text-white/90">{course.students}</div>
                </div>
                <div>
                  <div className="text-white/60">Duração</div>
                  <div className="font-medium text-white/90">{course.duration}</div>
                </div>
                <div>
                  <div className="text-white/60">Módulos</div>
                  <div className="font-medium text-white/90">{course.modules}</div>
                </div>
                <div>
                  <div className="text-white/60">Preço</div>
                  <div className="font-medium text-cyan-400">
                    R$ {course.price.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          ))}
        </div>
      )}

      {/* FASE 3: Empty State melhorado com componente padronizado */}
      {!loading && filteredCourses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Nenhum curso encontrado"
          description={
            searchTerm || filterCategory !== 'all' || filterStatus !== 'all' ? 
              'Tente ajustar os filtros ou termos de busca.' : 
              'Comece criando seu primeiro curso.'
          }
          action={{
            label: searchTerm || filterCategory !== 'all' || filterStatus !== 'all' ? 
              'Limpar filtros' : 'Criar Primeiro Curso',
            onClick: () => {
              if (searchTerm || filterCategory !== 'all' || filterStatus !== 'all') {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterStatus('all');
              } else {
                resetForm();
                setIsFormOpen(true);
              }
            }
          }}
        />
      )}

      {/* Course Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="glass-pane max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white/90">
              {editingCourse ? 'Editar Curso' : 'Novo Curso'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Preencha as informações do curso abaixo
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Título *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="glass-input"
                  placeholder="Ex: Facelift Mastery"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Instrutor *
                </label>
                <Input
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="glass-input"
                  placeholder="Ex: Dr. Robério Damasceno"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Descrição
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass-input min-h-[100px]"
                placeholder="Descreva o conteúdo do curso..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Preço (R$) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="glass-input"
                  placeholder="2997"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Categoria
                </label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="Cirurgia Facial">Cirurgia Facial</SelectItem>
                    <SelectItem value="Cirurgia Corporal">Cirurgia Corporal</SelectItem>
                    <SelectItem value="Injetáveis">Injetáveis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Nível
                </label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => setFormData({ ...formData, level: value as Course['level'] })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Duração
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="glass-input"
                  placeholder="Ex: 40 horas"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Status
                </label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value as Course['status'] })}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-pane">
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div>
                <label className="text-sm font-medium text-white/80">
                  Curso em Destaque
                </label>
                <p className="text-xs text-white/60">
                  Aparecer na página inicial
                </p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} className="glass-button">
              Cancelar
            </Button>
            <Button onClick={handleCreateOrUpdate} className="glass-button">
              {editingCourse ? 'Salvar Alterações' : 'Criar Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}