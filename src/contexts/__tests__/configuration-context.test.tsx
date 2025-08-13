/**
 * Unit tests for Configuration Context
 * Tests configuration state management, persistence, and history tracking
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import {
  ConfigurationProvider,
  useConfiguration,
} from '../configuration-context';
import {
  CourseAdminConfiguration,
  ConfigurationHistory,
} from '@/types/course-admin';
import { configurationPersistence } from '@/lib/services/configuration-persistence';

// Mock the persistence service
jest.mock('@/lib/services/configuration-persistence', () => ({
  configurationPersistence: {
    loadConfiguration: jest.fn(),
    saveConfiguration: jest.fn(),
    loadConfigurationHistory: jest.fn(),
    rollbackConfiguration: jest.fn(),
  },
}));

const mockConfigurationPersistence = configurationPersistence as any;

// Mock configuration data
const mockConfiguration: CourseAdminConfiguration = {
  id: 'config-1',
  organizationId: 'org-1',
  email: {
    theme: {
      backgroundColor: '#FFFFFF',
      bodyColor: '#F8F9FA',
      textColor: '#212529',
      footerTextColor: '#6C757D',
      linkColor: '#0D6EFD',
    },
    branding: {
      logo: {
        file: null,
        height: 60,
        maxSize: 204800,
      },
    },
    sender: {
      name: 'Test Platform',
      replyTo: 'test@example.com',
    },
    templates: {
      welcomeSales: {
        enabled: true,
        autoAccess: true,
        customContent: 'Welcome!',
        subject: 'Welcome',
      },
      welcomeMigration: {
        enabled: false,
        autoAccess: false,
        customContent: '',
        subject: '',
      },
      welcomeFree: {
        enabled: false,
        autoAccess: false,
        customContent: '',
        subject: '',
      },
      newAccess: {
        enabled: false,
        autoAccess: false,
        customContent: '',
        subject: '',
      },
    },
    settings: {
      enableEmailSending: true,
      enableAutoAccess: true,
    },
  },
  appearance: {
    studentArea: {
      pageTitle: 'Test Platform',
      highlightColor: '#0D6EFD',
      darkMode: false,
      theme: 'educational',
      footer: {
        visible: true,
        showMessage: false,
        message: '',
        showDisclaimer: false,
        disclaimer: '',
        showTerms: false,
        termsUrl: '',
        showPrivacy: false,
        privacyUrl: '',
      },
      navigation: [],
    },
    authentication: {
      formPosition: 'right',
      colors: {
        primary: '#0D6EFD',
        secondary: '#6C757D',
        background: '#FFFFFF',
        text: '#212529',
        accent: '#198754',
      },
      backgroundImage: {
        file: null,
      },
      logo: {
        horizontal: {
          file: null,
        },
        favicon: {
          file: null,
        },
      },
      buttons: {
        primary: {
          backgroundColor: '#0D6EFD',
          textColor: '#FFFFFF',
          borderColor: '#0D6EFD',
          hoverBackgroundColor: '#0B5ED7',
        },
        secondary: {
          backgroundColor: '#6C757D',
          textColor: '#FFFFFF',
          borderColor: '#6C757D',
          hoverBackgroundColor: '#5C636A',
        },
      },
    },
    adminArea: {
      logo: {
        file: null,
      },
      highlightColor: '#DC3545',
      greeting: 'firstName',
    },
    pwa: {
      title: 'Test Platform',
      icon: {
        file: null,
      },
    },
  },
  general: {
    domain: {
      custom: '',
      cname: '',
      token: '',
      active: false,
      verified: false,
    },
    dynamicPages: {
      homeFlowUrl: '',
      firstAccessUrl: '',
    },
    localization: {
      language: 'pt',
    },
    legal: {
      termsRequired: false,
      termsContent: '',
    },
    socialSharing: {
      title: 'Test Platform',
      description: '',
      image: {
        file: null,
      },
    },
  },
  users: {
    authentication: {
      passwordField: 'default',
      defaultPassword: '',
      randomPasswords: false,
    },
    profileRestrictions: {
      blockNameCpf: false,
      blockEmail: false,
      hideDocument: false,
      hideAddress: false,
      hidePhone: false,
    },
    registration: {
      freeRegistration: {
        viaLogin: false,
        viaUrl: false,
        restrictDomains: false,
        allowedDomains: [],
        recaptcha: false,
      },
      productAccess: [],
      freeUsersOnly: false,
    },
  },
  support: {
    comments: {
      enabled: false,
      moderation: false,
      title: 'Comments',
      showTags: false,
      placeholder: 'Type your comment...',
    },
    questions: {
      enabled: false,
      title: 'Questions',
      placeholder: 'Type your question...',
    },
    support: {
      enabled: false,
    },
    faq: {
      enabled: false,
    },
    userDisplay: {
      format: 'firstName',
    },
  },
  advanced: {
    certificates: {
      enabled: false,
    },
    progressTracking: {
      autoMarkLessons: true,
    },
    dynamicContent: {
      enabled: false,
    },
    drm: {
      socialPdf: false,
      pandaVideo: false,
      videofront: false,
      position: 'footer',
    },
    apiKeys: [],
  },
  gamification: {
    display: {
      showRanking: false,
      showTotalUsers: false,
      showFullNames: false,
    },
    triggers: {
      lessonCompleted: {
        enabled: false,
        points: 0,
      },
      courseStarted: {
        enabled: false,
        points: 0,
      },
      progress50: {
        enabled: false,
        points: 0,
      },
      progress75: {
        enabled: false,
        points: 0,
      },
      progress90: {
        enabled: false,
        points: 0,
      },
      courseCompleted: {
        enabled: false,
        points: 0,
      },
      certificateIssued: {
        enabled: false,
        points: 0,
      },
      questionSubmitted: {
        enabled: false,
        points: 0,
      },
      commentPosted: {
        enabled: false,
        points: 0,
      },
      examPassed: {
        enabled: false,
        points: 0,
      },
    },
  },
  version: 1,
  lastModified: '2024-01-20T15:30:00Z',
  modifiedBy: 'Test User',
};

const mockHistory: ConfigurationHistory[] = [
  {
    id: 'history-1',
    configurationId: 'config-1',
    changes: [
      {
        field: 'backgroundColor',
        oldValue: '#F8F9FA',
        newValue: '#FFFFFF',
        section: 'email',
      },
    ],
    timestamp: '2024-01-20T15:30:00Z',
    userId: '1',
    userName: 'Test User',
    reason: 'Theme update',
  },
];

// Test component that uses the configuration context
function TestComponent() {
  const {
    state,
    loadConfiguration,
    saveConfiguration,
    updateConfiguration,
    resetConfiguration,
    getConfigurationHistory,
    rollbackToVersion,
  } = useConfiguration();

  return (
    <div>
      <div data-testid="loading">
        {state.isLoading ? 'Loading' : 'Not Loading'}
      </div>
      <div data-testid="error">{state.error || 'No Error'}</div>
      <div data-testid="dirty">{state.isDirty ? 'Dirty' : 'Clean'}</div>
      <div data-testid="config-id">
        {state.configuration?.id || 'No Config'}
      </div>
      <div data-testid="history-count">{state.history.length}</div>

      <button onClick={() => loadConfiguration('org-1')}>Load Config</button>
      <button onClick={() => saveConfiguration()}>Save Config</button>
      <button
        onClick={() =>
          updateConfiguration('email', { sender: { name: 'Updated Name' } })
        }
      >
        Update Config
      </button>
      <button onClick={() => resetConfiguration()}>Reset Config</button>
      <button onClick={() => getConfigurationHistory('org-1')}>
        Load History
      </button>
      <button onClick={() => rollbackToVersion('history-1')}>Rollback</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ConfigurationProvider>
      <TestComponent />
    </ConfigurationProvider>
  );
}

describe('ConfigurationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      renderWithProvider();

      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('error')).toHaveTextContent('No Error');
      expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');
      expect(screen.getByTestId('config-id')).toHaveTextContent('No Config');
      expect(screen.getByTestId('history-count')).toHaveTextContent('0');
    });
  });

  describe('Load Configuration', () => {
    it('should load configuration successfully', async () => {
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );

      renderWithProvider();

      act(() => {
        screen.getByText('Load Config').click();
      });

      // Should show loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
        expect(screen.getByTestId('error')).toHaveTextContent('No Error');
      });

      expect(
        mockConfigurationPersistence.loadConfiguration
      ).toHaveBeenCalledWith('org-1');
    });

    it('should handle load configuration error', async () => {
      const errorMessage = 'Failed to load configuration';
      mockConfigurationPersistence.loadConfiguration.mockRejectedValue(
        new Error(errorMessage)
      );

      renderWithProvider();

      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
        expect(screen.getByTestId('config-id')).toHaveTextContent('No Config');
      });
    });
  });

  describe('Save Configuration', () => {
    it('should save configuration when dirty', async () => {
      const updatedConfig = { ...mockConfiguration, version: 2 };
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.saveConfiguration.mockResolvedValue(
        updatedConfig
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Update configuration to make it dirty
      act(() => {
        screen.getByText('Update Config').click();
      });

      expect(screen.getByTestId('dirty')).toHaveTextContent('Dirty');

      // Save configuration
      act(() => {
        screen.getByText('Save Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');
      });

      expect(
        mockConfigurationPersistence.saveConfiguration
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'config-1',
          version: expect.any(Number),
        })
      );
    });

    it('should not save configuration when not dirty', async () => {
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Try to save without making changes
      act(() => {
        screen.getByText('Save Config').click();
      });

      // Should not call save since configuration is not dirty
      expect(
        mockConfigurationPersistence.saveConfiguration
      ).not.toHaveBeenCalled();
    });

    it('should handle save configuration error', async () => {
      const errorMessage = 'Failed to save configuration';
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.saveConfiguration.mockRejectedValue(
        new Error(errorMessage)
      );

      renderWithProvider();

      // Load and update configuration
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      act(() => {
        screen.getByText('Update Config').click();
      });

      // Try to save
      act(() => {
        screen.getByText('Save Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('Update Configuration', () => {
    it('should update configuration and mark as dirty', async () => {
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');

      // Update configuration
      act(() => {
        screen.getByText('Update Config').click();
      });

      expect(screen.getByTestId('dirty')).toHaveTextContent('Dirty');
      expect(screen.getByTestId('history-count')).toHaveTextContent('1');
    });

    it('should not update configuration when no configuration is loaded', () => {
      renderWithProvider();

      // Try to update without loading configuration first
      act(() => {
        screen.getByText('Update Config').click();
      });

      expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');
      expect(screen.getByTestId('history-count')).toHaveTextContent('0');
    });
  });

  describe('Configuration History', () => {
    it('should load configuration history', async () => {
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.loadConfigurationHistory.mockResolvedValue(
        mockHistory
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Load history
      act(() => {
        screen.getByText('Load History').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('history-count')).toHaveTextContent('1');
      });

      expect(
        mockConfigurationPersistence.loadConfigurationHistory
      ).toHaveBeenCalledWith('config-1');
    });

    it('should handle load history error', async () => {
      const errorMessage = 'Failed to load history';
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.loadConfigurationHistory.mockRejectedValue(
        new Error(errorMessage)
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Try to load history
      act(() => {
        screen.getByText('Load History').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('Rollback Configuration', () => {
    it('should rollback configuration to previous version', async () => {
      const rolledBackConfig = { ...mockConfiguration, version: 3 };
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.rollbackConfiguration.mockResolvedValue(
        rolledBackConfig
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Rollback configuration
      act(() => {
        screen.getByText('Rollback').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      expect(
        mockConfigurationPersistence.rollbackConfiguration
      ).toHaveBeenCalledWith('config-1', 'history-1');
    });

    it('should handle rollback error', async () => {
      const errorMessage = 'Failed to rollback configuration';
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.rollbackConfiguration.mockRejectedValue(
        new Error(errorMessage)
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Try to rollback
      act(() => {
        screen.getByText('Rollback').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('Reset Configuration', () => {
    it('should reset configuration to initial state', async () => {
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );

      renderWithProvider();

      // Load configuration first
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Reset configuration
      act(() => {
        screen.getByText('Reset Config').click();
      });

      expect(screen.getByTestId('config-id')).toHaveTextContent('No Config');
      expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');
      expect(screen.getByTestId('history-count')).toHaveTextContent('0');
      expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    });
  });

  describe('Auto-save Functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should auto-save after 30 seconds when configuration is dirty', async () => {
      const updatedConfig = { ...mockConfiguration, version: 2 };
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );
      mockConfigurationPersistence.saveConfiguration.mockResolvedValue(
        updatedConfig
      );

      renderWithProvider();

      // Load configuration
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Update configuration to make it dirty
      act(() => {
        screen.getByText('Update Config').click();
      });

      expect(screen.getByTestId('dirty')).toHaveTextContent('Dirty');

      // Fast-forward time by 30 seconds
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');
      });

      expect(mockConfigurationPersistence.saveConfiguration).toHaveBeenCalled();
    });

    it('should not auto-save when configuration is not dirty', async () => {
      mockConfigurationPersistence.loadConfiguration.mockResolvedValue(
        mockConfiguration
      );

      renderWithProvider();

      // Load configuration
      act(() => {
        screen.getByText('Load Config').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('config-id')).toHaveTextContent('config-1');
      });

      // Fast-forward time by 30 seconds without making changes
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(
        mockConfigurationPersistence.saveConfiguration
      ).not.toHaveBeenCalled();
    });
  });
});

describe('useConfiguration Hook', () => {
  it('should throw error when used outside of ConfigurationProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useConfiguration must be used within a ConfigurationProvider');

    consoleSpy.mockRestore();
  });
});
