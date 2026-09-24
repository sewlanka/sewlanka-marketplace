export interface District {
  id: string;
  nameEn: string;
  nameSi: string;
  majorTowns: string[];
}

// All 25 official administrative districts of Sri Lanka
export const SRI_LANKA_DISTRICTS: District[] = [
  {
    id: 'colombo',
    nameEn: 'Colombo',
    nameSi: 'කොළඹ',
    majorTowns: ['Maharagama', 'Pamunuwa', 'Pettah', 'Piliyandala', 'Kottawa', 'Dehiwala', 'Moratuwa', 'Homagama', 'Nugegoda', 'Ratmalana', 'Avissawella']
  },
  {
    id: 'gampaha',
    nameEn: 'Gampaha',
    nameSi: 'ගම්පහ',
    majorTowns: ['Katunayake FTZ', 'Biyagama FTZ', 'Kadawatha', 'Kiribathgoda', 'Nittambuwa', 'Negombo', 'Ja-Ela', 'Kelaniya', 'Wattala', 'Minuwangoda', 'Mirigama']
  },
  {
    id: 'kalutara',
    nameEn: 'Kalutara',
    nameSi: 'කළුතර',
    majorTowns: ['Horana', 'Panadura', 'Bandaragama', 'Matugama', 'Beruwala', 'Wadduwa', 'Ingiriya']
  },
  {
    id: 'kandy',
    nameEn: 'Kandy',
    nameSi: 'මහනුවර',
    majorTowns: ['Kandy City', 'Katugastota', 'Peradeniya', 'Gampola', 'Akurana', 'Digana', 'Nawalapitiya']
  },
  {
    id: 'matale',
    nameEn: 'Matale',
    nameSi: 'මාතලේ',
    majorTowns: ['Matale Town', 'Dambulla', 'Galewela', 'Ukuwela', 'Rattota']
  },
  {
    id: 'nuwara_eliya',
    nameEn: 'Nuwara Eliya',
    nameSi: 'නුවරඑළිය',
    majorTowns: ['Nuwara Eliya Town', 'Hatton', 'Talawakele', 'Ginigathena', 'Walapane']
  },
  {
    id: 'galle',
    nameEn: 'Galle',
    nameSi: 'ගාල්ල',
    majorTowns: ['Koggala FTZ', 'Galle City', 'Karapitiya', 'Hikkaduwa', 'Ambalangoda', 'Elpitiya', 'Baddegama']
  },
  {
    id: 'matara',
    nameEn: 'Matara',
    nameSi: 'මාතර',
    majorTowns: ['Matara City', 'Weligama', 'Akuressa', 'Dikwella', 'Kamburupitiya', 'Hakmana']
  },
  {
    id: 'hambantota',
    nameEn: 'Hambantota',
    nameSi: 'හම්බන්තොට',
    majorTowns: ['Tangalle', 'Ambalantota', 'Beliatta', 'Hambantota Town', 'Tissamaharama']
  },
  {
    id: 'jaffna',
    nameEn: 'Jaffna',
    nameSi: 'යාපනය',
    majorTowns: ['Jaffna City', 'Chavakachcheri', 'Nallur', 'Point Pedro', 'Valvettithurai']
  },
  {
    id: 'kilinochchi',
    nameEn: 'Kilinochchi',
    nameSi: 'කිලිනොච්චිය',
    majorTowns: ['Kilinochchi Town', 'Paranthan', 'Poonakary']
  },
  {
    id: 'mannar',
    nameEn: 'Mannar',
    nameSi: 'මන්නාරම',
    majorTowns: ['Mannar Town', 'Nanattan', 'Madhu']
  },
  {
    id: 'vavuniya',
    nameEn: 'Vavuniya',
    nameSi: 'වවුනියාව',
    majorTowns: ['Vavuniya Town', 'Cheddikulam', 'Nedunkeni']
  },
  {
    id: 'mullaitivu',
    nameEn: 'Mullaitivu',
    nameSi: 'මුලතිව්',
    majorTowns: ['Mullaitivu Town', 'Puthukkudiyiruppu', 'Oddusuddan']
  },
  {
    id: 'batticaloa',
    nameEn: 'Batticaloa',
    nameSi: 'මඩකලපුව',
    majorTowns: ['Batticaloa Town', 'Kattankudy', 'Eravur', 'Valaichchenai']
  },
  {
    id: 'ampara',
    nameEn: 'Ampara',
    nameSi: 'අම්පාර',
    majorTowns: ['Ampara Town', 'Kalmunai', 'Sammanthurai', 'Akkaraipattu', 'Uhana']
  },
  {
    id: 'trincomalee',
    nameEn: 'Trincomalee',
    nameSi: 'ත්‍රිකුණාමලය',
    majorTowns: ['Trincomalee Town', 'Kinniya', 'Kantale', 'Muttur']
  },
  {
    id: 'kurunegala',
    nameEn: 'Kurunegala',
    nameSi: 'කුරුණෑගල',
    majorTowns: ['Kurunegala City', 'Kuliyapitiya', 'Pannala', 'Mawathagama', 'Wariyapola', 'Polgahawela', 'Narammala', 'Giriulla', 'Ibbagamuwa']
  },
  {
    id: 'puttalam',
    nameEn: 'Puttalam',
    nameSi: 'පුත්තලම',
    majorTowns: ['Chilaw', 'Wennappuwa', 'Marawila', 'Puttalam Town', 'Dankotuwa', 'Anamaduwa']
  },
  {
    id: 'anuradhapura',
    nameEn: 'Anuradhapura',
    nameSi: 'අනුරාධපුර',
    majorTowns: ['Anuradhapura Town', 'Kekirawa', 'Medawachchiya', 'Eppawala', 'Thambuttegama', 'Nochchiyagama']
  },
  {
    id: 'polonnaruwa',
    nameEn: 'Polonnaruwa',
    nameSi: 'පොළොන්නරුව',
    majorTowns: ['Kaduruwela', 'Polonnaruwa Town', 'Hingurakgoda', 'Medirigiriya', 'Minneriya']
  },
  {
    id: 'badulla',
    nameEn: 'Badulla',
    nameSi: 'බදුල්ල',
    majorTowns: ['Badulla City', 'Bandarawela', 'Welimada', 'Hali-Ela', 'Mahiyanganaya', 'Diyatalawa', 'Ella']
  },
  {
    id: 'monaragala',
    nameEn: 'Monaragala',
    nameSi: 'මොණරාගල',
    majorTowns: ['Monaragala Town', 'Wellawaya', 'Buttala', 'Bibile', 'Kataragama']
  },
  {
    id: 'ratnapura',
    nameEn: 'Ratnapura',
    nameSi: 'රත්නපුර',
    majorTowns: ['Ratnapura City', 'Pelmadulla', 'Balangoda', 'Embilipitiya', 'Eheliyagoda', 'Kuruwita']
  },
  {
    id: 'kegalle',
    nameEn: 'Kegalle',
    nameSi: 'කෑගල්ල',
    majorTowns: ['Kegalle City', 'Mawanella', 'Warakapola', 'Ruwanwella', 'Yatiyantota', 'Rambukkana', 'Dehiowita']
  }
];

export const MACHINE_BRANDS = [
  'Juki',
  'Brother',
  'Singer',
  'Jack',
  'Siruba',
  'Pegasus',
  'Zoje',
  'Eastman',
  'Kansai Special',
  'Yamato',
  'Typical',
  'Sunstar',
  'Other / වෙනත්'
];

export const MACHINE_TYPES = [
  { id: 'single_needle', en: 'Single Needle Lockstitch (හයි ස්පීඩ් තනි ඉදිකටු මැෂින්)', si: 'තනි ඉදිකටු මැෂින් (High Speed Single Needle)' },
  { id: 'overlock_4', en: '4-Thread Overlock Machine (ඕවර්ලොක් මැෂින්)', si: 'ඕවර්ලොක් මැෂින් (4-Thread / 5-Thread)' },
  { id: 'interlock', en: 'Interlock / Flatlock Machine (කොලරට් / ඉන්ටර්ලොක්)', si: 'කොලරට් / ඉන්ටර්ලොක් මැෂින්' },
  { id: 'buttonhole', en: 'Buttonhole & Button Attach (බොත්තම් කාස / ඇල්ලීමේ මැෂින්)', si: 'බොත්තම් කාස / බොත්තම් ඇල්ලීමේ මැෂින්' },
  { id: 'cutting', en: 'Fabric Cutting Machine (රෙදි කපන මැෂින් - Straight Knife / Round)', si: 'රෙදි කපන මැෂින් (Cutting Machine)' },
  { id: 'steam_iron', en: 'Industrial Steam Iron & Boiler (ස්ටීම් අයන් සහ බොයිලර්)', si: 'ස්ටීම් අයන් සහ බොයිලර් පද්ධති' },
  { id: 'embroidery', en: 'Computerized Embroidery Machine (එම්බ්‍රොයිඩරි මැෂින්)', si: 'එම්බ්‍රොයිඩරි මැෂින් (Embroidery)' },
  { id: 'domestic', en: 'Domestic Portable Sewing Machine (ගෘහස්ථ කුඩා මැෂින්)', si: 'ගෘහස්ථ කුඩා මැෂින් (Domestic Machine)' },
  { id: 'other', en: 'Other Apparel Machinery (වෙනත් මැෂින් වර්ග)', si: 'වෙනත් මැෂින් වර්ග' }
];

export const APPAREL_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'Free Size', 'Kids (ළමා)', 'Mixed Sizes (මිශ්‍ර ප්‍රමාණ)'
];

export const SUBCONTRACT_WORK_TYPES = [
  { id: 'full_production', en: 'Full Production (Cutting + Stitching + Packing)', si: 'සම්පූර්ණ නිමි ඇඳුම් (කැපීම + මැසීම + පැකින්)' },
  { id: 'stitching_only', en: 'Stitching / Sewing Only (මැසීම පමණි)', si: 'මැසීම පමණි (Cut pieces සපයනු ලැබේ)' },
  { id: 'home_tailor_batch', en: 'Home Seamstress Friendly Batches (නිවසේ සිට මහන අයට සුදුසු)', si: 'නිවසේ සිට මහන අයට සුදුසු කුඩා කණ්ඩායම්' },
  { id: 'bulk_cutting', en: 'Bulk Cutting Service Only (තොග කැපීම පමණි)', si: 'තොග කැපීම පමණි (Fabric Cutting Only)' },
  { id: 'ironing_packing', en: 'Ironing, Tagging & Packing Only (අයන් සහ පැකින්)', si: 'අයන් සහ පැකින් පමණි' },
  { id: 'printing_embroidery', en: 'Screen Printing & Embroidery (මුද්‍රණය සහ එම්බ්‍රොයිඩරි)', si: 'මුද්‍රණය සහ එම්බ්‍රොයිඩරි පමණි' }
];

// Ad Durations and Pricing as explicitly requested by user:
// Top Ad: 1 month: Rs. 1,000 | 3 months: Rs. 2,300 | 1 year: Rs. 6,000 | Custom min 2 days: Rs. 300 + Rs. 100/day
// Urgent Ad: 1 month: Rs. 1,800 | 3 months: Rs. 3,200 | 1 year: Rs. 7,500 | Custom min 2 days: Rs. 300 + Rs. 150/day
export const AD_DURATION_PRICING = {
  top: {
    '1_month': { lkr: 1000, labelSi: 'මාස 1 (රු. 1,000)', labelEn: '1 Month (Rs. 1,000)', reach: '1.0k - 6.6k reach' },
    '3_months': { lkr: 2300, labelSi: 'මාස 3 (රු. 2,300)', labelEn: '3 Months (Rs. 2,300)', reach: '6.6k - 18.0k reach' },
    '1_year': { lkr: 6000, labelSi: 'අවුරුදු 1 (රු. 6,000)', labelEn: '1 Year (Rs. 6,000)', reach: '20.0k - 75.0k reach' }
  },
  urgent: {
    '1_month': { lkr: 1800, labelSi: 'මාස 1 (රු. 1,800)', labelEn: '1 Month (Rs. 1,800)', reach: '2.5k - 15.0k reach' },
    '3_months': { lkr: 3200, labelSi: 'මාස 3 (රු. 3,200)', labelEn: '3 Months (Rs. 3,200)', reach: '15.0k - 45.0k reach' },
    '1_year': { lkr: 7500, labelSi: 'අවුරුදු 1 (රු. 7,500)', labelEn: '1 Year (Rs. 7,500)', reach: '50.0k - 180.0k reach' }
  }
};

// Custom Days Pricing & Reach Calculation Function
export function calculateCustomAdPricing(tier: 'top' | 'urgent', days: number): { priceLkr: number; reachText: string } {
  const safeDays = Math.max(2, Math.floor(days || 2));
  if (tier === 'top') {
    // 2 mandatory days = Rs. 300, each additional day = +Rs. 100
    const priceLkr = 300 + (safeDays - 2) * 100;
    // Reach: Min 2 days = 0k to 1k. Every extra day = 1k + 0.2k daily
    let reachText = '';
    if (safeDays === 2) {
      reachText = '0k - 1.0k Reach';
    } else {
      const maxReach = (1.0 + (safeDays - 2) * 0.2).toFixed(1);
      reachText = `1.0k - ${maxReach}k Reach`;
    }
    return { priceLkr, reachText };
  } else {
    // Urgent Ad: 2 mandatory days = Rs. 300, each additional day = +Rs. 150
    const priceLkr = 300 + (safeDays - 2) * 150;
    // Reach: Min 2 days = 0 to 1.9k. Every extra day = 2.5k + 0.45k daily
    let reachText = '';
    if (safeDays === 2) {
      reachText = '0 - 1.9k Reach';
    } else {
      const maxReach = (2.5 + (safeDays - 2) * 0.45).toFixed(2);
      reachText = `2.5k - ${maxReach}k Reach`;
    }
    return { priceLkr, reachText };
  }
}

export const EXTRA_PHOTO_PRICE_LKR = 100; // Rs. 100 per extra photo above 5 (or above 2 for Normal)

export const AD_PRICING = {
  normal: {
    priceLkr: 0,
    titleEn: 'Normal Ad (Free)',
    titleSi: 'නෝමල් ඇඩ් (නොමිලේ - Free)',
    descEn: 'Standard listing for 30 days (Includes 2 photos free)',
    descSi: 'දින 30ක් නොමිලේ පළ වේ. නොමිලේ ඡායාරූප 2ක් පමණක් ඇතුළත් කළ හැකිය.'
  },
  top: {
    priceLkr: 1000,
    titleEn: 'Top Ad (Green Highlight)',
    titleSi: 'ටොප් ඇඩ් (Top Ad - හරිත හයිලයිට්)',
    descEn: 'Displayed above all normal ads with verified badge (5 photos free, extra Rs. 100/photo)',
    descSi: 'සාමාන්‍ය දැන්වීම් වලට ඉහළින් කොළ පැහැති හයිලයිට් සහිතව ප්‍රදර්ශනය වේ (ඡායාරූප 5ක් නොමිලේ)'
  },
  urgent: {
    priceLkr: 1800,
    titleEn: 'Urgent Ad (Red Pulse Highlight)',
    titleSi: 'අර්ජන්ට් ඇඩ් (Urgent Ad - රතු ඇනිමේෂන්)',
    descEn: 'Highest priority! Homepage flash banner, red pulse border & maximum buyers',
    descSi: 'ඉහළම ප්‍රමුඛතාවය! මුල් පිටුවේ Flash Banner, රතු පැහැති ඇනිමේෂන් හයිලයිට් සහ උපරිම ප්‍රතිචාර'
  }
};

// Machine Operator Ranking Packages (Bronze, Silver, Gold, Platinum, Platinum Lifetime)
export const OPERATOR_PACKAGES = {
  bronze: {
    id: 'bronze',
    rank: 1,
    titleSi: 'Bronze ශ්‍රේණිය (නොමිලේ - Free)',
    titleEn: 'Bronze Operator (Free)',
    feeLkr: 0,
    periodSi: 'නොමිලේ (Free)',
    periodEn: 'Free Forever',
    badgeColor: 'bg-amber-800 text-amber-100 border-amber-900',
    colorTheme: 'amber',
    perksSi: 'මූලික ලියාපදිංචිය, මූලික මැහුම් කුසලතා සහ දුරකථන අංක පෙන්වීම',
    perksEn: 'Standard directory listing with direct contact'
  },
  silver: {
    id: 'silver',
    rank: 2,
    titleSi: 'Silver ශ්‍රේණිය (රු. 1,000/- අවුරුද්ද)',
    titleEn: 'Silver Operator (Rs. 1,000 / 1 Year)',
    feeLkr: 1000,
    periodSi: 'අවුරුදු 1',
    periodEn: '1 Year',
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-400',
    colorTheme: 'slate',
    perksSi: 'සෙවුම් ප්‍රතිඵල වල ඉහළින් පෙන්වීම (Boosted Search), Silver Operator Badge',
    perksEn: 'Priority search ranking, verified Silver badge'
  },
  gold: {
    id: 'gold',
    rank: 3,
    titleSi: 'Gold ශ්‍රේණිය (රු. 3,000/- අවුරුද්ද)',
    titleEn: 'Gold Operator (Rs. 3,000 / 1 Year)',
    feeLkr: 3000,
    periodSi: 'අවුරුදු 1',
    periodEn: '1 Year',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400',
    colorTheme: 'gold',
    perksSi: 'ගාර්මන්ට් කර්මාන්තශාලා සෘජු බඳවාගැනීම් වලට නිර්දේශය, Gold Verified Badge',
    perksEn: 'Featured operator recommendations, Gold Verified badge'
  },
  platinum: {
    id: 'platinum',
    rank: 4,
    titleSi: 'Platinum ශ්‍රේණිය (රු. 5,000/- අවුරුද්ද)',
    titleEn: 'Platinum Operator (Rs. 5,000 / 1 Year)',
    feeLkr: 5000,
    periodSi: 'අවුරුදු 1',
    periodEn: '1 Year',
    badgeColor: 'bg-purple-900 text-white border-purple-500',
    colorTheme: 'purple',
    perksSi: 'ඉහළම ප්‍රමුඛතාවය, මුල් පිටුවේ Featured Operator ප්‍රදර්ශනය, VIP සහය',
    perksEn: 'Top priority algorithm, featured on homepage showcase'
  },
  platinum_lifetime: {
    id: 'platinum_lifetime',
    rank: 5,
    titleSi: 'Platinum Lifetime ශ්‍රේණිය (රු. 10,000/- ජීවිත කාලයටම)',
    titleEn: 'Platinum Lifetime VIP (Rs. 10,000 / Lifetime)',
    feeLkr: 10000,
    periodSi: 'ජීවිත කාලයටම (LifeTime)',
    periodEn: 'Lifetime Access',
    badgeColor: 'bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-amber-300 border-amber-400',
    colorTheme: 'indigo',
    perksSi: 'ජීවිත කාලයටම #1 ප්‍රමුඛතාවය, කිසිදා කල් ඉකුත් නොවේ, Platinum Crown VIP Badge',
    perksEn: 'Permanent #1 priority, never expires, ultimate VIP Crown badge'
  }
};

// Machine operator upgrade discount: 25% discount when upgrading from lower package to next package
export const OPERATOR_UPGRADE_DISCOUNT_PERCENT = 25;

// Official Initial Payment Accounts (Configurable in Admin Panel)
export const BANK_ACCOUNTS = [
  {
    id: 'bank-boc-1',
    bankName: 'Bank of Ceylon (BOC)',
    bankNameSi: 'ලංකා බැංකුව (BOC)',
    accountNumber: '8910452319',
    accountName: 'SewLanka Classifieds (Pvt) Ltd',
    branch: 'Maharagama (මහරගම ශාඛාව)',
    isActive: true
  },
  {
    id: 'bank-comb-2',
    bankName: 'Commercial Bank of Ceylon',
    bankNameSi: 'කොමර්ෂල් බැංකුව',
    accountNumber: '1000489214',
    accountName: 'SewLanka Advertising & Garment Network',
    branch: 'Pamunuwa / Maharagama',
    isActive: true
  },
  {
    id: 'bank-sampath-3',
    bankName: 'Sampath Bank',
    bankNameSi: 'සම්පත් බැංකුව',
    accountNumber: '012910045612',
    accountName: 'SewLanka Lanka Apparels',
    branch: 'City Office Colombo',
    isActive: true
  }
];

// Initial LankaQR payment settings (Configurable in Admin Panel)
export const DEFAULT_QR_SETTINGS = {
  merchantName: 'SewLanka Apparels & Classifieds',
  qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226480009LK.LANKAQR011210004892140208SEWLAN03520473995303144540410005802LK5916SewLanka+Apparel6007Colombo6304A1B2',
  instructionsSi: 'BOC SmartPay, Flash, FriMi, Genie, හෝ ඕනෑම LankaQR සහය දක්වන බැංකු ඇප් එකකින් QR කේතය ස්කෑන් කර ගෙවීම් කරන්න.',
  instructionsEn: 'Scan using BOC SmartPay, Commercial Flash, FriMi, Genie or any LankaQR-certified mobile banking app.'
};

// Initial Promotional Discount Codes (Configurable in Admin Panel)
export const DEFAULT_PROMO_CODES = [
  {
    id: 'promo-1',
    code: 'SEWLANKA25',
    discountType: 'percentage' as const,
    discountValue: 25,
    minSpend: 500,
    isActive: true,
    description: '25% Special Promotional Launch Discount',
    usageCount: 14
  },
  {
    id: 'promo-2',
    code: 'SAVE500',
    discountType: 'fixed' as const,
    discountValue: 500,
    minSpend: 1500,
    isActive: true,
    description: 'රු. 500 ක් කපාහැරීමේ වට්ටම',
    usageCount: 28
  },
  {
    id: 'promo-3',
    code: 'TOPDEAL',
    discountType: 'percentage' as const,
    discountValue: 15,
    minSpend: 800,
    isActive: true,
    description: 'Top Ads 15% Discount Promo',
    usageCount: 9
  }
];

// User Membership Tiers & Ranking System
export const USER_MEMBERSHIPS = {
  starter: {
    id: 'starter',
    rank: 1,
    titleEn: 'Starter Member',
    titleSi: 'නොමිලේ සාමාජිකත්වය (Free Starter)',
    feeLkr: 0,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    colorTheme: 'slate',
    perksSi: 'නොමිලේ සාමාන්‍ය දැන්වීම් පළ කිරීමේ හැකියාව',
    perksEn: 'Free ad posting with standard listing'
  },
  silver: {
    id: 'silver',
    rank: 2,
    titleEn: 'Silver Member',
    titleSi: 'සිල්වර් සාමාජිකත්වය (Silver)',
    feeLkr: 2500,
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-400',
    colorTheme: 'cyan',
    perksSi: 'ලිස්ට් වල ඉහළින් පෙන්වීම (Boosted Search Rank), සිල්වර් ලාංඡනය',
    perksEn: 'Priority search ranking, verified silver badge'
  },
  gold: {
    id: 'gold',
    rank: 3,
    titleEn: 'Gold Member',
    titleSi: 'ගෝල්ඩ් සාමාජිකත්වය (Gold)',
    feeLkr: 5000,
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400',
    colorTheme: 'amber',
    perksSi: 'ඉදිරියෙන්ම ප්‍රදර්ශනය, වැඩිම ඇඩ් විව්ස්, ගෝල්ඩ් Verified ලාංඡනය',
    perksEn: 'Featured at the top of category lists, verified gold badge'
  },
  platinum: {
    id: 'platinum',
    rank: 4,
    titleEn: 'Platinum VIP Member',
    titleSi: 'ප්ලැටිනම් VIP සාමාජිකත්වය (Platinum VIP)',
    feeLkr: 10000,
    badgeColor: 'bg-purple-900 text-white border-purple-500',
    colorTheme: 'purple',
    perksSi: 'අංක 1 නිර්දේශිත ශ්‍රේණිගත කිරීම, මුල් පිටුවේ VIP ප්‍රදර්ශනය, 24/7 සහය',
    perksEn: '#1 algorithm priority, homepage VIP showcase, priority badge'
  }
};

// PayPal Live Client ID provided by user
export const PAYPAL_CLIENT_ID = 'BAAvJ97EMwKdywUvNOw4w89xw0hWI0KBZGtxxdyFnrdwIdcSC-JEo_GxHyjZmrn-BqTlv0m1I0_w6SFXAg';

// Standard Sri Lanka Rupee (LKR) to US Dollar (USD) Conversion Rate
// PayPal does not accept LKR natively, so transactions are calculated in USD
export const LKR_PER_USD = 305; // 1 USD ≈ 305 LKR

export function convertLkrToUsd(lkr: number): number {
  if (!lkr || lkr <= 0) return 0;
  return Number((lkr / LKR_PER_USD).toFixed(2));
}

export function formatDualPrice(lkr: number): string {
  if (lkr === 0) return 'නොමිලේ (Free / $0.00)';
  const usd = convertLkrToUsd(lkr);
  return `රු. ${lkr.toLocaleString()} ($${usd.toFixed(2)} USD)`;
}

export const TECHNICIAN_MEMBERSHIPS = {
  silver: {
    id: 'silver',
    titleSi: 'සිල්වර් සාමාජිකත්වය (Silver)',
    titleEn: 'Silver Mechanic',
    initialFeeLkr: 1000,
    monthlySubscriptionLkr: 100,
    monthlySubscriptionUsd: 0.33,
    initialFeeUsd: 3.28,
    monthlyTextSi: 'මාසිකව රු. 100/- ($0.33 USD)',
    monthlyTextEn: 'Monthly Rs. 100/- ($0.33 USD)',
    descSi: 'සාමාන්‍ය ලැයිස්තුගත කිරීම, දුරකථන අංක සහ WhatsApp සෘජු සබඳතා. මූලික ගාස්තුවට අමතරව මසකට රු. 100/- ක සබ්ස්ක්‍රිප්ෂන් ගාස්තුවක් අයවේ.',
    descEn: 'Standard mechanic directory listing with verified phone. Includes initial fee plus Rs. 100/mo recurring subscription.',
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-400'
  },
  gold: {
    id: 'gold',
    titleSi: 'ගෝල්ඩ් සාමාජිකත්වය (Gold Member)',
    titleEn: 'Gold Certified Mechanic',
    initialFeeLkr: 2500,
    monthlySubscriptionLkr: 200,
    monthlySubscriptionUsd: 0.66,
    initialFeeUsd: 8.20,
    monthlyTextSi: 'මාසිකව රු. 200/- ($0.66 USD)',
    monthlyTextEn: 'Monthly Rs. 200/- ($0.66 USD)',
    descSi: 'දිස්ත්‍රික්කය තුළ ඉහළින්ම ප්‍රදර්ශනය සහ Gold Verified ලාංඡනය. මූලික ගාස්තුවට අමතරව මසකට රු. 200/- ක සබ්ස්ක්‍රිප්ෂන් ගාස්තුවක් අයවේ.',
    descEn: 'Priority ranking in district search results with verified badge. Initial fee plus Rs. 200/mo recurring subscription.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-400'
  },
  platinum: {
    id: 'platinum',
    titleSi: 'ප්ලැටිනම් VIP (Platinum VIP)',
    titleEn: 'Platinum VIP Master Mechanic',
    initialFeeLkr: 5000,
    monthlySubscriptionLkr: 300,
    monthlySubscriptionUsd: 0.98,
    initialFeeUsd: 16.39,
    monthlyTextSi: 'මාසිකව රු. 300/- ($0.98 USD)',
    monthlyTextEn: 'Monthly Rs. 300/- ($0.98 USD)',
    descSi: 'ඉහළම නිර්දේශය, පැය 24 හදිසි බිඳවැටීම් සේවා ලාංඡනය (24/7 Breakdown Dispatch). මූලික ගාස්තුවට අමතරව මසකට රු. 300/- ක සබ්ස්ක්‍රිප්ෂන් ගාස්තුවක් අයවේ.',
    descEn: 'Top featured placement with 24/7 emergency dispatch badge. Initial fee plus Rs. 300/mo recurring subscription.',
    badgeColor: 'bg-indigo-900 text-white border-indigo-400'
  },
  platinum_lifetime: {
    id: 'platinum_lifetime',
    titleSi: 'ප්ලැටිනම් ලයිෆ්ටයිම් (Platinum Lifetime VIP)',
    titleEn: 'Platinum Lifetime VIP Mechanic',
    initialFeeLkr: 10000,
    monthlySubscriptionLkr: 0,
    monthlySubscriptionUsd: 0,
    initialFeeUsd: 32.79,
    monthlyTextSi: 'මාසික ගාස්තු කිසිවක් නොමැත (Free Forever)',
    monthlyTextEn: 'No Monthly Fees (Free Forever)',
    descSi: 'ජීවිත කාලයටම #1 ප්‍රමුඛතාවය. කිසිදු මාසික ගාස්තුවක් අය නොවේ (0 Monthly Fee). එක්වරක් පමණක් ගෙවා ජීවිත කාලයටම VIP පිළිගැනීම හිමිවේ.',
    descEn: 'Lifetime #1 priority. Zero monthly subscription fees forever. One-time payment for perpetual VIP status.',
    badgeColor: 'bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-amber-300 border-amber-400'
  }
};
