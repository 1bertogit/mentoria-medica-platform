'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CarouselContextType {
  orientation?: 'horizontal' | 'vertical';
  opts?: {
    align?: 'start' | 'center' | 'end';
    loop?: boolean;
  };
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollTo: (index: number) => void;
  selectedIndex: number;
  scrollSnaps: number[];
}

const CarouselContext = React.createContext<CarouselContextType | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: {
    align?: 'start' | 'center' | 'end';
    loop?: boolean;
  };
  orientation?: 'horizontal' | 'vertical';
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ orientation = 'horizontal', opts, className, children, ...props }, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(true);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scrollPrev = React.useCallback(() => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      
      if (opts?.loop && container.scrollLeft <= 0) {
        container.scrollLeft = container.scrollWidth;
      } else {
        container.scrollLeft -= scrollAmount;
      }
    }, [opts?.loop]);

    const scrollNext = React.useCallback(() => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      
      if (opts?.loop && container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }, [opts?.loop]);

    const scrollTo = React.useCallback((index: number) => {
      if (!scrollContainerRef.current || !scrollSnaps.length) return;
      
      const container = scrollContainerRef.current;
      container.scrollLeft = scrollSnaps[index] || 0;
      setSelectedIndex(index);
    }, [scrollSnaps]);

    const onScroll = React.useCallback(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft < maxScroll - 1);

      // Update selected index based on scroll position
      const newIndex = scrollSnaps.findIndex((snap, index) => {
        const nextSnap = scrollSnaps[index + 1] || maxScroll;
        return scrollLeft >= snap && scrollLeft < nextSnap;
      });
      
      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
      }
    }, [scrollSnaps]);

    // Set up scroll snaps after mount
    React.useEffect(() => {
      const initializeCarousel = () => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const items = Array.from(container.children);
        
        // Only update if items actually exist
        if (items.length === 0) return;
        
        const snaps = items.map((item) => {
          const htmlItem = item as HTMLElement;
          return htmlItem.offsetLeft;
        });

        setScrollSnaps(snaps);
        
        // Update scroll state after setting snaps
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        setCanScrollPrev(scrollLeft > 0);
        setCanScrollNext(scrollLeft < maxScroll - 1);
      };

      // Delay initialization to ensure DOM is ready
      const timer = setTimeout(initializeCarousel, 100);
      return () => clearTimeout(timer);
    }, []); // Only run once on mount

    // Add keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          scrollPrev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          scrollNext();
        }
      };

      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
      }
    }, [scrollPrev, scrollNext]);

    const contextValue = React.useMemo(
      () => ({
        orientation,
        opts,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        scrollTo,
        selectedIndex,
        scrollSnaps,
      }),
      [orientation, opts, scrollPrev, scrollNext, canScrollPrev, canScrollNext, scrollTo, selectedIndex, scrollSnaps]
    );

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Image carousel"
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === CarouselContent) {
              return React.cloneElement(child as React.ReactElement<unknown>, {
                ref: scrollContainerRef,
                onScroll,
              });
            }
            return child;
          })}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onScroll, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className={cn(
        'flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide',
        orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
        className
      )}
      {...props}
    />
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full snap-start',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full glass-button bg-white/10 hover:bg-white/20 border-white/20 z-10 transition-all duration-200',
        orientation === 'horizontal'
          ? 'left-2 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        !canScrollPrev && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full glass-button bg-white/10 hover:bg-white/20 border-white/20 z-10 transition-all duration-200',
        orientation === 'horizontal'
          ? 'right-2 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        !canScrollNext && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

// New component for carousel indicators
const CarouselIndicators = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

  return (
    <div
      ref={ref}
      className={cn('flex justify-center gap-2 mt-4', className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            'h-2 w-2 rounded-full transition-all duration-200',
            selectedIndex === index
              ? 'bg-white/80 w-6'
              : 'bg-white/30 hover:bg-white/50'
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
});
CarouselIndicators.displayName = 'CarouselIndicators';

export {
  type CarouselProps,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
};