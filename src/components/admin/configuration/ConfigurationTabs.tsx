'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface ConfigurationTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  status?: 'complete' | 'incomplete' | 'error' | 'pending';
  badge?: string | number;
  disabled?: boolean;
}

interface ConfigurationTabsProps {
  tabs: ConfigurationTab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showStatus?: boolean;
}

export function ConfigurationTabs({
  tabs,
  defaultTab,
  onTabChange,
  className,
  orientation = 'horizontal',
  showStatus = true,
}: ConfigurationTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getStatusIcon = (status?: ConfigurationTab['status']) => {
    if (!showStatus || !status) return null;

    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'incomplete':
        return <Circle className="h-4 w-4 text-yellow-400" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: ConfigurationTab['status']) => {
    switch (status) {
      case 'complete':
        return 'border-green-400/50 bg-green-400/10';
      case 'error':
        return 'border-red-400/50 bg-red-400/10';
      case 'incomplete':
        return 'border-yellow-400/50 bg-yellow-400/10';
      case 'pending':
        return 'border-gray-400/50 bg-gray-400/10';
      default:
        return '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        orientation={orientation}
        className={cn('w-full', orientation === 'vertical' && 'flex gap-6')}
      >
        <TabsList
          className={cn(
            'grid w-full border border-white/10 bg-white/5',
            orientation === 'horizontal' &&
              `grid-cols-${Math.min(tabs.length, 6)}`,
            orientation === 'vertical' && 'h-fit w-64 flex-col space-y-1'
          )}
        >
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center justify-start gap-2 px-4 py-3 text-left',
                'data-[state=active]:bg-white/10 data-[state=active]:text-white',
                'hover:text-white data-[state=inactive]:text-white/70',
                'disabled:cursor-not-allowed disabled:opacity-50',
                orientation === 'vertical' && 'w-full justify-start',
                showStatus && tab.status && getStatusColor(tab.status)
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {tab.icon && <div className="flex-shrink-0">{tab.icon}</div>}
                <span className="truncate">{tab.label}</span>
                {showStatus && getStatusIcon(tab.status)}
              </div>

              {tab.badge && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-white/20 text-xs text-white"
                >
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div
          className={cn('mt-6', orientation === 'vertical' && 'mt-0 flex-1')}
        >
          {tabs.map(tab => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="space-y-6 focus-visible:outline-none"
            >
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

// Hook for managing tab state and status
export function useConfigurationTabs(initialTabs: ConfigurationTab[]) {
  const [tabs, setTabs] = useState(initialTabs);

  const updateTabStatus = React.useCallback(
    (tabId: string, status: ConfigurationTab['status']) => {
      setTabs(prev =>
        prev.map(tab => (tab.id === tabId ? { ...tab, status } : tab))
      );
    },
    []
  );

  const updateTabBadge = React.useCallback(
    (tabId: string, badge: string | number | undefined) => {
      setTabs(prev =>
        prev.map(tab => (tab.id === tabId ? { ...tab, badge } : tab))
      );
    },
    []
  );

  const setTabDisabled = React.useCallback(
    (tabId: string, disabled: boolean) => {
      setTabs(prev =>
        prev.map(tab => (tab.id === tabId ? { ...tab, disabled } : tab))
      );
    },
    []
  );

  const getTabStatus = React.useCallback(
    (tabId: string) => {
      return tabs.find(tab => tab.id === tabId)?.status;
    },
    [tabs]
  );

  const getCompletedTabsCount = React.useCallback(() => {
    return tabs.filter(tab => tab.status === 'complete').length;
  }, [tabs]);

  const getErrorTabsCount = React.useCallback(() => {
    return tabs.filter(tab => tab.status === 'error').length;
  }, [tabs]);

  return {
    tabs,
    updateTabStatus,
    updateTabBadge,
    setTabDisabled,
    getTabStatus,
    getCompletedTabsCount,
    getErrorTabsCount,
  };
}
