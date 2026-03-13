
import { BusinessProfile, Location, Category, Supplier, Product, LocationPrice, Cashier, Department, StaffMember, ComplianceRecord, Order } from './types';

export const MOCK_BUSINESS: BusinessProfile = {
  name: "eLunch",
  logo: "/images/app_Logo.png",
  corporateAddress: "Le Caudan Waterfront, Port Louis",
  brn: "C12345678",
  vat: "VAT-998877",
  mainLocationId: "loc-1",
  phone: "230-123-4567",
  email: "contact@elunch.mu",
  website: "www.elunch.mu",
  businessType: 'Restaurant'
};

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: "Main Restaurant — Port Louis Waterfront",
    type: 'Permanent',
    address: "Le Caudan Waterfront, Port Louis",
    isActive: true,
    tableCount: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 'loc-2',
    name: "Flic en Flac Beach Kiosk",
    type: 'Permanent',
    address: "Royal Road, Flic en Flac",
    isActive: true,
    tableCount: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 'loc-3',
    name: "Food Festival Pop-up",
    type: 'Event',
    address: "Champ de Mars, Port Louis",
    isActive: true,
    tableCount: 8,
    startDate: '2026-04-12',
    endDate: '2026-04-14',
    createdAt: new Date().toISOString()
  }
];

// ─── MENU CATEGORIES ──────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-0', name: 'Snacks', parentId: null, icon: '🍿', sortOrder: 0 },
  { id: 'cat-1', name: 'Starters', parentId: null, icon: '🥗', sortOrder: 1 },
  { id: 'cat-2', name: 'Main Course', parentId: null, icon: '🍛', sortOrder: 2 },
  { id: 'cat-6', name: 'Desserts', parentId: null, icon: '🍰', sortOrder: 3 },
  { id: 'cat-7', name: 'Soft Drinks', parentId: null, icon: '🥤', sortOrder: 4 },
  { id: 'cat-8', name: 'Cocktails & Spirits', parentId: null, icon: '🍹', sortOrder: 5 },
  { id: 'cat-9', name: 'Beer & Wine', parentId: null, icon: '🍷', sortOrder: 6 },
  { id: 'cat-10', name: 'Hot Beverages', parentId: null, icon: '☕', sortOrder: 7 },
];

// ─── FOOD & BEVERAGE SUPPLIERS ────────────────────
export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: "Fresh Farms Mauritius",
    responsibleParty: "Raj Doorgakant",
    mobile: "59001122",
    address: "Vacoas Market Road, Vacoas",
    revenue_share_percentage: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sup-2',
    name: "Ocean Catch Seafood Co.",
    responsibleParty: "Pierre Lenoir",
    mobile: "59003344",
    address: "Port Mathurin, Rodrigues",
    revenue_share_percentage: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sup-3',
    name: "Island Beverages Ltd",
    responsibleParty: "Sophie Chen",
    mobile: "59005566",
    address: "Industrial Zone, Pailles",
    revenue_share_percentage: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sup-4',
    name: "Phoenix Meat Suppliers",
    responsibleParty: "Ashwin Ramgoolam",
    mobile: "59007788",
    address: "Phoenix Trading Estate",
    revenue_share_percentage: 0,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // ── SNACKS ──
  {
    id: 'prod-1', name: "Dholl Puri Platter", description: "Duo of dholl puri with butter bean curry & chutney",
    basePrice: 180, buyingPrice: 55, stock: 80, initialStock: 80,
    categoryId: 'cat-0', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 5, dietaryTags: ['Vegan'], isAvailable: true, courseType: 'Snack',
    image: '/images/menu_pics/dholl-puri.webp'
  },
  {
    id: 'prod-3', name: "Gato Pima (6 pcs)", description: "Traditional Mauritian chili bites",
    basePrice: 120, buyingPrice: 30, stock: 120, initialStock: 120,
    categoryId: 'cat-0', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 8, dietaryTags: ['Vegan', 'Spicy'], isAvailable: true, courseType: 'Snack',
    image: '/images/menu_pics/gato-piman.webp'
  },
  {
    id: 'prod-13', name: "French Fries", description: "Crispy golden fries with sea salt",
    basePrice: 120, buyingPrice: 30, stock: 200, initialStock: 200,
    categoryId: 'cat-0', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 8, dietaryTags: ['Vegan', 'Gluten-Free'], isAvailable: true, courseType: 'Snack',
    image: '/images/menu_pics/french-fries.webp'
  },
  {
    id: 'prod-15', name: "Garlic Naan", description: "Freshly baked garlic & butter naan bread",
    basePrice: 90, buyingPrice: 20, stock: 150, initialStock: 150,
    categoryId: 'cat-0', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 5, dietaryTags: [], isAvailable: true, courseType: 'Snack',
    image: '/images/menu_pics/vegan-naan.webp'
  },

  // ── STARTERS ──
  {
    id: 'prod-2', name: "Crispy Calamari", description: "Lightly battered squid rings with garlic aioli",
    basePrice: 320, buyingPrice: 120, stock: 50, initialStock: 50,
    categoryId: 'cat-1', supplierId: 'sup-2', createdAt: new Date().toISOString(),
    prepTime: 10, dietaryTags: [], isAvailable: true, courseType: 'Starter',
    image: '/images/menu_pics/crispy-calamari.webp'
  },
  {
    id: 'prod-4', name: "Garden Salad", description: "Fresh greens, cherry tomatoes, cucumber & vinaigrette",
    basePrice: 190, buyingPrice: 45, stock: 60, initialStock: 60,
    categoryId: 'cat-1', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 5, dietaryTags: ['Vegan', 'Gluten-Free'], isAvailable: true, courseType: 'Starter',
    image: '/images/menu_pics/gardensalad.webp'
  },

  // ── MAIN COURSE ──
  {
    id: 'prod-5', name: "Chicken Biryani", description: "Aromatic basmati rice with spiced chicken, saffron & raita",
    basePrice: 450, buyingPrice: 150, stock: 40, initialStock: 40,
    categoryId: 'cat-2', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 25, dietaryTags: ['Spicy'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/bryani.webp'
  },
  {
    id: 'prod-6', name: "Butter Chicken Curry", description: "Creamy tomato-based chicken curry with naan",
    basePrice: 495, buyingPrice: 160, stock: 35, initialStock: 35,
    categoryId: 'cat-2', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 20, dietaryTags: [], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/butter-chicken-curry.webp'
  },
  {
    id: 'prod-7', name: "Rougaille Saucisse", description: "Mauritian sausage stew with tomato, thyme & chili",
    basePrice: 380, buyingPrice: 110, stock: 45, initialStock: 45,
    categoryId: 'cat-2', supplierId: 'sup-4', createdAt: new Date().toISOString(),
    prepTime: 20, dietaryTags: ['Spicy'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/rougail-saucisse.webp'
  },
  {
    id: 'prod-8', name: "Vegetable Fried Noodles", description: "Stir-fried egg noodles with seasonal vegetables & soy",
    basePrice: 290, buyingPrice: 70, stock: 60, initialStock: 60,
    categoryId: 'cat-2', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 12, dietaryTags: ['Vegan'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/fried-veg-noodles.webp'
  },
  {
    id: 'prod-9', name: "300g Ribeye Steak", description: "Grass-fed ribeye, chimichurri & roasted garlic butter",
    basePrice: 950, buyingPrice: 400, stock: 20, initialStock: 20,
    categoryId: 'cat-2', supplierId: 'sup-4', createdAt: new Date().toISOString(),
    prepTime: 18, dietaryTags: ['Gluten-Free'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/ribeye-steak.webp'
  },
  {
    id: 'prod-10', name: "BBQ Chicken Half", description: "Marinated half chicken, smoky BBQ glaze & coleslaw",
    basePrice: 520, buyingPrice: 180, stock: 30, initialStock: 30,
    categoryId: 'cat-2', supplierId: 'sup-4', createdAt: new Date().toISOString(),
    prepTime: 22, dietaryTags: ['Gluten-Free'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/chicken-half.webp'
  },
  {
    id: 'prod-11', name: "Grilled Fish of the Day", description: "Freshly caught, grilled with lemon butter & herbs",
    basePrice: 650, buyingPrice: 280, stock: 15, initialStock: 15,
    categoryId: 'cat-2', supplierId: 'sup-2', createdAt: new Date().toISOString(),
    prepTime: 15, dietaryTags: ['Gluten-Free'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/grilledfish.webp'
  },
  {
    id: 'prod-12', name: "Prawn Curry", description: "Tiger prawns in coconut curry with steamed rice",
    basePrice: 750, buyingPrice: 320, stock: 20, initialStock: 20,
    categoryId: 'cat-2', supplierId: 'sup-2', createdAt: new Date().toISOString(),
    prepTime: 18, dietaryTags: ['Spicy', 'Gluten-Free'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/prawncurry.webp'
  },
  {
    id: 'prod-14', name: "Steamed Rice", description: "Fluffy basmati rice side for mains",
    basePrice: 80, buyingPrice: 15, stock: 300, initialStock: 300,
    categoryId: 'cat-2', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 2, dietaryTags: ['Vegan', 'Gluten-Free'], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/steamed-white-rice.webp'
  },
  {
    id: 'prod-15', name: "Mixed Salad", description: "Fresh garden salad",
    basePrice: 90, buyingPrice: 20, stock: 150, initialStock: 150,
    categoryId: 'cat-2', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 5, dietaryTags: [], isAvailable: true, courseType: 'Main Course',
    image: '/images/menu_pics/mixed_salad.webp'
  },

  // ── DESSERTS ──
  {
    id: 'prod-16', name: "Napolitaine", description: "Classic Mauritian layered cake with jam filling",
    basePrice: 150, buyingPrice: 40, stock: 40, initialStock: 40,
    categoryId: 'cat-6', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 2, dietaryTags: [], isAvailable: true, courseType: 'Dessert',
    image: '/images/menu_pics/napolitaine.webp'
  },
  {
    id: 'prod-17', name: "Chocolate Lava Cake", description: "Warm molten chocolate cake with vanilla ice cream",
    basePrice: 280, buyingPrice: 80, stock: 25, initialStock: 25,
    categoryId: 'cat-6', supplierId: 'sup-1', createdAt: new Date().toISOString(),
    prepTime: 15, dietaryTags: [], isAvailable: true, courseType: 'Dessert',
    image: '/images/menu_pics/chocolatelavacake.webp'
  },

  // ── SOFT DRINKS ──
  {
    id: 'prod-18', name: "Fresh Lime Juice", description: "Freshly squeezed lime with mint & soda water",
    basePrice: 120, buyingPrice: 25, stock: 100, initialStock: 100,
    categoryId: 'cat-7', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 3, dietaryTags: ['Vegan'], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/lime-juice.webp'
  },
  {
    id: 'prod-19', name: "Coca-Cola (330ml)", description: "Classic Cola",
    basePrice: 80, buyingPrice: 25, stock: 200, initialStock: 200,
    categoryId: 'cat-7', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 0, dietaryTags: [], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/cocacola.webp'
  },
  {
    id: 'prod-20', name: "Alouda", description: "Traditional Mauritian milkshake with basil seeds & agar jelly",
    basePrice: 150, buyingPrice: 35, stock: 60, initialStock: 60,
    categoryId: 'cat-7', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 5, dietaryTags: [], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/alouda.webp'
  },

  // ── COCKTAILS & SPIRITS ──
  {
    id: 'prod-21', name: "Tropical Mojito", description: "White rum, passion fruit, mint, lime & soda",
    basePrice: 350, buyingPrice: 90, stock: 80, initialStock: 80,
    categoryId: 'cat-8', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 5, dietaryTags: [], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/mojito.webp'
  },
  {
    id: 'prod-22', name: "Rum Punch", description: "Signature house punch with local rum & tropical juices",
    basePrice: 300, buyingPrice: 70, stock: 80, initialStock: 80,
    categoryId: 'cat-8', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 3, dietaryTags: [], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/rum-punch.webp'
  },

  // ── BEER & WINE ──
  {
    id: 'prod-23', name: "Phoenix Beer (330ml)", description: "Local Mauritian lager",
    basePrice: 130, buyingPrice: 45, stock: 150, initialStock: 150,
    categoryId: 'cat-9', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 0, dietaryTags: [], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/phoenix.webp'
  },
  {
    id: 'prod-24', name: "House Red Wine (Glass)", description: "South African Shiraz — fruity & bold",
    basePrice: 250, buyingPrice: 80, stock: 60, initialStock: 60,
    categoryId: 'cat-9', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 1, dietaryTags: [], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/redwine-glass.webp'
  },

  // ── HOT BEVERAGES ──
  {
    id: 'prod-25', name: "Espresso", description: "Single shot of Italian espresso",
    basePrice: 90, buyingPrice: 15, stock: 200, initialStock: 200,
    categoryId: 'cat-10', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 2, dietaryTags: ['Vegan'], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/espresso.webp'
  },
  {
    id: 'prod-26', name: "Vanilla Tea", description: "Black tea infused with Mauritian vanilla",
    basePrice: 80, buyingPrice: 12, stock: 200, initialStock: 200,
    categoryId: 'cat-10', supplierId: 'sup-3', createdAt: new Date().toISOString(),
    prepTime: 3, dietaryTags: ['Vegan'], isAvailable: true, courseType: 'Beverage',
    image: '/images/menu_pics/vanilla-tea.webp'
  },
];

export const MOCK_LOCATION_PRICES: LocationPrice[] = [
  { id: 'lp-1', productId: 'prod-9', locationId: 'loc-3', price: 1100 },   // Steak premium at events
  { id: 'lp-2', productId: 'prod-23', locationId: 'loc-3', price: 180 },   // Phoenix Beer premium at events
  { id: 'lp-3', productId: 'prod-21', locationId: 'loc-3', price: 420 },   // Mojito premium at events
];

// ─── CASHIERS / POS OPERATORS ─────────────────────
export const MOCK_CASHIERS: Cashier[] = [
  { id: 'cashier-1', name: 'Priya (Floor)', pin: '1234', role: 'Floor', created_at: new Date().toISOString() },
  { id: 'cashier-2', name: 'Kevin (Bar)', pin: '0000', role: 'Bar', created_at: new Date().toISOString() },
  { id: 'cashier-3', name: 'Anais (Counter)', pin: '5678', role: 'Counter', created_at: new Date().toISOString() },
];

// ─── DEPARTMENTS ──────────────────────────────────
export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Management', description: 'Restaurant leadership & operations', staffCount: 3, budget: 350000 },
  { id: 'dept-2', name: 'Front of House (FOH)', description: 'Service, hosting & guest experience', staffCount: 8, budget: 280000 },
  { id: 'dept-3', name: 'Back of House (BOH)', description: 'Kitchen, food prep & plating', staffCount: 7, budget: 320000 },
  { id: 'dept-4', name: 'Bar', description: 'Cocktails, beverages & bar service', staffCount: 3, budget: 120000 },
  { id: 'dept-5', name: 'Operations', description: 'Cleaning, maintenance & logistics', staffCount: 4, budget: 100000 },
];

// ─── STAFF ────────────────────────────────────────
export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'staff-1', firstName: 'Jean-Marc', lastName: 'Dupont',
    email: 'jm.dupont@restaurant.mu', phone: '51112222',
    role: 'SUPER_ADMIN', departmentId: 'dept-1',
    hiredAt: '2024-01-10', isActive: true, idNumber: 'D100178345678A'
  },
  {
    id: 'staff-2', firstName: 'Sarah', lastName: 'Moonsamy',
    email: 'sarah.m@restaurant.mu', phone: '52223333',
    role: 'MANAGER', departmentId: 'dept-1', locationId: 'loc-1',
    hiredAt: '2024-03-15', isActive: true, idNumber: 'M150285312345B'
  },
  {
    id: 'staff-3', firstName: 'Ravi', lastName: 'Doorgakant',
    email: 'ravi.d@restaurant.mu', phone: '52334444',
    role: 'HEAD_CHEF', departmentId: 'dept-3', locationId: 'loc-1',
    hiredAt: '2024-02-01', isActive: true, idNumber: 'D200388456789C'
  },
  {
    id: 'staff-4', firstName: 'Marie', lastName: 'Leclerc',
    email: 'marie.l@restaurant.mu', phone: '52445555',
    role: 'SOUS_CHEF', departmentId: 'dept-3', locationId: 'loc-1',
    hiredAt: '2024-06-20', isActive: true, idNumber: 'L190590567890D'
  },
  {
    id: 'staff-5', firstName: 'Priya', lastName: 'Doorgakant',
    email: 'priya.d@restaurant.mu', phone: '52556666',
    role: 'HEAD_WAITER', departmentId: 'dept-2', locationId: 'loc-1',
    hiredAt: '2024-04-10', isActive: true, idNumber: 'D150492678901E'
  },
  {
    id: 'staff-6', firstName: 'Kevin', lastName: 'Ah-Kee',
    email: 'kevin.a@restaurant.mu', phone: '52667777',
    role: 'BARTENDER', departmentId: 'dept-4', locationId: 'loc-1',
    hiredAt: '2024-08-01', isActive: true, idNumber: 'A120394789012F'
  },
  {
    id: 'staff-7', firstName: 'Anais', lastName: 'Francois',
    email: 'anais.f@restaurant.mu', phone: '52778888',
    role: 'WAITER', departmentId: 'dept-2', locationId: 'loc-1',
    hiredAt: '2025-01-10', isActive: true, idNumber: 'F080296890123G'
  },
  {
    id: 'staff-8', firstName: 'Ibrahim', lastName: 'Doorgakant',
    email: 'ibrahim.d@restaurant.mu', phone: '52889999',
    role: 'LINE_COOK', departmentId: 'dept-3', locationId: 'loc-1',
    hiredAt: '2025-02-15', isActive: true, idNumber: 'D220198901234H'
  },
  {
    id: 'staff-9', firstName: 'Devi', lastName: 'Ramsaran',
    email: 'devi.r@restaurant.mu', phone: '52990000',
    role: 'DISHWASHER', departmentId: 'dept-5', locationId: 'loc-1',
    hiredAt: '2025-03-01', isActive: true, idNumber: 'R180500012345I'
  },
  {
    id: 'staff-10', firstName: 'Noor', lastName: 'Doorgakant',
    email: 'noor.d@restaurant.mu', phone: '53001111',
    role: 'CLEANER', departmentId: 'dept-5', locationId: 'loc-1',
    hiredAt: '2025-04-01', isActive: true, idNumber: 'D250402123456J'
  }
];

// ─── RESTAURANT COMPLIANCE ────────────────────────
export const MOCK_COMPLIANCE: ComplianceRecord[] = [
  {
    id: 'comp-1', type: 'VAT', title: 'MRA VAT Registration',
    status: 'COMPLIANT', expiryDate: '2026-12-31',
    documents: [{ name: 'VAT_Cert.pdf', url: '#' }]
  },
  {
    id: 'comp-2', type: 'FOOD_HYGIENE', title: 'Food Hygiene Certificate',
    status: 'COMPLIANT', expiryDate: '2026-09-30',
    documents: [{ name: 'Hygiene_Cert.pdf', url: '#' }]
  },
  {
    id: 'comp-3', type: 'LIQUOR_LICENSE', title: 'Liquor License — Port Louis',
    status: 'COMPLIANT', expiryDate: '2026-06-30',
    documents: [{ name: 'Liquor_License.pdf', url: '#' }]
  },
  {
    id: 'comp-4', type: 'FIRE_SAFETY', title: 'Fire Safety Inspection',
    status: 'PENDING', expiryDate: '2026-04-15',
    documents: []
  },
  {
    id: 'comp-5', type: 'HEALTH_INSPECTION', title: 'Health & Sanitation Audit',
    status: 'COMPLIANT', expiryDate: '2026-08-20',
    documents: [{ name: 'Health_Audit_Report.pdf', url: '#' }]
  },
  {
    id: 'comp-6', type: 'TRADE_LICENSE', title: 'Annual Trade License',
    status: 'PENDING', expiryDate: '2026-05-31',
    documents: []
  }
];

// ─── SAMPLE ORDERS ────────────────────────────────
const now = Date.now();
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1', locationId: 'loc-1',
    items: [
      { id: 'oi-1', productId: 'prod-5', name: 'Chicken Biryani', price: 450, quantity: 2, categoryId: 'cat-2', supplierId: 'sup-1' },
      { id: 'oi-2', productId: 'prod-23', name: 'Phoenix Beer (330ml)', price: 130, quantity: 3, categoryId: 'cat-9', supplierId: 'sup-3' },
      { id: 'oi-3', productId: 'prod-13', name: 'French Fries', price: 120, quantity: 2, categoryId: 'cat-5', supplierId: 'sup-1' },
    ],
    subtotal: 1530, vat: 229.5, total: 1759.5,
    createdAt: now - 3600000 * 1, cashierId: 'cashier-1', stationId: 'pos-1', synced: true,
    orderType: 'DINE_IN', tableNumber: 7, guestCount: 3, serverName: 'Priya'
  },
  {
    id: 'ord-2', locationId: 'loc-1',
    items: [
      { id: 'oi-4', productId: 'prod-9', name: '300g Ribeye Steak', price: 950, quantity: 1, categoryId: 'cat-3', supplierId: 'sup-4' },
      { id: 'oi-5', productId: 'prod-24', name: 'House Red Wine (Glass)', price: 250, quantity: 2, categoryId: 'cat-9', supplierId: 'sup-3' },
      { id: 'oi-6', productId: 'prod-17', name: 'Chocolate Lava Cake', price: 280, quantity: 1, categoryId: 'cat-6', supplierId: 'sup-1' },
    ],
    subtotal: 1730, vat: 259.5, total: 1989.5,
    createdAt: now - 3600000 * 2, cashierId: 'cashier-1', stationId: 'pos-1', synced: true,
    orderType: 'DINE_IN', tableNumber: 12, guestCount: 2, serverName: 'Anais'
  },
  {
    id: 'ord-3', locationId: 'loc-1',
    items: [
      { id: 'oi-7', productId: 'prod-6', name: 'Butter Chicken Curry', price: 495, quantity: 1, categoryId: 'cat-2', supplierId: 'sup-1' },
      { id: 'oi-8', productId: 'prod-14', name: 'Steamed Rice', price: 80, quantity: 1, categoryId: 'cat-5', supplierId: 'sup-1' },
      { id: 'oi-9', productId: 'prod-19', name: 'Coca-Cola (330ml)', price: 80, quantity: 2, categoryId: 'cat-7', supplierId: 'sup-3' },
    ],
    subtotal: 735, vat: 110.25, total: 845.25,
    createdAt: now - 3600000 * 4, cashierId: 'cashier-3', stationId: 'pos-1', synced: true,
    orderType: 'TAKEAWAY', serverName: 'Anais'
  },
  {
    id: 'ord-4', locationId: 'loc-1',
    items: [
      { id: 'oi-10', productId: 'prod-1', name: 'Dholl Puri Platter', price: 180, quantity: 4, categoryId: 'cat-1', supplierId: 'sup-1' },
      { id: 'oi-11', productId: 'prod-3', name: 'Gato Pima (6 pcs)', price: 120, quantity: 2, categoryId: 'cat-1', supplierId: 'sup-1' },
      { id: 'oi-12', productId: 'prod-20', name: 'Alouda', price: 150, quantity: 4, categoryId: 'cat-7', supplierId: 'sup-3' },
    ],
    subtotal: 1560, vat: 234, total: 1794,
    createdAt: now - 3600000 * 24, cashierId: 'cashier-1', stationId: 'pos-1', synced: true,
    orderType: 'DINE_IN', tableNumber: 3, guestCount: 4, serverName: 'Priya'
  },
  {
    id: 'ord-5', locationId: 'loc-1',
    items: [
      { id: 'oi-13', productId: 'prod-11', name: 'Grilled Fish of the Day', price: 650, quantity: 2, categoryId: 'cat-4', supplierId: 'sup-2' },
      { id: 'oi-14', productId: 'prod-21', name: 'Tropical Mojito', price: 350, quantity: 2, categoryId: 'cat-8', supplierId: 'sup-3' },
      { id: 'oi-15', productId: 'prod-4', name: 'Garden Salad', price: 190, quantity: 2, categoryId: 'cat-1', supplierId: 'sup-1' },
    ],
    subtotal: 2380, vat: 357, total: 2737,
    createdAt: now - 3600000 * 24 * 2, cashierId: 'cashier-1', stationId: 'pos-1', synced: true,
    orderType: 'DINE_IN', tableNumber: 1, guestCount: 2, serverName: 'Priya'
  },
  {
    id: 'ord-6', locationId: 'loc-2',
    items: [
      { id: 'oi-16', productId: 'prod-10', name: 'BBQ Chicken Half', price: 520, quantity: 2, categoryId: 'cat-3', supplierId: 'sup-4' },
      { id: 'oi-17', productId: 'prod-13', name: 'French Fries', price: 120, quantity: 2, categoryId: 'cat-5', supplierId: 'sup-1' },
      { id: 'oi-18', productId: 'prod-23', name: 'Phoenix Beer (330ml)', price: 130, quantity: 4, categoryId: 'cat-9', supplierId: 'sup-3' },
    ],
    subtotal: 1800, vat: 270, total: 2070,
    createdAt: now - 3600000 * 3, cashierId: 'cashier-2', stationId: 'pos-2', synced: true,
    orderType: 'DINE_IN', tableNumber: 5, guestCount: 4, serverName: 'Kevin'
  },
];
