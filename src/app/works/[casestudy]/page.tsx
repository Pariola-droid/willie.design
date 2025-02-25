'use client';

import PageWrapper from '@/components/common/PageWrapper';
import Image from 'next/image';
import { useState } from 'react';

export default function CaseStudyPage() {
  const [bgColor, setBgColor] = useState('#ffffff');

  return (
    <PageWrapper
      theme="light"
      backButton
      className={`pageCaseStudy`}
      style={{ backgroundColor: bgColor }}
      lenis={{}}
    >
      <section className="pageCaseStudy__hero">
        <h2>Chosen By God - Apparel</h2>
        <div className="pageCaseStudy__hero-imgWrapper">
          <div className="pageCaseStudy__hero-imgWrapper--img">
            <Image
              src="/images/casestudy/cover-img-w.png"
              alt="work cover image"
              width={1166}
              height={700}
            />
          </div>
          <div className="pageCaseStudy__hero-imgWrapper--imgCaption">
            <p>2024</p>
            <p>ART DIRECTION, WEBSITE DESIGN</p>
            <p>CONCEPT</p>
          </div>
        </div>
        <div className="pageCaseStudy__hero-descWrapper">
          <p>
            Balky Studio is a digital creative studio Crafting immersive digital
            experiences for brands. Studio is a digital creative studio Crafting
            immersive digital experiences for brands.
          </p>
          <p>
            <span>↳</span>
            <a href="/works/aria-amara">view live</a>
          </p>
        </div>
      </section>

      <section className="pageCaseStudy__gallery">
        <div className="pageCaseStudy__gallery--imgOne">
          <div className="pageCaseStudy__gallery--imgOneImg">
            <Image
              src="/images/casestudy/w-img-a.png"
              alt="work cover image"
              width={575}
              height={427}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgTwo">
          <div className="pageCaseStudy__gallery--imgTwoImg">
            <Image
              src="/images/casestudy/w-img-b.png"
              alt="work cover image"
              width={694}
              height={750}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgThree">
          <div className="pageCaseStudy__gallery--imgThreeImg">
            <Image
              src="/images/casestudy/w-img-c.png"
              alt="work cover image"
              width={238}
              height={175}
            />
          </div>
        </div>

        <div className="pageCaseStudy__gallery--imgFour">
          <div className="pageCaseStudy__gallery--imgFourImg">
            <Image
              src="/images/casestudy/w-img-d.png"
              alt="work cover image"
              width={456}
              height={350}
            />
          </div>
        </div>
      </section>

      <section className="pageCaseStudy__moreDetails">
        <h3>More Details</h3>
        <div className="pageCaseStudy__moreDetails--credit">
          <div className="pageCaseStudy__moreDetails--creditCol">
            <div className="pageCaseStudy__moreDetails--creditLabel">
              Collab
            </div>
            <div className="pageCaseStudy__moreDetails--creditContent">
              Carter Ogunsola, Dev
            </div>
          </div>

          <div className="pageCaseStudy__moreDetails--creditCol">
            <div className="pageCaseStudy__moreDetails--creditLabel">
              Accolades
            </div>
            <div className="pageCaseStudy__moreDetails--creditContent">
              <p>Awwwards, Honourable Mention</p>
              <p>CSSDA, Site of The Day</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pageCaseStudy__nextProject">
        <div className="pageCaseStudy__nextProject--CTA">
          <div className="pageCaseStudy__nextProject--leftSlot">
            <div className="pageCaseStudy__nextProject--img">
              <Image
                src="/images/casestudy/next-w.png"
                alt="work cover image"
                width={218}
                height={143}
              />
            </div>
            <div className="pageCaseStudy__nextProject--progress">
              <div className="pageCaseStudy__nextProject--progressBar" />
            </div>
          </div>
          <div className="pageCaseStudy__nextProject--content">
            <p>Next Project</p>
            <h4>Vana X-Team</h4>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
