
'use client';

import { useStore } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AllTenantsReport() {
  const { suppliers: tenants, completedOrders, fetchSuppliers: fetchTenants } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const tenantReports = (tenants || [])
    .map((tenant) => {
      let revenueForTenant = 0;
      let orderCountForTenant = 0;

      completedOrders.forEach(order => {
        const itemsForTenant = order.items.filter(item => item.supplierId === tenant.id);
        if (itemsForTenant.length > 0) {
          orderCountForTenant++;
          revenueForTenant += itemsForTenant.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
      });

      // Use the dynamic revenue share percentage, with a fallback to 70%
      const tenantSharePercentage = tenant.revenue_share_percentage ?? 70.00;
      const tenantShare = revenueForTenant * (tenantSharePercentage / 100);
      const organizerShare = revenueForTenant - tenantShare;
      
      return {
        id: tenant.id,
        name: tenant.name,
        orderCount: orderCountForTenant,
        totalRevenue: revenueForTenant,
        tenantShare: tenantShare,
        organizerShare: organizerShare,
        sharePercentage: tenantSharePercentage,
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant ID</TableHead>
              <TableHead>Tenant Name</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Gross Revenue</TableHead>
              <TableHead className="text-right">Tenant Share</TableHead>
              <TableHead className="text-right">Organizer Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenantReports.map((report) => (
              <TableRow key={report.id} onClick={() => router.push(`/reports/${report.id}`)} className="cursor-pointer">
                <TableCell>{report.id}</TableCell>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell className="text-right">{report.orderCount}</TableCell>
                <TableCell className="text-right font-mono">
                  Rs {report.totalRevenue.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  Rs {report.tenantShare.toFixed(2)} ({report.sharePercentage.toFixed(2)}%)
                </TableCell>
                <TableCell className="text-right font-mono">
                  Rs {report.organizerShare.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {tenantReports.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No sales data available.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
