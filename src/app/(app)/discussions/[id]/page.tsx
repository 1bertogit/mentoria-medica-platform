import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { mockDiscussions } from '@/lib/mock-data/comments';
import DiscussionDetailClient from './DiscussionDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const discussion = mockDiscussions.find(d => d.id === id);
  
  if (!discussion) {
    return {
      title: 'Discussão não encontrada',
      description: 'A discussão solicitada não foi encontrada.'
    };
  }

  return {
    title: `${discussion.title} | Discussões`,
    description: discussion.description,
    openGraph: {
      title: discussion.title,
      description: discussion.description,
      type: 'article',
    },
  };
}

export default async function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const discussion = mockDiscussions.find(d => d.id === id);
  
  if (!discussion) {
    notFound();
  }

  return <DiscussionDetailClient discussion={discussion} />;
}