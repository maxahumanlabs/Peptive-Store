'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function InstantAuthenticationPage() {
  const { t } = useLanguage();

  return (
    <div className=" bg-white flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 text-center mb-8 sm:mb-12">
          {t('instant_authentication.title')}
        </h1>

        {/* Checkmark Icon */}
        <div className="flex justify-center mb-8 mt-24">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 md:w-12 md:h-12 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-3xl  text-black">
          {t('instant_authentication.subtitle')}
        </p>
      </div>
    </div>
  );
}
