'use client';

import {
  Countdown,
  CountdownCompact,
  useCountdown,
} from '@/components/ui/countdown';

export function CountdownExamples() {
  // Exemplo: 30 dias a partir de agora
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  futureDate.setHours(futureDate.getHours() + 12);
  futureDate.setMinutes(futureDate.getMinutes() + 30);

  // Exemplo: Próximo webinar (7 dias)
  const webinarDate = new Date();
  webinarDate.setDate(webinarDate.getDate() + 7);
  webinarDate.setHours(19, 0, 0, 0); // 19:00

  // Exemplo: Lançamento do curso (15 dias)
  const courseDate = new Date();
  courseDate.setDate(courseDate.getDate() + 15);
  courseDate.setHours(10, 0, 0, 0); // 10:00

  const handleCountdownComplete = () => {
    // Aqui você pode adicionar lógica como mostrar modal, redirecionar, etc.
  };

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold text-white">
          Exemplos de Countdown
        </h2>
        <p className="text-white/70">
          Diferentes estilos e usos do componente countdown
        </p>
      </div>

      {/* Countdown Principal */}
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-semibold text-white">
          Lançamento da Masterclass
        </h3>
        <Countdown
          targetDate={futureDate}
          onComplete={handleCountdownComplete}
          className="mx-auto"
        />
        <p className="text-sm text-white/60">
          Não perca o lançamento exclusivo!
        </p>
      </div>

      {/* Countdown Compacto */}
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-semibold text-white">Próximo Webinar</h3>
        <CountdownCompact targetDate={webinarDate} className="mx-auto" />
        <p className="text-sm text-white/60">
          "Técnicas Avançadas em Rinoplastia"
        </p>
      </div>

      {/* Múltiplos Countdowns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-white">Curso Premium</h4>
          <Countdown targetDate={courseDate} className="scale-75" />
          <p className="text-sm text-white/60">Vagas limitadas</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-white">
            Desconto Especial
          </h4>
          <CountdownCompact targetDate={webinarDate} />
          <p className="text-sm text-white/60">50% OFF - Apenas hoje!</p>
        </div>
      </div>

      {/* Exemplo com Hook */}
      <CountdownWithHook targetDate={futureDate} />
    </div>
  );
}

// Exemplo usando o hook personalizado
function CountdownWithHook({ targetDate }: { targetDate: Date }) {
  const { timeLeft, isComplete } = useCountdown(targetDate);

  if (isComplete) {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center backdrop-blur-sm">
        <h4 className="mb-2 text-lg font-semibold text-green-400">
          🎉 Evento Iniciado!
        </h4>
        <p className="text-green-300/80">O evento já começou. Não perca!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 text-center backdrop-blur-sm">
      <h4 className="text-lg font-semibold text-blue-400">
        Usando Hook Personalizado
      </h4>
      <div className="text-white">
        <span className="text-2xl font-bold">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
          {timeLeft.seconds}s
        </span>
      </div>
      <p className="text-sm text-blue-300/80">
        Tempo restante para o grande evento
      </p>
    </div>
  );
}
