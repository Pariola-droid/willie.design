'use client';

import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface GlobalErrorProps {
  error: Error | null;
  resetError?: () => void;
}

export default function GlobalError({ error, resetError }: GlobalErrorProps) {
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!errorRef.current) return;

    if (error) {
      gsap.set(errorRef.current, {
        autoAlpha: 0,
        display: 'flex',
      });

      gsap.to(errorRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      });

      document.documentElement.style.setProperty('--cursor', 'auto');
    } else {
      gsap.to(errorRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        onComplete: () => {
          if (errorRef.current) {
            gsap.set(errorRef.current, { display: 'none' });
          }
        },
      });
    }

    return () => {
      document.documentElement.style.setProperty('--cursor', 'auto');
    };
  }, [error]);

  if (!error) return null;

  return (
    <div
      ref={errorRef}
      style={{
        opacity: 0,
        visibility: 'hidden',
        display: 'none',
        backgroundColor: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '440px',
          padding: '40px 20px',
          border: '1px solid #000',
          backgroundColor: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: '34px',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            color: '#000',
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: '21px',
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            color: '#000',
          }}
        >
          {error.message}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {resetError && (
            <button
              onClick={resetError}
              style={{
                padding: '4px 24px',
                fontSize: '14px',
                fontWeight: 300,
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                border: '1px solid #000',
                borderRadius: '100px',
                backgroundColor: 'transparent',
                color: '#000',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#000';
              }}
            >
              Try again
            </button>
          )}
          <Link
            href="/"
            style={{
              padding: '4px 24px',
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: '24px',
              letterSpacing: '-0.02em',
              border: '1px solid #000',
              borderRadius: '100px',
              backgroundColor: 'transparent',
              color: '#000',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.borderColor = '#000';
            }}
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
