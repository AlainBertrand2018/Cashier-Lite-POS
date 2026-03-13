
'use client';

import { useStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TenantReport from '@/components/tenant-report';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TenantReportPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  
  const { suppliers: tenants, products, completedOrders, fetchSuppliers: fetchTenants, fetchProducts } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchTenants();
    fetchProducts();
  }, [fetchTenants, fetchProducts]);

  const tenant = (tenants || []).find(t => t.id === tenantId);
  
  // Filter for orders that contain at least one item from this tenant
  const tenantOrders = completedOrders
    .filter(o => o.items.some(item => item.supplierId === tenantId))
    .map(o => ({
      ...o,
      // For the report, we only care about the items from this specific tenant
      items: o.items.filter(item => item.supplierId === tenantId),
      // Recalculate total for this tenant's portion
      total: o.items.filter(item => item.supplierId === tenantId).reduce((sum, i) => sum + (i.price * i.quantity), 0)
    }));
    
  const tenantProducts = products.filter(p => p.supplierId === tenantId);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading report...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>Tenant not found.</p>
        <Button asChild variant="outline">
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Reports
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/reports/all-tenants">
            <ArrowLeft />
            <span className="sr-only">Back to All Reports</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Sales Report</h1>
          <p className="text-muted-foreground">Detailed report for {tenant.name}</p>
        </div>
      </div>
      <TenantReport tenant={tenant} orders={tenantOrders} products={tenantProducts} />
    </div>
  );
}
