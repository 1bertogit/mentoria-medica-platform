'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { MessageSquare, Plus, Filter, TrendingUp, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommentItem } from './comment-item';
import { getCommentsForResource, addComment, addReply, type Comment } from '@/lib/mock-data/comments';
import { useNotifications } from '@/hooks/use-notifications';

interface CommentsSectionProps {
  resourceType: 'case' | 'article' | 'course' | 'archive';
  resourceId: string;
  currentUserId?: string;
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'most_liked' | 'most_replies';

export function CommentsSection({
  resourceType,
  resourceId,
  currentUserId = '1', // Default to Dr. Ana Silva for demo
  className = ''
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  
  const { addNotification } = useNotifications();

  useEffect(() => {
    const resourceComments = getCommentsForResource(resourceType, resourceId);
    setComments(resourceComments);
  }, [resourceType, resourceId]);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most_liked':
        return b.likes - a.likes;
      case 'most_replies':
        return b.replies.length - a.replies.length;
      default:
        return 0;
    }
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock current user data
      const currentUser = {
        id: currentUserId,
        name: 'Dr. Ana Silva',
        avatar: '/avatars/ana-silva.jpg',
        title: 'Cirurgiã Plástica',
        specialty: 'Rinoplastia'
      };

      const comment = addComment({
        author: currentUser,
        content: newComment,
        resourceType,
        resourceId
      });

      // Create notification for resource owner (if not self-commenting)
      if (currentUserId !== '1') { // Assuming resource owner is user '1'
        addNotification({
          userId: '1', // Resource owner
          type: 'comment',
          title: 'Novo comentário',
          message: `${currentUser.name} comentou em seu ${resourceType === 'case' ? 'caso' : resourceType === 'course' ? 'curso' : 'conteúdo'}`,
          resourceType,
          resourceId,
          actionUrl: `/${resourceType}s/${resourceId}#comments`,
          priority: 'medium',
          category: 'social',
          isRead: false,
          metadata: {
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            authorSpecialty: currentUser.specialty,
            previewText: newComment.substring(0, 100) + (newComment.length > 100 ? '...' : '')
          }
        });
      }

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setShowNewCommentForm(false);
    } catch (error) {
      logger.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: string, content: string) => {
    const currentUser = {
      id: currentUserId,
      name: 'Dr. Ana Silva',
      avatar: '/avatars/ana-silva.jpg',
      title: 'Cirurgiã Plástica',
      specialty: 'Rinoplastia'
    };

    const reply = addReply(parentId, {
      author: currentUser,
      content,
      resourceType,
      resourceId
    });

    if (reply) {
      // Find the parent comment to get author info
      const parentComment = comments.find(c => c.id === parentId);
      
      // Create notification for parent comment author (if not replying to self)
      if (parentComment && parentComment.author.id !== currentUserId) {
        addNotification({
          userId: parentComment.author.id,
          type: 'reply',
          title: 'Resposta ao seu comentário',
          message: `${currentUser.name} respondeu ao seu comentário`,
          resourceType,
          resourceId,
          actionUrl: `/${resourceType}s/${resourceId}#comment-${parentId}`,
          priority: 'high',
          category: 'social',
          isRead: false,
          metadata: {
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            authorSpecialty: currentUser.specialty,
            previewText: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          }
        });
      }

      // Update the comments state to reflect the new reply
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ));
    }
  };

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleEdit = (commentId: string, content: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, content, isEdited: true }
        : comment
    ));
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const handleReport = (commentId: string) => {
    // Mock report functionality
    };

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + comment.replies.length;
  }, 0);

  return (
    <section className={`space-y-6 ${className}`} aria-label="Comentários">
      {/* Header - Responsivo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white/90">Comentários</h2>
            <p className="text-xs sm:text-sm text-white/60">
              {totalComments} comentário{totalComments !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 glass-input text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-pane">
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Mais recentes</span>
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Mais antigos</span>
                </div>
              </SelectItem>
              <SelectItem value="most_liked">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Mais curtidos</span>
                </div>
              </SelectItem>
              <SelectItem value="most_replies">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Mais respondidos</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowNewCommentForm(!showNewCommentForm)}
            className="glass-button h-9 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            Comentar
          </Button>
        </div>
      </div>

      {/* New Comment Form */}
      {showNewCommentForm && (
        <GlassCard className="p-4 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="font-medium text-white/90">Adicionar comentário</h3>
          </div>
          
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="glass-input min-h-[100px]"
            placeholder="Compartilhe sua opinião, experiência ou faça uma pergunta..."
          />
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">
              Seja respeitoso e construtivo em seus comentários
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNewCommentForm(false);
                  setNewComment('');
                }}
                className="glass-button"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="glass-button"
              >
                {isSubmitting ? 'Enviando...' : 'Comentar'}
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Comments List */}
      {sortedComments.length > 0 ? (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={handleReport}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <GlassCard className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/80 mb-2">
                Seja o primeiro a comentar
              </h3>
              <p className="text-white/60 max-w-md">
                Compartilhe sua experiência, faça perguntas ou inicie uma discussão sobre este conteúdo.
              </p>
            </div>
            <Button
              onClick={() => setShowNewCommentForm(true)}
              className="glass-button mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar comentário
            </Button>
          </div>
        </GlassCard>
      )}
    </section>
  );
}