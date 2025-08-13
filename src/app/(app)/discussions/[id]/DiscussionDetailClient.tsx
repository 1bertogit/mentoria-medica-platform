'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  Heart, 
  Clock, 
  Pin,
  Reply,
  MoreVertical,
  Flag,
  Edit,
  Trash,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import { type Discussion } from '@/lib/mock-data/comments';
import Image from 'next/image';

interface DiscussionDetailClientProps {
  discussion: Discussion;
}

interface Reply {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export default function DiscussionDetailClient({ discussion }: DiscussionDetailClientProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [likes, setLikes] = useState(discussion.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([
    {
      id: '1',
      author: {
        id: '2',
        name: 'Dr. Carlos Mendes',
        avatar: '/avatars/carlos-mendes.jpg',
        title: 'Cirurgião Plástico'
      },
      content: 'Excelente ponto de vista! Já tive experiências similares com essa técnica e concordo plenamente com sua abordagem. Gostaria de adicionar que a preparação pré-operatória também é fundamental para o sucesso.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      isLiked: false
    },
    {
      id: '2',
      author: {
        id: '3',
        name: 'Dra. Marina Santos',
        avatar: '/avatars/marina-santos.jpg',
        title: 'Dermatologista'
      },
      content: 'Muito interessante! Você poderia compartilhar mais detalhes sobre o protocolo pós-operatório que utiliza? Estou sempre buscando aprimorar minhas técnicas.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      isLiked: true
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleReplyLike = (replyId: string) => {
    setReplies(prev => prev.map(reply => 
      reply.id === replyId 
        ? { 
            ...reply, 
            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
            isLiked: !reply.isLiked 
          }
        : reply
    ));
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      author: {
        id: '1',
        name: 'Dr. Ana Silva',
        avatar: '/avatars/ana-silva.jpg',
        title: 'Cirurgiã Plástica'
      },
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setReplies(prev => [...prev, newReply]);
    setReplyContent('');
    setIsReplying(false);
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

      {/* Main Discussion */}
      <GlassCard className="mb-6 p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {discussion.isSticky && (
                  <Pin className="w-4 h-4 text-yellow-400" />
                )}
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {discussion.category}
                </Badge>
                {discussion.isClosed && (
                  <Badge variant="outline" className="text-xs px-2 py-1 text-red-400 border-red-400/30">
                    Fechada
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-white/90 mb-3">{discussion.title}</h1>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10">
                  {discussion.author.avatar ? (
                    <Image
                      src={discussion.author.avatar}
                      alt={discussion.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                      <span className="text-sm font-medium text-white/80">
                        {discussion.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-white/90">{discussion.author.name}</p>
                  <p className="text-sm text-white/60">{discussion.author.title}</p>
                </div>
                <span className="text-sm text-white/50 ml-auto">{formatDate(discussion.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
            {discussion.description}
          </div>

          {/* Tags */}
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {discussion.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs px-2 py-1 text-white/50 border-white/20"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`glass-button ${isLiked ? 'text-red-400' : 'text-white/60'}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
              <div className="flex items-center gap-1 text-sm text-white/60">
                <MessageSquare className="w-4 h-4" />
                <span>{discussion.replies + replies.length}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-white/60">
                <Eye className="w-4 h-4" />
                <span>{discussion.views}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="glass-button"
              >
                <Reply className="w-4 h-4 mr-1" />
                Responder
              </Button>
              <Button variant="ghost" size="sm" className="glass-button">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Reply Form */}
      {isReplying && (
        <GlassCard className="mb-6 p-4">
          <div className="space-y-4">
            <h3 className="font-medium text-white/90">Adicionar Resposta</h3>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Digite sua resposta..."
              className="glass-input min-h-[100px]"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                className="glass-button"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                className="glass-button bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300"
              >
                <Check className="w-4 h-4 mr-1" />
                Publicar
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90 mb-4">
          Respostas ({discussion.replies + replies.length})
        </h2>
        
        {replies.map((reply) => (
          <GlassCard key={reply.id} className="p-4">
            <div className="space-y-3">
              {/* Reply Author */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
                    {reply.author.avatar ? (
                      <Image
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                        <span className="text-xs font-medium text-white/80">
                          {reply.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white/90 text-sm">{reply.author.name}</p>
                    <p className="text-xs text-white/60">{reply.author.title}</p>
                  </div>
                </div>
                <span className="text-xs text-white/50">{formatDate(reply.createdAt)}</span>
              </div>

              {/* Reply Content */}
              <div className="text-sm text-white/80 leading-relaxed pl-11">
                {reply.content}
              </div>

              {/* Reply Actions */}
              <div className="flex items-center justify-between pl-11">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReplyLike(reply.id)}
                    className={`h-7 px-2 text-xs ${reply.isLiked ? 'text-red-400' : 'text-white/60'}`}
                  >
                    <Heart className={`w-3 h-3 mr-1 ${reply.isLiked ? 'fill-current' : ''}`} />
                    {reply.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-white/60">
                    <Reply className="w-3 h-3 mr-1" />
                    Responder
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}