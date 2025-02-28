'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { client } from '@/sanity/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SanityDocument } from 'next-sanity';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

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

  const [work, setWork] = useState<WorkDocument | null>(null);
  const [nextWork, setNextWork] = useState<WorkDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const heroImgRef = useRef<HTMLDivElement>(null);
  const galleryImgsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    if (work && !isLoading) {
      gsap.set(heroImgRef.current, {
        autoAlpha: 0,
        y: 30,
      });

      galleryImgsRef.current.forEach((ref) => {
        if (ref) {
          gsap.set(ref, {
            autoAlpha: 0,
            y: 50,
          });
        }
      });

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      tl.to(heroImgRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
      }).to(
        '.pageCaseStudy__hero h2, .pageCaseStudy__hero-descWrapper',
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
        },
        '-=0.4'
      );

      galleryImgsRef.current.forEach((ref, index) => {
        if (ref) {
          gsap.to(ref, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: ref,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }
  }, [work, isLoading]);

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

  const formattedDate = work.publishedAt
    ? new Date(work.publishedAt).getFullYear()
    : '2024';

  return (
    <PageWrapper theme="light" backButton className={`pageCaseStudy`} lenis>
      <section className="pageCaseStudy__hero">
        <h2 style={{ opacity: 0, transform: 'translateY(20px)' }}>
          {work.title}
        </h2>
        <div className="pageCaseStudy__hero-imgWrapper">
          <div className="pageCaseStudy__hero-imgWrapper--img" ref={heroImgRef}>
            <Image
              src={work.coverImageUrl || '/images/casestudy/cover-img-w.png'}
              alt={work.coverImageAlt || work.title}
              width={1166}
              height={700}
            />
          </div>
          <div className="pageCaseStudy__hero-imgWrapper--imgCaption">
            {work.captions &&
              work.captions.map((caption, i) => <p key={i}>{caption}</p>)}
          </div>
        </div>
        <div
          className="pageCaseStudy__hero-descWrapper"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
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
            className="pageCaseStudy__gallery--imgOneImg"
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
              height={427}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgTwo">
          <div
            className="pageCaseStudy__gallery--imgTwoImg"
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
              height={750}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgThree">
          <div
            className="pageCaseStudy__gallery--imgThreeImg"
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
              height={175}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgFour">
          <div
            className="pageCaseStudy__gallery--imgFourImg"
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
              height={350}
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
                {/* {work.accolades.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))} */}
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
              <div className="pageCaseStudy__nextProject--img">
                <Image
                  src={nextWork.coverImageUrl}
                  alt={nextWork.title}
                  width={218}
                  height={143}
                />
              </div>
              <div className="pageCaseStudy__nextProject--progress">
                <div className="pageCaseStudy__nextProject--progressBar" />
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
