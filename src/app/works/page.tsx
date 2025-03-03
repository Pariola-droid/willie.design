'use client';

import PageWrapper from '@/components/common/PageWrapper';

import { useWorks } from '@/store/works.context';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { Flip } from 'gsap/dist/Flip';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FEATURED_WORKS } from '../../utils/constant';

gsap.registerPlugin(Flip, CustomEase);

CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export default function WorksPage() {
  const { works } = useWorks();

  const [bgColor, setBgColor] = useState('#ffffff');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(true);

  const verticalContainerRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>(
    FEATURED_WORKS.map(() => null)
  );
  const imageWrapperRef = useRef(null);
  const isAnimating = useRef(false);
  const isFlipping = useRef(false);

  const handleLayoutChange = () => {
    if (isFlipping.current) return;
    isFlipping.current = true;

    const state = Flip.getState([
      '.pageWorks__footer-layoutBtn',
      '.layoutBtn-span',
    ]);

    if (isVertical) {
      gsap.set(horizontalContainerRef.current, {
        display: 'flex',
        autoAlpha: 0,
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      });
    } else {
      gsap.set(verticalContainerRef.current, {
        display: 'flex',
        autoAlpha: 0,
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      });
    }

    setIsVertical(!isVertical);

    Flip.from(state, {
      absolute: true,
      duration: 0.6,
      ease: 'power2.inOut',
      immediateRender: true,
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
        ref.style.zIndex = String(FEATURED_WORKS.length - relativePos);
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
    setTimeout(() => {
      const verticalContainer = verticalContainerRef.current;
      const horizontalContainer = horizontalContainerRef.current;

      if (isVertical) {
        gsap.set(verticalContainer, {
          autoAlpha: 0,
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        });

        const tl = gsap.timeline({
          defaults: { ease: 'ease-in-out-cubic' },
        });

        tl.to(horizontalContainer, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          autoAlpha: 0,
          duration: 0.6,
        });

        tl.to(
          verticalContainer,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            autoAlpha: 1,
            duration: 1,
          },
          '>-0.2'
        );
      } else {
        gsap.set(horizontalContainer, {
          autoAlpha: 0,
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        });

        const tl = gsap.timeline({
          defaults: { ease: 'ease-in-out-cubic' },
        });

        tl.to(verticalContainer, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          autoAlpha: 0,
          duration: 0.6,
        });

        tl.to(
          horizontalContainer,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            autoAlpha: 1,
            duration: 1,
          },
          '>-0.2'
        );
      }
    }, 50);
  }, [isVertical]);

  useEffect(() => {
    if (verticalContainerRef.current && works.length > 0) {
      gsap.set(verticalContainerRef.current, {
        autoAlpha: 0,
        filter: 'grayscale(1)',
        display: 'flex',
      });

      gsap.to(verticalContainerRef.current, {
        autoAlpha: 1,
        filter: 'none',
        duration: 1,
        ease: 'ease-in-out-cubic',
      });
    }
  }, [works]);

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
          ref={verticalContainerRef}
          className={`pageWorks__verticalContainer`}
          style={{
            visibility: 'hidden',
            opacity: 0,
            display: isVertical ? 'flex' : 'none',
          }}
        >
          {works.length > 0 &&
            [...works, ...works, ...works].map((work, i) => (
              <Link
                key={`${work._id}-${i}`}
                href={`/works/${work.slug?.current || 'aria-amara'}`}
                className={`pageWorks__workCard`}
                onMouseEnter={() => setBgColor(work.hoverColor || '#ffffff')}
                onMouseLeave={() => setBgColor('#ffffff')}
              >
                <div className={`pageWorks__workCard-wImg`}>
                  <Image
                    src={work.coverImageUrl || '/images/works/work-amara.png'}
                    width={456}
                    height={300}
                    alt={work.coverImageAlt || work.title}
                  />
                </div>
                <div className="pageWorks__workCard-wInfo">
                  <small>{`${(i % works.length) + 1}.`}</small>
                  <p>{work?.title}</p>
                </div>
              </Link>
            ))}
        </div>

        <div
          ref={horizontalContainerRef}
          className={`pageWorks__horizontalContainer`}
          style={{
            visibility: 'hidden',
            opacity: 0,
            display: !isVertical ? 'flex' : 'none',
          }}
        >
          <div className="pageWorks__accordionRoot">
            <div
              role="button"
              className="pageWorks__accordionRoot-accordionItem"
            >
              <div className="pageWorks__accordionRoot-accordionItemTitle">
                <span>01</span>
                <p>The Maker Studio</p>
                <div role="button" link-interaction="no-line">
                  See case
                </div>
              </div>
            </div>

            <div
              role="button"
              className="pageWorks__accordionRoot-accordionItem"
            >
              <div className="pageWorks__accordionRoot-accordionItemTitle">
                <span>02</span>
                <p>The Maker Studio</p>
                <div role="button" link-interaction="no-line">
                  See case
                </div>
              </div>
            </div>

            <div
              role="button"
              className="pageWorks__accordionRoot-accordionItem"
            >
              <div className="pageWorks__accordionRoot-accordionItemTitle">
                <span>03</span>
                <p>The Maker Studio</p>
                <div role="button" link-interaction="no-line">
                  See case
                </div>
              </div>
            </div>

            <div
              role="button"
              className="pageWorks__accordionRoot-accordionItem"
            >
              <div className="pageWorks__accordionRoot-accordionItemTitle">
                <span>04</span>
                <p>The Maker Studio</p>
                <div role="button" link-interaction="no-line">
                  See case
                </div>
              </div>
            </div>
          </div>
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
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
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
