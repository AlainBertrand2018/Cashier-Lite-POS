
'use client';

import AddCashierDialog from '@/components/add-cashier-dialog';
import AddLocationDialog from '@/components/add-location-dialog';
import AddProductDialog from '@/components/add-product-dialog';
import { useStore } from '@/lib/store';
import { Building, Calendar, DollarSign, PlusCircle, Users, Edit, AppWindow, MapPin, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Cashier, Location, Product, Supplier, Category } from '@/lib/types';
import AddSupplierDialog from '@/components/add-supplier-dialog';
import ManagementCard from '@/components/management-card';
import { Button } from '@/components/ui/button';
import ViewAllDialog from '@/components/view-all-dialog';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import UnifiedProductView from '@/components/unified-product-view';
import OrderSummary from '@/components/order-summary';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReceiptDialog from '@/components/receipt-dialog';
import { useRouter } from 'next/navigation';
import EditCashierDialog from '@/components/edit-cashier-dialog';
import ManageCategoryRolesDialog from '@/components/manage-category-roles-dialog';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import SuperAdminOverview from '@/components/super-admin-overview';


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
    setActiveLocation,
    lastCompletedOrder,
    setLastCompletedOrder,
    activeShift,
    simulatedUser,
  } = useStore();
  
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


  // View All Dialog states
  const [viewAllTitle, setViewAllTitle] = useState('');
  const [viewAllData, setViewAllData] = useState<any[]>([]);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

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
        fetchLocations(true),
        fetchSuppliers(true),
        fetchCategories(),
        fetchCashiers(true),
        fetchProducts()
      ];
      await Promise.all(promises);
      setIsLoading(false);
    };

    loadData();
  }, [activeAdmin, activeShift, fetchLocations, fetchSuppliers, fetchCashiers, fetchProducts, fetchCategories]);

  const handleToggleActive = (locationId: string | undefined | null, newIsActive: boolean) => {
    if (locationId) {
      // Logic to toggle location activity could go here
      console.log(`Toggling location ${locationId} to ${newIsActive}`);
    }
  };

  const handleEditCashier = (cashier: Cashier) => {
    setCashierToEdit(cashier);
    setIsEditCashierOpen(true);
  }

  const handleViewAll = (title: string, data: any[], renderItem: (item: any) => React.ReactNode) => {
    setViewAllTitle(title);
    setViewAllData(data.map(item => ({ key: item.id, content: renderItem(item) })));
    setIsViewAllOpen(true);
  };
  
  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'N/A';
  };


  if (!isClient || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Define roles for readability
  const isSuperAdmin = simulatedUser?.role === 'SUPER_ADMIN';
  const isAdmin = simulatedUser?.role === 'ADMIN';
  const isCashier = simulatedUser?.role === 'CASHIER';

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

  return (
    <>
      <div className="flex-1 flex flex-col items-start p-4 gap-8">
        {activeAdmin ? (
          <>
            <div className="w-full">
               <div className="flex justify-start items-center mb-2 gap-4">
                  <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                </div>
                <p className="text-muted-foreground">Manage locations, suppliers, and cashiers.</p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Location Management Card */}
              <ManagementCard
                title="Locations"
                description={`${locations.length} total locations`}
                icon={<MapPin />}
                actionButton={
                  <Button variant="outline" size="sm" onClick={() => setIsAddLocationOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                  </Button>
                }
                onViewAll={() => handleViewAll('All Locations', locations, (item: Location) => 
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span>{item.name}</span>
                      <p className="text-xs text-muted-foreground">{item.type} {item.startDate ? `• ${new Date(item.startDate).toLocaleDateString()}` : ''}</p>
                    </div>
                     <Switch
                        checked={item.isActive}
                        onCheckedChange={(checked) => handleToggleActive(item.id, checked)}
                        aria-label={`Activate ${item.name}`}
                      />
                  </div>
                )}
                isLoading={isLoading}
              >
                {locations.slice(0, 3).map(location => (
                  <li key={location.id} className="text-sm text-muted-foreground">{location.name}</li>
                ))}
              </ManagementCard>
              
              {/* Supplier Management Card */}
              <ManagementCard
                title="Suppliers"
                description={`${suppliers.length} total suppliers`}
                icon={<Building />}
                actionButton={
                  <Button variant="outline" size="sm" onClick={() => setIsAddSupplierOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Supplier
                  </Button>
                }
                 onViewAll={() => handleViewAll('All Suppliers', suppliers, (item: Supplier) => 
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">ID: {item.id}</span>
                  </div>
                )}
                isLoading={isLoading}
              >
                {suppliers.slice(0, 3).map(supplier => (
                  <li key={supplier.id} className="text-sm text-muted-foreground">{supplier.name}</li>
                ))}
              </ManagementCard>
              
              {/* Product Management Card */}
              <ManagementCard
                title="Products"
                description={`${products.length} total products`}
                icon={<DollarSign />}
                actionButton={
                  <Button asChild variant="outline" size="sm">
                    <Link href="#tenant-grid">
                      Add Product
                    </Link>
                  </Button>
                }
                 onViewAll={() => handleViewAll('All Products', products, (item: Product) => 
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span>{item.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {getSupplierName(item.supplierId)} • Rs {item.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md">Stock: {item.stock}</span>
                  </div>
                )}
                isLoading={isLoading}
              >
                 {products.slice(0, 3).map(product => (
                  <li key={product.id} className="text-sm text-muted-foreground">{product.name}</li>
                ))}
              </ManagementCard>
              
              {/* Cashier Management Card */}
              <ManagementCard
                title="Cashiers"
                description={`${cashiers.length} total cashiers`}
                icon={<Users />}
                actionButton={
                  <Button variant="outline" size="sm" onClick={() => setIsAddCashierOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Cashier
                  </Button>
                }
                 onViewAll={() => handleViewAll('All Cashiers', cashiers, (item: Cashier) => 
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span>{item.name}</span>
                      <p className="text-xs text-muted-foreground">Role: {item.role}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCashier(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                  </div>
                )}
                isLoading={isLoading}
              >
                 {cashiers.slice(0, 3).map(cashier => (
                  <li key={cashier.id} className="text-sm text-muted-foreground">{cashier.name}</li>
                ))}
              </ManagementCard>
            </div>
             {/* Category Role Management */}
             <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted p-3 rounded-lg">
                                <AppWindow />
                            </div>
                            <div>
                                <CardTitle>Category Management</CardTitle>
                                <CardDescription>Assign which cashier roles can see which product categories.</CardDescription>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setIsManageCategoriesOpen(true)}>
                            Manage Roles
                        </Button>
                    </div>
                </CardHeader>
             </Card>
            <div id="catalog-grid" className="w-full">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Inventory Management</h2>
                <p className="text-muted-foreground mb-4">View and manage products across categories.</p>
                <div className="bg-muted/50 p-8 text-center rounded-xl border-2 border-dashed">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-4">Manage your products and their categories here.</p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setIsAddProductOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/products">View All Products</Link>
                    </Button>
                  </div>
                </div>
            </div>
          </>
        ) : isCashier || (!activeAdmin && !isSuperAdmin && !isAdmin) ? (
          // Cashier View
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full">
            <div className="lg:col-span-5">
               <UnifiedProductView />
            </div>
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <OrderSummary />
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] w-full gap-4">
            <p className="text-muted-foreground text-lg">You do not have access to this dashboard view.</p>
            <Button asChild><Link href="/">Go to Home</Link></Button>
          </div>
        )}
      </div>
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
       <ViewAllDialog 
        isOpen={isViewAllOpen}
        onOpenChange={setIsViewAllOpen}
        title={viewAllTitle}
        items={viewAllData}
      />
      <ReceiptDialog 
        isOpen={isReceiptOpen}
        onOpenChange={setReceiptOpen}
        order={lastCompletedOrder}
      />
    </>
  );
}
