
export type BusinessType = 'Restaurant' | 'Café' | 'Food Truck' | 'Bar & Lounge' | 'Retail' | 'Other';
export type LocationType = 'Permanent' | 'Event';
export type CashierRole = 'Bar' | 'Counter' | 'Floor';
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'HEAD_CHEF'
  | 'SOUS_CHEF'
  | 'LINE_COOK'
  | 'PREP_COOK'
  | 'HEAD_WAITER'
  | 'WAITER'
  | 'BARTENDER'
  | 'HOST'
  | 'BUSSER'
  | 'DISHWASHER'
  | 'CLEANER'
  | 'CASHIER'
  | 'HR'
  | 'ACCOUNTANT';

export interface BusinessProfile {
  name: string;
  logo?: string;
  corporateAddress: string;
  brn: string;
  vat: string;
  mainLocationId?: string;
  phone: string;
  email: string;
  website: string;
  businessType: BusinessType;
}

export type SimulatedRole = 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER';

export interface SimulatedUser {
  id: string;
  name: string;
  email: string;
  role: SimulatedRole;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  isActive: boolean;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  tableCount?: number;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  icon?: string; // emoji icon for menu display
  sortOrder?: number;
}

export interface Supplier {
  id: string;
  name: string;
  responsibleParty: string;
  brn?: string;
  vat?: string;
  mobile: string;
  address?: string;
  revenue_share_percentage: number;
  createdAt: string;
}

export type Tenant = Supplier;

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  buyingPrice: number;
  stock: number;
  initialStock: number;
  categoryId: string;
  supplierId: string;
  createdAt: string;
  // Restaurant-specific
  prepTime?: number;        // in minutes
  dietaryTags?: string[];   // e.g. ['Vegan', 'Gluten-Free', 'Spicy']
  isAvailable?: boolean;    // 86'd status
  courseType?: 'Snack' | 'Starter' | 'Main Course' | 'Main' | 'Side' | 'Dessert' | 'Beverage' | 'Other';
  image?: string;           // Optional URL for the product image
}

export interface LocationPrice {
  id: string;
  productId: string;
  locationId: string;
  price: number;
}

export interface Cashier {
  id: string;
  created_at: string;
  name: string;
  pin?: string;
  role: CashierRole;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  supplierId: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  locationId: string;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  createdAt: number;
  cashierId: string;
  stationId: string;
  synced: boolean;
  // Restaurant-specific
  orderType?: OrderType;
  tableNumber?: number;
  guestCount?: number;
  serverName?: string;
}

export interface ActiveShift {
  stationId: string;
  locationId: string;
  cashierId: string;
  cashierName: string;
  floatAmount: number;
  startTime: string;
  role: CashierRole;
}

export interface ActiveAdmin {
  id: string;
  email: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  staffCount: number;
  budget: number;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentId?: string;
  locationId?: string;
  hiredAt: string;
  isActive: boolean;
  cvUrl?: string;
  idNumber: string;
}

export interface ComplianceRecord {
  id: string;
  type: 'VAT' | 'CSG' | 'NSF' | 'FOOD_HYGIENE' | 'LIQUOR_LICENSE' | 'FIRE_SAFETY' | 'HEALTH_INSPECTION' | 'TRADE_LICENSE' | 'INSURANCE';
  title: string;
  status: 'COMPLIANT' | 'PENDING' | 'EXPIRED' | 'NOT_APPLICABLE';
  expiryDate?: string;
  lastRenewalDate?: string;
  documents: { name: string; url: string }[];
}
