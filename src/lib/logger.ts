/**
 * Logger condicional para desenvolvimento
 * Em produção, todos os logs são desabilitados
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[LOG]', new Date().toISOString(), ...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[INFO]', new Date().toISOString(), ...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', new Date().toISOString(), ...args);
    }
  },
  
  error: (...args: unknown[]) => {
    // Erros são sempre logados, mas em produção poderiam ser enviados para um serviço de monitoramento
    if (isDevelopment) {
      console.error('[ERROR]', new Date().toISOString(), ...args);
    } else {
      // Em produção, enviar para serviço de monitoramento (ex: Sentry, LogRocket)
      // Por enquanto, apenas registra no console em modo silencioso
      console.error('[ERROR]', ...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', new Date().toISOString(), ...args);
    }
  },
  
  table: (data: unknown) => {
    if (isDevelopment) {
      console.table(data);
    }
  },
  
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

// Export default para substituição direta de console
export default logger;