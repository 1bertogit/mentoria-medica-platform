import type { Course } from '@/types';
'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import {
  CourseAdminConfiguration,
  ConfigurationChange,
  ConfigurationHistory,
} from '@/types/course-admin';
import { configurationPersistence } from '@/lib/services/configuration-persistence';

interface ConfigurationState {
  configuration: CourseAdminConfiguration | null;
  history: ConfigurationHistory[];
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
}

type ConfigurationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONFIGURATION'; payload: CourseAdminConfiguration }
  | { type: 'UPDATE_CONFIGURATION'; payload: { section: string; data: unknown } }
  | { type: 'ADD_HISTORY'; payload: ConfigurationHistory }
  | { type: 'SET_HISTORY'; payload: ConfigurationHistory[] }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'RESET' };

const initialState: ConfigurationState = {
  configuration: null,
  history: [],
  isLoading: false,
  error: null,
  isDirty: false,
};

function configurationReducer(
  state: ConfigurationState,
  action: ConfigurationAction
): ConfigurationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CONFIGURATION':
      return {
        ...state,
        configuration: action.payload,
        isLoading: false,
        error: null,
        isDirty: false,
      };
    case 'UPDATE_CONFIGURATION':
      if (!state.configuration) return state;
      return {
        ...state,
        configuration: {
          ...state.configuration,
          [action.payload.section]: {
            ...(state.configuration[
              action.payload.section as keyof CourseAdminConfiguration
            ] as any || {}),
            ...action.payload.data,
          },
          lastModified: new Date().toISOString(),
          version: state.configuration.version + 1,
        },
        isDirty: true,
      };
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case 'SET_HISTORY':
      return {
        ...state,
        history: action.payload,
      };
    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface ConfigurationContextType {
  state: ConfigurationState;
  loadConfiguration: (organizationId: string) => Promise<void>;
  saveConfiguration: () => Promise<void>;
  updateConfiguration: (section: string, data: unknown, reason?: string) => void;
  resetConfiguration: () => void;
  getConfigurationHistory: (organizationId: string) => Promise<void>;
  rollbackToVersion: (historyId: string) => Promise<void>;
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

interface ConfigurationProviderProps {
  children: React.ReactNode;
}

export function ConfigurationProvider({
  children,
}: ConfigurationProviderProps) {
  const [state, dispatch] = useReducer(configurationReducer, initialState);

  const loadConfiguration = useCallback(async (organizationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const config =
        await configurationPersistence.loadConfiguration(organizationId);
      dispatch({ type: 'SET_CONFIGURATION', payload: config });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'Failed to load configuration',
      });
    }
  }, []);

  const saveConfiguration = useCallback(async () => {
    if (!state.configuration || !state.isDirty) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const savedConfig = await configurationPersistence.saveConfiguration(
        state.configuration
      );
      dispatch({ type: 'SET_CONFIGURATION', payload: savedConfig });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'Failed to save configuration',
      });
    }
  }, [state.configuration, state.isDirty]);

  const updateConfiguration = useCallback(
    (section: string, data: unknown, reason?: string) => {
      if (!state.configuration) return;

      // Create history entry for the change
      const changes: ConfigurationChange[] = Object.keys(data).map(key => ({
        field: key,
        oldValue: (state.configuration as any)[section]?.[key],
        newValue: data[key],
        section,
      }));

      const historyEntry: ConfigurationHistory = {
        id: `history_${Date.now()}`,
        configurationId: state.configuration.id,
        changes,
        timestamp: new Date().toISOString(),
        userId: 'current-user-id', // In real implementation, get from auth context
        userName: 'Current User', // In real implementation, get from auth context
        reason,
      };

      dispatch({ type: 'UPDATE_CONFIGURATION', payload: { section, data } });
      dispatch({ type: 'ADD_HISTORY', payload: historyEntry });
    },
    [state.configuration]
  );

  const resetConfiguration = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const getConfigurationHistory = useCallback(
    async (organizationId: string) => {
      if (!state.configuration) return;

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const history = await configurationPersistence.loadConfigurationHistory(
          state.configuration.id
        );
        dispatch({ type: 'SET_HISTORY', payload: history });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload:
            error instanceof Error ? error.message : 'Failed to load history',
        });
      }
    },
    [state.configuration]
  );

  const rollbackToVersion = useCallback(
    async (historyId: string) => {
      if (!state.configuration) return;

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const rolledBackConfig =
          await configurationPersistence.rollbackConfiguration(
            state.configuration.id,
            historyId
          );
        dispatch({ type: 'SET_CONFIGURATION', payload: rolledBackConfig });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload:
            error instanceof Error
              ? error.message
              : 'Failed to rollback configuration',
        });
      }
    },
    [state.configuration]
  );

  // Auto-save functionality
  useEffect(() => {
    if (state.isDirty && state.configuration) {
      const autoSaveTimer = setTimeout(() => {
        saveConfiguration();
      }, 30000); // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [state.isDirty, state.configuration, saveConfiguration]);

  const contextValue: ConfigurationContextType = {
    state,
    loadConfiguration,
    saveConfiguration,
    updateConfiguration,
    resetConfiguration,
    getConfigurationHistory,
    rollbackToVersion,
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error(
      'useConfiguration must be used within a ConfigurationProvider'
    );
  }
  return context;
}
