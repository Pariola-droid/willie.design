'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { useStore } from '@/lib/store';
import { gsap } from 'gsap';
import { CSSRulePlugin } from 'gsap/dist/CSSRulePlugin';
import { CustomEase } from 'gsap/dist/CustomEase';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger, CustomEase, CSSRulePlugin);

export default function InfoPage() {
  const { basicFormat } = useCurrentTime();
  const setIsAnimating = useStore((state) => state.setIsAnimating);

  CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
  CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

  useEffect(() => {
    gsap.set('.middleFace', {
      clipPath: 'inset(100% 0 0 0)',
    });

    gsap.set('.middleFace img', {
      filter: 'brightness(20%)',
      scale: 1.4,
    });

    gsap.set(['.pageInfo__hero-faceCaption'], {
      autoAlpha: 0,
      y: -10,
    });

    gsap.set('.pageInfo__hero-bottomBar small', {
      autoAlpha: 0,
      x: -10,
    });

    setIsAnimating(true);
    document.documentElement.style.setProperty('--cursor', 'wait');

    const heroTl = gsap.timeline({
      defaults: {
        ease: 'ease-in-out-cubic',
      },
      onComplete: () => {
        setIsAnimating(false);
        document.documentElement.style.setProperty('--cursor', 'auto');
      },
    });

    heroTl
      .to('.middleFace', {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
      })
      .to(
        '.middleFace img',
        {
          scale: 1,
          filter: 'brightness(100%)',
          duration: 1.2,
        },
        '<'
      )
      .to(
        [
          '.pageInfo__hero-faceCaption.a',
          '.pageInfo__hero-faceCaption.b',
          '.pageInfo__hero-faceCaption.c',
        ],
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
        },
        '-=0.5'
      )
      .to(
        '.pageInfo__hero-bottomBar small',
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.6,
        },
        '-=0.3'
      );

    return () => {
      setIsAnimating(false);
      document.documentElement.style.setProperty('--cursor', 'auto');
      heroTl.kill();
    };
  }, [setIsAnimating]);

  useEffect(() => {
    const serviceTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.pageInfo__services',
        start: 'top 95%',
        // toggleActions: 'play none none reverse',
      },
    });

    gsap.set("[data-animation='service-title']", {
      autoAlpha: 0,
      y: 20,
    });

    gsap.set(
      [
        '.pageInfo__services-leftSlot .list li',
        '.pageInfo__services-rightSlot--row:first-child .list li',
        '.pageInfo__services-rightSlot--row:last-child .shrinkList',
      ],
      {
        autoAlpha: 0,
        y: 20,
      }
    );

    serviceTl.to("[data-animation='service-title']", {
      autoAlpha: 1,
      y: 10,
      duration: 0.4,
      stagger: 0.2,
      ease: 'power2.out',
    });

    serviceTl.to(
      [
        '.pageInfo__services-leftSlot .list li',
        '.pageInfo__services-rightSlot--row:first-child .list li',
        '.pageInfo__services-rightSlot--row:last-child .shrinkList',
      ],
      {
        autoAlpha: 1,
        y: 10,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    return () => {
      serviceTl.kill();
    };
  }, []);

  useEffect(() => {
    const footerReachout = gsap.utils.toArray('.reach-out');

    footerReachout.forEach((reachout: any) => {
      gsap.set(reachout, {
        autoAlpha: 0,
        y: 20,
      });

      gsap.to(reachout, {
        autoAlpha: 1,
        y: 10,
        duration: 1,
        stagger: 0.25,
        ease: 'ease-in-out-circ',
        scrollTrigger: {
          trigger: reachout,
          start: 'top 80%',
          end: 'top 20%',
          // toggleActions: 'play none none reverse',
        },
      });
    });

    const footerPhotos = gsap.utils.toArray('.iImg-reveal');

    footerPhotos.forEach((image: any, i) => {
      const img = image.querySelector('img');
      const mask = image;

      gsap.set(img, {
        // scale: 0.9,
        filter: 'brightness(40%)',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: image,
          start: 'top 120%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          // markers: true,
        },
      });

      tl.to(img, {
        // scale: 1,
        filter: 'brightness(100%)',
        duration: 1,
        ease: 'ease-in-out-cubic',
      }).fromTo(
        mask,
        {
          clipPath: 'inset(100% 0 0 0)',
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'ease-in-out-cubic',
        },
        '-=1.0'
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <PageWrapper theme="dark" className="pageInfo" lenis>
      <section className="pageInfo__hero">
        <div className="pageInfo__hero-middleFace">
          <div className="pageInfo__hero-middleFaceImg middleFace">
            <Image
              width={250}
              height={330}
              src="/images/info/me.png"
              alt="willie's face"
            />
          </div>

          <span className="pageInfo__hero-faceCaption a">meet</span>
          <span className="pageInfo__hero-faceCaption b">williams</span>
          <span className="pageInfo__hero-faceCaption c">Dsgnr</span>
        </div>
        <div className="pageInfo__hero-largeTxt">Folio</div>

        <div className="pageInfo__hero-bottomBar">
          <small>creative designer</small>
          <small>CR7 fanboy</small>
          <small>scroll</small>
        </div>
      </section>

      <section className="pageInfo__aboutMe">
        <div
          className="pageInfo__aboutMe--paragraph"
          data-animation="skew-heading"
        >
          Hey, I’m Williams A. a creative designer with keen interest in design.
          I’m driven by the art of bringing ideas to life through crafted
          visuals and fluid motion. My dedication to playing with colours,
          composition, typography, and intricate details ensures that
          <br />
          every creation is memorable.{' '}
        </div>
        <div
          className="pageInfo__aboutMe--paragraph"
          data-animation="skew-heading"
        >
          <span />
          With interest in art, entertainment, tech, and sports, I spend my free
          time playing football, indulging in photography, and exploring new
          places and foods. I currently design for both small and big brands @{' '}
          <a href="#0" link-interaction="underline">
            Balky Studio
          </a>
        </div>
      </section>

      <section className="pageInfo__services">
        <div className="pageInfo__services-leftSlot">
          <p
            className="pageInfo__services-leftSlot title"
            data-animation="service-title"
          >
            Services
          </p>
          <ul className="pageInfo__services-leftSlot list">
            <li>Creative Direction</li>
            <li>Art Direction</li>
            <li>Website Design</li>
            <li>Editorial Design</li>
            <li>eCommerce</li>
            <li>Product Design</li>
            <li>Motion</li>
            <li>Prototyping</li>
            <li>3d</li>
          </ul>
        </div>

        <div className="pageInfo__services-rightSlot">
          <div className="pageInfo__services-rightSlot--row">
            <p
              className="pageInfo__services-rightSlot title"
              data-animation="service-title"
            >
              Accolades
            </p>
            <ul className="pageInfo__services-rightSlot list">
              <li>Young Jury Awwwards ‘24</li>
              <li>Site of the Day x1</li>
              <li>Honorable Mention x4</li>
            </ul>
          </div>

          <div className="pageInfo__services-rightSlot--row">
            <p
              className="pageInfo__services-rightSlot title"
              data-animation="service-title"
            >
              Select clients
            </p>
            <p className="pageInfo__services-rightSlot shrinkList">
              Vana, Paystack, Bondir, Vesyl,
              <br /> TSM, Nomba
            </p>
          </div>
        </div>
      </section>

      <div className="pageInfo__footer">
        <div className="pageInfo__footer-reachOut">
          <div
            className="pageInfo__footer-reachOut--location reach-out"
            data-animation="reach-out"
          >
            Based in <span link-interaction="underline">Lagos, NG</span>.{' '}
            <span>{basicFormat}</span>
            <br /> Working globally.
          </div>
          <div
            className="pageInfo__footer-reachOut--contact reach-out"
            data-animation="reach-out"
          >
            Work inquires:{' '}
            <a href="#0" link-interaction="underline">
              williedsgnr@gmail.com
            </a>
            <br />{' '}
            <a href="#0" link-interaction="underline">
              Instagram
            </a>
            ,{' '}
            <a href="#0" link-interaction="underline">
              X
            </a>
            ,{' '}
            <a href="#0" link-interaction="underline">
              Are.na
            </a>
            ,{' '}
            <a href="#0" link-interaction="underline">
              Dribbble
            </a>
          </div>
          <div
            className="pageInfo__footer-reachOut--credit"
            data-animation="reach-out"
          >
            build by:{' '}
            <a href="#0" link-interaction="underline">
              Pariola
            </a>
          </div>
        </div>

        <div className="pageInfo__footer-photos">
          <div className="pageInfo__footer-photos img3 iImg-reveal">
            <Image
              width={218}
              height={127}
              src="/images/info/image-a.png"
              alt="willie's face"
            />
          </div>

          <div className="pageInfo__footer-photos img2 iImg-reveal">
            <Image
              width={258}
              height={200}
              src="/images/info/image-b.png"
              alt="willie's face"
            />
          </div>
          <div className="pageInfo__footer-photos img1 iImg-reveal">
            <Image
              width={337}
              height={355}
              src="/images/info/image-c.png"
              alt="willie's face"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
