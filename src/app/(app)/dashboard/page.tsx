
'use client';

import AddCashierDialog from '@/components/add-cashier-dialog';
import AddLocationDialog from '@/components/add-location-dialog';
import AddProductDialog from '@/components/add-product-dialog';
import { useStore } from '@/lib/store';
import { 
  Building, 
  DollarSign, 
  PlusCircle, 
  Users, 
  AppWindow, 
  MapPin, 
  Package, 
  LayoutDashboard 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Cashier } from '@/lib/types';
import AddSupplierDialog from '@/components/add-supplier-dialog';
import ManagementCard from '@/components/management-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import UnifiedProductView from '@/components/unified-product-view';
import OrderSummary from '@/components/order-summary';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import ReceiptDialog from '@/components/receipt-dialog';
import { useRouter } from 'next/navigation';
import EditCashierDialog from '@/components/edit-cashier-dialog';
import ManageCategoryRolesDialog from '@/components/manage-category-roles-dialog';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import SuperAdminOverview from '@/components/super-admin-overview';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { 
    activeAdmin, 
    locations,
    suppliers,
    cashiers,
    products,
    fetchLocations,
    fetchSuppliers,
    fetchCashiers,
    fetchProducts,
    fetchCategories,
    lastCompletedOrder,
    setLastCompletedOrder,
    activeShift,
    simulatedUser,
    completedOrders,
    staff,
    activeLocation,
    fetchBusinessProfile,
  } = useStore();
  
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isAddCashierOpen, setIsAddCashierOpen] = useState(false);
  const [isEditCashierOpen, setIsEditCashierOpen] = useState(false);
  const [cashierToEdit, setCashierToEdit] = useState<Cashier | null>(null);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isAddTenantOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  const isReceiptOpen = !!lastCompletedOrder;
  const setReceiptOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setLastCompletedOrder(null);
    }
  };

  useEffect(() => {
    setIsClient(true);
    
    const loadData = async () => {
      setIsLoading(true);
      const promises = [
        fetchBusinessProfile(),
        fetchLocations(true),
        fetchSuppliers(true),
        fetchCategories(true),
        fetchCashiers(true),
        fetchProducts(true)
      ];
      await Promise.all(promises);
      setIsLoading(false);
    };

    loadData();
  }, [activeAdmin, activeShift, fetchLocations, fetchSuppliers, fetchCashiers, fetchProducts, fetchCategories, fetchBusinessProfile]);

  if (!isClient || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-bold tracking-widest uppercase text-xs">Loading Dashboard...</p>
      </div>
    );
  }

  // ─── ROLE-BASED RENDERING LOGIC ──────────────────
  const isSuperAdmin = simulatedUser?.role === 'SUPER_ADMIN';
  const isAdmin = simulatedUser?.role === 'ADMIN';

  // 1. CASHIER VIEW (Active Shift)
  // Anyone in an active shift (including an Admin covering for a cashier) sees the POS.
  if (activeShift) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full p-4">
        <div className="lg:col-span-5">
          <UnifiedProductView />
        </div>
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <OrderSummary />
          </Card>
        </div>
        <ReceiptDialog isOpen={isReceiptOpen} onOpenChange={setReceiptOpen} order={lastCompletedOrder} />
      </div>
    );
  }

  // 2. SUPER ADMIN VIEW
  if (isSuperAdmin) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          <SuperAdminOverview />
        </main>
      </div>
    );
  }

  // 3. ADMIN (OUTLET MANAGER) VIEW
  if (activeAdmin || isAdmin) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const localOrders = completedOrders.filter((o: any) => o.createdAt >= todayStart.getTime());
    const localRevenue = localOrders.reduce((acc: number, o: any) => acc + o.total, 0);
    const activeStaffCount = staff.filter((s: any) => s.isActive).length;

    return (
      <div className="flex-1 flex flex-col items-start p-8 gap-8 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
            <p className="text-muted-foreground mt-2">Consolidated operations overview for your outlet.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 text-center min-w-[120px]">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Today's Sales</p>
              <p className="text-xl font-bold text-emerald-950">Rs {localRevenue.toLocaleString()}</p>
            </div>
            <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 text-center min-w-[120px]">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Active Staff</p>
              <p className="text-xl font-bold text-blue-950">{activeStaffCount}</p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ManagementCard
            title="Location"
            description="Manage your specific outlet status"
            icon={<MapPin className="text-blue-500" />}
            actionButton={<Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">ACTIVE</Badge>}
            onViewAll={() => setIsAddLocationOpen(true)}
            isLoading={isLoading}
          >
            {locations.slice(0, 1).map(loc => (
              <li key={loc.id} className="text-sm font-medium">{loc.name}</li>
            ))}
            <li className="text-xs text-muted-foreground mt-2 list-none">{activeLocation?.address}</li>
          </ManagementCard>
          
          <ManagementCard
            title="Orders Today"
            description={`${localOrders.length} tickets generated`}
            icon={<DollarSign className="text-emerald-500" />}
            actionButton={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/reports">Details</Link>
              </Button>
            }
            onViewAll={() => router.push('/reports')}
            isLoading={isLoading}
          >
            <div className="space-y-2 mt-2">
              <p className="text-sm font-medium">Avg Ticket: Rs {localOrders.length ? Math.round(localRevenue/localOrders.length) : 0}</p>
              <p className="text-xs text-muted-foreground">{localOrders.filter((o: any) => !o.synced).length} pending sync</p>
            </div>
          </ManagementCard>
          
          <ManagementCard
            title="Staff on Duty"
            description="Floor & Kitchen Team"
            icon={<Users className="text-purple-500" />}
            actionButton={
              <Button variant="outline" size="sm" onClick={() => setIsAddCashierOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            }
            onViewAll={() => router.push('/dashboard/hr')}
            isLoading={isLoading}
          >
            {cashiers.slice(0, 3).map(cashier => (
              <li key={cashier.id} className="text-sm text-muted-foreground truncate">{cashier.name} ({cashier.role})</li>
            ))}
          </ManagementCard>
          
          <ManagementCard
            title="Quick Stock"
            description="Low stock alerts"
            icon={<Package className="text-orange-500" />}
            actionButton={
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/inventory')}>
                Manage
              </Button>
            }
            onViewAll={() => router.push('/dashboard/inventory')}
            isLoading={isLoading}
          >
            {products.filter(p => p.stock < 20).slice(0, 2).map(product => (
              <li key={product.id} className="text-sm text-amber-600 font-medium truncate">{product.name}: {product.stock} left</li>
            ))}
            {products.filter(p => p.stock < 20).length === 0 && <li className="text-sm text-emerald-600">All stocks healthy</li>}
          </ManagementCard>
        </div>

        <div className="w-full grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Category Access Rules</CardTitle>
              <CardDescription>Configure which staff roles can access specific menu sections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-dashed">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border">
                    <AppWindow className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-semibold italic font-serif">"Menu segmentation is active"</p>
                    <p className="text-xs text-muted-foreground">Bar role restricted to Drinks menu by default.</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsManageCategoriesOpen(true)}>
                  Modify Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <CardTitle className="text-sm">Quick Jump</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/login">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Replace a Cashier
                </Link>
              </Button>
              <Button variant="outline" className="justify-start text-muted-foreground" disabled>
                <Building className="mr-2 h-4 w-4" />
                Inventory Audit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialogs */}
        <AddCashierDialog isOpen={isAddCashierOpen} onOpenChange={setIsAddCashierOpen} />
        {cashierToEdit && (
          <EditCashierDialog 
              isOpen={isEditCashierOpen} 
              onOpenChange={setIsEditCashierOpen} 
              cashier={cashierToEdit} 
          />
        )}
        <AddLocationDialog isOpen={isAddLocationOpen} onOpenChange={setIsAddLocationOpen} />
        <AddSupplierDialog isOpen={isAddTenantOpen} onOpenChange={setIsAddSupplierOpen} />
        <AddProductDialog isOpen={isAddProductOpen} onOpenChange={setIsAddProductOpen} />
        <ManageCategoryRolesDialog isOpen={isManageCategoriesOpen} onOpenChange={setIsManageCategoriesOpen} />
        <ReceiptDialog isOpen={isReceiptOpen} onOpenChange={setReceiptOpen} order={lastCompletedOrder} />
      </div>
    );
  }

  // 4. CASHIER VIEW (Default)
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full p-4">
      <div className="lg:col-span-5">
        <UnifiedProductView />
      </div>
      <div className="lg:col-span-2">
        <Card className="sticky top-24">
          <OrderSummary />
        </Card>
      </div>
      <ReceiptDialog isOpen={isReceiptOpen} onOpenChange={setReceiptOpen} order={lastCompletedOrder} />
    </div>
  );
}
