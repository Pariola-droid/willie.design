'use client';

import { useStore } from '@/lib/store';
import { FEATURED_WORKS } from '@/utils/constant';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { Fragment, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

interface IFeaturedWork {
  id: number;
  title: string;
  key: string;
  img: string;
  videoUrl?: string;
}

export default function MainHomePage() {
  const isHomeRevealed = useStore((state) => state.isHomeRevealed);

  const [activeWork, setActiveWork] = useState<IFeaturedWork | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const hasAnimatedRef = useRef(false);
  const tl = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    const titleItem = document.querySelectorAll('.cTitleItem');
    const listItems = document.querySelectorAll('.cListItem');
    const listLine = document.querySelectorAll('.cListLine');

    titleItem.forEach((item) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'cText-wrapper';
      item.parentNode?.insertBefore(wrapper, item);
      wrapper.appendChild(item);
    });

    listItems.forEach((item) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'cText-wrapper';
      item.parentNode?.insertBefore(wrapper, item);
      wrapper.appendChild(item);
    });

    const videoWrapper = document.querySelector('.cImg-reveal');
    const video = videoWrapper?.querySelector('video');
    const revealWrappers = gsap.utils.toArray('.cText-wrapper');

    if (videoWrapper) {
      gsap.set(videoWrapper, {
        clipPath: 'inset(100% 0 0 0)',
      });

      if (video) {
        gsap.set(video, {
          filter: 'brightness(20%)',
          scale: 1.4,
        });
      }
    }

    gsap.set(revealWrappers, {
      autoAlpha: 1,
    });

    gsap.set('.pageHome__footer small', {
      autoAlpha: 0,
      x: -10,
    });

    gsap.set('.cListLine', {
      scaleY: 0,
      transformOrigin: 'top left',
      autoAlpha: 0,
    });

    gsap.set(['.cTitleItem', '.cListItem'], {
      y: 40,
      autoAlpha: 0,
      transformStyle: 'preserve-3d',
    });

    tl.current.clear();
    tl.current = gsap.timeline({
      defaults: {
        ease: 'ease-in-out-cubic',
      },
      paused: true,
    });

    if (videoWrapper && video) {
      tl.current
        .to(videoWrapper, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
        })
        .to(
          video,
          {
            scale: 1,
            filter: 'brightness(100%)',
            duration: 1.2,
          },
          '<'
        )
        .to(
          listLine,
          {
            scaleY: 1,
            duration: 1.2,
            autoAlpha: 1,
            stagger: 0.05,
          },
          '-=1.1'
        )
        .to(
          ['.cTitleItem', '.cListItem'],
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.05,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        )
        .to(
          '.pageHome__footer small',
          {
            autoAlpha: 0.4,
            x: 0,
            stagger: 0.1,
            duration: 0.6,
          },
          '-=0.8'
        );
    }

    setActiveWork(FEATURED_WORKS[0]);

    FEATURED_WORKS.forEach((work, index) => {
      const videoElement = videosRef.current[work.key];

      if (!videoElement) return;

      if (index === 0) {
        gsap.set(videoElement, {
          autoAlpha: 1,
          position: 'relative',
          zIndex: 2,
        });
        videoElement.load();
      } else {
        gsap.set(videoElement, {
          autoAlpha: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        });
      }
    });

    return () => {
      tl.current.kill();
    };
  }, []);

  useEffect(() => {
    if (isHomeRevealed && !hasAnimatedRef.current) {
      tl.current.play();
      hasAnimatedRef.current = true;
    } else if (!isHomeRevealed && hasAnimatedRef.current) {
      tl.current.reverse();
      hasAnimatedRef.current = false;
    }
  }, [isHomeRevealed]);

  useEffect(() => {
    if (!activeWork || !videoWrapperRef.current) return;

    FEATURED_WORKS.forEach((work) => {
      const video = videosRef.current[work.key];
      if (!video) return;

      if (work.key !== activeWork.key) {
        gsap.to(video, {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.out',
          zIndex: 1,
          onComplete: () => {
            video.pause();
          },
        });
      }
    });

    const activeVideo = videosRef.current[activeWork.key];
    if (activeVideo) {
      gsap.to(activeVideo, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.in',
        zIndex: 2,
        onComplete: () => {
          if (activeVideo.readyState >= 2) {
            activeVideo
              .play()
              .catch((err) => console.error('Video play failed:', err));
          } else {
            activeVideo.load();
            activeVideo.oncanplay = () => {
              activeVideo
                .play()
                .catch((err) => console.error('Video play failed:', err));
            };
          }
        },
      });
    }
  }, [activeWork]);

  return (
    <Fragment>
      <section className="pageHome__main">
        <div className="pageHome__main-leftSlot">
          <div
            className="pageHome__main-workImg cImg-reveal"
            ref={videoWrapperRef}
          >
            {FEATURED_WORKS.map((work) => (
              <video
                key={work.key}
                ref={(el) => {
                  videosRef.current[work.key] = el;
                }}
                className="featured-work-video"
                width="377"
                height="500"
                loop
                muted
                playsInline
                preload="metadata"
                poster={work.img}
              >
                <source src={work.videoUrl || '#'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        </div>

        <div className="pageHome__main-rightSlot">
          <div className="pageHome__main-details">
            <div className="pageHome__main-details--line cListLine" />
            <h4 className="pageHome__main-details--title cTitleItem">Cases</h4>

            <div className="pageHome__main-details--group">
              <div className={`pageHome__main-details--list`}>
                <div className="pageHome__main-details--listTitle cTitleItem">
                  Featured
                </div>
                {FEATURED_WORKS.map((work) => (
                  <p
                    key={work.id}
                    className={`pageHome__main-details--listItem cListItem cursor-pointer ${activeWork?.key === work.key ? 'active' : ''}`}
                    onMouseEnter={() => setActiveWork(work)}
                  >
                    <a
                      link-interaction="no-line"
                      target="_blank"
                      rel="noopener"
                    >
                      {work.title}
                    </a>
                  </p>
                ))}
              </div>

              <div className={`pageHome__main-details--list`}>
                <div className="pageHome__main-details--listTitle cTitleItem">
                  Core services
                </div>

                <p className={`pageHome__main-details--listItem cListItem`}>
                  Web, Product and Motion Design
                </p>
              </div>
            </div>
          </div>

          <div className="pageHome__main-details">
            <div className="pageHome__main-details--line cListLine" />
            <h4 className="pageHome__main-details--title cTitleItem">Bio</h4>

            <div className={`pageHome__main-details--list`}>
              <div className="pageHome__main-details--listTitle cTitleItem">
                Based in Lagos
              </div>

              <p className={`pageHome__main-details--listItem cListItem`}>
                Creative visual designer focused on playing with layout
                compositions, colors and typography to create immersive digital
                experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pageHome__footer">
        <small>
          Currently at{' '}
          <a link-interaction="no-line" target="_blank" rel="noopener">
            Balky Studio
          </a>
        </small>
        <small></small>
      </div>
    </Fragment>
  );
}
