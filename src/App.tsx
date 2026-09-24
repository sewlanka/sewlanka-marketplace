/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scissors, 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Flame, 
  Star, 
  CheckCircle2, 
  Layers, 
  Users, 
  Wrench, 
  Shirt, 
  Cog, 
  FileCheck2, 
  Truck,
  Sparkles,
  LogIn,
  Crown
} from 'lucide-react';
import { Ad, AdTier, Category, Language, MembershipTier, NotificationItem, TechnicianTier, OperatorTier, UserAccount, PromoCode, BankAccount, QRPaymentSetting } from './types';
import { INITIAL_ADS, INITIAL_NOTIFICATIONS, INITIAL_USERS } from './data/seedData';
import { translations } from './utils/translations';
import { DEFAULT_PROMO_CODES, DEFAULT_QR_SETTINGS, BANK_ACCOUNTS, OPERATOR_PACKAGES } from './data/sriLankaData';
import { Header } from './components/Header';
import { UrgentBannerTicker } from './components/UrgentBannerTicker';
import { CategoryNav } from './components/CategoryNav';
import { FilterSidebar } from './components/FilterSidebar';
import { AdCard } from './components/AdCard';
import { AdDetailModal } from './components/AdDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { AdminPanel } from './components/AdminPanel';
import { TechniciansDirectory } from './components/TechniciansDirectory';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AuthModal } from './components/AuthModal';
import { supabase } from './utils/supabaseClient';
import { 
  fetchLiveAds, 
  fetchLiveProfiles, 
  createAdInSupabase, 
  updateAdInSupabase, 
  deleteAdFromSupabase, 
  createProfileInSupabase, 
  updateProfileInSupabase, 
  mapDbRowToAd, 
  mapProfileToUser,
  fetchLivePromoCodes,
  savePromoCodeToSupabase,
  deletePromoCodeFromSupabase,
  fetchLivePaymentSettings,
  savePaymentSettingsToSupabase
} from './utils/supabaseService';

export default function App() {
  // Application Language
  const [language, setLanguage] = useState<Language>('si');
  
  // Real-time Database State (No LocalStorage used!)
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Promo Codes, Bank Accounts & QR Settings
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(DEFAULT_PROMO_CODES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(BANK_ACCOUNTS);
  const [qrSettings, setQrSettings] = useState<QRPaymentSetting>(DEFAULT_QR_SETTINGS);

  // Filters & Navigation State
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('');
  const [codOnly, setCodOnly] = useState<boolean>(false);
  const [deliveryOnly, setDeliveryOnly] = useState<boolean>(false);
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Modals & Panels
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isMyAdsOpen, setIsMyAdsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Initial Load & Realtime Sync with Supabase (Zero LocalStorage)
  useEffect(() => {
    // 1. Initial live data load
    fetchLiveAds().then((liveAds) => {
      if (liveAds && liveAds.length > 0) {
        setAds(liveAds);
      }
    });

    fetchLiveProfiles().then((liveUsers) => {
      if (liveUsers && liveUsers.length > 0) {
        setUsers(liveUsers);
      }
    });

    fetchLivePromoCodes().then((livePromos) => {
      if (livePromos && livePromos.length > 0) {
        setPromoCodes(livePromos);
      }
    });

    fetchLivePaymentSettings().then((settings) => {
      if (settings) {
        if (settings.bankAccounts && settings.bankAccounts.length > 0) {
          setBankAccounts(settings.bankAccounts);
        }
        if (settings.qrSettings) {
          setQrSettings(settings.qrSettings);
        }
      }
    });

    // 2. Real-time Subscription for Ads table (instant live updates across all clients)
    const adsChannel = supabase
      .channel('live-ads-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ads' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const incomingAd = mapDbRowToAd(payload.new);
            setAds((prev) => {
              if (prev.some((a) => a.id === incomingAd.id)) return prev;
              return [incomingAd, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedAd = mapDbRowToAd(payload.new);
            setAds((prev) => prev.map((a) => (a.id === updatedAd.id ? updatedAd : a)));
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              setAds((prev) => prev.filter((a) => a.id !== oldId));
            }
          }
        }
      )
      .subscribe();

    // 3. Real-time Subscription for Profiles table
    const profilesChannel = supabase
      .channel('live-profiles-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const incomingUser = mapProfileToUser(payload.new);
            setUsers((prev) => {
              if (prev.some((u) => u.id === incomingUser.id)) return prev;
              return [...prev, incomingUser];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = mapProfileToUser(payload.new);
            setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
            setCurrentUser((curr) => (curr && curr.id === updatedUser.id ? { ...curr, ...updatedUser } : curr));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  const t = translations[language];

  // Helper counts per category (for active live ads)
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      all: 0,
      subcontract: 0,
      machines: 0,
      garments: 0,
      spare_parts: 0,
      technicians: 0,
      operators: 0,
    };
    ads.forEach((ad) => {
      if (ad.status === 'active') {
        counts.all += 1;
        if (counts[ad.category] !== undefined) {
          counts[ad.category] += 1;
        }
      }
    });
    return counts;
  }, [ads]);

  // Urgent Ads for Homepage & Categories
  const urgentAds = useMemo(() => {
    return ads.filter((ad) => ad.status === 'active' && ad.tier === 'urgent');
  }, [ads]);

  // Filtered public ads with RANKING ALGORITHM
  // 1. Operators ranking (Platinum Lifetime > Platinum > Gold > Silver > Bronze)
  // 2. Urgent priority ads
  // 3. Top priority ads
  // 4. User Membership ranking (Platinum VIP > Gold > Silver > Starter)
  // 5. Creation recency
  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => {
        // Public site only shows ACTIVE ads (pending ads must be approved by Admin)
        if (ad.status !== 'active') return false;

        // Category filter
        if (activeCategory !== 'all' && ad.category !== activeCategory) return false;

        // District filter (all 25 districts supported)
        if (selectedDistrict && ad.seller.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
          return false;
        }

        // Condition filter
        if (conditionFilter && ad.condition !== conditionFilter) return false;

        // COD filter
        if (codOnly && !ad.codAvailable) return false;

        // Delivery filter
        if (deliveryOnly && !ad.deliveryAvailable) return false;

        // Tier filter
        if (tierFilter !== 'all' && ad.tier !== tierFilter) return false;

        // Text Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (ad.title || '').toLowerCase().includes(q);
          const matchTitleSi = (ad.titleSi || '').toLowerCase().includes(q);
          const matchDesc = (ad.description || '').toLowerCase().includes(q);
          const matchCity = (ad.seller.city || '').toLowerCase().includes(q);
          const matchDistrict = (ad.seller.district || '').toLowerCase().includes(q);
          const matchBrand = (ad.brand || '').toLowerCase().includes(q);
          const matchSeller = (ad.seller.name || '').toLowerCase().includes(q);
          if (!matchTitle && !matchTitleSi && !matchDesc && !matchCity && !matchDistrict && !matchBrand && !matchSeller) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // If viewing operators category, rank by operator packages first
        if (activeCategory === 'operators') {
          const opWeights: Record<OperatorTier, number> = {
            platinum_lifetime: 50,
            platinum: 40,
            gold: 30,
            silver: 20,
            bronze: 10
          };
          const opA = a.operatorTier ? (opWeights[a.operatorTier] || 10) : 10;
          const opB = b.operatorTier ? (opWeights[b.operatorTier] || 10) : 10;
          if (opB !== opA) return opB - opA;
        }

        // 1. Ad Tier Score: Urgent = 30, Top = 20, Normal = 10
        const tierWeights: Record<AdTier, number> = { urgent: 30, top: 20, normal: 10 };
        // 2. Seller Membership Tier Score: Platinum VIP = 4, Gold = 3, Silver = 2, Starter = 1
        const membershipWeights: Record<MembershipTier, number> = { platinum: 4, gold: 3, silver: 2, starter: 1 };

        const tierA = tierWeights[a.tier] || 10;
        const tierB = tierWeights[b.tier] || 10;

        const memberA = membershipWeights[a.seller.membershipTier || 'starter'] || 1;
        const memberB = membershipWeights[b.seller.membershipTier || 'starter'] || 1;

        const scoreA = tierA + memberA;
        const scoreB = tierB + memberB;

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }

        // 3. Most recent first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [ads, activeCategory, selectedDistrict, conditionFilter, codOnly, deliveryOnly, tierFilter, searchQuery]);

  // Technicians specifically
  const technicianAds = useMemo(() => {
    return ads.filter((ad) => ad.category === 'technicians' && ad.status === 'active');
  }, [ads]);

  // Pending counts
  const pendingCount = useMemo(() => {
    return ads.filter((ad) => ad.status === 'pending').length;
  }, [ads]);

  const pendingUsersCount = useMemo(() => {
    return users.filter((u) => u.status === 'pending').length;
  }, [users]);

  // Admin Actions for Ads
  const handleApproveAd = async (adId: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: 'active' } : ad))
    );

    // Save live to Supabase Database
    await updateAdInSupabase(adId, { status: 'active' });

    // Create real-time notification for user
    if (targetAd) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Ad Approved & Published Live!',
        titleSi: 'දැන්වීම අනුමත කර සජීවීව පළ විය!',
        message: `Your advertisement "${targetAd.title}" is now active and live across SewLanka.`,
        messageSi: `ඔබ විසින් පළ කරන ලද "${targetAd.titleSi || targetAd.title}" දැන්වීම සාර්ථකව අනුමත කර සජීවීව වෙබ් අඩවියේ පළ කරන ලදී.`,
        timestamp: 'Just now',
        read: false,
        type: 'approval',
        adId: targetAd.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleRejectAd = async (adId: string, reason: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId ? { ...ad, status: 'rejected', rejectionReason: reason } : ad
      )
    );

    // Save live to Supabase Database
    await updateAdInSupabase(adId, { status: 'rejected', rejectionReason: reason });

    if (targetAd) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Ad Submission Rejected',
        titleSi: 'දැන්වීම ප්‍රතික්ෂේප විය',
        message: `Your ad "${targetAd.title}" was rejected. Reason: ${reason}`,
        messageSi: `ඔබගේ "${targetAd.titleSi || targetAd.title}" දැන්වීම ප්‍රතික්ෂේප විය. හේතුව: ${reason}`,
        timestamp: 'Just now',
        read: false,
        type: 'rejection',
        adId: targetAd.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    setAds((prev) => prev.filter((ad) => ad.id !== adId));
    // Delete live from Supabase Database
    await deleteAdFromSupabase(adId);
  };

  const handleUpgradeTier = async (adId: string, newTier: AdTier) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, tier: newTier } : ad))
    );
    // Save live to Supabase Database
    await updateAdInSupabase(adId, { tier: newTier });
  };

  const handleUpdateTechnicianTier = async (adId: string, newTier: TechnicianTier) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, technicianTier: newTier } : ad))
    );
    // Save live to Supabase Database
    await updateAdInSupabase(adId, { technicianTier: newTier });
  };

  const handleCreateAd = async (newAd: Ad) => {
    setAds((prev) => [newAd, ...prev]);

    // Save live to Supabase Database immediately
    await createAdInSupabase(newAd);

    // Add pending submission notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Ad Submitted for Review (Pending 24h)',
      titleSi: 'දැන්වීම අනුමැතිය සඳහා යොමු කරන ලදී (පැය 24ක් තුළ)',
      message: `Your ad "${newAd.title}" has been submitted to Admin. It will be verified and published within 24 hours.`,
      messageSi: `ඔබ විසින් පළ කරන ලද "${newAd.titleSi || newAd.title}" දැන්වීම ඇඩ්මින් මණ්ඩලය වෙත යොමු විය. පැය 24ක් තුළ සමාලෝචනයෙන් පසු සජීවී වේ.`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
      adId: newAd.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // User Registration & Activation Flow
  const handleRegisterUser = async (newUser: UserAccount) => {
    setUsers((prev) => [...prev, newUser]);

    // Save new profile live to Supabase Database
    await createProfileInSupabase(newUser);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New User Registered (Pending Approval)',
      titleSi: 'නව පරිශීලක ලියාපදිංචියක් (අනුමැතිය බලාපොරොත්තුවෙන්)',
      message: `User ${newUser.name} (@${newUser.username}) registered with NIC ${newUser.nic}. Review within 24 hours.`,
      messageSi: `${newUser.name} (@${newUser.username}) සාමාජිකයා ජාතික හැඳුනුම්පත් අංක ${newUser.nic} සමඟ ලියාපදිංචි විය. පැය 24ක් තුළ අනුමත කරන්න.`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleActivateUser = async (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: 'active', activatedAt: new Date().toISOString() }
          : u
      )
    );

    // Save activation live to Supabase Database
    await updateProfileInSupabase(userId, { status: 'active' });

    const activatedUser = users.find((u) => u.id === userId);
    if (activatedUser && currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'active' } : null));
    }

    if (activatedUser) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Account Activated Successfully!',
        titleSi: 'ගිණුම සාර්ථකව සක්‍රිය කරන ලදී!',
        message: `Account for ${activatedUser.name} (@${activatedUser.username}) is now Active. You can post ads now.`,
        messageSi: `${activatedUser.name} (@${activatedUser.username}) ගිණුම සක්‍රිය විය. ඔබට දැන් සියලුම දැන්වීම් පළ කළ හැක.`,
        timestamp: 'Just now',
        read: false,
        type: 'account_activated',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleUpdateUserMembership = async (userId: string, newTier: MembershipTier) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, membershipTier: newTier } : u))
    );

    // Save membership upgrade live to Supabase Database
    await updateProfileInSupabase(userId, { membershipTier: newTier });

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, membershipTier: newTier } : null));
    }

    // Also update all ads posted by this user so ranking takes effect immediately
    const userObj = users.find((u) => u.id === userId);
    if (userObj) {
      setAds((prev) =>
        prev.map((ad) =>
          ad.seller.name === userObj.name || ad.seller.phone === userObj.phone
            ? { ...ad, seller: { ...ad.seller, membershipTier: newTier } }
            : ad
        )
      );
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleResetFilters = () => {
    setSelectedDistrict('');
    setConditionFilter('');
    setCodOnly(false);
    setDeliveryOnly(false);
    setTierFilter('all');
    setSearchQuery('');
    setActiveCategory('all');
  };

  // Promo Code Handlers
  const handleAddPromoCode = async (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
    await savePromoCodeToSupabase(promo);
  };

  const handleDeletePromoCode = async (codeId: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== codeId));
    await deletePromoCodeFromSupabase(codeId);
  };

  const handleTogglePromoCode = async (codeId: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.id === codeId ? { ...p, isActive: !p.isActive } : p))
    );
    const target = promoCodes.find((p) => p.id === codeId);
    if (target) {
      await savePromoCodeToSupabase({ ...target, isActive: !target.isActive });
    }
  };

  // Payment Settings Handlers
  const handleUpdateBankAccounts = async (accounts: BankAccount[]) => {
    setBankAccounts(accounts);
    await savePaymentSettingsToSupabase(accounts, qrSettings);
  };

  const handleUpdateQRSettings = async (settings: QRPaymentSetting) => {
    setQrSettings(settings);
    await savePaymentSettingsToSupabase(bankAccounts, settings);
  };

  // Operator Tier Upgrade Handler
  const handleUpgradeOperatorTier = async (newTier: OperatorTier) => {
    if (currentUser) {
      const updatedUser: UserAccount = { ...currentUser, operatorTier: newTier };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      await updateProfileInSupabase(currentUser.id, { operatorTier: newTier });
      setAds((prev) =>
        prev.map((ad) =>
          ad.seller.name === currentUser.name || ad.seller.phone === currentUser.phone
            ? { ...ad, operatorTier: newTier, seller: { ...ad.seller, operatorTier: newTier } }
            : ad
        )
      );
    }
  };

  // Technician Tier Upgrade Handler
  const handleUpgradeTechnicianTier = async (newTier: TechnicianTier) => {
    if (currentUser) {
      const updatedUser: UserAccount = { ...currentUser, technicianTier: newTier };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      await updateProfileInSupabase(currentUser.id, { technicianTier: newTier });
      setAds((prev) =>
        prev.map((ad) =>
          ad.seller.name === currentUser.name || ad.seller.phone === currentUser.phone
            ? { ...ad, technicianTier: newTier, seller: { ...ad.seller, technicianTier: newTier } }
            : ad
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Primary Header with User Profile / Login & 25 Districts */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenPostAd={() => setIsPostAdOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onOpenMyAds={() => setIsMyAdsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        isAdminOpen={isAdminOpen}
        pendingCount={pendingCount}
        pendingUsersCount={pendingUsersCount}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Admin Panel Toggleable Drawer / Area */}
        {isAdminOpen && (
          <AdminPanel
            ads={ads}
            users={users}
            onApproveAd={handleApproveAd}
            onRejectAd={handleRejectAd}
            onDeleteAd={handleDeleteAd}
            onUpgradeTier={handleUpgradeTier}
            onUpdateTechnicianTier={handleUpdateTechnicianTier}
            onActivateUser={handleActivateUser}
            onUpdateUserMembership={handleUpdateUserMembership}
            language={language}
            onClose={() => setIsAdminOpen(false)}
            promoCodes={promoCodes}
            onAddPromoCode={handleAddPromoCode}
            onDeletePromoCode={handleDeletePromoCode}
            onTogglePromoCode={handleTogglePromoCode}
            bankAccounts={bankAccounts}
            onUpdateBankAccounts={handleUpdateBankAccounts}
            qrSettings={qrSettings}
            onUpdateQRSettings={handleUpdateQRSettings}
          />
        )}

        {/* Urgent Ads Banner / Notification Bar */}
        <UrgentBannerTicker
          urgentAds={urgentAds}
          language={language}
          onSelectAd={(ad) => setSelectedAd(ad)}
          isHome={activeCategory === 'all'}
        />

        {/* Hero Banner on Homepage */}
        {activeCategory === 'all' && !searchQuery && !selectedDistrict && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 mb-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'si' ? 'ශ්‍රී ලංකා ඇඟලුම් & මහන මැෂින් වෙළඳපොල' : 'Sri Lanka Apparel & Sewing Marketplace'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {language === 'si' 
                  ? 'මහන මැෂින්, සබ් ඕඩර්ස් සහ ඇඟලුම් දැන්වීම් එකම තැනකින්' 
                  : 'Sewing Machines, Subcontracts & Apparel Classifieds'}
              </h1>

              <p className="text-slate-300 text-xs sm:text-base mt-3 leading-relaxed">
                {language === 'si'
                  ? 'මහා පරිමාණ කර්මාන්තශාලා, කුඩා මැහුම් ව්‍යාපාර, නිවසේ සිට මහන අය සහ දිවයින පුරා දිස්ත්‍රික්ක 25 මැෂින් කාර්මික ශිල්පීන් සම්බන්ධ කරන අංක 1 වේදිකාව.'
                  : 'Connecting garment factories, apparel workshops, home seamstresses, machine dealers, and certified technicians across all 25 districts of Sri Lanka.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
                <button
                  onClick={() => setIsPostAdOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  <span>{t.postAdBtn}</span>
                </button>

                <button
                  onClick={() => setActiveCategory('subcontract')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
                >
                  {language === 'si' ? 'සබ් ඕඩර්ස් සොයන්න' : 'Find Sub-Contracts'}
                </button>

                {!currentUser && (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{language === 'si' ? 'ගිණුමක් ලියාපදිංචි කරන්න' : 'Register Account'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Navigation Pills */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          language={language}
          categoryCounts={categoryCounts}
        />

        {/* If Technicians Category is selected, show specialized Technicians Directory */}
        {activeCategory === 'technicians' ? (
          <TechniciansDirectory
            technicianAds={technicianAds}
            language={language}
            onSelectAd={(ad) => setSelectedAd(ad)}
            onOpenPostAd={() => setIsPostAdOpen(true)}
          />
        ) : (
          /* Normal Layout: Sidebar Filters + Ad Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar Filters (3 Cols on desktop) */}
            <div className="lg:col-span-3">
              <FilterSidebar
                language={language}
                selectedCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                conditionFilter={conditionFilter}
                onConditionChange={setConditionFilter}
                codOnly={codOnly}
                onCodChange={setCodOnly}
                deliveryOnly={deliveryOnly}
                onDeliveryChange={setDeliveryOnly}
                tierFilter={tierFilter}
                onTierChange={setTierFilter}
                onResetFilters={handleResetFilters}
                totalFilteredCount={filteredAds.length}
              />
            </div>

            {/* Ads Grid (9 Cols on desktop) */}
            <div className="lg:col-span-9 space-y-4">
              
              {/* Operator Section Package Showcase - ONLY shown in Operators section as requested! */}
              {activeCategory === 'operators' && (
                <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 border border-teal-500/30 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-500/20 pb-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                        <Scissors className="w-3 h-3" />
                        <span>Machine Operator Rankings & Accreditation</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {language === 'si' ? 'මැසින් ඔපරේටර් ශ්‍රේණිගත කිරීමේ පැකේජ (Operator Packages)' : 'Machine Operator Ranking Packages'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {language === 'si' 
                          ? 'ගාර්මන්ට් කර්මාන්තශාලා සෘජුවම බඳවාගැනීම් සිදුකිරීම සඳහා ඉහළම පිළිගැනීමක් සහිත පැකේජ'
                          : 'Ranked accreditation providing verified placement in factory recruitment searches'}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsPostAdOpen(true)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md self-start sm:self-auto cursor-pointer"
                    >
                      + ඔපරේටර් පැතිකඩක් එක් කරන්න
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { name: 'Bronze', fee: 'නොමිලේ (Free)', period: 'Free Forever', rank: 'Tier 1', color: 'bg-amber-900/60 border-amber-700 text-amber-200' },
                      { name: 'Silver', fee: 'රු. 1,000', period: '1 Year', rank: 'Tier 2', color: 'bg-slate-700 border-slate-500 text-white' },
                      { name: 'Gold', fee: 'රු. 3,000', period: '1 Year', rank: 'Tier 3', color: 'bg-amber-500/20 border-amber-400 text-amber-300' },
                      { name: 'Platinum', fee: 'රු. 5,000', period: '1 Year', rank: 'Tier 4', color: 'bg-purple-900/60 border-purple-400 text-purple-200' },
                      { name: 'Platinum Lifetime', fee: 'රු. 10,000', period: 'LifeTime', rank: 'VIP #1', color: 'bg-gradient-to-r from-amber-500/30 to-purple-600/30 border-amber-400 text-amber-300' },
                    ].map((pkg, i) => (
                      <div key={i} className={`p-2.5 rounded-xl border text-center ${pkg.color}`}>
                        <span className="text-[9px] font-black uppercase block tracking-wider opacity-80">{pkg.rank}</span>
                        <strong className="text-xs font-black block mt-0.5 truncate">{pkg.name}</strong>
                        <span className="text-xs font-black block mt-1 text-white">{pkg.fee}</span>
                        <span className="text-[10px] block opacity-80 mt-0.5">{pkg.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filter Title & Info bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {language === 'si' ? t.categories[activeCategory] : t.categories[activeCategory]}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t.categoryDescriptions[activeCategory]}
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {filteredAds.length} {language === 'si' ? 'දැන්වීම් හමුවිය' : 'ads available'}
                </div>
              </div>

              {/* No Ads State */}
              {filteredAds.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Scissors className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {language === 'si' ? 'දැන්වීම් කිසිවක් හමු නොවීය' : 'No ads matching your criteria'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'si'
                      ? 'කරුණාකර පෙරහන් වෙනස් කරන්න හෝ නව දැන්වීමක් පළ කරන්න.'
                      : 'Try broadening your filters or be the first to post an ad in this category.'}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    {language === 'si' ? 'සියලුම පෙරහන් ඉවත් කරන්න' : 'Clear Filters'}
                  </button>
                </div>
              ) : (
                /* The Listings Grid (with Urgent, Top & Silver styling) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      language={language}
                      onSelect={(item) => setSelectedAd(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  <Scissors className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-white">Sew<span className="text-amber-500">Lanka</span>.lk</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {language === 'si'
                  ? 'ශ්‍රී ලංකාවේ ප්‍රමුඛතම ඇඟලුම්, මහන මැෂින්, සබ් ඕඩර්ස් සහ කාර්මික ශිල්පීන්ගේ දැන්වීම් වෙබ් අඩවිය.'
                  : "Sri Lanka's dedicated classifieds platform for garment factories, seamstresses, machine sellers, and mechanics."}
              </p>
              <div className="text-[11px] text-slate-500">
                Colombo • Maharagama • Pamunuwa • Katunayake • Kurunegala • Kandy • All 25 Districts
              </div>
            </div>

            {/* Col 2: Categories */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3">
                {language === 'si' ? 'ප්‍රධාන අංශ' : 'Categories'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveCategory('subcontract')} className="hover:text-amber-400 cursor-pointer">
                    {language === 'si' ? 'සබ් ඕඩර්ස් (Sub-Contracts)' : 'Sub-Contract Orders'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('machines')} className="hover:text-amber-400 cursor-pointer">
                    {language === 'si' ? 'මහන මැෂින් (Sewing Machines)' : 'Sewing Machines for Sale'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('garments')} className="hover:text-amber-400 cursor-pointer">
                    {language === 'si' ? 'තොග ඇඳුම් (Wholesale Garments)' : 'Wholesale Ready-made Garments'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('spare_parts')} className="hover:text-amber-400 cursor-pointer">
                    {language === 'si' ? 'ස්පෙයාර් පාට්ස් (Spare Parts)' : 'Machine Spare Parts'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('technicians')} className="hover:text-amber-400 cursor-pointer">
                    {language === 'si' ? 'මැෂින් කාර්මික ශිල්පීන් (Technicians)' : 'Mechanics Directory'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Ad Packages */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3">
                {language === 'si' ? 'දැන්වීම් පැකේජ & ගාස්තු' : 'Ad Packages & Pricing'}
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span>{language === 'si' ? 'නෝමල් ඇඩ්: නොමිලේ (ඡායාරූප 2ක් දක්වා)' : 'Normal Ad: Free (Up to 2 photos)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  <span>{language === 'si' ? 'ටොප් ඇඩ්: රු. 1,000 / මාසය (Top Ad)' : 'Top Ad: Rs. 1,000 / Mo (Emerald Highlight)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>{language === 'si' ? 'අර්ජන්ට් ඇඩ්: රු. 2,000 / මාසය (Urgent)' : 'Urgent Ad: Rs. 2,000 / Mo (Red Pulse)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>{language === 'si' ? 'අමතර ඡායාරූප: රු. 100 බැගින් (ෆොටෝ 5න් පසු)' : 'Extra Photos: Rs. 100/photo after 5'}</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Safe Trading & Verification */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3">
                {language === 'si' ? 'පරිශීලක ආරක්ෂාව & සත්‍යාපනය' : 'Safe Trading & NIC Review'}
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px] mb-3">
                {language === 'si'
                  ? 'සියලුම සාමාජිකයින්ගේ ජාතික හැඳුනුම්පත් (NIC) සහ දුරකථන අංක පැය 24ක් තුළ අපගේ ඇඩ්මින් හරහා සත්‍යාපනය කරනු ලැබේ.'
                  : 'All member identity cards and phone contacts undergo admin review within 24 hours to guarantee authentic transactions.'}
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified 25 Districts Network</span>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
            <p>© 2026 SewLanka.lk. All rights reserved. Sri Lanka Apparel Classifieds.</p>
            <p>{language === 'si' ? 'ශ්‍රී ලංකාවේ සියලුම ඇඟලුම් නිෂ්පාදකයින් සඳහාය' : 'Empowering Sri Lankan Garment & Apparel Industry'}</p>
          </div>
        </div>
      </footer>

      {/* Post Ad Modal */}
      <PostAdModal
        isOpen={isPostAdOpen}
        onClose={() => setIsPostAdOpen(false)}
        language={language}
        currentUser={currentUser}
        onSubmitAd={handleCreateAd}
        onOpenAuth={() => setIsAuthOpen(true)}
        promoCodes={promoCodes}
        bankAccounts={bankAccounts}
        qrSettings={qrSettings}
      />

      {/* Ad Detail Modal */}
      <AdDetailModal
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
        language={language}
        onSelectSimilarAd={(ad) => setSelectedAd(ad)}
        allAds={ads}
      />

      {/* User Dashboard Modal (My Ads & Membership) */}
      <UserDashboardModal
        isOpen={isMyAdsOpen}
        onClose={() => setIsMyAdsOpen(false)}
        language={language}
        ads={ads}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenPostAd={() => setIsPostAdOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectAd={(ad) => setSelectedAd(ad)}
        onUpgradeAd={(id, tier) => handleUpgradeTier(id, tier)}
        onDeleteAd={handleDeleteAd}
        onUpgradeMembership={(tier) => currentUser && handleUpdateUserMembership(currentUser.id, tier)}
        onUpgradeOperatorTier={handleUpgradeOperatorTier}
        onUpgradeTechnicianTier={handleUpgradeTechnicianTier}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        language={language}
        users={users}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
        onRegister={handleRegisterUser}
      />

    </div>
  );
}
