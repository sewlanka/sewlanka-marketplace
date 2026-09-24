import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Wrench, 
  Flame, 
  Award, 
  Crown, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Ad, Language, TechnicianTier } from '../types';
import { translations } from '../utils/translations';
import { TECHNICIAN_MEMBERSHIPS, SRI_LANKA_DISTRICTS } from '../data/sriLankaData';

interface TechniciansDirectoryProps {
  technicianAds: Ad[];
  language: Language;
  onSelectAd: (ad: Ad) => void;
  onOpenPostAd: () => void;
}

export const TechniciansDirectory: React.FC<TechniciansDirectoryProps> = ({
  technicianAds,
  language,
  onSelectAd,
  onOpenPostAd,
}) => {
  const t = translations[language];
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const filtered = technicianAds.filter((tech) => {
    if (filterDistrict && tech.seller.district !== filterDistrict) return false;
    if (filterTier !== 'all' && (tech.technicianTier || 'silver') !== filterTier) return false;
    return true;
  });

  // Sort: Platinum Lifetime first, Platinum second, Gold third, Silver fourth
  const sorted = [...filtered].sort((a, b) => {
    const tierOrder: Record<TechnicianTier, number> = { platinum_lifetime: 4, platinum: 3, gold: 2, silver: 1 };
    const aVal = tierOrder[a.technicianTier || 'silver'] || 1;
    const bVal = tierOrder[b.technicianTier || 'silver'] || 1;
    return bVal - aVal;
  });

  return (
    <div className="space-y-8 mb-12">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'දිවයින පුරා මැෂින් කාර්මික ශිල්පීන්' : 'Islandwide Machine Mechanics'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.technicians.title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            {t.technicians.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onOpenPostAd}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              {language === 'si' ? '+ කාර්මික ශිල්පියෙකු ලෙස ලියාපදිංචි වන්න' : '+ Register as a Technician'}
            </button>
          </div>
        </div>
      </div>

      {/* Membership Tiers Overview (Silver, Gold, Platinum) as requested by user! */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            {language === 'si' ? 'විශ්වාසනීය සේවාවක් සඳහා' : 'Verified Technician Network'}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.technicians.membershipTiers}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'si'
              ? 'කාර්මික ශිල්පීන් සඳහා විශේෂ වරප්‍රසාද සහ ප්‍රමුඛතා සබඳතා'
              : 'Tier-based accreditation providing direct customer reach'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Silver */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative hover:border-slate-300 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold mb-3">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Standard Accreditation</span>
              <h4 className="text-base font-black text-slate-900 mt-0.5">
                {TECHNICIAN_MEMBERSHIPS.silver.titleSi}
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {TECHNICIAN_MEMBERSHIPS.silver.descSi}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">මූලික ගාස්තුව (Initial Fee)</span>
                <span className="text-sm font-black text-slate-800">රු. 1,000/- <span className="text-xs font-semibold text-slate-500">($3.28 USD)</span></span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600">මාසික දායකත්වය:</span>
                <span className="text-xs font-black text-slate-900">රු. 100/- /මසකට <span className="text-[10px] font-normal text-slate-500">($0.33)</span></span>
              </div>
              <button
                onClick={onOpenPostAd}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                තෝරාගන්න (Select Silver)
              </button>
            </div>
          </div>

          {/* Gold */}
          <div className="bg-gradient-to-b from-amber-50/70 to-white rounded-2xl p-5 border-2 border-amber-400 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-all">
            <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
              POPULAR
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Priority Ranking</span>
              <h4 className="text-base font-black text-slate-900 mt-0.5">
                {TECHNICIAN_MEMBERSHIPS.gold.titleSi}
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {TECHNICIAN_MEMBERSHIPS.gold.descSi}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200 space-y-2">
              <div>
                <span className="text-[10px] text-amber-700 block font-medium">මූලික ගාස්තුව (Initial Fee)</span>
                <span className="text-sm font-black text-amber-900">රු. 2,500/- <span className="text-xs font-semibold text-amber-700">($8.20 USD)</span></span>
              </div>
              <div className="bg-amber-100/60 p-2 rounded-xl border border-amber-300 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900">මාසික දායකත්වය:</span>
                <span className="text-xs font-black text-amber-900">රු. 200/- /මසකට <span className="text-[10px] font-normal text-amber-700">($0.66)</span></span>
              </div>
              <button
                onClick={onOpenPostAd}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer text-center shadow-xs"
              >
                තෝරාගන්න (Select Gold)
              </button>
            </div>
          </div>

          {/* Platinum */}
          <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border-2 border-indigo-400 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-400 to-indigo-300 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
              VIP REPAIRER
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center font-bold mb-3">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider block">Highest Priority</span>
              <h4 className="text-base font-black text-white mt-0.5">
                {TECHNICIAN_MEMBERSHIPS.platinum.titleSi}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {TECHNICIAN_MEMBERSHIPS.platinum.descSi}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-800 space-y-2">
              <div>
                <span className="text-[10px] text-indigo-300 block font-medium">මූලික ගාස්තුව (Initial Fee)</span>
                <span className="text-sm font-black text-amber-400">රු. 5,000/- <span className="text-xs font-semibold text-slate-300">($16.39 USD)</span></span>
              </div>
              <div className="bg-indigo-950/80 p-2 rounded-xl border border-indigo-700 flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-200">මාසික දායකත්වය:</span>
                <span className="text-xs font-black text-emerald-400">රු. 300/- /මසකට <span className="text-[10px] font-normal text-slate-300">($0.98)</span></span>
              </div>
              <button
                onClick={onOpenPostAd}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer text-center shadow-md"
              >
                තෝරාගන්න (Select Platinum)
              </button>
            </div>
          </div>

          {/* Platinum Lifetime */}
          <div className="bg-gradient-to-br from-amber-500/10 via-purple-950 to-slate-950 text-white rounded-2xl p-5 border-2 border-amber-400 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
              LIFETIME VIP
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold mb-3">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">One-Time Perpetual VIP</span>
              <h4 className="text-base font-black text-amber-200 mt-0.5">
                {TECHNICIAN_MEMBERSHIPS.platinum_lifetime.titleSi}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {TECHNICIAN_MEMBERSHIPS.platinum_lifetime.descSi}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-800 space-y-2">
              <div>
                <span className="text-[10px] text-amber-300 block font-medium">එක්වරක් පමණක් ගෙවීම (Lifetime)</span>
                <span className="text-sm font-black text-amber-300">රු. 10,000/- <span className="text-xs font-semibold text-slate-300">($32.79 USD)</span></span>
              </div>
              <div className="bg-emerald-950/80 p-2 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-300">මාසික දායකත්වය:</span>
                <span className="text-xs font-black text-emerald-300">කිසිදු මාසික ගාස්තුවක් නැත (රු. 0)</span>
              </div>
              <button
                onClick={onOpenPostAd}
                className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer text-center shadow-lg"
              >
                ලයිෆ්ටයිම් VIP ලබාගන්න
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="w-full sm:w-48 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="">{t.allDistricts}</option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.nameEn}>
                {language === 'si' ? d.nameSi : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: language === 'si' ? 'සියල්ල' : 'All' },
            { id: 'platinum', label: '👑 Platinum VIP' },
            { id: 'gold', label: '⭐ Gold' },
            { id: 'silver', label: 'Silver' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setFilterTier(tier.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                filterTier === tier.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((tech) => {
          const tier = tech.technicianTier || 'silver';
          const isPlatinum = tier === 'platinum';
          const isGold = tier === 'gold';

          return (
            <div
              key={tech.id}
              className={`rounded-2xl border bg-white p-5 flex flex-col justify-between transition-all hover:shadow-lg ${
                isPlatinum
                  ? 'border-indigo-400 ring-2 ring-indigo-400/20 shadow-md'
                  : isGold
                  ? 'border-amber-300 ring-1 ring-amber-300/40 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Top badge and location */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                    isPlatinum
                      ? 'bg-indigo-900 text-white border border-indigo-500'
                      : isGold
                      ? 'bg-amber-400 text-slate-950 font-extrabold border border-amber-500'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isPlatinum ? '👑 Platinum VIP' : isGold ? '⭐ Gold Member' : 'Silver Member'}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tech.seller.city}, {tech.seller.district}</span>
                  </div>
                </div>

                {/* Technician Name & Business */}
                <h4 
                  onClick={() => onSelectAd(tech)}
                  className="text-base font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition-colors leading-snug"
                >
                  {language === 'si' ? (tech.titleSi || tech.title) : tech.title}
                </h4>

                {tech.seller.businessName && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {tech.seller.businessName}
                  </p>
                )}

                {/* Experience & 24/7 Service pill */}
                <div className="flex flex-wrap items-center gap-2 my-3">
                  {tech.experienceYears && (
                    <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md">
                      {tech.experienceYears} {t.technicians.experience}
                    </span>
                  )}
                  {tech.isEmergencyAvailable && (
                    <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-600" />
                      <span>{t.technicians.emergency247}</span>
                    </span>
                  )}
                </div>

                {/* Specialties */}
                {tech.specialities && tech.specialities.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] text-slate-400 block mb-1 font-semibold">
                      {t.technicians.specialties}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tech.specialities.map((spec, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons: Direct Call & WhatsApp */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${tech.seller.phone}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tech.seller.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${tech.seller.whatsapp}?text=SewLanka:%20Hello%20Mechanic,%20I%20need%20machine%20repair%20service`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl flex items-center justify-center shadow-2xs transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
