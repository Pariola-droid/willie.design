'use client';

import MainHomePage from '@/components/MainHomePage';
import PageWrapper from '@/components/common/PageWrapper';
import { useStore } from '@/lib/store';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import pic_1 from '../app/assets/images/pic_1.webp';
import pic_2 from '../app/assets/images/pic_2.webp';
import pic_3 from '../app/assets/images/pic_3.webp';
import pic_4 from '../app/assets/images/pic_4.webp';
import pic_5 from '../app/assets/images/pic_5.webp';
import pic_6 from '../app/assets/images/pic_6.webp';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const pictures = [pic_1, pic_2, pic_3, pic_4, pic_5, pic_6];
  const { innerHeight, innerWidth } = window;
  const [scaleValue, setScaleValue] = useState(2);
  const hasLoaded = useStore((state) => state.hasLoaded);
  const setHasLoaded = useStore((state) => state.setHasLoaded);

  useGSAP(() => {
    const lenis = new Lenis({
      duration: 0.8,
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    scaleImages();

    gsap.matchMedia().add('(max-width: 800px)', () => {
      setScaleValue(2.7);
    });
    gsap.matchMedia().add('(min-width: 800px)', () => {
      setScaleValue(2);
    });
  });

  function scaleImages() {
    const body = document.querySelector('body');

    body?.classList.remove('active');

    gsap.timeline().to(
      '.img-container',
      {
        //   display: "block",
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
  }

  // Images being scaled by the whitespace heights along with number animation
  useGSAP(() => {
    const allImages = document.querySelectorAll('.zoom-images');
    const allHeights = document.querySelectorAll('.white-height');
    const allNumbers = document.querySelectorAll('.image-number');

    allImages.forEach((pic, idx) => {
      gsap.to(pic, {
        scale: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: allHeights[idx],
          scrub: 1,
          end: 'bottom bottom',
          start: idx === 0 ? '-100% bottom' : '-60% bottom',
        },
      });
    });

    allNumbers.forEach((num, idx) => {
      const imgContainer = document.querySelector(
        '.image-number-list'
      ) as HTMLElement;

      const gap = window.getComputedStyle(imgContainer).gap;

      gsap.to('.image-number-list', {
        ease: 'power2.inOut',
        scrollTrigger: {
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
        },
      });
    });

    const revealHome = gsap
      .timeline()
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

    // Animation to reveal home screen
    ScrollTrigger.create({
      trigger: '.home-controller',
      scrub: 1,
      animation: revealHome,
      start: 'top bottom',
      end: 'top top',
      markers: true,
    });
  }, [scaleValue]);

  const [picDimension, setPicDimension] = useState<number | null>();

  // Updates the value of the height and width on resize
  useEffect(() => {
    const biggerValue = Math.max(innerHeight, innerWidth);
    setPicDimension(biggerValue);

    window.addEventListener('resize', () => {
      setPicDimension(biggerValue);
    });
  }, []);

  return (
    <section className="w-[100%] h-[100%]">
      <PageWrapper showHeader={true} className="pageHome" lenis>
        {pictures.map((pic, idx) => {
          return (
            <div
              key={idx}
              className="fixed h-[100vh] w-[100%] flex justify-center  scale-0 items-center img-container inset-0"
              style={{ zIndex: 11 }}
            >
              <Image
                src={pic}
                className={`zoom-images scale-0  object-cover ${idx > 0 ? 'opacity-0' : ''} relative inset-0`}
                style={{
                  zIndex: 11,
                  width: `${picDimension}px`,
                  height: `${picDimension}px`,
                }}
                alt=""
              />
            </div>
          );
        })}

        <div className="flex items-start gap-[4px] image-number-container opacity-0 fixed bottom-[100px] left-[50%] translate-x-[-50%] z-[13] h-[19px] overflow-hidden mix-blend-difference leading-[100%]">
          <div className="flex flex-col gap-[30px] image-number-list duration-500 ease-in-out">
            {pictures.map((pic, idx) => {
              return (
                <p key={idx} className="image-number">
                  {idx + 1}
                </p>
              );
            })}
          </div>
          <div className="w-[20px] h-[1px] bg-white translate-y-[9px]"></div>
          <p>{pictures.length}</p>
        </div>

        {/* White space Heights to control the picture animation */}
        {pictures.map((pic, idx) => {
          return (
            <div
              key={idx}
              style={{ height: `${innerHeight * 2.8}px` }}
              className=" w-[100%] white-height"
            ></div>
          );
        })}

        <div
          className=" w-[100%] home-controller bg-[transparent] relative "
          style={{ height: `${innerHeight * 1.3}px` }}
        ></div>

        <div className="fixed inset-0 w-[100%] h-[100%] home-screen flex justify-end items-end">
          <MainHomePage />
        </div>
      </PageWrapper>
    </section>
  );
}
