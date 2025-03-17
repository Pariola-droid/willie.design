import { useStore } from '@/lib/store';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SplitType from 'split-type';
import pic_1 from '../app/assets/images/pic_1.webp';
import pic_2 from '../app/assets/images/pic_2.webp';
import pic_3 from '../app/assets/images/pic_3.webp';
import pic_4 from '../app/assets/images/pic_4.webp';
import pic_5 from '../app/assets/images/pic_5.webp';
import pic_6 from '../app/assets/images/pic_6.webp';
import HomePage from './HomePage';
import PageWrapper from './common/PageWrapper';

export default function LoaderHome() {
  let loaderTimeline = useRef<GSAPTimeline>(gsap.timeline());
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

    gsap.registerPlugin(ScrollTrigger);

    const split = new SplitType('.split', { types: 'words,chars' });

    const allTextContainers = document.querySelectorAll('.text-container');

    const splitNames = document.querySelectorAll('.split-name .char');

    splitNames.forEach((char) => {
      gsap.set(char, { y: 100 });
    });

    // Animation for animating the text in and zooming them out
    if (!hasLoaded) {
      for (let i = 0; i < 2; i++) {
        const container = allTextContainers[i];
        loaderTimeline.current
          .to(
            i > 0
              ? document.querySelector('.split-descrip')
              : container.querySelectorAll('.char'),
            {
              y: 0,
              duration: 1.7,
              // duration: 0.2,
              scale: 1,
              ease: 'power2.inOut',
              opacity: 1,
            },
            i > 0 ? '>-75%' : ''
          )
          .to(
            container,
            {
              scale: 800,
              duration: 3.5,
              // duration: 0.2,
              ease: 'power4.inOut',
              onStart: () => {
                gsap.to('.wp__pageHeader', {
                  opacity: 0,
                });

                if (i > 0) {
                  scaleImages();
                  setHasLoaded(true);
                }
              },
            },
            '>'
          );
      }
    } else {
      scaleImages();
    }

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
          gsap.to('.wp__pageHeader', {
            opacity: 1,
          });
          gsap.to('.name-loader', {
            opacity: 0,
            pointerEvents: 'none',
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
      //   markers: true,
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
    <section className="w-[100%] h-[100%] text-black">
      <div className="h-[100vh] fixed inset-0 w-[100vw] flex justify-center items-center text-[48px] bg-white z-[11] overflow-hidden name-loader">
        <div className="text-container absolute overflow-hidden">
          <p className="leading-[100%] split split-name">Williams</p>
          <p className="ml-[100px] leading-[100%] split split-name">Alamu</p>
        </div>
        <div className="text-container absolute  overflow-hidden">
          <p className="text-zoom scale-[0.2] opacity-0 split-descrip mb-[10px] split">
            a creative visual designer
          </p>
        </div>
      </div>

      <PageWrapper
        showHeader={true}
        className="pageHome loader relative images-container w-[100%] h-[100vh]"
        lenis
        overflowClass="loader"
      >
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
          <HomePage />
        </div>
      </PageWrapper>
    </section>
  );
}
