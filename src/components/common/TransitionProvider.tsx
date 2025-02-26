'use client';

import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type TransitionContextType = {
  isTransitioning: boolean;
  completedInitialLoad: boolean;
};

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  completedInitialLoad: false,
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [completedInitialLoad, setCompletedInitialLoad] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);
  const scrollPositions = useRef<{ [key: string]: number }>({});

  // Handle initial load
  useEffect(() => {
    if (!completedInitialLoad) {
      // Hide page content initially
      document.body.classList.add('loading');

      // After DOM is ready
      setTimeout(() => {
        // Fade out overlay
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
            onComplete: () => {
              document.body.classList.remove('loading');
              setCompletedInitialLoad(true);
            },
          });
        }
      }, 300);
    }
  }, [completedInitialLoad]);

  // Handle page transitions
  useEffect(() => {
    // Skip the initial load
    if (!completedInitialLoad) return;

    // Only run on route changes
    if (prevPathRef.current !== pathname) {
      handlePageTransition();
    }

    prevPathRef.current = pathname;
  }, [pathname, completedInitialLoad]);

  useEffect(() => {
    if (isTransitioning) {
      document.documentElement.style.setProperty('--cursor', 'wait');
    } else {
      document.documentElement.style.setProperty('--cursor', 'auto');
    }
  }, [isTransitioning]);

  const handlePageTransition = async () => {
    setIsTransitioning(true);
    document.body.classList.add('transitioning');

    scrollPositions.current[prevPathRef.current] = window.scrollY;

    //  Fade in overlay
    await gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    });

    // 2. Small delay to ensure page content is ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 3. Fade out overlay
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8, // Longer fade out for smoothness
      ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      delay: 0.1,
      onComplete: () => {
        setIsTransitioning(false);
        document.body.classList.remove('transitioning');

        if (scrollPositions.current[pathname]) {
          setTimeout(() => {
            window.scrollTo(0, scrollPositions.current[pathname]);
          }, 100);
        } else {
          window.scrollTo(0, 0);
        }
      },
    });
  };

  return (
    <>
      <div className={`site-content ${completedInitialLoad ? 'loaded' : ''}`}>
        {children}
      </div>

      <div
        ref={overlayRef}
        className="site-transition-overlay"
        style={{
          opacity: completedInitialLoad ? 0 : 1,
          position: 'fixed',
          inset: 0,
          backgroundColor: '#ffffff',
          zIndex: 9999,
          pointerEvents: isTransitioning ? 'all' : 'none',
        }}
      />
    </>
  );
}
