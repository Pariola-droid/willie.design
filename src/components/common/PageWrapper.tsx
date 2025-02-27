'use client';

import Cursor from '@/lib/cursor';
import { initSplit } from '@/lib/split';
import { format } from 'date-fns';
import type { LenisOptions } from 'lenis';
import { usePathname } from 'next/navigation';
import { Fragment, PropsWithChildren, useEffect, useRef } from 'react';
import { Lenis } from './Lenis';
import TransitionLink from './TransitionLink';
import { useTransition } from './TransitionProvider';

const ROUTES = [
  {
    path: '/works',
    label: 'works',
  },
  {
    path: '/info',
    label: 'info',
  },
  {
    path: '/contact',
    label: 'contact',
  },
];

interface PageWrapperProps extends PropsWithChildren {
  backButton?: boolean;
  theme?: 'dark' | 'light';
  lenis?: boolean | LenisOptions;
  className: string;
  style?: React.CSSProperties;
  showHeader?: boolean;
}

export default function PageWrapper(props: PageWrapperProps) {
  const { isTransitioning, completedInitialLoad } = useTransition();

  const lenisRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const {
    backButton,
    children,
    theme = 'dark',
    lenis,
    className,
    showHeader = true,
    ...rest
  } = props;

  const cursor = new Cursor({
    container: 'body',
    speed: 0.7,
    ease: 'expo.out',
    visibleTimeout: 300,
  });

  useEffect(() => {
    if (!isTransitioning && completedInitialLoad) {
      initSplit();
    }
  }, [isTransitioning, completedInitialLoad]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [pathname, theme]);

  useEffect(() => {
    if (!isTransitioning && completedInitialLoad && pageContainerRef.current) {
      setTimeout(() => {
        pageContainerRef.current?.classList.add('page-ready');
      }, 100);
    }
  }, [isTransitioning, completedInitialLoad]);

  return (
    <div className="wp" ref={pageContainerRef}>
      {showHeader && (
        <header wp-theme={theme} className="wp__pageHeader">
          <ul className="wp__pageHeader-navLinks">
            {backButton ? (
              <li>
                <TransitionLink href="/works">back</TransitionLink>
              </li>
            ) : (
              <Fragment>
                {ROUTES.map((route, i) => (
                  <li
                    key={`${route.path}-${i}`}
                    className={pathname === route.path ? 'active' : ''}
                  >
                    <TransitionLink href={route.path}>
                      {route.label}
                    </TransitionLink>
                  </li>
                ))}
              </Fragment>
            )}
          </ul>

          <TransitionLink href="/" className="wp__pageHeader-bigText">
            <h1>Archive Of Selected</h1>
            <h1>
              Works <sup>&apos;21—{format(new Date(), 'yyy')}</sup>
            </h1>
          </TransitionLink>
        </header>
      )}
      <main
        className={`${className} ${isTransitioning ? 'is-transitioning' : ''}`}
        {...rest}
      >
        {children}
        <script>
          {`document.documentElement.setAttribute('data-theme', '${theme}');`}
        </script>
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
