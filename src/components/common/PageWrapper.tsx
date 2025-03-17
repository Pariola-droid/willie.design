'use client';

import Cursor from '@/lib/cursor';
import { initSplit } from '@/lib/split';
import { useStore } from '@/lib/store';
import { useWorks } from '@/store/works.context';
import { CONTACT_DETAILS } from '@/utils/constant';
import { format } from 'date-fns';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import type { LenisOptions } from 'lenis';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Fragment,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import GlobalError from './GlobalError';
import GlobalLoader from './GlobalLoader';
import { Lenis } from './Lenis';

gsap.registerPlugin(CustomEase);
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');

const ROUTES = [
  {
    path: '/',
    label: 'home',
  },
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
  overflowClass?: string;
}

export default function PageWrapper(props: PageWrapperProps) {
  const pathname = usePathname();
  const { works, error, fetchWorks } = useWorks();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
  const pageMainRef = useRef<HTMLDivElement>(null);
  const menuTextRef = useRef<HTMLSpanElement>(null);
  const closeTextRef = useRef<HTMLSpanElement>(null);
  const navLinksItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileBottomRef = useRef<HTMLDivElement>(null);
  const mobileHeaderRootRef = useRef<HTMLDivElement>(null);
  const mobileHeaderRef = useRef<HTMLDivElement>(null);
  const setIsAnimating = useStore((state) => state.setIsAnimating);

  const {
    backButton,
    children,
    theme = 'dark',
    lenis,
    className,
    showHeader = true,
    overflowClass,
    ...rest
  } = props;

  useEffect(() => {
    gsap.set(mobileHeaderRootRef.current, {
      pointerEvents: 'none',
      height: '0%',
    });
    gsap.set(pageMainRef.current, { filter: 'brightness(1)' });

    // if (menuOpen) {
    //   gsap.set(pageMainRef.current, { filter: 'brightness(0.5)' });
    // }

    // gsap.set(pageMainRef.current, { opacity: '1' });

    gsap.set(mobileHeaderRef.current, { autoAlpha: 0 });
    gsap.set(closeTextRef.current, { autoAlpha: 0 });
    gsap.set(menuTextRef.current, { autoAlpha: 1 });
    gsap.set(navLinksItemsRef.current, { y: 30, autoAlpha: 0 });
    gsap.set(mobileBottomRef.current, { y: 20, autoAlpha: 0 });

    menuAnimation.current = gsap
      .timeline({ paused: true })
      .to(mobileHeaderRootRef.current, {
        height: '100%',
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'ease-in-out-cubic',
      })
      .to(
        pageMainRef.current,
        {
          filter: 'brightness(0.5)',
          // opacity: 0.5,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '<'
      )
      .to(
        mobileHeaderRef.current,
        {
          autoAlpha: 1,
          duration: 0.6,
          ease: 'ease-in-out-cubic',
        },
        '<0.2'
      )
      .to(
        menuTextRef.current,
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '<0.1'
      )
      .to(
        closeTextRef.current,
        {
          autoAlpha: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '<0.15'
      )
      .to(
        navLinksItemsRef.current,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '<0.2'
      )
      .to(
        mobileBottomRef.current,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '<0.2'
      );

    return () => {
      menuAnimation.current?.kill();
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    if (!menuAnimation.current) return;
    setIsAnimating(true);

    if (menuOpen) {
      console.log('toggleMenu', menuOpen);
      menuAnimation.current.reverse().eventCallback('onReverseComplete', () => {
        setMenuOpen(false);
        setIsAnimating(false);
      });
    } else {
      setMenuOpen(true);
      console.log('toggleMenu', menuOpen);
      menuAnimation.current.play().eventCallback('onComplete', () => {
        setIsAnimating(false);
      });
    }
  };

  useEffect(() => {
    if (menuOpen && menuAnimation.current) {
      menuAnimation.current.reverse().eventCallback('onReverseComplete', () => {
        setMenuOpen(false);
        setIsAnimating(false);
      });
    }
  }, [pathname]);

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

  return (
    <div className={`wp ${overflowClass}`}>
      <GlobalLoader />
      {error && <GlobalError error={error} resetError={fetchWorks} />}

      {showHeader && (
        <header
          wp-theme={(menuOpen && 'dark') || theme}
          className="wp__pageHeader"
        >
          <button
            aria-label="menu"
            onClick={toggleMenu}
            className="wp__pageHeader-menuBtn"
          >
            <span ref={menuTextRef}>menu</span>
            <span ref={closeTextRef}>close</span>
          </button>

          <ul className="wp__pageHeader-navLinks">
            {backButton ? (
              <li>
                <Link href="/works">back</Link>
              </li>
            ) : (
              <Fragment>
                {ROUTES.slice(1, 4).map((route, i) => (
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

      <div className="wp__mobileHeaderRoot" ref={mobileHeaderRootRef}>
        <div className="wp__mobileHeader" ref={mobileHeaderRef}>
          <ul className="wp__mobileHeader-navLinks">
            {ROUTES.map((route, i) => (
              <li
                key={`${route.path}-${i}`}
                className={pathname === route.path ? 'active' : ''}
              >
                <div
                  ref={(el) => {
                    navLinksItemsRef.current[i] = el;
                  }}
                >
                  <Link href={route.path}>{route.label}</Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="wp__mobileHeader-bottom" ref={mobileBottomRef}>
            <small>©{format(new Date(), 'yyyy')}</small>
            <div className="wp__mobileHeader--socials">
              <p>socials:</p>
              <ul className="wp__mobileHeader--socialsList">
                {CONTACT_DETAILS[1].links.slice(0, 3).map((link: any, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      link-interaction="underline"
                      target="_blank"
                      rel="noopener"
                    >
                      {link.shortLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <main className={`${className} main-main`} {...rest} ref={pageMainRef}>
        {children}

        <script>
          {`document.documentElement.setAttribute('data-theme', '${theme}');`}
        </script>
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
