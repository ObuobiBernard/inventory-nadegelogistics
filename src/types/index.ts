export interface Category {
  id: string;
  name: string;
  icon?: string;
  deleted?: boolean;
}

export type EquipmentStatus = 'available' | 'rented' | 'maintenance' | 'reserved' | 'sold' | 'deleted';

export interface Equipment {
  id: string;
  name: string;
  category: string; // category id
  description?: string;
  quantity: number;
  available: number;
  rentalPrice: number; // in GHS per day
  salePrice: number; // in GHS
  status: EquipmentStatus;
  supplier?: string;
  purchaseDate?: string;
  invoice?: string;
  condition?: string;
  location?: string;
  serial?: string;
  notes?: string;
  deleted?: boolean;
  _imported?: boolean;
  _importDate?: string;
}

export type RentalStatus = 'active' | 'returned' | 'reserved' | 'draft' | 'overdue';

export interface Rental {
  id: string;
  equipmentId: string;
  customerId: string;
  event?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number; // in GHS
  status: RentalStatus;
  notes?: string;
  deleted?: boolean;
}

export interface Sale {
  id: string;
  equipmentId: string;
  customerId: string;
  date: string;
  quantity: number;
  totalPrice: number; // in GHS
  deleted?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  deleted?: boolean;
}

export type UserRole = 'client' | 'staff' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  phone?: string;
  company?: string;
  createdAt?: string;
}

export type ServiceType = 'rental' | 'purchase';

export interface SelectedServiceItem {
  id: string;
  equipmentId: string;
  name: string;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: number; // daily rental or unit sale in GHS
  days: number; // for rentals
  totalPrice: number; // in GHS
  categoryName?: string;
}

export type PaymentMethodType = 'full' | 'part' | 'later';
export type PaymentStatus = 'paid' | 'partially_paid' | 'pending';
export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface CustomerOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  orderNumber: string;
  items: SelectedServiceItem[];
  subtotal: number;
  totalAmount: number; // in GHS
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  amountPaid: number; // in GHS
  balanceDue: number; // in GHS
  orderStatus: OrderStatus;
  invoiceNumber: string;
  receiptNumber?: string;
  eventDetails?: string;
  paymentChannel?: string; // 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Card' | 'Bank Transfer' | 'Pay Later'
  transactionRef?: string;
  createdAt: string;
}

export interface StaffInvitation {
  email: string;
  role: 'staff' | 'admin';
  name?: string;
  assignedBy?: string;
  claimed: boolean;
  claimedAt?: string;
  uid?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
  deleted?: boolean;
}

export interface SyncSettings {
  url: string;
  secret: string;
}

export type PageTab = 'dashboard' | 'equipment' | 'rentals' | 'sales' | 'customers' | 'categories' | 'orders' | 'staff-management';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Ghanaian Cedi Formatter
export function formatGHS(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'GH₵ 0.00';
  return 'GH₵ ' + Number(amount).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
