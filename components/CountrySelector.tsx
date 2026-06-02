'use client';

import { useState } from 'react';

const countries = [
  'Bahrain',
  'Kuwait',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'United Arab Emirates',
  'United States',
];

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState('United Arab Emirates');
  const [isOpen, setIsOpen] = useState(false);
  let closeTimeout: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsOpen(false);
    }, 1000); // 1 second delay
  };

  return (
    <div className="relative" style={{ display: 'inline-block' }}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          className={`flex items-center gap-2 bg-[#1f1f1f] text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 min-w-[180px]`}
          tabIndex={0}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs flex-1 text-left">{selectedCountry}</span>
          <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        <div
          className={`absolute top-full left-0 mt-2 bg-[#1f1f1f] text-white rounded-b-2xl shadow-2xl overflow-hidden z-[100] min-w-[220px] transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => {
                setSelectedCountry(country);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-sm font-normal focus:outline-none transition-all duration-300 relative ${selectedCountry === country ? 'font-semibold' : ''}`}
              style={{ background: 'none' }}
            >
              <span className="relative inline-block group">
                <span className="transition-colors duration-300">{country}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
