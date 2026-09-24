export type Category = 'all' | 'subcontract' | 'machines' | 'garments' | 'spare_parts' | 'technicians' | 'operators';

export type AdTier = 'normal' | 'top' | 'urgent';

export type AdStatus = 'pending' | 'active' | 'rejected';

export type TechnicianTier = 'silver' | 'gold' | 'platinum' | 'platinum_lifetime';

export type OperatorTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'platinum_lifetime';

export type MembershipTier = 'starter' | 'silver' | 'gold' | 'platinum';

export type AdDuration = '1_month' | '2_months' | '3_months' | '1_year' | 'custom';

export type MachineCondition = 'brand_new' | 'reconditioned' | 'used';

export interface SellerInfo {
  name: string;
  businessName?: string;
  phone: string;
  whatsapp: string;
  district: string;
  city: string;
  verified?: boolean;
  memberSince?: string;
  userRole?: 'tailor' | 'factory' | 'merchant' | 'mechanic' | 'individual' | 'operator';
  membershipTier?: MembershipTier;
  operatorTier?: OperatorTier;
  technicianTier?: TechnicianTier;
  nic?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  isActive: boolean;
  description?: string;
  usageCount?: number;
  createdAt?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankNameSi?: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  isActive?: boolean;
}

export interface QRPaymentSetting {
  merchantName: string;
  qrImageUrl: string;
  instructionsSi: string;
  instructionsEn: string;
}

export interface Ad {
  id: string;
  title: string;
  titleSi: string;
  description: string;
  descriptionSi?: string;
  category: Category;
  tier: AdTier;
  status: AdStatus;
  rejectionReason?: string;
  price: number;
  isNegotiable?: boolean;
  duration?: AdDuration;
  customDays?: number;
  startDate?: string;
  endDate?: string;
  estimatedReach?: string;
  
  // Category specific fields
  // For Garments / Stocks
  sizes?: string[]; // e.g. ['XS', 'S', 'M', 'L', 'XL', '2XL', 'Free Size']
  totalQuantity?: number;
  minOrderQuantity?: number;
  
  // For Sub-Contracts
  pieceRate?: number; // ගෙවන මිල / කෑල්ලකට
  orderQuantity?: number;
  workType?: string; // e.g. 'Stitching & Finishing', 'Only Cutting', 'Overlock & Hemming'
  completionDeadline?: string;
  materialProvided?: boolean; // රෙදි සහ නූල් සපයයිද
  
  // For Machines
  brand?: string; // Juki, Brother, Singer, Jack, Siruba
  model?: string;
  machineType?: string; // 'Single Needle Lockstitch', '4-Thread Overlock', 'Buttonhole', 'Cutting'
  condition?: MachineCondition;
  warrantyMonths?: number;
  
  // For Spare Parts
  partName?: string;
  compatibleBrands?: string[];
  
  // For Technicians
  technicianTier?: TechnicianTier;
  experienceYears?: number;
  specialities?: string[];
  isEmergencyAvailable?: boolean;

  // For Machine Operators
  operatorTier?: OperatorTier;
  machineSkills?: string[];
  dailyRate?: number;
  monthlyExpectedSalary?: number;
  availability?: 'immediate' | '1_week' | 'flexible';
  
  // Delivery & Payment
  codAvailable: boolean;
  deliveryAvailable: boolean;
  deliveryNotes?: string;
  
  // Photos
  images: string[];
  extraPhotosCount?: number;
  extraPhotosFee?: number;
  
  // Contact & Seller
  seller: SellerInfo;
  
  // Payment specifics
  paymentMethod?: 'card_paypal' | 'bank_transfer' | 'lanka_qr';
  paymentRef?: string;
  paymentSlipUrl?: string;
  totalCostLkr?: number;
  promoCode?: string;
  discountAmount?: number;
  
  // Metadata & Timestamps
  createdAt: string;
  views: number;
  urgentHeadline?: string;
}

export interface UserAccount {
  id: string;
  username: string; // Unique
  nic: string; // Unique NIC
  name: string;
  businessName?: string;
  businessPhone?: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  district: string;
  city: string;
  password?: string;
  status: 'pending' | 'active' | 'suspended';
  membershipTier: MembershipTier;
  operatorTier?: OperatorTier;
  technicianTier?: TechnicianTier;
  registeredAt: string;
  activatedAt?: string;
  avatar?: string;
  role?: 'admin' | 'user';
  isAdmin?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleSi: string;
  message: string;
  messageSi: string;
  timestamp: string;
  read: boolean;
  adId?: string;
  type: 'approval' | 'rejection' | 'boost' | 'system' | 'account_activated';
}

export type Language = 'si' | 'en';
