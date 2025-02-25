'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { format } from 'date-fns';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { useRouter } from 'next/navigation';

const REELS_DATA = [
  {
    id: 1,
    title: 'balky',
    img: '/images/home/a.png',
  },
  {
    id: 2,
    title: 'athena',
    img: '/images/home/b.png',
  },
  {
    id: 3,
    title: 'candy',
    img: '/images/home/c.png',
  },
  {
    id: 4,
    title: 'dandy',
    img: '/images/home/d.png',
  },
  {
    id: 5,
    title: 'eagle',
    img: '/images/home/a.png',
  },
  {
    id: 6,
    title: 'fancy',
    img: '/images/home/c.png',
  },
  {
    id: 7,
    title: 'giant',
    img: '/images/home/b.png',
  },
  {
    id: 8,
    title: 'honey',
    img: '/images/home/d.png',
  },
  {
    id: 9,
    title: 'indigo',
    img: '/images/home/b.png',
  },
  {
    id: 10,
    title: 'jolly',
    img: '/images/home/a.png',
  },
];

const SLIDE_DURATION = 5;
gsap.registerPlugin(CustomEase);

CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export default function HomePage() {
  const router = useRouter();

  return (
    <PageWrapper showHeader={false} className="pageHome" lenis>
      <section className="pageHome__main">
        <div className="pageHome__main--overlay">
          <div className="pageHome__main--overlayTop">
            <p>show.reelz</p>
          </div>

          <div className="pageHome__main--overlayBottom">
            <h2>
              Williams Alamu’s digital portfolio archived works : ‘21—
              {format(new Date(), 'yyy')}
            </h2>
            <button onClick={() => router.push('/works')}>
              <p>
                ↳ <span link-interaction="underline">enter site</span>
              </p>
            </button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
