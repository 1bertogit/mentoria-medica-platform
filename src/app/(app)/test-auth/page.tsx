'use client';

import { useState } from 'react';
import logger from '@/lib/logger';
import { authService } from '@/lib/auth/auth-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, Key, Shield, User } from 'lucide-react';

export default function TestAuthPage() {
  const [email, setEmail] = useState('admin@teste.com');
  const [password, setPassword] = useState('Admin123!');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const testLogin = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      // Test login
      const loginResponse = await authService.login(email, password);
      // Get current user
      const currentUser = authService.getCurrentUser();
      // Get token
      const token = authService.getToken();

      // Get refresh token
      const refreshToken = authService.getRefreshToken();

      // Check authentication
      const isAuth = authService.isAuthenticated();
      // Check token expiry
      const isExpired = authService.isTokenExpired();
      setTestResults({
        loginSuccess: true,
        user: loginResponse.user,
        token: loginResponse.token?.substring(0, 50) + '...',
        refreshToken: loginResponse.refreshToken?.substring(0, 50) + '...',
        expiresIn: loginResponse.expiresIn,
        isAuthenticated: isAuth,
        isTokenExpired: isExpired,
        currentUser,
      });
    } catch (err: unknown) {
      logger.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
      setTestResults({
        loginSuccess: false,
        error: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRefreshToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newToken = await authService.refreshToken();

      setTestResults((prev: unknown) => ({
        ...prev,
        refreshSuccess: true,
        newToken: newToken?.substring(0, 50) + '...',
      }));
    } catch (err: unknown) {
      logger.error('❌ Refresh error:', err);
      setError(err.message || 'Token refresh failed');
      setTestResults((prev: unknown) => ({
        ...prev,
        refreshSuccess: false,
        refreshError: err.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testLogout = async () => {
    try {
      await authService.logout();
      setTestResults(null);
      setError(null);
    } catch (err: unknown) {
      logger.error('❌ Logout error:', err);
      setError(err.message || 'Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">AWS Cognito Authentication Test</h1>

        <div className="grid gap-6">
          {/* Login Form */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Test Credentials
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="admin@teste.com"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Admin123!"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={testLogin}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Login'
                  )}
                </Button>

                {testResults?.loginSuccess && (
                  <>
                    <Button
                      onClick={testRefreshToken}
                      disabled={isLoading}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Test Refresh Token
                    </Button>
                    
                    <Button
                      onClick={testLogout}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm font-medium mb-2">Quick Tests:</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
                  onClick={() => {
                    setEmail('admin@teste.com');
                    setPassword('Admin123!');
                  }}
                >
                  Admin
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
                  onClick={() => {
                    setEmail('medico@teste.com');
                    setPassword('Medico123!');
                  }}
                >
                  Médico
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
                  onClick={() => {
                    setEmail('aluno@teste.com');
                    setPassword('Aluno123!');
                  }}
                >
                  Aluno
                </Button>
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="p-4 bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </Card>
          )}

          {/* Test Results */}
          {testResults && (
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Test Results
              </h2>

              <div className="space-y-3">
                {/* Login Status */}
                <div className="flex items-center gap-2">
                  {testResults.loginSuccess ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-white">
                    Login: {testResults.loginSuccess ? 'Success' : 'Failed'}
                  </span>
                </div>

                {/* User Info */}
                {testResults.user && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User Information
                    </h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>ID: {testResults.user.id}</div>
                      <div>Email: {testResults.user.email}</div>
                      <div>Name: {testResults.user.name}</div>
                      <div>Role: {testResults.user.role}</div>
                    </div>
                  </div>
                )}

                {/* Token Info */}
                {testResults.token && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h3 className="text-sm font-medium text-white mb-2">Token Information</h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>ID Token: {testResults.token}</div>
                      <div>Refresh Token: {testResults.refreshToken}</div>
                      <div>Expires In: {testResults.expiresIn} seconds</div>
                      <div>Is Authenticated: {testResults.isAuthenticated ? 'Yes' : 'No'}</div>
                      <div>Is Expired: {testResults.isTokenExpired ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                )}

                {/* Refresh Token Result */}
                {testResults.refreshSuccess !== undefined && (
                  <div className="flex items-center gap-2">
                    {testResults.refreshSuccess ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-white">
                      Token Refresh: {testResults.refreshSuccess ? 'Success' : 'Failed'}
                    </span>
                  </div>
                )}

                {testResults.newToken && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h3 className="text-sm font-medium text-white mb-2">New Token</h3>
                    <div className="text-sm text-gray-300">
                      {testResults.newToken}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Console Instructions */}
          <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
            <p className="text-yellow-300 text-sm">
              💡 Open browser console (F12) to see detailed logs
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}