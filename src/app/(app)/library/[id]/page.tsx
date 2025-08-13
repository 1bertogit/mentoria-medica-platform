import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Download,
  MessageSquare,
  Calendar,
  User,
  BookOpen,
  Star,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { scientificArticles } from '@/lib/mock-data/library';
import { CommentsSection } from '@/components/comments/comments-section';
import { AdminMetrics } from '@/components/library/admin-metrics';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = scientificArticles.find(a => a.id.toString() === id);

  if (!article) {
    return {
      title: 'Artigo não encontrado',
    };
  }

  return {
    title: article.title,
    description: article.abstract,
  };
}

const specialtyColors: { [key: string]: string } = {
  Rinoplastia: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  Mamoplastia: 'text-pink-400 border-pink-400/30 bg-pink-500/10',
  Blefaroplastia: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
  Lifting: 'text-orange-400 border-orange-400/30 bg-orange-500/10',
  Outros: 'text-gray-400 border-gray-400/30 bg-gray-500/10',
};

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = scientificArticles.find(a => a.id.toString() === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/library">
          <Button
            variant="ghost"
            className="glass-button transition-transform hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Biblioteca
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <GlassCard className="mb-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-64 lg:h-80 lg:w-96 lg:flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm text-white/60">Artigo Científico</p>
                <p className="text-xs text-white/40 mt-1">{article.specialty}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <Badge
              variant="outline"
              className={`self-start ${specialtyColors[article.specialty as keyof typeof specialtyColors]}`}
            >
              {article.specialty}
            </Badge>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white/95 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-2 text-cyan-300">
              <User className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{article.authors}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{article.journal}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{article.year}</span>
              </div>
              {article.impactFactor > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                  <span className="whitespace-nowrap">Fator: {article.impactFactor}</span>
                </div>
              )}
              {article.pages && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{article.pages} pág.</span>
                </div>
              )}
            </div>

            {/* DOI e Tags */}
            {article.doi && (
              <div className="text-sm text-white/60">
                <span className="font-medium">DOI:</span>{' '}
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 transition-colors hover:text-cyan-300 break-all"
                >
                  {article.doi}
                </a>
              </div>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => {
                  // Define cores especiais para cada tipo de tag
                  let tagStyle = "border-white/20 bg-white/5 text-white/70";
                  let hoverStyle = "hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300";
                  
                  if (tag === 'Literatura Fundamental') {
                    tagStyle = "border-yellow-400/30 bg-yellow-500/10 text-yellow-400";
                    hoverStyle = "hover:bg-yellow-500/20 hover:border-yellow-400/50 hover:text-yellow-300";
                  } else if (tag === 'PubMed') {
                    tagStyle = "border-blue-400/30 bg-blue-500/10 text-blue-400";
                    hoverStyle = "hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-blue-300";
                  } else if (tag === 'Rejuvenescimento' || tag === 'SMAS') {
                    tagStyle = "border-purple-400/30 bg-purple-500/10 text-purple-400";
                    hoverStyle = "hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-purple-300";
                  }
                  
                  return (
                    <Link
                      key={index}
                      href={`/library?tag=${encodeURIComponent(tag)}`}
                      className="inline-block"
                    >
                      <Badge
                        variant="outline"
                        className={`${tagStyle} text-xs cursor-pointer transition-all ${hoverStyle} hover:scale-105 hover:shadow-lg`}
                      >
                        {tag === 'Literatura Fundamental' && (
                          <Star className="mr-1 h-3 w-3 fill-current" />
                        )}
                        {tag === 'PubMed' && (
                          <BookOpen className="mr-1 h-3 w-3" />
                        )}
                        {(tag === 'Rejuvenescimento' || tag === 'SMAS') && (
                          <FileText className="mr-1 h-3 w-3" />
                        )}
                        {tag}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4">
              {article.downloadLink && (
                <a
                  href={article.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="glass-button bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30">
                    <Download className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                    {article.pages && <span className="hidden md:inline"> ({article.pages} pág.)</span>}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Article Content */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-3">
        <div className="space-y-6 lg:space-y-8 xl:col-span-2">
          {/* Abstract */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg sm:text-xl font-semibold text-white/90">Resumo</h2>
            <p className="leading-relaxed text-white/70 text-sm sm:text-base">{article.abstract}</p>
          </GlassCard>

          {/* Full Article Info */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg sm:text-xl font-semibold text-white/90">
              Informações do Artigo
            </h2>
            <div className="space-y-4">
              {article.pages && (
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white/90">
                      Extensão do Material
                    </p>
                    <p className="text-sm text-white/60">
                      {article.pages} páginas de conteúdo detalhado
                    </p>
                  </div>
                </div>
              )}

              {article.downloadLink && (
                <div className="flex items-start gap-2">
                  <Download className="mt-0.5 h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white/90">
                      Acesso ao Material
                    </p>
                    <p className="text-sm text-white/60 break-all">
                      {article.downloadLink}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <p className="text-sm leading-relaxed text-white/70">
                  Este material faz parte da curadoria especial do Dr. Robério
                  Brandao, selecionado como literatura fundamental para formação
                  em cirurgia facial.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Comments Section */}
          <div id="discussao">
            <CommentsSection
              resourceType="article"
              resourceId={id}
              currentUserId="1"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 xl:col-span-1">
          {/* Related Articles */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base sm:text-lg font-semibold text-white/90">
              <BookOpen className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              Artigos Relacionados
            </h3>
            <div className="space-y-3">
              {scientificArticles
                .filter(
                  a => a.id !== article.id && a.specialty === article.specialty
                )
                .slice(0, 3)
                .map(relatedArticle => (
                  <Link
                    key={relatedArticle.id}
                    href={`/library/${relatedArticle.id}`}
                    className="group block"
                  >
                    <div className="rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10">
                      <h4 className="line-clamp-2 text-sm font-medium text-white/85 transition-colors group-hover:text-cyan-400">
                        {relatedArticle.title}
                      </h4>
                      <p className="mt-1 text-xs text-white/60">
                        {relatedArticle.year}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </GlassCard>

          {/* Admin Metrics - Only visible to administrators */}
          <AdminMetrics 
            views={article.views}
            discussions={article.discussions}
            impactFactor={article.impactFactor}
          />
        </div>
      </div>
    </div>
  );
}
