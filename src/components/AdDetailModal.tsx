import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Banknote, 
  Calendar, 
  Clock, 
  Flame, 
  Star, 
  ChevronRight, 
  Share2, 
  Check, 
  Tag, 
  AlertTriangle 
} from 'lucide-react';
import { Ad, Language } from '../types';
import { translations } from '../utils/translations';

interface AdDetailModalProps {
  ad: Ad | null;
  onClose: () => void;
  language: Language;
  onSelectSimilarAd: (ad: Ad) => void;
  allAds: Ad[];
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  onClose,
  language,
  onSelectSimilarAd,
  allAds,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!ad) return null;

  const t = translations[language];
  const images = ad.images && ad.images.length > 0 
    ? ad.images 
    : ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'];

  const similarAds = allAds
    .filter((item) => item.id !== ad.id && item.category === ad.category && item.status === 'active')
    .slice(0, 3);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(ad.seller.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header alert if Urgent */}
        {ad.tier === 'urgent' && (
          <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-bold rounded-t-3xl">
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>
              {language === 'si' 
                ? 'හදිසි ප්‍රමුඛතා දැන්වීමකි! කඩිනම් ගනුදෙනුවක් සඳහා දැන්ම අමතන්න.' 
                : 'Urgent Priority Listing! High demand, contact seller immediately.'}
            </span>
          </div>
        )}

        <div className="p-5 sm:p-8">
          {/* Main Top Grid: Media Gallery & Quick Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {ad.tier === 'urgent' && (
                    <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      🔥 URGENT
                    </span>
                  )}
                  {ad.tier === 'top' && (
                    <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      ⭐ TOP AD
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails row (up to 5 photos) */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Title, Price & Contact Box (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">
                    {ad.seller.city}, {ad.seller.district}
                  </span>
                  <span>•</span>
                  <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                  {language === 'si' ? (ad.titleSi || ad.title) : ad.title}
                </h1>

                {/* Price Display */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
                  {ad.pieceRate ? (
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">
                        {language === 'si' ? 'කෑල්ලකට ගෙවන මුදල (Rate per Piece)' : 'Rate per Piece'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-amber-600">
                          රු. {Number(ad.pieceRate).toLocaleString()}
                        </span>
                        {ad.orderQuantity && (
                          <span className="text-xs text-slate-500 font-medium">
                            (Total: රු. {Number(ad.price).toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">
                        {language === 'si' ? 'විකිණුම් මිල (Selling Price)' : 'Price'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          රු. {Number(ad.price).toLocaleString()}
                        </span>
                        {ad.isNegotiable && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            {language === 'si' ? 'මිල ගණන් සාකච්ඡා කළ හැක' : 'Negotiable'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Delivery Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {ad.codAvailable && (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs font-bold">
                      <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'si' ? 'COD ඇත (භාණ්ඩ ලැබුණු පසු මුදල්)' : 'Cash on Delivery Available'}</span>
                    </div>
                  )}
                  {ad.deliveryAvailable && (
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-xl text-xs font-bold">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{language === 'si' ? 'දිවයින පුරා ඩිලිවරි පහසුකම්' : 'Islandwide Delivery Available'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Information Card & Contact Actions */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md">
                <div className="flex items-start justify-between mb-3.5">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      {t.adDetails.contactSeller}
                    </span>
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                      {ad.seller.name}
                      {ad.seller.verified && (
                        <span title="Verified Member">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </span>
                      )}
                    </h4>
                    {ad.seller.businessName && (
                      <p className="text-xs text-amber-300 font-medium">{ad.seller.businessName}</p>
                    )}
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded">
                    {ad.seller.city}
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${ad.seller.phone}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{ad.seller.phone} ({language === 'si' ? 'ඇමතුමක් ගන්න' : 'Call Now'})</span>
                  </a>

                  <a
                    href={`https://wa.me/${ad.seller.whatsapp}?text=SewLanka:%20Hello,%20I%20am%20inquiring%20about%20your%20ad:%20${encodeURIComponent(ad.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-emerald-600"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{language === 'si' ? 'වට්ස්ඇප් (WhatsApp Chat)' : 'Chat on WhatsApp'}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Specifications Table & Full Details */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" />
              <span>{t.adDetails.itemSpecs}</span>
            </h3>

            {/* Spec grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {/* Category specific specs */}
              {ad.orderQuantity && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'ඇණවුම් ප්‍රමාණය' : 'Order Quantity'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.orderQuantity.toLocaleString()} pieces</span>
                </div>
              )}

              {ad.workType && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'කාර්යයේ ස්වභාවය' : 'Work Scope'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.workType}</span>
                </div>
              )}

              {ad.materialProvided !== undefined && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'රෙදිපිළි සැපයීම' : 'Material Supply'}</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {ad.materialProvided 
                      ? (language === 'si' ? 'රෙදි සහ නූල් ආයතනයෙන් සපයයි' : 'Provided by Client Factory')
                      : (language === 'si' ? 'මැහුම්කරු විසින් සපයාගත යුතුය' : 'To be sourced')}
                  </span>
                </div>
              )}

              {ad.completionDeadline && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'අවසාන දිනය' : 'Deadline'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.completionDeadline}</span>
                </div>
              )}

              {ad.sizes && ad.sizes.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-1 sm:col-span-2">
                  <span className="text-xs text-slate-500 block mb-1">{language === 'si' ? 'ලබාගත හැකි ප්‍රමාණ (Available Sizes)' : 'Available Sizes'}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ad.sizes.map((s) => (
                      <span key={s} className="bg-white text-slate-800 text-xs font-bold px-2 py-0.5 rounded border border-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ad.totalQuantity && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'මුළු තොග ප්‍රමාණය' : 'Total Quantity'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.totalQuantity.toLocaleString()} pieces</span>
                </div>
              )}

              {ad.minOrderQuantity && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'අවම ඇණවුම (MOQ)' : 'Minimum Order Qty'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.minOrderQuantity} pieces</span>
                </div>
              )}

              {ad.brand && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'වෙළඳ නාමය (Brand)' : 'Brand'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.brand}</span>
                </div>
              )}

              {ad.model && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'මොඩලය (Model)' : 'Model'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.model}</span>
                </div>
              )}

              {ad.condition && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'තත්වය' : 'Condition'}</span>
                  <span className="text-sm font-bold text-slate-800 capitalize">
                    {ad.condition === 'brand_new' && (language === 'si' ? 'අලුත්ම (Brand New)' : 'Brand New')}
                    {ad.condition === 'reconditioned' && (language === 'si' ? 'රීකන්ඩිෂන් (Reconditioned)' : 'Reconditioned')}
                    {ad.condition === 'used' && (language === 'si' ? 'පාවිච්චි කල (Used)' : 'Used')}
                  </span>
                </div>
              )}

              {ad.warrantyMonths && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'වගකීම' : 'Warranty'}</span>
                  <span className="text-sm font-bold text-emerald-700">{ad.warrantyMonths} Months Warranty</span>
                </div>
              )}

              {ad.experienceYears && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">{language === 'si' ? 'පළපුරුද්ද' : 'Experience'}</span>
                  <span className="text-sm font-bold text-slate-800">{ad.experienceYears} Years in Industry</span>
                </div>
              )}

              {ad.isEmergencyAvailable && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                  <span className="text-xs text-red-600 block">{language === 'si' ? 'හදිසි බිඳවැටීම් සේවය' : 'Emergency Service'}</span>
                  <span className="text-sm font-black text-red-700">24/7 Islandwide Emergency</span>
                </div>
              )}

              {/* Machine Operator Attributes */}
              {ad.category === 'operators' && (
                <>
                  {ad.operatorTier && (
                    <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
                      <span className="text-xs text-teal-800 font-bold block">{language === 'si' ? 'ඔපරේටර් ශ්‍රේණිය' : 'Operator Tier'}</span>
                      <span className="text-sm font-black text-slate-900 uppercase">{ad.operatorTier.replace('_', ' ')}</span>
                    </div>
                  )}

                  {ad.dailyRate && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block">{language === 'si' ? 'දෛනික ගාස්තුව' : 'Daily Piece/Day Rate'}</span>
                      <span className="text-sm font-bold text-emerald-700">රු. {ad.dailyRate.toLocaleString()} / Day</span>
                    </div>
                  )}

                  {ad.availability && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block">{language === 'si' ? 'ලබාගත හැකි කාලය' : 'Availability'}</span>
                      <span className="text-sm font-bold text-slate-800 capitalize">{ad.availability}</span>
                    </div>
                  )}

                  {ad.machineSkills && ad.machineSkills.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-1 sm:col-span-2 lg:col-span-3">
                      <span className="text-xs text-slate-500 block mb-1">{language === 'si' ? 'ප්‍රගුණ කර ඇති මැෂින් කුසලතා' : 'Machine Skills & Competencies'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ad.machineSkills.map((sk) => (
                          <span key={sk} className="bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-teal-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Description Text */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-2">{t.adDetails.description}</h4>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                {language === 'si' ? (ad.descriptionSi || ad.description) : ad.description}
              </div>
            </div>

            {/* Safety & Verification advice */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {language === 'si' ? 'ආරක්ෂිත ගනුදෙනු උපදෙස් (Safety Tips)' : 'Safe Trading Advice'}
                </span>
                <p className="text-amber-800">
                  {language === 'si'
                    ? 'මැෂින් මිලදී ගැනීමේදී භාණ්ඩය පරීක්ෂා කර බලා මුදල් ගෙවන්න. සබ් ඕඩර්ස් ලබාදීමේදී හෝ ගැනීමේදී නියැදි (Sample pieces) පරීක්ෂා කිරීමෙන් පසු ගිවිසුම්ගත වන්න.'
                    : 'Inspect machinery and test operation in person before final payment. For subcontracts, always approve production samples prior to bulk dispatch.'}
                </p>
              </div>
            </div>
          </div>

          {/* Similar Ads section */}
          {similarAds.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h4 className="text-base font-bold text-slate-900 mb-3">{t.adDetails.similarAds}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarAds.map((simAd) => (
                  <div
                    key={simAd.id}
                    onClick={() => {
                      onSelectSimilarAd(simAd);
                      setActiveImageIndex(0);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:shadow-md cursor-pointer transition-all flex items-center gap-3"
                  >
                    <img
                      src={simAd.images[0]}
                      alt={simAd.title}
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold text-slate-800 truncate">
                        {language === 'si' ? (simAd.titleSi || simAd.title) : simAd.title}
                      </h5>
                      <span className="text-xs font-black text-amber-600 block">
                        රු. {Number(simAd.pieceRate || simAd.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">{simAd.seller.city}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
