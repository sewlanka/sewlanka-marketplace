import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Building2, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  LogIn, 
  UserPlus, 
  Sparkles 
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { SRI_LANKA_DISTRICTS } from '../data/sriLankaData';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../utils/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  users: UserAccount[];
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  users,
  currentUser,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successPending, setSuccessPending] = useState(false);

  // Login form fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form fields
  const [regName, setRegName] = useState('');
  const [regNic, setRegNic] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regDistrict, setRegDistrict] = useState('Colombo');
  const [regCity, setRegCity] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regBusinessPhone, setRegBusinessPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = loginIdentifier.trim();
    const trimmedLower = trimmed.toLowerCase();

    // Check Administrator Login Credentials
    if (trimmed === ADMIN_USERNAME || trimmed === '200119303870' || trimmedLower === 'admin') {
      if (loginPassword !== ADMIN_PASSWORD) {
        setErrorMessage(
          language === 'si'
            ? 'ඇඩ්මින් මුරපදය (Password) වැරදිය. කරුණාකර නිවැරදි මුරපදය ඇතුළත් කරන්න.'
            : 'Incorrect password for administrator account.'
        );
        return;
      }

      // Find or create admin user object
      const existingAdmin = users.find(
        (u) => u.username === ADMIN_USERNAME || u.nic === ADMIN_USERNAME
      );

      const adminUser: UserAccount = existingAdmin || {
        id: 'user-admin-01',
        username: ADMIN_USERNAME,
        nic: ADMIN_USERNAME,
        name: 'SewLanka Super Admin',
        email: 'admin@sewlanka.lk',
        phone: '0770000000',
        whatsapp: '94770000000',
        address: 'SewLanka Central Operations, Colombo',
        district: 'Colombo',
        city: 'Colombo',
        status: 'active',
        membershipTier: 'platinum',
        registeredAt: new Date().toISOString(),
        role: 'admin',
        isAdmin: true,
      };

      adminUser.isAdmin = true;
      adminUser.role = 'admin';

      onLogin(adminUser);
      onClose();
      return;
    }

    // Regular User Login
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === trimmedLower ||
        u.email.toLowerCase() === trimmedLower ||
        u.nic.toLowerCase() === trimmedLower
    );

    if (!user) {
      setErrorMessage(
        language === 'si'
          ? 'පරිශීලක නාමය, හැඳුනුම්පත් අංකය හෝ ඊමේල් ලිපිනය වැරදිය. කරුණාකර නැවත උත්සාහ කරන්න.'
          : 'Invalid username, NIC, or email. Please register if you do not have an account.'
      );
      return;
    }

    if (user.status === 'pending') {
      setErrorMessage(
        language === 'si'
          ? 'ඔබගේ ගිණුම තවමත් අනුමැතිය සඳහා පෙන්ඩින් (Pending) තත්වයේ පවතී. ඇඩ්මින් කෙනෙකු විසින් පැය 24ක් ඇතුළත ගිණුම සක්‍රිය (Active) කරනු ඇත.'
          : 'Your account is currently pending admin review. An administrator will verify and activate your account within 24 hours.'
      );
      return;
    }

    if (user.status === 'suspended') {
      setErrorMessage(
        language === 'si'
          ? 'මෙම ගිණුම තාවකාලිකව අත්හිටුවා ඇත. කරුණාකර පරිපාලක සහය අමතන්න.'
          : 'This account has been suspended. Please contact administrator.'
      );
      return;
    }

    onLogin(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUsername = regUsername.trim().toLowerCase();
    const trimmedNic = regNic.trim().toUpperCase();

    // Check unique username
    const existingUser = users.find((u) => u.username.toLowerCase() === trimmedUsername);
    if (existingUser) {
      setErrorMessage(
        language === 'si'
          ? 'මෙම පරිශීලක නාමය (Username) දැනටමත් ලියාපදිංචි වී ඇත. වෙනත් නමක් ඇතුළත් කරන්න.'
          : 'This username is already taken. Please choose another username.'
      );
      return;
    }

    // Check unique NIC
    const existingNic = users.find((u) => u.nic.toUpperCase() === trimmedNic);
    if (existingNic) {
      setErrorMessage(
        language === 'si'
          ? 'මෙම ජාතික හැඳුනුම්පත් අංකය (NIC) දැනටමත් ලියාපදිංචි වී ඇත. එක් පුද්ගලයෙකුට එක් ගිණුමක් පමණක් හිමිවේ.'
          : 'This National Identity Card (NIC) is already registered. Only one account per person is allowed.'
      );
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: trimmedUsername,
      nic: trimmedNic,
      name: regName.trim(),
      phone: regPhone.trim(),
      whatsapp: regWhatsapp.trim() || regPhone.trim(),
      email: regEmail.trim(),
      address: regAddress.trim(),
      district: regDistrict,
      city: regCity.trim(),
      businessName: regBusinessName.trim() || undefined,
      businessPhone: regBusinessPhone.trim() || undefined,
      password: regPassword || 'password123',
      status: 'pending', // Account starts as pending for Admin verification within 24 hours!
      membershipTier: 'starter',
      registeredAt: new Date().toISOString(),
    };

    onRegister(newUser);
    setSuccessPending(true);
  };

  const fillQuickDemo = (user: UserAccount) => {
    setLoginIdentifier(user.username);
    setLoginPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {language === 'si' ? 'SewLanka පරිශීලක පද්ධතිය' : 'User Portal'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {mode === 'login' 
              ? (language === 'si' ? 'ගිණුමට ඇතුළු වන්න (Login)' : 'Sign In to Your Account') 
              : (language === 'si' ? 'නව සාමාජික ගිණුමක් ලියාපදිංචි කරන්න' : 'Register New Account')}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'si'
              ? 'ඇඟලුම් කර්මාන්තශාලා, මහන මැෂින් අලෙවිකරුවන් සහ කාර්මික ශිල්පීන්ගේ ජාලය'
              : 'The verified apparel classifieds platform for Sri Lanka'}
          </p>

          {/* Mode Switch Tabs */}
          {!successPending && (
            <div className="flex bg-slate-200/80 p-1 rounded-xl mt-5 max-w-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'ලොගින්' : 'Login'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'register' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'ලියාපදිංචිය' : 'Register'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          
          {/* Success State when registration submitted */}
          {successPending ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-8 h-8 stroke-[2.5] animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'si' ? 'ගිණුම අනුමැතිය සඳහා පෙන්ඩින් (Pending Review)' : 'Registration Submitted for Review'}
              </h3>

              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>
                    {language === 'si' ? 'පැය 24ක් ඇතුළත ගිණුම සක්‍රිය කරනු ලැබේ' : 'Account will be activated within 24 hours'}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {language === 'si'
                    ? 'ඔබ විසින් ඉදිරිපත් කරන ලද ජාතික හැඳුනුම්පත් අංකය සහ ව්‍යාපාරික තොරතුරු ඇඩ්මින් මණ්ඩලය විසින් සමාලෝචනය කරනු ඇත. අනුමත වූ වහාම ඔබගේ WhatsApp අංකය වෙත සක්‍රිය කිරීමේ පණිවිඩයක් ලැබෙනු ඇත.'
                    : 'Your details and NIC are queued for administrator verification. Once verified, you will receive an instant WhatsApp activation message to your registered number.'}
                </p>
                <div className="pt-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  <p><strong>Username:</strong> {regUsername}</p>
                  <p><strong>NIC:</strong> {regNic}</p>
                  <p><strong>WhatsApp:</strong> {regWhatsapp || regPhone}</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSuccessPending(false);
                    setMode('login');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  {language === 'si' ? 'ලොගින් පිටුවට යන්න' : 'Go to Login'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* LOGIN VIEW */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'si' ? 'පරිශීලක නාමය / NIC / ඊමේල්' : 'Username / NIC / Email'} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. nalaka_tex or 198522304910"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'si' ? 'මුරපදය (Password)' : 'Password'} *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm py-2.5 rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{language === 'si' ? 'ගිණුමට පිවිසෙන්න (Sign In)' : 'Sign In'}</span>
                  </button>

                  {/* Instant Demo Accounts Quick Click Bar */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">
                      {language === 'si' ? 'ක්ෂණිකව පරීක්ෂා කිරීමට සූදානම් ගිණුම් (Test Logins):' : 'Quick Demo Logins:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {users
                        .filter((u) => !u.isAdmin && u.username !== ADMIN_USERNAME)
                        .map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => fillQuickDemo(u)}
                          className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                            u.status === 'pending'
                              ? 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/60'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{u.name}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                              u.status === 'pending' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {u.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            @{u.username} • {u.membershipTier.toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* REGISTER VIEW */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'සම්පූර්ණ නම (Full Name)' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Amal Perera"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'ජාතික හැඳුනුම්පත් අංකය (NIC)' : 'National Identity Card (NIC)'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regNic}
                        onChange={(e) => setRegNic(e.target.value)}
                        placeholder="e.g. 199012345678 or 901234567V"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                      <span className="text-[10px] text-slate-500">
                        {language === 'si' ? 'එක් හැඳුනුම්පතකට එක් ගිණුමක් පමණි' : 'Unique per person'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'පරිශීලක නාමය (Username)' : 'Username (Unique)'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="e.g. amal_tex"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'ඊමේල් ලිපිනය (Email)' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="amal@example.com"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0771234567"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'වට්ස්ඇප් අංකය (WhatsApp)' : 'WhatsApp Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regWhatsapp}
                        onChange={(e) => setRegWhatsapp(e.target.value)}
                        placeholder="94771234567"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        {language === 'si' ? 'සක්‍රිය කිරීමේ පණිවිඩය මේ වෙත එනු ඇත' : 'Activation notification sent here'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'දිස්ත්‍රික්කය (District)' : 'District (25 Districts)'} *
                      </label>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.nameEn}>
                            {language === 'si' ? d.nameSi : d.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'නගරය (City / Town)' : 'City / Town'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="e.g. Maharagama / Pamunuwa"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'si' ? 'ලිපිනය (Address)' : 'Address'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="e.g. No 24, Main Street, Pamunuwa"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'ව්‍යාපාරික නාමය (Business Name)' : 'Business Name'}
                      </label>
                      <input
                        type="text"
                        value={regBusinessName}
                        onChange={(e) => setRegBusinessName(e.target.value)}
                        placeholder="e.g. Apex Apparel Works"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'si' ? 'ව්‍යාපාරික දුරකථන (Business Phone)' : 'Business Phone'}
                      </label>
                      <input
                        type="tel"
                        value={regBusinessPhone}
                        onChange={(e) => setRegBusinessPhone(e.target.value)}
                        placeholder="0112894123"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'si' ? 'මුරපදයක් ඇතුළත් කරන්න (Password)' : 'Create Password'} *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-2.5 rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{language === 'si' ? 'ලියාපදිංචි වන්න (Submit Registration)' : 'Submit Registration'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
