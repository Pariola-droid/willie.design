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

export default function HomePage() {
  CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
  CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize GSAP timeline
  useEffect(() => {
    timelineRef.current = gsap.timeline({ paused: true });
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, []);

  // Handle slide transitions
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

    // Animate progress bar
    if (progressRefs.current[currentSlide] && progressRefs.current[nextIndex]) {
      gsap.to(progressRefs.current[currentSlide], {
        width: '0%',
        duration: 0.3,
      });

      gsap.to(progressRefs.current[nextIndex], {
        width: '100%',
        duration: SLIDE_DURATION,
      });
    }

    // Slide transition with clip-path
    timeline
      .set(nextElement, {
        clipPath:
          direction === 'next'
            ? 'polygon(100% -20%, 100% -20%, 100% 120%, 100% 120%)'
            : 'polygon(0% -20%, 0% -20%, 0% 120%, 0% 120%)',
        zIndex: 2,
      })
      .to(nextElement, {
        clipPath:
          direction === 'next'
            ? 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)'
            : 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)',
        duration: 1.5,
        ease: 'ease-in-out-cubic',
      })
      .set(currentElement, { zIndex: 1 });

    timeline.play();
    setCurrentSlide(nextIndex);

    // Setup next auto transition
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    autoPlayRef.current = setTimeout(() => {
      const nextSlide = (nextIndex + 1) % REELS_DATA.length;
      transitionSlide(nextSlide);
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
                    ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
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
                >
                  <div
                    ref={(el) => {
                      progressRefs.current[index] = el;
                    }}
                    className="pageHome__main--overlayTop-indicatorBefore"
                    style={{ width: index === 0 ? '100%' : '0%' }}
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
