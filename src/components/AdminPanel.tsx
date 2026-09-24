import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Users, 
  FileText, 
  Flame, 
  Star, 
  ExternalLink, 
  Check, 
  Eye, 
  Trash2, 
  ArrowUpRight,
  Filter,
  BadgeAlert,
  UserCheck,
  Phone,
  MessageSquare,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  Package,
  Award,
  Crown,
  Tag,
  Plus,
  Copy,
  HelpCircle,
  CreditCard,
  Percent,
  Settings
} from 'lucide-react';
import { Ad, AdTier, Language, TechnicianTier, UserAccount, MembershipTier, PromoCode, BankAccount, QRPaymentSetting } from '../types';
import { translations } from '../utils/translations';
import { AD_PRICING, TECHNICIAN_MEMBERSHIPS, USER_MEMBERSHIPS, DEFAULT_PROMO_CODES, BANK_ACCOUNTS, DEFAULT_QR_SETTINGS } from '../data/sriLankaData';

interface AdminPanelProps {
  ads: Ad[];
  users: UserAccount[];
  onApproveAd: (adId: string) => void;
  onRejectAd: (adId: string, reason: string) => void;
  onDeleteAd: (adId: string) => void;
  onUpgradeTier: (adId: string, newTier: 'normal' | 'top' | 'urgent') => void;
  onUpdateTechnicianTier: (adId: string, newTier: TechnicianTier) => void;
  onActivateUser: (userId: string) => void;
  onUpdateUserMembership: (userId: string, tier: MembershipTier) => void;
  language: Language;
  onClose: () => void;
  promoCodes?: PromoCode[];
  onAddPromoCode?: (code: PromoCode) => void;
  onDeletePromoCode?: (codeId: string) => void;
  onTogglePromoCode?: (codeId: string) => void;
  bankAccounts?: BankAccount[];
  onUpdateBankAccounts?: (accounts: BankAccount[]) => void;
  qrSettings?: QRPaymentSetting;
  onUpdateQRSettings?: (settings: QRPaymentSetting) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  ads,
  users,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onUpgradeTier,
  onUpdateTechnicianTier,
  onActivateUser,
  onUpdateUserMembership,
  language,
  onClose,
  promoCodes = DEFAULT_PROMO_CODES,
  onAddPromoCode,
  onDeletePromoCode,
  onTogglePromoCode,
  bankAccounts = BANK_ACCOUNTS,
  onUpdateBankAccounts,
  qrSettings = DEFAULT_QR_SETTINGS,
  onUpdateQRSettings,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'all' | 'technicians' | 'payments' | 'promos'>('pending');
  const [tierFilter, setTierFilter] = useState<'all' | 'urgent' | 'top' | 'normal'>('all');
  const [rejectingAdId, setRejectingAdId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete contact details or low quality images');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Promo Code Form State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState<number | ''>(20);
  const [newPromoMinSpend, setNewPromoMinSpend] = useState<number | ''>(500);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Bank Account Form State
  const [newBankName, setNewBankName] = useState('');
  const [newBankAccNumber, setNewBankAccNumber] = useState('');
  const [newBankAccName, setNewBankAccName] = useState('SewLanka Classifieds (Pvt) Ltd');
  const [newBankBranch, setNewBankBranch] = useState('');

  // LankaQR Form State
  const [qrMerchant, setQrMerchant] = useState(qrSettings.merchantName);
  const [qrUrl, setQrUrl] = useState(qrSettings.qrImageUrl);
  const [qrInstructionsSi, setQrInstructionsSi] = useState(qrSettings.instructionsSi);
  const [qrInstructionsEn, setQrInstructionsEn] = useState(qrSettings.instructionsEn);

  const pendingAds = ads.filter((a) => a.status === 'pending');
  const filteredPendingAds = pendingAds.filter((a) => {
    if (tierFilter === 'all') return true;
    return a.tier === tierFilter;
  });

  const activeAds = ads.filter((a) => a.status === 'active');
  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeUsers = users.filter((u) => u.status === 'active');
  const technicianAds = ads.filter((a) => a.category === 'technicians');

  // Revenue calculation
  const totalRevenue = ads.reduce((acc, ad) => {
    if (ad.totalCostLkr) return acc + ad.totalCostLkr;
    if (ad.tier === 'urgent') return acc + AD_PRICING.urgent.priceLkr;
    if (ad.tier === 'top') return acc + AD_PRICING.top.priceLkr;
    return acc;
  }, 0);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleApprove = (id: string) => {
    onApproveAd(id);
    triggerNotice(
      language === 'si'
        ? 'දැන්වීම සාර්ථකව අනුමත කර සජීවීව පළ කරන ලදී!'
        : 'Ad successfully approved and published live!'
    );
  };

  const handleConfirmReject = (id: string) => {
    onRejectAd(id, rejectionReason);
    setRejectingAdId(null);
    triggerNotice(
      language === 'si'
        ? 'දැන්වීම ප්‍රතික්ෂේප කර පරිශීලකයාට දැනුම් දෙන ලදී.'
        : 'Ad rejected and notification sent to user.'
    );
  };

  const handleActivateUserAccount = (user: UserAccount) => {
    onActivateUser(user.id);
    triggerNotice(
      language === 'si'
        ? `${user.name} (${user.username}) ගිණුම සාර්ථකව සක්‍රිය කරන ලදී!`
        : `Account for ${user.name} (${user.username}) has been activated!`
    );
  };

  // Promo code creation
  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim() || !newPromoValue) return;

    const promo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountType: newPromoType,
      discountValue: Number(newPromoValue),
      minSpend: Number(newPromoMinSpend) || 0,
      isActive: true,
      description: newPromoDesc || `${newPromoValue}${newPromoType === 'percentage' ? '%' : ' LKR'} Discount Code`,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    if (onAddPromoCode) {
      onAddPromoCode(promo);
    }
    setNewPromoCode('');
    setNewPromoValue(20);
    setNewPromoMinSpend(500);
    setNewPromoDesc('');
    triggerNotice(`නව ප්‍රමෝ කේතය "${promo.code}" සාර්ථකව නිර්මාණය විය!`);
  };

  // Bank account creation
  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim() || !newBankAccNumber.trim()) return;

    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName.trim(),
      bankNameSi: newBankName.trim(),
      accountNumber: newBankAccNumber.trim(),
      accountName: newBankAccName.trim() || 'SewLanka Classifieds',
      branch: newBankBranch.trim() || 'Colombo',
      isActive: true
    };

    const updated = [...bankAccounts, newAccount];
    if (onUpdateBankAccounts) {
      onUpdateBankAccounts(updated);
    }
    setNewBankName('');
    setNewBankAccNumber('');
    setNewBankBranch('');
    triggerNotice(`බැංකු ගිණුම සාර්ථකව ඇතුළත් කරන ලදී!`);
  };

  const handleDeleteBankAccount = (id: string) => {
    const updated = bankAccounts.filter((b) => b.id !== id);
    if (onUpdateBankAccounts) {
      onUpdateBankAccounts(updated);
    }
    triggerNotice('බැංකු ගිණුම ඉවත් කරන ලදී.');
  };

  // Save LankaQR Settings
  const handleSaveQRSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQR: QRPaymentSetting = {
      merchantName: qrMerchant,
      qrImageUrl: qrUrl,
      instructionsSi: qrInstructionsSi,
      instructionsEn: qrInstructionsEn
    };
    if (onUpdateQRSettings) {
      onUpdateQRSettings(updatedQR);
    }
    triggerNotice('LankaQR විස්තර සාර්ථකව යාවත්කාලීන විය!');
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 sm:p-8 mb-8 border border-slate-800 shadow-2xl relative">
      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                {language === 'si' ? 'SewLanka ඇඩ්මින් පාලක පුවරුව' : 'SewLanka Admin Control Panel'}
              </h2>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                Staff Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'si'
                ? 'පරිශීලක ලියාපදිංචි, ගෙවීම් (Bank/QR), ප්‍රමෝ කේත සහ දැන්වීම් කළමනාකරණය'
                : 'Review ads, manage user NIC verification, payment accounts, and discount codes'}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="self-end sm:self-auto bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-700"
        >
          {language === 'si' ? 'පාලක පුවරුව වසන්න' : 'Close Admin'}
        </button>
      </div>

      {/* Live Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{language === 'si' ? 'පෙන්ඩින් දැන්වීම්' : 'Pending Ads'}</span>
            <BadgeAlert className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400">{pendingAds.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Review within 24h</span>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{language === 'si' ? 'පෙන්ඩින් පරිශීලකයින්' : 'Pending Users'}</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-400">{pendingUsers.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Awaiting NIC review</span>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{language === 'si' ? 'සක්‍රිය ප්‍රමෝ කේත' : 'Active Promos'}</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400">{promoCodes.filter(p => p.isActive).length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Discount codes live</span>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{language === 'si' ? 'දළ ආදායම' : 'Total Revenue'}</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">රු. {totalRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Top & Urgent packages</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BadgeAlert className="w-4 h-4" />
          <span>{language === 'si' ? 'පෙන්ඩින් දැන්වීම්' : 'Pending Ads'}</span>
          {pendingAds.length > 0 && (
            <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingAds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'si' ? 'පරිශීලකයින්' : 'Users'}</span>
          {pendingUsers.length > 0 && (
            <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{language === 'si' ? 'බැංකු & QR විස්තර (Payments)' : 'Bank & QR Accounts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'promos'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{language === 'si' ? 'ප්‍රමෝ කෝඩ් (Promo Codes)' : 'Discount Codes'}</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'si' ? 'සියලු දැන්වීම්' : 'All Ads'} ({ads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('technicians')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'technicians'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'si' ? 'කාර්මික ශිල්පීන්' : 'Technicians'} ({technicianAds.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING ADS QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-xs text-slate-300 font-semibold">
              {language === 'si' ? 'දැන්වීම් වර්ගය අනුව පෙරන්න (Filter by Ad Tier):' : 'Filter by Ad Tier:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Tiers' },
                { id: 'urgent', label: '🚨 Urgent Priority' },
                { id: 'top', label: '⭐ Top Ads' },
                { id: 'normal', label: 'Silver / Normal' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTierFilter(tf.id as any)}
                  className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    tierFilter === tf.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {filteredPendingAds.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-bold text-slate-300">
                {language === 'si' ? 'අනුමැතියට නව දැන්වීම් නොමැත' : 'No ads waiting in pending queue'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'si' ? 'සියලුම දැන්වීම් සාර්ථකව පරීක්ෂා කර ඇත' : 'All incoming ads have been reviewed!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPendingAds.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={ad.images[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                      alt={ad.title}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-600 shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                          ad.tier === 'urgent'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : ad.tier === 'top'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {ad.tier} AD
                        </span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase font-semibold">
                          {ad.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {ad.seller.city}, {ad.seller.district}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white line-clamp-1">
                        {language === 'si' ? (ad.titleSi || ad.title) : ad.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {language === 'si' ? (ad.descriptionSi || ad.description) : ad.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>Seller: <strong className="text-white">{ad.seller.name}</strong></span>
                        <span>Phone: <strong className="text-amber-400">{ad.seller.phone}</strong></span>
                        {ad.paymentRef && (
                          <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                            Ref: {ad.paymentRef}
                          </span>
                        )}
                        {ad.totalCostLkr !== undefined && ad.totalCostLkr > 0 && (
                          <span className="text-emerald-400 font-bold">
                            Fee: රු. {ad.totalCostLkr.toLocaleString()}
                          </span>
                        )}
                        {ad.promoCode && (
                          <span className="text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                            Promo: {ad.promoCode} (-රු. {ad.discountAmount?.toLocaleString() || 0})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Approve, Reject, Delete */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700">
                    <button
                      onClick={() => handleApprove(ad.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{language === 'si' ? 'අනුමත කරන්න (Approve)' : 'Approve'}</span>
                    </button>

                    <button
                      onClick={() => setRejectingAdId(ad.id)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      {language === 'si' ? 'ප්‍රතික්ෂේප' : 'Reject'}
                    </button>

                    <button
                      onClick={() => onDeleteAd(ad.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rejection Reason Modal */}
          {rejectingAdId && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-slate-800 rounded-2xl p-5 max-w-md w-full border border-slate-700 space-y-3">
                <h4 className="text-base font-bold text-white">
                  {language === 'si' ? 'දැන්වීම ප්‍රතික්ෂේප කිරීමට හේතුව' : 'Reason for Rejection'}
                </h4>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectingAdId(null)}
                    className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    අවලංගු කරන්න
                  </button>
                  <button
                    onClick={() => handleConfirmReject(rejectingAdId)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
                  >
                    තහවුරු කරන්න (Confirm)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USERS & 24H NIC VERIFICATION */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {users.map((user) => {
              const waText = encodeURIComponent(
                `ආයුබෝවන් ${user.name}, ඔබගේ SewLanka ගිණුම සාර්ථකව සක්‍රිය කරන ලදී!`
              );
              return (
                <div
                  key={user.id}
                  className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'
                      }`}>
                        {user.status === 'pending' ? 'Pending NIC Review (24h)' : user.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">@{user.username}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{user.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>NIC: <strong className="text-amber-300 font-mono">{user.nic}</strong></span>
                      <span>Phone: <strong className="text-white">{user.phone}</strong></span>
                      <span>District: {user.district}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {user.status === 'pending' ? (
                      <button
                        onClick={() => handleActivateUserAccount(user)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <UserCheck className="w-4 h-4 stroke-[3]" />
                        <span>{language === 'si' ? 'ගිණුම සක්‍රිය කරන්න (Activate)' : 'Activate Account'}</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        Active Member
                      </span>
                    )}

                    <a
                      href={`https://wa.me/${user.whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <select
                      value={user.membershipTier}
                      onChange={(e) => onUpdateUserMembership(user.id, e.target.value as MembershipTier)}
                      className="text-[11px] bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-2 py-1.5 outline-none font-bold"
                    >
                      <option value="starter">Starter</option>
                      <option value="silver">Silver Tier</option>
                      <option value="gold">Gold Tier</option>
                      <option value="platinum">Platinum VIP</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: PAYMENT SETTINGS (BANK DETAILS & LANKAQR SECTION AS REQUESTED) */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>{language === 'si' ? 'බැංකු ගිණුම් කළමනාකරණය (Bank Account Details)' : 'Manage Bank Accounts'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'si' 
                ? 'පරිශීලකයින් Top / Urgent දැන්වීම් පළ කිරීමේදී ගෙවීම් කිරීමට මෙම බැංකු ගිණුම් විස්තර ප්‍රදර්ශනය වේ.' 
                : 'These bank details will be shown to users during ad checkout.'}
            </p>

            {/* Existing Bank Accounts List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
              {bankAccounts.map((b) => (
                <div key={b.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative group">
                  <button
                    onClick={() => handleDeleteBankAccount(b.id)}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-white text-sm">{b.bankName}</h4>
                  <span className="text-emerald-400 font-mono font-bold block mt-1 text-xs">
                    {b.accountNumber}
                  </span>
                  <span className="text-xs text-slate-300 block mt-0.5">{b.accountName}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{b.branch}</span>
                </div>
              ))}
            </div>

            {/* Add New Bank Account Form */}
            <form onSubmit={handleAddBankAccount} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 block">
                + නව බැංකු ගිණුමක් එක් කරන්න (Add New Bank)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="බැංකුවේ නම (e.g. Seylan Bank)"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  required
                  placeholder="ගිණුම් අංකය (Account Number)"
                  value={newBankAccNumber}
                  onChange={(e) => setNewBankAccNumber(e.target.value)}
                  className="bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white font-mono outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  placeholder="ගිණුම් හිමියාගේ නම (Account Name)"
                  value={newBankAccName}
                  onChange={(e) => setNewBankAccName(e.target.value)}
                  className="bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ශාඛාව (Branch)"
                    value={newBankBranch}
                    onChange={(e) => setNewBankBranch(e.target.value)}
                    className="flex-1 bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    එක් කරන්න
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* LankaQR Configuration Section */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>{language === 'si' ? 'LankaQR සහ QR ගෙවීම් විස්තර (LankaQR Settings)' : 'LankaQR Payment Settings'}</span>
            </h3>

            <form onSubmit={handleSaveQRSettings} className="space-y-3 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant Name</label>
                  <input
                    type="text"
                    value={qrMerchant}
                    onChange={(e) => setQrMerchant(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">QR Code Image Link (URL)</label>
                  <input
                    type="text"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">උපදෙස් (Sinhala Instructions)</label>
                <textarea
                  rows={2}
                  value={qrInstructionsSi}
                  onChange={(e) => setQrInstructionsSi(e.target.value)}
                  className="w-full bg-slate-800 text-xs p-3 rounded-xl border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  LankaQR විස්තර සුරකින්න (Save Settings)
                </button>
              </div>
            </form>
          </div>

          {/* PayPal Integration Reference for Admins */}
          <div className="bg-indigo-950/40 p-4.5 rounded-2xl border border-indigo-700/50 space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">
                PayPal Developer Integration (PayPal ලින්ක් කරන අයුරු)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. <strong>developer.paypal.com</strong> වෙත පිවිස Live REST API App එකක් සකස් කරන්න.<br />
              2. <strong>Client ID</strong> එක ලබාගෙන Frontend එකේ PayPal Buttons වෙත එක් කරන්න.<br />
              3. පරිශීලකයා Pay with PayPal ක්ලික් කළ විට ක්ෂණිකව capture වී ගෙවීම තහවුරු වේ.
            </p>
          </div>
        </div>
      )}

      {/* TAB: PROMO / DISCOUNT CODES (AS EXPLICITLY REQUESTED BY USER) */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>{language === 'si' ? 'ප්‍රමෝ ඩිස්කවුන්ට් කෝඩ් නිර්මාණය සහ කළමනාකරණය' : 'Promo & Discount Codes'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'si'
                ? 'ඇඩ්මින්ට කැමති පරිදි වට්ටම් කෝඩ් සාදා, පරිශීලකයා දැන්වීම් පළ කිරීමේදී සම්පූර්ණ මුදලින් එම ගණන හෝ සීයට ගාණ අඩු කිරීමට ඉඩ සලසන්න.'
                : 'Create percentage or fixed discount codes for ads that users can apply in checkout.'}
            </p>

            {/* Create Promo Code Form */}
            <form onSubmit={handleCreatePromoCode} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 my-4 space-y-3">
              <span className="text-xs font-bold text-amber-400 block">
                + නව ප්‍රමෝ ඩිස්කවුන්ට් කෝඩ් එකක් සාදන්න (Create Promo Code)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">කෝඩ් එක (Code)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEW50, OFFER25"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white font-mono uppercase font-bold outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">වට්ටම් වර්ගය (Type)</label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white font-bold outline-none"
                  >
                    <option value="percentage">සීයට ගණන (Percentage %)</option>
                    <option value="fixed">ස්ථාවර මුදලක් (Fixed LKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {newPromoType === 'percentage' ? 'වට්ටම (%)' : 'වට්ටම් මුදල (රු.)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newPromoValue}
                    onChange={(e) => setNewPromoValue(Number(e.target.value))}
                    placeholder="e.g. 20 or 500"
                    className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">අවම ඇණවුම (Min Spend LKR)</label>
                  <input
                    type="number"
                    value={newPromoMinSpend}
                    onChange={(e) => setNewPromoMinSpend(Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="w-full bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <input
                  type="text"
                  placeholder="විස්තරයක් (Description, e.g. Special Launch 25% Discount)"
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  className="flex-1 bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  කෝඩ් එක සාදන්න (Create)
                </button>
              </div>
            </form>

            {/* List of Promo Codes */}
            <div className="space-y-2.5 mt-4">
              <span className="text-xs font-bold text-slate-400 block">ක්‍රියාකාරී ප්‍රමෝ කේත ({promoCodes.length}):</span>
              {promoCodes.map((code) => (
                <div
                  key={code.id}
                  className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500/10 text-amber-300 font-mono font-black text-xs px-3 py-1 rounded-lg border border-amber-500/20">
                      {code.code}
                    </span>
                    <div>
                      <span className="text-xs text-white font-bold block">
                        {code.discountType === 'percentage' ? `${code.discountValue}% OFF` : `රු. ${code.discountValue} OFF`}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {code.description || 'General Discount'} • Min: රු. {code.minSpend || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTogglePromoCode && onTogglePromoCode(code.id)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        code.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {code.isActive ? 'Active (සක්‍රිය)' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => onDeletePromoCode && onDeletePromoCode(code.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ALL PUBLISHED ADS MANAGEMENT */}
      {activeTab === 'all' && (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={ad.images[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'}
                  alt={ad.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      ad.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ad.status}
                    </span>
                    <span className="text-xs text-slate-400">{ad.category}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">{ad.title}</h4>
                  <span className="text-xs text-amber-400 font-bold block mt-0.5">
                    රු. {ad.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tier Switcher and Delete */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={ad.tier}
                  onChange={(e) => onUpgradeTier(ad.id, e.target.value as any)}
                  className="text-xs bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 outline-none font-bold"
                >
                  <option value="normal">Normal (Silver)</option>
                  <option value="top">Top Ad (Green)</option>
                  <option value="urgent">Urgent Ad (Red Pulse)</option>
                </select>

                <button
                  onClick={() => onDeleteAd(ad.id)}
                  className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-2 rounded-xl border border-rose-800 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: TECHNICIANS DIRECTORY & VIP BADGES */}
      {activeTab === 'technicians' && (
        <div className="space-y-3">
          {technicianAds.map((tech) => (
            <div
              key={tech.id}
              className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    tech.technicianTier === 'platinum'
                      ? 'bg-purple-900 text-white border border-purple-400'
                      : tech.technicianTier === 'gold'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tech.technicianTier || 'Silver'} Member
                  </span>
                  <span className="text-xs text-slate-400">{tech.seller.city}, {tech.seller.district}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{tech.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{tech.seller.name} • {tech.seller.phone}</p>
              </div>

              {/* Tier Upgrade Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">Upgrade Tier:</span>
                <select
                  value={tech.technicianTier || 'silver'}
                  onChange={(e) => onUpdateTechnicianTier(tech.id, e.target.value as TechnicianTier)}
                  className="text-xs bg-slate-900 border border-slate-700 text-amber-400 font-bold rounded-xl px-3 py-1.5 outline-none"
                >
                  <option value="silver">Silver Mechanic</option>
                  <option value="gold">Gold Certified Mechanic</option>
                  <option value="platinum">Platinum VIP Master</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
