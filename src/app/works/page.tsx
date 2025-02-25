'use client';

import PageWrapper from '@/components/common/PageWrapper';

import { client } from '@/sanity/client';
import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import { type SanityDocument } from 'next-sanity';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FEATURED_WORKS, WORKS } from '../../utils/constant';

gsap.registerPlugin(Flip);
interface WorkDocument extends SanityDocument {
  featured: boolean;
  layout: 'layout_a' | 'layout_b';
  hoverColor: string;
  title: string;
  slug: { current: string };
  coverImage: {
    asset: {
      _ref: string;
      url: string;
    };
    alt?: string;
  };
  captions?: string[];
  description: string;
  liveLink?: string;
  publishedAt?: string;
}

export default function WorksPage() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isVertical, setIsVertical] = useState<Boolean>(true);

  const [works, setWorks] = useState<SanityDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const imageRefs = useRef<(HTMLDivElement | null)[]>(
    FEATURED_WORKS.map(() => null)
  );
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef<boolean>(false);
  const isFlipping = useRef<boolean>(false);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true);
        const WORKS_QUERY = `*[_type == "work" && defined(slug.current)] | order(publishedAt desc) {
          _id,
          featured,
          layout,
          hoverColor,
          title,
          slug,
          "coverImageUrl": coverImage.asset->url,
          "coverImageAlt": coverImage.alt,
          captions,
          description,
          liveLink,
          publishedAt
        }`;

        const sanityWorks = await client.fetch<WorkDocument[]>(WORKS_QUERY);
        setWorks(sanityWorks);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching Sanity data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  const handleLayoutChange = () => {
    if (isFlipping.current) return;
    isFlipping.current = true;

    const state = Flip.getState([
      '.pageWorks__footer-layoutBtn',
      '.layoutBtn-span',
    ]);
    setIsVertical(!isVertical);

    Flip.from(state, {
      absolute: true,
      duration: 0.6,
      ease: 'power2.inOut',
      immediateRender: true,
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, immediateRender: true }
        );
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0,
          duration: 0.6,
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

  if (isLoading) {
    return (
      <PageWrapper theme="light" className="pageWorks">
        <div className="loading">Loading works...</div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper theme="light" className="pageWorks">
        <div className="error">Error loading works: {error.message}</div>
      </PageWrapper>
    );
  }

  const displayWorks = works.length > 0 ? works : WORKS;

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
        <div className={`pageWorks__cardContainer`}>
          {[...displayWorks, ...displayWorks, ...displayWorks].map(
            (work: Partial<WorkDocument>, i) => (
              <a
                key={`${work._id || work.id}-${i}`}
                href={`/works/${work.slug?.current || 'aria-amara'}`}
                className={`pageWorks__workCard`}
                onMouseEnter={() =>
                  setBgColor(`#${work.hoverColor}` || '#ffffff')
                }
                onMouseLeave={() => setBgColor('#ffffff')}
              >
                <div className={`pageWorks__workCard-wImg`}>
                  <Image
                    src={
                      work.coverImageUrl ||
                      work.img ||
                      '/images/works/work-amara.png'
                    }
                    width={456}
                    height={300}
                    alt={work.coverImageAlt || work.title}
                  />
                </div>
                <div className="pageWorks__workCard-wInfo">
                  <small>{`${(i % displayWorks.length) + 1}.`}</small>
                  <p>{work?.title}</p>
                </div>
              </a>
            )
          )}
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
