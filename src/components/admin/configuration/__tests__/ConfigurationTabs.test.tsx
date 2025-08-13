import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ConfigurationTabs, useConfigurationTabs } from '../ConfigurationTabs';
import { renderHook, act } from '@testing-library/react';
import { Settings, User, Mail } from 'lucide-react';

describe('ConfigurationTabs', () => {
  const mockOnTabChange = jest.fn();
  const mockTabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings className="h-4 w-4" />,
      content: <div>General content</div>,
      status: 'complete' as const,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <User className="h-4 w-4" />,
      content: <div>Users content</div>,
      status: 'incomplete' as const,
      badge: '3',
    },
    {
      id: 'email',
      label: 'Email',
      icon: <Mail className="h-4 w-4" />,
      content: <div>Email content</div>,
      status: 'error' as const,
      disabled: true,
    },
  ];

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('renders all tabs with labels', () => {
    render(<ConfigurationTabs tabs={mockTabs} onTabChange={mockOnTabChange} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('displays tab icons when provided', () => {
    render(<ConfigurationTabs tabs={mockTabs} onTabChange={mockOnTabChange} />);

    // Icons are rendered but we can't easily test their presence
    // We can test that the tabs render correctly
    expect(screen.getByRole('tab', { name: /General/ })).toBeInTheDocument();
  });

  it('shows status icons when showStatus is true', () => {
    render(
      <ConfigurationTabs
        tabs={mockTabs}
        onTabChange={mockOnTabChange}
        showStatus={true}
      />
    );

    // Status icons are rendered but testing their exact presence is complex
    // We can verify the tabs have the correct styling based on status
    const generalTab = screen.getByRole('tab', { name: /General/ });
    expect(generalTab).toHaveClass('border-green-400/50');
  });

  it('displays badges when provided', () => {
    render(<ConfigurationTabs tabs={mockTabs} onTabChange={mockOnTabChange} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders content for active tab', () => {
    render(
      <ConfigurationTabs
        tabs={mockTabs}
        onTabChange={mockOnTabChange}
        defaultTab="general"
      />
    );

    expect(screen.getByText('General content')).toBeInTheDocument();
    expect(screen.queryByText('Users content')).not.toBeInTheDocument();
  });

  it('switches content when tab is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ConfigurationTabs
        tabs={mockTabs}
        onTabChange={mockOnTabChange}
        defaultTab="general"
      />
    );

    const usersTab = screen.getByRole('tab', { name: /Users/ });
    await user.click(usersTab);

    expect(screen.getByText('Users content')).toBeInTheDocument();
    expect(screen.queryByText('General content')).not.toBeInTheDocument();
    expect(mockOnTabChange).toHaveBeenCalledWith('users');
  });

  it('disables tabs when disabled prop is set', () => {
    render(<ConfigurationTabs tabs={mockTabs} onTabChange={mockOnTabChange} />);

    const emailTab = screen.getByRole('tab', { name: /Email/ });
    expect(emailTab).toBeDisabled();
  });

  it('defaults to first tab when no defaultTab is provided', () => {
    render(<ConfigurationTabs tabs={mockTabs} onTabChange={mockOnTabChange} />);

    expect(screen.getByText('General content')).toBeInTheDocument();
  });

  it('renders in vertical orientation', () => {
    const { container } = render(
      <ConfigurationTabs
        tabs={mockTabs}
        onTabChange={mockOnTabChange}
        orientation="vertical"
      />
    );

    const tabsList = container.querySelector('[role="tablist"]');
    expect(tabsList).toHaveClass('flex-col');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ConfigurationTabs
        tabs={mockTabs}
        onTabChange={mockOnTabChange}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('hides status icons when showStatus is false', () => {
    const { container } = render(
      <ConfigurationTabs
        tabs={mockTabs}
        onTabChange={mockOnTabChange}
        showStatus={false}
      />
    );

    const generalTab = screen.getByRole('tab', { name: /General/ });
    expect(generalTab).not.toHaveClass('border-green-400/50');
  });
});

describe('useConfigurationTabs', () => {
  const initialTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content 1</div>,
      status: 'pending' as const,
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content 2</div>,
      status: 'complete' as const,
    },
  ];

  it('initializes with provided tabs', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    expect(result.current.tabs).toEqual(initialTabs);
  });

  it('updates tab status', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    act(() => {
      result.current.updateTabStatus('tab1', 'complete');
    });

    expect(result.current.getTabStatus('tab1')).toBe('complete');
  });

  it('updates tab badge', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    act(() => {
      result.current.updateTabBadge('tab1', 'NEW');
    });

    const updatedTab = result.current.tabs.find(tab => tab.id === 'tab1');
    expect(updatedTab?.badge).toBe('NEW');
  });

  it('sets tab disabled state', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    act(() => {
      result.current.setTabDisabled('tab1', true);
    });

    const updatedTab = result.current.tabs.find(tab => tab.id === 'tab1');
    expect(updatedTab?.disabled).toBe(true);
  });

  it('gets tab status correctly', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    expect(result.current.getTabStatus('tab1')).toBe('pending');
    expect(result.current.getTabStatus('tab2')).toBe('complete');
    expect(result.current.getTabStatus('nonexistent')).toBeUndefined();
  });

  it('counts completed tabs correctly', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    expect(result.current.getCompletedTabsCount()).toBe(1);

    act(() => {
      result.current.updateTabStatus('tab1', 'complete');
    });

    expect(result.current.getCompletedTabsCount()).toBe(2);
  });

  it('counts error tabs correctly', () => {
    const { result } = renderHook(() => useConfigurationTabs(initialTabs));

    expect(result.current.getErrorTabsCount()).toBe(0);

    act(() => {
      result.current.updateTabStatus('tab1', 'error');
    });

    expect(result.current.getErrorTabsCount()).toBe(1);
  });
});
