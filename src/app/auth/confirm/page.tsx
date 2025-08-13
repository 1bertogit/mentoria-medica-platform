'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/auth/signup');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          confirmationCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao confirmar email');
      }

      setSuccess(true);
      
      // Redirect to login after success
      setTimeout(() => {
        router.push('/auth/signin?confirmed=true');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erro ao confirmar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendMessage('');
    setError('');
    setIsResending(true);

    try {
      const response = await fetch('/api/auth/confirm', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao reenviar código');
      }

      setResendMessage('Código reenviado com sucesso! Verifique seu email.');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email.replace(/(.{2}).*(@.*)/, '$1***$2');

  if (!email) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Background com gradient radial premium */}
      <div className="bg-gradient-radial absolute inset-0 from-gray-900/20 via-black to-black" />

      {/* Orbs dourados flutuantes para profundidade */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-yellow-400/10 to-orange-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
            <Mail className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Confirme seu Email
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enviamos um código de confirmação para
            <br />
            <span className="font-medium text-white">{maskedEmail}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {success ? (
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-400">
                ✅ Email confirmado com sucesso! Redirecionando para o login...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationCode" className="text-white">
                  Código de Confirmação
                </Label>
                <Input
                  id="confirmationCode"
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  value={confirmationCode}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setConfirmationCode(value);
                  }}
                  className="border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Verifique sua caixa de entrada e spam
                </p>
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {resendMessage && (
                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <AlertDescription className="text-blue-400">
                    {resendMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-500 hover:to-orange-600"
                disabled={isLoading || confirmationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  'Confirmar Email'
                )}
              </Button>
            </form>
          )}

          <div className="space-y-3 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
              onClick={handleResendCode}
              disabled={isResending || success}
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reenviar Código
                </>
              )}
            </Button>

            <Link href="/auth/signup">
              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Cadastro
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500">
            Não recebeu o código? Verifique sua pasta de spam ou{' '}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-yellow-400 hover:text-yellow-300 underline"
              disabled={isResending}
            >
              clique aqui para reenviar
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
