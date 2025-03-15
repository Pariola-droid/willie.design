'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useStore } from '@/lib/store';
import { urlFor } from '@/sanity/lib/image';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Work } from '../../../sanity.types';
import CaseStudyImage from './CasestudyImage';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export const LAYOUT_PRIMARY = 'layout_p';
export const LAYOUT_SECONDARY = 'layout_s';

export default function MainCaseStudyPage({
  currentWork,
  nextWork,
}: {
  currentWork: Work;
  nextWork: Work;
}) {
  const params = useParams();
  const router = useRouter();

  const setIsAnimating = useStore((state) => state.setIsAnimating);
  const [showWorkDesc, setShowWorkDesc] = useState<boolean>(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const heroImgWrapperRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const galleryImgsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nextProjectImgRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      currentWork &&
      titleRef.current &&
      heroImgWrapperRef.current &&
      heroImgRef.current
    ) {
      const wrapper = document.createElement('div');
      wrapper.className = 'cText-wrapper';
      titleRef.current.parentNode?.insertBefore(wrapper, titleRef.current);
      wrapper.appendChild(titleRef.current);

      gsap.set(titleRef.current, {
        y: 40,
        autoAlpha: 0,
        transformStyle: 'preserve-3d',
      });

      gsap.set(descRef.current, {
        autoAlpha: 0,
      });

      gsap.set(heroImgWrapperRef.current, {
        clipPath: 'inset(0 0 100% 0)',
      });

      gsap.set(heroImgRef.current.querySelector('img'), {
        scale: 1.2,
        filter: 'brightness(95%)',
      });

      setIsAnimating(true);
      document.documentElement.style.setProperty('--cursor', 'wait');

      const tl = gsap.timeline({
        defaults: {
          ease: 'ease-in-out-cubic',
        },
        onComplete: () => {
          setIsAnimating(false);
          setShowWorkDesc(true);
          document.documentElement.style.setProperty('--cursor', 'auto');
        },
      });

      tl.to(titleRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
      })
        .to(
          heroImgWrapperRef.current,
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
          },
          '-=0.4'
        )
        .to(
          heroImgRef.current.querySelector('img'),
          {
            scale: 1,
            filter: 'brightness(100%)',
            duration: 1.2,
          },
          '<'
        )
        .to(descRef.current, {
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
        });

      gsap.to(heroImgRef.current.querySelector('img'), {
        y: isMobile ? 0 : -70,
        ease: 'none',
        scrollTrigger: {
          trigger: heroImgWrapperRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      return () => {
        setIsAnimating(false);
        document.documentElement.style.setProperty('--cursor', 'auto');
      };
    }
  }, [currentWork, setIsAnimating]);

  useEffect(() => {
    if (currentWork) {
      galleryImgsRef.current.forEach((imgRef, index) => {
        if (imgRef) {
          gsap.set(imgRef, {
            autoAlpha: 0,
            y: 50,
            filter: 'brightness(80%)',
          });

          gsap.to(imgRef, {
            autoAlpha: 1,
            y: 0,
            filter: 'brightness(100%)',
            duration: 0.8,
            scrollTrigger: {
              trigger: imgRef,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
          });

          const img = imgRef.querySelector('img');
          if (img) {
            const yValue = isMobile
              ? index === 1 || index === 3
                ? -50
                : 0
              : index % 2 === 0
                ? -35
                : -70;

            gsap.to(img, {
              y: yValue,
              ease: 'none',
              scrollTrigger: {
                trigger: imgRef,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            });
          }
        }
      });
    }
  }, [currentWork]);

  useEffect(() => {
    if (progressBarRef.current && nextWork) {
      let progress = 0;
      let isNavigating = false;
      let touchStartY = 0;
      let isAtBottom = false;
      let isTracking = false;

      const progressBar = progressBarRef.current;

      const checkIfAtPageButt = () => {
        const buffer = 100;
        return (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - buffer
        );
      };

      // desktop
      const handleScroll = (e: {
        deltaY: number;
        preventDefault: () => void;
      }) => {
        isAtBottom = checkIfAtPageButt();

        if (isAtBottom) {
          if (e.deltaY > 0) {
            // reduced speed
            progress = Math.min(progress + 0.01, 1);
          } else if (e.deltaY < 0) {
            progress = Math.max(progress - 0.04, 0);

            if (progress <= 0) {
              return;
            }
          }

          progressBar.style.transform = `scaleX(${progress})`;

          if (progress >= 1 && !isNavigating) {
            isNavigating = true;
            setTimeout(() => {
              router.push(`/works/${nextWork.slug?.current}`);
            }, 50);
          }

          if (progress > 0) {
            e.preventDefault();
          }
        }
      };

      // mobile
      const handleTouchStart = (e: TouchEvent) => {
        isAtBottom = checkIfAtPageButt();

        if (isAtBottom) {
          touchStartY = e.touches[0].clientY;
          isTracking = true;
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isTracking) return;

        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;

        // swipe up or down
        if (diff > 0) {
          progress = Math.min(progress + 0.01, 1);
        } else if (diff < 0) {
          progress = Math.max(progress - 0.02, 0);

          if (progress <= 0) {
            isTracking = false;
            return;
          }
        }

        progressBar.style.transform = `scaleX(${progress})`;

        if (progress >= 1 && !isNavigating) {
          isNavigating = true;

          setTimeout(() => {
            router.push(`/works/${nextWork.slug?.current}`);
          }, 50);
        }

        if (progress > 0) {
          e.preventDefault();
        }

        touchStartY = touchY;
      };

      const handleTouchEnd = () => {
        isTracking = false;

        if (progress < 0.1) {
          progress = 0;
          progressBar.style.transform = `scaleX(${progress})`;
        }
      };

      window.addEventListener('wheel', handleScroll, { passive: false });
      window.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        window.removeEventListener('wheel', handleScroll);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [nextWork, router]);

  const position_1_sz = currentWork?.layout === LAYOUT_SECONDARY ? 250 : 430;
  const position_2_sz = currentWork?.layout === LAYOUT_SECONDARY ? 500 : 750;
  const position_3_sz = currentWork?.layout === LAYOUT_SECONDARY ? 179 : 175;
  const position_4_sz = currentWork?.layout === LAYOUT_SECONDARY ? 375 : 350;

  return (
    <PageWrapper theme="light" backButton className={`pageCaseStudy`} lenis>
      <section className="pageCaseStudy__hero">
        <h2 ref={titleRef} className="case-title">
          {currentWork?.title}
        </h2>

        <div className="pageCaseStudy__hero-imgWrapper" ref={heroImgWrapperRef}>
          {currentWork.coverImage && (
            <div
              className="pageCaseStudy__hero-imgWrapper--img"
              ref={heroImgRef}
            >
              <Image
                src={urlFor(currentWork?.coverImage).quality(100).url()}
                alt={
                  currentWork?.coverImage?.alt ||
                  `cover image for ${currentWork?.title}`
                }
                placeholder={
                  //@ts-ignore
                  currentWork.coverImage?.asset?.metadata?.lqip
                    ? 'blur'
                    : undefined
                }
                blurDataURL={
                  //@ts-ignore
                  currentWork.coverImage.asset?.metadata?.lqip || undefined
                }
                width={1166}
                height={700}
                quality={100}
              />
            </div>
          )}
          <div className="pageCaseStudy__hero-imgWrapper--imgCaption">
            {currentWork?.captions &&
              currentWork?.captions.map((caption, i) => (
                <p key={i}>{caption}</p>
              ))}
          </div>
        </div>

        <div className="pageCaseStudy__hero-descWrapper" ref={descRef}>
          <div data-animation="skew-heading">{currentWork?.description}</div>
          {currentWork?.liveLink && (
            <p>
              <span>↳</span>
              <a
                href={currentWork?.liveLink}
                target="_blank"
                rel="noopener"
                link-interaction="underline"
              >
                view live
              </a>
            </p>
          )}
        </div>
      </section>

      <section className="pageCaseStudy__gallery">
        <div
          className={`pageCaseStudy__gallery--imgOne
          ${currentWork?.layout === LAYOUT_SECONDARY ? 'layout_s' : ''}
          `}
        >
          <CaseStudyImage
            currentWork={currentWork}
            position="position_1"
            layoutType={currentWork?.layout}
            width={575}
            height={position_1_sz}
            index={0}
            ref={(el) => {
              galleryImgsRef.current[0] = el;
            }}
          />
        </div>

        <div
          className={`pageCaseStudy__gallery--imgTwo 
          ${currentWork?.layout === LAYOUT_SECONDARY ? 'layout_s' : ''}
          `}
        >
          <CaseStudyImage
            currentWork={currentWork}
            position="position_2"
            layoutType={currentWork?.layout}
            width={694}
            height={position_2_sz}
            index={1}
            ref={(el) => {
              galleryImgsRef.current[1] = el;
            }}
          />
        </div>

        <div
          className={`pageCaseStudy__gallery--imgThree
            ${currentWork?.layout === LAYOUT_SECONDARY ? 'layout_s' : ''}
            `}
        >
          <CaseStudyImage
            currentWork={currentWork}
            position="position_3"
            layoutType={currentWork?.layout}
            width={238}
            height={position_3_sz}
            index={2}
            ref={(el) => {
              galleryImgsRef.current[2] = el;
            }}
          />
        </div>

        <div
          className={`pageCaseStudy__gallery--imgFour
                ${currentWork?.layout === LAYOUT_SECONDARY ? 'layout_s' : ''}
                `}
        >
          <CaseStudyImage
            currentWork={currentWork}
            position="position_4"
            layoutType={currentWork?.layout}
            width={456}
            height={position_4_sz}
            index={3}
            ref={(el) => {
              galleryImgsRef.current[3] = el;
            }}
          />
        </div>
      </section>

      <section className="pageCaseStudy__moreDetails">
        <h3>More Details</h3>
        <div className="pageCaseStudy__moreDetails--credit">
          {currentWork?.collabs && (
            <div className="pageCaseStudy__moreDetails--creditCol">
              <div className="pageCaseStudy__moreDetails--creditLabel">
                Collab
              </div>
              <div className="pageCaseStudy__moreDetails--creditContent">
                {currentWork?.collabs.map((collab, i) => (
                  <p key={i}>{collab}</p>
                ))}
              </div>
            </div>
          )}

          {currentWork?.accolades && (
            <div className="pageCaseStudy__moreDetails--creditCol">
              <div className="pageCaseStudy__moreDetails--creditLabel">
                Accolades
              </div>
              <div className="pageCaseStudy__moreDetails--creditContent">
                {currentWork?.accolades.map((accolade, i) => (
                  <p key={i}>{accolade}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {nextWork && (
        <section className="pageCaseStudy__nextProject">
          <div className="pageCaseStudy__nextProject--CTA">
            <div className="pageCaseStudy__nextProject--leftSlot">
              <div
                className="pageCaseStudy__nextProject--img"
                ref={nextProjectImgRef}
              >
                {nextWork?.coverImage && (
                  <Image
                    src={urlFor(nextWork?.coverImage).quality(100).url()}
                    alt={
                      nextWork?.coverImage?.alt ||
                      `cover image for ${nextWork?.title}`
                    }
                    placeholder={
                      //@ts-ignore
                      nextWork.coverImage?.asset?.metadata?.lqip
                        ? 'blur'
                        : undefined
                    }
                    blurDataURL={
                      //@ts-ignore
                      nextWork.coverImage.asset?.metadata?.lqip || undefined
                    }
                    quality={100}
                    width={218}
                    height={143}
                  />
                )}
              </div>
              <div className="pageCaseStudy__nextProject--progress">
                <div
                  ref={progressBarRef}
                  className="pageCaseStudy__nextProject--progressBar"
                />
              </div>
            </div>
            <div
              className="pageCaseStudy__nextProject--content"
              onClick={() => {
                router.push(`/works/${nextWork.slug?.current}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <p>Next Project</p>
              <h4>{nextWork.title}</h4>
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
