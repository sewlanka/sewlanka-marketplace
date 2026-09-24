import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { Ad, Language } from '../types';

interface UrgentBannerTickerProps {
  urgentAds: Ad[];
  language: Language;
  onSelectAd: (ad: Ad) => void;
  isHome: boolean;
}

export const UrgentBannerTicker: React.FC<UrgentBannerTickerProps> = ({
  urgentAds,
  language,
  onSelectAd,
  isHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (urgentAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgentAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [urgentAds.length]);

  if (!urgentAds || urgentAds.length === 0) return null;

  const currentAd = urgentAds[currentIndex] || urgentAds[0];

  // If on Home page: Show prominent full banner showcase
  if (isHome) {
    return (
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl shadow-lg p-4 sm:p-5 mb-6 relative overflow-hidden">
        {/* Background decorative styling */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-20 top-2 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-xs flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                  {language === 'si' ? 'හදිසි ඇණවුම් / URGENT AD' : 'URGENT PRIORITY AD'}
                </span>
                <span className="text-xs text-rose-100 font-medium">
                  {currentAd.seller.city}, {currentAd.seller.district}
                </span>
                {urgentAds.length > 1 && (
                  <span className="text-[10px] bg-black/20 text-white/90 px-1.5 py-0.5 rounded">
                    {currentIndex + 1} / {urgentAds.length}
                  </span>
                )}
              </div>
              <h3 
                onClick={() => onSelectAd(currentAd)}
                className="text-base sm:text-lg font-bold text-white hover:text-amber-200 cursor-pointer transition-colors line-clamp-1"
              >
                {language === 'si' ? (currentAd.titleSi || currentAd.title) : currentAd.title}
              </h3>
              <p className="text-xs sm:text-sm text-rose-100 line-clamp-1 mt-0.5">
                {currentAd.urgentHeadline || (language === 'si' ? currentAd.descriptionSi : currentAd.description)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Price/Rate pill */}
            <div className="bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-right">
              <span className="block text-[10px] text-amber-300 uppercase font-semibold">
                {currentAd.pieceRate ? (language === 'si' ? 'කෑල්ලකට' : 'Per Piece') : (language === 'si' ? 'මිල' : 'Price')}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                රු. {Number(currentAd.pieceRate || currentAd.price).toLocaleString()}
              </span>
            </div>

            {/* Direct Call & WhatsApp buttons */}
            <a
              href={`tel:${currentAd.seller.phone}`}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'si' ? 'අමතන්න' : 'Call'}</span>
            </a>

            <button
              onClick={() => onSelectAd(currentAd)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1 shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <span>{language === 'si' ? 'විස්තර' : 'Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If in inner categories: Show notification-style persistent strip
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white px-4 py-2.5 rounded-xl mb-4 shadow-sm flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-1.5 py-0.5 rounded shrink-0 animate-pulse">
          {language === 'si' ? 'හදිසි' : 'URGENT'}
        </span>
        <span className="font-semibold text-white truncate cursor-pointer hover:underline" onClick={() => onSelectAd(currentAd)}>
          {language === 'si' ? (currentAd.titleSi || currentAd.title) : currentAd.title}
        </span>
        <span className="hidden sm:inline text-rose-200">
          • {currentAd.seller.city} (රු. {Number(currentAd.pieceRate || currentAd.price).toLocaleString()})
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onSelectAd(currentAd)}
          className="bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          {language === 'si' ? 'බලන්න' : 'View'}
        </button>
        <a
          href={`https://wa.me/${currentAd.seller.whatsapp}?text=SewLanka:%20Inquiring%20about%20urgent%20ad%20${encodeURIComponent(currentAd.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-lg transition-colors"
          title="WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
