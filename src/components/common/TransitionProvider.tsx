'use client';

import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

// Create context to track transition state
type TransitionContextType = {
  isTransitioning: boolean;
  onPageLoad: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  onPageLoad: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  // Track page changes
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      // Route changed - handle transition
      handlePageTransition();
    } else {
      // First load - mark as ready after a brief delay
      setTimeout(() => {
        setIsPageReady(true);
      }, 100);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  const handlePageTransition = async () => {
    setIsTransitioning(true);
    setIsPageReady(false);

    // Page exit animation
    await gsap.to(overlayRef.current, {
      autoAlpha: 1,
      duration: 0.5,
      ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    });

    // Small delay to ensure new page content is ready
    setTimeout(() => {
      // Page enter animation
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        onComplete: () => {
          setIsTransitioning(false);
          setIsPageReady(true);
        },
      });
    }, 200);
  };

  // Function for pages to signal they're ready for animation
  const onPageLoad = () => {
    setIsPageReady(true);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, onPageLoad }}>
      <div
        className={`site-content ${isPageReady ? 'page-ready' : 'page-loading'}`}
      >
        {children}
      </div>

      <div
        ref={overlayRef}
        className="site-transition-overlay"
        style={{
          opacity: 0,
          visibility: 'visible',
          position: 'fixed',
          inset: 0,
          backgroundColor: 'transparent',
          zIndex: 9999,
          pointerEvents: isTransitioning ? 'all' : 'none',
        }}
      />
    </TransitionContext.Provider>
  );
}
