'use client';

import { useStore } from '@/lib/store';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default function GlobalLoader() {
  const hasLoaded = useStore((state) => state.hasLoaded);
  const setHasLoaded = useStore((state) => state.setHasLoaded);
  const setIsAnimating = useStore((state) => state.setIsAnimating);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTimeline = useRef<GSAPTimeline>(gsap.timeline());

  useEffect(() => {
    if (hasLoaded) {
      if (loaderRef.current) {
        gsap.set(loaderRef.current, {
          display: 'none',
          autoAlpha: 0,
        });
      }
    } else {
      setIsAnimating(true);
      document.documentElement.style.setProperty('--cursor', 'wait');
    }
  }, [hasLoaded, setIsAnimating]);

  useGSAP(() => {
    if (!hasLoaded && loaderRef.current) {
      const split = new SplitType('.split', { types: 'words,chars' });
      const allTextContainers = document.querySelectorAll('.text-container');
      const splitNames = document.querySelectorAll('.split-name .char');

      splitNames.forEach((char) => {
        gsap.set(char, { y: 100 });
      });

      gsap.set(loaderRef.current, {
        display: 'flex',
        autoAlpha: 1,
      });

      for (let i = 0; i < 2; i++) {
        const container = allTextContainers[i];
        loaderTimeline.current
          .to(
            i > 0
              ? document.querySelector('.split-desc')
              : container.querySelectorAll('.char'),
            {
              y: 0,
              duration: 1.7,
              scale: 1,
              ease: 'power2.inOut',
              opacity: 1,
            },
            i > 0 ? '>-75%' : ''
          )
          .to(
            container,
            {
              scale: 800,
              duration: 3.5,
              ease: 'power4.inOut',
              onStart: () => {
                gsap.to('.wp__pageHeader', {
                  autoAlpha: 0,
                  duration: 0.3,
                });

                // gsap.to('.main-main', {
                //   filter: 'brightness(0)',
                //   duration: 0.3,
                // });
              },
              onComplete: () => {
                gsap.to(loaderRef.current, {
                  autoAlpha: 0,
                  delay: 0.8,
                  duration: 0.5,
                  onComplete: () => {
                    gsap.set(loaderRef.current, {
                      display: 'none',
                      autoAlpha: 0,
                    });

                    const revealTl = gsap.timeline({
                      onComplete: () => {
                        setHasLoaded(true);
                        setIsAnimating(false);
                        document.documentElement.style.setProperty(
                          '--cursor',
                          'auto'
                        );
                      },
                    });

                    revealTl.to('.wp__pageHeader', {
                      autoAlpha: 1,
                      duration: 0.6,
                    });
                    // .to(
                    //   '.main-main',
                    //   {
                    //     filter: 'brightness(1)',
                    //     duration: 0.8,
                    //   },
                    //   '-=0.1'
                    // );
                  },
                });
              },
            },
            '>'
          );
      }
    }
  }, [hasLoaded, setHasLoaded, setIsAnimating]);

  useEffect(() => {
    return () => {
      if (!hasLoaded) {
        setIsAnimating(false);
        document.documentElement.style.setProperty('--cursor', 'auto');
      }
    };
  }, [hasLoaded, setIsAnimating]);

  if (hasLoaded) return null;

  return (
    <div ref={loaderRef} className="global__loader">
      <div className="text-container absolute overflow-hidden">
        <p className="leading-[100%] split split-name">Williams</p>
        <p className="ml-[100px] leading-[100%] split split-name">Alamu</p>
      </div>
      <div className="text-container absolute overflow-hidden">
        <p className="text-zoom scale-[0.2] opacity-0 split-desc mb-[10px] split">
          a creative visual designer
        </p>
      </div>
    </div>
  );
}
