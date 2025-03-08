import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { forwardRef } from 'react';
import { Work } from '../../../sanity.types';
import { LAYOUT_SECONDARY } from './MainCaseStudyPage';

interface CaseStudyImageProps {
  currentWork: Work;
  position: string;
  layoutType?: string;
  width: number;
  height: number;
  index: number;
}

const CaseStudyImage = forwardRef<HTMLDivElement | null, CaseStudyImageProps>(
  ({ currentWork, position, layoutType, width, height, index }, ref) => {
    const getImageForPosition = (position: string) => {
      if (!currentWork || !currentWork.caseStudyImages) return null;
      return (
        currentWork.caseStudyImages.find((img) => img.position === position) ||
        null
      );
    };

    const image = getImageForPosition(position);

    if (!image) return null;

    return (
      <div
        className={`pageCaseStudy__gallery--img${['One', 'Two', 'Three', 'Four'][index]}Img parallax-image
          ${layoutType === LAYOUT_SECONDARY ? 'layout_s' : ''}
        `}
        ref={ref}
      >
        <Image
          src={urlFor(image).quality(100).url()}
          alt={image.alt || 'case study image'}
          //@ts-ignore
          placeholder={image.asset?.metadata?.lqip ? 'blur' : undefined}
          //@ts-ignore
          blurDataURL={image.asset?.metadata?.lqip || undefined}
          quality={100}
          width={width}
          height={height}
        />
      </div>
    );
  }
);

CaseStudyImage.displayName = 'CaseStudyImage';
export default CaseStudyImage;
