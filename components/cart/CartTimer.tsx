'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartTimer() {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<number>(2 * 60 * 60); // 2 hours in seconds
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    
    const updateTimer = () => {
      const now = Date.now();
      let startTime = localStorage.getItem('cart_timer_start');

      if (!startTime || now - parseInt(startTime) > TWO_HOURS) {
        startTime = now.toString();
        localStorage.setItem('cart_timer_start', startTime);
      }
      
      const elapsed = now - parseInt(startTime);
      const remaining = Math.max(0, TWO_HOURS - elapsed);
      setTimeLeft(Math.floor(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  const hours = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const totalSeconds = 2 * 60 * 60;
  // Progress goes from 100% to 0% as time decreases
  const progressPercent = (timeLeft / totalSeconds) * 100;

  const textHurry = language === 'ar' ? 'أسرع، ينتهي العرض خلال' : 'Hurry, Offer ends in';
  const textDelivered = language === 'ar' ? '١٥,٠٠٠+ طرد تم تسليمه عالمياً' : '15,000+ packages delivered worldwide';

  return (
    <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur-sm pt-2 pb-3 mb-2 -mx-1 px-1">
      <div className="flex items-center gap-1.5 text-sm md:text-base font-medium text-gray-900 mb-2">
        {textHurry} <span className="text-[#D32F2F]">{hours}:{minutes}:{seconds}</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-[#111827] rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
        <span>🔥</span>
        <span>{textDelivered}</span>
      </div>
    </div>
  );
}
