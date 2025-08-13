'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { BorderBeam } from '@/components/magicui/border-beam';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlassPattern } from '@/lib/styles/glass-morphism';

// Schema de validação
const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignInContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Check for success messages from URL params
  useEffect(() => {
    const registered = searchParams.get('registered');
    const confirmed = searchParams.get('confirmed');

    if (registered === 'true') {
      setSuccessMessage('Conta criada com sucesso! Faça login para continuar.');
    } else if (confirmed === 'true') {
      setSuccessMessage('Email confirmado com sucesso! Agora você pode fazer login.');
    }
  }, [searchParams]);

  // Simular progresso de login realista
  const simulateLoginProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const increment =
          prev < 30
            ? Math.random() * 15 + 5
            : prev < 60
              ? Math.random() * 8 + 3
              : Math.random() * 4 + 1;
        return Math.min(prev + increment, 90);
      });
    }, 150);
    return interval;
  };

  const onSubmit = async (data: SignInFormData) => {
    setError('');
    setIsLoading(true);
    setLoginSuccess(false);

    const progressInterval = simulateLoginProgress();

    try {
      await login(data.email, data.password);
      setLoadingProgress(100);
      setLoginSuccess(true);

      // Pequeno delay para mostrar o sucesso
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 800);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
      setLoadingProgress(0);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        if (!loginSuccess) {
          setLoadingProgress(0);
        }
      }, 1200);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Background com gradient radial premium */}
      <div className="bg-gradient-radial absolute inset-0 from-gray-900/20 via-black to-black" />

      {/* Orbs dourados flutuantes para profundidade */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="via-amber-500/3 absolute -left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-gradient-to-r from-yellow-400/5 to-transparent blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="via-yellow-400/3 absolute -right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-gradient-to-l from-amber-600/5 to-transparent blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Glass Card Premium com Border Beam Dourado */}
      <motion.div
        className="relative z-20 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className={`${getGlassPattern('premiumLoginPattern')} shadow-2xl`}>
          {/* Border Beam Dourado Pulsante */}
          <BorderBeam
            size={120}
            duration={8}
            delay={0}
            colorFrom="#FFD700"
            colorTo="#FFA500"
            reverse={false}
            borderWidth={2}
            className="opacity-70"
          />

          {/* Logo com glow dourado sutil */}
          <motion.div
            className="relative z-10 mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="relative rounded-2xl border border-yellow-400/20 bg-black/40 p-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/images/logos/legacy-mentoring-auth.webp"
                alt="Legacy Mentoring"
                className="h-16 w-16 rounded-xl object-contain drop-shadow-lg"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-yellow-400/10 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Header com animação stagger */}
          <motion.div
            className="relative z-10 mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="mb-2 text-2xl font-light tracking-wide text-white">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-white/60">
              Entre para acessar a plataforma
            </p>
          </motion.div>

          {/* Form com inputs glass premium */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 space-y-4"
          >
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Label htmlFor="email" className="font-medium text-white/90">
                Email
              </Label>
              <div className="group relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-yellow-400/70" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 pl-10 pr-12 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.email
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="seu@email.com"
                />

                {/* Glow effect quando focado */}
                {focusedField === 'email' && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-yellow-400/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {errors.email && (
                <motion.p
                  className="flex items-center gap-1 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium text-white/90">
                  Senha
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-yellow-400/80 transition-colors hover:text-yellow-400 hover:drop-shadow-sm"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-yellow-400/70" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 pl-10 pr-16 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.password
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="••••••••"
                />

                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-yellow-400/70"
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>

                {/* Glow effect quando focado */}
                {focusedField === 'password' && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-yellow-400/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {errors.password && (
                <motion.p
                  className="flex items-center gap-1 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Checkbox Remember me */}
            <motion.div
              className="flex items-center space-x-2 py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-white/70"
                >
                  Lembrar-me
                </label>
              </div>
            </motion.div>

            {/* Error/Success Messages */}
            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div
                  className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center gap-2 text-sm text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    {successMessage}
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                </motion.div>
              )}

              {loginSuccess && (
                <motion.div
                  className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center gap-2 text-sm text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Login realizado com sucesso! Redirecionando...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão Glass Dourado Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="space-y-3"
            >
              <Button
                type="submit"
                variant="goldGlass"
                disabled={isLoading}
                className="group relative h-12 w-full overflow-hidden rounded-xl font-semibold shadow-lg shadow-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* Glow effect expandindo no hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="mr-2 h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      <span className="text-sm">
                        {loadingProgress < 30
                          ? 'Conectando...'
                          : loadingProgress < 60
                            ? 'Autenticando...'
                            : loadingProgress < 90
                              ? 'Carregando perfil...'
                              : 'Finalizando...'}
                      </span>
                    </div>
                  ) : loginSuccess ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />
                      Sucesso!
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Entrar
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </span>
              </Button>

              {/* Progress Bar Premium */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Progress Bar Container */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-500/20 to-yellow-600/20 blur-sm" />

                      {/* Progress Fill */}
                      <motion.div
                        className="relative h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 shadow-lg shadow-yellow-400/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        {/* Shimmer effect on progress bar */}
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      </motion.div>

                      {/* Animated dots */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="h-1 w-1 rounded-full bg-white/60"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress Text */}
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>
                        {loadingProgress < 30
                          ? '🔐 Verificando credenciais'
                          : loadingProgress < 60
                            ? '👤 Carregando perfil'
                            : loadingProgress < 90
                              ? '⚡ Preparando dashboard'
                              : '✨ Quase pronto'}
                      </span>
                      <span className="font-mono">
                        {Math.round(loadingProgress)}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </form>

          {/* Divider Glass */}
          <motion.div
            className="relative z-10 my-6 flex items-center"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Footer */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <p className="text-white/60">
              Não tem uma conta?{' '}
              <Link
                href="/auth/signup"
                className="ml-2 font-medium text-yellow-400 transition-colors hover:text-yellow-300 hover:drop-shadow-sm"
              >
                Cadastre-se
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignInContent />
    </Suspense>
  );
}
