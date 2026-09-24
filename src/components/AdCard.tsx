import React from 'react';
import { 
  Flame, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Truck, 
  Camera,
  BadgeDollarSign,
  Package,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Ad, Language } from '../types';
import { translations } from '../utils/translations';

interface AdCardProps {
  ad: Ad;
  language: Language;
  onSelect: (ad: Ad) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, language, onSelect }) => {
  const t = translations[language];

  const isUrgent = ad.tier === 'urgent';
  const isTop = ad.tier === 'top';
  const isNormal = ad.tier === 'normal';

  // Format price or piece rate
  const displayPrice = () => {
    if (ad.pieceRate) {
      return (
        <div>
          <span className="text-[11px] text-slate-500 block -mb-0.5">
            {language === 'si' ? 'කෑල්ලකට' : 'Per piece'}
          </span>
          <span className={`text-base sm:text-lg font-black ${
            isUrgent ? 'text-red-600' : isTop ? 'text-emerald-700' : 'text-slate-900'
          }`}>
            රු. {Number(ad.pieceRate).toLocaleString()}
          </span>
        </div>
      );
    }
    return (
      <span className={`text-base sm:text-lg font-black ${
        isUrgent ? 'text-red-600' : isTop ? 'text-emerald-700' : 'text-slate-900'
      }`}>
        රු. {Number(ad.price).toLocaleString()}
      </span>
    );
  };

  const primaryImage = ad.images && ad.images.length > 0 
    ? ad.images[0] 
    : 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      className={`group rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl relative ${
        isUrgent
          ? 'border-2 border-red-500 shadow-lg shadow-red-500/10 bg-gradient-to-b from-red-50/80 via-white to-white'
          : isTop
          ? 'border-2 border-emerald-500 shadow-md shadow-emerald-500/10 bg-gradient-to-b from-emerald-50/60 via-white to-white'
          : 'border-2 border-slate-200/90 shadow-xs bg-gradient-to-b from-slate-100/50 via-white to-white hover:border-slate-300'
      }`}
    >
      {/* Top Banner Ribbon for Urgent & Top */}
      {isUrgent && (
        <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-1.5">
            <Package className="w-3 h-3 text-white stroke-[2.5]" />
            <span>{language === 'si' ? 'හදිසි දැන්වීම • URGENT PRIORITY' : 'URGENT PRIORITY AD'}</span>
          </div>
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
        </div>
      )}

      {isTop && (
        <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-200 stroke-[2.5]" />
            <span>{language === 'si' ? 'ටොප් ඇඩ් • FEATURED TOP AD' : 'FEATURED TOP AD'}</span>
          </div>
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
        </div>
      )}

      {isNormal && (
        <div className="bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 flex items-center justify-between">
          <span>{language === 'si' ? 'නෝමල් ඇඩ් • STANDARD' : 'STANDARD AD'}</span>
          <span className="text-[9px] text-slate-500">SILVER TIER</span>
        </div>
      )}

      <div>
        {/* Card Header Media Container */}
        <div 
          onClick={() => onSelect(ad)}
          className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
        >
          <img
            src={primaryImage}
            alt={ad.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Floating Sticker / Badge based on Tier */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
            {isUrgent && (
              <span className="inline-flex items-center gap-1.5 bg-red-600/95 backdrop-blur-xs text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg border border-red-400">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
                <span>{language === 'si' ? 'අර්ජන්ට් (URGENT)' : 'URGENT'}</span>
              </span>
            )}

            {isTop && (
              <span className="inline-flex items-center gap-1 bg-emerald-600/95 backdrop-blur-xs text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg border border-emerald-400">
                <BadgeDollarSign className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'si' ? 'TOP AD (ටොප් ඇඩ්)' : 'TOP AD'}</span>
              </span>
            )}

            {isNormal && (
              <span className="inline-flex items-center gap-1 bg-slate-800/80 backdrop-blur-xs text-slate-200 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                <span>{language === 'si' ? 'නෝමල්' : 'Normal'}</span>
              </span>
            )}
          </div>

          {/* Photo Count badge */}
          {ad.images && ad.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Camera className="w-3 h-3 text-amber-300" />
              <span>{ad.images.length}</span>
            </div>
          )}

          {/* Seller Membership Badge */}
          {ad.seller.membershipTier && ad.seller.membershipTier !== 'starter' && (
            <div className="absolute bottom-2 left-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md ${
                ad.seller.membershipTier === 'platinum'
                  ? 'bg-purple-900 text-amber-300 border border-purple-500'
                  : ad.seller.membershipTier === 'gold'
                  ? 'bg-amber-400 text-slate-950 border border-amber-500 font-extrabold'
                  : 'bg-slate-300 text-slate-900 border border-slate-400'
              }`}>
                {ad.seller.membershipTier === 'platinum' ? '👑 Platinum VIP' : ad.seller.membershipTier === 'gold' ? '⭐ Gold Member' : 'Silver Member'}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Location and Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[130px] font-semibold">{ad.seller.city}, {ad.seller.district}</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded uppercase">
              {ad.category === 'subcontract' && (language === 'si' ? 'සබ් ඕඩර්' : 'Subcontract')}
              {ad.category === 'machines' && (language === 'si' ? 'මැෂින්' : 'Machine')}
              {ad.category === 'garments' && (language === 'si' ? 'තොග ඇඳුම්' : 'Wholesale')}
              {ad.category === 'spare_parts' && (language === 'si' ? 'ස්පෙයාර් පාට්ස්' : 'Spares')}
              {ad.category === 'technicians' && (language === 'si' ? 'කාර්මික' : 'Technician')}
              {ad.category === 'operators' && (language === 'si' ? 'ඔපරේටර්' : 'Operator')}
            </span>
          </div>

          {/* Ad Title */}
          <h3
            onClick={() => onSelect(ad)}
            className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors leading-snug mb-2"
          >
            {language === 'si' ? (ad.titleSi || ad.title) : ad.title}
          </h3>

          {/* Key Specs tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {ad.category === 'operators' && ad.operatorTier && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                ad.operatorTier === 'platinum_lifetime'
                  ? 'bg-purple-950 text-amber-300 border-amber-400'
                  : ad.operatorTier === 'platinum'
                  ? 'bg-purple-900 text-white border-purple-400'
                  : ad.operatorTier === 'gold'
                  ? 'bg-amber-100 text-amber-900 border-amber-400'
                  : ad.operatorTier === 'silver'
                  ? 'bg-slate-200 text-slate-800 border-slate-400'
                  : 'bg-amber-800 text-white border-amber-900'
              }`}>
                {ad.operatorTier === 'platinum_lifetime' ? '👑 Lifetime VIP' : `${ad.operatorTier} Rank`}
              </span>
            )}
            {ad.category === 'operators' && ad.machineSkills && ad.machineSkills.length > 0 && (
              <span className="text-[10px] bg-teal-50 text-teal-800 font-semibold px-1.5 py-0.5 rounded border border-teal-200 truncate max-w-[170px]">
                {ad.machineSkills[0]}
              </span>
            )}
            {ad.orderQuantity && (
              <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-1.5 py-0.5 rounded border border-blue-200">
                {ad.orderQuantity.toLocaleString()} pcs
              </span>
            )}
            {ad.sizes && ad.sizes.length > 0 && (
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                {ad.sizes.slice(0, 3).join(', ')}{ad.sizes.length > 3 ? '...' : ''}
              </span>
            )}
            {ad.brand && (
              <span className="text-[10px] bg-amber-50 text-amber-900 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                {ad.brand}
              </span>
            )}
            {ad.warrantyMonths && (
              <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-1.5 py-0.5 rounded border border-purple-200">
                {ad.warrantyMonths} Mo. Warranty
              </span>
            )}
            {ad.experienceYears && (
              <span className="text-[10px] bg-rose-50 text-rose-800 font-semibold px-1.5 py-0.5 rounded border border-rose-200">
                {ad.experienceYears} Yrs Exp
              </span>
            )}
          </div>

          {/* Price and COD / Delivery Features */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-100">
            {displayPrice()}

            <div className="flex items-center gap-1.5 text-slate-400">
              {ad.codAvailable && (
                <span title={language === 'si' ? 'භාණ්ඩ ලැබුණු පසු මුදල් ගෙවිය හැක (COD)' : 'Cash on Delivery Available'} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                  COD
                </span>
              )}
              {ad.deliveryAvailable && (
                <span title={language === 'si' ? 'දිවයින පුරා ඩිලිවරි පහසුකම් ඇත' : 'Delivery Available'} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  <Truck className="w-3 h-3 inline mr-0.5" />
                  {language === 'si' ? 'ඩිලිවරි' : 'Delivery'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer: Call, WhatsApp, View */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5">
        <a
          href={`tel:${ad.seller.phone}`}
          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 flex items-center justify-center gap-1 shadow-2xs transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-3 h-3 text-emerald-600" />
          <span>{t.card.call}</span>
        </a>

        <a
          href={`https://wa.me/${ad.seller.whatsapp}?text=SewLanka:%20Inquiring%20about%20ad%20${encodeURIComponent(ad.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-2xs transition-colors"
          title="WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => onSelect(ad)}
          className={`py-1.5 px-3 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer ${
            isUrgent
              ? 'bg-red-600 hover:bg-red-700'
              : isTop
              ? 'bg-emerald-700 hover:bg-emerald-800'
              : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          {language === 'si' ? 'බලන්න' : 'View'}
        </button>
      </div>
    </div>
  );
};
