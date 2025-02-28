'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { format } from 'date-fns';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import Image from 'next/image';
import { useEffect } from 'react';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

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

  useEffect(() => {
    const titleItem = document.querySelectorAll('.cTitleItem');
    const listItems = document.querySelectorAll('.cListItem');

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

    const tl = gsap.timeline({
      defaults: {
        ease: 'ease-in-out-cubic',
      },
    });

    if (imageWrapper && image) {
      gsap.set(imageWrapper, {
        clipPath: 'inset(100% 0 0 0)',
      });

      gsap.set(image, {
        filter: 'brightness(20%)',
        scale: 1.4,
      });

      gsap.set(revealWrappers, {
        autoAlpha: 1,
      });

      gsap.set('.pageContact__footer small', {
        autoAlpha: 0,
        x: -10,
      });

      gsap.set(['.cTitleItem', '.cListItem'], {
        y: 40,
        autoAlpha: 0,
        transformStyle: 'preserve-3d',
      });

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
          '.pageContact__footer small',
          {
            autoAlpha: 0.4,
            x: 0,
            stagger: 0.1,
            duration: 0.6,
          },
          '-=0.8'
        );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <PageWrapper className="pageContact" lenis>
      <section className="pageContact__main animate-on-enter">
        <div className="pageContact__main-contactImg cImg-reveal">
          <Image
            width={377}
            height={500}
            src="/images/contact/telephone.png"
            alt="telephone image"
          />
        </div>
        <div className="pageContact__main-details">
          <h4 className="pageContact__main-details--title cTitleItem">
            Let&apos;s collaborate and make good work together
          </h4>

          {CONTACT_DETAILS.map((contact, i: number) => (
            <div key={i} className={`pageContact__main-details--list`}>
              <div className="pageContact__main-details--listTitle cTitleItem">
                {contact.title}:
              </div>
              {contact.links.map((link, j: number) => (
                <p
                  key={j}
                  className={`pageContact__main-details--listItem ${contact.title} cListItem`}
                >
                  {contact.title !== 'email' ? <span>({j + 1})</span> : ''}
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

      <div className="pageContact__footer animate-on-enter">
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
        <small>&copy;{format(new Date(), 'yyy')}. All rights reserved</small>
      </div>
    </PageWrapper>
  );
}
