'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ToggleOption {
  id: string;
  label: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
}

interface ToggleGroupProps {
  label?: string;
  options: ToggleOption[];
  onChange: (id: string, value: boolean) => void;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export function ToggleGroup({
  label,
  options,
  onChange,
  className,
  orientation = 'vertical',
  disabled = false,
}: ToggleGroupProps) {
  const handleToggle = (id: string, value: boolean) => {
    if (!disabled) {
      onChange(id, value);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label className="font-medium text-white">{label}</Label>}

      <div
        className={cn(
          'space-y-4',
          orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0'
        )}
      >
        {options.map(option => (
          <div
            key={option.id}
            className={cn(
              'flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-3',
              (disabled || option.disabled) && 'opacity-50'
            )}
          >
            <Switch
              id={option.id}
              checked={option.value}
              onCheckedChange={checked => handleToggle(option.id, checked)}
              disabled={disabled || option.disabled}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={option.id}
                className={cn(
                  'cursor-pointer text-white',
                  (disabled || option.disabled) && 'cursor-not-allowed'
                )}
              >
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-white/70">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Convenience hook for managing toggle group state
export function useToggleGroup(initialOptions: ToggleOption[]) {
  const [options, setOptions] = React.useState(initialOptions);

  const updateOption = React.useCallback((id: string, value: boolean) => {
    setOptions(prev =>
      prev.map(option => (option.id === id ? { ...option, value } : option))
    );
  }, []);

  const getOptionValue = React.useCallback(
    (id: string): boolean => {
      const option = options.find(opt => opt.id === id);
      return option?.value ?? false;
    },
    [options]
  );

  const setOptionValue = React.useCallback(
    (id: string, value: boolean) => {
      updateOption(id, value);
    },
    [updateOption]
  );

  const resetOptions = React.useCallback(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  return {
    options,
    updateOption,
    getOptionValue,
    setOptionValue,
    resetOptions,
  };
}
