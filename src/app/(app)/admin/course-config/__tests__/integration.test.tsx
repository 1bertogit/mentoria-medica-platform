import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfigurationProvider } from '@/contexts/configuration-context';
import EmailConfiguration from '../email/page';
import AppearanceConfiguration from '../appearance/page';
import DomainConfiguration from '../domain/page';
import UserManagementConfiguration from '../users/page';
import SupportConfiguration from '../support/page';
import AdvancedConfiguration from '../advanced/page';
import GamificationConfiguration from '../gamification/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/admin/course-config',
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Course Configuration System Integration Tests', () => {
  const renderWithProvider = (Component: React.ComponentType) => {
    return render(
      <ConfigurationProvider>
        <Component />
      </ConfigurationProvider>
    );
  };

  describe('Email Configuration', () => {
    it('should render email configuration page', async () => {
      renderWithProvider(EmailConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Configuração de Email/i)).toBeInTheDocument();
      });
    });

    it('should have all email configuration tabs', async () => {
      renderWithProvider(EmailConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Tema')).toBeInTheDocument();
        expect(screen.getByText('Branding')).toBeInTheDocument();
        expect(screen.getByText('Remetente')).toBeInTheDocument();
        expect(screen.getByText('Templates')).toBeInTheDocument();
        expect(screen.getByText('Configurações')).toBeInTheDocument();
      });
    });
  });

  describe('Appearance Configuration', () => {
    it('should render appearance configuration page', async () => {
      renderWithProvider(AppearanceConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Configuração de Aparência/i)).toBeInTheDocument();
      });
    });

    it('should have all appearance configuration tabs', async () => {
      renderWithProvider(AppearanceConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Área do Aluno')).toBeInTheDocument();
        expect(screen.getByText('Rodapé')).toBeInTheDocument();
        expect(screen.getByText('Autenticação')).toBeInTheDocument();
        expect(screen.getByText('Área Admin')).toBeInTheDocument();
        expect(screen.getByText('PWA')).toBeInTheDocument();
      });
    });
  });

  describe('Domain Configuration', () => {
    it('should render domain configuration page', async () => {
      renderWithProvider(DomainConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Domínio e Configurações Gerais/i)).toBeInTheDocument();
      });
    });

    it('should have domain configuration sections', async () => {
      renderWithProvider(DomainConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Domínio Customizado')).toBeInTheDocument();
        expect(screen.getByText('Páginas Dinâmicas')).toBeInTheDocument();
        expect(screen.getByText('Localização')).toBeInTheDocument();
        expect(screen.getByText('Termos Legais')).toBeInTheDocument();
        expect(screen.getByText('Compartilhamento Social')).toBeInTheDocument();
      });
    });
  });

  describe('User Management Configuration', () => {
    it('should render user management configuration page', async () => {
      renderWithProvider(UserManagementConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Configuração de Gerenciamento de Usuários/i)).toBeInTheDocument();
      });
    });

    it('should have user management sections', async () => {
      renderWithProvider(UserManagementConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Configurações de Autenticação')).toBeInTheDocument();
        expect(screen.getByText('Restrições de Perfil')).toBeInTheDocument();
        expect(screen.getByText('Configurações de Registro')).toBeInTheDocument();
      });
    });
  });

  describe('Support Configuration', () => {
    it('should render support configuration page', async () => {
      renderWithProvider(SupportConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Configuração de Recursos de Suporte/i)).toBeInTheDocument();
      });
    });

    it('should have support configuration sections', async () => {
      renderWithProvider(SupportConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Sistema de Comentários')).toBeInTheDocument();
        expect(screen.getByText('Sistema de Perguntas')).toBeInTheDocument();
        expect(screen.getByText('Sistema de Suporte')).toBeInTheDocument();
        expect(screen.getByText('FAQ (Perguntas Frequentes)')).toBeInTheDocument();
        expect(screen.getByText('Exibição de Usuários')).toBeInTheDocument();
      });
    });
  });

  describe('Advanced Configuration', () => {
    it('should render advanced configuration page', async () => {
      renderWithProvider(AdvancedConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Configurações Avançadas/i)).toBeInTheDocument();
      });
    });

    it('should have advanced configuration sections', async () => {
      renderWithProvider(AdvancedConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Certificados')).toBeInTheDocument();
        expect(screen.getByText('Rastreamento de Progresso')).toBeInTheDocument();
        expect(screen.getByText('Conteúdo Dinâmico')).toBeInTheDocument();
        expect(screen.getByText('Proteção DRM')).toBeInTheDocument();
        expect(screen.getByText('Gerenciamento de Chaves API')).toBeInTheDocument();
      });
    });
  });

  describe('Gamification Configuration', () => {
    it('should render gamification configuration page', async () => {
      renderWithProvider(GamificationConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText(/Configuração de Gamificação/i)).toBeInTheDocument();
      });
    });

    it('should have gamification configuration sections', async () => {
      renderWithProvider(GamificationConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Exibição de Rankings')).toBeInTheDocument();
        expect(screen.getByText('Gatilhos de Pontuação')).toBeInTheDocument();
        expect(screen.getByText('Visualização de Gamificação')).toBeInTheDocument();
      });
    });

    it('should display total possible points', async () => {
      renderWithProvider(GamificationConfiguration);
      
      await waitFor(() => {
        expect(screen.getByText('Total de Pontos Possíveis')).toBeInTheDocument();
      });
    });
  });
});