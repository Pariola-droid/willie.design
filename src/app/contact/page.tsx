'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { initSplit } from '@/lib/split';
import { format } from 'date-fns';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import Image from 'next/image';
import { useEffect } from 'react';

gsap.registerPlugin(CustomEase);

const CONTACT_DETAILS = [
  {
    title: 'email',
    links: [
      {
        label: 'williedsgnr@gmail.com',
        href: 'mailto:williedsgnr@gmail.com',
      },
    ],
  },
  {
    title: 'socials',
    links: [
      {
        label: 'instagram',
        href: 'https://www.instagram.com/williedsgnr/',
      },
      {
        label: 'x (prev twitter)',
        href: 'https://twitter.com/williedsgnr',
      },
      {
        label: 'are.na',
        href: 'https://www.are.na/willie-olwage',
      },
      {
        label: 'dribbble',
        href: 'https://dribbble.com/williedsgnr',
      },
    ],
  },
];

export default function ContactPage() {
  const { gmtFormat } = useCurrentTime();

  CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
  CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

  useEffect(() => {
    initSplit(); // Initialize split text first

    const imageWrapper = document.querySelector('.cImg-reveal');
    const image = imageWrapper?.querySelector('img');

    const tl = gsap.timeline({
      defaults: {
        ease: 'ease-in-out-cubic',
      },
    });

    if (imageWrapper && image) {
      // Initial states
      gsap.set(imageWrapper, {
        clipPath: 'inset(100% 0 0 0)',
      });

      gsap.set(image, {
        filter: 'brightness(20%)',
        scale: 1.4,
      });

      // Animation sequence
      tl.to(imageWrapper, {
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
        // Start text animations when image is 80% done
        .add(() => {
          // Split text animations
          const title = document.querySelector(
            '[data-animation="skew-rotate-heading"]'
          );
          const details = document.querySelectorAll(
            '[data-animation="skew-split-paragraph"]'
          );

          if (title) {
            gsap.to(title.querySelectorAll('.word-line'), {
              autoAlpha: 1,
              rotationX: 0,
              yPercent: 0,
              stagger: 0.1,
              duration: 1.2,
              ease: 'power2.out',
            });
          }

          details.forEach((detail, index) => {
            gsap.to(detail.querySelectorAll('.word'), {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.05,
              duration: 1,
              ease: 'power2.out',
              delay: index * 0.1,
            });
          });
        }, '-=0.3'); // Start text reveal when image is almost done
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <PageWrapper className="pageContact" lenis>
      <section className="pageContact__main">
        <div className="pageContact__main-contactImg cImg-reveal">
          <Image
            width={377}
            height={500}
            src="/images/contact/telephone.png"
            alt="telephone image"
          />
        </div>
        <div className="pageContact__main-details">
          <h4
            className="pageContact__main-details--title opacity-on"
            data-animation="skew-rotate-heading"
          >
            Let&apos;s collaborate and make good work together
          </h4>

          {CONTACT_DETAILS.map((contact, i: number) => (
            <div key={i} className="pageContact__main-details--list opacity-on">
              <small
                className="pageContact__main-details--listTitle"
                data-animation="skew-split-paragraph"
              >
                {contact.title}:
              </small>
              {contact.links.map((link, j: number) => (
                <p
                  key={j}
                  className="pageContact__main-details--listItem"
                  data-animation="skew-split-paragraph"
                >
                  <a
                    href={link.href}
                    link-interaction="underline"
                    target="_blank"
                    rel="noopener"
                  >
                    {link.label}
                  </a>
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="pageContact__footer">
        <small>
          build by:{' '}
          <a
            href="#0"
            link-interaction="underline"
            target="_blank"
            rel="noopener"
          >
            Pariola
          </a>
        </small>
        <small>&copy;{format(new Date(), 'YYY')}. All rights reserved</small>
      </div>
    </PageWrapper>
  );
}
