'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estados de feedback visual
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Validação em tempo real
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email é obrigatório';
    if (!emailRegex.test(email)) return 'Email inválido';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    return '';
  };

  // Simular progresso durante login com timing mais realista
  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        // Progresso mais realista - rápido no início, mais lento no final
        const increment = prev < 30 ? Math.random() * 20 + 5 : 
                         prev < 60 ? Math.random() * 10 + 3 : 
                         Math.random() * 5 + 1;
        return Math.min(prev + increment, 85);
      });
    }, 180);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar campos
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passErr);
    
    if (emailErr || passErr) return;

    setIsLoading(true);
    setLoginStatus('loading');
    setErrorMessage('');
    
    const progressInterval = simulateProgress();

    try {
      await login(email, password);
      setLoadingProgress(100);
      setLoginStatus('success');
      
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 500);
      
    } catch (error: unknown) {
      clearInterval(progressInterval);
      setLoginStatus('error');
      setErrorMessage(error.message || 'Erro ao fazer login. Tente novamente.');
      setLoadingProgress(0);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        if (loginStatus !== 'success') {
          setLoginStatus('idle');
        }
      }, 1000);
    }
  };

  // Validação em tempo real nos campos com debounce
  useEffect(() => {
    if (email) {
      const timer = setTimeout(() => {
        setEmailError(validateEmail(email));
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      const timer = setTimeout(() => {
        setPasswordError(validatePassword(password));
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setPasswordError('');
    }
  }, [password]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-600 dark:text-gray-400">Entre com suas credenciais para continuar</p>
          
          {/* Credenciais de teste */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left">
            <p className="text-blue-300 text-sm font-medium mb-2">🧪 Credenciais AWS Cognito:</p>
            <div className="text-xs text-blue-200 space-y-1">
              <div>• <strong>Admin:</strong> admin@teste.com / Admin123!</div>
              <div>• <strong>Médico:</strong> medico@teste.com / Medico123!</div>
              <div>• <strong>Aluno:</strong> aluno@teste.com / Aluno123!</div>
            </div>
            <p className="text-yellow-300 text-xs mt-2">⚠️ Use credenciais AWS ou modo mock (admin@mentoria.com / admin123)</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all
                    ${emailError ? 'border-red-500' : 'border-white/20 focus:border-purple-500'}
                    ${email && !emailError ? 'border-green-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
                {email && !emailError && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all
                    ${passwordError ? 'border-red-500' : 'border-white/20 focus:border-purple-500'}
                    ${password && !passwordError ? 'border-green-500' : ''}
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-white/10 border-white/20 rounded text-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* Error Message */}
            {errorMessage && loginStatus === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-all transform
                ${isLoading 
                  ? 'bg-purple-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02]'
                }
                text-white shadow-lg`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Progress Bar */}
            {isLoading && (
              <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}