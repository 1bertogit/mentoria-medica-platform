import { notFound } from 'next/navigation';
import { caseDetails } from '@/lib/mock-data/cases';
import { Metadata } from 'next';
import CaseDetailClient from './CaseDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // In a real app, this would fetch case data from API
  const caseData = caseDetails;

  if (!caseData) {
    return {
      title: 'Caso não encontrado',
      description: 'O caso clínico solicitado não foi encontrado.'
    };
  }

  return {
    title: `${caseData.title} | Mentoria Médica`,
    description: caseData.presentation,
    openGraph: {
      title: caseData.title,
      description: caseData.presentation,
      type: 'article',
    },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // In a real app, this would fetch case data from API using the ID
    const caseData = caseDetails;

    if (!caseData) {
        notFound();
    }
  
    return <CaseDetailClient caseData={caseData} />;
}