'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Collapsible section: an accordion on mobile, always-open column on desktop.
function FooterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 last:border-b-0 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 md:py-0 md:pointer-events-none text-left"
      >
        <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl tracking-wide uppercase">
          {title}
        </h3>
        <svg
          className={`w-5 h-5 text-white md:hidden transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`${open ? 'block' : 'hidden'} md:block pb-5 md:pb-0 md:mt-4`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#1f1f1f] text-white w-full">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pt-16 md:pt-24 pb-12 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 gap-10 lg:gap-12 xl:gap-12 2xl:gap-24">
            {/* Left Column - Collapsible sections */}
            <div className="rounded-2xl border border-white/10 px-4 md:px-0 md:border-0 md:rounded-none md:space-y-12">
              {/* Peptive - Research Disclaimer */}
              <FooterSection title="Peptive">
                <div className="space-y-3 text-sm lg:text-base text-gray-400 leading-relaxed">
                  <p className="font-bold text-white uppercase tracking-wide">
                    {t('footer.disclaimer_title')}
                  </p>
                  <p>{t('footer.disclaimer_p1')}</p>
                  <p>{t('footer.disclaimer_p2')}</p>
                  <p>{t('footer.disclaimer_p3')}</p>
                  <p>{t('footer.disclaimer_p4')}</p>
                  <p>
                    {t('footer.disclaimer_p5_pre')}
                    <Link href="/terms-of-service" className="text-white underline hover:text-white/70 transition-colors">
                      {t('footer.disclaimer_p5_link')}
                    </Link>
                    {t('footer.disclaimer_p5_post')}
                  </p>
                </div>
              </FooterSection>



              {/* Contact */}
              <FooterSection title={t('footer.contact')}>
                <div className="space-y-2">
                  <a href="tel:+971558225919" className="block underline text-white hover:text-gray-300 transition-colors text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                    +971 55 822 5919
                  </a>
                  <a href="mailto:peptivepeptides@gmail.com" className="block underline text-white hover:text-gray-300 transition-colors text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                    peptivepeptides@gmail.com
                  </a>
                </div>
              </FooterSection>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar Section */}
      <div className="bg-[#1f1f1f] py-4">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 flex justify-center md:justify-start">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-center">
            <span className="text-white">©{currentYear} Peptive Pept.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="text-white hover:text-white/70 transition-colors">
                {t('footer.privacy_policy')}
              </Link>
              <Link href="/terms-of-service" className="text-white hover:text-white/70 transition-colors">
                {t('footer.terms_of_service')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
