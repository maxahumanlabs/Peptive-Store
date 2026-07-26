'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnchorHTMLAttributes, forwardRef } from 'react';

type LinkProps = NextLinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>;

export const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    const { language } = useLanguage();
    
    let localizedHref = href;
    if (typeof href === 'string' && href.startsWith('/')) {
      if (language === 'ar' && !href.startsWith('/ar')) {
        localizedHref = href === '/' ? '/ar' : `/ar${href}`;
      } else if (language === 'en' && href.startsWith('/ar')) {
        localizedHref = href.replace(/^\/ar/, '') || '/';
      }
    }

    return (
      <NextLink href={localizedHref} ref={ref} {...props}>
        {children}
      </NextLink>
    );
  }
);

LocalizedLink.displayName = 'LocalizedLink';

export default LocalizedLink;
