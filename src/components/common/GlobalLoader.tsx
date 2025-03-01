'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
}

export default function GlobalLoader({
  isLoading,
  message = 'Loading...',
}: GlobalLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    if (isLoading) {
      gsap.set(loaderRef.current, {
        autoAlpha: 0,
        inset: 1,
      });

      gsap.to(loaderRef.current, {
        autoAlpha: 1,
        inset: 0,
        duration: 2,
        ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      });

      document.documentElement.style.setProperty('--cursor', 'wait');
    } else {
      gsap.to(loaderRef.current, {
        autoAlpha: 0,
        inset: 1,
        duration: 2,
        ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        onComplete: () => {
          if (loaderRef.current) {
            gsap.set(loaderRef.current, { display: 'none' });
          }

          document.documentElement.style.setProperty('--cursor', 'auto');
        },
      });
    }

    return () => {
      document.documentElement.style.setProperty('--cursor', 'auto');
    };
  }, [isLoading]);

  return (
    <div
      ref={loaderRef}
      style={{
        opacity: 0,
        visibility: 'hidden',
        backgroundColor: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100dvh',
        width: '100vw',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          color: '#000',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
