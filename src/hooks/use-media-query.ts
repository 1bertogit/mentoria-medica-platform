'use client';

import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  touch: '(hover: none) and (pointer: coarse)',
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  smallHeight: '(max-height: 600px)',
  mediumHeight: '(min-height: 601px) and (max-height: 900px)',
  largeHeight: '(min-height: 901px)',
} as const;

/**
 * Custom hook for responsive design and media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook for common breakpoint detection
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery(BREAKPOINTS.mobile);
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);
  const isTouchDevice = useMediaQuery(BREAKPOINTS.touch);
  const isLandscape = useMediaQuery(BREAKPOINTS.landscape);
  const isPortrait = useMediaQuery(BREAKPOINTS.portrait);
  const isSmallHeight = useMediaQuery(BREAKPOINTS.smallHeight);
  const isMediumHeight = useMediaQuery(BREAKPOINTS.mediumHeight);
  const isLargeHeight = useMediaQuery(BREAKPOINTS.largeHeight);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isLandscape,
    isPortrait,
    isSmallHeight,
    isMediumHeight,
    isLargeHeight,
    // Computed values
    isMobileOrTablet: isMobile || isTablet,
    isDesktopOrTablet: isDesktop || isTablet,
    // Mobile landscape (common for video watching)
    isMobileLandscape: isMobile && isLandscape,
    isMobilePortrait: isMobile && isPortrait,
  };
}

/**
 * Hook for device orientation detection
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOrientation = () => {
      if (window.screen?.orientation) {
        // Modern API
        const angle = window.screen.orientation.angle;
        setOrientation(angle === 90 || angle === 270 ? 'landscape' : 'portrait');
      } else if (window.orientation !== undefined) {
        // Legacy API
        const angle = window.orientation;
        setOrientation(angle === 90 || angle === -90 ? 'landscape' : 'portrait');
      } else {
        // Fallback to viewport dimensions
        setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
      }
    };

    // Set initial orientation
    updateOrientation();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to ensure viewport has updated
      setTimeout(updateOrientation, 100);
    };

    // Modern browsers
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    // Legacy browsers
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * Hook for safe area detection (notched devices)
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSafeArea = () => {
      const computedStyle = window.getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
    };
  }, []);

  return safeArea;
}