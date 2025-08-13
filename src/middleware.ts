import { NextRequest, NextResponse } from 'next/server';

// Rotas públicas que não precisam de autenticação
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/error',
  '/api/auth',
  '/mentoria',
];

// Rotas administrativas
const adminPaths = ['/admin'];

// Função para verificar se há token de autenticação válido
function getAuthToken(request: NextRequest): string | null {
  // Check for auth token in cookies (more secure than localStorage)
  const token = request.cookies.get('auth-token')?.value;

  // Also check for Cognito tokens
  const cognitoIdToken = request.cookies.get('cognito-id-token')?.value;
  const cognitoAccessToken = request.cookies.get('cognito-access-token')?.value;

  // In development, allow mock token for testing
  if (process.env.NODE_ENV === 'development' && !token && !cognitoIdToken) {
    // Only return mock token if explicitly enabled via env variable
    if (process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true') {
      return 'mock-token';
    }
  }

  return token || cognitoIdToken || cognitoAccessToken || null;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Verificar autenticação básica
  const token = getAuthToken(request);

  // Verificar se é uma rota pública
  const isPublicPath = publicPaths.some(
    path => pathname === path || pathname.startsWith(path)
  );
  const isApiPath = pathname.startsWith('/api/');

  // Authentication enforcement - now enabled
  // Skip authentication for API routes (handled individually)
  if (!isApiPath) {
    // Redirecionar para login se não autenticado e não for rota pública
    if (!token && !isPublicPath) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Redirecionar para dashboard se autenticado e tentar acessar login
    if (token && pathname === '/auth/signin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Verificar permissões de admin
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
    if (isAdminPath && !token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Content Security Policy - configurado para AWS Cognito + NextAuth
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval necessário para Next.js dev
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Google Fonts + styled-jsx
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.firebase.googleapis.com https://*.googleapis.com https://*.amazonaws.com wss://ws-*.pusher.channels.pusher.com https://api.pusher.channels.pusher.com",
    "worker-src 'self' blob:",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

  // Headers de segurança essenciais
  const securityHeaders = {
    // Previne ataques de clickjacking
    'X-Frame-Options': 'DENY',

    // Previne MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Força HTTPS (apenas em produção)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security':
        'max-age=31536000; includeSubDomains; preload',
    }),

    // Controla informações do referrer
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Content Security Policy
    'Content-Security-Policy': csp,

    // Permissões da API (controla acesso a recursos do navegador)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
    ].join(', '),

    // Remove headers que revelam informações do servidor
    'X-Powered-By': '',

    // Previne ataques DNS rebinding
    'X-DNS-Prefetch-Control': 'off',

    // Controla recursos externos
    'Cross-Origin-Embedder-Policy': 'unsafe-none', // Mudou de require-corp para compatibilidade
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // Permite popups para auth
    'Cross-Origin-Resource-Policy': 'cross-origin',
  };

  // Aplicar todos os headers de segurança
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    } else {
      response.headers.delete(key);
    }
  });

  // Headers específicos para API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  // Headers para arquivos estáticos (cache otimizado)
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Aplica middleware a todas as rotas exceto:
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};
