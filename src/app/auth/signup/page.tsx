'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BorderBeam } from '@/components/magicui/border-beam';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlassPattern } from '@/lib/styles/glass-morphism';

// Schema de validação
const signUpSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    crm: z.string().min(4, 'CRM inválido').optional().or(z.literal('')),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // Simular progresso de cadastro realista
  const simulateSignupProgress = () => {
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

  const onSubmit = async (data: SignUpFormData) => {
    setError('');
    setIsLoading(true);
    setSignupSuccess(false);

    const progressInterval = simulateSignupProgress();

    try {
      // Real API call to signup endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          name: data.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao criar conta');
      }

      setLoadingProgress(100);
      setSignupSuccess(true);

      // Check if email confirmation is required
      if (result.data?.confirmationRequired) {
        // Redirect to confirmation page with email
        setTimeout(() => {
          clearInterval(progressInterval);
          router.push(`/auth/confirm?email=${encodeURIComponent(data.email)}`);
        }, 800);
      } else {
        // Direct to login if no confirmation needed
        setTimeout(() => {
          clearInterval(progressInterval);
          router.push('/auth/signin?registered=true');
        }, 800);
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
      setLoadingProgress(0);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        if (!signupSuccess) {
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
      <div className="absolute inset-0 overflow-hidden">
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
        className="relative w-full max-w-md"
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
              Criar Conta
            </h2>
            <p className="text-sm text-white/60">
              Junte-se à plataforma médica
            </p>
          </motion.div>

          {/* Form com inputs glass premium */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 space-y-4"
          >
            {/* Name Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Label htmlFor="name" className="font-medium text-white/90">
                Nome Completo
              </Label>
              <div className="group relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-yellow-400/70" />
                <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 pl-10 pr-4 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.name
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="Dr. João Silva"
                  autoComplete="name"
                />

                {/* Glow effect quando focado */}
                {focusedField === 'name' && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-yellow-400/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {errors.name && (
                <motion.p
                  className="flex items-center gap-1 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </motion.p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
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
                  className={`h-12 pl-10 pr-4 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.email
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="seu@email.com"
                  autoComplete="email"
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

            {/* CRM Field (Optional) */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Label htmlFor="crm" className="font-medium text-white/90">
                CRM (Opcional)
              </Label>
              <div className="group relative">
                <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-yellow-400/70" />
                <Input
                  id="crm"
                  type="text"
                  {...register('crm')}
                  onFocus={() => setFocusedField('crm')}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 pl-10 pr-4 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.crm
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="12345/SP"
                />

                {/* Glow effect quando focado */}
                {focusedField === 'crm' && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-yellow-400/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {errors.crm && (
                <motion.p
                  className="flex items-center gap-1 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.crm.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Label htmlFor="password" className="font-medium text-white/90">
                Senha
              </Label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-yellow-400/70" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 pl-10 pr-12 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.password
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Label htmlFor="confirmPassword" className="font-medium text-white/90">
                Confirmar Senha
              </Label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-yellow-400/70" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`h-12 pl-10 pr-12 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 ${
                    errors.confirmPassword
                      ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-white/20 bg-white/10 focus:border-yellow-400/40 focus:bg-white/15 focus:shadow-lg focus:shadow-yellow-400/10'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-yellow-400/70"
                  aria-label={
                    showConfirmPassword
                      ? 'Esconder confirmação de senha'
                      : 'Mostrar confirmação de senha'
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>

                {/* Glow effect quando focado */}
                {focusedField === 'confirmPassword' && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-yellow-400/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <motion.p
                  className="flex items-center gap-1 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </motion.div>

            {/* Error/Success Messages */}
            <AnimatePresence mode="wait">
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

              {signupSuccess && (
                <motion.div
                  className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center gap-2 text-sm text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Conta criada com sucesso! Redirecionando...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão Glass Dourado Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
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
                          ? 'Validando dados...'
                          : loadingProgress < 60
                            ? 'Criando conta...'
                            : loadingProgress < 90
                              ? 'Configurando perfil...'
                              : 'Finalizando...'}
                      </span>
                    </div>
                  ) : signupSuccess ? (
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
                      Criar Conta
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
                          ? '📝 Validando informações'
                          : loadingProgress < 60
                            ? '🔐 Criando credenciais'
                            : loadingProgress < 90
                              ? '👤 Configurando perfil'
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
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Footer */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <p className="text-white/60">
              Já tem uma conta?{' '}
              <Link
                href="/auth/signin"
                className="ml-2 font-medium text-yellow-400 transition-colors hover:text-yellow-300 hover:drop-shadow-sm"
              >
                Faça login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
