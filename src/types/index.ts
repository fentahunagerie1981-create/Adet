export type Language = 'am' | 'en';

export type Category = 'all' | 'grain' | 'oilseeds_pulses' | 'livestock' | 'dairy_honey' | 'inputs' | 'transport';

export interface CommodityPrice {
  id: string;
  nameAm: string;
  nameEn: string;
  category: Category;
  unitAm: string;
  unitEn: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  weeklyLow: number;
  weeklyHigh: number;
  gradeAm: string;
  gradeEn: string;
  marketLocationAm: string;
  marketLocationEn: string;
  updatedAt: string;
  volumeQuintalsToday: number;
}

export interface TradeListing {
  id: string;
  titleAm: string;
  titleEn: string;
  category: Category;
  varietyAm: string;
  varietyEn: string;
  quantity: number;
  unitAm: string;
  unitEn: string;
  pricePerUnit: number;
  isNegotiable: boolean;
  minOrderQuantity: number;
  locationAm: string;
  locationEn: string;
  sellerName: string;
  sellerTypeAm: string;
  sellerTypeEn: string;
  sellerPhone: string;
  isVerifiedSeller: boolean;
  imageUrl: string;
  descriptionAm: string;
  descriptionEn: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface Merchant {
  id: string;
  nameAm: string;
  nameEn: string;
  typeAm: string;
  typeEn: string;
  contactPerson: string;
  phone: string;
  locationAm: string;
  locationEn: string;
  specializationAm: string;
  specializationEn: string;
  warehouseCapacityQuintals: number;
  yearsInBusiness: number;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

export interface FreightRoute {
  id: string;
  truckTypeAm: string;
  truckTypeEn: string;
  plateNumber: string;
  capacityQuintals: number;
  originAm: string;
  originEn: string;
  destinationAm: string;
  destinationEn: string;
  availableDate: string;
  pricePerQuintalETB: number;
  driverName: string;
  driverPhone: string;
  isAvailable: boolean;
}
