'use client';

// import LoaderHome from '@/components/LoaderHome';
import PageWrapper from '@/components/common/PageWrapper';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

interface IFeaturedWork {
  id: number;
  title: string;
  key: string;
  img: string;
}

export default function HomePage() {
  // const router = useRouter();
  // const [activeWork, setActiveWork] = useState<IFeaturedWork | null>(null);
  // const imageWrapperRef = useRef<HTMLDivElement>(null);
  // const imagesRef = useRef<{ [key: string]: HTMLImageElement | null }>({});

  // useEffect(() => {
  //   const titleItem = document.querySelectorAll('.cTitleItem');
  //   const listItems = document.querySelectorAll('.cListItem');
  //   const listLine = document.querySelectorAll('.cListLine');

  //   titleItem.forEach((item) => {
  //     const wrapper = document.createElement('div');
  //     wrapper.className = 'cText-wrapper';
  //     item.parentNode?.insertBefore(wrapper, item);
  //     wrapper.appendChild(item);
  //   });

  //   listItems.forEach((item) => {
  //     const wrapper = document.createElement('div');
  //     wrapper.className = 'cText-wrapper';
  //     item.parentNode?.insertBefore(wrapper, item);
  //     wrapper.appendChild(item);
  //   });

  //   const imageWrapper = document.querySelector('.cImg-reveal');
  //   const image = imageWrapper?.querySelector('img');
  //   const revealWrappers = gsap.utils.toArray('.cText-wrapper');

  //   if (imageWrapper && image) {
  //     gsap.set(imageWrapper, {
  //       clipPath: 'inset(100% 0 0 0)',
  //     });

  //     gsap.set(image, {
  //       filter: 'brightness(20%)',
  //       scale: 1.4,
  //     });
  //   }

  //   gsap.set(revealWrappers, {
  //     autoAlpha: 1,
  //   });

  //   gsap.set('.pageHome__footer small', {
  //     autoAlpha: 0,
  //     x: -10,
  //   });

  //   gsap.set('.cListLine', {
  //     scaleY: 0,
  //     transformOrigin: 'top left',
  //     autoAlpha: 0,
  //   });

  //   gsap.set(['.cTitleItem', '.cListItem'], {
  //     y: 40,
  //     autoAlpha: 0,
  //     transformStyle: 'preserve-3d',
  //   });

  //   const tl = gsap.timeline({
  //     defaults: {
  //       ease: 'ease-in-out-cubic',
  //     },
  //   });

  //   if (imageWrapper && image) {
  //     tl.to(imageWrapper, {
  //       clipPath: 'inset(0% 0 0 0)',
  //       duration: 1.2,
  //     })
  //       .to(
  //         image,
  //         {
  //           scale: 1,
  //           filter: 'brightness(100%)',
  //           duration: 1.2,
  //         },
  //         '<'
  //       )
  //       .to(
  //         listLine,
  //         {
  //           scaleY: 1,
  //           duration: 1.2,
  //           autoAlpha: 1,
  //           stagger: 0.05,
  //         },
  //         '-=1.1'
  //       )
  //       .to(
  //         ['.cTitleItem', '.cListItem'],
  //         {
  //           y: 0,
  //           autoAlpha: 1,
  //           stagger: 0.05,
  //           duration: 0.8,
  //           ease: 'power2.out',
  //         },
  //         '-=0.5'
  //       )
  //       .to(
  //         '.pageHome__footer small',
  //         {
  //           autoAlpha: 0.4,
  //           x: 0,
  //           stagger: 0.1,
  //           duration: 0.6,
  //         },
  //         '-=0.8'
  //       );
  //   }

  //   setActiveWork(FEATURED_WORKS[0]);

  //   FEATURED_WORKS.forEach((work, index) => {
  //     if (index === 0) {
  //       gsap.set(imagesRef.current[work.key], {
  //         autoAlpha: 1,
  //         position: 'relative',
  //         zIndex: 2,
  //       });
  //     } else {
  //       gsap.set(imagesRef.current[work.key], {
  //         autoAlpha: 0,
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         zIndex: 1,
  //       });
  //     }
  //   });

  //   return () => {
  //     tl.kill();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!activeWork || !imageWrapperRef.current) return;

  //   FEATURED_WORKS.forEach((work) => {
  //     if (work.key !== activeWork.key && imagesRef.current[work.key]) {
  //       gsap.to(imagesRef.current[work.key], {
  //         autoAlpha: 0,
  //         duration: 0.5,
  //         ease: 'power2.out',
  //         zIndex: 1,
  //       });
  //     }
  //   });

  //   if (imagesRef.current[activeWork.key]) {
  //     gsap.to(imagesRef.current[activeWork.key], {
  //       autoAlpha: 1,
  //       duration: 0.5,
  //       ease: 'power2.in',
  //       zIndex: 2,
  //     });
  //   }
  // }, [activeWork]);

  return (
    <PageWrapper
      showHeader={true}
      className="pageHome loader relative images-container w-[100%] h-[100vh]"
      lenis
      overflowClass="loader"
    ></PageWrapper>
  );
}
