'use client';

import { useState } from 'react';
import { Heart, Reply, MoreHorizontal, Edit, Trash2, Flag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Comment } from '@/lib/mock-data/comments';

interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  currentUserId?: string;
  depth?: number;
}

export function CommentItem({
  comment,
  onReply,
  onLike,
  onEdit,
  onDelete,
  onReport,
  currentUserId,
  depth = 0
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const isOwn = currentUserId === comment.author.id;
  const maxDepth = 3; // Maximum nesting depth

  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
    }
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

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
      year: 'numeric'
    });
  };

  return (
    <div className={`${depth > 0 ? 'ml-2 sm:ml-4 md:ml-8 border-l border-white/10 pl-2 sm:pl-4' : ''}`}>
      <GlassCard className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Header - Responsivo */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {comment.author.avatar ? (
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <h4 className="font-medium text-white/90 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                  {comment.author.name}
                </h4>
                {comment.author.specialty && (
                  <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5 text-cyan-400 border-cyan-400/30 hidden sm:inline-flex">
                    {comment.author.specialty}
                  </Badge>
                )}
                {comment.isEdited && (
                  <span className="text-[10px] sm:text-xs text-white/40">(editado)</span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-white/60 mt-0.5">
                <span className="hidden sm:inline">{comment.author.title} • </span>
                <span>{formatDate(comment.createdAt)}</span>
              </p>
              {/* Specialty badge em mobile - abaixo do nome */}
              {comment.author.specialty && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-cyan-400 border-cyan-400/30 mt-1 inline-flex sm:hidden">
                  {comment.author.specialty}
                </Badge>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-white/5 flex-shrink-0">
                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-pane">
              {isOwn && (
                <>
                  <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(comment.id)} 
                    className="cursor-pointer text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
              {!isOwn && (
                <DropdownMenuItem 
                  onClick={() => onReport?.(comment.id)} 
                  className="cursor-pointer"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Reportar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content - Responsivo */}
        <div className="space-y-3">
          {isEditing ? (
            <div className="space-y-2 sm:space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="glass-input min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm"
                placeholder="Edite seu comentário..."
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleEdit} className="glass-button h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3">
                  Salvar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="glass-button h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed break-words">
              {comment.content}
            </p>
          )}
        </div>

        {/* Actions - Responsivo */}
        {!isEditing && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-7 sm:h-8 px-2 sm:px-3 hover:bg-white/5 text-xs sm:text-sm ${
                isLiked ? 'text-red-400' : 'text-white/60'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>

            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="h-7 sm:h-8 px-2 sm:px-3 text-white/60 hover:bg-white/5 hover:text-white/80 text-xs sm:text-sm"
              >
                <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Responder
              </Button>
            )}
          </div>
        )}

        {/* Reply Form - Responsivo */}
        {isReplying && (
          <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-white/10">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="glass-input min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm"
              placeholder="Escreva sua resposta..."
            />
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleReply} 
                className="glass-button h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                Responder
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                className="glass-button h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onReport={onReport}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}