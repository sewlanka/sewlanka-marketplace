import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Flame, 
  Star, 
  Trash2, 
  Bell, 
  PlusCircle, 
  ArrowUpRight,
  Crown,
  Award,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  MapPin,
  CreditCard,
  LogOut,
  AlertCircle,
  Scissors,
  Percent,
  QrCode,
  Check,
  Wrench
} from 'lucide-react';
import { Ad, Language, MembershipTier, OperatorTier, TechnicianTier, NotificationItem, UserAccount } from '../types';
import { translations } from '../utils/translations';
import { 
  USER_MEMBERSHIPS, 
  OPERATOR_PACKAGES, 
  OPERATOR_UPGRADE_DISCOUNT_PERCENT, 
  TECHNICIAN_MEMBERSHIPS,
  BANK_ACCOUNTS,
  convertLkrToUsd,
  formatDualPrice,
  PAYPAL_CLIENT_ID 
} from '../data/sriLankaData';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  ads: Ad[];
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenPostAd: () => void;
  onOpenAdmin?: () => void;
  onSelectAd: (ad: Ad) => void;
  onUpgradeAd: (adId: string, newTier: 'top' | 'urgent') => void;
  onDeleteAd: (adId: string) => void;
  onUpgradeMembership: (tier: MembershipTier) => void;
  onUpgradeOperatorTier?: (tier: OperatorTier) => void;
  onUpgradeTechnicianTier?: (tier: TechnicianTier) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  language,
  ads,
  currentUser,
  onLogout,
  onOpenPostAd,
  onOpenAdmin,
  onSelectAd,
  onUpgradeAd,
  onDeleteAd,
  onUpgradeMembership,
  onUpgradeOperatorTier,
  onUpgradeTechnicianTier,
  notifications,
  onMarkNotificationRead,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'ads' | 'operator_ranking' | 'technician_plans' | 'membership' | 'notifications'>('ads');
  
  // Operator Upgrade State
  const [upgradingOpTier, setUpgradingOpTier] = useState<OperatorTier | null>(null);
  const [upgradePaymentMethod, setUpgradePaymentMethod] = useState<'card_paypal' | 'bank_transfer' | 'lanka_qr'>('bank_transfer');
  const [upgradeRef, setUpgradeRef] = useState('');
  
  // Technician Upgrade State
  const [upgradingTechTier, setUpgradingTechTier] = useState<TechnicianTier | null>(null);
  const [techUpgradeMethod, setTechUpgradeMethod] = useState<'card_paypal' | 'bank_transfer' | 'lanka_qr'>('card_paypal');
  const [techUpgradeRef, setTechUpgradeRef] = useState('');

  const [upgradeNotice, setUpgradeNotice] = useState<string | null>(null);

  // Filter ads belonging to current user or simulated for demo
  const userAds = currentUser
    ? ads.filter((a) => a.seller.name === currentUser.name || a.seller.phone === currentUser.phone || a.seller.nic === currentUser.nic)
    : ads.slice(0, 3);

  const pendingCount = userAds.filter((a) => a.status === 'pending').length;
  const activeCount = userAds.filter((a) => a.status === 'active').length;

  const membershipInfo = USER_MEMBERSHIPS[currentUser?.membershipTier || 'starter'];
  const currentOperatorTier: OperatorTier = currentUser?.operatorTier || 'bronze';
  const currentOpInfo = OPERATOR_PACKAGES[currentOperatorTier];
  const currentTechTier: TechnicianTier = currentUser?.technicianTier || 'silver';

  // Theme styling based on tier
  const getTierTheme = () => {
    switch (currentUser?.membershipTier) {
      case 'platinum':
        return {
          bannerBg: 'bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border-purple-500/40',
          accentText: 'text-purple-300',
          badge: 'bg-purple-900 text-purple-200 border border-purple-400',
          ring: 'ring-purple-500/30'
        };
      case 'gold':
        return {
          bannerBg: 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 border-amber-300',
          accentText: 'text-amber-950',
          badge: 'bg-amber-300 text-amber-950 border border-amber-500',
          ring: 'ring-amber-500/30'
        };
      case 'silver':
        return {
          bannerBg: 'bg-gradient-to-r from-slate-200 via-cyan-100 to-slate-300 text-slate-900 border-slate-400',
          accentText: 'text-cyan-900',
          badge: 'bg-slate-300 text-slate-800 border border-slate-400',
          ring: 'ring-cyan-500/30'
        };
      default:
        return {
          bannerBg: 'bg-slate-100 text-slate-800 border-slate-200',
          accentText: 'text-slate-600',
          badge: 'bg-slate-200 text-slate-700 border border-slate-300',
          ring: 'ring-slate-300'
        };
    }
  };

  const theme = getTierTheme();

  const handleConfirmOperatorUpgrade = (targetTier: OperatorTier) => {
    if (onUpgradeOperatorTier) {
      onUpgradeOperatorTier(targetTier);
    }
    const pkg = OPERATOR_PACKAGES[targetTier];
    setUpgradingOpTier(null);
    setUpgradeNotice(`සාර්ථකයි! ඔබගේ ඔපරේටර් ශ්‍රේණිය ${pkg.titleEn} දක්වා 25%ක ඩිස්කවුන්ට් එකක් සහිතව අප්ග්‍රේඩ් කරන ලදී!`);
    setTimeout(() => setUpgradeNotice(null), 4000);
  };

  const handleConfirmTechnicianUpgrade = (targetTier: TechnicianTier) => {
    if (onUpgradeTechnicianTier) {
      onUpgradeTechnicianTier(targetTier);
    }
    const pkg = TECHNICIAN_MEMBERSHIPS[targetTier];
    setUpgradingTechTier(null);
    setUpgradeNotice(`සාර්ථකයි! ඔබගේ කාර්මික ශිල්පී සබ්ස්ක්‍රිප්ෂන් ප්ලෑනය ${pkg.titleSi} ලෙස සක්‍රීය කරන ලදී!`);
    setTimeout(() => setUpgradeNotice(null), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Upgrade Success Notification */}
        {upgradeNotice && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black text-xs px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>{upgradeNotice}</span>
          </div>
        )}

        {/* User Profile Banner with Tier Theming */}
        <div className={`p-6 sm:p-7 border-b rounded-t-3xl relative overflow-hidden ${theme.bannerBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xl border border-white/30 shadow-md">
                {currentUser?.membershipTier === 'platinum' ? '👑' : currentUser?.membershipTier === 'gold' ? '⭐' : currentUser?.membershipTier === 'silver' ? '🥈' : '👤'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">
                    {currentUser?.name || 'SewLanka Member'}
                  </h2>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                    {membershipInfo?.titleEn || 'Free Member'}
                  </span>
                  {currentUser?.role === 'admin' && (
                    <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs opacity-90">
                  <span>📱 {currentUser?.phone || '077xxxxxxx'}</span>
                  <span>📍 {currentUser?.city || 'Colombo'}, {currentUser?.district || 'Western'}</span>
                  {currentUser?.nic && <span>🪪 NIC: {currentUser.nic}</span>}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {currentUser?.role === 'admin' && onOpenAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="bg-black/20 hover:bg-black/30 text-current font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'ඉවත් වන්න' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs (5 Tabs) */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ads'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'මගේ දැන්වීම්' : 'My Advertisements'}</span>
            <span className="bg-slate-900/10 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {userAds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('operator_ranking')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'operator_ranking'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'si' ? 'මැසින් ඔපරේටර් ශ්‍රේණිගත කිරීම (25% OFF)' : 'Operator Ranking (25% OFF)'}</span>
            <span className="bg-teal-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase">
              {currentOperatorTier}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('technician_plans')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'technician_plans'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'si' ? 'කාර්මික සබ්ස්ක්‍රිප්ෂන් ප්ලෑන්' : 'Technician Subscriptions'}</span>
            <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase">
              {currentTechTier}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'membership'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'si' ? 'සාමාජිකත්වය' : 'Membership Tier'}</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'si' ? 'දැනුම්දීම්' : 'Notifications'}</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="p-6 sm:p-7">
          
          {/* TAB 1: USER'S ADS */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  {userAds.length} {language === 'si' ? 'දැන්වීම් හමුවිය' : 'advertisements listed'}
                </span>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPostAd();
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'si' ? 'නව දැන්වීමක් එක් කරන්න' : 'Post New Ad'}</span>
                </button>
              </div>

              {userAds.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500">
                    {language === 'si' ? 'ඔබ තවමත් කිසිදු දැන්වීමක් පළ කර නොමැත.' : 'You have not posted any ads yet.'}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPostAd();
                    }}
                    className="mt-3 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    {language === 'si' ? 'දැන්ම පළමු දැන්වීම පළ කරන්න' : 'Post Your First Ad Now'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ad.images[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                          alt={ad.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer"
                          onClick={() => {
                            onClose();
                            onSelectAd(ad);
                          }}
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                              ad.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ad.status === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {ad.status === 'pending' ? 'Pending Review (24h)' : ad.status}
                            </span>

                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                              ad.tier === 'urgent'
                                ? 'bg-red-100 text-red-700'
                                : ad.tier === 'top'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ad.tier}
                            </span>

                            <span className="text-[11px] text-slate-500">
                              • {ad.views} views
                            </span>
                          </div>

                          <h4 
                            onClick={() => {
                              onClose();
                              onSelectAd(ad);
                            }}
                            className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:text-amber-600 cursor-pointer"
                          >
                            {language === 'si' ? (ad.titleSi || ad.title) : ad.title}
                          </h4>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-slate-900">
                              රු. {ad.price.toLocaleString()}
                            </span>
                            {ad.price > 0 && (
                              <span className="text-[10px] text-slate-400 font-semibold">
                                (${convertLkrToUsd(ad.price).toFixed(2)} USD)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ad Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        {ad.tier === 'normal' && (
                          <button
                            onClick={() => onUpgradeAd(ad.id, 'top')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Upgrade Top</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteAd(ad.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MACHINE OPERATOR RANKING & UPGRADE (WITH 25% DISCOUNT AS REQUESTED) */}
          {activeTab === 'operator_ranking' && (
            <div className="space-y-5">
              {/* Highlight Banner on 25% discount rule */}
              <div className="bg-gradient-to-r from-teal-900 to-indigo-950 text-white rounded-2xl p-5 border border-teal-500/30 relative overflow-hidden shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2">
                      <Percent className="w-3 h-3" />
                      <span>25% Upgrade Discount Offer</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black">
                      {language === 'si' ? 'මැසින් ඔපරේටර් ශ්‍රේණිගත කිරීම සහ අප්ග්‍රේඩ් කිරීම' : 'Machine Operator Ranking & Package Upgrade'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      {language === 'si'
                        ? 'ඔබ දැනට සිටින පැකේජයේ සිට ඊළඟ ඉහළ පැකේජයට අප්ග්‍රේඩ් වීමේදී, ඔබ තෝරාගන්නා පැකේජයේ මුළු මුදලෙන් 25%ක විශේෂ ඩිස්කවුන්ට් එකක් ක්ෂණිකව අඩුවේ!'
                        : 'Upgrade from your current package to any higher tier and receive an automatic 25% discount on the chosen package total!'}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 text-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">දැනට පවතින ශ්‍රේණිය</span>
                    <span className="text-base font-black uppercase text-white block mt-0.5">
                      {currentOpInfo.titleEn}
                    </span>
                    <span className="text-[10px] text-teal-300 block mt-0.5">{currentOpInfo.periodEn}</span>
                  </div>
                </div>
              </div>

              {/* Operator Packages Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {(['bronze', 'silver', 'gold', 'platinum', 'platinum_lifetime'] as OperatorTier[]).map((tierKey) => {
                  const item = OPERATOR_PACKAGES[tierKey];
                  const isCurrent = currentOperatorTier === tierKey;
                  const isHigher = item.rank > currentOpInfo.rank;

                  // 25% Discount calculation
                  const originalPrice = item.feeLkr;
                  const discountVal = isHigher ? Math.round((originalPrice * OPERATOR_UPGRADE_DISCOUNT_PERCENT) / 100) : 0;
                  const discountedPrice = Math.max(0, originalPrice - discountVal);

                  return (
                    <div
                      key={tierKey}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all relative ${
                        isCurrent
                          ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {tierKey === 'platinum_lifetime' && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                          LIFETIME VIP
                        </div>
                      )}

                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1.5 ${item.badgeColor}`}>
                          Tier {item.rank} • {item.periodEn}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {language === 'si' ? item.titleSi : item.titleEn}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {language === 'si' ? item.perksSi : item.perksEn}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4">
                        {/* Price with 25% discount display */}
                        <div className="mb-3">
                          {isCurrent ? (
                            <span className="text-xs font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                              ඔබ දැනට සිටින ශ්‍රේණිය (Active)
                            </span>
                          ) : isHigher ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="line-through text-xs text-slate-400">
                                  රු. {originalPrice.toLocaleString()} (${convertLkrToUsd(originalPrice).toFixed(2)})
                                </span>
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                  25% OFF
                                </span>
                              </div>
                              <span className="text-base font-black text-slate-900 block mt-0.5">
                                රු. {discountedPrice.toLocaleString()} <span className="text-xs font-semibold text-emerald-700">(${convertLkrToUsd(discountedPrice).toFixed(2)} USD)</span>
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-black text-slate-900">
                              {originalPrice === 0 ? 'නොමිලේ (Free / $0.00)' : `රු. ${originalPrice.toLocaleString()} ($${convertLkrToUsd(originalPrice).toFixed(2)} USD)`}
                            </span>
                          )}
                        </div>

                        {/* Upgrade Button */}
                        {isCurrent ? (
                          <div className="bg-teal-100 text-teal-800 text-[11px] font-black text-center py-2 rounded-xl">
                            Active Package
                          </div>
                        ) : isHigher ? (
                          <button
                            onClick={() => setUpgradingOpTier(tierKey)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>25% වට්ටම සහිතව අප්ග්‍රේඩ්</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-slate-100 text-slate-400 font-semibold text-xs py-1.5 rounded-xl cursor-not-allowed"
                          >
                            Lower Tier
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upgrade Confirmation Modal with Payment Method */}
              {upgradingOpTier && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <h4 className="text-base font-black text-slate-900">
                          {language === 'si' ? 'ඔපරේටර් ශ්‍රේණිය අප්ග්‍රේඩ් කිරීම' : 'Confirm Operator Upgrade'}
                        </h4>
                      </div>
                      <button
                        onClick={() => setUpgradingOpTier(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Price details with 25% discount */}
                    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex justify-between text-slate-700">
                        <span>ඉලක්කගත පැකේජය:</span>
                        <strong className="text-slate-900">{OPERATOR_PACKAGES[upgradingOpTier].titleEn}</strong>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>සාමාන්‍ය මිල:</span>
                        <span className="line-through">රු. {OPERATOR_PACKAGES[upgradingOpTier].feeLkr.toLocaleString()} (${convertLkrToUsd(OPERATOR_PACKAGES[upgradingOpTier].feeLkr).toFixed(2)})</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-bold bg-emerald-100/60 p-2 rounded-xl">
                        <span>25% Upgrade Discount:</span>
                        <span>- රු. {Math.round((OPERATOR_PACKAGES[upgradingOpTier].feeLkr * 25) / 100).toLocaleString()} (-${convertLkrToUsd(Math.round((OPERATOR_PACKAGES[upgradingOpTier].feeLkr * 25) / 100)).toFixed(2)})</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-teal-200">
                        <span>ගෙවිය යුතු මුදල:</span>
                        <div className="text-right">
                          <span className="text-emerald-700 block">
                            රු. {Math.max(0, OPERATOR_PACKAGES[upgradingOpTier].feeLkr - Math.round((OPERATOR_PACKAGES[upgradingOpTier].feeLkr * 25) / 100)).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            ≈ ${convertLkrToUsd(Math.max(0, OPERATOR_PACKAGES[upgradingOpTier].feeLkr - Math.round((OPERATOR_PACKAGES[upgradingOpTier].feeLkr * 25) / 100))).toFixed(2)} USD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        ගෙවීම් ක්‍රමය තෝරන්න (Select Payment):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'card_paypal', label: 'Card / PayPal', icon: CreditCard },
                          { id: 'bank_transfer', label: 'බැංකු තැන්පතු', icon: Building2 },
                          { id: 'lanka_qr', label: 'LankaQR Scan', icon: QrCode },
                        ].map((pm) => {
                          const Icon = pm.icon;
                          const isSel = upgradePaymentMethod === pm.id;
                          return (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setUpgradePaymentMethod(pm.id as any)}
                              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                isSel
                                  ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 font-bold text-slate-900'
                                  : 'border-slate-200 bg-white text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                              <span className="text-[11px] block">{pm.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ගෙවීම් රිෆරන්ස් අංකය / ට්‍රාන්ස්ඇක්ෂන් ID *
                      </label>
                      <input
                        type="text"
                        value={upgradeRef}
                        onChange={(e) => setUpgradeRef(e.target.value)}
                        placeholder="e.g. BOC-TX-984124 or PP-98412"
                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setUpgradingOpTier(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        අවලංගු කරන්න
                      </button>
                      <button
                        onClick={() => handleConfirmOperatorUpgrade(upgradingOpTier)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>අප්ග්‍රේඩ් තහවුරු කරන්න (Confirm)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TECHNICIAN SUBSCRIPTION PLANS (MONTHLY RECURRING & DUAL LKR/USD PRICING) */}
          {activeTab === 'technician_plans' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-5 border border-indigo-500/30 relative overflow-hidden shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2">
                      <Wrench className="w-3 h-3 text-indigo-300" />
                      <span>Certified Mechanic Subscriptions</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black">
                      {language === 'si' ? 'මැෂින් රෙපයාර්කරුවන්ගේ මාසික සබ්ස්ක්‍රිප්ෂන් ප්ලෑන්' : 'Technician Subscription Plans'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      {language === 'si'
                        ? 'කාර්මික ශිල්පී පැකේජ සඳහා මූලික ගාස්තුවට අමතරව මාසික දායකත්ව ගාස්තුවක් (Silver: රු.100, Gold: රු.200, Platinum: රු.300) අයවේ. Platinum Lifetime හිමිකරුවන්ට කිසිදු මාසික ගාස්තුවක් නැත!'
                        : 'Accreditation includes initial joining fee plus monthly subscription (Silver: Rs.100, Gold: Rs.200, Platinum: Rs.300). Lifetime VIP has zero monthly fees!'}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 text-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">ඔබේ වත්මන් තත්වය</span>
                    <span className="text-base font-black uppercase text-white block mt-0.5">
                      {TECHNICIAN_MEMBERSHIPS[currentTechTier]?.titleEn || 'Silver Mechanic'}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      {TECHNICIAN_MEMBERSHIPS[currentTechTier]?.monthlyTextSi}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Technician Subscription Cards with Dual Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {(['silver', 'gold', 'platinum', 'platinum_lifetime'] as TechnicianTier[]).map((tKey) => {
                  const item = TECHNICIAN_MEMBERSHIPS[tKey];
                  const isCurrent = currentTechTier === tKey;

                  return (
                    <div
                      key={tKey}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all relative ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {tKey === 'platinum_lifetime' && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                          LIFETIME FREE
                        </div>
                      )}

                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1.5 ${item.badgeColor}`}>
                          {tKey.replace('_', ' ').toUpperCase()}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {language === 'si' ? item.titleSi : item.titleEn}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {language === 'si' ? item.descSi : item.descEn}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">මූලික ගාස්තුව (Initial Fee)</span>
                          <span className="text-sm font-black text-slate-800">
                            රු. {item.initialFeeLkr.toLocaleString()} <span className="text-xs font-semibold text-slate-500">(${item.initialFeeUsd} USD)</span>
                          </span>
                        </div>

                        <div className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                          tKey === 'platinum_lifetime' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <span className="font-bold">මාසික දායකත්වය:</span>
                          <span className="font-black">
                            {tKey === 'platinum_lifetime' 
                              ? 'රු. 0 (Free)' 
                              : `රු. ${item.monthlySubscriptionLkr}/මසකට ($${item.monthlySubscriptionUsd})`}
                          </span>
                        </div>

                        {/* Action button */}
                        {isCurrent ? (
                          <div className="bg-indigo-100 text-indigo-900 text-[11px] font-black text-center py-2 rounded-xl">
                            දැනට සක්‍රීයයි (Active)
                          </div>
                        ) : (
                          <button
                            onClick={() => setUpgradingTechTier(tKey)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <span>සබ්ස්ක්‍රයිබ් කරන්න</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Technician Subscription Modal */}
              {upgradingTechTier && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-base font-black text-slate-900">
                          {language === 'si' ? 'කාර්මික ශිල්පී සබ්ස්ක්‍රිප්ෂන් තහවුරු කිරීම' : 'Confirm Technician Subscription'}
                        </h4>
                      </div>
                      <button
                        onClick={() => setUpgradingTechTier(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Subscription breakdown with LKR and USD */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex justify-between text-slate-700">
                        <span>තෝරාගත් පැකේජය:</span>
                        <strong className="text-indigo-950">{TECHNICIAN_MEMBERSHIPS[upgradingTechTier].titleSi}</strong>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>මූලික ලියාපදිංචි ගාස්තුව:</span>
                        <span className="font-bold text-slate-900">
                          රු. {TECHNICIAN_MEMBERSHIPS[upgradingTechTier].initialFeeLkr.toLocaleString()} (${TECHNICIAN_MEMBERSHIPS[upgradingTechTier].initialFeeUsd} USD)
                        </span>
                      </div>
                      <div className="flex justify-between text-indigo-700 font-bold bg-white/80 p-2 rounded-xl border border-indigo-200">
                        <span>මාසික සබ්ස්ක්‍රිප්ෂන් ගාස්තුව:</span>
                        <span>{TECHNICIAN_MEMBERSHIPS[upgradingTechTier].monthlyTextSi}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-indigo-200">
                        <span>දැන් ගෙවිය යුතු මූලික මුදල:</span>
                        <div className="text-right">
                          <span className="text-indigo-900 block">
                            රු. {TECHNICIAN_MEMBERSHIPS[upgradingTechTier].initialFeeLkr.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            ≈ ${TECHNICIAN_MEMBERSHIPS[upgradingTechTier].initialFeeUsd} USD (PayPal Live)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        ගෙවීම් ක්‍රමය (Payment Method):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'card_paypal', label: 'Card / PayPal', icon: CreditCard },
                          { id: 'bank_transfer', label: 'බැංකු තැන්පතු', icon: Building2 },
                          { id: 'lanka_qr', label: 'LankaQR Scan', icon: QrCode },
                        ].map((pm) => {
                          const Icon = pm.icon;
                          const isSel = techUpgradeMethod === pm.id;
                          return (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setTechUpgradeMethod(pm.id as any)}
                              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                isSel
                                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-400 font-bold text-slate-900'
                                  : 'border-slate-200 bg-white text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                              <span className="text-[11px] block">{pm.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ට්‍රාන්ස්ඇක්ෂන් / PayPal රිෆරන්ස් අංකය *
                      </label>
                      <input
                        type="text"
                        value={techUpgradeRef}
                        onChange={(e) => setTechUpgradeRef(e.target.value)}
                        placeholder="e.g. PP-TECH-8924 or BOC-29402"
                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setUpgradingTechTier(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        අවලංගු කරන්න
                      </button>
                      <button
                        onClick={() => handleConfirmTechnicianUpgrade(upgradingTechTier)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>සබ්ස්ක්‍රිප්ෂන් සක්‍රීය කරන්න</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GENERAL MEMBERSHIP & SEARCH RANKING */}
          {activeTab === 'membership' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                <span className="font-bold text-amber-900 block">
                  {language === 'si' ? 'SewLanka ශ්‍රේණිගත කිරීමේ ඇල්ගොරිතමය (Ranking Algorithm):' : 'Search & Directory Priority Ranking:'}
                </span>
                <p>
                  {language === 'si'
                    ? 'ඔබගේ සාමාජික ශ්‍රේණිය (Tier) ඉහළ යන තරමට, ඔබගේ දැන්වීම් වෙබ් අඩවියේ සෙවුම් ප්‍රතිඵල සහ කාණ්ඩ වල ඉහළින්ම ප්‍රදර්ශනය වේ.'
                    : 'Higher membership tiers automatically rank higher in search listings, leading to significantly higher leads.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['silver', 'gold', 'platinum'] as MembershipTier[]).map((mTier) => {
                  const item = USER_MEMBERSHIPS[mTier];
                  const isCurrent = currentUser?.membershipTier === mTier;
                  return (
                    <div
                      key={mTier}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                          Tier {item.rank}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {language === 'si' ? item.titleSi : item.titleEn}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {language === 'si' ? item.perksSi : item.perksEn}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <div className="mb-2">
                          <span className="text-sm font-black text-slate-900 block">
                            රු. {item.feeLkr.toLocaleString()} / yr
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold block">
                            (${convertLkrToUsd(item.feeLkr).toFixed(2)} USD)
                          </span>
                        </div>
                        {isCurrent ? (
                          <div className="bg-emerald-100 text-emerald-800 text-[11px] font-black text-center py-1.5 rounded-lg">
                            Current Tier
                          </div>
                        ) : (
                          <button
                            onClick={() => onUpgradeMembership(mTier)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer"
                          >
                            Upgrade
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/60 border-amber-200 ring-1 ring-amber-300/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {language === 'si' ? notif.titleSi : notif.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'si' ? notif.messageSi : notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
