'use client';

import { useStore } from '@/lib/store';
import { FEATURED_WORKS } from '@/utils/constant';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

interface IFeaturedWork {
  id: number;
  title: string;
  key: string;
  img: string;
}

export default function MainHomePage() {
  const router = useRouter();
  const isHomeRevealed = useStore((state) => state.isHomeRevealed);

  const [activeWork, setActiveWork] = useState<IFeaturedWork | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<{ [key: string]: HTMLImageElement | null }>({});
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

    const imageWrapper = document.querySelector('.cImg-reveal');
    const image = imageWrapper?.querySelector('img');
    const revealWrappers = gsap.utils.toArray('.cText-wrapper');

    if (imageWrapper && image) {
      gsap.set(imageWrapper, {
        clipPath: 'inset(100% 0 0 0)',
      });

      gsap.set(image, {
        filter: 'brightness(20%)',
        scale: 1.4,
      });
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

    if (imageWrapper && image) {
      tl.current
        .to(imageWrapper, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
        })
        .to(
          image,
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
      if (index === 0) {
        gsap.set(imagesRef.current[work.key], {
          autoAlpha: 1,
          position: 'relative',
          zIndex: 2,
        });
      } else {
        gsap.set(imagesRef.current[work.key], {
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
    if (!activeWork || !imageWrapperRef.current) return;

    FEATURED_WORKS.forEach((work) => {
      if (work.key !== activeWork.key && imagesRef.current[work.key]) {
        gsap.to(imagesRef.current[work.key], {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.out',
          zIndex: 1,
        });
      }
    });

    if (imagesRef.current[activeWork.key]) {
      gsap.to(imagesRef.current[activeWork.key], {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.in',
        zIndex: 2,
      });
    }
  }, [activeWork]);

  return (
    <Fragment>
      <section className="pageHome__main">
        <div className="pageHome__main-leftSlot">
          <div
            className="pageHome__main-workImg cImg-reveal"
            ref={imageWrapperRef}
          >
            {FEATURED_WORKS.map((work) => (
              <Image
                key={work.key}
                ref={(el) => {
                  imagesRef.current[work.key] = el;
                }}
                width={377}
                height={500}
                src={work.img}
                alt={`${work.title} image`}
                data-title={work.key}
                priority
              />
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
