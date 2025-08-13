'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Bell,
  Video,
  User,
} from 'lucide-react';
import { eventsData } from '@/lib/mock-data/dashboard';

// Extend the events data with more details
const extendedEvents = eventsData.map((event, index) => ({
  ...event,
  id: index + 1,
  location: index % 2 === 0 ? 'Online' : 'Presencial - São Paulo',
  attendees: Math.floor(Math.random() * 100) + 20,
  maxAttendees: Math.floor(Math.random() * 50) + 100,
  instructor:
    index % 3 === 0
      ? 'Dr. Robério Brandão'
      : index % 3 === 1
        ? 'Dra. Ana Silva'
        : 'Dr. Carlos Mendes',
  category:
    index % 4 === 0
      ? 'Masterclass'
      : index % 4 === 1
        ? 'Workshop'
        : index % 4 === 2
          ? 'Mentoria'
          : 'Webinar',
  isRegistered: index % 3 === 0,
}));

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('list');
  const [events] = useState(extendedEvents);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get events for selected date or current month
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForMonth = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const calendarDays = generateCalendarDays();
  const monthEvents = getEventsForMonth();
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="w-full" role="region" aria-label="Calendário de eventos">
      {/* Header */}
      <section className="mb-8" aria-label="Cabeçalho do calendário">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex-shrink-0">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="mb-1 sm:mb-2 text-2xl sm:text-3xl font-light text-gray-900 dark:text-white/90">
                Calendário
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/60">
                Agenda de eventos, masterclasses e mentorias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex rounded-lg bg-white/5 p-1">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                className="glass-button text-xs px-2 sm:px-3"
              >
                Mês
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="glass-button text-xs px-2 sm:px-3"
              >
                Lista
              </Button>
            </div>

            <Button className="glass-button bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs sm:text-sm">
              <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Novo Evento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          {viewMode === 'month' ? (
            <GlassCard className="p-6">
              {/* Calendar Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white/90">
                  {months[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="glass-button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="glass-button text-xs"
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="glass-button"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Week days header */}
                {weekDays.map(day => (
                  <div
                    key={day}
                    className="p-3 text-center text-sm font-medium text-white/60"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`relative aspect-square rounded-lg p-2 text-left transition-all duration-200 hover:bg-white/5 ${isCurrentMonth(date) ? 'text-white/90' : 'text-white/30'} ${isToday(date) ? 'bg-purple-500/20 ring-1 ring-purple-400/50' : ''} ${isSelected ? 'bg-white/10 ring-1 ring-white/30' : ''} `}
                    >
                      <div className="text-xs sm:text-sm font-medium">
                        {date.getDate()}
                      </div>

                      {/* Event indicators - escondidos no mobile, visíveis no desktop */}
                      {dayEvents.length > 0 && (
                        <div className="mt-1 space-y-0.5 hidden sm:block">
                          {dayEvents.slice(0, 1).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="truncate rounded bg-purple-500/30 px-1 py-0.5 text-[10px] text-purple-200"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 1 && (
                            <div className="text-[10px] text-white/50">
                              +{dayEvents.length - 1} mais
                            </div>
                          )}
                        </div>
                      )}

                      {/* Event dot indicator - sempre visível */}
                      {hasEvents(date) && (
                        <div className="absolute right-1 top-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-400"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          ) : (
            /* List View */
            <div className="space-y-4">
              {monthEvents.length > 0 ? (
                monthEvents.map(event => (
                  <GlassCard
                    key={event.id}
                    className="p-6 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <Badge className="bg-purple-500/20 text-purple-300">
                            {event.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-white/20 text-white/60"
                          >
                            {event.type}
                          </Badge>
                          {event.isRegistered && (
                            <Badge className="bg-green-500/20 text-green-300">
                              Inscrito
                            </Badge>
                          )}
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-white/90">
                          {event.title}
                        </h3>

                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatEventTime(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>
                        </div>

                        <p className="mb-3 text-sm text-white/70">
                          Por {event.instructor}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className={`glass-button ${
                            event.isRegistered
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {event.isRegistered ? 'Inscrito' : 'Inscrever-se'}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button"
                        >
                          <Bell className="mr-1 h-3 w-3" />
                          Lembrete
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <GlassCard className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                      <CalendarIcon className="h-8 w-8 text-white/40" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white/80">
                        Nenhum evento este mês
                      </h3>
                      <p className="text-white/60">
                        Não há eventos programados para {months[currentMonth]}.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          {selectedDate && (
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white/90">
                {formatEventDate(selectedDate.toISOString())}
              </h3>

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      className="rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                    >
                      <div className="mb-1 text-sm font-medium text-white/90">
                        {event.title}
                      </div>
                      <div className="text-xs text-white/60">
                        {formatEventTime(event.date)} • {event.instructor}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60">
                  Nenhum evento nesta data.
                </p>
              )}
            </GlassCard>
          )}

          {/* Upcoming Events */}
          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white/90">
              Próximos Eventos
            </h3>

            <div className="space-y-3">
              {events
                .filter(event => new Date(event.date) > new Date())
                .slice(0, 3)
                .map(event => (
                  <div
                    key={event.id}
                    className="rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <div className="text-sm font-medium text-white/90">
                        {event.title}
                      </div>
                      {event.location === 'Online' && (
                        <Video className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                    <div className="text-xs text-white/60">
                      {formatEventDate(event.date)} •{' '}
                      {formatEventTime(event.date)}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                      <User className="h-3 w-3" />
                      <span>{event.instructor}</span>
                    </div>
                  </div>
                ))}
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white/90">
              Estatísticas
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Este mês</span>
                <span className="text-white/90">
                  {monthEvents.length} eventos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Inscrições</span>
                <span className="text-white/90">
                  {events.filter(e => e.isRegistered).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Próximos</span>
                <span className="text-white/90">
                  {events.filter(e => new Date(e.date) > new Date()).length}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
