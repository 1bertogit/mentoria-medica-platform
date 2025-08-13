'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VideoUpload } from '@/components/ui/video-upload';
import { Play, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MentoriaLegacyPublicPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [showUploadArea, setShowUploadArea] = useState(false);

  // Remove Grammarly attributes to prevent hydration errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.body;
      const removeGrammarlyAttributes = () => {
        body.removeAttribute('data-new-gr-c-s-check-loaded');
        body.removeAttribute('data-gr-ext-installed');
      };
      
      // Remove immediately
      removeGrammarlyAttributes();
      
      // Also observe for changes in case Grammarly adds them back
      const observer = new MutationObserver(removeGrammarlyAttributes);
      observer.observe(body, { attributes: true, attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'] });
      
      return () => observer.disconnect();
    }
  }, []);

  const handleVideoUploaded = (videoUrl: string) => {
    setCustomVideoUrl(videoUrl);
    setIsVideoPlaying(true);
    setShowUploadArea(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>

          <Button
            onClick={() => setShowUploadArea(!showUploadArea)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            📹 Admin
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Mentoria Exclusiva
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Tudo Sobre a{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Mentoria Legacy
              </span>
            </h1>
          </div>
        </div>

        {/* Video Upload Area (Admin) */}
        {showUploadArea && (
          <div className="container mx-auto px-4 pb-8">
            <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-center text-lg font-semibold text-card-foreground">
                Upload do Vídeo da Mentoria
              </h3>
              <VideoUpload
                onVideoUploaded={handleVideoUploaded}
                maxSizeMB={1024}
                acceptedFormats={['mp4', 'webm', 'mov']}
              />
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setShowUploadArea(false)}
                  variant="ghost"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Video Section */}
        <div className="container mx-auto px-4 pb-12">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {customVideoUrl ? (
                // Custom Uploaded Video
                <div className="aspect-video bg-black">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    preload="metadata"
                  >
                    <source src={customVideoUrl} type="video/mp4" />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                </div>
              ) : !isVideoPlaying ? (
                // Video Thumbnail
                <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-background/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-background md:h-24 md:w-24"
                    >
                      <Play
                        className="ml-1 h-8 w-8 text-foreground md:h-10 md:w-10"
                        fill="currentColor"
                      />
                      <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 md:p-8">
                    <h3 className="text-xl font-bold text-foreground md:text-2xl">
                      Apresentação da Mentoria Legacy
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">
                      Conheça todos os detalhes do programa mais completo de
                      formação em cirurgia plástica
                    </p>
                  </div>
                </div>
              ) : (
                // YouTube Video Player
                <div className="aspect-video bg-black">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/SEU_VIDEO_ID_AQUI?autoplay=1"
                    title="Mentoria Legacy - Apresentação"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="container mx-auto px-4 pb-8">
          <div className="mx-auto max-w-5xl text-center">
            <Button
              onClick={() => alert('Redirecionando para inscrição...')}
              size="lg"
              className="h-14 bg-primary px-12 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Quero Participar
            </Button>
          </div>
        </div>

        {/* Video Timestamps */}
        <div className="container mx-auto px-4 pb-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
              {/* Header */}
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-foreground px-6 py-2">
                  <span className="text-sm font-medium text-background">
                    Transcrição
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-4">
                {[
                  { time: '0:00:00', title: 'Evolução das Técnicas' },
                  { time: '0:01:15', title: 'Mentoria e Atualizações' },
                  { time: '0:02:24', title: 'Aprendizado Prático' },
                  { time: '0:03:29', title: 'Necessidades dos Alunos' },
                  { time: '0:04:51', title: 'Resultados e Segurança' },
                  { time: '0:06:50', title: 'Desafios na Cirurgia' },
                  { time: '0:09:27', title: 'Evolução Contínua' },
                  { time: '0:11:35', title: 'Mentoria Personalizada' },
                  { time: '0:13:19', title: 'Técnicas de Descolamento' },
                  { time: '0:14:53', title: 'Instrumentais Cirúrgicos' },
                  { time: '0:17:48', title: 'Plataforma e Benefícios' },
                  { time: '0:19:37', title: 'Estratégias de Lifting' },
                  { time: '0:26:49', title: 'Mistura de Técnicas' },
                  { time: '0:29:27', title: 'Mentoria Personalizada' },
                  { time: '0:31:34', title: 'Cicatrizes e Resultados' },
                  { time: '0:35:58', title: 'Discussão Individual' },
                  { time: '0:37:46', title: 'Nova Plataforma' },
                  { time: '0:44:31', title: 'Desenvolvimento do Projeto' },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => alert(`Pulando para ${item.time}`)}
                    className="flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-mono text-sm text-primary">
                      {item.time}
                    </span>
                    <span className="text-sm text-foreground">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Optimized Spacing */}
        <div className="pb-8 md:pb-12" />
      </div>
    </div>
  );
}
