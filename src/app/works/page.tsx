'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FEATURED_WORKS, WORKS } from '../../utils/constant';

gsap.registerPlugin(Flip);

export default function WorksPage() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isVertical, setIsVertical] = useState<Boolean>(true);

  const imageRefs = useRef<(HTMLDivElement | null)[]>(
    FEATURED_WORKS.map(() => null)
  );
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef<boolean>(false);
  const isFlipping = useRef<boolean>(false);

  const displayWorks = isVertical ? [...WORKS, ...WORKS, ...WORKS] : WORKS;

  const handleLayoutChange = () => {
    if (isFlipping.current) return;
    isFlipping.current = true;

    const state = Flip.getState([
      '.pageWorks__cardContainer',
      '.pageWorks__workCard',
      '.pageWorks__footer-layoutBtn',
      '.layoutBtn-span',
    ]);
    setIsVertical(!isVertical);

    Flip.from(state, {
      absolute: true,
      duration: 0.5,
      ease: 'power2.inOut',
      immediateRender: true,
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, immediateRender: true }
        );
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0,
          duration: 0.4,
          immediateRender: true,
        });
      },
      onComplete: () => {
        isFlipping.current = false;
      },
    });
  };

  const updateZIndices = (currentIndex: number) => {
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const relativePos =
          (index - currentIndex + FEATURED_WORKS.length) %
          FEATURED_WORKS.length;
        //   @ts-ignore
        ref.style.zIndex = FEATURED_WORKS.length - relativePos;
      }
    });
  };

  const animateImageTransition = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const currentImage = imageRefs.current[activeIndex];
    const nextIndex = (activeIndex + 1) % FEATURED_WORKS.length;

    gsap.to(currentImage, {
      yPercent: 100,
      duration: 0.8,
      ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      onComplete: () => {
        gsap.set(currentImage, {
          yPercent: 0,
          immediateRender: true,
        });
        setActiveIndex(nextIndex);
        updateZIndices(nextIndex);
        isAnimating.current = false;
      },
    });
  };

  useEffect(() => {
    updateZIndices(activeIndex);

    const interval = setInterval(() => {
      animateImageTransition();
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <>
      <PageWrapper
        theme="light"
        className={`pageWorks`}
        style={{ backgroundColor: bgColor }}
        lenis={{
          infinite: Boolean(isVertical),
        }}
      >
        <div
          className={`pageWorks__cardContainer ${
            !isVertical ? 'horizontal' : ''
          }`}
        >
          {WORKS.map((work, i) => (
            <a
              key={`${work.id}-${i}`}
              href="/works/aria-amara"
              className={`pageWorks__workCard ${
                !isVertical ? 'horizontal' : ''
              }`}
              onMouseEnter={() => setBgColor(work.color)}
              onMouseLeave={() => setBgColor('#ffffff')}
            >
              <div
                className={`pageWorks__workCard-wImg ${
                  !isVertical ? 'horizontal' : ''
                }`}
              >
                <Image
                  src={work.img}
                  width={456}
                  height={300}
                  alt={work.title}
                />
              </div>
              <div className="pageWorks__workCard-wInfo">
                <small>{work?.number}.</small>
                <p>{work?.title}</p>
              </div>
            </a>
          ))}
        </div>
      </PageWrapper>

      <div className="pageWorks__footer">
        <button
          onClick={handleLayoutChange}
          onDoubleClick={() => (isFlipping.current = true)}
          className="pageWorks__footer-layoutControl"
        >
          <div
            role="button"
            aria-label="Change view"
            className={`pageWorks__footer-layoutBtn ${
              isVertical ? 'horizontal' : ''
            }`}
          >
            <span className="layoutBtn-span"></span>
            <span className="layoutBtn-span"></span>
            <span className="layoutBtn-span"></span>
          </div>
          <p className="pageWorks__footer-label">Change view</p>
        </button>

        <div className="pageWorks__footer-shuffleContainer">
          <div className="pageWorks__footer-scTop">
            <div
              className="pageWorks__footer-scImgWrapper"
              ref={imageWrapperRef}
            >
              <div className="pageWorks__footer-scImgContainer">
                {FEATURED_WORKS.map((work, index) => (
                  <div
                    key={work.id}
                    // @ts-ignore
                    ref={(el) => (imageRefs.current[index] = el)}
                    className="pageWorks__footer-scImg"
                    style={{
                      backgroundImage: `url(${work.img})`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="pageWorks__footer-scCaption">3+ years working</p>
          </div>
          <p className="pageWorks__footer-scCaption">
            with both agencies and individuals{' '}
          </p>
        </div>
      </div>
    </>
  );
}
