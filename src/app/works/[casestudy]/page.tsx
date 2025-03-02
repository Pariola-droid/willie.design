'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useStore } from '@/lib/store';
import { useWorks } from '@/store/works.context';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export default function CaseStudyPage() {
  const params = useParams();
  const router = useRouter();

  const { currentWork, nextWork } = useWorks();
  const setIsAnimating = useStore((state) => state.setIsAnimating);

  const titleRef = useRef<HTMLHeadingElement>(null);
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
        );

      gsap.to(heroImgRef.current.querySelector('img'), {
        y: -70,
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
            gsap.to(img, {
              y: index % 2 === 0 ? -100 : -70,
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
  }, [currentWork, nextWork]);

  useEffect(() => {
    if (progressBarRef.current && nextWork) {
      let progress = 0;
      let isNavigating = false;

      const progressBar = progressBarRef.current;

      const handleScroll = (e: {
        deltaY: number;
        preventDefault: () => void;
      }) => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100
        ) {
          if (e.deltaY > 0) {
            // reduced speed
            progress = Math.min(progress + 0.01, 1);
          } else if (e.deltaY < 0) {
            progress = Math.max(progress - 0.04, 0);
          }

          progressBar.style.transform = `scaleX(${progress})`;

          if (progress >= 1 && !isNavigating) {
            isNavigating = true;

            setTimeout(() => {
              router.push(`/works/${nextWork.slug?.current}`);
            }, 200);
          }

          e.preventDefault();
        }
      };

      window.addEventListener('wheel', handleScroll, { passive: false });

      return () => {
        window.removeEventListener('wheel', handleScroll);
      };
    }
  }, [nextWork, router]);

  const getImageForPosition = (position: string) => {
    if (!currentWork || !currentWork.caseStudyImages) return null;
    const image = currentWork.caseStudyImages?.find(
      (img) => img.position === position
    );
    return image;
  };

  return (
    <PageWrapper theme="light" backButton className={`pageCaseStudy`} lenis>
      <section className="pageCaseStudy__hero">
        <h2 ref={titleRef} className="case-title">
          {currentWork?.title}
        </h2>

        <div className="pageCaseStudy__hero-imgWrapper" ref={heroImgWrapperRef}>
          <div className="pageCaseStudy__hero-imgWrapper--img" ref={heroImgRef}>
            <Image
              src={
                currentWork?.coverImageUrl ||
                '/images/casestudy/cover-img-w.png'
              }
              alt={
                currentWork?.coverImageAlt || currentWork?.title || 'case study'
              }
              width={1166}
              height={800}
            />
          </div>
          <div className="pageCaseStudy__hero-imgWrapper--imgCaption">
            {currentWork?.captions &&
              currentWork?.captions.map((caption, i) => (
                <p key={i}>{caption}</p>
              ))}
          </div>
        </div>

        <div className="pageCaseStudy__hero-descWrapper">
          <div data-animation="skew-split-paragraph">
            {currentWork?.description}
          </div>
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
        <div className="pageCaseStudy__gallery--imgOne">
          <div
            className="pageCaseStudy__gallery--imgOneImg parallax-image"
            ref={(el) => {
              galleryImgsRef.current[0] = el;
            }}
          >
            <Image
              src={
                getImageForPosition('position_1')?.url ||
                '/images/casestudy/w-img-a.png'
              }
              alt={getImageForPosition('position_1')?.alt || 'case study image'}
              width={575}
              height={500}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgTwo">
          <div
            className="pageCaseStudy__gallery--imgTwoImg parallax-image"
            ref={(el) => {
              galleryImgsRef.current[1] = el;
            }}
          >
            <Image
              src={
                getImageForPosition('position_2')?.url ||
                '/images/casestudy/w-img-b.png'
              }
              alt={getImageForPosition('position_2')?.alt || 'case study image'}
              width={694}
              height={800}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgThree">
          <div
            className="pageCaseStudy__gallery--imgThreeImg parallax-image"
            ref={(el) => {
              galleryImgsRef.current[2] = el;
            }}
          >
            <Image
              src={
                getImageForPosition('position_3')?.url ||
                '/images/casestudy/w-img-c.png'
              }
              alt={getImageForPosition('position_3')?.alt || 'case study image'}
              width={238}
              height={250}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgFour">
          <div
            className="pageCaseStudy__gallery--imgFourImg parallax-image"
            ref={(el) => {
              galleryImgsRef.current[3] = el;
            }}
          >
            <Image
              src={
                getImageForPosition('position_4')?.url ||
                '/images/casestudy/w-img-d.png'
              }
              alt={getImageForPosition('position_4')?.alt || 'case study image'}
              width={456}
              height={480}
            />
          </div>
        </div>
      </section>

      <section className="pageCaseStudy__moreDetails">
        <h3>More Details</h3>
        <div className="pageCaseStudy__moreDetails--credit">
          {currentWork?.collab && (
            <div className="pageCaseStudy__moreDetails--creditCol">
              <div className="pageCaseStudy__moreDetails--creditLabel">
                Collab
              </div>
              <div className="pageCaseStudy__moreDetails--creditContent">
                {currentWork?.collab}
              </div>
            </div>
          )}

          {currentWork?.accolades && (
            <div className="pageCaseStudy__moreDetails--creditCol">
              <div className="pageCaseStudy__moreDetails--creditLabel">
                Accolades
              </div>
              <div className="pageCaseStudy__moreDetails--creditContent">
                {currentWork?.accolades}
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
                <Image
                  src={
                    nextWork?.coverImageUrl || '/images/works/work-amara.png'
                  }
                  alt={nextWork.title}
                  width={218}
                  height={143}
                />
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
              onClick={() => router.push(`/works/${nextWork.slug?.current}`)}
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
