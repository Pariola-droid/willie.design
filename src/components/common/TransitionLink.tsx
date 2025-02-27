'use client';

import Link from 'next/link';
import { MouseEvent, ReactNode } from 'react';
import { useTransition } from './TransitionProvider';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  [key: string]: any;
}

export default function TransitionLink({
  href,
  children,
  className = '',
  ariaLabel,
  ...rest
}: TransitionLinkProps) {
  const { startPageTransition } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startPageTransition(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </Link>
  );
}
