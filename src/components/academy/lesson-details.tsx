'use client';

import { useState } from 'react';
import { BookOpen, Clock, FileText, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lesson } from '@/lib/mock-data/academy';
import { cn } from '@/lib/utils';

interface LessonDetailsProps {
  lesson: Lesson;
  moduleTitle: string;
  lessonNumber: string;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  hasPreviousLesson?: boolean;
}

export function LessonDetails({
  lesson,
  moduleTitle,
  lessonNumber,
  onPreviousLesson,
  onNextLesson,
  hasNextLesson,
  hasPreviousLesson,
}: LessonDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleDownloadMaterials = () => {
    console.log('Downloading materials...');
    // In a real implementation, this would trigger a download
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 md:p-8">
      {/* Lesson Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
            {lesson.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{moduleTitle} - {lessonNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{lesson.duration}</span>
            </div>
            {lesson.materials && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{lesson.materials.length} materiais</span>
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        {lesson.materials && lesson.materials.length > 0 && (
          <Button
            onClick={handleDownloadMaterials}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105 w-full md:w-auto flex-shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Baixar Materiais</span>
            <span className="sm:hidden">Materiais</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 p-1 rounded-lg text-xs md:text-sm">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="materials"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400"
          >
            Materiais
          </TabsTrigger>
          <TabsTrigger 
            value="notes"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400"
          >
            Anotações
          </TabsTrigger>
          <TabsTrigger 
            value="qa"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400"
          >
            Q&A
          </TabsTrigger>
          <TabsTrigger 
            value="transcript"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400"
          >
            Transcrição
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <div className="text-slate-300 leading-relaxed">
              <h3 className="text-lg font-medium text-white mb-4">Sobre esta aula</h3>
              <p className="mb-6">{lesson.description}</p>
              
              <h4 className="text-base font-medium text-slate-200 mb-3">Objetivos de Aprendizagem:</h4>
              <ul className="list-disc list-inside space-y-2 mb-6 text-slate-300">
                <li>Compreender as indicações e contraindicações da técnica endoscópica</li>
                <li>Dominar o posicionamento dos portais de acesso</li>
                <li>Executar a dissecção subperiosteal com segurança</li>
                <li>Identificar e preservar estruturas neurovasculares importantes</li>
                <li>Realizar a fixação adequada dos tecidos elevados</li>
              </ul>
              
              <h4 className="text-base font-medium text-slate-200 mb-3">Pontos-Chave:</h4>
              <div className="text-slate-300 space-y-1">
                <p>• Sempre verificar a integridade do nervo supraorbital</p>
                <p>• Manter dissecção no plano subperiosteal</p>
                <p>• Fixação em múltiplos pontos para resultado duradouro</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials" className="mt-0">
            {lesson.materials && lesson.materials.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white mb-4">Materiais da Aula</h3>
                {lesson.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <span className="text-slate-200">{material}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-slate-300 hover:bg-white/15"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum material disponível para esta aula.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Funcionalidade de anotações em desenvolvimento.</p>
            </div>
          </TabsContent>

          <TabsContent value="qa" className="mt-0">
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Seção de perguntas e respostas em desenvolvimento.</p>
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="mt-0">
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Transcrição da aula em desenvolvimento.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-white/10 gap-4">
        <Button
          variant="outline"
          onClick={onPreviousLesson}
          disabled={!hasPreviousLesson}
          className={cn(
            "bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:text-white transition-all w-full sm:w-auto",
            hasPreviousLesson && "hover:-translate-x-1"
          )}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Aula Anterior
        </Button>

        <Button
          onClick={onNextLesson}
          disabled={!hasNextLesson}
          className={cn(
            "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all w-full sm:w-auto",
            hasNextLesson && "hover:translate-x-1 shadow-lg shadow-blue-500/20"
          )}
        >
          Próxima Aula
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}