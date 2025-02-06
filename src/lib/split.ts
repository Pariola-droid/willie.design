import { IO } from '@/utils/observe';
import { gsap } from 'gsap';
import SplitType, { type SplitTypeOptions } from 'split-type';

interface SplitTypeResult {
  lines: HTMLElement[];
  words: HTMLElement[];
  chars: HTMLElement[];
}

function createLineWrapper(
  lineElement: HTMLElement,
  lines: HTMLElement[],
  index: number,
  parentItem: Element
): void {
  const newDiv = document.createElement('div');
  newDiv.classList.add('word-line-wrapper');
  newDiv.appendChild(lineElement);
  lines[index] = newDiv;
  parentItem.appendChild(newDiv);
}

export function initSplit(): void {
  const skewRotateHeading = document.querySelectorAll<HTMLElement>(
    "[data-animation='skew-rotate-heading']"
  );
  const skewHeading = document.querySelectorAll<HTMLElement>(
    "[data-animation='skew-heading']"
  );
  const skewSplitParagraph = document.querySelectorAll<HTMLElement>(
    "[data-animation='skew-split-paragraph']"
  );
  const skewFadeParagraph = document.querySelectorAll<HTMLElement>(
    "[data-animation='skew-fade-paragraph']"
  );

  // Skew Rotate Heading Animation
  skewRotateHeading.forEach((item) => {
    const splitOptions: Partial<SplitTypeOptions> = {
      types: 'lines,words',
      lineClass: 'word-line',
    };

    const line = new SplitType(
      item,
      splitOptions
    ) as unknown as SplitTypeResult;

    line.lines.forEach((lineElement, index) => {
      createLineWrapper(lineElement, line.lines, index, item);
    });

    const initialAnimation = {
      autoAlpha: 0,
      rotateX: -80,
      yPercent: 110,
      transformStyle: 'preserve-3d',
    };

    gsap.set(item.querySelectorAll('.word-line'), initialAnimation);

    IO(item, { threshold: 0.8 }).then(() => {
      const elem = item.querySelectorAll('.word-line');
      gsap.to(elem, {
        autoAlpha: 1,
        rotationX: 0,
        yPercent: 0,
        stagger: elem.length > 100 ? 0.1 : 0.04,
        duration: elem.length > 100 ? 0.8 : 0.8,
        ease: 'easeOut',
      });
    });
  });

  // Skew Heading Animation
  skewHeading.forEach((item) => {
    const line = new SplitType(item, {
      types: 'lines,words',
      lineClass: 'word-line',
    }) as unknown as SplitTypeResult;

    line.lines.forEach((lineElement, index) => {
      createLineWrapper(lineElement, line.lines, index, item);
    });

    const initialAnimation = {
      autoAlpha: 0,
      yPercent: 110,
      transformStyle: 'preserve-3d',
    };

    gsap.set(item.querySelectorAll('.word-line'), initialAnimation);

    IO(item, { threshold: 0.8 }).then(() => {
      const elem = item.querySelectorAll('.word-line');
      gsap.to(elem, {
        autoAlpha: 1,
        yPercent: 0,
        stagger: elem.length > 100 ? 0.05 : 0.1,
        duration: elem.length > 100 ? 1.0 : 1.2,
        ease: 'power2.out',
      });
    });
  });

  // Skew Split Paragraph Animation
  skewSplitParagraph.forEach((item) => {
    const line = new SplitType(item, {
      types: 'lines,words',
      lineClass: 'word-line',
    }) as unknown as SplitTypeResult;

    line.lines.forEach((lineElement, index) => {
      createLineWrapper(lineElement, line.lines, index, item);
    });

    const initialAnimation = {
      autoAlpha: 0,
      yPercent: 60,
      transformStyle: 'preserve-3d',
    };

    gsap.set(item.querySelectorAll('.word-line'), initialAnimation);

    IO(item, { threshold: 0.8 }).then(() => {
      const words = item.querySelectorAll('.word-line');
      gsap.to(words, {
        autoAlpha: 1,
        yPercent: 0,
        stagger: {
          amount: words.length > 100 ? 1 : 0.5,
          from: 'start',
        },
        duration: words.length > 100 ? 0.8 : 1,
        ease: 'power2.out',
      });
    });
  });

  skewFadeParagraph.forEach((item) => {
    const line = new SplitType(item, {
      types: 'lines,words',
      lineClass: 'word-line',
    }) as unknown as SplitTypeResult;

    const initialAnimation = {
      autoAlpha: 0,
      transformStyle: 'preserve-3d',
    };

    gsap.set(item.querySelectorAll('.word'), initialAnimation);

    IO(item, { threshold: 1 }).then(() => {
      const elem = item.querySelectorAll('.word');
      gsap.to(elem, {
        autoAlpha: 1,
        stagger: elem.length > 100 ? 0.1 : 0.05,
        duration: elem.length > 100 ? 0.8 : 1,
        ease: 'easeOut',
      });
    });
  });
}
