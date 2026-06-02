'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import CountrySelector from '@/components/CountrySelector';
import LanguageSelector from '@/components/LanguageSelector';

export default function AnnouncementBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#1f1f1f] text-white py-4 md:py-2 lg:py-2 px-6 sm:px-2 lg:px-12 relative z-50">
      <div className="flex items-center justify-between">
        {/* Country Selector - Left (Both hidden on mobile) */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="hidden md:block">
            <CountrySelector />
          </div>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>
        
        {/* Announcement Message - Center */}
        <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
          <p className="text-xs font-medium tracking-wider uppercase px-1 whitespace-nowrap">{t('announcement_bar')}</p>
        </div>
      </div>
    </div>
  );
}
