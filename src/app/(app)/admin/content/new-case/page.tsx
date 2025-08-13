'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PlusCircle,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  ArrowLeft,
  Save,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function NewCasePage() {
  const [formData, setFormData] = useState({
    title: '',
    specialty: '',
    description: '',
    patientAge: '',
    patientGender: '',
    procedure: '',
    complications: '',
    outcome: '',
    learnings: '',
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialties = [
    'Rinoplastia',
    'Mamoplastia',
    'Blefaroplastia',
    'Lifting Facial',
    'Lipoaspiração',
    'Abdominoplastia',
    'Outros',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Caso clínico submetido com sucesso!');
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full" role="region" aria-label="Novo caso clínico">
      {/* Header */}
      <section className="mb-8" aria-label="Cabeçalho do novo caso">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="glass-button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                <PlusCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-900 dark:text-white/90">
                  Novo Caso Clínico
                </h1>
                <p className="text-gray-600 dark:text-white/60">
                  Compartilhe sua experiência com outros profissionais
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glass-button">
              <Eye className="mr-2 h-4 w-4" />
              Pré-visualizar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="glass-button bg-green-500/20 text-green-300 hover:bg-green-500/30"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Enviando...' : 'Publicar Caso'}
            </Button>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="space-y-6 lg:col-span-2">
            {/* Informações básicas */}
            <GlassCard className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white/90">
                Informações Básicas
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white/80">
                    Título do Caso *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Rinoplastia secundária com enxerto costal"
                    className="glass-input mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="specialty" className="text-white/80">
                      Especialidade *
                    </Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={value =>
                        handleInputChange('specialty', value)
                      }
                    >
                      <SelectTrigger className="glass-input mt-1">
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent className="glass-pane">
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="procedure" className="text-white/80">
                      Procedimento
                    </Label>
                    <Input
                      id="procedure"
                      value={formData.procedure}
                      onChange={e =>
                        handleInputChange('procedure', e.target.value)
                      }
                      placeholder="Nome específico do procedimento"
                      className="glass-input mt-1"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Descrição do caso */}
            <GlassCard className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white/90">
                Descrição do Caso
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-white/80">
                    Descrição Detalhada *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Descreva o caso, histórico do paciente, indicações, técnica utilizada..."
                    className="glass-input mt-1 min-h-[120px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="complications" className="text-white/80">
                    Complicações (se houver)
                  </Label>
                  <Textarea
                    id="complications"
                    value={formData.complications}
                    onChange={e =>
                      handleInputChange('complications', e.target.value)
                    }
                    placeholder="Descreva complicações encontradas e como foram resolvidas"
                    className="glass-input mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="outcome" className="text-white/80">
                    Resultado e Evolução
                  </Label>
                  <Textarea
                    id="outcome"
                    value={formData.outcome}
                    onChange={e => handleInputChange('outcome', e.target.value)}
                    placeholder="Descreva o resultado final e evolução do paciente"
                    className="glass-input mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="learnings" className="text-white/80">
                    Aprendizados e Conclusões
                  </Label>
                  <Textarea
                    id="learnings"
                    value={formData.learnings}
                    onChange={e =>
                      handleInputChange('learnings', e.target.value)
                    }
                    placeholder="Compartilhe os principais aprendizados deste caso"
                    className="glass-input mt-1"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Anexos */}
            <GlassCard className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white/90">
                Anexos e Mídia
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="glass-button h-24 flex-col gap-2"
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-sm">Adicionar Imagens</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="glass-button h-24 flex-col gap-2"
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-sm">Adicionar Vídeos</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="glass-button h-24 flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Documentos</span>
                  </Button>
                </div>

                <p className="text-sm text-white/60">
                  Formatos aceitos: JPG, PNG, MP4, PDF. Tamanho máximo: 50MB por
                  arquivo.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-6">
            {/* Dados do paciente */}
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white/90">
                Dados do Paciente
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patientAge" className="text-white/80">
                    Idade
                  </Label>
                  <Input
                    id="patientAge"
                    value={formData.patientAge}
                    onChange={e =>
                      handleInputChange('patientAge', e.target.value)
                    }
                    placeholder="Ex: 35 anos"
                    className="glass-input mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="patientGender" className="text-white/80">
                    Gênero
                  </Label>
                  <Select
                    value={formData.patientGender}
                    onValueChange={value =>
                      handleInputChange('patientGender', value)
                    }
                  >
                    <SelectTrigger className="glass-input mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="glass-pane">
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="nao-informado">
                        Não informado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>

            {/* Status e configurações */}
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white/90">
                Configurações
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Status</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">
                    Rascunho
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/80">Visibilidade</span>
                  <Badge className="bg-green-500/20 text-green-300">
                    Público
                  </Badge>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-white/60">
                    Este caso será revisado pela equipe antes da publicação.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Dicas */}
            <GlassCard className="bg-blue-500/5 p-6">
              <h3 className="mb-3 text-lg font-semibold text-blue-300">
                💡 Dicas para um bom caso
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Use imagens de alta qualidade</li>
                <li>• Descreva a técnica detalhadamente</li>
                <li>• Inclua complicações e soluções</li>
                <li>• Compartilhe aprendizados</li>
                <li>• Respeite a privacidade do paciente</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </form>
    </div>
  );
}
