'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageSquare, Tag, Send } from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Cirurgia Plástica',
  'Medicina Estética', 
  'Dermatologia',
  'Regulamentação',
  'Técnicas',
  'Equipamentos'
];

export default function NewDiscussionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would send to an API
    setTimeout(() => {
      router.push('/discussions');
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/discussions">
          <Button variant="ghost" className="glass-button hover:scale-105 transition-transform">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Discussões
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-light text-white/90">Nova Discussão</h1>
        </div>
        <p className="text-white/60">
          Inicie uma nova discussão com a comunidade de profissionais
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/90">
              Título da Discussão *
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título claro e descritivo"
              className="glass-input"
              required
            />
            <p className="text-xs text-white/50">
              Use um título que resuma o tópico da discussão
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/90">
              Categoria *
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="glass-input">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="glass-pane">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white/90">
              Conteúdo *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o tópico que deseja discutir..."
              className="glass-input min-h-[200px]"
              required
            />
            <p className="text-xs text-white/50">
              Seja claro e forneça contexto suficiente para iniciar uma discussão produtiva
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white/90">
              Tags
            </Label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Adicione tags separadas por vírgula"
                className="glass-input pl-12"
              />
            </div>
            <p className="text-xs text-white/50">
              Exemplo: rinoplastia, técnica cirúrgica, pós-operatório
            </p>
          </div>

          {/* Guidelines */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
            <h3 className="font-medium text-blue-300 mb-2">Diretrizes da Comunidade</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Seja respeitoso e profissional em suas interações</li>
              <li>• Evite compartilhar informações pessoais de pacientes</li>
              <li>• Baseie suas discussões em evidências científicas</li>
              <li>• Mantenha o foco no aprendizado e troca de experiências</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-white/50">
              * Campos obrigatórios
            </p>
            <div className="flex items-center gap-3">
              <Link href="/discussions">
                <Button variant="outline" className="glass-button">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!title.trim() || !category || !content.trim() || isSubmitting}
                className="glass-button bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Publicando...' : 'Publicar Discussão'}
              </Button>
            </div>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}