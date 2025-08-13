'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ConfigurationSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function ConfigurationSection({
  title,
  description,
  children,
  className,
  headerActions,
}: ConfigurationSectionProps) {
  return (
    <Card
      className={cn(
        'border-white/20 bg-white/10 shadow-lg backdrop-blur-sm',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-white">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-white/70">
              {description}
            </CardDescription>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center space-x-2">{headerActions}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
