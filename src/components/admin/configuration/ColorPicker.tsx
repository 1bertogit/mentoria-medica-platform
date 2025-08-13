'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  color?: string;
  value?: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
  previewText?: string;
}

const PRESET_COLORS = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ffa500',
  '#800080',
  '#008000',
  '#ffc0cb',
  '#a52a2a',
  '#808080',
  '#000080',
];

export function ColorPicker({
  label,
  color,
  value,
  onChange,
  className,
  disabled = false,
  previewText = 'Preview',
}: ColorPickerProps) {
  const colorValue = color || value || '#000000';
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (newColor: string) => {
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(newColor)) {
      onChange(newColor);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (newColor.startsWith('#')) {
      handleColorChange(newColor);
    } else {
      handleColorChange(`#${newColor}`);
    }
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={`color-${label}`} className="text-white">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-12 border-white/20 bg-white/10 p-0"
              style={{ backgroundColor: colorValue }}
              disabled={disabled}
              aria-label={`Select color for ${label}`}
            >
              <span className="sr-only">Open color picker</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 border-white/20 bg-black/90 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-white">Custom Color</Label>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={colorValue}
                  onChange={e => onChange(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded border-white/20 bg-transparent"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label className="text-sm text-white">Preset Colors</Label>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      className={cn(
                        'h-8 w-8 cursor-pointer rounded border-2 transition-all',
                        colorValue === color
                          ? 'border-white'
                          : 'border-white/20 hover:border-white/50'
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                      disabled={disabled}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Input
          id={`color-${label}`}
          value={colorValue}
          onChange={handleInputChange}
          placeholder="#000000"
          className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/50"
          disabled={disabled}
        />

        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Preview:</span>
          <div
            className="rounded border border-white/20 px-3 py-1 text-sm"
            style={{ color: colorValue, backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {previewText}
          </div>
        </div>
      </div>
    </div>
  );
}
