'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { FEATURED_WORKS } from '@/utils/constant';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export default function HomePage() {
  const router = useRouter();

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

    const tl = gsap.timeline({
      defaults: {
        ease: 'ease-in-out-cubic',
      },
    });

    if (imageWrapper && image) {
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

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <PageWrapper showHeader={true} className="pageHome" lenis isHome={false}>
      <section className="pageHome__main">
        <div className="pageHome__main-leftSlot">
          <div className="pageHome__main-workImg cImg-reveal">
            {FEATURED_WORKS.map((work, idx) => {
              return (
                <Image
                  key={idx}
                  width={377}
                  height={500}
                  src={work.img}
                  alt={`${work.title} image`}
                  data-title={work.key}
                  priority
                />
              );
            })}
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
                    className={`pageHome__main-details--listItem cListItem cursor-pointer`}
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
    </PageWrapper>
  );
}
