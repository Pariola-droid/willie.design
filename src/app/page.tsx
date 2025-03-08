'use client';

import PageWrapper from '@/components/common/PageWrapper';
import LoaderHome from '@/components/LoaderHome';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(CustomEase);

CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

export default function HomePage() {
  const router = useRouter();

  return (
    <PageWrapper showHeader={true} className="pageHome" lenis isHome={true}>
      <LoaderHome />
      {/* <HomeScreen /> */}
    </PageWrapper>
  );
}

{
  /* <section className="pageHome__main">
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
      </section> */
}
