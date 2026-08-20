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
