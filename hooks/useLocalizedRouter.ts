import { useRouter as useNextRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export function useLocalizedRouter() {
  const router = useNextRouter();
  const { language } = useLanguage();

  const getLocalizedHref = (href: string) => {
    let localizedHref = href;
    if (typeof href === 'string' && href.startsWith('/')) {
      if (language === 'ar' && !href.startsWith('/ar')) {
        localizedHref = href === '/' ? '/ar' : `/ar${href}`;
      } else if (language === 'en' && href.startsWith('/ar')) {
        localizedHref = href.replace(/^\/ar/, '') || '/';
      }
    }
    return localizedHref;
  };

  return {
    ...router,
    push: (href: string, options?: any) => {
      router.push(getLocalizedHref(href), options);
    },
    replace: (href: string, options?: any) => {
      router.replace(getLocalizedHref(href), options);
    },
    prefetch: (href: string, options?: any) => {
      router.prefetch(getLocalizedHref(href), options);
    }
  };
}
