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

    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    if (timelineRef.current) timelineRef.current.kill();
    if (progressTimeline.current) progressTimeline.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        slideRefs.current.forEach((ref, index) => {
          if (ref) {
            gsap.set(ref, {
              zIndex: index === nextIndex ? 2 : 1,
              clipPath:
                index === nextIndex
                  ? 'polygon(-20% -80%, 120% -20%, 120% 180%, -20% 120%)'
                  : 'polygon(100% -20%, 100% -20%, 100% 180%, 100% 180%)',
            });
          }
        });
      },
    });

    gsap.set(currentElement, {
      zIndex: 2,
      clipPath: 'polygon(-20% -80%, 120% -20%, 120% 180%, -20% 120%)',
    });

    gsap.set(nextElement, {
      zIndex: 3,
      clipPath:
        direction === 'next'
          ? 'polygon(100% -20%, 100% -20%, 100% 180%, 100% 180%)'
          : 'polygon(-120% -80%, -120% -20%, -120% 180%, -120% 120%)',
    });

    tl.to(nextElement, {
      clipPath: 'polygon(-20% -80%, 120% -20%, 120% 180%, -20% 120%)',
      duration: 1.6,
      ease: 'ease-in-out-cubic',
    });

    setCurrentSlide(nextIndex);
    updateProgressIndicator(nextIndex);

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
        immediateRender: true,
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
    let lastVisibleTime = Date.now();

    function handleVisibilityChange() {
      if (document.hidden) {
        if (autoPlayRef.current) {
          clearTimeout(autoPlayRef.current);
          autoPlayRef.current = null;
        }
      } else {
        const currentTime = Date.now();
        const timePassed = currentTime - lastVisibleTime;

        // slides that should have moved
        const slidesToMove = Math.floor(timePassed / (SLIDE_DURATION * 1000));
        const targetSlide = (currentSlide + slidesToMove) % REELS_DATA.length;

        // just set to the correct slide
        if (slidesToMove > 0) {
          slideRefs.current.forEach((ref, index) => {
            if (ref) {
              gsap.set(ref, {
                zIndex: index === targetSlide ? 2 : 1,
                clipPath:
                  index === targetSlide
                    ? 'polygon(-20% -80%, 120% -20%, 120% 180%, -20% 120%)'
                    : 'polygon(100% -20%, 100% -20%, 100% 180%, 100% 180%)',
              });
            }
          });
          setCurrentSlide(targetSlide);
          updateProgressIndicator(targetSlide);
        }

        // Restart the autoplay from current position
        autoPlayRef.current = setTimeout(() => {
          const nextSlide = (targetSlide + 1) % REELS_DATA.length;
          transitionSlide(nextSlide, 'next');
        }, SLIDE_DURATION * 1000);
      }
      lastVisibleTime = Date.now();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timelineRef.current = gsap.timeline();
    progressTimeline.current = gsap.timeline();

    slideRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, {
          zIndex: index === 0 ? 2 : 1,
          clipPath:
            index === 0
              ? 'polygon(-20% -80%, 120% -20%, 120% 180%, -20% 120%)'
              : 'polygon(100% -20%, 100% -20%, 100% 180%, 100% 180%)',
        });
      }
    });

    updateProgressIndicator(0);

    autoPlayRef.current = setTimeout(() => {
      transitionSlide(1, 'next');
    }, SLIDE_DURATION * 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (timelineRef.current) timelineRef.current.kill();
      if (progressTimeline.current) progressTimeline.current.kill();
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
                    ? 'polygon(-20% -80%, 120% -20%, 120% 180%, -20% 120%)'
                    : 'polygon(100% -20%, 100% -20%, 100% 180%, 100% 180%)',
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
