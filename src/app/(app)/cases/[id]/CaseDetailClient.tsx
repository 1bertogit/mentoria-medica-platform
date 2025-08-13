'use client';

import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, User, CheckCircle, FileText, Bot, ArrowLeft, Calendar, Star, Eye, ThumbsUp, Share2, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { caseDetails, timelineEvents } from '@/lib/mock-data/cases';
import { useFavorites } from '@/hooks/use-favorites';
import { CommentsSection } from '@/components/comments/comments-section';
import Image from 'next/image';

const getIconForEvent = (type: string) => {
    switch (type) {
        case 'submitted': return <FileText className="w-5 h-5 text-cyan-400" />;
        case 'assigned': return <User className="w-5 h-5 text-blue-400" />;
        case 'analysis': return <Bot className="w-5 h-5 text-purple-400" />;
        case 'feedback': return <MessageSquare className="w-5 h-5 text-orange-400" />;
        case 'updated': return <FileText className="w-5 h-5 text-green-400" />;
        case 'approved': return <CheckCircle className="w-5 h-5 text-green-400" />;
        default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
};

const statusColors: { [key: string]: string } = {
  'Em Análise': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  'Aprovado': 'bg-green-500/20 text-green-300 border-green-400/30',
  'Requer Revisão': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
};

interface CaseDetailClientProps {
  caseData?: unknown;
}

export default function CaseDetailClient({ caseData }: CaseDetailClientProps) {
    const [selectedCase, setSelectedCase] = useState<unknown>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        // In a real app, this would fetch from an API using the ID
        setSelectedCase(caseData || caseDetails);
        setEvents(timelineEvents);
        setLoading(false);
    }, [caseData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-white/10 rounded mb-4"></div>
                        <div className="h-64 bg-white/10 rounded"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="h-32 bg-white/10 rounded"></div>
                                <div className="h-48 bg-white/10 rounded"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-24 bg-white/10 rounded"></div>
                                <div className="h-32 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedCase) {
        return (
            <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
                <GlassCard className="p-8 max-w-md text-center">
                    <h2 className="text-xl font-semibold text-white/80 mb-2">Caso não encontrado</h2>
                    <p className="text-white/60 mb-4">O caso clínico solicitado não foi encontrado.</p>
                    <Link href="/cases">
                        <Button className="glass-button bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar aos Casos
                        </Button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/cases">
                        <Button variant="ghost" className="glass-button hover:scale-105 transition-transform duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar aos Casos
                        </Button>
                    </Link>
                </div>

                {/* Hero Section */}
                <GlassCard className="p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Title and Status */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-light text-white/95 leading-tight mb-3">
                                    {(selectedCase as any).title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>Por {(selectedCase as any).submittedBy}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate((selectedCase as any).submittedAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{(selectedCase as any).estimatedTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={`text-sm px-3 py-1 ${statusColors[(selectedCase as any).status]}`}>
                                    {(selectedCase as any).status}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        toggleFavorite({
                                            id: selectedCase.id.toString(),
                                            type: 'case',
                                            title: selectedCase.title,
                                            url: `/cases/${selectedCase.id}`,
                                            metadata: {
                                                author: selectedCase.submittedBy,
                                                specialty: selectedCase.specialty
                                            }
                                        });
                                    }}
                                    className={`glass-button hover:scale-105 transition-transform duration-200 ${
                                        isFavorite(selectedCase.id.toString(), 'case') 
                                            ? 'bg-red-500/20 text-red-300 border-red-400/30' 
                                            : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${isFavorite(selectedCase.id.toString(), 'case') ? 'fill-current' : ''}`} />
                                    {isFavorite(selectedCase.id.toString(), 'case') ? 'Salvo' : 'Salvar'}
                                </Button>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <div className="text-cyan-400 font-semibold">{selectedCase.specialty}</div>
                                <div className="text-xs text-white/60">Especialidade</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <div className="text-orange-400 font-semibold">{selectedCase.difficulty}</div>
                                <div className="text-xs text-white/60">Dificuldade</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <div className="text-green-400 font-semibold">{selectedCase.aiAnalysis.confidence}%</div>
                                <div className="text-xs text-white/60">Confiança IA</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <div className="text-purple-400 font-semibold">{selectedCase.estimatedTime}</div>
                                <div className="text-xs text-white/60">Duração</div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Case Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Case Presentation */}
                        <GlassCard className="p-6">
                            <h2 className="text-xl font-semibold text-white/90 mb-4">Apresentação do Caso</h2>
                            <p className="text-white/70 leading-relaxed">
                                {selectedCase.presentation}
                            </p>
                        </GlassCard>

                        {/* Clinical History */}
                        <GlassCard className="p-6">
                            <h2 className="text-xl font-semibold text-white/90 mb-4">Histórico Clínico</h2>
                            <p className="text-white/70 leading-relaxed">
                                {selectedCase.clinicalHistory}
                            </p>
                        </GlassCard>

                        {/* Physical Exam */}
                        <GlassCard className="p-6">
                            <h2 className="text-xl font-semibold text-white/90 mb-4">Exame Físico</h2>
                            <p className="text-white/70 leading-relaxed">
                                {selectedCase.physicalExam}
                            </p>
                        </GlassCard>

                        {/* AI Analysis */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white/90">Análise por IA</h2>
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                                    {selectedCase.aiAnalysis.confidence}% confiança
                                </Badge>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-white/80 mb-2">Diagnóstico Sugerido</h3>
                                    <p className="text-white/70">{selectedCase.aiAnalysis.suggestedDiagnosis}</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-medium text-white/80 mb-2">Recomendações</h3>
                                    <ul className="space-y-2">
                                        {selectedCase.aiAnalysis.recommendations.map((rec: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2 text-white/70">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Final Analysis */}
                        {selectedCase.analysis && (
                            <GlassCard className="p-6">
                                <h2 className="text-xl font-semibold text-white/90 mb-4">Análise do Mentor</h2>
                                <p className="text-white/70 leading-relaxed">
                                    {selectedCase.analysis}
                                </p>
                            </GlassCard>
                        )}
                    </div>

                    {/* Right Column - Timeline and Actions */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <GlassCard className="p-6">
                            <h3 className="text-lg font-semibold text-white/90 mb-4">Timeline do Caso</h3>
                            <div className="space-y-4">
                                {events.map((event, index) => (
                                    <div key={event.id} className="relative">
                                        {index !== events.length - 1 && (
                                            <div className="absolute left-6 top-12 w-0.5 h-8 bg-white/10"></div>
                                        )}
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                                {getIconForEvent(event.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-white/90 text-sm">
                                                    {event.title}
                                                </h4>
                                                <p className="text-xs text-white/60 mb-1">
                                                    {event.description}
                                                </p>
                                                <div className="text-xs text-white/40">
                                                    {formatDate(event.timestamp)} • {event.user}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Actions */}
                        <GlassCard className="p-6">
                            <h3 className="text-lg font-semibold text-white/90 mb-4">Ações</h3>
                            <div className="space-y-3">
                                <Button className="w-full glass-button bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 hover:scale-105 transition-transform duration-200">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Adicionar Comentário
                                </Button>
                                <Button variant="outline" className="w-full glass-button bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform duration-200">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Compartilhar Caso
                                </Button>
                                <Button variant="outline" className="w-full glass-button bg-white/5 hover:bg-white/10 hover:scale-105 transition-transform duration-200">
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    Avaliar Análise
                                </Button>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <CommentsSection 
                        resourceType="case"
                        resourceId={selectedCase.id}
                        currentUserId="1"
                    />
                </div>
            </div>
        </div>
    );
}