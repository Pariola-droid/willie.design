import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SplitType from 'split-type';
import pic_1 from '../app/assets/images/pic_1.png';
import pic_2 from '../app/assets/images/pic_2.png';
import pic_3 from '../app/assets/images/pic_3.png';
import pic_4 from '../app/assets/images/pic_4.png';
import pic_5 from '../app/assets/images/pic_5.png';
import HomeScreen from './HomeScreen';

export default function LoaderHome() {
  let loaderTimeline = useRef<GSAPTimeline>(gsap.timeline());
  const pictures = [pic_1, pic_2, pic_3, pic_4, pic_5];
  const { innerHeight, innerWidth } = window;
  const [scaleValue, setScaleValue] = useState(2);

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
              if (i > 0) {
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
                      gsap.to('.zoom-images', {
                        opacity: 1,
                        duration: 0,
                      });
                    },
                    onComplete: () => {
                      gsap.to('.home-screen', {
                        opacity: 1,
                      });
                      gsap.to('.name-loader', {
                        opacity: 0,
                        pointerEvents: 'none',
                      });

                      const imgConts =
                        document.querySelectorAll('.img-container');
                      imgConts.forEach((cont) => {
                        cont.classList.add('active');
                      });
                    },
                  },
                  '<'
                );
              }
            },
          },
          '>'
        );
    }

    gsap.matchMedia().add('(max-width: 800px)', () => {
      setScaleValue(2.7);
    });
    gsap.matchMedia().add('(min-width: 800px)', () => {
      setScaleValue(2);
    });
  });

  useGSAP(() => {
    const allImages = document.querySelectorAll('.zoom-images');

    const allHeights = document.querySelectorAll('.white-height');

    allImages.forEach((pic, idx) => {
      gsap.to(pic, {
        scale: scaleValue,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: allHeights[idx],
          scrub: 1,
          end: 'bottom bottom',
          start: idx === 0 ? '-150% bottom' : '-60% bottom',
        },
      });
    });

    const revealHome = gsap.timeline().to('.img-container', {
      yPercent: -100,
    });

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

  return (
    <>
      {' '}
      <section className="w-[100%] h-[100%] text-black">
        {/* Loader container */}
        <div className="h-[100vh] fixed inset-0 w-[100vw] flex justify-center items-center text-[48px] bg-white z-[11] overflow-hidden name-loader">
          <div className="text-container absolute overflow-hidden">
            {' '}
            <p className="leading-[100%] split split-name">Williams</p>
            <p className="ml-[100px] leading-[100%] split split-name">Alamu</p>
          </div>
          <div className="text-container absolute  overflow-hidden">
            <p className="text-zoom scale-[0.2] opacity-0 split-descrip mb-[10px] split">
              a creative visual designer
            </p>
          </div>
        </div>

        <div className=" relative images-container w-[100%] h-[100vh]">
          {pictures.map((pic, idx) => {
            return (
              <div
                key={idx}
                className="fixed h-[100vh] w-[100%] flex justify-center  scale-0 items-center img-container"
                style={{ zIndex: idx + 12 }}
              >
                <Image
                  src={pic}
                  className="zoom-images scale-0 h-[912px] w-[912px] min-[1500px]:h-[1500px] min-[1500px]:w-[1500px] object-cover opacity-0 relative"
                  style={{ zIndex: idx + 12 }}
                  alt=""
                />
              </div>
            );
          })}

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

          <HomeScreen />
        </div>
      </section>
    </>
  );
}
