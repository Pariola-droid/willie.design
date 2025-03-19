'use client';

import MainHomePage from '@/components/MainHomePage';
import PageWrapper from '@/components/common/PageWrapper';
import { useStore } from '@/lib/store';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import pic_1 from '../../public/images/home/pic_1.webp';
import pic_2 from '../../public/images/home/pic_2.webp';
import pic_3 from '../../public/images/home/pic_3.webp';
import pic_4 from '../../public/images/home/pic_4.webp';
import pic_5 from '../../public/images/home/pic_5.webp';
import pic_6 from '../../public/images/home/pic_6.webp';

gsap.registerPlugin(ScrollTrigger);

type ImageInfo = {
  src: StaticImageData;
  alt: string;
};

export default function HomePage() {
  const pictures: ImageInfo[] = [
    { src: pic_1, alt: 'Portfolio image 1' },
    { src: pic_2, alt: 'Portfolio image 2' },
    { src: pic_3, alt: 'Portfolio image 3' },
    { src: pic_4, alt: 'Portfolio image 4' },
    { src: pic_5, alt: 'Portfolio image 5' },
    { src: pic_6, alt: 'Portfolio image 6' },
  ];

  const { innerHeight, innerWidth } = window;
  const [scaleValue, setScaleValue] = useState(2);
  const hasLoaded = useStore((state) => state.hasLoaded);
  const setHasLoaded = useStore((state) => state.setHasLoaded);
  const setIsHomeRevealed = useStore((state) => state.setIsHomeRevealed);
  const [picDimension, setPicDimension] = useState<number | undefined>();

  const lenisRef = useRef<Lenis | null>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  const scaleImages = useCallback(() => {
    const body = document.querySelector('body');
    body?.classList.remove('active');

    const imgContainers = document.querySelectorAll('.img-container');
    const zoomImages = document.querySelectorAll('.zoom-images');

    if (imgContainers.length > 0 && zoomImages.length > 0) {
      gsap.set(imgContainers[0], { scale: 1 });
      gsap.set(zoomImages[0], { opacity: 1, scale: 1 });
    }

    gsap.timeline().to(
      '.img-container',
      {
        scale: 1,
        delay: 1,
        transformOrigin: 'center',
        duration: 1.5,
        ease: 'power2.inOut',
        onStart: () => {
          const zoomImages = gsap.utils.toArray(
            '.zoom-images'
          ) as HTMLElement[];

          gsap.to(zoomImages[0], {
            opacity: 1,
            duration: 0,
            onComplete: () => {
              gsap.to(zoomImages, {
                opacity: 1,
              });
              gsap.to('.image-number-container', {
                opacity: 1,
                delay: 1,
                duration: 1,
              });
            },
          });
        },
        onComplete: () => {
          gsap.to('.home-screen', {
            opacity: 1,
          });
          const imgConts = document.querySelectorAll('.img-container');
          imgConts.forEach((cont) => {
            cont.classList.add('active');
          });
        },
      },
      '<'
    );
  }, []);

  useEffect(() => {
    const calculateDimension = () => {
      const biggerValue = Math.max(window.innerHeight, window.innerWidth);
      setPicDimension(biggerValue);
    };

    calculateDimension();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateDimension, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useGSAP(() => {
    lenisRef.current = new Lenis({
      duration: 0.8,
    });

    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    scaleImages();

    gsap.matchMedia().add('(max-width: 800px)', () => {
      setScaleValue(2.7);
    });

    gsap.matchMedia().add('(min-width: 800px)', () => {
      setScaleValue(2);
    });

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }

      if (lenisRef.current) {
        gsap.ticker.remove(lenisRef.current?.raf);
      }
    };
  }, [scaleImages]);

  useGSAP(() => {
    const allImages = document.querySelectorAll('.zoom-images');
    const allHeights = document.querySelectorAll('.white-height');
    const allNumbers = document.querySelectorAll('.image-number');

    scrollTriggersRef.current.forEach((trigger) => trigger.kill());
    scrollTriggersRef.current = [];

    allImages.forEach((pic, idx) => {
      const trigger = ScrollTrigger.create({
        trigger: allHeights[idx],
        scrub: 1,
        end: 'bottom bottom',
        start: idx === 0 ? '-100% bottom' : '-60% bottom',
        animation: gsap.to(pic, {
          scale: 1.2,
          ease: 'power2.inOut',
          paused: true,
        }),
      });

      scrollTriggersRef.current.push(trigger);
    });

    allNumbers.forEach((num, idx) => {
      const imgContainer = document.querySelector(
        '.image-number-list'
      ) as HTMLElement;
      if (!imgContainer) return;

      const gap = window.getComputedStyle(imgContainer).gap;

      const trigger = ScrollTrigger.create({
        trigger: allHeights[idx],
        end: 'bottom bottom',
        start: idx === 0 ? '-150% bottom' : '-60% bottom',
        scrub: true,
        onEnter: () => {
          imgContainer.style.transform = `translate(0px, -${(num.clientHeight + parseFloat(gap)) * idx}px)`;
        },
        onEnterBack: () => {
          imgContainer.style.transform = `translate(0px, -${(num.clientHeight + parseFloat(gap)) * idx}px)`;
        },
      });

      scrollTriggersRef.current.push(trigger);
    });

    const revealHome = gsap
      .timeline({ paused: true })
      .to('.img-container', {
        yPercent: -100,
      })
      .to(
        '.image-number-container',
        {
          y: -innerHeight,
        },
        '<'
      );

    const finalTrigger = ScrollTrigger.create({
      trigger: '.home-controller',
      scrub: 1,
      animation: revealHome,
      start: 'top bottom',
      end: 'top top',
      // markers: false,
      onLeave: () => {
        setTimeout(() => {
          setIsHomeRevealed(true);
        }, 100);
      },
      onEnterBack: () => {
        setIsHomeRevealed(false);
      },
    });

    scrollTriggersRef.current.push(finalTrigger);

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
    };
  }, [scaleValue, innerHeight]);

  return (
    <section className="w-full h-full" aria-label="Portfolio image gallery">
      <PageWrapper
        showHeader={true}
        className="pageHomeRoot"
        overflowClass="loader"
        lenis
      >
        {/* skip button for accessibility - not in use yet*/}
        <button
          className="skip-animation-btn sr-only focus:not-sr-only"
          onClick={() => setHasLoaded(true)}
        >
          Skip animation
        </button>

        {pictures.map(({ src, alt }, idx) => (
          <div
            key={idx}
            className={`fixed h-[100vh] w-full flex justify-center items-center img-container inset-0`}
            style={{ zIndex: 11, scale: idx === 0 ? 1 : 0 }}
          >
            <Image
              src={src}
              className={`zoom-images object-cover relative inset-0`}
              style={{
                zIndex: 11,
                width: picDimension ? `${picDimension}px` : '100%',
                height: picDimension ? `${picDimension}px` : '100%',
                opacity: idx === 0 ? 1 : 0,
                scale: idx === 0 ? 1 : 0,
              }}
              alt={alt}
              priority={idx === 0}
            />
          </div>
        ))}

        <div
          className="flex items-start gap-[4px] image-number-container opacity-0 fixed bottom-[100px] left-[50%] translate-x-[-50%] z-[13] h-[19px] overflow-hidden mix-blend-difference leading-[100%]"
          aria-hidden="true"
        >
          <div className="flex flex-col gap-[30px] image-number-list duration-500 ease-in-out">
            {pictures.map((_, idx) => (
              <p key={idx} className="image-number">
                {idx + 1}
              </p>
            ))}
          </div>
          <div className="w-[20px] h-[1px] bg-white translate-y-[9px]"></div>
          <p>{pictures.length}</p>
        </div>

        {/* White space Heights to control the picture animation */}
        {pictures.map((_, idx) => (
          <div
            key={idx}
            style={{ height: `${innerHeight * 2.8}px` }}
            className="w-full white-height"
            aria-hidden="true"
          ></div>
        ))}

        <div
          className="w-full home-controller bg-transparent relative"
          style={{ height: `${innerHeight * 1.3}px` }}
          aria-hidden="true"
        ></div>

        <div className="pageHome home-screen">
          <MainHomePage />
        </div>
      </PageWrapper>
    </section>
  );
}
