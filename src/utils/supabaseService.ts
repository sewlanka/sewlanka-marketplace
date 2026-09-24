import { supabase, SUPABASE_CONFIG } from './supabaseClient';
import { Ad, UserAccount, NotificationItem, AdTier, TechnicianTier, MembershipTier } from '../types';
import { INITIAL_ADS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from '../data/seedData';

// Constants for Admin
export const ADMIN_USERNAME = '200119303870';
export const ADMIN_PASSWORD = 'dsSEWLANKAds*18223';

// Map Supabase DB row -> Frontend Ad
export function mapDbRowToAd(row: any): Ad {
  const seller = (typeof row.seller === 'object' && row.seller !== null) ? row.seller : {};
  return {
    id: row.id,
    title: row.title || '',
    titleSi: row.title_si || row.title || '',
    description: row.description || '',
    descriptionSi: row.description_si || seller.descriptionSi || '',
    category: row.category || 'subcontract',
    tier: (row.tier as AdTier) || 'normal',
    status: row.status || 'pending',
    rejectionReason: row.rejection_reason || seller.rejectionReason,
    price: Number(row.price) || 0,
    isNegotiable: row.is_negotiable ?? seller.isNegotiable ?? false,
    duration: row.duration || seller.duration || '1_month',
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    totalQuantity: row.total_quantity ? Number(row.total_quantity) : undefined,
    minOrderQuantity: row.min_order_quantity ? Number(row.min_order_quantity) : undefined,
    pieceRate: row.piece_rate ? Number(row.piece_rate) : undefined,
    orderQuantity: row.order_quantity ? Number(row.order_quantity) : undefined,
    workType: row.work_type || seller.workType,
    completionDeadline: row.completion_deadline || seller.completionDeadline,
    materialProvided: row.material_provided ?? seller.materialProvided ?? true,
    brand: row.brand,
    model: row.model,
    machineType: row.machine_type || seller.machineType,
    condition: row.condition,
    warrantyMonths: row.warranty_months ? Number(row.warranty_months) : undefined,
    partName: row.part_name || seller.partName,
    compatibleBrands: Array.isArray(row.compatible_brands) ? row.compatible_brands : (seller.compatibleBrands || []),
    technicianTier: (row.technician_tier as TechnicianTier) || seller.technicianTier,
    experienceYears: row.experience_years ? Number(row.experience_years) : undefined,
    specialities: Array.isArray(row.specialities) ? row.specialities : (seller.specialities || []),
    isEmergencyAvailable: row.is_emergency_available ?? seller.isEmergencyAvailable ?? false,
    codAvailable: Boolean(row.cod_available),
    deliveryAvailable: Boolean(row.delivery_available),
    deliveryNotes: row.delivery_notes || seller.deliveryNotes,
    images: Array.isArray(row.images) ? row.images : [],
    seller: {
      name: seller.name || 'Garment Partner',
      businessName: seller.businessName,
      phone: seller.phone || '0770000000',
      whatsapp: seller.whatsapp || seller.phone || '94770000000',
      district: seller.district || 'Colombo',
      city: seller.city || 'Colombo',
      verified: Boolean(seller.verified),
      memberSince: seller.memberSince || '2026',
      userRole: seller.userRole || 'tailor',
      membershipTier: (seller.membershipTier as MembershipTier) || 'starter',
      nic: seller.nic,
    },
    paymentMethod: row.payment_method || seller.paymentMethod,
    paymentRef: row.payment_ref,
    paymentSlipUrl: row.payment_slip_url || seller.paymentSlipUrl,
    totalCostLkr: row.total_cost_lkr ? Number(row.total_cost_lkr) : 0,
    createdAt: row.created_at || new Date().toISOString(),
    views: Number(row.views) || 0,
    urgentHeadline: row.urgent_headline || seller.urgentHeadline,
  };
}

// Map Frontend Ad -> Supabase DB row
export function mapAdToDbRow(ad: Ad): Record<string, any> {
  return {
    id: ad.id,
    title: ad.title,
    title_si: ad.titleSi || ad.title,
    description: ad.description || '',
    category: ad.category,
    tier: ad.tier,
    status: ad.status,
    price: ad.price || 0,
    piece_rate: ad.pieceRate || null,
    order_quantity: ad.orderQuantity || null,
    brand: ad.brand || null,
    model: ad.model || null,
    condition: ad.condition || null,
    warranty_months: ad.warrantyMonths || null,
    sizes: ad.sizes || null,
    total_quantity: ad.totalQuantity || null,
    min_order_quantity: ad.minOrderQuantity || null,
    cod_available: ad.codAvailable ?? true,
    delivery_available: ad.deliveryAvailable ?? true,
    images: ad.images || [],
    seller: {
      ...ad.seller,
      descriptionSi: ad.descriptionSi,
      rejectionReason: ad.rejectionReason,
      isNegotiable: ad.isNegotiable,
      duration: ad.duration,
      workType: ad.workType,
      completionDeadline: ad.completionDeadline,
      materialProvided: ad.materialProvided,
      machineType: ad.machineType,
      partName: ad.partName,
      compatibleBrands: ad.compatibleBrands,
      technicianTier: ad.technicianTier,
      experienceYears: ad.experienceYears,
      specialities: ad.specialities,
      isEmergencyAvailable: ad.isEmergencyAvailable,
      deliveryNotes: ad.deliveryNotes,
      paymentMethod: ad.paymentMethod,
      paymentSlipUrl: ad.paymentSlipUrl,
      urgentHeadline: ad.urgentHeadline,
    },
    payment_ref: ad.paymentRef || null,
    total_cost_lkr: ad.totalCostLkr || 0,
    created_at: ad.createdAt || new Date().toISOString(),
    views: ad.views || 0,
  };
}

// Map Supabase Profile -> Frontend UserAccount
export function mapProfileToUser(p: any): UserAccount {
  const isAdmin = p.username === ADMIN_USERNAME || p.nic === ADMIN_USERNAME || p.role === 'admin';
  return {
    id: p.id,
    username: p.username || '',
    nic: p.nic || p.username || '',
    name: p.name || 'Member',
    businessName: p.business_name || undefined,
    businessPhone: p.business_phone || undefined,
    email: p.email || '',
    phone: p.phone || '',
    whatsapp: p.whatsapp || p.phone || '',
    address: p.address || '',
    district: p.district || 'Colombo',
    city: p.city || 'Colombo',
    status: p.status || 'active',
    membershipTier: (p.membership_tier as MembershipTier) || 'starter',
    registeredAt: p.created_at || new Date().toISOString(),
    avatar: p.avatar_url || undefined,
    role: isAdmin ? 'admin' : (p.role || 'user'),
    isAdmin: isAdmin,
    password: p.password,
  };
}

// Map Frontend UserAccount -> Supabase Profile row
export function mapUserToProfileRow(user: UserAccount): Record<string, any> {
  const row: Record<string, any> = {
    id: user.id,
    username: user.username,
    nic: user.nic,
    name: user.name,
    email: user.email,
    phone: user.phone,
    whatsapp: user.whatsapp,
    address: user.address,
    district: user.district,
    city: user.city,
    status: user.status,
    membership_tier: user.membershipTier,
    business_name: user.businessName || null,
    business_phone: user.businessPhone || null,
  };
  return row;
}

// -----------------------------------------------------------------------------
// Live Database CRUD Operations
// -----------------------------------------------------------------------------

// Fetch all ads from live Supabase database
export async function fetchLiveAds(): Promise<Ad[]> {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching ads from Supabase:', error.message);
      return INITIAL_ADS;
    }

    if (!data || data.length === 0) {
      // Seed initial ads to Supabase so the database is populated live
      console.log('No ads found in Supabase. Seeding initial ads...');
      await seedInitialAdsToSupabase();
      return INITIAL_ADS;
    }

    return data.map(mapDbRowToAd);
  } catch (err) {
    console.error('Fetch ads caught error:', err);
    return INITIAL_ADS;
  }
}

// Seed initial ads to Supabase
async function seedInitialAdsToSupabase() {
  try {
    const rows = INITIAL_ADS.map(mapAdToDbRow);
    const { error } = await supabase.from('ads').insert(rows);
    if (error) {
      console.warn('Error seeding ads:', error.message);
    } else {
      console.log('Successfully seeded initial ads to Supabase live database!');
    }
  } catch (err) {
    console.error('Seed ads error:', err);
  }
}

// Fetch all user profiles from live Supabase database
export async function fetchLiveProfiles(): Promise<UserAccount[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Error fetching profiles from Supabase:', error.message);
      return INITIAL_USERS;
    }

    let usersList = (data || []).map(mapProfileToUser);

    // Ensure Admin profile is seeded in database
    const adminExists = usersList.some((u) => u.username === ADMIN_USERNAME || u.nic === ADMIN_USERNAME);
    if (!adminExists) {
      const adminProfileRow = {
        id: `admin-${Date.now()}`,
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
        membership_tier: 'platinum',
      };
      await supabase.from('profiles').insert([adminProfileRow]);
      usersList.push(mapProfileToUser(adminProfileRow));
    }

    if (usersList.length <= 1) {
      // Seed other sample users
      for (const u of INITIAL_USERS) {
        if (!usersList.some((existing) => existing.username === u.username)) {
          await supabase.from('profiles').insert([mapUserToProfileRow(u)]);
          usersList.push(u);
        }
      }
    }

    return usersList;
  } catch (err) {
    console.error('Fetch profiles error:', err);
    return INITIAL_USERS;
  }
}

// Save a new ad live in Supabase
export async function createAdInSupabase(ad: Ad): Promise<boolean> {
  try {
    const row = mapAdToDbRow(ad);
    const { error } = await supabase.from('ads').insert([row]);
    if (error) {
      console.error('Error inserting ad into Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to create ad in Supabase:', err);
    return false;
  }
}

// Update ad status, tier, or fields live in Supabase
export async function updateAdInSupabase(id: string, updates: Partial<Ad>): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = {};

    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.tier !== undefined) updatePayload.tier = updates.tier;
    if (updates.rejectionReason !== undefined) updatePayload.rejection_reason = updates.rejectionReason;
    if (updates.price !== undefined) updatePayload.price = updates.price;
    if (updates.views !== undefined) updatePayload.views = updates.views;
    if (updates.technicianTier !== undefined) updatePayload.technician_tier = updates.technicianTier;

    // Also update seller if present
    if (updates.seller) {
      updatePayload.seller = updates.seller;
    }

    const { error } = await supabase.from('ads').update(updatePayload).eq('id', id);
    if (error) {
      // If column doesn't exist, update fallback inside seller jsonb
      console.warn('Standard update failed, trying seller jsonb fallback:', error.message);
      const { data: current } = await supabase.from('ads').select('seller').eq('id', id).single();
      const newSeller = { ...(current?.seller || {}), ...updates };
      const fallbackPayload: Record<string, any> = { seller: newSeller };
      if (updates.status) fallbackPayload.status = updates.status;
      if (updates.tier) fallbackPayload.tier = updates.tier;
      await supabase.from('ads').update(fallbackPayload).eq('id', id);
    }
    return true;
  } catch (err) {
    console.error('Failed to update ad in Supabase:', err);
    return false;
  }
}

// Delete ad live from Supabase
export async function deleteAdFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('ads').delete().eq('id', id);
    if (error) {
      console.error('Error deleting ad from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete ad in Supabase:', err);
    return false;
  }
}

// Save a new user profile live in Supabase
export async function createProfileInSupabase(user: UserAccount): Promise<boolean> {
  try {
    const row = mapUserToProfileRow(user);
    const { error } = await supabase.from('profiles').insert([row]);
    if (error) {
      console.error('Error inserting profile into Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to create profile in Supabase:', err);
    return false;
  }
}

// Update profile status or membership live in Supabase
export async function updateProfileInSupabase(id: string, updates: Partial<UserAccount>): Promise<boolean> {
  try {
    const payload: Record<string, any> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.membershipTier !== undefined) payload.membership_tier = updates.membershipTier;
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.whatsapp !== undefined) payload.whatsapp = updates.whatsapp;
    if (updates.operatorTier !== undefined) payload.operator_tier = updates.operatorTier;
    if (updates.technicianTier !== undefined) payload.technician_tier = updates.technicianTier;

    const { error } = await supabase.from('profiles').update(payload).eq('id', id);
    if (error) {
      console.error('Error updating profile in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update profile in Supabase:', err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Supabase Storage (Photo Uploads)
// -----------------------------------------------------------------------------

// Convert File to base64 DataURL fallback
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload image to Supabase Storage bucket 'ad-images'
export async function uploadAdPhotoToSupabase(file: File): Promise<{ url: string; isStorage: boolean }> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filePath = `ads/${Date.now()}_${cleanFileName}.${fileExt}`;
    const primaryBucket = SUPABASE_CONFIG.storageBucket || 'ad-images';

    let uploadRes = await supabase.storage
      .from(primaryBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // If primary bucket failed, try 'ad-images' specifically if different
    if (uploadRes.error && primaryBucket !== 'ad-images') {
      uploadRes = await supabase.storage
        .from('ad-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
    }

    if (uploadRes.error) {
      console.warn(`Storage upload to '${primaryBucket}' failed (${uploadRes.error.message}). Falling back to DataURL.`);
      const dataUrl = await fileToDataUrl(file);
      return { url: dataUrl, isStorage: false };
    }

    const { data: publicUrlData } = supabase.storage
      .from(primaryBucket)
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, isStorage: true };
  } catch (err) {
    console.warn('Storage upload exception, using fallback:', err);
    const dataUrl = await fileToDataUrl(file);
    return { url: dataUrl, isStorage: false };
  }
}

// -----------------------------------------------------------------------------
// Promo Codes & Payment Settings Services
// -----------------------------------------------------------------------------

export async function fetchLivePromoCodes(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('promo_codes table not found or error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('fetchLivePromoCodes caught error:', err);
    return [];
  }
}

export async function savePromoCodeToSupabase(promo: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('promo_codes').upsert([promo]);
    if (error) {
      console.warn('Error saving promo code to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('savePromoCode caught error:', err);
    return false;
  }
}

export async function deletePromoCodeFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('promo_codes').delete().eq('id', id);
    if (error) {
      console.warn('Error deleting promo code:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('deletePromoCode caught error:', err);
    return false;
  }
}

export async function fetchLivePaymentSettings(): Promise<{ bankAccounts?: any[]; qrSettings?: any } | null> {
  try {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }
    const row = data[0] as any;
    return {
      bankAccounts: row.bank_accounts || row.bankAccounts,
      qrSettings: row.qr_settings || row.qrSettings,
    };
  } catch (err) {
    console.warn('fetchLivePaymentSettings error:', err);
    return null;
  }
}

export async function savePaymentSettingsToSupabase(bankAccounts: any[], qrSettings: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('payment_settings')
      .upsert([
        {
          id: 'primary_settings',
          bank_accounts: bankAccounts,
          qr_settings: qrSettings,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.warn('Error saving payment_settings to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('savePaymentSettings error:', err);
    return false;
  }
}

