/**
 * Sistema de Logger Avançado com Winston
 * Substitui todos os console.logs do projeto
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Configuração de ambiente
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Níveis customizados de log
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    verbose: 4,
    silly: 5,
    http: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
    verbose: 'magenta',
    silly: 'grey',
    http: 'blue'
  }
};

// Adiciona cores ao winston
winston.addColors(customLevels.colors);

// Formato para desenvolvimento
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaString = '';
    if (Object.keys(meta).length > 0) {
      metaString = '\n' + JSON.stringify(meta, null, 2);
    }
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  })
);

// Formato para produção
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transportes base
const transports: winston.transport[] = [];

// Console transport para desenvolvimento
if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: devFormat
    })
  );
}

// Console transport para produção (apenas erros)
if (isProduction) {
  transports.push(
    new winston.transports.Console({
      level: 'error',
      format: prodFormat
    })
  );
}

// File transports para produção
if (isProduction) {
  // Log de erro com rotação diária
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      maxSize: '20m',
      format: prodFormat
    })
  );

  // Log combinado com rotação diária
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '14d',
      maxSize: '50m',
      format: prodFormat
    })
  );

  // Log de auditoria para ações críticas
  transports.push(
    new DailyRotateFile({
      filename: 'logs/audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxFiles: '90d',
      maxSize: '100m',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  );
}

// Transporte silencioso para testes
if (isTest) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/test.log',
      level: 'error'
    })
  );
}

// Cria o logger principal
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: isDevelopment ? 'debug' : isProduction ? 'info' : 'error',
  transports,
  // Não sai do processo em caso de erro
  exitOnError: false,
  // Manipulador de exceções não capturadas
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  // Manipulador de rejeições de promises não capturadas
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Interface de logger compatível com console
export const appLogger = {
  // Métodos principais
  error: (message: string, meta?: unknown) => {
    logger.error(message, meta);
  },
  
  warn: (message: string, meta?: unknown) => {
    logger.warn(message, meta);
  },
  
  info: (message: string, meta?: unknown) => {
    logger.info(message, meta);
  },
  
  debug: (message: string, meta?: unknown) => {
    if (isDevelopment) {
      logger.debug(message, meta);
    }
  },
  
  verbose: (message: string, meta?: unknown) => {
    if (isDevelopment) {
      logger.verbose(message, meta);
    }
  },

  // Métodos especiais
  http: (message: string, meta?: unknown) => {
    logger.log('http', message, meta);
  },

  audit: (action: string, userId?: string, meta?: unknown) => {
    logger.warn(`AUDIT: ${action}`, { userId, ...meta });
  },

  performance: (operation: string, duration: number, meta?: unknown) => {
    logger.info(`PERFORMANCE: ${operation} took ${duration}ms`, meta);
  },

  security: (event: string, details?: unknown) => {
    logger.error(`SECURITY: ${event}`, details);
  },

  // Métodos de compatibilidade com console
  log: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      logger.info(message, args.length > 0 ? { args } : {});
    }
  },

  table: (data: unknown) => {
    if (isDevelopment) {
      logger.debug('TABLE DATA:', data);
    }
  },

  time: (label: string) => {
    if (isDevelopment) {
      console.time(label); // Mantém funcionalidade nativa
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label); // Mantém funcionalidade nativa
    }
  },

  // Método para logging estruturado
  structured: (level: string, message: string, data: unknown) => {
    logger.log(level as any, message, data);
  }
};

// Logger específico para diferentes módulos
export const createModuleLogger = (moduleName: string) => {
  return {
    error: (message: string, meta?: unknown) => appLogger.error(`[${moduleName}] ${message}`, meta),
    warn: (message: string, meta?: unknown) => appLogger.warn(`[${moduleName}] ${message}`, meta),
    info: (message: string, meta?: unknown) => appLogger.info(`[${moduleName}] ${message}`, meta),
    debug: (message: string, meta?: unknown) => appLogger.debug(`[${moduleName}] ${message}`, meta),
    audit: (action: string, userId?: string, meta?: unknown) => appLogger.audit(`[${moduleName}] ${action}`, userId, meta)
  };
};

// Exportações de conveniência
export const logger = appLogger;
export default appLogger;

// Loggers específicos por módulo
export const authLogger = createModuleLogger('AUTH');
export const awsLogger = createModuleLogger('AWS');
export const apiLogger = createModuleLogger('API');
export const dbLogger = createModuleLogger('DATABASE');
export const uiLogger = createModuleLogger('UI');

// Middleware para Express (se necessário)
export const httpLoggerMiddleware = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/http.log',
      level: 'http' 
    })
  ]
});

// Utilitários de logging
export const loggerUtils = {
  // Mede tempo de execução de uma função
  timeAsync: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const start = Date.now();
    try {
      const result = await fn();
      appLogger.performance(label, Date.now() - start, { success: true });
      return result;
    } catch (error) {
      appLogger.performance(label, Date.now() - start, { success: false, error });
      throw error;
    }
  },

  // Mede tempo de execução de uma função síncrona
  timeSync: <T>(label: string, fn: () => T): T => {
    const start = Date.now();
    try {
      const result = fn();
      appLogger.performance(label, Date.now() - start, { success: true });
      return result;
    } catch (error) {
      appLogger.performance(label, Date.now() - start, { success: false, error });
      throw error;
    }
  },

  // Log de entrada e saída de função
  wrapFunction: <T extends (...args: unknown[]) => any>(
    functionName: string,
    fn: T
  ): T => {
    return ((...args: unknown[]) => {
      appLogger.debug(`ENTER ${functionName}`, { args });
      try {
        const result = fn(...args);
        appLogger.debug(`EXIT ${functionName}`, { result });
        return result;
      } catch (error) {
        appLogger.error(`ERROR ${functionName}`, { error, args });
        throw error;
      }
    }) as T;
  }
};

// Interceptor de console para detectar usos não migrados
if (isProduction) {
  const originalConsole = { ...console };
  
  console.log = (...args: unknown[]) => {
    appLogger.warn('UNMIGRATED console.log detected', { args });
  };
  
  console.error = (...args: unknown[]) => {
    appLogger.error('UNMIGRATED console.error detected', { args });
  };
  
  console.warn = (...args: unknown[]) => {
    appLogger.warn('UNMIGRATED console.warn detected', { args });
  };
  
  // Mantém originalConsole disponível para emergências
  (global as any).__originalConsole = originalConsole;
}