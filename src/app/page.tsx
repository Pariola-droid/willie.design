'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { format } from 'date-fns';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [indicators, setIndicators] = useState<number[]>(
    new Array(REELS_DATA.length).fill(0)
  );
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimeline = useRef<gsap.core.Timeline | null>(null);

  // Initialize GSAP timeline
  useEffect(() => {
    timelineRef.current = gsap.timeline({ paused: true });
    progressTimeline.current = gsap.timeline({ paused: true });

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (timelineRef.current) timelineRef.current.kill();
      if (progressTimeline.current) progressTimeline.current.kill();
    };
  }, []);

  const updateProgressIndicator = (index: number) => {
    const timeline = progressTimeline.current;
    if (!timeline) return;

    timeline.clear();

    setIndicators((prev) => prev.map((_, i) => (i === index ? 100 : 0)));

    progressRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { width: '0%' });
      }
    });

    timeline
      .set(progressRefs.current[index], { width: '0%' })
      .to(progressRefs.current[index], {
        width: '100%',
        duration: SLIDE_DURATION,
        ease: 'none',
      });

    timeline.play();
  };

  const transitionSlide = (
    nextIndex: number,
    direction: 'next' | 'prev' = 'next'
  ) => {
    const currentElement = slideRefs.current[currentSlide];
    const nextElement = slideRefs.current[nextIndex];
    const timeline = timelineRef.current;

    if (!currentElement || !nextElement || !timeline) return;

    // Reset timeline
    timeline.clear();

    // Simple slanted clip-path
    timeline
      .set(nextElement, {
        clipPath:
          direction === 'next'
            ? 'polygon(120% -20%, 100% -20%, 100% 120%, 120% 120%)'
            : 'polygon(-20% -20%, 0% -20%, 0% 120%, -20% 120%)',
        zIndex: 2,
      })
      .to(nextElement, {
        clipPath:
          direction === 'next'
            ? 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)'
            : 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)',
        duration: 1.8,
        ease: 'ease-in-out-cubic',
      })
      .set(currentElement, { zIndex: 1 });

    timeline.play();
    setCurrentSlide(nextIndex);
    updateProgressIndicator(nextIndex);

    // Setup next auto transition
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    autoPlayRef.current = setTimeout(() => {
      const nextSlide = (nextIndex + 1) % REELS_DATA.length;
      transitionSlide(nextSlide, 'next');
    }, SLIDE_DURATION * 1000);
  };

  const handleNext = () => {
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    const nextSlide = (currentSlide + 1) % REELS_DATA.length;
    transitionSlide(nextSlide, 'next');
  };

  const handlePrev = () => {
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    const prevSlide =
      (currentSlide - 1 + REELS_DATA.length) % REELS_DATA.length;
    transitionSlide(prevSlide, 'prev');
  };

  // Start autoplay on mount
  useEffect(() => {
    transitionSlide(0);
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
                    ? 'polygon(-20% -20%, 100% -20%, 100% 100%, -20% 100%)'
                    : 'polygon(100% -20%, 100% -20%, 100% 100%, 100% 100%)',
              }}
            >
              <img src={reel.img} alt={reel.title} />
            </div>
          ))}
        </div>
        <div className="pageHome__main--overlay">
          <div className="pageHome__main--overlayTop">
            <div className="pageHome__main--overlayTop-indicatorWrapper">
              {REELS_DATA.map((reel, index) => (
                <div
                  key={reel.id}
                  className="pageHome__main--overlayTop-indicator"
                  style={{
                    position: currentSlide === index ? 'relative' : undefined,
                  }}
                >
                  <div
                    ref={(el) => {
                      progressRefs.current[index] = el;
                    }}
                    className="pageHome__main--overlayTop-indicatorBefore"
                    style={{
                      width: `${indicators[index]}%`,
                      transition: 'width 0.3s linear',
                    }}
                  />
                </div>
              ))}
            </div>
            <p>show.reelz</p>
          </div>
          <div className="pageHome__main--overlayMiddle">
            <button onClick={handlePrev}>prev</button>
            <button onClick={handleNext}>next</button>
          </div>
          <div className="pageHome__main--overlayBottom">
            <h2>
              Williams Alamu’s digital portfolio archived works : ‘21—
              {format(new Date(), 'yyy')}
            </h2>
            <button>
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
