'use client';

import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Share2, 
  Download, 
  Bookmark, 
  ThumbsUp, 
  MessageSquare,
  FileText,
  Video,
  Image as ImageIcon,
  BookOpen,
  Heart,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { categoryColors, tagColors } from '@/lib/mock-data/archive';
import { toastHelpers } from '@/hooks/use-toast';

const getContentIcon = (tags: string[]) => {
  if (tags.includes('Vídeo')) return <Video className="w-5 h-5" />;
  if (tags.includes('Imagem')) return <ImageIcon className="w-5 h-5" />;
  if (tags.includes('PDF')) return <FileText className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
};

interface ArchiveDetailClientProps {
  archiveData: unknown;
}

export default function ArchiveDetailClient({ archiveData }: ArchiveDetailClientProps) {
    const [item, setItem] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);
    const [viewCount, setViewCount] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        setItem(archiveData);
        setViewCount((archiveData as any)?.views || 0);
        setLoading(false);
        
        // Simulate view increment (in real app, this would be an API call)
        if (archiveData) {
            setTimeout(() => {
                setViewCount(prev => prev + 1);
            }, 1000);
        }
    }, [archiveData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        
        // Simulate download
        try {
            // In a real app, this would download the actual file
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create a dummy file download
            const fileName = `${(item as any).title.replace(/\s+/g, '_')}_${(item as any).id}.pdf`;
            const content = `Título: ${(item as any).title}\n\nCategoria: ${(item as any).category}\n\nDescrição:\n${(item as any).description}\n\nFonte: ${(item as any).source}\n\nData: ${formatDate((item as any).createdAt)}`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            toastHelpers.success('Download realizado com sucesso!');
        } catch (error) {
            toastHelpers.error('Erro ao realizar o download');
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-white/10 rounded mb-4"></div>
                        <div className="h-64 bg-white/10 rounded"></div>
                        <div className="space-y-4">
                            <div className="h-6 bg-white/10 rounded w-3/4"></div>
                            <div className="h-4 bg-white/10 rounded w-full"></div>
                            <div className="h-4 bg-white/10 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
                <GlassCard className="p-8 max-w-md text-center">
                    <h2 className="text-xl font-semibold text-white/80 mb-2">Item não encontrado</h2>
                    <p className="text-white/60 mb-4">O item do arquivo solicitado não foi encontrado.</p>
                    <Link href="/archive">
                        <Button className="glass-button bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Arquivo
                        </Button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/archive">
                        <Button variant="ghost" className="glass-button hover:scale-105 transition-transform duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Arquivo
                        </Button>
                    </Link>
                </div>

                {/* Header Card */}
                <GlassCard className="p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Content Type and Actions */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                    {getContentIcon((item as any).tags)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={`text-xs px-2 py-1 ${categoryColors[(item as any).category] || categoryColors['Outros']}`}>
                                            {(item as any).category}
                                        </Badge>
                                        {(item as any).tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className={`text-xs px-2 py-1 ${tagColors[tag] || 'text-gray-400 border-gray-400/30 bg-gray-500/10'}`}>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-sm text-white/60">{(item as any).source}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        toggleFavorite({
                                            id: (item as any).id.toString(),
                                            type: 'archive',
                                            title: (item as any).title,
                                            url: `/archive/${(item as any).id}`,
                                            metadata: {
                                                specialty: (item as any).category,
                                                description: (item as any).description.split('\n')[0]
                                            }
                                        });
                                    }}
                                    className={`glass-button hover:scale-105 transition-transform duration-200 ${
                                        isFavorite((item as any).id.toString(), 'archive')
                                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' 
                                            : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${isFavorite((item as any).id.toString(), 'archive') ? 'fill-current' : ''}`} />
                                    {isFavorite((item as any).id.toString(), 'archive') ? 'Salvo' : 'Salvar'}
                                </Button>
                                <Button variant="outline" size="sm" className="glass-button bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform duration-200">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-light text-white/95 leading-tight">
                            {(item as any).title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate((item as any).createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{viewCount.toLocaleString('pt-BR')} visualizações</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Main Content */}
                <GlassCard className="p-6 md:p-8">
                    <div className="prose prose-invert max-w-none">
                        <div className="text-white/80 leading-relaxed space-y-4">
                            {(item as any).description.split('\n').map((paragraph: string, index: number) => {
                                // Handle markdown-style headers
                                if (paragraph.startsWith('### ')) {
                                    return (
                                        <h3 key={index} className="text-xl font-semibold text-white/90 mt-6 mb-3">
                                            {paragraph.replace('### ', '')}
                                        </h3>
                                    );
                                }
                                
                                // Handle bullet points
                                if (paragraph.startsWith('* ')) {
                                    return (
                                        <div key={index} className="flex items-start gap-2 ml-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                                            <span>{paragraph.replace('* ', '')}</span>
                                        </div>
                                    );
                                }
                                
                                // Regular paragraphs
                                if (paragraph.trim()) {
                                    return (
                                        <p key={index} className="leading-relaxed">
                                            {paragraph}
                                        </p>
                                    );
                                }
                                
                                return null;
                            })}
                        </div>
                    </div>
                </GlassCard>

                {/* Actions and Related */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Actions */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold text-white/90 mb-4">Ações</h3>
                        <div className="space-y-3">
                            <Button 
                                className="w-full glass-button bg-blue-400/20 hover:bg-blue-400/30 text-blue-300 hover:scale-105 transition-transform duration-200"
                                onClick={handleDownload}
                                disabled={isDownloading}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading ? 'Baixando...' : 'Baixar Conteúdo'}
                            </Button>
                            <Button variant="outline" className="w-full glass-button bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform duration-200">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Abrir Original
                            </Button>
                            <Button variant="outline" className="w-full glass-button bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform duration-200">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Comentar
                            </Button>
                        </div>
                    </GlassCard>

                    {/* Engagement */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold text-white/90 mb-4">Engajamento</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white/60">Visualizações</span>
                                <span className="text-white/90 font-medium">{viewCount.toLocaleString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60">Curtidas</span>
                                <span className="text-white/90 font-medium">{Math.round(viewCount * 0.15)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60">Comentários</span>
                                <span className="text-white/90 font-medium">{Math.round(viewCount * 0.05)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60">Compartilhamentos</span>
                                <span className="text-white/90 font-medium">{Math.round(viewCount * 0.03)}</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Interaction Section */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white/90">Avaliação</h3>
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="glass-button bg-green-500/20 hover:bg-green-500/30 text-green-300">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Útil
                            </Button>
                            <Button size="sm" variant="outline" className="glass-button bg-white/5 hover:bg-white/10">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Comentar
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-white/60">
                        Este conteúdo foi útil? Sua avaliação nos ajuda a melhorar o arquivo de conhecimento.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}