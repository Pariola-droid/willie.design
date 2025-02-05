'use client';

import Cursor from '@/lib/cursor';
import { initSplit } from '@/lib/split';
import type { LenisOptions } from 'lenis';
import { usePathname } from 'next/navigation';
import { Fragment, PropsWithChildren, useEffect, useRef } from 'react';
import { Lenis } from './Lenis';

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
  const lenisRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
    initSplit();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [pathname, theme]);

  return (
    <div className="wp">
      {showHeader && (
        <header wp-theme={theme} className="wp__pageHeader">
          <ul className="wp__pageHeader-navLinks">
            {backButton ? (
              <li>
                <a href="/works">back</a>
              </li>
            ) : (
              <Fragment>
                {ROUTES.map((route, i) => (
                  <li
                    key={`${route.path}-${i}`}
                    className={pathname === route.path ? 'active' : ''}
                  >
                    <a href={route.path}>{route.label}</a>
                  </li>
                ))}
              </Fragment>
            )}
          </ul>

          <a href="/" className="wp__pageHeader-bigText">
            <h1>Archive Of Selected</h1>
            <h1>
              Works <sup>&apos;21—2024</sup>
            </h1>
          </a>
        </header>
      )}
      <main className={className} {...rest}>
        {children}
        <script>
          {`document.documentElement.setAttribute('data-theme', '${theme}');`}
        </script>
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
