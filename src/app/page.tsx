'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { format } from 'date-fns';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const REELS_DATA = [
  {
    id: 1,
    title: 'balky',
    img: '/images/home/a.png',
  },
  {
    id: 2,
    title: 'athena',
    img: '/images/home/b.png',
  },
  {
    id: 3,
    title: 'candy',
    img: '/images/home/c.png',
  },
  {
    id: 4,
    title: 'dandy',
    img: '/images/home/d.png',
  },
  {
    id: 5,
    title: 'eagle',
    img: '/images/home/a.png',
  },
  {
    id: 6,
    title: 'fancy',
    img: '/images/home/c.png',
  },
  {
    id: 7,
    title: 'giant',
    img: '/images/home/b.png',
  },
  {
    id: 8,
    title: 'honey',
    img: '/images/home/d.png',
  },
  {
    id: 9,
    title: 'indigo',
    img: '/images/home/b.png',
  },
  {
    id: 10,
    title: 'jolly',
    img: '/images/home/a.png',
  },
];

const SLIDE_DURATION = 5;
gsap.registerPlugin(CustomEase);

CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export default function HomePage() {
  const router = useRouter();

  // transform: translate(-480px, 0px) rotate(-7deg) scale(1.8, 1.8);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimeline = useRef<gsap.core.Timeline | null>(null);

  const transitionSlide = (
    nextIndex: number,
    direction: 'next' | 'prev' = 'next'
  ) => {
    if (isTransitioning) return;

    const currentElement = slideRefs.current[currentSlide];
    const nextElement = slideRefs.current[nextIndex];
    if (!currentElement || !nextElement) return;

    setIsTransitioning(true);

    // Clear existing animations and timeouts
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    if (timelineRef.current) timelineRef.current.kill();
    if (progressTimeline.current) progressTimeline.current.kill();

    // Create main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);

        // Only after transition is complete, reset states
        slideRefs.current.forEach((ref, index) => {
          if (ref) {
            gsap.set(ref, {
              zIndex: index === nextIndex ? 2 : 1,
              clipPath:
                index === nextIndex
                  ? 'polygon(-20% -40%, 120% 0%, 120% 140%, -20% 100%)'
                  : 'polygon(100% -40%, 100% 0%, 100% 140%, 100% 100%)',
            });
          }
        });
      },
    });

    // Keep current slide fully visible with slanted edges
    gsap.set(currentElement, {
      zIndex: 2,
      clipPath: 'polygon(-20% -40%, 120% 0%, 120% 140%, -20% 100%)',
    });

    // Set next slide on top and hidden
    gsap.set(nextElement, {
      zIndex: 3,
      clipPath:
        direction === 'next'
          ? 'polygon(100% -40%, 100% 0%, 100% 140%, 100% 100%)'
          : 'polygon(-120% -40%, -120% 0%, -120% 140%, -120% 100%)',
    });

    tl.to(nextElement, {
      clipPath: 'polygon(-20% -40%, 120% 0%, 120% 140%, -20% 100%)',
      duration: 1.6,
      ease: 'ease-in-out-cubic',
    });

    // Update state and start progress
    setCurrentSlide(nextIndex);
    updateProgressIndicator(nextIndex);

    // Set up next automatic transition
    if (direction === 'next') {
      autoPlayRef.current = setTimeout(() => {
        const nextSlide = (nextIndex + 1) % REELS_DATA.length;
        transitionSlide(nextSlide, 'next');
      }, SLIDE_DURATION * 1000);
    }
  };

  const updateProgressIndicator = (index: number) => {
    if (progressTimeline.current) {
      progressTimeline.current.kill();
    }

    // Reset all progress bars
    progressRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { scaleX: 0 });
      }
    });

    // Start new progress immediately
    progressTimeline.current = gsap
      .timeline()
      .set(progressRefs.current[index], {
        scaleX: 0,
        transformOrigin: 'bottom left',
      })
      .to(progressRefs.current[index], {
        scaleX: 1,
        duration: SLIDE_DURATION,
        ease: 'none',
        immediateRender: true, // Ensures immediate start
      });
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextSlide = (currentSlide + 1) % REELS_DATA.length;
    transitionSlide(nextSlide, 'next');
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const prevSlide =
      (currentSlide - 1 + REELS_DATA.length) % REELS_DATA.length;
    transitionSlide(prevSlide, 'prev');
  };

  useEffect(() => {
    timelineRef.current = gsap.timeline();
    progressTimeline.current = gsap.timeline();

    // Set initial states for all slides
    slideRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, {
          zIndex: index === 0 ? 2 : 1,
          clipPath:
            index === 0
              ? 'polygon(-20% -40%, 120% 0%, 120% 140%, -20% 100%)'
              : 'polygon(100% -40%, 100% 0%, 100% 140%, 100% 100%)',
        });
      }
    });

    updateProgressIndicator(0);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (timelineRef.current) timelineRef.current.kill();
      if (progressTimeline.current) progressTimeline.current.kill();
    };
  }, []);

  useEffect(() => {
    if (slideRefs.current[0]) {
      gsap.set(slideRefs.current[0], {
        clipPath: 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)',
        zIndex: 2,
      });
    }
    updateProgressIndicator(0);

    autoPlayRef.current = setTimeout(() => {
      transitionSlide(1, 'next');
    }, SLIDE_DURATION * 1000);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, []);

  return (
    <PageWrapper showHeader={false} className="pageHome" lenis>
      <section className="pageHome__main">
        <div className="pageHome__main--reels">
          {REELS_DATA.map((reel, index: number) => (
            <div
              key={reel.id}
              ref={(el) => {
                if (el) slideRefs.current[index] = el;
              }}
              className="pageHome__main--reel"
              style={{
                zIndex: index === 0 ? 2 : 1,
                clipPath:
                  index === 0
                    ? 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)'
                    : 'polygon(100% -20%, 100% -20%, 100% 120%, 100% 120%)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '1rem',
                  color: 'red',
                  zIndex: 10,
                }}
              >
                {reel.title} buggy
              </span>
              <img src={reel.img} alt={reel.title} />
            </div>
          ))}
        </div>
        <div className="pageHome__main--overlay">
          <div className="pageHome__main--overlayTop">
            <div className="pageHome__main--overlayTop-indicatorWrapper">
              {REELS_DATA.map((reel, index) => (
                <div
                  role="button"
                  key={reel.id}
                  className={`pageHome__main--overlayTop-indicator ${
                    currentSlide === index ? 'active' : ''
                  }`}
                  onClick={() => transitionSlide(index)}
                >
                  <div
                    ref={(el) => {
                      progressRefs.current[index] = el;
                    }}
                    className="pageHome__main--overlayTop-indicatorBefore"
                  />
                </div>
              ))}
            </div>
            <p>show.reelz</p>
          </div>

          <div className="pageHome__main--overlayMiddle">
            <button
              disabled={isTransitioning}
              className="pageHome__main--overlayMiddle-button"
              onClick={handlePrev}
            >
              prev
            </button>
            <button
              disabled={isTransitioning}
              className="pageHome__main--overlayMiddle-button"
              onClick={handleNext}
            >
              next
            </button>
          </div>

          <div className="pageHome__main--overlayBottom">
            <h2>
              Williams Alamu’s digital portfolio archived works : ‘21—
              {format(new Date(), 'yyy')}
            </h2>
            <button onClick={() => router.push('/works')}>
              <p>
                ↳ <span link-interaction="underline">enter site</span>
              </p>
            </button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
