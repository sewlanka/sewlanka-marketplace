import React, { useState } from 'react';
import { 
  Scissors, 
  PlusCircle, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Layers, 
  CheckCircle2,
  X,
  User,
  LogIn,
  Crown,
  Sparkles
} from 'lucide-react';
import { Language, NotificationItem, UserAccount } from '../types';
import { translations } from '../utils/translations';
import { SRI_LANKA_DISTRICTS, USER_MEMBERSHIPS } from '../data/sriLankaData';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPostAd: () => void;
  onOpenAdmin: () => void;
  onOpenMyAds: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  isAdminOpen: boolean;
  pendingCount: number;
  pendingUsersCount: number;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenPostAd,
  onOpenAdmin,
  onOpenMyAds,
  onOpenAuth,
  currentUser,
  isAdminOpen,
  pendingCount,
  pendingUsersCount,
  notifications,
  onMarkNotificationRead,
  selectedDistrict,
  onSelectDistrict,
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">
              {language === 'si' ? 'ශ්‍රී ලංකාවේ අංක 1 ඇඟලුම් & මහන මැෂින් වෙළඳපොල' : "Sri Lanka's #1 Garment & Sewing Industry Marketplace"}
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              {language === 'si' ? 'මහා පරිමාණයේ සිට නිවසේ මහන අය දක්වා දිවයින පුරා' : 'Factories to Home Seamstresses Across 25 Districts'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                onClick={() => onLanguageChange('si')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  language === 'si' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Authenticated Admin Badge - ONLY visible when Admin is logged in */}
            {currentUser?.isAdmin && (
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  isAdminOpen
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-rose-900/90 text-rose-200 border border-rose-600/70 hover:bg-rose-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
                <span>{language === 'si' ? 'ඇඩ්මින් පාලන පුවරුව' : 'Admin Panel'}</span>
                {(pendingCount > 0 || pendingUsersCount > 0) && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {pendingCount + pendingUsersCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation & branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelectCategory('all')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6 transform -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                    Sew<span className="text-amber-600">Lanka</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border border-emerald-300">
                    .LK
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 -mt-0.5">
                  {language === 'si' ? 'මැහුම්.lk - ඇඟලුම් හා මහන මැෂින් වෙළඳපොල' : 'Sri Lanka Apparel & Sewing Classifieds'}
                </p>
              </div>
            </button>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {currentUser ? (
                <button
                  onClick={onOpenMyAds}
                  className="p-2 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[70px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="p-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              <button
                onClick={onOpenPostAd}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'si' ? 'දැන්වීමක්' : 'Post Ad'}</span>
              </button>
            </div>
          </div>

          {/* Search bar & District Filter (ALL 25 DISTRICTS) */}
          <div className="flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1 flex rounded-xl border border-slate-300 bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-xs transition-all">
              
              {/* District Dropdown Selector (25 Districts) */}
              <div className="relative border-r border-slate-200">
                <select
                  value={selectedDistrict}
                  onChange={(e) => onSelectDistrict(e.target.value)}
                  className="h-full bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold pl-3 pr-7 py-2.5 rounded-l-xl border-none focus:ring-0 cursor-pointer appearance-none outline-none"
                >
                  <option value="">{t.allDistricts} (25)</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.nameEn}>
                      {language === 'si' ? d.nameSi : d.nameEn}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">
                  ▼
                </div>
              </div>

              {/* Text Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 text-slate-900 placeholder-slate-400 bg-transparent outline-none rounded-r-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Right Actions: User Account, Notifications, My Ads, Post Ad */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* User Account / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenMyAds}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    currentUser.isAdmin
                      ? 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    currentUser.isAdmin 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {currentUser.isAdmin ? '🛡️' : currentUser.membershipTier === 'platinum' ? '👑' : currentUser.membershipTier === 'gold' ? '⭐' : '👤'}
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">{currentUser.name.split(' ')[0]}</span>
                    <span className={`text-[10px] font-black uppercase block -mt-0.5 ${
                      currentUser.isAdmin ? 'text-rose-400' : 'text-amber-700'
                    }`}>
                      {currentUser.isAdmin ? 'ADMIN' : currentUser.membershipTier}
                    </span>
                  </div>
                </button>

                {currentUser.isAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAdminOpen
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'si' ? 'ඇඩ්මින් පැනලය' : 'Admin Panel'}</span>
                    {(pendingCount > 0 || pendingUsersCount > 0) && (
                      <span className="bg-white text-rose-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {pendingCount + pendingUsersCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-600" />
                <span>{language === 'si' ? 'ලොගින් / ලියාපදිංචිය' : 'Sign In / Register'}</span>
              </button>
            )}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                title={t.notifications}
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-800">{t.notifications}</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">
                        {language === 'si' ? 'දැනුම්දීම් කිසිවක් නොමැත' : 'No notifications'}
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`py-2.5 px-1 cursor-pointer transition-colors ${
                            !n.read ? 'bg-amber-50/70 rounded-lg p-2' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-slate-800">
                                {language === 'si' ? n.titleSi : n.title}
                              </p>
                              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                                {language === 'si' ? n.messageSi : n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {n.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Post Ad Button (Prominent ikman-style yellow/amber) */}
            <button
              onClick={onOpenPostAd}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 transition-transform group-hover:rotate-90" />
              <span>{t.postAdBtn}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
