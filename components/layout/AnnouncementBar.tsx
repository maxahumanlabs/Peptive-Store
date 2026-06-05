'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import CountrySelector from '@/components/CountrySelector';
import LanguageSelector from '@/components/LanguageSelector';

export default function AnnouncementBar() {
  const { t } = useLanguage();

  const messages = [
    t('announcement.offer'),
    t('announcement.uae'),
    t('announcement.saudi'),
  ];

  // One pass of the messages, separated by dots. Rendered twice back-to-back
  // so the -50% marquee animation loops seamlessly.
  const Track = () => (
    <div className="flex shrink-0 items-center">
      {messages.map((msg, i) => (
        <span
          key={i}
          className="flex items-center whitespace-nowrap text-xs font-medium uppercase tracking-wider"
        >
          {msg}
          <span className="mx-8 text-white/50">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-[#1f1f1f] text-white py-4 md:py-2 lg:py-2 px-6 sm:px-2 lg:px-12 relative z-50">
      <div className="relative flex items-center min-h-[1.25rem]">
        {/* Country / Language selectors - left (hidden on mobile) */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="hidden md:block">
            <CountrySelector />
          </div>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        {/* Marquee - fixed width, centered in the bar */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[587px] max-w-full overflow-hidden"
          dir="ltr"
        >
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <Track />
            <Track />
          </div>
        </div>
      </div>
    </div>
  );
}
