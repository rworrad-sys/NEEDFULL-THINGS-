export interface DigitalProduct {
  id: string;
  title: string;
  niche: string;
  topic: string;
  price: string;
  productType: string;
  content: string;
  coverImage?: string;
  createdAt: string;
}

export interface NicheIdea {
  id: string;
  title: string;
  category: string;
  avgPrice: string;
  targetAudience: string;
  hotScore: string;
  description: string;
}

export type CopyCategory = 'subject_line' | 'headline' | 'cta';

export interface CopySwipeItem {
  id: string;
  category: CopyCategory;
  niche: string;
  text: string;
  subtext?: string;
  conversionMetric?: string;
  angle?: string;
  isCustom?: boolean;
  isFavorite?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  amount: number;
  formattedAmount: string;
  customerEmail: string;
  customerName: string;
  status: 'completed' | 'processing' | 'refunded';
  paymentMethod: 'square' | 'stripe' | 'direct_card' | 'payhip' | 'instant';
  paymentId?: string;
  licenseKey: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  stripeEnabled: boolean;
  squareEnabled: boolean;
  squareLocationId?: string;
  squareEnvironment?: 'sandbox' | 'production';
  primaryGateway: 'square' | 'stripe' | 'direct';
  payhipStoreUrl: string;
  supportEmail: string;
  announcement: string;
  isLive: boolean;
}

