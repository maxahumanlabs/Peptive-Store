'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MobileLanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    setLanguage(langCode);

    if (pathname) {
      if (langCode === 'ar' && !pathname.startsWith('/ar')) {
        router.push(`/ar${pathname}`);
      } else if (langCode === 'en' && pathname.startsWith('/ar')) {
        router.push(pathname.replace(/^\/ar/, '') || '/');
      }
    }
  };

  return (
    <div className="language-toggle">
      <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            language === 'en'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-current={language === 'en' ? 'true' : undefined}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            language === 'ar'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-current={language === 'ar' ? 'true' : undefined}
          aria-label="Switch to العربية"
        >
          AR
        </button>
      </div>
    </div>
  );
}
