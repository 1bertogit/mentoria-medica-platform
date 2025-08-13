'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BorderBeam } from '@/components/magicui/border-beam';

// Schema de validação
const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implementar chamada real para API de recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay

      // Por enquanto, sempre mostra sucesso
      setIsSuccess(true);
    } catch (err) {
      setError('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Efeitos de fundo sutis */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-white/5 via-white/3 to-transparent blur-3xl" />
        <div className="absolute -right-[10%] bottom-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-l from-white/5 via-white/3 to-transparent blur-3xl" />
      </div>

      {/* Glass Card com BorderBeam */}
      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent p-8 shadow-2xl backdrop-blur-2xl backdrop-saturate-200">
          {/* Noise texture para glassmorphism */}
          <div className="absolute inset-0 opacity-30" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
               }} />
          
          {/* Border Beam da Magic UI */}
          <BorderBeam
            size={100}
            duration={12}
            delay={0}
            colorFrom="#60a5fa"
            colorTo="#a78bfa"
            reverse={true}
            borderWidth={1.5}
            className="opacity-80"
          />
          {/* Logo */}
          <div className="relative z-10 mb-8 flex justify-center">
            <div className="rounded-2xl bg-black/20 p-3">
              <img
                src="/images/logos/legacy-mentoring-auth.webp"
                alt="Legacy Mentoring"
                className="h-16 w-16 rounded-xl object-contain"
              />
            </div>
          </div>

          {/* Header */}
          <div className="relative z-10 mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">
              Recuperar Senha
            </h1>
            <p className="text-gray-300">
              {isSuccess
                ? 'Email enviado com sucesso!'
                : 'Digite seu email para receber instruções'}
            </p>
          </div>

          {isSuccess ? (
            <div className="relative z-10 space-y-6">
              {/* Success Message */}
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-400" />
                  <div className="text-sm text-green-300">
                    <p className="mb-1 font-medium">Email enviado!</p>
                    <p className="text-green-200/80">
                      Verifique sua caixa de entrada e siga as instruções para
                      redefinir sua senha.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Login Button */}
              <Link href="/auth/signin">
                <Button className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 font-semibold text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30 hover:shadow-xl">
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Voltar para o Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email cadastrado
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="h-12 border-white/20 bg-white/10 pl-10 text-white placeholder:text-gray-400 backdrop-blur-sm focus:border-white/40 focus:bg-white/15"
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 backdrop-blur-sm">
                    <p className="flex items-center gap-2 text-sm text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 font-semibold text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Email de Recuperação'
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="relative z-10 mt-8 text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
