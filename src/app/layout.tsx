import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/animations.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Legacy Mentoring - Plataforma de Mentoria Médica Especializada',
  description:
    'Plataforma completa de educação médica com cursos, biblioteca científica, casos clínicos e mentoria especializada em cirurgia facial e procedimentos estéticos.',
  keywords:
    'mentoria médica, educação médica, cirurgia facial, procedimentos estéticos, cursos médicos, biblioteca científica, casos clínicos',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logos/favicon-facelift-mstery.webp',
    shortcut: '/images/logos/favicon-facelift-mstery.webp',
    apple: '/images/logos/favicon-facelift-mstery.webp',
  },
  openGraph: {
    title: 'Legacy Mentoring - Plataforma de Mentoria Médica',
    description: 'Educação médica especializada com mentoria personalizada',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legacy Mentoring',
    description: 'Plataforma de mentoria médica especializada',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'MedEdu',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-TileImage': '/icons/icon-144x144.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
