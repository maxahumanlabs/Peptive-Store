"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfAhFwhiEQNOQqhKMYYsFfmi2eeh0nahSx1LDW9gR-dY8WbjA/formResponse';
const FORM_FIELD_IDS = {
  name: 'entry.1555006274',
  phone: 'entry.896086746',
  country: 'entry.27555157',
  timestamp: 'entry.1286999267',
};

const STORAGE_KEY = 'entryGateCompleted';
const DISPLAY_DELAY = 2000;

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan', dial: '+962', flag: '🇯🇴' },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'LB', name: 'Lebanon', dial: '+961', flag: '🇱🇧' },
  { code: 'PS', name: 'Palestine', dial: '+970', flag: '🇵🇸' },
  { code: 'IQ', name: 'Iraq', dial: '+964', flag: '🇮🇶' },
  { code: 'SY', name: 'Syria', dial: '+963', flag: '🇸🇾' },
  { code: 'YE', name: 'Yemen', dial: '+967', flag: '🇾🇪' },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', dial: '+218', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', dial: '+249', flag: '🇸🇩' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴' },
  { code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
];

export default function WelcomePopup() {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show popup after delay
  useEffect(() => {
    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (hasCompleted === 'true') {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }, DISPLAY_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  const submitToGoogleForms = async (formData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      const params = new URLSearchParams({
        [FORM_FIELD_IDS.name]: formData.name,
        [FORM_FIELD_IDS.phone]: formData.phone,
        [FORM_FIELD_IDS.country]: formData.country,
        [FORM_FIELD_IDS.timestamp]: formData.timestamp,
        submit: 'Submit',
      });

      const formUrl = `${GOOGLE_FORM_URL}?${params.toString()}`;

      const img = new Image();
      img.src = formUrl;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setNameError('');
    setPhoneError('');
    setEmailError('');

    let hasError = false;

    // Validate name
    if (!name.trim()) {
      setNameError(t('welcome_popup.name_error'));
      hasError = true;
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError(t('welcome_popup.phone_error'));
      hasError = true;
    } else if (!isValidPhone(phone)) {
      setPhoneError(t('welcome_popup.phone_error'));
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError(t('welcome_popup.email_error'));
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t('welcome_popup.email_error'));
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const selectedCountry = countries.find((c) => c.dial === countryCode);
      const countryName = selectedCountry ? selectedCountry.name : 'Unknown';
      const fullPhone = countryCode + phone;

      const formData = {
        name: name.trim(),
        phone: fullPhone,
        country: countryName,
        timestamp: email.trim(),
      };

      await submitToGoogleForms(formData);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('visitorName', name);
      localStorage.setItem('visitorPhone', fullPhone);
      localStorage.setItem('visitorEmail', email);

      // Close popup
      handleClose();
    } catch (error) {
      console.warn('Submission error:', error);
      // Close anyway
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isOpen) return null;

  const isRTL = language === 'ar';

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-md transition-opacity duration-500 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-[480px] w-[90%] p-10 sm:p-12 text-center ${isRTL ? 'rtl' : ''}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-3xl text-gray-500 hover:text-black transition-colors z-10`}
        >
          &times;
        </button>

        {/* Language Toggle */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex gap-1 bg-gray-100 rounded-lg p-1`}>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              language === 'en' ? 'bg-black text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              language === 'ar' ? 'bg-black text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
          >
            العربية
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-black mt-10 mb-3 leading-snug">
          {t('welcome_popup.title')}{' '}
          <span className="inline-block ml-2 align-middle">
            🎉
            <img
              src="https://cdn.shopify.com/s/files/1/0772/8748/9774/files/Screenshot_2025-11-19_at_17.57.08.png?v=1763557038"
              alt="WhatsApp"
              width={40}
              height={40}
              className="inline-block align-top"
            />
          </span>
        </h2>

        <p className="text-gray-600 mb-9">{t('welcome_popup.subtitle')}</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Input */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              placeholder={t('welcome_popup.name_placeholder')}
              className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all bg-gray-50 focus:outline-none focus:border-black focus:bg-white ${
                nameError ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {nameError && <div className={`text-red-500 text-sm mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>{nameError}</div>}
          </div>

          {/* Phone Input Group */}
          <div>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="min-w-[75px]">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={`w-auto border-2 rounded-xl text-base bg-gray-50 cursor-pointer font-medium px-4 py-4 text-center transition-all focus:outline-none focus:border-black focus:bg-white ${
                    phoneError ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.dial}>
                      {country.flag} {country.dial}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder={t('welcome_popup.phone_placeholder')}
                  className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all bg-gray-50 focus:outline-none focus:border-black focus:bg-white ${
                    phoneError ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
            </div>
            {phoneError && <div className={`text-red-500 text-sm mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>{phoneError}</div>}
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder={t('welcome_popup.email_placeholder')}
              className={`w-full px-4 py-4 border-2 rounded-xl text-base transition-all bg-gray-50 focus:outline-none focus:border-black focus:bg-white ${
                emailError ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {emailError && <div className={`text-red-500 text-sm mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>{emailError}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-black text-white rounded-xl text-base font-semibold cursor-pointer transition-all mt-3 hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? t('welcome_popup.please_wait') : t('welcome_popup.submit_button')}
          </button>
        </form>
      </div>
    </div>
  );
}
