import { Equipment, Category, Customer, Rental, Sale, ActivityLog, SyncSettings, CustomerOrder, formatGHS } from '../types';

export const BOOTSTRAP_ADMIN_EMAIL = 'nadegelogisticservices@gmail.com';

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function genOrderRef(prefix = 'NLG'): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export { formatGHS };
export const formatCurrency = formatGHS;

export function formatDate(d: string | undefined): string {
  if (!d) return '-';
  const parts = d.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0].slice(2)}`;
  }
  return d;
}

// Initial Real Data from NADEGE Logistics Excel Sheets (in GHS)
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_led', name: 'LED Screens', icon: 'fa-solid fa-display', deleted: false },
  { id: 'cat_sound', name: 'Sound Equipment', icon: 'fa-solid fa-volume-high', deleted: false },
  { id: 'cat_stage', name: 'Stage', icon: 'fa-solid fa-layer-group', deleted: false },
];

export const DEFAULT_EQUIPMENT: Equipment[] = [
  // LED Screens
  {
    id: 'LED-001',
    name: 'P3.91 Outdoor LED Panel, 500x1000mm, Setup A',
    description: '3m x 4m wall (24 panels). Module 250x250mm; refresh rate 7680Hz; incl. corner protectors, connectors, handles, receiver card, power supply & cables',
    quantity: 24,
    available: 24,
    rentalPrice: 45, // GH₵ 45.00/day
    salePrice: 1200, // GH₵ 1,200.00
    status: 'available',
    category: 'cat_led',
    supplier: 'Shenzhen Guangshi Electronics Co., Ltd',
    purchaseDate: '2026-04-23',
    invoice: 'PI LV260423a',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-002',
    name: 'Nova Video Processor, Setup A',
    description: 'Video processor for LED wall',
    quantity: 1,
    available: 1,
    rentalPrice: 50,
    salePrice: 4025,
    status: 'available',
    category: 'cat_led',
    supplier: 'Shenzhen Guangshi Electronics Co., Ltd',
    purchaseDate: '2026-04-23',
    invoice: 'PI LV260423a',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-003',
    name: 'P3.91 Outdoor LED Panel, 500x1000mm, Setup B',
    description: '3m x 4m wall (24 panels). Pixel pitch 3.91mm; refresh 1920Hz; die-cast aluminum cabinet 500x1000mm. Converted to GHS at 1 USD = GHS 11.7',
    quantity: 24,
    available: 24,
    rentalPrice: 45,
    salePrice: 1200,
    status: 'available',
    category: 'cat_led',
    supplier: 'Guangzhou Cheng Wen Photoelectric Technology Co., Ltd',
    purchaseDate: '2026-04-21',
    invoice: 'PI CWJ2604211000',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-004',
    name: 'Novastar CMS130 Video Processor, Setup B',
    description: 'Video processor. Converted to GHS',
    quantity: 1,
    available: 1,
    rentalPrice: 50,
    salePrice: 1801.8,
    status: 'available',
    category: 'cat_led',
    supplier: 'Guangzhou Cheng Wen Photoelectric Technology Co., Ltd',
    purchaseDate: '2026-04-21',
    invoice: 'PI CWJ2604211000',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-005',
    name: 'Setup A Spares',
    description: '2x outdoor P3.91 module, 5V40A power supply, Nova 7508-S card, 4x power/signal cables, mask, IC, lamps, fly case, screws',
    quantity: 1,
    available: 1,
    rentalPrice: 0,
    salePrice: 0,
    status: 'available',
    category: 'cat_led',
    supplier: 'Shenzhen Guangshi Electronics Co., Ltd',
    purchaseDate: '2026-04-23',
    invoice: 'PI LV260423a',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-006',
    name: 'Shipping & Customs Clearance, Setup A',
    description: 'Shenzhen to Accra. Includes double customs clearance & port fees',
    quantity: 1,
    available: 1,
    rentalPrice: 0,
    salePrice: 9430,
    status: 'available',
    category: 'cat_led',
    supplier: 'Shenzhen Guangshi Electronics Co., Ltd',
    purchaseDate: '2026-04-23',
    invoice: 'PI LV260423a',
    condition: 'N/A',
    location: 'N/A',
    deleted: false,
  },
  {
    id: 'LED-007',
    name: '6-in-1 Flight Case, Setup B',
    description: 'Flycase for 6 panels',
    quantity: 4,
    available: 4,
    rentalPrice: 0,
    salePrice: 0,
    status: 'available',
    category: 'cat_led',
    supplier: 'Guangzhou Cheng Wen Photoelectric Technology Co., Ltd',
    purchaseDate: '2026-04-21',
    invoice: 'PI CWJ2604211000',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-008',
    name: 'Novastar MRV208-n Receiving Cards, Setup B',
    description: 'Novastar receiving cards',
    quantity: 24,
    available: 24,
    rentalPrice: 0,
    salePrice: 0,
    status: 'available',
    category: 'cat_led',
    supplier: 'Guangzhou Cheng Wen Photoelectric Technology Co., Ltd',
    purchaseDate: '2026-04-21',
    invoice: 'PI CWJ2604211000',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-010',
    name: 'Power Supply AC220V Spares, Setup B',
    description: 'High efficiency switching power supply',
    quantity: 3,
    available: 3,
    rentalPrice: 0,
    salePrice: 70.2,
    status: 'available',
    category: 'cat_led',
    supplier: 'Guangzhou Cheng Wen Photoelectric Technology Co., Ltd',
    purchaseDate: '2026-04-21',
    invoice: 'PI CWJ2604211000',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'LED-011',
    name: 'Outdoor P3.91 250x250mm LED Module Spares, Setup B',
    description: 'High brightness outdoor LED display module',
    quantity: 9,
    available: 9,
    rentalPrice: 0,
    salePrice: 163.8,
    status: 'available',
    category: 'cat_led',
    supplier: 'Guangzhou Cheng Wen Photoelectric Technology Co., Ltd',
    purchaseDate: '2026-04-21',
    invoice: 'PI CWJ2604211000',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },

  // Sound Equipment
  {
    id: 'SND-001',
    name: 'NAQ DT210 Speaker',
    description: 'Professional line array speaker for large concerts and church programs',
    quantity: 8,
    available: 8,
    rentalPrice: 100, // GH₵ 100.00/day
    salePrice: 8000, // GH₵ 8,000.00
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-002',
    name: 'Rigging Bar',
    description: 'Rigging bar for speaker line-array suspension',
    quantity: 2,
    available: 2,
    rentalPrice: 20,
    salePrice: 2500,
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-003',
    name: 'NAQ B2 Subwoofer',
    description: 'Heavy duty high power dual 18-inch concert subwoofer',
    quantity: 6,
    available: 6,
    rentalPrice: 150, // GH₵ 150.00/day
    salePrice: 12500, // GH₵ 12,500.00
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-004',
    name: 'NAQ WD15 Stage Monitor',
    description: 'Active/passive stage wedge monitor',
    quantity: 6,
    available: 6,
    rentalPrice: 40,
    salePrice: 3000,
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-005',
    name: 'Amp Rack',
    description: 'Power amplifier rack with digital DSP processing',
    quantity: 1,
    available: 1,
    rentalPrice: 50,
    salePrice: 4000,
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-006',
    name: 'PA Processor',
    description: 'Digital PA speaker management system',
    quantity: 1,
    available: 1,
    rentalPrice: 50,
    salePrice: 4000,
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-013',
    name: 'BEHRINGER Wing Compact Mixer',
    description: '48-channel 28-bus full digital mixing console with touch surface',
    quantity: 1,
    available: 1,
    rentalPrice: 300, // GH₵ 300.00/day
    salePrice: 40000, // GH₵ 40,000.00
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-014',
    name: 'Midas DL32 Stage Box',
    description: '32 remote-controllable Midas microphone preamps, 16 returns',
    quantity: 1,
    available: 1,
    rentalPrice: 200,
    salePrice: 22000,
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'SND-016',
    name: 'Shure ADQ4-in-1 Wireless Microphone System',
    description: 'Quad wireless receiver with handheld transmitters',
    quantity: 1,
    available: 1,
    rentalPrice: 60,
    salePrice: 7000,
    status: 'available',
    category: 'cat_sound',
    supplier: 'Naquamz Musical Store',
    purchaseDate: '2026-08-22',
    invoice: 'INV080',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },

  // Stage Equipment
  {
    id: 'STG-001',
    name: 'Aluminum Stage Panel, 1.22 x 2.44 x 0.065m',
    description: '18mm heavy duty non-slip plywood top, 6061-T6 aluminum frame. Stage 4.88m x 3.66m, height 0.6-1.0m',
    quantity: 6,
    available: 6,
    rentalPrice: 50, // GH₵ 50.00/day
    salePrice: 924.3, // GH₵ 924.30
    status: 'available',
    category: 'cat_stage',
    supplier: 'Foshan Nanhai EPE Truss Stage Equipment Co., Ltd',
    purchaseDate: '2026-01-06',
    invoice: 'Quotation (Buyer: Emmanuel Obuobi)',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'STG-002',
    name: 'Stage Support Frame (short), 1.22 x 0.35 x 0.05m',
    description: 'Telescopic stage cross support brace',
    quantity: 9,
    available: 9,
    rentalPrice: 10,
    salePrice: 245.7,
    status: 'available',
    category: 'cat_stage',
    supplier: 'Foshan Nanhai EPE Truss Stage Equipment Co., Ltd',
    purchaseDate: '2026-01-06',
    invoice: 'Quotation (Buyer: Emmanuel Obuobi)',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'STG-003',
    name: 'Stage Support Frame (long), 2.44 x 0.35 x 0.05m',
    description: 'Stage boundary cross support',
    quantity: 8,
    available: 8,
    rentalPrice: 15,
    salePrice: 397.8,
    status: 'available',
    category: 'cat_stage',
    supplier: 'Foshan Nanhai EPE Truss Stage Equipment Co., Ltd',
    purchaseDate: '2026-01-06',
    invoice: 'Quotation (Buyer: Emmanuel Obuobi)',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'STG-004',
    name: 'Adjustable Stage Leg, 0.5 x 0.11 x 0.11m',
    description: 'Heavy duty height adjustable aluminum stage leg with leveling pin',
    quantity: 12,
    available: 12,
    rentalPrice: 5,
    salePrice: 105.3,
    status: 'available',
    category: 'cat_stage',
    supplier: 'Foshan Nanhai EPE Truss Stage Equipment Co., Ltd',
    purchaseDate: '2026-01-06',
    invoice: 'Quotation (Buyer: Emmanuel Obuobi)',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'STG-005',
    name: 'Leg Base Plate, 138 x 138 x 165mm',
    description: 'Steel leg base plate for stage stabilization',
    quantity: 12,
    available: 12,
    rentalPrice: 3,
    salePrice: 58.5,
    status: 'available',
    category: 'cat_stage',
    supplier: 'Foshan Nanhai EPE Truss Stage Equipment Co., Ltd',
    purchaseDate: '2026-01-06',
    invoice: 'Quotation (Buyer: Emmanuel Obuobi)',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
  {
    id: 'STG-006',
    name: '4-Step Stage Stairs with Guardrails',
    description: 'Stairs for 0.6-1.0m stage height with safety handrails',
    quantity: 1,
    available: 1,
    rentalPrice: 30,
    salePrice: 2468.7,
    status: 'available',
    category: 'cat_stage',
    supplier: 'Foshan Nanhai EPE Truss Stage Equipment Co., Ltd',
    purchaseDate: '2026-01-06',
    invoice: 'Quotation (Buyer: Emmanuel Obuobi)',
    condition: 'New',
    location: 'Warehouse',
    deleted: false,
  },
];

export const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'ABC Events Ltd', email: 'info@abcevents.com', phone: '+233 555 0101', company: 'ABC Events Ltd', deleted: false },
  { id: 'c2', name: 'XYZ Church', email: 'admin@xyzchurch.org', phone: '+233 555 0102', company: 'XYZ Church', deleted: false },
  { id: 'c3', name: 'Golden Tulip Hotel', email: 'events@goldentulip.com', phone: '+233 555 0103', company: 'Golden Tulip Hotel', deleted: false },
  { id: 'c4', name: 'Ministry of Youth', email: 'youth@moy.gov.gh', phone: '+233 555 0104', company: 'Ministry of Youth', deleted: false },
  { id: 'c5', name: 'Accra Expo Group', email: 'info@accraexpo.com', phone: '+233 555 0105', company: 'Accra Expo Group', deleted: false },
];

export const DEFAULT_RENTALS: Rental[] = [
  {
    id: 'RNT-001',
    customerId: 'c1',
    equipmentId: 'LED-001',
    event: 'Corporate Conference',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    quantity: 2,
    totalPrice: 270, // GH₵ 270.00
    status: 'active',
    notes: 'LED wall + speakers + stage decks',
    deleted: false,
  },
  {
    id: 'RNT-002',
    customerId: 'c2',
    equipmentId: 'SND-003',
    event: 'Sunday Service',
    startDate: '2026-08-24',
    endDate: '2026-08-27',
    quantity: 2,
    totalPrice: 900, // GH₵ 900.00
    status: 'active',
    notes: 'Subwoofers and stage monitors',
    deleted: false,
  },
];

const STORAGE_KEYS = {
  EQUIPMENT: 'nadege_equipment_ghs_v5',
  CATEGORIES: 'nadege_categories_ghs_v5',
  CUSTOMERS: 'nadege_customers_ghs_v5',
  RENTALS: 'nadege_rentals_ghs_v5',
  SALES: 'nadege_sales_ghs_v5',
  ORDERS: 'nadege_orders_ghs_v5',
  ACTIVITY: 'nadege_activity_ghs_v5',
  SETTINGS: 'nadege_settings_ghs_v5',
};

function readStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return defaultVal;
  }
}

function writeStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error writing ${key}:`, err);
  }
}

// Data Operations
export function getEquipment(showDeleted = false): Equipment[] {
  const all = readStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
  return showDeleted ? all : all.filter(e => !e.deleted);
}

export function saveEquipment(item: Equipment): void {
  const all = readStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
  const idx = all.findIndex(e => e.id === item.id);
  if (idx > -1) {
    all[idx] = item;
  } else {
    all.push(item);
  }
  writeStorage(STORAGE_KEYS.EQUIPMENT, all);
}

export function setAllEquipment(items: Equipment[]): void {
  writeStorage(STORAGE_KEYS.EQUIPMENT, items);
}

export function deleteEquipment(id: string): void {
  const all = readStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
  const item = all.find(e => e.id === id);
  if (item) {
    item.deleted = true;
    writeStorage(STORAGE_KEYS.EQUIPMENT, all);
  }
}

export function restoreEquipment(id: string): void {
  const all = readStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
  const item = all.find(e => e.id === id);
  if (item) {
    item.deleted = false;
    writeStorage(STORAGE_KEYS.EQUIPMENT, all);
  }
}

export function getCategories(showDeleted = false): Category[] {
  const all = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  return showDeleted ? all : all.filter(c => !c.deleted);
}

export function saveCategory(cat: Category): void {
  const all = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  const idx = all.findIndex(c => c.id === cat.id);
  if (idx > -1) {
    all[idx] = cat;
  } else {
    all.push(cat);
  }
  writeStorage(STORAGE_KEYS.CATEGORIES, all);
}

export function setAllCategories(cats: Category[]): void {
  writeStorage(STORAGE_KEYS.CATEGORIES, cats);
}

export function deleteCategory(id: string): void {
  const all = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  const cat = all.find(c => c.id === id);
  if (cat) {
    cat.deleted = true;
    writeStorage(STORAGE_KEYS.CATEGORIES, all);
  }
}

export function restoreCategory(id: string): void {
  const all = readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  const cat = all.find(c => c.id === id);
  if (cat) {
    cat.deleted = false;
    writeStorage(STORAGE_KEYS.CATEGORIES, all);
  }
}

export function getCustomers(showDeleted = false): Customer[] {
  const all = readStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  return showDeleted ? all : all.filter(c => !c.deleted);
}

export function saveCustomer(cust: Customer): void {
  const all = readStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  const idx = all.findIndex(c => c.id === cust.id);
  if (idx > -1) {
    all[idx] = cust;
  } else {
    all.push(cust);
  }
  writeStorage(STORAGE_KEYS.CUSTOMERS, all);
}

export function deleteCustomer(id: string): void {
  const all = readStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  const cust = all.find(c => c.id === id);
  if (cust) {
    cust.deleted = true;
    writeStorage(STORAGE_KEYS.CUSTOMERS, all);
  }
}

export function restoreCustomer(id: string): void {
  const all = readStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  const cust = all.find(c => c.id === id);
  if (cust) {
    cust.deleted = false;
    writeStorage(STORAGE_KEYS.CUSTOMERS, all);
  }
}

export function getRentals(showDeleted = false): Rental[] {
  const all = readStorage<Rental[]>(STORAGE_KEYS.RENTALS, DEFAULT_RENTALS);
  return showDeleted ? all : all.filter(r => !r.deleted);
}

export function saveRental(rental: Rental): void {
  const all = readStorage<Rental[]>(STORAGE_KEYS.RENTALS, DEFAULT_RENTALS);
  const idx = all.findIndex(r => r.id === rental.id);
  if (idx > -1) {
    all[idx] = rental;
  } else {
    all.push(rental);
  }
  writeStorage(STORAGE_KEYS.RENTALS, all);
}

export function deleteRental(id: string): void {
  const all = readStorage<Rental[]>(STORAGE_KEYS.RENTALS, DEFAULT_RENTALS);
  const r = all.find(item => item.id === id);
  if (r) {
    r.deleted = true;
    writeStorage(STORAGE_KEYS.RENTALS, all);
  }
}

export function restoreRental(id: string): void {
  const all = readStorage<Rental[]>(STORAGE_KEYS.RENTALS, DEFAULT_RENTALS);
  const r = all.find(item => item.id === id);
  if (r) {
    r.deleted = false;
    writeStorage(STORAGE_KEYS.RENTALS, all);
  }
}

export function getSales(showDeleted = false): Sale[] {
  const all = readStorage<Sale[]>(STORAGE_KEYS.SALES, []);
  return showDeleted ? all : all.filter(s => !s.deleted);
}

export function saveSale(sale: Sale): void {
  const all = readStorage<Sale[]>(STORAGE_KEYS.SALES, []);
  const idx = all.findIndex(s => s.id === sale.id);
  if (idx > -1) {
    all[idx] = sale;
  } else {
    all.push(sale);
  }
  writeStorage(STORAGE_KEYS.SALES, all);
}

export function deleteSale(id: string): void {
  const all = readStorage<Sale[]>(STORAGE_KEYS.SALES, []);
  const s = all.find(item => item.id === id);
  if (s) {
    s.deleted = true;
    writeStorage(STORAGE_KEYS.SALES, all);
  }
}

export function restoreSale(id: string): void {
  const all = readStorage<Sale[]>(STORAGE_KEYS.SALES, []);
  const s = all.find(item => item.id === id);
  if (s) {
    s.deleted = false;
    writeStorage(STORAGE_KEYS.SALES, all);
  }
}

// Customer Orders Storage
export function getOrders(): CustomerOrder[] {
  return readStorage<CustomerOrder[]>(STORAGE_KEYS.ORDERS, []);
}

export function saveOrder(order: CustomerOrder): void {
  const all = readStorage<CustomerOrder[]>(STORAGE_KEYS.ORDERS, []);
  const idx = all.findIndex(o => o.id === order.id);
  if (idx > -1) {
    all[idx] = order;
  } else {
    all.unshift(order);
  }
  writeStorage(STORAGE_KEYS.ORDERS, all);
}

export function updateOrderStatus(id: string, status: CustomerOrder['orderStatus']): void {
  const all = readStorage<CustomerOrder[]>(STORAGE_KEYS.ORDERS, []);
  const o = all.find(item => item.id === id);
  if (o) {
    o.orderStatus = status;
    writeStorage(STORAGE_KEYS.ORDERS, all);
  }
}

export function getActivityLogs(): ActivityLog[] {
  const all = readStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, [
    {
      id: 'init_ghs',
      timestamp: new Date().toISOString(),
      action: 'System initialized',
      details: 'Loaded real inventory in Ghanaian Cedis (GH₵)',
      deleted: false,
    },
  ]);
  return all.filter(a => !a.deleted).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function logActivity(action: string, details?: string): ActivityLog {
  const all = readStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, []);
  const newEntry: ActivityLog = {
    id: genId(),
    timestamp: new Date().toISOString(),
    action,
    details: details || '',
    deleted: false,
  };
  all.unshift(newEntry);
  if (all.length > 100) all.splice(100);
  writeStorage(STORAGE_KEYS.ACTIVITY, all);
  return newEntry;
}

export function clearActivityLogs(): void {
  writeStorage(STORAGE_KEYS.ACTIVITY, []);
}

export function getSettings(): SyncSettings {
  return readStorage<SyncSettings>(STORAGE_KEYS.SETTINGS, { url: '', secret: '' });
}

export function saveSettings(settings: SyncSettings): void {
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
}
