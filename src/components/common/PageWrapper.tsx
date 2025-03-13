'use client';

import Cursor from '@/lib/cursor';
import { initSplit } from '@/lib/split';
import { useWorks } from '@/store/works.context';
import { format } from 'date-fns';
import type { LenisOptions } from 'lenis';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, PropsWithChildren, useEffect, useRef } from 'react';
import GlobalError from './GlobalError';
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
  isHome?: boolean;
}

export default function PageWrapper(props: PageWrapperProps) {
  const pathname = usePathname();
  const { works, isLoading, error, fetchWorks } = useWorks();

  const lenisRef = useRef<HTMLDivElement>(null);

  const {
    backButton,
    children,
    theme = 'dark',
    lenis,
    className,
    showHeader = true,
    isHome,
    ...rest
  } = props;

  useEffect(() => {
    initSplit();

    const cursor = new Cursor({
      container: 'body',
      speed: 0.7,
      ease: 'expo.out',
      visibleTimeout: 300,
    });
  }, []);

  useEffect(() => {
    if (works.length < 1) {
      fetchWorks();
    }
  }, [works.length, fetchWorks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [pathname, theme]);

  const shouldShowLoader =
    isLoading &&
    (pathname === '/works' ||
      (pathname.startsWith('/works/') && pathname !== '/works'));

  return (
    <div className={`${!isHome ? 'wp' : ''}`}>
      {/* {isLoading && <GlobalLoader isLoading={isLoading} message="Loading..." />} */}
      {error && <GlobalError error={error} resetError={fetchWorks} />}

      {showHeader && (
        <header wp-theme={theme} className="wp__pageHeader">
          <button aria-label="menu" className="wp__pageHeader-menuBtn">
            menu
          </button>

          <ul className="wp__pageHeader-navLinks">
            {backButton ? (
              <li>
                <Link href="/works">back</Link>
              </li>
            ) : (
              <Fragment>
                {ROUTES.map((route, i) => (
                  <li
                    key={`${route.path}-${i}`}
                    className={pathname === route.path ? 'active' : ''}
                  >
                    <Link href={route.path}>{route.label}</Link>
                  </li>
                ))}
              </Fragment>
            )}
          </ul>

          <Link href="/" className="wp__pageHeader-bigText">
            <h1>Archive Of Selected</h1>
            <h1>
              Works <sup>&apos;21—{format(new Date(), 'yyy')}</sup>
            </h1>
          </Link>
        </header>
      )}
      <main className={`${className}`} {...rest}>
        {children}

        <script>
          {`document.documentElement.setAttribute('data-theme', '${theme}');`}
        </script>
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
