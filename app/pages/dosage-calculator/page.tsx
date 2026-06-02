'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DosageCalculator() {
  const { t } = useLanguage();
  const [selectedSyringe, setSelectedSyringe] = useState(0.3);
  const [peptideQuantity, setPeptideQuantity] = useState<number | null>(null);
  const [waterVolume, setWaterVolume] = useState<number | null>(null);
  const [desiredDose, setDesiredDose] = useState<number | null>(null);
  const [customPeptide, setCustomPeptide] = useState('');
  const [customWater, setCustomWater] = useState('');
  const [customDose, setCustomDose] = useState('');
  const [showPeptideOther, setShowPeptideOther] = useState(false);
  const [showWaterOther, setShowWaterOther] = useState(false);
  const [showDoseOther, setShowDoseOther] = useState(false);
  const [doseUnit, setDoseUnit] = useState<'mcg' | 'mg'>('mcg');

  // Calculate required dose (matching liquid file logic)
  const calculateDose = () => {
    if (!peptideQuantity || !waterVolume || !desiredDose) return null;
    
    // Calculate concentration (mg/ml)
    const concentration = peptideQuantity / waterVolume;
    
    // Convert desired dose to mg if in mcg
    let standardizedDose;
    if (doseUnit === 'mcg') {
      standardizedDose = desiredDose / 1000;
    } else {
      standardizedDose = desiredDose;
    }
    
    // Calculate volume needed (ml)
    const volume = standardizedDose / concentration;
    
    // Calculate units on U-100 syringe
    const syringeUnits = Math.round(volume * 100);
    
    return {
      volume: volume,
      volumeFormatted: volume.toFixed(2),
      units: syringeUnits,
      exceedsSyringe: volume > selectedSyringe
    };
  };

  const result = calculateDose();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 text-center mb-8 sm:mb-16 md:mb-24">
          {t('calculator.title')}
        </h1>

        {/* Main Calculator Section */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Left Side - Syringe Reference */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">{t('calculator.syringe_reference')}</h2>
            <div className="flex flex-col items-center gap-6 sm:gap-10">
              {/* Top row: 0.3 ml and 0.5 ml */}
              <div className="flex gap-4 sm:gap-8 md:gap-12 items-end">
                <button
                  onClick={() => setSelectedSyringe(0.3)}
                  className={`border-2 rounded-2xl p-3 sm:p-4 w-24 h-48 sm:w-32 sm:h-64 md:w-36 md:h-72 flex flex-col items-center justify-between transition-all ${
                    selectedSyringe === 0.3
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ boxSizing: 'content-box' }}
                >
                  <img src="/0.3ml.webp" alt="0.3 ml syringe" className="w-16 h-36 sm:w-20 sm:h-48 md:w-24 md:h-56 object-contain mb-2" />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">0.3 {t('units.ml')}</span>
                </button>
                <button
                  onClick={() => setSelectedSyringe(0.5)}
                  className={`border-2 rounded-2xl p-3 sm:p-4 w-24 h-48 sm:w-32 sm:h-64 md:w-36 md:h-72 flex flex-col items-center justify-between transition-all ${
                    selectedSyringe === 0.5
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ boxSizing: 'content-box' }}
                >
                  <img src="/0.5ml.webp" alt="0.5 ml syringe" className="w-16 h-36 sm:w-20 sm:h-48 md:w-24 md:h-56 object-contain mb-2" />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">0.5 {t('units.ml')}</span>
                </button>
              </div>
              {/* Bottom row: 1.0 ml centered */}
              <div className="flex justify-center ">
                <button
                  onClick={() => setSelectedSyringe(1.0)}
                  className={`border-2 rounded-2xl p-3 sm:p-4 w-24 h-48 sm:w-32 sm:h-64 md:w-36 md:h-72 flex flex-col items-center justify-between transition-all ${
                    selectedSyringe === 1.0
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ boxSizing: 'content-box' }}
                >
                  <img src="/1ml.webp" alt="1.0 ml syringe" className="w-16 h-36 sm:w-20 sm:h-48 md:w-24 md:h-56 object-contain mb-2" />
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">1.0 {t('units.ml')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Input Options */}
          <div className="space-y-6 sm:space-y-8">
            {/* Peptide Vial Quantity */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src="/Peptide Vial Quantity.webp" alt="Peptide Vial" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">{t('calculator.peptide_vial')}</h3>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[2, 3, 5, 10, 15].map((mg) => (
                  <button
                    key={mg}
                    onClick={() => {
                      setPeptideQuantity(mg);
                      setCustomPeptide('');
                      setShowPeptideOther(false);
                    }}
                    className={`relative px-4 sm:px-6 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm font-medium overflow-hidden group transition-all ${
                      peptideQuantity === mg
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-900 text-gray-900'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-lg"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-400">{mg} {t('units.mg')}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowPeptideOther(!showPeptideOther)}
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm font-medium overflow-hidden group transition-all ${
                    showPeptideOther
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-900 text-gray-900'
                  }`}
                >
                  <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-lg"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-400">{t('calculator.other')}</span>
                </button>
              </div>
              {showPeptideOther && (
                <input
                  type="number"
                  placeholder={t('calculator.enter_amount')}
                  value={customPeptide}
                  onChange={(e) => {
                    setCustomPeptide(e.target.value);
                    setPeptideQuantity(parseFloat(e.target.value) || null);
                  }}
                  className="mt-3 px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium w-full focus:border-gray-900 focus:outline-none"
                  autoFocus
                />
              )}
            </div>

            {/* Bacteriostatic Water Volume */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src="/Bacteriostatic Water Volume.webp" alt="Bacteriostatic Water" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">{t('calculator.water_volume')}</h3>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[1, 2, 3, 5].map((ml) => (
                  <button
                    key={ml}
                    onClick={() => {
                      setWaterVolume(ml);
                      setCustomWater('');
                      setShowWaterOther(false);
                    }}
                    className={`relative px-4 sm:px-6 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm font-medium overflow-hidden group transition-all ${
                      waterVolume === ml
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-900 text-gray-900'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-lg"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-400">{ml} {t('units.ml')}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowWaterOther(!showWaterOther)}
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm font-medium overflow-hidden group transition-all ${
                    showWaterOther
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-900 text-gray-900'
                  }`}
                >
                  <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-lg"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-400">Other</span>
                </button>
              </div>
              {showWaterOther && (
                <input
                  type="number"
                  placeholder={t('calculator.enter_volume')}
                  value={customWater}
                  onChange={(e) => {
                    setCustomWater(e.target.value);
                    setWaterVolume(parseFloat(e.target.value) || null);
                  }}
                  className="mt-3 px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium w-full focus:border-gray-900 focus:outline-none"
                  autoFocus
                />
              )}
            </div>

            {/* Desired Dose */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">{t('calculator.desired_dose')}</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: `50 ${t('units.mcg')}`, value: 50, unit: 'mcg' },
                  { label: `100 ${t('units.mcg')}`, value: 100, unit: 'mcg' },
                  { label: `250 ${t('units.mcg')}`, value: 250, unit: 'mcg' },
                  { label: `500 ${t('units.mcg')}`, value: 500, unit: 'mcg' },
                  { label: `1 ${t('units.mg')}`, value: 1, unit: 'mg' },
                  { label: `2.5 ${t('units.mg')}`, value: 2.5, unit: 'mg' },
                ].map((dose) => (
                  <button
                    key={dose.label}
                    onClick={() => {
                      setDesiredDose(dose.value);
                      setDoseUnit(dose.unit as 'mcg' | 'mg');
                      setCustomDose('');
                      setShowDoseOther(false);
                    }}
                    className={`relative px-6 py-2.5 border-2 rounded-lg text-sm font-medium overflow-hidden group transition-all ${
                      desiredDose === dose.value && doseUnit === dose.unit
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-900 text-gray-900'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-lg"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-400">{dose.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowDoseOther(!showDoseOther)}
                  className={`relative px-6 py-2.5 border-2 rounded-lg text-sm font-medium overflow-hidden group transition-all ${
                    showDoseOther
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-900 text-gray-900'
                  }`}
                >
                  <span className="absolute inset-0 bg-gray-900 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-lg"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-400">Other</span>
                </button>
              </div>
              {showDoseOther && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    placeholder={t('calculator.enter_dose')}
                    value={customDose}
                    onChange={(e) => {
                      setCustomDose(e.target.value);
                      const value = parseFloat(e.target.value) || null;
                      setDesiredDose(value);
                    }}
                    className="flex-1 px-6 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-gray-900 focus:outline-none"
                    autoFocus
                  />
                  <select 
                    value={doseUnit}
                    onChange={(e) => setDoseUnit(e.target.value as 'mcg' | 'mg')}
                    className="px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-gray-900 focus:outline-none"
                  >
                    <option value="mcg">{t('units.mcg')}</option>
                    <option value="mg">{t('units.mg')}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8">
          <div className="border-2 border-gray-900 rounded-3xl p-4 sm:p-8 md:p-12">
            <h2 className="text-base sm:text-lg md:text-xl text-gray-900 text-center mb-2">
              {t('calculator.result_title')}
            </h2>
            
            {result ? (
              result.exceedsSyringe ? (
                <div className="text-center space-y-2">
                  <div className="text-red-500">
                    <strong>{t('calculator.warning')}</strong> {t('calculator.exceeds_syringe').replace('{volume}', result.volumeFormatted).replace('{capacity}', selectedSyringe.toString())}
                  </div>
                  <div className="text-gray-600">
                    {t('calculator.select_larger')}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm sm:text-base md:text-lg text-gray-900">
                      {t('calculator.draw_to')} <span className="font-bold text-sm sm:text-base md:text-lg">{result.volumeFormatted} ml</span> {t('calculator.mark')} {selectedSyringe} ml {t('calculator.syringe')}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-900">
                      {t('calculator.equal_to')} <span className="font-bold text-sm sm:text-base md:text-lg">{result.units} {t('calculator.units')}</span> {t('calculator.on_u100')}
                    </p>
                  </div>

                  {/* Syringe Scale Visualization */}
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
                      {t('calculator.visualization')}
                    </h3>
                    <div className="relative max-w-xl mx-auto">
                      {/* Syringe */}
                      <div className="h-12 bg-gray-200 rounded-full relative overflow-hidden">
                        {/* Fill */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-gray-200 transition-all duration-700 ease-out"
                          style={{ width: `${(result.volume / selectedSyringe) * 100}%` }}
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600"></div>
                        </div>
                      </div>
                      {/* Scale Markers */}
                      <div className="flex justify-between mt-2 px-2">
                        {(() => {
                          let markers: string[] = [];
                          if (selectedSyringe === 0.3) {
                            markers = ['0', '0.05', '0.1', '0.15', '0.2', '0.25', '0.3'];
                          } else if (selectedSyringe === 0.5) {
                            markers = ['0', '0.1', '0.2', '0.3', '0.4', '0.5'];
                          } else if (selectedSyringe === 1.0) {
                            markers = ['0', '0.2', '0.4', '0.6', '0.8', '1.0'];
                          }
                          return markers.map((m) => (
                            <span key={m} className="text-xs sm:text-sm font-medium text-gray-600">{m}</span>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <p className="text-center text-gray-500 italic">
                {t('calculator.fill_fields')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
