'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useStore } from '@/lib/store';
import { client } from '@/sanity/client';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SanityDocument } from 'next-sanity';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

interface WorkDocument extends SanityDocument {
  title: string;
  description: string;
  publishedAt: string;
  captions?: string[];
  coverImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  caseStudyImages: Array<{
    asset: {
      url: string;
    };
    alt?: string;
    position: string;
  }>;
  liveLink?: string;
  collab?: string;
  accolades?: string;
  hoverColor?: string;
}

export default function CaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const setIsAnimating = useStore((state) => state.setIsAnimating);

  const [work, setWork] = useState<WorkDocument | null>(null);
  const [nextWork, setNextWork] = useState<WorkDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroImgWrapperRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const galleryImgsRef = useRef<(HTMLDivElement | null)[]>([]);
  const moreDetailsRef = useRef<HTMLHeadingElement>(null);
  const nextProjectImgRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setIsLoading(true);

        const slug = params?.casestudy as string;
        const WORK_QUERY = `*[_type == "work" && slug.current == $slug][0]{
          _id,
          title,
          description,
          "coverImageUrl": coverImage.asset->url,
          "coverImageAlt": coverImage.alt,
          "caseStudyImages": caseStudyImages[]{
            "url": asset->url,
            "alt": alt,
            "position": position
          },
          liveLink,
          collab,
          accolades,
          hoverColor,
          publishedAt,
          captions
        }`;

        const workData = await client.fetch<WorkDocument>(WORK_QUERY, { slug });

        if (!workData) {
          throw new Error('Case study not found');
        }

        setWork(workData);

        const NEXT_WORK_QUERY = `*[_type == "work" && _id != $id][0]{
          _id,
          title,
          slug,
          "coverImageUrl": coverImage.asset->url
        }`;

        const nextWorkData = await client.fetch<WorkDocument>(NEXT_WORK_QUERY, {
          id: workData._id,
        });

        setNextWork(nextWorkData);

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching case study:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [params?.casestudy]);

  useEffect(() => {
    if (
      work &&
      !isLoading &&
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

      gsap.set(descRef.current, {
        opacity: 0,
        y: 30,
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
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.6'
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
  }, [work, isLoading, setIsAnimating]);

  useEffect(() => {
    if (work && !isLoading) {
      galleryImgsRef.current.forEach((imgRef, index) => {
        if (imgRef) {
          gsap.set(imgRef, {
            autoAlpha: 0,
            y: 20,
          });

          gsap.to(imgRef, {
            autoAlpha: 1,
            y: 0,
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
  }, [work, isLoading, nextWork]);

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
            progress = Math.min(progress + 0.005, 1);
          } else if (e.deltaY < 0) {
            progress = Math.max(progress - 0.04, 0);
          }

          progressBar.style.transform = `scaleX(${progress})`;

          if (progress >= 1 && !isNavigating) {
            isNavigating = true;

            setTimeout(() => {
              router.push(`/works/${nextWork.slug?.current}`);
            }, 300);
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

  if (isLoading) {
    return (
      <PageWrapper theme="light" backButton className="pageCaseStudy" lenis>
        <div className="pageCaseStudy__loading">Loading case study...</div>
      </PageWrapper>
    );
  }

  if (error || !work) {
    return (
      <PageWrapper theme="light" backButton className="pageCaseStudy" lenis>
        <div className="error">{error?.message || 'Case study not found'}</div>
      </PageWrapper>
    );
  }

  const getImageForPosition = (position: string) => {
    const image = work.caseStudyImages?.find(
      (img) => img.position === position
    );
    return image;
  };

  return (
    <PageWrapper theme="light" backButton className={`pageCaseStudy`} lenis>
      <section className="pageCaseStudy__hero">
        <h2 ref={titleRef} className="case-title">
          {work.title}
        </h2>

        <div className="pageCaseStudy__hero-imgWrapper" ref={heroImgWrapperRef}>
          <div className="pageCaseStudy__hero-imgWrapper--img" ref={heroImgRef}>
            <Image
              src={work.coverImageUrl || '/images/casestudy/cover-img-w.png'}
              alt={work.coverImageAlt || work.title}
              width={1166}
              height={800}
            />
          </div>
          <div className="pageCaseStudy__hero-imgWrapper--imgCaption">
            {work.captions &&
              work.captions.map((caption, i) => <p key={i}>{caption}</p>)}
          </div>
        </div>

        <div className="pageCaseStudy__hero-descWrapper" ref={descRef}>
          <p>{work.description}</p>
          {work.liveLink && (
            <p>
              <span>↳</span>
              <a href={work.liveLink} target="_blank" rel="noopener noreferrer">
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
                getImageForPosition('position_1')?.asset?.url ||
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
                getImageForPosition('position_2')?.asset?.url ||
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
                getImageForPosition('position_3')?.asset?.url ||
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
                getImageForPosition('position_4')?.asset?.url ||
                '/images/casestudy/w-img-d.png'
              }
              alt={getImageForPosition('position_4')?.alt || 'case study image'}
              width={456}
              height={420}
            />
          </div>
        </div>
      </section>

      <section className="pageCaseStudy__moreDetails">
        <h3>More Details</h3>
        <div className="pageCaseStudy__moreDetails--credit">
          {work.collab && (
            <div className="pageCaseStudy__moreDetails--creditCol">
              <div className="pageCaseStudy__moreDetails--creditLabel">
                Collab
              </div>
              <div className="pageCaseStudy__moreDetails--creditContent">
                {work.collab}
              </div>
            </div>
          )}

          {work.accolades && (
            <div className="pageCaseStudy__moreDetails--creditCol">
              <div className="pageCaseStudy__moreDetails--creditLabel">
                Accolades
              </div>
              <div className="pageCaseStudy__moreDetails--creditContent">
                {work.accolades}
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
                  src={nextWork.coverImageUrl}
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
