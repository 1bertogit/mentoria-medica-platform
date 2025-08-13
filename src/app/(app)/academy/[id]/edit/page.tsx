'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Video,
  FileText,
  Scissors,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAcademy } from '@/contexts/academy-context';
import { LessonStatus, LessonStatusLegend } from '@/components/academy/lesson-status';
import { VideoUpload } from '@/components/video/video-upload';
import Link from 'next/link';
import type { CurriculumModule, Lesson } from '@/lib/mock-data/academy';

interface EditCoursPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({
  params: paramsPromise,
}: EditCoursPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { isAdmin } = useAuth();
  const {
    currentCourse,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    getCourse,
    saveCourse,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
    reorderModules,
  } = useAcademy();

  // Dialog states
  const [moduleDialog, setModuleDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<CurriculumModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Form states
  const [moduleForm, setModuleForm] = useState({ title: '' });
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    type: 'video',
    locked: true,
    duration: '',
    videoUrl: '',
  });
  const [videoInputType, setVideoInputType] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    loadCourse();
  }, [params.id]);

  const loadCourse = async () => {
    try {
      const data = await getCourse(parseInt(params.id));
      if (!data) {
        toast.error('Curso não encontrado');
        router.push('/academy');
      }
    } catch (error) {
      toast.error('Erro ao carregar curso');
      router.push('/academy');
    }
  };

  const handleSaveCourse = async () => {
    if (!currentCourse) return;
    await saveCourse(currentCourse);
  };

  const handleUpdateCourseField = (field: string, value: string) => {
    if (!currentCourse) return;
    
    const updatedCourse = { ...currentCourse, [field]: value };
    // This will be handled by the context
  };

  const handleAddModule = async () => {
    if (!currentCourse || !moduleForm.title.trim()) return;

    const success = await addModule(currentCourse.id, {
      title: moduleForm.title,
      lessons: [],
    });

    if (success) {
      setModuleDialog(false);
      setModuleForm({ title: '' });
    }
  };

  const handleUpdateModule = async () => {
    if (!currentCourse || !editingModule || !moduleForm.title.trim()) return;

    const success = await updateModule(currentCourse.id, editingModule.id!, {
      title: moduleForm.title,
    });

    if (success) {
      setModuleDialog(false);
      setEditingModule(null);
      setModuleForm({ title: '' });
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!currentCourse) return;

    if (confirm('Tem certeza que deseja excluir este módulo e todas as suas aulas?')) {
      await deleteModule(currentCourse.id, moduleId);
    }
  };

  const handleAddLesson = async () => {
    if (!currentCourse || !selectedModuleId || !lessonForm.title?.trim()) return;

    const success = await addLesson(currentCourse.id, selectedModuleId, lessonForm as Lesson);

    if (success) {
      setLessonDialog(false);
      setLessonForm({
        title: '',
        description: '',
        type: 'video',
        locked: true,
        duration: '',
        videoUrl: '',
      });
      setVideoInputType('url');
    }
  };

  const handleUpdateLesson = async () => {
    if (!currentCourse || !selectedModuleId || !editingLesson || !lessonForm.title?.trim()) return;

    const success = await updateLesson(currentCourse.id, selectedModuleId, editingLesson.id!, lessonForm);

    if (success) {
      setLessonDialog(false);
      setEditingLesson(null);
      setLessonForm({
        title: '',
        description: '',
        type: 'video',
        locked: true,
        duration: '',
        videoUrl: '',
      });
      setVideoInputType('url');
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!currentCourse) return;

    if (confirm('Tem certeza que deseja excluir esta aula?')) {
      await deleteLesson(currentCourse.id, moduleId, lessonId);
    }
  };

  const handleToggleLessonLock = async (moduleId: string, lessonId: string, currentLocked: boolean) => {
    if (!currentCourse) return;
    
    await updateLesson(currentCourse.id, moduleId, lessonId, { locked: !currentLocked });
  };

  const moveModule = async (moduleId: string, direction: 'up' | 'down') => {
    if (!currentCourse) return;

    const moduleIds = currentCourse.curriculum.map(m => m.id!);
    const index = moduleIds.indexOf(moduleId);

    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === moduleIds.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [moduleIds[index], moduleIds[newIndex]] = [moduleIds[newIndex], moduleIds[index]];

    await reorderModules(currentCourse.id, moduleIds);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'ebook':
        return <FileText className="h-4 w-4" />;
      case 'cirurgia':
        return <Scissors className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400"></div>
          <p className="mt-4 text-white/60">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!currentCourse || !isAdmin) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <p className="text-white/60">
            {!currentCourse ? 'Curso não encontrado' : 'Acesso negado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/academy">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white/95">Editar Curso</h1>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-yellow-400/50 bg-yellow-500/10 text-yellow-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Não salvo
                </Badge>
              )}
            </div>
            <p className="text-white/60">
              Gerencie o conteúdo e módulos do curso
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/academy/${currentCourse.id}`}>
            <Button variant="outline" className="glass-button">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Button 
            onClick={handleSaveCourse} 
            disabled={isSaving || !hasUnsavedChanges}
            className="glass-button bg-green-500/20 hover:bg-green-500/30 text-green-300"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-green-300/30 border-t-green-300"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Course Details */}
      <GlassCard className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-white/90">Informações do Curso</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="title" className="text-white/80">Título</Label>
            <Input
              id="title"
              value={currentCourse.title}
              onChange={e => handleUpdateCourseField('title', e.target.value)}
              className="glass-input"
            />
          </div>
          <div>
            <Label htmlFor="instructor" className="text-white/80">Instrutor</Label>
            <Input
              id="instructor"
              value={currentCourse.instructor}
              onChange={e => handleUpdateCourseField('instructor', e.target.value)}
              className="glass-input"
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-white/80">Preço</Label>
            <Input
              id="price"
              value={currentCourse.price}
              onChange={e => handleUpdateCourseField('price', e.target.value)}
              className="glass-input"
            />
          </div>
          <div>
            <Label htmlFor="duration" className="text-white/80">Duração</Label>
            <Input
              id="duration"
              value={currentCourse.duration}
              onChange={e => handleUpdateCourseField('duration', e.target.value)}
              className="glass-input"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-white/80">Descrição</Label>
            <Textarea
              id="description"
              value={currentCourse.description}
              onChange={e => handleUpdateCourseField('description', e.target.value)}
              rows={4}
              className="glass-input"
            />
          </div>
        </div>
      </GlassCard>

      {/* Modules and Lessons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white/90">Módulos e Aulas</h2>
            <p className="text-sm text-white/60">
              {currentCourse.curriculum.length} módulos • {currentCourse.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0)} aulas
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingModule(null);
              setModuleForm({ title: '' });
              setModuleDialog(true);
            }}
            className="glass-button bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Módulo
          </Button>
        </div>

        {/* Legend */}
        <LessonStatusLegend />

        {currentCourse.curriculum.map((module, moduleIndex) => (
          <GlassCard key={module.id} className="p-6">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white/90">{module.title}</h3>
                <p className="text-sm text-white/60">
                  {module.lessons.length} aula{module.lessons.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveModule(module.id!, 'up')}
                  disabled={moduleIndex === 0}
                  className="glass-button"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveModule(module.id!, 'down')}
                  disabled={moduleIndex === currentCourse.curriculum.length - 1}
                  className="glass-button"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingModule(module);
                    setModuleForm({ title: module.title });
                    setModuleDialog(true);
                  }}
                  className="glass-button"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass-button text-red-400 hover:text-red-300"
                  onClick={() => handleDeleteModule(module.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {module.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getLessonIcon(lesson.type)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white/90 truncate">{lesson.title}</p>
                      <p className="text-sm text-white/60 line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {lesson.duration && (
                      <Badge variant="outline" className="text-xs">{lesson.duration}</Badge>
                    )}
                    <LessonStatus
                      status={lesson.locked ? 'locked' : 'available'}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setSelectedModuleId(module.id!);
                        setLessonForm(lesson);
                        setLessonDialog(true);
                      }}
                      className="glass-button h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="glass-button h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteLesson(module.id!, lesson.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full glass-button"
                onClick={() => {
                  setEditingLesson(null);
                  setSelectedModuleId(module.id!);
                  setLessonForm({
                    title: '',
                    description: '',
                    type: 'video',
                    locked: true,
                    duration: '',
                    videoUrl: '',
                  });
                  setLessonDialog(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Aula
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Module Dialog */}
      <Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Editar Módulo' : 'Adicionar Módulo'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="module-title">Título do Módulo</Label>
              <Input
                id="module-title"
                value={moduleForm.title}
                onChange={e => setModuleForm({ title: e.target.value })}
                placeholder="Ex: Módulo 1: Introdução"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={editingModule ? handleUpdateModule : handleAddModule}
            >
              {editingModule ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Editar Aula' : 'Adicionar Aula'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson-title">Título da Aula</Label>
              <Input
                id="lesson-title"
                value={lessonForm.title}
                onChange={e =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                placeholder="Ex: Anatomia Aplicada"
              />
            </div>
            <div>
              <Label htmlFor="lesson-description">Descrição</Label>
              <Textarea
                id="lesson-description"
                value={lessonForm.description}
                onChange={e =>
                  setLessonForm({ ...lessonForm, description: e.target.value })
                }
                placeholder="Descreva o conteúdo da aula..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lesson-type">Tipo</Label>
                <Select
                  value={lessonForm.type}
                  onValueChange={value =>
                    setLessonForm({ ...lessonForm, type: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="ebook">E-book</SelectItem>
                    <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lesson-duration">Duração</Label>
                <Input
                  id="lesson-duration"
                  value={lessonForm.duration}
                  onChange={e =>
                    setLessonForm({ ...lessonForm, duration: e.target.value })
                  }
                  placeholder="Ex: 45 min"
                />
              </div>
            </div>
            {lessonForm.type === 'video' && (
              <div className="space-y-4">
                <div>
                  <Label>Método de Vídeo</Label>
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      variant={videoInputType === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVideoInputType('url')}
                    >
                      URL/Link
                    </Button>
                    <Button
                      type="button"
                      variant={
                        videoInputType === 'upload' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setVideoInputType('upload')}
                    >
                      Upload de Arquivo
                    </Button>
                  </div>
                </div>

                {videoInputType === 'url' ? (
                  <div>
                    <Label htmlFor="lesson-video">URL do Vídeo</Label>
                    <Input
                      id="lesson-video"
                      value={lessonForm.videoUrl}
                      onChange={e =>
                        setLessonForm({
                          ...lessonForm,
                          videoUrl: e.target.value,
                        })
                      }
                      placeholder="https://youtube.com/embed/... ou https://vimeo.com/..."
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Cole a URL de incorporação (embed) do YouTube, Vimeo ou
                      outro serviço
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label>Upload de Vídeo</Label>
                    <VideoUpload
                      category="cursos"
                      maxSize={2000} // 2GB
                      onUploadComplete={videoKey => {
                        setLessonForm({
                          ...lessonForm,
                          videoUrl: `https://facelift-medical-platform.s3.amazonaws.com/${videoKey}`,
                        });
                        toast.success('Vídeo enviado com sucesso!');
                      }}
                      onUploadError={error => {
                        toast.error(`Erro no upload: ${error}`);
                      }}
                    />
                    {lessonForm.videoUrl && videoInputType === 'upload' && (
                      <div className="mt-2 rounded bg-green-500/10 p-2 text-sm text-green-400">
                        ✅ Vídeo carregado com sucesso
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lesson-locked"
                checked={lessonForm.locked}
                onChange={e =>
                  setLessonForm({ ...lessonForm, locked: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="lesson-locked" className="text-white/80">
                Requer compra do curso para acessar
              </Label>
            </div>
            <div className="text-xs text-white/50 bg-white/5 rounded p-2">
              <p><strong>Dica:</strong> Aulas marcadas como "Requer compra" só ficam disponíveis após o pagamento. Aulas livres podem ser acessadas por qualquer usuário.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={editingLesson ? handleUpdateLesson : handleAddLesson}
            >
              {editingLesson ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
