import { notFound } from 'next/navigation';
import { initialArchiveItems } from '@/lib/mock-data/archive';
import { Metadata } from 'next';
import ArchiveDetailClient from './ArchiveDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // In a real app, this would fetch archive data from API
  const archiveId = parseInt(id);
  const archiveData = initialArchiveItems.find(item => item.id === archiveId);

  if (!archiveData) {
    return {
      title: 'Item não encontrado',
      description: 'O item do arquivo solicitado não foi encontrado.'
    };
  }

  return {
    title: `${archiveData.title} | Arquivo de Conhecimento`,
    description: archiveData.description.split('\n')[0],
    openGraph: {
      title: archiveData.title,
      description: archiveData.description.split('\n')[0],
      type: 'article',
    },
  };
}

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // In a real app, this would fetch archive data from API using the ID
    const archiveId = parseInt(id);
    const archiveData = initialArchiveItems.find(item => item.id === archiveId);

    if (!archiveData) {
        notFound();
    }
  
    return <ArchiveDetailClient archiveData={archiveData} />;
}