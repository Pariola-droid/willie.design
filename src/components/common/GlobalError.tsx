'use client';

import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

interface GlobalErrorProps {
  error: Error | null;
  resetError?: () => void;
  setIsAnimating: (isAnimating: boolean) => void;
}

export default function GlobalError({
  error,
  resetError,
  setIsAnimating,
}: GlobalErrorProps) {
  const errorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textSpansRef = useRef<HTMLSpanElement[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!errorRef.current) return;

    if (error) {
      gsap.killTweensOf([errorRef.current, lineRef.current, buttonRef.current]);
      textSpansRef.current.forEach((span) => {
        if (span) gsap.killTweensOf(span);
      });

      textSpansRef.current = textSpansRef.current.filter(Boolean);

      gsap.set(errorRef.current, {
        autoAlpha: 0,
        display: 'flex',
      });

      gsap.set(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'center center',
      });

      gsap.set(textSpansRef.current, {
        autoAlpha: 0,
      });

      gsap.set(buttonRef.current, {
        y: 20,
        autoAlpha: 0,
      });

      setIsAnimating(true);
      document.documentElement.style.setProperty('--cursor', 'wait');

      const tl = gsap.timeline({
        defaults: {
          ease: 'ease-in-out-cubic',
        },
        onComplete: () => {
          setIsAnimating(false);
          document.documentElement.style.setProperty('--cursor', 'auto');
        },
      });

      tl.to(errorRef.current, {
        autoAlpha: 1,
        duration: 0.5,
      })
        .to(lineRef.current, {
          scaleX: 1,
          duration: 1.2,
        })
        .to(
          textSpansRef.current,
          {
            autoAlpha: 1,
            stagger: 0.1,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.6'
        )
        .to(
          buttonRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        );
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
      if (errorRef.current) gsap.killTweensOf(errorRef.current);
      if (lineRef.current) gsap.killTweensOf(lineRef.current);
      if (buttonRef.current) gsap.killTweensOf(buttonRef.current);
      textSpansRef.current.forEach((span) => {
        if (span) gsap.killTweensOf(span);
      });

      setIsAnimating(false);
      document.documentElement.style.setProperty('--cursor', 'auto');
    };
  }, [error, setIsAnimating]);

  if (!error) return null;

  const isNotFound = error.message === 'Page not found';

  const errorContent = isNotFound
    ? {
        line1: ['The page', 'you are', 'looking for'],
        line2: ['cannot be', 'located'],
        btnText: 'return home',
        bgText: '404',
      }
    : {
        line1: ['Hmm', 'Something went', 'wrong'],
        line2: ['Please try', 'reloading'],
        btnText: 'try again',
        bgText: 'ERRR',
      };

  return (
    <div ref={errorRef} className="global__error">
      <div className="global__error-main">
        <div ref={lineRef} className="global__error-mainLine" />
        <div className="global__error-mainText">
          <div>
            {errorContent.line1.map((text, index) => (
              <span
                key={`line1-${index}`}
                ref={(el) => {
                  el && (textSpansRef.current[index] = el);
                }}
              >
                {text}
              </span>
            ))}
          </div>
          <div>
            {errorContent.line2.map((text, index) => (
              <span
                key={`line2-${index}`}
                ref={(el) => {
                  el &&
                    (textSpansRef.current[errorContent.line1.length + index] =
                      el);
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="global__error-mainBtnGroup">
          {resetError ? (
            <button ref={buttonRef} onClick={resetError}>
              {errorContent.btnText}
            </button>
          ) : (
            <Link href="/">
              <button ref={buttonRef}>
                {isNotFound ? 'return home' : 'go to homepage'}
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="global__error-largeTxt">{errorContent.bgText}</div>
    </div>
  );
}
