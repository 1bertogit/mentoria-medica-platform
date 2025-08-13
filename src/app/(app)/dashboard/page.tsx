import type { User } from '@/types';
'use client';

import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import {
  Users,
  FileText,
  BookOpen,
  PlusCircle,
  Library,
  PlayCircle,
  Download,
  Archive,
  ArrowRight,
  MessageSquare,
  Edit,
  Calendar,
  Clock,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { eventsData } from '@/lib/mock-data/dashboard';
import { useAuth } from '@/hooks/use-auth';
import { MinimalCountdown } from '@/components/dashboard/minimal-countdown';

const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const formatEventDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });
};

const formatEventTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Função para gerar saudação personalizada
const gerarSaudacao = (
  nomeUsuario: string,
  sexoUsuario: 'Masculino' | 'Feminino',
  tipoAcesso: 'primeiroAcesso' | 'retorno'
) => {
  if (tipoAcesso === 'primeiroAcesso') {
    if (sexoUsuario === 'Masculino') {
      return `Olá, ${nomeUsuario}! Seja bem-vindo!`;
    } else {
      return `Olá, ${nomeUsuario}! Seja bem-vinda!`;
    }
  } else {
    // Retorno - mensagem fixa sem alternância
    return `Olá, ${nomeUsuario}! Que bom ter você de volta!`;
  }
};

export default function DashboardPage() {
  const { isAdmin } = useAuth();

  // Dados mockados do usuário - em produção viriam do contexto de autenticação
  const dadosUsuario = {
    nome: 'Dr. Robério',
    sexo: 'Masculino' as 'Masculino' | 'Feminino',
    tipoAcesso: 'retorno' as 'primeiroAcesso' | 'retorno',
    avatar: '/images/doctors/Dr-Roberio.png',
  };

  const stats = [
    {
      title: 'Alunos Ativos',
      value: '48',
      change: '+12%',
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      href: '#',
    },
    {
      title: 'Casos em Análise',
      value: '12',
      change: '+8%',
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      href: '/cases',
    },
    {
      title: 'Artigos Publicados',
      value: '6',
      change: '+2',
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      href: '/library',
    },
  ];

  const navCards = [
    {
      title: 'Novo Caso',
      subtitle: 'Compartilhar experiência',
      icon: PlusCircle,
      href: '/admin/content/new-case',
      color: 'text-green-400',
    },
    {
      title: 'Biblioteca',
      subtitle: 'Artigos científicos',
      icon: Library,
      href: '/library',
      color: 'text-blue-400',
    },
    {
      title: 'Gravações',
      subtitle: 'Aulas e mentorias',
      icon: PlayCircle,
      href: '/classes',
      color: 'text-orange-400',
    },
    {
      title: 'Materiais',
      subtitle: 'Downloads e recursos',
      icon: Download,
      href: '/archive',
      color: 'text-yellow-400',
    },
    {
      title: 'Acervo WhatsApp',
      subtitle: 'Histórico organizado',
      icon: Archive,
      href: '/archive',
      color: 'text-indigo-400',
    },
  ];

  const recentActivities = [
    {
      type: 'NOVO CASO',
      description:
        'Dr. Lucas Martins submeteu um novo caso: "Mamoplastia de Aumento com Prótese de Silicone".',
      time: '2 horas atrás',
      icon: FileText,
      color: 'text-purple-400',
    },
    {
      type: 'COMENTÁRIO',
      description: 'Dr. Ana Couto comentou no caso "Rinoplastia Secundária".',
      time: '5 horas atrás',
      icon: MessageSquare,
      color: 'text-cyan-400',
    },
    {
      type: 'ARTIGO',
      description:
        'Novo artigo publicado na biblioteca: "Técnicas Avançadas em Blefaroplastia".',
      time: '1 dia atrás',
      icon: BookOpen,
      color: 'text-blue-400',
    },
    {
      type: 'MENTORIA',
      description:
        'A gravação da "Masterclass: Lifting Facial Profundo" está disponível.',
      time: '2 dias atrás',
      icon: PlayCircle,
      color: 'text-orange-400',
    },
  ];

  const [nextEvent, setNextEvent] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(''));
  const [isClient, setIsClient] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Ordena os eventos e pega o próximo
    const sortedEvents = [...eventsData]
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sortedEvents.length > 0) {
      const upcomingEvent = sortedEvents[0];
      setNextEvent(upcomingEvent);
      setTimeLeft(calculateTimeLeft(upcomingEvent.date));

      // Verifica se o evento está próximo (dentro de 24 horas)
      const hoursUntilEvent = (+new Date(upcomingEvent.date) - +new Date()) / (1000 * 60 * 60);
      setShowNotification(hoursUntilEvent <= 24 && hoursUntilEvent > 0);

      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(upcomingEvent.date);
        setTimeLeft(newTimeLeft);
        
        // Atualiza o status da notificação
        const currentHoursUntilEvent = (+new Date(upcomingEvent.date) - +new Date()) / (1000 * 60 * 60);
        setShowNotification(currentHoursUntilEvent <= 24 && currentHoursUntilEvent > 0);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  return (
    <div className="w-full" role="region" aria-label="Painel de controle">
      {/* Header com saudação personalizada */}
      <section className="mb-8" aria-label="Saudação ao usuário">
        <GlassCard className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex-shrink-0 overflow-hidden flex items-center justify-center">
              {dadosUsuario.avatar ? (
                <img 
                  src={dadosUsuario.avatar} 
                  alt={dadosUsuario.nome}
                  className="h-full w-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback para ícone se a imagem não carregar
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-icon')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-icon';
                      fallback.innerHTML = '<svg class="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white/95 leading-tight">
                {gerarSaudacao(
                  dadosUsuario.nome,
                  dadosUsuario.sexo,
                  dadosUsuario.tipoAcesso
                )}
              </h1>
            </div>
          </div>
        </GlassCard>
      </section>

      {isClient && nextEvent && (
        <GlassCard className="mb-8 overflow-hidden p-0" interactive={true}>
          <Link href="/calendar">
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center justify-center bg-cyan-500/10 p-4 sm:p-6 md:self-stretch relative">
                {showNotification ? (
                  <>
                    <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 animate-bell" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                  </>
                ) : (
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400/70" />
                )}
              </div>
              <div className="flex-grow p-4 sm:p-6 text-center md:text-left">
                <p className="text-xs sm:text-sm font-medium text-cyan-400">
                  {showNotification ? '🔔 NOTIFICAÇÃO URGENTE' : 'PRÓXIMO EVENTO'}
                </p>
                <h3 className="mt-1 text-base sm:text-lg font-medium text-gray-900 dark:text-white/95">
                  {nextEvent.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600 dark:text-white/60">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{formatEventDate(nextEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{formatEventTime(nextEvent.date)}</span>
                  </div>
                </div>
              </div>
              <div className="w-full border-t border-white/10 p-4 sm:p-6 md:w-auto md:border-l md:border-t-0 flex items-center justify-center">
                <MinimalCountdown targetDate={nextEvent.date} />
              </div>
            </div>
          </Link>
        </GlassCard>
      )}

      {isAdmin && (
        <section
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Estatísticas da plataforma"
        >
          {stats.map((stat, index) => (
            <Link href={stat.href} key={stat.title}>
              <GlassCard
                interactive={true}
                className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-xl p-3 ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-600 dark:text-white/70">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${stat.color} rounded-lg bg-white/5 px-2 py-1`}
                    >
                      {stat.change}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-white/50">
                      vs mês anterior
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </section>
      )}

      <nav
        className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        aria-label="Navegação rápida"
      >
        {navCards.map((card, index) => (
          <Link href={card.href} key={card.title}>
            <GlassCard
              interactive={true}
              className="group h-full p-5 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center space-y-3 text-center">
                <div
                  className={`rounded-xl bg-white/5 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10`}
                >
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white/95">
                    {card.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-white/60">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </nav>

      <section className="mt-12" aria-label="Atividades recentes">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-white/90">
            Atividade Recente
          </h2>
          <Button
            variant="ghost"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
          >
            Ver todas <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <GlassCard className="overflow-hidden">
          <div className="divide-y divide-white/5">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="group flex cursor-pointer items-start gap-4 p-4 transition-colors duration-200 hover:bg-white/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`rounded-xl border border-white/10 bg-white/5 p-2.5 transition-transform duration-200 group-hover:scale-110`}
                >
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${activity.color} rounded-md bg-white/5 px-2 py-1`}
                    >
                      {activity.type}
                    </span>
                    <p className="flex-shrink-0 text-xs text-gray-500 dark:text-white/40">
                      {activity.time}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-white/80">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
