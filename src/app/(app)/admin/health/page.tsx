'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
} from 'lucide-react';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'not_configured';
  message: string;
  details?: unknown;
}

interface HealthSummary {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: HealthStatus[];
  timestamp: string;
  configured: number;
  healthy: number;
  total: number;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLastCheck(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      logger.error('Failed to check health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'not_configured':
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'bg-green-100 text-green-800',
      unhealthy: 'bg-red-100 text-red-800',
      not_configured: 'bg-gray-100 text-gray-800',
      degraded: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants.degraded
        }
      >
        {status === 'not_configured'
          ? 'Não Configurado'
          : status === 'healthy'
            ? 'Saudável'
            : status === 'unhealthy'
              ? 'Com Problemas'
              : 'Degradado'}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Status do Sistema</h1>
          <p className="text-muted-foreground">
            Monitoramento da saúde dos serviços AWS
          </p>
        </div>
        <Button onClick={checkHealth} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Atualizar
        </Button>
      </div>

      {health && (
        <>
          {/* Status Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(health.overall)}
                Status Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {health.healthy}
                  </div>
                  <div className="text-sm text-muted-foreground">Saudáveis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {health.configured}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Configurados
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {health.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  {getStatusBadge(health.overall)}
                </div>
              </div>
              {lastCheck && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Última verificação: {lastCheck}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status dos Serviços */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {health.services.map(service => (
              <Card key={service.service}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      {service.service}
                    </span>
                    {getStatusBadge(service.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {service.message}
                  </p>

                  {/* Details section temporarily removed due to type issues */}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guia de Configuração */}
          {health.configured < health.total && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-5 w-5" />
                  Configuração Necessária
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-800">
                <p className="mb-4">
                  Alguns serviços ainda não estão configurados. Para conectar
                  com AWS:
                </p>
                <ol className="list-inside list-decimal space-y-2 text-sm">
                  <li>Configure as credenciais AWS no arquivo .env.local</li>
                  <li>Crie as tabelas DynamoDB necessárias</li>
                  <li>Configure o bucket S3</li>
                  <li>Configure o Cognito User Pool</li>
                </ol>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {loading && !health && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
