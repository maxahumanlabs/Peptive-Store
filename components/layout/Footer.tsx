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
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { t } = useLanguage();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <>
      <footer className="bg-[#1f1f1f] text-white">
        <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pt-16 md:pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-12 2xl:gap-24">
            {/* Left Column - Collapsible sections */}
            <div className="rounded-2xl border border-white/10 px-4 md:px-0 md:border-0 md:rounded-none md:space-y-12">
              {/* Peptive - Research Disclaimer */}
              <FooterSection title="Peptive">
                <div className="space-y-3 text-sm lg:text-base text-gray-400 leading-relaxed">
                  <p className="font-bold text-white uppercase tracking-wide">
                    {t('footer.disclaimer_title')}
                  </p>
                  <p>{`All products presented on this website are intended exclusively for in-vitro laboratory research and scientific investigation by qualified professionals. Nothing herein constitutes medical advice, therapeutic recommendation, or endorsement for human or animal consumption.`}</p>
                  <p>{`Peptive does not advocate or condone any off-label use, self-administration, or application beyond controlled research environments. All compounds are sold strictly for academic and investigational purposes. Purchasers assume full responsibility for compliance with applicable regulations. Consultation with research ethics boards, medical advisors, and legal counsel is recommended prior to purchase.`}</p>
                  <p>{`Peptive does not provide medical services, nor is it a substitute for medical consultations. All products are intended solely for laboratory research use. Any mention of potential effects is provided for informational purposes only.`}</p>
                  <p>{`The statements made within this website have not been evaluated by health authorities. The statements and the products of this company are intended for research and educational purposes only.`}</p>
                  <p>
                    {`Please refer to our `}
                    <Link href="/terms-of-service" className="text-white underline hover:text-white/70 transition-colors">
                      Terms Of Service
                    </Link>
                    {` prior to purchasing. By purchasing products, you confirm that you are at least 21 years old.`}
                  </p>
                </div>
              </FooterSection>

              {/* Quick Links */}
              <FooterSection title={t('footer.quick_links')}>
                <ul className="space-y-2">
                  <li>
                    <Link href="/search" className="text-gray-300 hover:text-white text-base lg:text-base xl:text-lg 2xl:text-xl transition-colors">
                      {t('footer.search')}
                    </Link>
                  </li>
                </ul>
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

            {/* Right Column - Newsletter */}
            <div className="mt-4 lg:mt-0">
              <h3 className="text-white font-bold text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-6 leading-tight">
                {t('footer.join')}
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.email_placeholder')}
                  className="flex-1 bg-transparent border-b-2 border-gray-600 focus:border-white py-3 px-2 text-white placeholder-gray-500 outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
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
