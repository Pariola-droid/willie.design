'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';
import { useState } from 'react';

gsap.registerPlugin(Flip);

export default function CaseStudyPage() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isVertical, setIsVertical] = useState<Boolean>(true);

  return (
    <>
      <PageWrapper
        theme="light"
        className={`pageWorks`}
        style={{ backgroundColor: bgColor }}
        lenis={{}}
      ></PageWrapper>
    </>
  );
}
