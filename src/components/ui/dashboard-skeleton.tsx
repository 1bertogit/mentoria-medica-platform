import React from 'react';
import { Skeleton } from './skeleton';

// Dashboard skeleton loader principal
export function DashboardSkeleton() {
  return (
    <div className="w-full animate-in fade-in-50 duration-500" role="status" aria-label="Carregando dashboard...">
      {/* Header Section */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>

        {/* Activity Section */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Library skeleton loader específico
export function LibrarySkeleton() {
  return (
    <div className="w-full" role="region" aria-label="Carregando biblioteca científica">
      {/* Search and filters skeleton */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 mb-8 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Skeleton className="h-12 w-full md:flex-1" />
            <Skeleton className="h-12 w-full md:w-[180px]" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Articles skeleton */}
      <section className="space-y-6" aria-label="Carregando artigos">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden animate-in fade-in-50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col md:flex-row">
              <Skeleton className="h-48 md:h-auto md:w-64 flex-shrink-0" />
              <div className="p-6 flex flex-col flex-grow gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-between items-center mt-auto">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// Archive skeleton loader
export function ArchiveSkeleton() {
  return (
    <div className="w-full" role="region" aria-label="Carregando arquivo digital">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div 
            key={index}
            className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 animate-in fade-in-50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-12 w-12 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Form skeleton loader
export function FormSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto" role="status" aria-label="Carregando formulário">
      <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8">
        {/* Form title */}
        <Skeleton className="h-8 w-64 mb-6" />
        
        {/* Form fields */}
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
          
          {/* Textarea field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end gap-4 mt-8">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Detail page skeleton loader
export function DetailSkeleton() {
  return (
    <div className="w-full" role="status" aria-label="Carregando detalhes">
      {/* Header section */}
      <div className="mb-8">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}