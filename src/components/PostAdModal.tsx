import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Star, 
  Flame, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Sparkles,
  FileCheck2,
  Cog,
  Shirt,
  Wrench,
  UserCheck,
  Building2,
  QrCode,
  CreditCard,
  Plus,
  BadgeDollarSign,
  Loader2,
  Calendar,
  Tag,
  Gift,
  Percent,
  Copy,
  HelpCircle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Clock,
  Scissors,
  Award,
  Crown,
  Info
} from 'lucide-react';
import { 
  Ad, 
  AdDuration, 
  AdTier, 
  Category, 
  Language, 
  MachineCondition, 
  TechnicianTier, 
  OperatorTier, 
  UserAccount, 
  PromoCode, 
  BankAccount, 
  QRPaymentSetting 
} from '../types';
import { translations } from '../utils/translations';
import { uploadAdPhotoToSupabase } from '../utils/supabaseService';
import { 
  SRI_LANKA_DISTRICTS, 
  MACHINE_BRANDS, 
  APPAREL_SIZES, 
  SUBCONTRACT_WORK_TYPES, 
  AD_DURATION_PRICING,
  EXTRA_PHOTO_PRICE_LKR,
  BANK_ACCOUNTS,
  AD_PRICING,
  OPERATOR_PACKAGES,
  DEFAULT_PROMO_CODES,
  DEFAULT_QR_SETTINGS,
  calculateCustomAdPricing,
  PAYPAL_CLIENT_ID,
  convertLkrToUsd,
  formatDualPrice,
  LKR_PER_USD
} from '../data/sriLankaData';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: UserAccount | null;
  onSubmitAd: (newAd: Ad) => void;
  onOpenAuth?: () => void;
  promoCodes?: PromoCode[];
  bankAccounts?: BankAccount[];
  qrSettings?: QRPaymentSetting;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  onSubmitAd,
  onOpenAuth,
  promoCodes = DEFAULT_PROMO_CODES,
  bankAccounts = BANK_ACCOUNTS,
  qrSettings = DEFAULT_QR_SETTINGS,
}) => {
  const t = translations[language];

  // Wizard Step: 1 = Category, 2 = Details, 3 = Photos & Limits, 4 = Duration & Package, 5 = Payment & Contact
  const [step, setStep] = useState(1);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Form State
  const [category, setCategory] = useState<Category>('subcontract');
  const [tier, setTier] = useState<AdTier>('normal');
  const [duration, setDuration] = useState<AdDuration>('1_month');
  const [operatorTier, setOperatorTier] = useState<OperatorTier>('bronze');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Custom Days & Calendar State
  const todayStr = new Date().toISOString().split('T')[0];
  const [customDays, setCustomDays] = useState<number>(2);
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // Category dynamic attributes
  // For Garments
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [totalQuantity, setTotalQuantity] = useState<number | ''>('');
  const [minOrderQuantity, setMinOrderQuantity] = useState<number | ''>('');

  // For Subcontracts
  const [pieceRate, setPieceRate] = useState<number | ''>('');
  const [orderQuantity, setOrderQuantity] = useState<number | ''>('');
  const [workType, setWorkType] = useState('Full Production (Cutting + Stitching + Packing)');
  const [completionDeadline, setCompletionDeadline] = useState('');
  const [materialProvided, setMaterialProvided] = useState(true);

  // For Machines
  const [brand, setBrand] = useState('Juki');
  const [model, setModel] = useState('');
  const [machineType, setMachineType] = useState('Single Needle Lockstitch (හයි ස්පීඩ් තනි ඉදිකටු මැෂින්)');
  const [condition, setCondition] = useState<MachineCondition>('reconditioned');
  const [warrantyMonths, setWarrantyMonths] = useState<number | ''>(6);

  // For Spare Parts
  const [partName, setPartName] = useState('');
  const [compatibleBrands, setCompatibleBrands] = useState<string[]>(['Juki', 'Brother']);
  const [sparePartCondition, setSparePartCondition] = useState<'Brand New Original' | 'OEM Replacement' | 'Used / Reconditioned'>('Brand New Original');

  // For Technicians
  const [technicianTier, setTechnicianTier] = useState<TechnicianTier>('silver');
  const [experienceYears, setExperienceYears] = useState<number | ''>(5);
  const [specialitiesInput, setSpecialitiesInput] = useState('ජුකි, බ්‍රදර් සියලුම ඇඟලුම් මැෂින් අලුත්වැඩියාව');
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState(false);
  const [technicianMachineTypes, setTechnicianMachineTypes] = useState<string[]>([
    'Single Needle Lockstitch (තනි ඉදිකටු)',
    '4-Thread Overlock (ඕවර්ලොක්)',
    'Interlock / Flatlock (කොලරට්)',
    'Direct Drive Servo Motors'
  ]);
  const [technicianBrands, setTechnicianBrands] = useState<string[]>(['Juki', 'Brother', 'Singer', 'Jack']);
  const [inspectionFee, setInspectionFee] = useState<number | ''>(1500);

  // For Machine Operators
  const [operatorSkills, setOperatorSkills] = useState<string[]>([
    'Single Needle Lockstitch (Juki)',
    '4-Thread Overlock',
    'High Speed Production'
  ]);
  const [operatorDailyRate, setOperatorDailyRate] = useState<number | ''>(2500);
  const [operatorExpectedSalary, setOperatorExpectedSalary] = useState<number | ''>(65000);
  const [operatorAvailability, setOperatorAvailability] = useState<'immediate' | '1_week' | 'flexible'>('immediate');

  // Delivery & Payment
  const [codAvailable, setCodAvailable] = useState(true);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Photos & Extra photo logic
  const [images, setImages] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Seller Details
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [businessName, setBusinessName] = useState(currentUser?.businessName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Colombo');
  const [city, setCity] = useState(currentUser?.city || '');

  const [showAuthGate, setShowAuthGate] = useState(false);

  // Synchronize when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!sellerName && currentUser.name) setSellerName(currentUser.name);
      if (!businessName && currentUser.businessName) setBusinessName(currentUser.businessName);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
      if (!whatsapp && currentUser.whatsapp) setWhatsapp(currentUser.whatsapp);
      if (!district && currentUser.district) setDistrict(currentUser.district);
      if (!city && currentUser.city) setCity(currentUser.city);
      if (showAuthGate) {
        setShowAuthGate(false);
        setStep(2);
      }
    }
  }, [currentUser, showAuthGate]);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Payment Options (Card/PayPal, Bank Transfer, LankaQR)
  const [paymentMethod, setPaymentMethod] = useState<'card_paypal' | 'bank_transfer' | 'lanka_qr'>('card_paypal');
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  const [paymentRef, setPaymentRef] = useState('');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [payPalCaptured, setPayPalCaptured] = useState(false);
  const [isPayPalLoading, setIsPayPalLoading] = useState(true);
  const [payPalError, setPayPalError] = useState<string | null>(null);
  const [payPalRenderAttempts, setPayPalRenderAttempts] = useState(0);
  const [step2Error, setStep2Error] = useState('');

  // Max free photos: 2 for Normal, 5 for Top/Urgent/Operator
  const freePhotosLimit = tier === 'normal' && category !== 'operators' ? 2 : 5;
  const extraPhotosCount = Math.max(0, images.length - freePhotosLimit);
  const extraPhotosFee = extraPhotosCount * EXTRA_PHOTO_PRICE_LKR;

  // Calculate Base price and reach
  let baseAdPrice = 0;
  let estimatedReachText = '';

  if (category === 'operators') {
    const op = OPERATOR_PACKAGES[operatorTier];
    baseAdPrice = op.feeLkr;
    estimatedReachText = `${op.titleEn} - Verified Candidate Showcase`;
  } else if (tier === 'normal') {
    baseAdPrice = 0;
    estimatedReachText = language === 'si' ? 'සාමාන්‍ය නිරීක්ෂණ (Organic Reach)' : 'Standard Organic Reach';
  } else if (tier === 'top') {
    if (duration === 'custom') {
      const calc = calculateCustomAdPricing('top', customDays);
      baseAdPrice = calc.priceLkr;
      estimatedReachText = calc.reachText;
    } else {
      baseAdPrice = AD_DURATION_PRICING.top[duration as '1_month' | '3_months' | '1_year']?.lkr || 1000;
      estimatedReachText = AD_DURATION_PRICING.top[duration as '1_month' | '3_months' | '1_year']?.reach || '1.0k - 6.6k reach';
    }
  } else if (tier === 'urgent') {
    if (duration === 'custom') {
      const calc = calculateCustomAdPricing('urgent', customDays);
      baseAdPrice = calc.priceLkr;
      estimatedReachText = calc.reachText;
    } else {
      baseAdPrice = AD_DURATION_PRICING.urgent[duration as '1_month' | '3_months' | '1_year']?.lkr || 1800;
      estimatedReachText = AD_DURATION_PRICING.urgent[duration as '1_month' | '3_months' | '1_year']?.reach || '2.5k - 15.0k reach';
    }
  }

  // Subtotal before discount
  const subtotalFee = baseAdPrice + extraPhotosFee;

  // Promo Code Discount calculation
  let discountAmount = 0;
  if (appliedPromo && subtotalFee > 0) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = Math.round((subtotalFee * appliedPromo.discountValue) / 100);
    } else {
      discountAmount = Math.min(subtotalFee, appliedPromo.discountValue);
    }
  }

  const grandTotalFee = Math.max(0, subtotalFee - discountAmount);
  const grandTotalUsd = convertLkrToUsd(grandTotalFee);

  // Real PayPal JS SDK Buttons mount
  useEffect(() => {
    if (!isOpen || step !== 5 || paymentMethod !== 'card_paypal' || grandTotalFee <= 0) {
      return;
    }

    setIsPayPalLoading(true);
    setPayPalError(null);

    let isMounted = true;
    let pollTimer: any = null;

    const renderPayPalButtons = (): boolean => {
      const container = document.getElementById('paypal-button-container');
      if (!container || !isMounted) return false;

      const paypal = (window as any).paypal;
      if (!paypal?.Buttons) return false;

      container.innerHTML = '';
      try {
        const usdVal = convertLkrToUsd(grandTotalFee).toFixed(2);
        const sellerFullName = (sellerName || currentUser?.name || 'Customer').trim();
        const nameParts = sellerFullName.split(' ');
        const givenName = nameParts[0] || 'Customer';
        const surName = nameParts.slice(1).join(' ') || 'SewLanka';
        const userPhone = (phone || currentUser?.phone || '0771234567').replace(/\D/g, '').slice(-9);
        const userEmail = currentUser?.email || 'customer@sewlanka.lk';
        const userCity = city || currentUser?.city || 'Colombo';

        paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 48
          },
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              intent: 'CAPTURE',
              payer: {
                name: {
                  given_name: givenName,
                  surname: surName
                },
                email_address: userEmail,
                phone: {
                  phone_type: 'MOBILE',
                  phone_number: {
                    national_number: userPhone || '771234567'
                  }
                },
                address: {
                  address_line_1: userCity,
                  admin_area_2: userCity,
                  postal_code: '10280',
                  country_code: 'LK'
                }
              },
              purchase_units: [{
                description: `SewLanka Ad: ${title || 'Apparel Classified'}`,
                amount: {
                  currency_code: 'USD',
                  value: usdVal
                }
              }],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW'
              }
            });
          },
          onApprove: async (_data: any, actions: any) => {
            try {
              const order = await actions.order.capture();
              const captureId = order?.id || order?.purchase_units?.[0]?.payments?.captures?.[0]?.id || `PP-LIVE-${Date.now()}`;
              if (isMounted) {
                setPaymentRef(captureId);
                setPayPalCaptured(true);
              }
            } catch (captureErr: any) {
              console.error('PayPal Order Capture Error:', captureErr);
              if (isMounted) {
                setPayPalError('ගෙවීම තහවුරු කිරීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
              }
            }
          },
          onError: (err: any) => {
            console.error('PayPal Live Buttons runtime error:', err);
            if (isMounted) {
              setPayPalError('PayPal ගෙවීම් ද්වාරය සම්බන්ධ වීමේදී දෝෂයක් ඇතිවිය.');
            }
          }
        }).render('#paypal-button-container')
        .then(() => {
          if (isMounted) setIsPayPalLoading(false);
        })
        .catch((renderErr: any) => {
          console.warn('PayPal render catch:', renderErr);
          if (isMounted) {
            setIsPayPalLoading(false);
          }
        });

        return true;
      } catch (err: any) {
        console.error('PayPal Buttons initialization failed:', err);
        if (isMounted) {
          setPayPalError('PayPal Buttons initialize කිරීමට නොහැකි විය.');
          setIsPayPalLoading(false);
        }
        return true;
      }
    };

    // Try rendering immediately if SDK is already initialized
    if (!renderPayPalButtons()) {
      let count = 0;
      pollTimer = setInterval(() => {
        count++;
        if (renderPayPalButtons() || count > 20) {
          clearInterval(pollTimer);
          if (isMounted && count > 20 && !(window as any).paypal?.Buttons) {
            setIsPayPalLoading(false);
            setPayPalError('PayPal SDK එක පූරණය වීමේ ප්‍රමාදයක් පවතී. කරුණාකර පිටුව Refresh කරන්න.');
          }
        }
      }, 300);
    }

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [isOpen, step, paymentMethod, grandTotalFee, title, sellerName, currentUser, phone, city, payPalRenderAttempts]);

  // Handle Date range change for Custom Days
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    const startD = new Date(newStart);
    const endD = new Date(endDate);
    let diffDays = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 2) {
      diffDays = 2;
      const targetEnd = new Date(startD);
      targetEnd.setDate(targetEnd.getDate() + 2);
      setEndDate(targetEnd.toISOString().split('T')[0]);
    }
    setCustomDays(diffDays);
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    const startD = new Date(startDate);
    const endD = new Date(newEnd);
    let diffDays = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 2) diffDays = 2;
    setCustomDays(diffDays);
  };

  const handleCustomDaysChange = (days: number) => {
    const validDays = Math.max(2, days);
    setCustomDays(validDays);
    const startD = new Date(startDate || todayStr);
    const targetEnd = new Date(startD);
    targetEnd.setDate(targetEnd.getDate() + validDays);
    setEndDate(targetEnd.toISOString().split('T')[0]);
  };

  // Promo code apply handler
  const handleApplyPromoCode = () => {
    setPromoMessage(null);
    const codeClean = promoCodeInput.trim().toUpperCase();
    if (!codeClean) return;

    const found = promoCodes.find((p) => p.code.toUpperCase() === codeClean && p.isActive);
    if (!found) {
      setPromoMessage({
        text: language === 'si' ? 'වලංගු නොවන හෝ කල් ඉකුත් වූ ප්‍රමෝ කේතයකි' : 'Invalid or expired promo code',
        type: 'error'
      });
      return;
    }

    if (found.minSpend && subtotalFee < found.minSpend) {
      setPromoMessage({
        text: language === 'si' 
          ? `මෙම කේතය සඳහා අවම ඇණවුම් මුදල රු. ${found.minSpend} කි.`
          : `Minimum order value of Rs. ${found.minSpend} required.`,
        type: 'error'
      });
      return;
    }

    setAppliedPromo(found);
    setPromoMessage({
      text: language === 'si' 
        ? `සාර්ථකයි! "${found.code}" වට්ටම් කේතය ක්‍රියාත්මක විය.`
        : `Success! "${found.code}" applied.`,
      type: 'success'
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoMessage(null);
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    
    // Normal ads capped at 2 unless upgraded
    if (tier === 'normal' && category !== 'operators' && images.length + files.length > 2) {
      setPhotoError(
        language === 'si'
          ? 'නෝමල් ඇඩ් (Normal Ad) සඳහා නොමිලේ ඡායාරූප 2ක් පමණක් හිමිවේ. වැඩිපුර ඡායාරූප ඇතුළත් කිරීමට කරුණාකර ටොප් ඇඩ් (Top Ad) හෝ අර්ජන්ට් (Urgent) තෝරන්න.'
          : 'Normal ads include 2 free photos. Upgrade to Top Ad or Urgent Ad to add more photos.'
      );
      return;
    }

    if (images.length + files.length > 10) {
      setPhotoError(language === 'si' ? 'උපරිම වශයෙන් ඡායාරූප 10ක් පමණක් ඇතුළත් කළ හැක' : 'Maximum 10 photos allowed');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      for (const file of files) {
        const res = await uploadAdPhotoToSupabase(file);
        if (res.url) {
          setImages((prev) => [...prev, res.url].slice(0, 10));
        }
      }
    } catch (err) {
      console.error('Photo upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLoadSamplePhotos = () => {
    let sampleSet: string[] = [];
    if (category === 'subcontract') {
      sampleSet = [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
      ];
    } else if (category === 'machines') {
      sampleSet = [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
      ];
    } else if (category === 'technicians') {
      sampleSet = [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
      ];
    } else if (category === 'operators') {
      sampleSet = [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
      ];
    } else if (category === 'spare_parts') {
      sampleSet = [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
      ];
    } else {
      sampleSet = [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80'
      ];
    }
    setImages(sampleSet);
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => 
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleOperatorSkill = (skill: string) => {
    setOperatorSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleProceedToStep3 = () => {
    setStep2Error('');
    if (category === 'technicians') {
      if (!sellerName.trim() && !title.trim()) {
        setStep2Error(language === 'si' ? 'කරුණාකර කාර්මික ශිල්පියාගේ හෝ ආයතනයේ නම ඇතුළත් කරන්න.' : 'Please enter technician or workshop name.');
        return;
      }
    } else if (category === 'operators') {
      if (!sellerName.trim() && !title.trim()) {
        setStep2Error(language === 'si' ? 'කරුණාකර ඔපරේටර් ශිල්පියාගේ නම ඇතුළත් කරන්න.' : 'Please enter operator name.');
        return;
      }
    } else {
      if (!title.trim()) {
        setStep2Error(language === 'si' ? 'කරුණාකර දැන්වීමේ මාතෘකාව ඇතුළත් කරන්න.' : 'Please enter ad title.');
        return;
      }
    }
    setStep(3);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(fieldName);
    setTimeout(() => setCopiedBankField(null), 2500);
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeBank = bankAccounts[selectedBankIndex] || bankAccounts[0];

    let finalRef = paymentRef;
    if (grandTotalFee > 0 && paymentMethod === 'card_paypal' && !finalRef) {
      finalRef = `PP-${Date.now().toString().slice(-6)}`;
    }

    let finalTitle = title;
    if (category === 'technicians') {
      finalTitle = title || `${sellerName || 'කාර්මික ශිල්පී'} - ${specialitiesInput || 'මැෂින් රෙපයාර් සේවාව'}`;
    } else if (category === 'operators') {
      finalTitle = title || `${sellerName || 'මැසින් ඔපරේටර්'} - මැහුම් ශිල්පී පැතිකඩ`;
    } else if (category === 'machines') {
      finalTitle = title || `${brand} ${machineType} Machine`;
    } else if (category === 'spare_parts') {
      finalTitle = title || partName || 'Sewing Machine Spare Part';
    } else if (!finalTitle) {
      finalTitle = language === 'si' ? 'නව ඇඟලුම් දැන්වීම' : 'New Garment Listing';
    }

    let finalPrice = Number(price) || 0;
    if (category === 'technicians') {
      finalPrice = Number(inspectionFee) || Number(price) || 0;
    } else if (category === 'operators') {
      finalPrice = Number(operatorExpectedSalary) || Number(operatorDailyRate) || 0;
    } else if (category === 'subcontract') {
      finalPrice = Number(price) || (Number(pieceRate) * (Number(orderQuantity) || 1)) || 0;
    }

    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      title: finalTitle,
      titleSi: finalTitle,
      description: description || 'SewLanka listing verified and ready.',
      descriptionSi: description,
      category,
      tier: category === 'operators' ? (operatorTier === 'bronze' ? 'normal' : 'top') : tier,
      duration: tier !== 'normal' ? duration : undefined,
      customDays: duration === 'custom' ? customDays : undefined,
      startDate: duration === 'custom' ? startDate : undefined,
      endDate: duration === 'custom' ? endDate : undefined,
      estimatedReach: estimatedReachText,
      status: 'pending', // Starts as pending for Admin review as requested!
      price: finalPrice,
      isNegotiable,
      
      // Category attributes
      sizes: category === 'garments' ? selectedSizes : undefined,
      totalQuantity: category === 'garments' ? Number(totalQuantity) || undefined : undefined,
      minOrderQuantity: category === 'garments' ? Number(minOrderQuantity) || undefined : undefined,
      
      pieceRate: category === 'subcontract' ? Number(pieceRate) || undefined : undefined,
      orderQuantity: category === 'subcontract' ? Number(orderQuantity) || undefined : undefined,
      workType: category === 'subcontract' ? workType : undefined,
      completionDeadline: category === 'subcontract' ? completionDeadline : undefined,
      materialProvided: category === 'subcontract' ? materialProvided : undefined,
      
      brand: (category === 'machines' || category === 'technicians') ? brand : undefined,
      model: category === 'machines' ? model : undefined,
      machineType: category === 'machines' ? machineType : undefined,
      condition: category === 'machines' ? condition : undefined,
      warrantyMonths: category === 'machines' ? Number(warrantyMonths) || undefined : undefined,
      
      partName: category === 'spare_parts' ? (partName || title) : undefined,
      compatibleBrands: category === 'technicians' ? technicianBrands : (category === 'spare_parts' ? compatibleBrands : undefined),
      
      technicianTier: category === 'technicians' ? technicianTier : undefined,
      experienceYears: (category === 'technicians' || category === 'operators') ? Number(experienceYears) || undefined : undefined,
      specialities: category === 'technicians' ? (technicianMachineTypes.length > 0 ? technicianMachineTypes : specialitiesInput.split(',').map(s => s.trim())) : undefined,
      isEmergencyAvailable: category === 'technicians' ? isEmergencyAvailable : undefined,
      
      // Operator attributes
      operatorTier: category === 'operators' ? operatorTier : undefined,
      machineSkills: category === 'operators' ? operatorSkills : undefined,
      dailyRate: category === 'operators' ? Number(operatorDailyRate) || undefined : undefined,
      monthlyExpectedSalary: category === 'operators' ? Number(operatorExpectedSalary) || undefined : undefined,
      availability: category === 'operators' ? operatorAvailability : undefined,

      codAvailable,
      deliveryAvailable,
      deliveryNotes,
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
      ],
      extraPhotosCount,
      extraPhotosFee,
      
      seller: {
        name: sellerName || currentUser?.name || 'SewLanka Member',
        businessName: businessName || currentUser?.businessName || undefined,
        phone: phone || currentUser?.phone || '0771234567',
        whatsapp: whatsapp || currentUser?.whatsapp || '94771234567',
        district: district || currentUser?.district || 'Colombo',
        city: city || currentUser?.city || 'Maharagama',
        verified: currentUser?.status === 'active',
        membershipTier: currentUser?.membershipTier || 'starter',
        operatorTier: category === 'operators' ? operatorTier : currentUser?.operatorTier,
        memberSince: '2026',
        userRole: category === 'operators' ? 'operator' : 'individual',
        nic: currentUser?.nic
      },
      paymentMethod: grandTotalFee > 0 ? paymentMethod : undefined,
      paymentRef: grandTotalFee > 0 ? (finalRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`) : undefined,
      totalCostLkr: grandTotalFee,
      promoCode: appliedPromo?.code,
      discountAmount,
      createdAt: new Date().toISOString(),
      views: 0
    };

    onSubmitAd(newAd);
    setIsSubmittedSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSubmittedSuccess(false);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {language === 'si' ? 'නව දැන්වීමක් පළ කිරීම සහ ප්‍රවර්ධනය' : 'Post Ad & Boost Visibility'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {category === 'operators'
              ? (language === 'si' ? 'මැසින් ඔපරේටර් ලියාපදිංචිය සහ ශ්‍රේණිගත කිරීම' : 'Machine Operator Directory & Ranking')
              : (language === 'si' ? 'ඇඟලුම් දැන්වීමක් ඇතුළත් කරන්න' : 'Post Garment & Sewing Ad')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'si'
              ? 'මහා පරිමාණ කර්මාන්තශාලා, කුඩා මැහුම්හල්, සහ ගෘහස්ථ නිෂ්පාදකයින් වෙත ඔබගේ දැන්වීම යොමු කරන්න'
              : 'Reach manufacturers, tailors, machine buyers, and operators islandwide'}
          </p>

          {/* Stepper Indicator */}
          {!isSubmittedSuccess && (
            <div className="flex items-center justify-between mt-5 gap-1 max-w-lg">
              {[
                { num: 1, label: language === 'si' ? 'අංශය' : 'Category' },
                { num: 2, label: language === 'si' ? 'විස්තර' : 'Details' },
                { num: 3, label: language === 'si' ? 'ඡායාරූප' : 'Photos' },
                { num: 4, label: language === 'si' ? 'පැකේජය/රිච්' : 'Package' },
                { num: 5, label: language === 'si' ? 'ගෙවීම්/සබඳතා' : 'Payment' },
              ].map((s) => (
                <div key={s.num} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s.num
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {/* Submission Success State */}
          {isSubmittedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                {language === 'si' ? 'දැන්වීම සාර්ථකව යොමු විය!' : 'Ad Successfully Submitted!'}
              </h3>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 max-w-lg mx-auto text-left text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    {language === 'si'
                      ? 'පැය 24ක් තුළ අපගේ ඇඩ්මින් හරහා සක්‍රිය කරනු ලැබේ (Pending Review)'
                      : 'Account & Ad will be activated by Admin within 24 hours'}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {language === 'si'
                    ? 'ඔබගේ දැන්වීම සහ ගෙවීම් තොරතුරු සමාලෝචනය සඳහා ඇඩ්මින් මණ්ඩලයට යොමු විය. ඇඩ්මින් විසින් අනුමත කළ වහාම මෙය වෙබ් අඩවියේ සජීවීව පළ වන අතර ඔබගේ WhatsApp වෙත සක්‍රිය කිරීමේ පණිවිඩයක් ලැබෙනු ඇත.'
                    : 'Your ad and payment details are queued for verification. Once approved by the administrator, your ad will go live across the platform.'}
                </p>
                {paymentRef && (
                  <p className="font-semibold text-slate-800 bg-white/80 p-2 rounded-lg border border-amber-200">
                    Payment Reference Code: <span className="text-emerald-700 font-black">{paymentRef}</span>
                  </p>
                )}
                {grandTotalFee > 0 && (
                  <p className="text-xs text-slate-600">
                    Total Paid / Payable: <strong>රු. {grandTotalFee.toLocaleString()}</strong>
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleResetAndClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  {language === 'si' ? 'වෙබ් අඩවියට පිවිසෙන්න' : 'Return to Website'}
                </button>
              </div>
            </div>
          ) : !currentUser ? (
            /* USER NOT LOGGED IN GATE */
            <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-amber-50">
                <UserCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'si' ? 'ගිණුමක් අවශ්‍යයි (Account Required)' : 'Account Required to Post Ad'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'si' 
                    ? 'දැන්වීමක් පළ කිරීමට පෙර කරුණාකර ඔබගේ ගිණුමට ඇතුල් වන්න හෝ ලියාපදිංචි වන්න' 
                    : 'Please Sign In or Register to Post an Ad'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'si'
                    ? 'SewLanka වෙබ් අඩවියේ දැන්වීම් වල ගුණාත්මකභාවය සහ සත්‍යතාව තහවුරු කිරීම සඳහා, දැන්වීමක් පළ කිරීමට පෙර ඔබගේ SewLanka ගිණුමට ලොග් වීම අනිවාර්ය වේ. ඔබට ගිණුමක් නොමැති නම් තත්පර 30කින් නොමිලේ ලියාපදිංචි විය හැක.'
                    : 'To maintain verified and secure classifieds, please sign in to your SewLanka account or create a free account before filling your ad details.'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block">
                  {language === 'si' ? 'ලියාපදිංචි පරිශීලකයින්ට හිමිවන පහසුකම්:' : 'Member Benefits:'}
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
                  <li>{language === 'si' ? 'ඔබගේ සියලු දැන්වීම් පහසුවෙන් සංස්කරණය සහ කළමනාකරණය' : 'Edit and manage all your live ads'}</li>
                  <li>{language === 'si' ? 'පාරිභෝගිකයින්ගේ සෘජු WhatsApp සහ ඇමතුම් ලබා ගැනීම' : 'Direct customer calls and WhatsApp inquiries'}</li>
                  <li>{language === 'si' ? 'දැන්වීමේ නැරඹුම් ප්‍රමාණය (Ad Views) සජීවීව බලාගැනීම' : 'Real-time ad reach and audience analytics'}</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth?.();
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{language === 'si' ? 'ගිණුමට ඇතුල් වන්න (Sign In)' : 'Sign In to Account'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth?.();
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'si' ? 'නොමිලේ ලියාපදිංචි වන්න (Register)' : 'Register Free'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logged in User Bar */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700">
                    {language === 'si' ? 'ලොග් වී ඇති ගිණුම:' : 'Logged in as:'}{' '}
                    <strong className="text-slate-900">{currentUser.name}</strong>
                    {currentUser.phone && <span className="text-slate-500 font-mono text-[11px] ml-1.5">({currentUser.phone})</span>}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase border border-emerald-300">
                  {currentUser.membershipTier || 'Verified Member'}
                </span>
              </div>
              
              {/* STEP 1: CATEGORY SELECTION */}
              {step === 1 && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-800">
                    {t.postAd.chooseCategory}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'subcontract' as Category,
                        titleSi: 'සබ් ඕඩර්ස් (Sub-Contracts)',
                        titleEn: 'Sub-Contract Orders',
                        descSi: 'ගාර්මන්ට් කර්මාන්තශාලා හෝ නිවසේ සිට මහන අයට ඇණවුම් ලබාදීමට',
                        descEn: 'Factory bulk orders or small sewing batches',
                        icon: FileCheck2,
                        color: 'text-blue-600 bg-blue-50 border-blue-200'
                      },
                      {
                        id: 'machines' as Category,
                        titleSi: 'මහන මැෂින් (Sewing Machines)',
                        titleEn: 'Sewing Machines',
                        descSi: 'ජුකි, බ්‍රදර්, සිංගර්, ජැක් මැෂින් විකිණීමට හෝ මිලදී ගැනීමට',
                        descEn: 'Single needle, overlock, buttonhole, cutting machines',
                        icon: Cog,
                        color: 'text-amber-600 bg-amber-50 border-amber-200'
                      },
                      {
                        id: 'garments' as Category,
                        titleSi: 'තොග ඇඳුම් (Wholesale Garments)',
                        titleEn: 'Wholesale Garments',
                        descSi: 'පාමනුව, මහරගම, පිටකොටුව තොග ඇඳුම්, ටී ෂර්ට්, ගවුම්',
                        descEn: 'Wholesale t-shirts, dresses, shirts, export surplus',
                        icon: Shirt,
                        color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      },
                      {
                        id: 'spare_parts' as Category,
                        titleSi: 'ස්පෙයාර් පාට්ස් (Spare Parts)',
                        titleEn: 'Machine Spare Parts',
                        descSi: 'රොටරි හුක්, මෝටර්, නූල්, කතුරු, ඉදිකටු සහ උපාංග',
                        descEn: 'Needles, hooks, tension sets, belts, attachments',
                        icon: Wrench,
                        color: 'text-purple-600 bg-purple-50 border-purple-200'
                      },
                      {
                        id: 'technicians' as Category,
                        titleSi: 'මැෂින් රෙපයාර් (Technicians)',
                        titleEn: 'Machine Mechanics',
                        descSi: 'දිවයිනේ ඕනෑම තැනක මැෂින් රෙපයාර් සේවාවන් ප්‍රචාරය කිරීමට',
                        descEn: 'Industrial sewing machine mechanic & repair',
                        icon: UserCheck,
                        color: 'text-rose-600 bg-rose-50 border-rose-200'
                      },
                      {
                        id: 'operators' as Category,
                        titleSi: 'මැසින් ඔපරේටර්වරුන් (Operators)',
                        titleEn: 'Machine Operators',
                        descSi: 'ජුකි, ඕවර්ලොක්, ෆ්ලැට්ලොක් මැහුම් ශිල්පීන් සහ ටේලර්වරුන්ගේ පැතිකඩ',
                        descEn: 'Certified machine operators, tailors & rankings',
                        icon: Scissors,
                        color: 'text-teal-600 bg-teal-50 border-teal-200'
                      },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl border shrink-0 ${cat.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {language === 'si' ? cat.titleSi : cat.titleEn}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {language === 'si' ? cat.descSi : cat.descEn}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>{language === 'si' ? 'ඉදිරියට (Next)' : 'Next Step'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS & CATEGORY ATTRIBUTES */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Step 2 Validation Error Banner */}
                  {step2Error && (
                    <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{step2Error}</span>
                    </div>
                  )}

                  {/* 1. TECHNICIAN / REPAIR MECHANIC CATEGORY */}
                  {category === 'technicians' && (
                    <div className="space-y-4">
                      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase">
                          <UserCheck className="w-4 h-4 text-rose-700" />
                          <span>{language === 'si' ? 'මැෂින් රෙපයාර් කාර්මික ශිල්පී පැතිකඩ විස්තර' : 'Mechanic & Repair Technician Details'}</span>
                        </div>
                        <p className="text-[11px] text-rose-700">
                          {language === 'si'
                            ? 'සාමාන්‍ය දැන්වීම් මාතෘකාව වෙනුවට මෙහිදී ඔබගේ නම, සේවා සපයන ප්‍රදේශ, මැෂින් වර්ග සහ සේවා පළපුරුද්ද ඇතුළත් කරන්න.'
                            : 'Enter your technician/workshop name, service coverage area, machine types, and repair experience.'}
                        </p>
                      </div>

                      {/* Technician Name & Title */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'කාර්මික ශිල්පියාගේ / ආයතනයේ නම' : 'Technician / Workshop Name'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={sellerName}
                            onChange={(e) => {
                              setSellerName(e.target.value);
                              setTitle(`${e.target.value} - ${specialitiesInput || 'මැෂින් රෙපයාර් ශිල්පී'}`);
                            }}
                            placeholder="e.g. සුනිල් පෙරේරා හෝ Singer & Juki Service Center"
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'සපයන සේවාව / විශේෂඥතාව' : 'Primary Specialization / Title'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={specialitiesInput}
                            onChange={(e) => {
                              setSpecialitiesInput(e.target.value);
                              setTitle(`${sellerName || 'කාර්මික ශිල්පී'} - ${e.target.value}`);
                            }}
                            placeholder="e.g. ජුකි, බ්‍රදර් සියලුම ඇඟලුම් මැෂින් අලුත්වැඩියාව"
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Coverage Area & Experience */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'සේවාව සපයන ප්‍රධාන දිස්ත්‍රික්කය සහ නගර' : 'Service Coverage Area'} *
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                            >
                              {SRI_LANKA_DISTRICTS.map((d) => (
                                <option key={d.id} value={d.nameEn}>{language === 'si' ? d.nameSi : d.nameEn}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="e.g. මහරගම / කොළඹ"
                              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {language === 'si' ? 'පළපුරුද්ද (අවුරුදු)' : 'Experience (Years)'} *
                            </label>
                            <input
                              type="number"
                              value={experienceYears}
                              onChange={(e) => setExperienceYears(Number(e.target.value))}
                              placeholder="e.g. 8"
                              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {language === 'si' ? 'මූලික ගාස්තුව (රු.)' : 'Inspection Fee (LKR)'}
                            </label>
                            <input
                              type="number"
                              value={inspectionFee}
                              onChange={(e) => {
                                setInspectionFee(Number(e.target.value));
                                setPrice(Number(e.target.value));
                              }}
                              placeholder="e.g. 1500"
                              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Serviced Machine Types */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {language === 'si' ? 'අලුත්වැඩියා කරන මැෂින් වර්ග (Machine Types Serviced):' : 'Machine Types Serviced:'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Single Needle Lockstitch (තනි ඉදිකටු)',
                            '4-Thread Overlock (ඕවර්ලොක්)',
                            '5-Thread Overlock',
                            'Interlock / Flatlock (කොලරට්)',
                            'Buttonhole (බොත්තම් කාස)',
                            'Button Attach (බොත්තම් ඇල්ලීම)',
                            'Bar Tack (බාටැක්)',
                            'Fabric Cutting Machine (කැපුම්)',
                            'Steam Boiler & Iron (ස්ටීම් බොයිලර්)',
                            'Direct Drive Servo Motors (මෝටර්)'
                          ].map((type) => (
                            <button
                              type="button"
                              key={type}
                              onClick={() => {
                                setTechnicianMachineTypes((prev) =>
                                  prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                                );
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                                technicianMachineTypes.includes(type)
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Serviced Brands */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {language === 'si' ? 'හසුරුවන මැෂින් සන්නාම (Brands Serviced):' : 'Brands Serviced:'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Juki', 'Brother', 'Singer', 'Jack', 'Siruba', 'Pegasus', 'Yamato', 'Eastman', 'Sunstar', 'All Industrial'].map((b) => (
                            <button
                              type="button"
                              key={b}
                              onClick={() => {
                                setTechnicianBrands((prev) =>
                                  prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
                                );
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                                technicianBrands.includes(b)
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emergency 24/7 Breakdown toggle */}
                      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-xs font-bold text-amber-950">
                            {language === 'si' ? 'පැය 24 හදිසි බිඳවැටීම් සේවා සපයයි (24/7 Emergency Breakdown Dispatch)' : '24/7 Emergency Breakdown Service Available'}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isEmergencyAvailable}
                          onChange={(e) => setIsEmergencyAvailable(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                        />
                      </div>

                      {/* Bio & Details */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'ශිල්පියාගේ සේවා විස්තරය සහ කොන්දේසි' : 'Technician Bio & Service Terms'} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="ඔබගේ කාර්මික පළපුරුද්ද, වැඩමුළුව පිහිටි ස්ථානය, පැමිණ සේවා සැපයීමේ කොන්දේසි සහ අමතර කොටස් ලබාදෙන්නේද යන්න මෙහි සටහන් කරන්න..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. OPERATOR CATEGORY */}
                  {category === 'operators' && (
                    <div className="space-y-4">
                      <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase">
                          <Scissors className="w-4 h-4 text-teal-700" />
                          <span>{language === 'si' ? 'මැසින් ඔපරේටර් ශිල්පී පැතිකඩ' : 'Machine Operator Profile'}</span>
                        </div>
                        <p className="text-[11px] text-teal-800">
                          {language === 'si'
                            ? 'ඔබගේ නම, ප්‍රගුණ කර ඇති මැෂින් වර්ග, බලාපොරොත්තු වන වැටුප සහ සේවා පළපුරුද්ද මෙහි ඇතුළත් කරන්න.'
                            : 'Enter your operator details, proficient machine skills, salary expectations, and experience.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'ඔපරේටර් ශිල්පියාගේ සම්පූර්ණ නම' : 'Operator Full Name'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={sellerName}
                            onChange={(e) => {
                              setSellerName(e.target.value);
                              setTitle(`${e.target.value} - මැසින් ඔපරේටර් ශිල්පී`);
                            }}
                            placeholder="e.g. කසුන් චාමර පෙරේරා"
                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'සේවයට වාර්තා කළ හැකි ආකාරය' : 'Availability'} *
                          </label>
                          <select
                            value={operatorAvailability}
                            onChange={(e) => setOperatorAvailability(e.target.value as any)}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="immediate">{language === 'si' ? 'වහාම සේවයට වාර්තා කළ හැක (Immediate)' : 'Immediate'}</option>
                            <option value="1_week">{language === 'si' ? 'සතියක් ඇතුළත (Within 1 Week)' : 'Within 1 Week'}</option>
                            <option value="flexible">{language === 'si' ? 'සාකච්ඡා කර තීරණය කළ හැක (Flexible)' : 'Flexible'}</option>
                          </select>
                        </div>
                      </div>

                      {/* Proficient Machine Skills */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {language === 'si' ? 'ප්‍රගුණ කර ඇති මැෂින් වර්ග (Machine Skills):' : 'Proficient Machine Skills:'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Single Needle Lockstitch (Juki)',
                            '4-Thread Overlock',
                            '5-Thread Interlock',
                            'Flatlock (ෆ්ලැට්ලොක්)',
                            'Buttonhole (බොත්තම් කාස)',
                            'Button Attach (බොත්තම් ඇල්ලීම)',
                            'Bar Tack (බාටැක්)',
                            'Feed-off-the-arm',
                            'Cutting Machine (කැපුම්)',
                            'Ironing & Finishing'
                          ].map((sk) => (
                            <button
                              type="button"
                              key={sk}
                              onClick={() => toggleOperatorSkill(sk)}
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                                operatorSkills.includes(sk)
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {sk}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'පළපුරුද්ද (අවුරුදු)' : 'Experience (Years)'} *
                          </label>
                          <input
                            type="number"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                            placeholder="e.g. 5"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'දිනකට බලාපොරොත්තු මුදල (රු.)' : 'Expected Daily Rate (LKR)'}
                          </label>
                          <input
                            type="number"
                            value={operatorDailyRate}
                            onChange={(e) => setOperatorDailyRate(Number(e.target.value))}
                            placeholder="e.g. 2500"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'මාසික වැටුප (රු.)' : 'Expected Monthly Salary'}
                          </label>
                          <input
                            type="number"
                            value={operatorExpectedSalary}
                            onChange={(e) => setOperatorExpectedSalary(Number(e.target.value))}
                            placeholder="e.g. 65000"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'සේවා විස්තරය සහ පෙර කර්මාන්තශාලා අත්දැකීම්' : 'Bio & Experience Details'} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="ඔබ මීට පෙර සේවය කළ ඇඟලුම් ආයතන, වඩාත් ප්‍රවීණ ඇඳුම් වර්ග (T-shirts, Shirts, Frocks ආදිය) මෙහි සටහන් කරන්න..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. SUBCONTRACT / JOB ORDER CATEGORY */}
                  {category === 'subcontract' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase">
                          <FileCheck2 className="w-4 h-4 text-blue-700" />
                          <span>{language === 'si' ? 'සබ් ඕඩර් ඇණවුම් විස්තර' : 'Sub-Contract Order Specifications'}</span>
                        </div>
                        <p className="text-[11px] text-blue-800">
                          {language === 'si'
                            ? 'කර්මාන්තශාලා හෝ කුඩා කණ්ඩායම් වෙත ලබාදීමට බලාපොරොත්තු වන ඇඟලුම් ප්‍රමාණය, කෑල්ලකට ගෙවන මිල සහ නියමිත කාලසීමාවන් ඇතුළත් කරන්න.'
                            : 'Enter order quantity, piece rate, completion deadline, and work specifications.'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'සබ් ඕඩර් දැන්වීමේ මාතෘකාව' : 'Sub-Contract Order Title'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. පිරිමි කමිස 3,000ක් කපා මැසීමට පළපුරුදු කණ්ඩායමක් අවශ්‍යයි"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'වැඩ වර්ගය (Work Type)' : 'Work Type'} *
                          </label>
                          <select
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            {SUBCONTRACT_WORK_TYPES.map((w) => (
                              <option key={w.id} value={w.en}>
                                {language === 'si' ? w.si : w.en}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'වැඩ අවසන් කළ යුතු දිනය (Completion Deadline)' : 'Deadline'}
                          </label>
                          <input
                            type="date"
                            value={completionDeadline}
                            onChange={(e) => setCompletionDeadline(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'මුළු ඇණවුම් ප්‍රමාණය (Order Quantity - Pieces)' : 'Order Quantity (Pieces)'} *
                          </label>
                          <input
                            type="number"
                            required
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(Number(e.target.value))}
                            placeholder="e.g. 5000"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'කෑල්ලකට ගෙවන මිල (Piece Rate - රු./කෑල්ලකට)' : 'Piece Rate (LKR / piece)'} *
                          </label>
                          <input
                            type="number"
                            required
                            value={pieceRate}
                            onChange={(e) => {
                              setPieceRate(Number(e.target.value));
                              setPrice(Number(e.target.value) * (Number(orderQuantity) || 1));
                            }}
                            placeholder="e.g. 180"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">
                          {language === 'si' ? 'රෙදි සහ අමුද්‍රව්‍ය අප විසින් සපයනු ලැබේ (Fabric & Trims Provided)' : 'Fabric & Materials Provided by Factory'}
                        </span>
                        <input
                          type="checkbox"
                          checked={materialProvided}
                          onChange={(e) => setMaterialProvided(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'සවිස්තරාත්මක ඇණවුම් විස්තර සහ මැහුම් ප්‍රමිතීන්' : 'Order Specifications & Quality Terms'} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="ඇඳුමේ මෝස්තරය, මැහුම් ප්‍රමිතිය, සාම්පල ලබාගන්නා ආකාරය සහ ගෙවීම් කොන්දේසි මෙහි සටහන් කරන්න..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. SEWING MACHINES CATEGORY */}
                  {category === 'machines' && (
                    <div className="space-y-4">
                      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                          <Cog className="w-4 h-4 text-amber-700" />
                          <span>{language === 'si' ? 'මහන මැෂින් විස්තර' : 'Sewing Machine Details'}</span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          {language === 'si'
                            ? 'මැෂිමේ සන්නාමය, වර්ගය, තත්ත්වය සහ විකුණුම් මිල ඇතුළත් කරන්න.'
                            : 'Enter machine brand, type, condition, warranty, and selling price.'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'මැෂින් දැන්වීමේ මාතෘකාව' : 'Machine Title'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Juki DDL-8700 High Speed Single Needle Industrial Machine"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'බ්‍රෑන්ඩ් එක (Brand)' : 'Brand'} *
                          </label>
                          <select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            {MACHINE_BRANDS.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'තත්ත්වය (Condition)' : 'Condition'} *
                          </label>
                          <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value as any)}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="brand_new">{language === 'si' ? 'Brand New (අලුත්ම)' : 'Brand New'}</option>
                            <option value="reconditioned">{language === 'si' ? 'Reconditioned (රීකන්ඩිෂන්)' : 'Reconditioned'}</option>
                            <option value="used">{language === 'si' ? 'Used (පාවිච්චි කළ)' : 'Used'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'වගකීම් කාලය (මාස)' : 'Warranty (Months)'}
                          </label>
                          <input
                            type="number"
                            value={warrantyMonths}
                            onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                            placeholder="e.g. 6"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'මැෂින් වර්ගය (Machine Type)' : 'Machine Type'} *
                          </label>
                          <input
                            type="text"
                            value={machineType}
                            onChange={(e) => setMachineType(e.target.value)}
                            placeholder="e.g. Single Needle Lockstitch (තනි ඉදිකටු)"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'විකුණුම් මිල (Selling Price - රු.)' : 'Price (LKR)'} *
                          </label>
                          <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="e.g. 85000"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={codAvailable}
                            onChange={(e) => setCodAvailable(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>{language === 'si' ? 'COD ඇත (භාණ්ඩ ලැබුණු පසු මුදල්)' : 'Cash on Delivery'}</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={deliveryAvailable}
                            onChange={(e) => setDeliveryAvailable(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>{language === 'si' ? 'දිවයින පුරා ඩිලිවරි (Transport Available)' : 'Islandwide Delivery'}</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'මැෂිමේ සවිස්තරාත්මක විස්තරය' : 'Machine Description'} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="මැෂිමේ තත්ත්වය, මෝටරය (Servo / Clutch), මේසය සහ ස්ටෑන්ඩ් එකේ තත්ත්වය, භාවිත කළ කාලය මෙහි සටහන් කරන්න..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. GARMENTS & WHOLESALE STOCKS CATEGORY */}
                  {category === 'garments' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase">
                          <Shirt className="w-4 h-4 text-emerald-700" />
                          <span>{language === 'si' ? 'ඇඟලුම් තොග විස්තර' : 'Garments Wholesale Details'}</span>
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          {language === 'si'
                            ? 'ඇඟලුම් තොගයේ වර්ගය, ප්‍රමාණ, මුළු තොගය සහ කෑල්ලක තොග මිල ඇතුළත් කරන්න.'
                            : 'Enter apparel stock title, available sizes, total pieces, and wholesale unit price.'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'ඇඟලුම් තොගයේ මාතෘකාව' : 'Garment Stock Title'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. පිරිමි කපු ටී-ෂර්ට් 100% Cotton Export Quality Wholesale Stock"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white font-medium"
                        />
                      </div>

                      {/* Sizes badges */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {language === 'si' ? 'පවතින ප්‍රමාණ (Available Sizes):' : 'Available Sizes:'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {APPAREL_SIZES.map((sz) => (
                            <button
                              type="button"
                              key={sz}
                              onClick={() => toggleSize(sz)}
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                                selectedSizes.includes(sz)
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'මුළු තොග ප්‍රමාණය (Total Pieces)' : 'Total Quantity'} *
                          </label>
                          <input
                            type="number"
                            required
                            value={totalQuantity}
                            onChange={(e) => setTotalQuantity(Number(e.target.value))}
                            placeholder="e.g. 1500"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'අවම ඇණවුම (MOQ - Pieces)' : 'Min Order (MOQ)'}
                          </label>
                          <input
                            type="number"
                            value={minOrderQuantity}
                            onChange={(e) => setMinOrderQuantity(Number(e.target.value))}
                            placeholder="e.g. 50"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'කෑල්ලක තොග මිල (රු.)' : 'Wholesale Price (LKR)'} *
                          </label>
                          <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="e.g. 450"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={codAvailable}
                            onChange={(e) => setCodAvailable(e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{language === 'si' ? 'COD පහසුකම් ඇත' : 'Cash on Delivery'}</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={deliveryAvailable}
                            onChange={(e) => setDeliveryAvailable(e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{language === 'si' ? 'දිවයින පුරා ඩිලිවරි' : 'Islandwide Delivery'}</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'ඇඟලුම් විස්තරය සහ රෙදිවල ගුණාත්මකභාවය' : 'Apparel Details & Fabric Specs'} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="රෙදි වර්ගය (100% Cotton, Single Jersey), GSM අගය, පාට වර්ග, පැකින් තොරතුරු මෙහි සටහන් කරන්න..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. SPARE PARTS CATEGORY */}
                  {category === 'spare_parts' && (
                    <div className="space-y-4">
                      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase">
                          <Wrench className="w-4 h-4 text-purple-700" />
                          <span>{language === 'si' ? 'මැෂින් අමතර කොටස් විස්තර' : 'Spare Parts & Accessories Details'}</span>
                        </div>
                        <p className="text-[11px] text-purple-800">
                          {language === 'si'
                            ? 'අමතර කොටසේ නම, ගැළපෙන මැෂින් සන්නාම, තත්ත්වය සහ මිල ඇතුළත් කරන්න.'
                            : 'Enter part name, compatible machine brands, condition, and price.'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'අමතර කොටසේ නම (Part Name)' : 'Spare Part Name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            setPartName(e.target.value);
                          }}
                          placeholder="e.g. Juki DDL Rotary Hook ASM / Industrial Overlock Looper"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white font-medium"
                        />
                      </div>

                      {/* Compatible Brands */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {language === 'si' ? 'ගැළපෙන මැෂින් සන්නාම (Compatible Brands):' : 'Compatible Brands:'}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Juki', 'Brother', 'Singer', 'Jack', 'Siruba', 'Pegasus', 'Yamato', 'Universal (සියලුම)'].map((b) => (
                            <button
                              type="button"
                              key={b}
                              onClick={() => {
                                setCompatibleBrands((prev) =>
                                  prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
                                );
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                                compatibleBrands.includes(b)
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'කොටසේ තත්ත්වය (Condition)' : 'Condition'} *
                          </label>
                          <select
                            value={sparePartCondition}
                            onChange={(e) => setSparePartCondition(e.target.value as any)}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="Brand New Original">{language === 'si' ? 'Brand New Original (මුල් නිෂ්පාදනය)' : 'Brand New Original'}</option>
                            <option value="OEM Replacement">{language === 'si' ? 'OEM Replacement (උසස් ආදේශක)' : 'OEM Replacement'}</option>
                            <option value="Used / Reconditioned">{language === 'si' ? 'Used / Reconditioned' : 'Used / Reconditioned'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'si' ? 'මිල (Price - රු.)' : 'Price (LKR)'} *
                          </label>
                          <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="e.g. 3500"
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">
                          {language === 'si' ? 'කුරියර් මඟින් දිවයින පුරා බෙදාහැරිය හැක (Islandwide Courier)' : 'Islandwide Courier Available'}
                        </span>
                        <input
                          type="checkbox"
                          checked={deliveryAvailable}
                          onChange={(e) => setDeliveryAvailable(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'si' ? 'අමතර කොටස පිළිබඳ සවිස්තරාත්මක විස්තරය' : 'Part Specifications & Details'} *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="කොටසේ අංකය (Part Number), නියමිත මැෂින් මාදිලි සහ විශේෂතා මෙහි සටහන් කරන්න..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons for Step 2 */}
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setStep2Error('');
                        setStep(1);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{language === 'si' ? 'ආපසු' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
                    >
                      <span>{language === 'si' ? 'ඡායාරූප වෙත (Next)' : 'Next Step'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PHOTO UPLOADS WITH EXPLICIT 2-PHOTO LIMIT FOR NORMAL */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {language === 'si' ? 'ඡායාරූප ඇතුළත් කිරීම' : 'Upload Photos'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tier === 'normal' && category !== 'operators'
                          ? (language === 'si' ? 'නෝමල් ඇඩ් සඳහා නොමිලේ ඡායාරූප 2ක් පමණක් හිමිවේ' : 'Normal ad includes up to 2 free photos')
                          : (language === 'si' ? 'පළමු ඡායාරූප 5 නොමිලේ! 5න් පසු අමතර සෑම ඡායාරූපයකටම රු. 100 බැගින් එකතු වේ.' : 'First 5 photos free! Rs. 100 per extra photo beyond 5.')
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadSamplePhotos}
                      className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.postAd.samplePhotosBtn}</span>
                    </button>
                  </div>

                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="ad-photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="ad-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {t.postAd.uploadBtn}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tier === 'normal' && category !== 'operators' ? 'Normal ad: Max 2 photos' : 'Up to 10 photos supported'}
                      </span>
                    </label>
                  </div>

                  {/* Supabase Storage Uploading Indicator */}
                  {isUploadingPhoto && (
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                      <span>{language === 'si' ? 'ඡායාරූපය Supabase Storage වෙත උඩුගත වෙමින් පවතී...' : 'Uploading image to Supabase Storage...'}</span>
                    </div>
                  )}

                  {photoError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{photoError}</span>
                    </div>
                  )}

                  {/* Photo thumbnails */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={img} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className={`absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            idx >= 5 ? 'bg-amber-500 text-slate-950' : 'bg-black/70 text-white'
                          }`}>
                            {idx === 0 ? 'Main' : idx >= 5 ? '+Rs.100' : `Photo ${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {extraPhotosCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                      <span>
                        {language === 'si' ? `අමතර ඡායාරූප ${extraPhotosCount}ක් (ඡායාරූපයකට රු. 100 බැගින්):` : `${extraPhotosCount} extra photos (Rs. 100/ea):`}
                      </span>
                      <strong className="text-amber-700 text-sm">+ රු. {extraPhotosFee.toLocaleString()}</strong>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{language === 'si' ? 'ආපසු' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <span>{language === 'si' ? 'පැකේජය තෝරන්න (Next)' : 'Next Step'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PACKAGE TIER & DURATION PRICING & REACH ESTIMATOR */}
              {step === 4 && (
                <div className="space-y-5">
                  {/* If category is OPERATORS: Show Machine Operator Ranking Packages specifically */}
                  {category === 'operators' ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-5 h-5 text-amber-500" />
                          <h4 className="text-base font-black text-slate-900">
                            {language === 'si' ? 'මැසින් ඔපරේටර් ශ්‍රේණිගත කිරීම් පැකේජ (Operator Packages)' : 'Machine Operator Ranking Packages'}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === 'si'
                            ? 'මෙම පැකේජ ඔපරේටර්වරුන්ගේ ඇඩ් පළ කරන අංශය තුළ පමණක් විශේෂයෙන් පෙන්වනු ලැබේ.'
                            : 'Ranked placement exclusively in the Machine Operator directory'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(['bronze', 'silver', 'gold', 'platinum', 'platinum_lifetime'] as OperatorTier[]).map((tierKey) => {
                          const pkg = OPERATOR_PACKAGES[tierKey];
                          const isSelected = operatorTier === tierKey;
                          return (
                            <div
                              key={tierKey}
                              onClick={() => setOperatorTier(tierKey)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              {tierKey === 'platinum_lifetime' && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                                  LIFETIME VIP
                                </div>
                              )}
                              <div>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1.5 ${pkg.badgeColor}`}>
                                  {pkg.rank === 1 ? 'Free Tier' : pkg.periodEn}
                                </span>
                                <h5 className="font-bold text-slate-900 text-sm">
                                  {language === 'si' ? pkg.titleSi : pkg.titleEn}
                                </h5>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {language === 'si' ? pkg.perksSi : pkg.perksEn}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                                <span className="text-base font-black text-slate-900">
                                  {pkg.feeLkr === 0 ? 'නොමිලේ (FREE)' : `රු. ${pkg.feeLkr.toLocaleString()}`}
                                </span>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Standard Categories: Normal, Top Ad, Urgent Ad */
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {language === 'si' ? 'දැන්වීම් පැකේජය සහ කාල සීමාව තෝරන්න' : 'Choose Ad Tier & Duration'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === 'si'
                            ? 'ඔබගේ දැන්වීම ඉදිරියෙන්ම පෙන්වීමට සුදුසු පැකේජය තෝරන්න'
                            : 'Select the tier and visibility period for maximum customer responses'}
                        </p>
                      </div>

                      {/* Tier Cards: Normal, Top, Urgent */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        
                        {/* Normal Ad */}
                        <div
                          onClick={() => setTier('normal')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            tier === 'normal'
                              ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/10 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                              Silver / Free
                            </span>
                            <h5 className="font-bold text-slate-900 text-base">
                              {language === 'si' ? 'නෝමල් ඇඩ් (Normal)' : 'Normal Ad'}
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">
                              {language === 'si' ? 'දින 30ක් නොමිලේ. ඡායාරූප 2ක් දක්වා පමණි.' : 'Free for 30 days. Includes up to 2 photos.'}
                            </p>
                          </div>
                          <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between">
                            <span className="text-lg font-black text-slate-900">
                              {language === 'si' ? 'නොමිලේ (FREE)' : 'FREE'}
                            </span>
                            {tier === 'normal' && (
                              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Top Ad (Green Highlight) */}
                        <div
                          onClick={() => setTier('top')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                            tier === 'top'
                              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-md'
                              : 'border-emerald-200 hover:border-emerald-300 bg-emerald-50/10'
                          }`}
                        >
                          <div className="absolute top-2 right-2">
                            <BadgeDollarSign className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
                              Green Highlight • Top Ranking
                            </span>
                            <h5 className="font-bold text-slate-900 text-base">
                              {language === 'si' ? 'ටොප් ඇඩ් (Top Ad)' : 'Top Ad'}
                            </h5>
                            <p className="text-xs text-slate-600 mt-1">
                              {language === 'si' ? 'කොළ පැහැති හයිලයිට්. සාමාන්‍ය දැන්වීම් වලට ඉහළින්.' : 'Emerald green highlight, pinned above normal ads.'}
                            </p>
                          </div>
                          <div className="pt-4 border-t border-emerald-200 mt-4 flex items-center justify-between">
                            <span className="text-base font-black text-emerald-700">
                              රු. {duration === 'custom' ? calculateCustomAdPricing('top', customDays).priceLkr.toLocaleString() : (AD_DURATION_PRICING.top[duration as '1_month' | '3_months' | '1_year']?.lkr || 1000).toLocaleString()}
                            </span>
                            {tier === 'top' && (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Urgent Ad (Red Pulse Animation) */}
                        <div
                          onClick={() => setTier('urgent')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                            tier === 'urgent'
                              ? 'border-red-500 bg-red-50/60 ring-2 ring-red-500/30 shadow-md'
                              : 'border-red-200 hover:border-red-300 bg-red-50/10'
                          }`}
                        >
                          <div className="absolute top-2 right-2 animate-pulse">
                            <Flame className="w-5 h-5 text-red-600 fill-red-600" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-red-700 block mb-1">
                              Red Pulse • Homepage Banner
                            </span>
                            <h5 className="font-bold text-slate-900 text-base">
                              {language === 'si' ? 'අර්ජන්ට් ඇඩ් (Urgent)' : 'Urgent Priority'}
                            </h5>
                            <p className="text-xs text-slate-600 mt-1">
                              {language === 'si' ? 'ඉහළම ප්‍රමුඛතාවය, මුල් පිටුවේ Flash Banner සහ රතු ඇනිමේෂන්.' : 'Highest priority, red pulse animation, homepage banner.'}
                            </p>
                          </div>
                          <div className="pt-4 border-t border-red-200 mt-4 flex items-center justify-between">
                            <span className="text-base font-black text-red-600">
                              රු. {duration === 'custom' ? calculateCustomAdPricing('urgent', customDays).priceLkr.toLocaleString() : (AD_DURATION_PRICING.urgent[duration as '1_month' | '3_months' | '1_year']?.lkr || 1800).toLocaleString()}
                            </span>
                            {tier === 'urgent' && (
                              <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Duration Selector for Paid Tiers (Top & Urgent) */}
                      {tier !== 'normal' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-amber-600" />
                              <span>{language === 'si' ? 'දැන්වීමේ කාල සීමාව සහ දින තේරීම' : 'Ad Duration & Custom Calendar Selection'}</span>
                            </label>
                            {duration === 'custom' && (
                              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                {customDays} {language === 'si' ? 'දිනක් තෝරා ඇත' : 'Days Selected'}
                              </span>
                            )}
                          </div>

                          {/* Fixed Duration Options + Custom Days Pill */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {[
                              {
                                id: '1_month' as AdDuration,
                                labelSi: 'මාස 1 (රු. ' + (tier === 'top' ? '1,000' : '1,800') + ')',
                                labelEn: '1 Month',
                                subtext: '30 Days'
                              },
                              {
                                id: '3_months' as AdDuration,
                                labelSi: 'මාස 3 (රු. ' + (tier === 'top' ? '2,300' : '3,200') + ')',
                                labelEn: '3 Months',
                                subtext: '90 Days'
                              },
                              {
                                id: '1_year' as AdDuration,
                                labelSi: 'අවුරුදු 1 (රු. ' + (tier === 'top' ? '6,000' : '7,500') + ')',
                                labelEn: '1 Year',
                                subtext: '365 Days • Best Value'
                              },
                              {
                                id: 'custom' as AdDuration,
                                labelSi: '📅 දින කස්ටමයිස් (Custom)',
                                labelEn: '📅 Custom Days',
                                subtext: tier === 'top' ? 'අවම දින 2 රු. 300' : 'අවම දින 2 රු. 300'
                              }
                            ].map((item) => {
                              const isSelected = duration === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setDuration(item.id)}
                                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? tier === 'urgent'
                                        ? 'border-red-500 bg-red-100/60 ring-2 ring-red-400 shadow-xs'
                                        : 'border-emerald-600 bg-emerald-100/60 ring-2 ring-emerald-500 shadow-xs'
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <span className="text-xs font-bold text-slate-900 block truncate">
                                    {language === 'si' ? item.labelSi : item.labelEn}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                                    {item.subtext}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* CUSTOM CALENDAR & DATE SELECTOR WITH DYNAMIC REACH ESTIMATOR */}
                          {duration === 'custom' && (
                            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900">
                                    {language === 'si' ? 'කැලැන්ඩරයෙන් ආරම්භක සහ අවසන් දින තෝරන්න' : 'Select Start and End Dates via Calendar'}
                                  </h5>
                                  <p className="text-[11px] text-slate-500">
                                    {tier === 'top'
                                      ? (language === 'si' ? 'අනිවාර්ය අවම දින 2කට රු. 300 සහ වැඩිවන සෑම දිනකටම රු. 100 බැගින් එකතු වේ.' : 'Min 2 days: Rs. 300 + Rs. 100 for each additional day.')
                                      : (language === 'si' ? 'අනිවාර්ය අවම දින 2කට රු. 300 සහ වැඩිවන සෑම දිනකටම රු. 150 බැගින් එකතු වේ.' : 'Min 2 days: Rs. 300 + Rs. 150 for each additional day.')
                                    }
                                  </p>
                                </div>
                              </div>

                              {/* Date Pickers */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    {language === 'si' ? 'ආරම්භක දිනය (Start Date)' : 'Start Date'}
                                  </label>
                                  <input
                                    type="date"
                                    min={todayStr}
                                    value={startDate}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    {language === 'si' ? 'අවසන් දිනය (End Date)' : 'End Date'}
                                  </label>
                                  <input
                                    type="date"
                                    min={startDate}
                                    value={endDate}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50"
                                  />
                                </div>
                              </div>

                              {/* Quick Day Stepper & Presets */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-bold text-slate-600">Quick Select:</span>
                                  {[2, 3, 5, 7, 10, 14, 21, 30].map((dPreset) => (
                                    <button
                                      key={dPreset}
                                      type="button"
                                      onClick={() => handleCustomDaysChange(dPreset)}
                                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                        customDays === dPreset
                                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {dPreset}d
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Days:</span>
                                  <button
                                    type="button"
                                    disabled={customDays <= 2}
                                    onClick={() => handleCustomDaysChange(customDays - 1)}
                                    className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-black text-slate-900 w-8 text-center">{customDays}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCustomDaysChange(customDays + 1)}
                                    className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* LIVE REACH ESTIMATOR SIDE/PANEL DISPLAY */}
                              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                      {language === 'si' ? 'අපේක්ෂිත රිච් (Estimated Reach)' : 'Estimated Audience Reach'}
                                    </span>
                                  </div>
                                  <span className="text-sm font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                                    {estimatedReachText}
                                  </span>
                                </div>

                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.max(15, customDays * 3.3))}%` }}
                                  ></div>
                                </div>

                                <div className="text-[11px] text-slate-300 space-y-1">
                                  {tier === 'top' ? (
                                    <p>
                                      {language === 'si'
                                        ? `අවම දින 2 සඳහා රිච් 0k සිට 1k දක්වාද, වැඩිවන සෑම දිනකටම (+${customDays - 2}d) දවසින් දවස 0.2k බැගින් වැඩිවේ.`
                                        : `Base 2 days reach 0k-1k, plus 0.2k daily for ${customDays - 2} additional days.`}
                                    </p>
                                  ) : (
                                    <p>
                                      {language === 'si'
                                        ? `අවම දින 2 සඳහා රිච් 0 සිට 1.9k දක්වාද, වැඩිවන සෑම දිනකටම (+${customDays - 2}d) 2.5k ට අමතරව දවසින් දවස 0.45k බැගින් වැඩිවේ.`
                                        : `Base 2 days reach 0-1.9k, plus 0.45k daily over 2.5k for ${customDays - 2} additional days.`}
                                    </p>
                                  )}
                                  <div className="flex justify-between pt-1 border-t border-slate-800 text-xs">
                                    <span>{customDays} Days Rate:</span>
                                    <span className="font-bold text-amber-400">
                                      {tier === 'top' 
                                        ? `රු. 300 + (${customDays - 2} × 100) = රු. ${baseAdPrice.toLocaleString()}`
                                        : `රු. 300 + (${customDays - 2} × 150) = රු. ${baseAdPrice.toLocaleString()}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* INTERACTIVE CART & PROMO CODE REDUCTION SECTION */}
                  <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-5 space-y-4 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        <span>{language === 'si' ? 'ඇණවුම් සාරාංශය සහ කාට් එක (Order Cart)' : 'Order Breakdown'}</span>
                      </span>
                      <span className="text-xs text-slate-400">
                        {category === 'operators' 
                          ? `Operator Tier: ${operatorTier.toUpperCase()}`
                          : `${tier.toUpperCase()} (${duration === 'custom' ? `${customDays} Days` : duration})`}
                      </span>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="text-xs space-y-2 text-slate-300">
                      <div className="flex justify-between items-center">
                        <span>
                          {category === 'operators' 
                            ? `Operator ${OPERATOR_PACKAGES[operatorTier].titleEn}:` 
                            : tier === 'normal' 
                            ? 'Normal Ad (FREE):' 
                            : `${tier.toUpperCase()} Ad Base Package:`}
                        </span>
                        <div className="text-right">
                          <span className="font-semibold text-white">රු. {baseAdPrice.toLocaleString()}</span>
                          {baseAdPrice > 0 && (
                            <span className="text-[11px] text-slate-400 block font-normal">
                              (${convertLkrToUsd(baseAdPrice).toFixed(2)} USD)
                            </span>
                          )}
                        </div>
                      </div>

                      {extraPhotosCount > 0 && (
                        <div className="flex justify-between items-center text-amber-300">
                          <span>Extra Photos ({extraPhotosCount} × Rs. 100):</span>
                          <div className="text-right">
                            <span>+ රු. {extraPhotosFee.toLocaleString()}</span>
                            <span className="text-[10px] text-amber-200/70 block">
                              (+${convertLkrToUsd(extraPhotosFee).toFixed(2)} USD)
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Promo Code Input Box */}
                      {subtotalFee > 0 && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-amber-400" />
                            <span>{language === 'si' ? 'ප්‍රමෝ ඩිස්කවුන්ට් කෝඩ් ඇතුළත් කරන්න (Promo Code)' : 'Have a Promo / Discount Code?'}</span>
                          </label>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={promoCodeInput}
                              onChange={(e) => setPromoCodeInput(e.target.value)}
                              placeholder="e.g. SEWLANKA25, SAVE500"
                              disabled={appliedPromo !== null}
                              className="flex-1 bg-slate-800/80 border border-slate-700 text-white uppercase font-mono px-3 py-1.5 rounded-xl text-xs outline-none focus:border-amber-400 disabled:opacity-50"
                            />
                            {appliedPromo ? (
                              <button
                                type="button"
                                onClick={handleRemovePromo}
                                className="bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                              >
                                ඉවත් කරන්න
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleApplyPromoCode}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                              >
                                {language === 'si' ? 'යොදන්න' : 'Apply'}
                              </button>
                            )}
                          </div>

                          {promoMessage && (
                            <p className={`text-[11px] mt-1.5 font-medium ${
                              promoMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {promoMessage.text}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Applied Discount Line */}
                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-emerald-400 font-bold bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                          <span>
                            Discount Applied ({appliedPromo?.code}):
                          </span>
                          <div className="text-right">
                            <span>- රු. {discountAmount.toLocaleString()}</span>
                            <span className="text-[10px] text-emerald-300 block font-normal">
                              (-${convertLkrToUsd(discountAmount).toFixed(2)} USD)
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Reach Line */}
                      {estimatedReachText && (
                        <div className="flex justify-between text-amber-300 text-[11px] pt-1">
                          <span>Estimated Audience Reach:</span>
                          <span className="font-bold">{estimatedReachText}</span>
                        </div>
                      )}

                      {/* Grand Total with LKR and USD */}
                      <div className="pt-3 border-t border-slate-700 flex justify-between items-center text-base sm:text-lg font-black text-white">
                        <span>{language === 'si' ? 'ගෙවිය යුතු මුළු මුදල (Grand Total):' : 'Grand Total:'}</span>
                        <div className="text-right">
                          <span className="text-amber-400 text-xl font-mono block">
                            {grandTotalFee === 0 ? 'නොමිලේ (FREE / $0.00)' : `රු. ${grandTotalFee.toLocaleString()}`}
                          </span>
                          {grandTotalFee > 0 && (
                            <span className="text-xs text-emerald-400 font-semibold block">
                              ≈ ${convertLkrToUsd(grandTotalFee).toFixed(2)} USD (1 USD ≈ රු. 305)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{language === 'si' ? 'ආපසු' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{language === 'si' ? 'ගෙවීම් සහ සම්බන්ධතා (Next)' : 'Next Step'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: CONTACT & 3 PAYMENT METHODS */}
              {step === 5 && (
                <div className="space-y-5">
                  {/* Seller Contact Info */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2">
                      {language === 'si' ? 'ඔබගේ සබඳතා තොරතුරු' : 'Seller Contact Details'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'si' ? 'ඔබගේ නම (Your Name)' : 'Your Name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={sellerName}
                          onChange={(e) => setSellerName(e.target.value)}
                          placeholder="e.g. Amal Perera"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'si' ? 'ව්‍යාපාරික නාමය (Business Name)' : 'Business Name'}
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Apex Apparel Works"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'si' ? 'දුරකථන අංකය (Phone Number)' : 'Phone Number'} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0771234567"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'si' ? 'වට්ස්ඇප් අංකය (WhatsApp)' : 'WhatsApp Number'} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="94771234567"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'si' ? 'දිස්ත්‍රික්කය (District)' : 'District'} *
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'si' ? 'නගරය (City / Town)' : 'City / Town'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Maharagama / Pamunuwa"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 PAYMENT METHODS (Shown only if grandTotalFee > 0) */}
                  {grandTotalFee > 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-slate-900 uppercase">
                          {language === 'si' ? 'ගෙවීම් ක්‍රමය තෝරන්න (3 Methods Available)' : 'Select Payment Method'}
                        </span>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 block">
                            ගෙවිය යුතු මුදල: රු. {grandTotalFee.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold block">
                            ≈ ${grandTotalUsd.toFixed(2)} USD (Exchange: 1 USD ≈ රු. 305)
                          </span>
                        </div>
                      </div>

                      {/* 3 Method Selection Tabs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        
                        {/* 1. Card / PayPal */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card_paypal')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                            paymentMethod === 'card_paypal'
                              ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <CreditCard className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">කාඩ්පත් / PayPal</span>
                            <span className="text-[10px] text-slate-500">Card & PayPal ($USD)</span>
                          </div>
                        </button>

                        {/* 2. Bank / Online Transfer */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank_transfer')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                            paymentMethod === 'bank_transfer'
                              ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">බැංකු තැන්පතු</span>
                            <span className="text-[10px] text-slate-500">Bank / Online Transfer (LKR)</span>
                          </div>
                        </button>

                        {/* 3. LankaQR */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('lanka_qr')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                            paymentMethod === 'lanka_qr'
                              ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <QrCode className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">LankaQR ගෙවීම්</span>
                            <span className="text-[10px] text-slate-500">Instant QR Scan (LKR)</span>
                          </div>
                        </button>
                      </div>

                      {/* METHOD 1: CARD / PAYPAL VIEW */}
                      {paymentMethod === 'card_paypal' && (
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4 shadow-2xs">
                          {/* Header with Card Badges */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-indigo-600" />
                              <span className="text-xs font-black text-slate-900 uppercase">
                                {language === 'si' ? 'කාඩ්පත් (Debit/Credit Card) හෝ PayPal මඟින් සජීවීව ගෙවීම' : 'Debit / Credit Card & PayPal Live Checkout'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">පිළිගනු ලැබේ:</span>
                              <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">VISA</span>
                              <span className="text-[10px] font-black bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">Mastercard</span>
                              <span className="text-[10px] font-black bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">Amex</span>
                              <span className="text-[10px] font-black bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">PayPal</span>
                            </div>
                          </div>

                          {/* Security & No Billing Address Highlight */}
                          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-950">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-bold text-emerald-900 block">
                                {language === 'si' ? 'ආරක්ෂිත සජීවී ගෙවීම් ද්වාරය (PayPal Secure Live Portal)' : 'PayPal Official Secure Portal'}
                              </span>
                              <p className="text-[11px] text-emerald-800 leading-relaxed">
                                {language === 'si'
                                  ? 'රට ලෙස ශ්‍රී ලංකාව (Sri Lanka 🇱🇰) ස්වයංක්‍රීයවම තෝරා ඇත. කිසිදු Delivery / Shipping Address එකක් අවශ්‍ය නොවන අතර, ඔබගේ නම, දුරකථන අංකය සහ ඊමේල් ස්වයංක්‍රීයව පිරවෙන බැවින් ක්ෂණිකව සජීවීව ගෙවීම් කළ හැක.'
                                  : 'Country is automatically set to Sri Lanka (LK). Delivery address is disabled and your details are auto-filled for instant checkout.'}
                              </p>
                            </div>
                          </div>

                          {/* Official PayPal Buttons Container & Live Action */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 max-w-sm mx-auto">
                              <span>ගෙවිය යුතු මුළු මුදල:</span>
                              <span className="text-sm font-black text-slate-900 font-mono">
                                රු. {grandTotalFee.toLocaleString()} <span className="text-emerald-700">(${grandTotalUsd.toFixed(2)} USD)</span>
                              </span>
                            </div>

                            {/* Live PayPal Status Indicator & Loading */}
                            {isPayPalLoading && !payPalCaptured && (
                              <div className="flex flex-col items-center justify-center py-5 px-4 space-y-2 bg-white rounded-xl border border-slate-200 shadow-2xs max-w-sm mx-auto animate-pulse">
                                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                                <span className="text-xs font-bold text-slate-700">
                                  {language === 'si' ? 'PayPal සජීවී ගෙවීම් ද්වාරය සම්බන්ධ වෙමින් පවතී...' : 'Connecting PayPal Live Gateway...'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Live Client ID: {PAYPAL_CLIENT_ID.substring(0, 18)}...
                                </span>
                              </div>
                            )}

                            {/* Error State with Retry Button */}
                            {payPalError && (
                              <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center justify-between gap-2 max-w-sm mx-auto text-left">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>{payPalError}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPayPalRenderAttempts((prev) => prev + 1)}
                                  className="text-[11px] font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-300 hover:bg-rose-100 cursor-pointer text-rose-900 shrink-0"
                                >
                                  නැවත උත්සාහ කරන්න
                                </button>
                              </div>
                            )}

                            {/* Official PayPal JS SDK Smart Buttons (Renders Official Gold PayPal + Black Debit/Credit Card Buttons) */}
                            <div id="paypal-button-container" className="max-w-sm mx-auto min-h-[48px]"></div>

                            {payPalCaptured && (
                              <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs p-3.5 rounded-xl flex items-center justify-center gap-2.5 font-bold animate-in fade-in max-w-sm mx-auto shadow-xs">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="block font-black text-emerald-900">
                                    {language === 'si' ? 'PayPal සජීවී ගෙවීම සාර්ථකයි!' : 'PayPal Live Transaction Approved!'}
                                  </span>
                                  <span className="text-[11px] font-mono text-emerald-800">
                                    Capture ID: {paymentRef}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* METHOD 2: BANK TRANSFER DETAILS VIEW */}
                      {paymentMethod === 'bank_transfer' && (
                        <div className="space-y-3 pt-1">
                          <label className="block text-xs font-bold text-slate-700">
                            {language === 'si' ? 'අපගේ නිල බැංකු ගිණුම් විස්තර (Deposit to Bank Account):' : 'Deposit to Bank Account:'}
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {bankAccounts.map((b, i) => (
                              <div
                                key={b.id || i}
                                onClick={() => setSelectedBankIndex(i)}
                                className={`p-3 rounded-2xl border cursor-pointer text-xs transition-all relative ${
                                  selectedBankIndex === i
                                    ? 'border-amber-500 bg-white ring-2 ring-amber-400 shadow-xs'
                                    : 'border-slate-200 bg-slate-100/70 hover:bg-white'
                                }`}
                              >
                                <span className="font-bold text-slate-900 block truncate">
                                  {language === 'si' ? (b.bankNameSi || b.bankName) : b.bankName}
                                </span>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-emerald-700 font-mono font-black text-xs">
                                    {b.accountNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(b.accountNumber, `acc-${i}`);
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
                                  >
                                    {copiedBankField === `acc-${i}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                                <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                                  {b.accountName}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {b.branch}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* METHOD 3: LANKAQR VIEW */}
                      {paymentMethod === 'lanka_qr' && (
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center border-2 border-amber-300 shrink-0 shadow-xs">
                            <img 
                              src={qrSettings.qrImageUrl} 
                              alt="LankaQR" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-xs text-slate-700 space-y-1.5 text-center sm:text-left">
                            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              <QrCode className="w-3 h-3 text-amber-700" />
                              <span>LankaQR Instant Scan & Pay</span>
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm">{qrSettings.merchantName}</h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {language === 'si' ? qrSettings.instructionsSi : qrSettings.instructionsEn}
                            </p>
                            <span className="text-emerald-700 font-bold block text-xs">
                              ගෙවිය යුතු මුදල: රු. {grandTotalFee.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Transaction Reference / Slip ID input */}
                      {paymentMethod === 'card_paypal' && payPalCaptured ? (
                        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-bold text-emerald-900">
                              {language === 'si' ? 'PayPal / කාඩ්පත් ගෙවීම තහවුරු විය (Live Payment Approved)' : 'Live Payment Approved'}
                            </span>
                          </div>
                          <span className="font-mono text-emerald-950 bg-white px-3 py-1 rounded-lg border border-emerald-200 font-black">
                            Ref: {paymentRef}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            {paymentMethod === 'card_paypal'
                              ? (language === 'si' ? 'ගෙවීම් රිෆරන්ස් අංකය (PayPal හෝ කාඩ්පතෙන් ගෙවූ විට ස්වයංක්‍රීයව පිරවේ)' : 'Payment Reference (Auto-filled on PayPal / Card payment)')
                              : (language === 'si' ? 'ගෙවීම් රිෆරන්ස් අංකය / ට්‍රාන්ස්ඇක්ෂන් ID (Slip Reference / Transaction ID)' : 'Payment Slip Reference / Transaction ID')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            placeholder={paymentMethod === 'card_paypal' ? 'e.g. PP-984120 or PayPal Order ID' : 'e.g. BOC-TX-984124 or QR-REF-44912'}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {paymentMethod === 'card_paypal'
                              ? (language === 'si' 
                                  ? 'ඉහත PayPal හෝ Card බොත්තම මඟින් ගෙවූ විට මෙම අංකය ස්වයංක්‍රීයවම සටහන් වේ.' 
                                  : 'This reference is auto-generated upon PayPal or Card checkout.')
                              : (language === 'si' 
                                  ? 'ඇඩ්මින් විසින් මෙම අංකය පරීක්ෂා කර ඔබගේ දැන්වීම පැය 24ක් තුළ සක්‍රිය කරනු ඇත.' 
                                  : 'Admin will verify this reference before activating your ad.')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-950 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'si' ? 'නොමිලේ දැන්වීමක් (FREE Ad)' : 'Free Ad Listing'}</span>
                      </div>
                      <p>
                        {language === 'si'
                          ? 'මෙම දැන්වීම සඳහා කිසිදු ගෙවීමක් අවශ්‍ය නොවේ. දැන්වීම සබ්මිට් කළ පසු ඇඩ්මින් විසින් අනුමත කර සජීවීව පළ කරනු ඇත.'
                          : 'No payment is required for this standard free listing. It will be verified and published.'}
                      </p>
                    </div>
                  )}

                  {/* Final Review Note */}
                  <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                    <span className="font-bold block text-amber-900">
                      {language === 'si' ? 'දැන්වීම සක්‍රිය කිරීමේ නිවේදනය:' : 'Activation Workflow:'}
                    </span>
                    <p>
                      {language === 'si'
                        ? 'දැන්වීම සබ්මිට් කළ පසු "පෙන්ඩින්" තත්වයට පත්වන අතර, පැය 24ක් තුළ අපගේ ඇඩ්මින් හරහා සක්‍රිය කරනු ලැබේ.'
                        : 'Your ad will be placed in Pending state and reviewed by the administrator within 24 hours.'}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{language === 'si' ? 'ආපසු' : 'Back'}</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-8 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>{language === 'si' ? 'දැන්වීම පළ කරන්න (Submit Ad)' : 'Submit Ad for Review'}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
