
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Product, 
  OrderItem, 
  Order, 
  Supplier, 
  Cashier, 
  ActiveShift, 
  ActiveAdmin, 
  Category, 
  Location, 
  CashierRole,
  BusinessProfile,
  LocationPrice,
  SimulatedRole,
  SimulatedUser,
  StaffMember,
  Department,
  ComplianceRecord
} from './types';
import { 
  MOCK_BUSINESS, 
  MOCK_SUPPLIERS, 
  MOCK_PRODUCTS, 
  MOCK_CASHIERS, 
  MOCK_LOCATIONS, 
  MOCK_CATEGORIES, 
  MOCK_LOCATION_PRICES,
  MOCK_STAFF,
  MOCK_DEPARTMENTS,
  MOCK_COMPLIANCE,
  MOCK_ORDERS
} from './mock-data';

interface AppState {
  _hasHydrated: boolean;
  businessProfile: BusinessProfile;
  suppliers: Supplier[];
  products: Product[];
  categories: Category[];
  cashiers: Cashier[];
  locations: Location[];
  locationPrices: LocationPrice[];
  activeLocation: Location | null;
  currentOrder: OrderItem[];
  completedOrders: Order[];
  lastCompletedOrder: Order | null;
  isReportingDone: boolean;
  activeShift: ActiveShift | null;
  activeAdmin: ActiveAdmin | null;
  simulatedUser: SimulatedUser | null;
  staff: StaffMember[];
  departments: Department[];
  complianceRecords: ComplianceRecord[];

  // Actions
  setSimulatedRole: (role: SimulatedRole) => void;
  fetchBusinessProfile: () => Promise<void>;
  fetchSuppliers: (force?: boolean) => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCashiers: (force?: boolean) => Promise<void>;
  fetchLocations: (force?: boolean) => Promise<void>;
  fetchLocationPrices: () => Promise<void>;
  fetchStaff: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  fetchCompliance: () => Promise<void>;
  fetchCompletedOrders: () => Promise<void>;

  startShift: (locationId: string, cashierId: string, pin: string, floatAmount: number) => Promise<boolean>;
  logoutShift: () => void;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  addProductToOrder: (product: Product) => void;
  removeProductFromOrder: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearCurrentOrder: () => void;
  clearCompletedOrders: () => void;
  completeOrder: () => Promise<void>;
  setLastCompletedOrder: (order: Order | null) => void;
  
  // Management
  updateBusinessProfile: (data: BusinessProfile) => Promise<void>;
  addSupplier: (data: Omit<Supplier, 'id' | 'createdAt'>) => Promise<string>;
  editSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  
  addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  editProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addCategory: (data: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  addLocation: (data: Omit<Location, 'id' | 'createdAt' | 'isActive'>) => Promise<string>;
  setActiveLocation: (id: string) => Promise<void>;
  
  setLocationPrice: (productId: string, locationId: string, price: number) => Promise<void>;
  getProductPrice: (productId: string, locationId: string) => number;

  addCashier: (name: string, pin: string, role: CashierRole) => Promise<boolean>;
  editCashier: (id: string, data: Partial<Cashier>) => Promise<boolean>;
  
  addStock: (productId: string, quantity: number) => Promise<void>;
  setReportingDone: (isDone: boolean) => void;
  
  // Staff & Org Actions
  addStaff: (data: Omit<StaffMember, 'id'>) => Promise<void>;
  editStaff: (id: string, data: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  addDepartment: (data: Omit<Department, 'id'>) => Promise<void>;
  editDepartment: (id: string, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  addComplianceRecord: (data: Omit<ComplianceRecord, 'id'>) => Promise<void>;
  editComplianceRecord: (id: string, data: Partial<ComplianceRecord>) => Promise<void>;
  deleteComplianceRecord: (id: string) => Promise<void>;
  editLocation: (id: string, data: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      businessProfile: MOCK_BUSINESS,
      suppliers: [],
      products: [],
      categories: [],
      cashiers: [],
      locations: [],
      locationPrices: [],
      activeLocation: null,
      currentOrder: [],
      completedOrders: [],
      lastCompletedOrder: null,
      isReportingDone: false,
      activeShift: null,
      activeAdmin: null,
      simulatedUser: { id: 'sim-1', name: 'Demo User', email: 'demo@cashierlite.mu', role: 'SUPER_ADMIN' },
      staff: [],
      departments: [],
      complianceRecords: [],

      setSimulatedRole: (role) => set(state => ({
        simulatedUser: state.simulatedUser ? { ...state.simulatedUser, role } : null
      })),

      fetchBusinessProfile: async () => {
        // Only load mock if name is explicitly empty (fresh start)
        if (!get().businessProfile.name) {
          set({ businessProfile: MOCK_BUSINESS });
        }
      },

      fetchSuppliers: async (force = false) => {
        if (!force && get().suppliers.length > 0) return;
        set({ suppliers: MOCK_SUPPLIERS });
      },

      fetchProducts: async () => {
        // In real app, this would fetch from DB
        if (get().products.length === 0) {
            set({ products: MOCK_PRODUCTS });
        }
      },

      fetchCategories: async () => {
        set({ categories: MOCK_CATEGORIES });
      },

      fetchCashiers: async (force = false) => {
        if (!force && get().cashiers.length > 0) return;
        set({ cashiers: MOCK_CASHIERS });
      },

      fetchLocations: async (force = false) => {
        if (!force && get().locations.length > 0) return;
        // Only set mock locations if we don't have any
        if (get().locations.length === 0) {
          set({ locations: MOCK_LOCATIONS, activeLocation: MOCK_LOCATIONS[0] });
        }
      },

      fetchLocationPrices: async () => {
        set({ locationPrices: MOCK_LOCATION_PRICES });
      },

      fetchStaff: async () => {
        if (get().staff.length === 0) set({ staff: MOCK_STAFF });
      },

      fetchDepartments: async () => {
        if (get().departments.length === 0) set({ departments: MOCK_DEPARTMENTS });
      },

      fetchCompliance: async () => {
        if (get().complianceRecords.length === 0) set({ complianceRecords: MOCK_COMPLIANCE });
      },

      fetchCompletedOrders: async () => {
        if (get().completedOrders.length === 0) set({ completedOrders: MOCK_ORDERS });
      },

      getProductPrice: (productId: string, locationId: string) => {
        const lp = get().locationPrices.find(p => p.productId === productId && p.locationId === locationId);
        if (lp) return lp.price;
        const prod = get().products.find(p => p.id === productId);
        return prod?.basePrice || 0;
      },

      startShift: async (locationId: string, cashierId: string, pin: string, floatAmount: number) => {
        const cashier = get().cashiers.find(c => c.id === cashierId);
        if (!cashier || cashier.pin !== pin) return false;
        
        set({ 
            activeShift: {
                stationId: 'pos-1',
                locationId,
                cashierId,
                cashierName: cashier.name,
                floatAmount,
                startTime: new Date().toISOString(),
                role: cashier.role
            },
            activeAdmin: null,
            currentOrder: [],
            isReportingDone: false
         });
        return true;
      },

      logoutShift: () => set({ activeShift: null }),

      adminLogin: async (email, password) => {
        set({ activeAdmin: { id: 'admin-1', email }, activeShift: null });
        return { success: true };
      },

      adminLogout: () => set({ activeAdmin: null }),

      addProductToOrder: (product) => {
        const { currentOrder, activeShift, getProductPrice } = get();
        if (!activeShift) return;

        const price = getProductPrice(product.id, activeShift.locationId);
        const existing = currentOrder.find(item => item.productId === product.id);

        if (existing) {
          set({
            currentOrder: currentOrder.map(item =>
              item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
        } else {
          set({
            currentOrder: [...currentOrder, {
              id: `oi-${Date.now()}`,
              productId: product.id,
              name: product.name,
              price,
              quantity: 1,
              categoryId: product.categoryId,
              supplierId: product.supplierId
            }]
          });
        }
      },

      removeProductFromOrder: (productId) => {
        set({ currentOrder: get().currentOrder.filter(item => item.productId !== productId) });
      },

      updateProductQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeProductFromOrder(productId);
        } else {
          set({
            currentOrder: get().currentOrder.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            )
          });
        }
      },

      clearCurrentOrder: () => set({ currentOrder: [] }),

      clearCompletedOrders: () => set({ completedOrders: [], isReportingDone: false }),

      completeOrder: async () => {
        const { currentOrder, activeShift } = get();
        if (!currentOrder.length || !activeShift) return;

        const subtotal = currentOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const vat = subtotal * 0.15; // Placeholder VAT logic
        const total = subtotal + vat;

        const newOrder: Order = {
          id: `order-${Date.now()}`,
          locationId: activeShift.locationId,
          items: [...currentOrder],
          subtotal,
          vat,
          total,
          createdAt: Date.now(),
          cashierId: activeShift.cashierId,
          stationId: activeShift.stationId,
          synced: false
        };

        // Update stock locally
        set(state => ({
          completedOrders: [...state.completedOrders, newOrder],
          lastCompletedOrder: newOrder,
          currentOrder: [],
          products: state.products.map(p => {
            const item = currentOrder.find(oi => oi.productId === p.id);
            return item ? { ...p, stock: p.stock - item.quantity } : p;
          })
        }));
      },

      setLastCompletedOrder: (order) => set({ lastCompletedOrder: order }),

      updateBusinessProfile: async (data) => set({ businessProfile: data }),

      addSupplier: async (data) => {
        const id = `sup-${Date.now()}`;
        const newSup = { ...data, id, createdAt: new Date().toISOString() };
        set(state => ({ suppliers: [...state.suppliers, newSup] }));
        return id;
      },

      editSupplier: async (id, data) => {
        set(state => ({ suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...data } : s) }));
      },

      deleteSupplier: async (id) => {
        set(state => ({ suppliers: state.suppliers.filter(s => s.id !== id) }));
      },

      addProduct: async (data) => {
        const newProd = { 
          ...data, 
          id: `prod-${Date.now()}`, 
          initialStock: data.stock,
          createdAt: new Date().toISOString() 
        };
        set(state => ({ products: [...state.products, newProd] }));
        return newProd;
      },

      editProduct: async (id, data) => {
        set(state => ({ products: state.products.map(p => p.id === id ? { ...p, ...data } : p) }));
      },

      deleteProduct: async (id) => {
        set(state => ({ products: state.products.filter(p => p.id !== id) }));
      },

      addCategory: async (data) => {
        set(state => ({ categories: [...state.categories, { ...data, id: `cat-${Date.now()}` }] }));
      },

      deleteCategory: async (id) => {
        set(state => ({ categories: state.categories.filter(c => c.id !== id) }));
      },

      addLocation: async (data) => {
        const id = `loc-${Date.now()}`;
        set(state => ({ 
          locations: [...state.locations, { ...data, id, createdAt: new Date().toISOString(), isActive: true }] 
        }));
        return id;
      },

      setActiveLocation: async (id) => {
        const loc = get().locations.find(l => l.id === id);
        if (loc) set({ activeLocation: loc });
      },

      setLocationPrice: async (productId, locationId, price) => {
        set(state => ({
          locationPrices: [
            ...state.locationPrices.filter(lp => !(lp.productId === productId && lp.locationId === locationId)),
            { id: `lp-${Date.now()}`, productId, locationId, price }
          ]
        }));
      },

      addCashier: async (name, pin, role) => {
        set(state => ({
          cashiers: [...state.cashiers, { id: `c-${Date.now()}`, name, pin, role, created_at: new Date().toISOString() }]
        }));
        return true;
      },

      editCashier: async (id, data) => {
        set(state => ({ cashiers: state.cashiers.map(c => c.id === id ? { ...c, ...data } : c) }));
        return true;
      },

      addStock: async (productId, quantity) => {
        set(state => ({
            products: state.products.map(p => p.id === productId ? { ...p, stock: p.stock + quantity } : p)
        }));
      },

      setReportingDone: (isDone) => set({ isReportingDone: isDone }),

      addStaff: async (data) => {
        set(state => ({ staff: [...state.staff, { ...data, id: `staff-${Date.now()}` }] }));
      },

      editStaff: async (id, data) => {
        set(state => ({ staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s) }));
      },

      deleteStaff: async (id) => {
        set(state => ({ staff: state.staff.filter(s => s.id !== id) }));
      },

      addDepartment: async (data) => {
        set(state => ({ departments: [...state.departments, { ...data, id: `dept-${Date.now()}` }] }));
      },

      editDepartment: async (id, data) => {
        set(state => ({ departments: state.departments.map(d => d.id === id ? { ...d, ...data } : d) }));
      },

      deleteDepartment: async (id) => {
        set(state => ({ departments: state.departments.filter(d => d.id !== id) }));
      },

      addComplianceRecord: async (data) => {
        set(state => ({ complianceRecords: [...state.complianceRecords, { ...data, id: `comp-${Date.now()}` }] }));
      },

      editComplianceRecord: async (id, data) => {
        set(state => ({ complianceRecords: state.complianceRecords.map(r => r.id === id ? { ...r, ...data } : r) }));
      },

      deleteComplianceRecord: async (id) => {
        set(state => ({ complianceRecords: state.complianceRecords.filter(r => r.id !== id) }));
      },

      editLocation: async (id, data) => {
        set(state => ({ locations: state.locations.map(l => l.id === id ? { ...l, ...data } : l) }));
      },

      deleteLocation: async (id) => {
        set(state => ({ locations: state.locations.filter(l => l.id !== id) }));
      },
    }),
    {
      name: 'fids-cashier-lite-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
      partialize: (state) => ({ 
        businessProfile: state.businessProfile,
        suppliers: state.suppliers,
        products: state.products,
        categories: state.categories,
        locationPrices: state.locationPrices,
        completedOrders: state.completedOrders,
        cashiers: state.cashiers,
        activeShift: state.activeShift,
        activeAdmin: state.activeAdmin,
        isReportingDone: state.isReportingDone,
        locations: state.locations,
        activeLocation: state.activeLocation,
        simulatedUser: state.simulatedUser,
        staff: state.staff,
        departments: state.departments,
        complianceRecords: state.complianceRecords
      }),
    }
  )
);