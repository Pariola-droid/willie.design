'use client';

import { gsap } from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type TransitionContextType = {
  isTransitioning: boolean;
  completedInitialLoad: boolean;
  startPageTransition: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: true,
  completedInitialLoad: false,
  startPageTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(true); // Start with true
  const [completedInitialLoad, setCompletedInitialLoad] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);
  const scrollPositions = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    document.documentElement.classList.add('loading');

    const timer = setTimeout(() => {
      // Fade out overlay
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          onComplete: () => {
            document.documentElement.classList.remove('loading');
            setIsTransitioning(false);
            setCompletedInitialLoad(true);
          },
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!completedInitialLoad) return;

    if (prevPathRef.current !== pathname) {
      handlePageTransition();
    }

    prevPathRef.current = pathname;
  }, [pathname, completedInitialLoad]);

  useEffect(() => {
    if (isTransitioning) {
      document.documentElement.style.setProperty('--cursor', 'wait');
      document.documentElement.classList.add('transitioning');
    } else {
      document.documentElement.style.setProperty('--cursor', 'auto');
      document.documentElement.classList.remove('transitioning');
    }
  }, [isTransitioning]);

  const startPageTransition = (href: string) => {
    if (pathname === href) return;
    handlePageTransition(() => {
      router.push(href);
    });
  };

  const handlePageTransition = async (callback?: () => void) => {
    setIsTransitioning(true);

    scrollPositions.current[prevPathRef.current] = window.scrollY;

    await gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    });

    // (e.g., route navigation)
    if (callback) {
      callback();
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      delay: 0.1,
      onComplete: () => {
        setIsTransitioning(false);

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
    <TransitionContext.Provider
      value={{
        isTransitioning,
        completedInitialLoad,
        startPageTransition,
      }}
    >
      <div className={`site-content ${completedInitialLoad ? 'loaded' : ''}`}>
        {children}
      </div>

      <div
        ref={overlayRef}
        className="site-transition-overlay"
        style={{
          opacity: 1,
          position: 'fixed',
          inset: 0,
          backgroundColor: 'black',
          zIndex: 9999,
          pointerEvents: isTransitioning ? 'all' : 'none',
        }}
      />
    </TransitionContext.Provider>
  );
}
