'use client';

import React, { useState } from 'react';
import {
  ConfigurationSection,
  ColorPicker,
  ImageUploader,
  ToggleGroup,
  ConfigurationTabs,
  useToggleGroup,
} from './index';
import { Settings, Palette, Upload } from 'lucide-react';

export function ConfigurationDemo() {
  const [color, setColor] = useState('#3b82f6');
  const [image, setImage] = useState<File | null>(null);

  const { options, updateOption } = useToggleGroup([
    {
      id: 'feature1',
      label: 'Enable Feature 1',
      description: 'This enables the first feature',
      value: true,
    },
    {
      id: 'feature2',
      label: 'Enable Feature 2',
      description: 'This enables the second feature',
      value: false,
    },
  ]);

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ConfigurationSection
            title="General Settings"
            description="Configure general application settings"
          >
            <ColorPicker
              label="Primary Color"
              value={color}
              onChange={setColor}
              previewText="Sample Text"
            />
          </ConfigurationSection>
        </div>
      ),
      status: 'complete' as const,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ConfigurationSection
            title="Appearance Settings"
            description="Customize the visual appearance"
          >
            <ToggleGroup
              label="Feature Toggles"
              options={options}
              onChange={updateOption}
            />
          </ConfigurationSection>
        </div>
      ),
      status: 'incomplete' as const,
      badge: '2',
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: <Upload className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <ConfigurationSection
            title="Asset Management"
            description="Upload and manage assets"
          >
            <ImageUploader
              label="Logo Upload"
              value={image}
              onChange={setImage}
              maxSize={1024 * 1024} // 1MB
              description="Upload your logo (max 1MB, JPEG/PNG)"
            />
          </ConfigurationSection>
        </div>
      ),
      status: 'pending' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Configuration Components Demo
        </h1>

        <ConfigurationTabs tabs={tabs} defaultTab="general" showStatus={true} />
      </div>
    </div>
  );
}
