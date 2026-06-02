"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

type ResultType = "success" | "warning" | "error" | null;

export default function AuthenticationPage() {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultType, setResultType] = useState<ResultType>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      setResult(t("authentication.error_empty"));
      setResultType("warning");
      return;
    }

    setLoading(true);
    setResult(null);
    setResultType(null);

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (data.status === 'valid') {
        setResult(t("authentication.result_valid"));
        setResultType("success");
      } else if (data.status === 'already-used') {
        setResult(t("authentication.result_used"));
        setResultType("warning");
      } else {
        setResult(t("authentication.result_invalid"));
        setResultType("error");
      }
    } catch (error) {
      setResult(t("authentication.result_invalid"));
      setResultType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 text-center mb-8 sm:mb-12">{t("authentication.title")}</h1>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl p-4 sm:p-6 shadow border">
            <div className="font-bold text-base md:text-lg mb-1">{t("authentication.step1_title")}</div>
            <div className="text-xs text-gray-700 mb-4">{t("authentication.step1_desc")}</div>
            <img src="/step1.webp" alt="Step 1" className="w-full max-w-xs rounded-lg" />
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl p-4 sm:p-6 shadow border">
            <div className="font-bold text-base md:text-lg mb-1">{t("authentication.step2_title")}</div>
            <div className="text-xs text-gray-700 mb-4">{t("authentication.step2_desc")}</div>
            <img src="/step2.webp" alt="Step 2" className="w-full max-w-xs rounded-lg" />
          </div>
        </div>
        {/* Important Notice and Form */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 mb-8">
          <div className="flex-1 bg-black text-white rounded-2xl p-4 sm:p-6 flex flex-col justify-center items-start">
            <div className="font-bold text-lg mb-2">{t("authentication.important")}</div>
            <div className="text-xs mb-1">{t("authentication.info_once")} <span className="font-bold">{t("authentication.once")}</span>.</div>
            <div className="text-xs">{t("authentication.info_cannot")} <span className="text-red-500 font-bold">{t("authentication.cannot")}</span>.</div>
          </div>
          <div className="flex-1 flex flex-col gap-4 justify-center">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyPress={e => e.key === 'Enter' && handleVerify()}
              placeholder={t("authentication.placeholder")}
              className="w-full bg-black text-white text-center text-sm sm:text-lg tracking-widest rounded-2xl py-3 sm:py-4 px-4 sm:px-6 font-mono border-2 sm:border-4 border-transparent outline-none placeholder-gray-400 mb-2 focus:bg-white focus:text-gray-900 focus:border-black"
              maxLength={12}
              style={{ letterSpacing: '0.2em' }}
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full border-2 border-black text-black text-sm sm:text-lg font-bold rounded-2xl py-3 sm:py-4 px-4 sm:px-6 bg-white hover:bg-black hover:text-white transition-colors duration-200 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <>
                    <span className="inline-block w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                    {t("authentication.verifying")}
                  </>
                ) : t("authentication.verify_btn")}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-500 ease-in-out group-hover:h-full -z-0"></span>
            </button>
            {result && resultType && (
              <div
                className={`mt-4 text-center text-sm sm:text-lg font-medium rounded-2xl py-3 px-4 border-2 transition-opacity duration-300 ${
                  resultType === 'success'
                    ? 'bg-[#0A2E0A] border-green-500 text-[#ADFFAD]'
                    : resultType === 'warning'
                    ? 'bg-[#2E1E00] border-orange-500 text-[#FFD580]'
                    : 'bg-[#2E0A0A] border-red-500 text-[#FFB3B3]'
                }`}
              >
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
