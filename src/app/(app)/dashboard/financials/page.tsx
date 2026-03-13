'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Calendar,
  UtensilsCrossed,
  Users2,
  Clock
} from 'lucide-react';
import { useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Badge } from '@/components/ui/badge';

export default function RevenuePage() {
  const { 
    completedOrders,
    products,
    categories,
    locations,
    fetchCompletedOrders,
    fetchProducts,
    fetchCategories,
    fetchLocations,
    simulatedUser
  } = useStore();

  useEffect(() => {
    fetchCompletedOrders();
    fetchProducts();
    fetchCategories();
    fetchLocations();
  }, []);

  if (simulatedUser?.role !== 'SUPER_ADMIN') {
    return <div className="p-20 text-center">Unauthorized Access</div>;
  }

  // ─── Revenue Calculations ──────────────────────
  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.total, 0);
  const totalCost = completedOrders.reduce((acc, o) => {
    return acc + o.items.reduce((itemAcc, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemAcc + (product?.buyingPrice || 0) * item.quantity;
    }, 0);
  }, 0);
  const grossProfit = totalRevenue - totalCost;
  const marginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';
  const totalVat = completedOrders.reduce((acc, o) => acc + o.vat, 0);
  const totalCovers = completedOrders.reduce((acc, o) => acc + (o.guestCount || 1), 0);
  const avgTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Revenue by category
  const catRevenue: Record<string, { name: string; icon: string; revenue: number }> = {};
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const cat = categories.find(c => c.id === item.categoryId);
      const catName = cat?.name || 'Other';
      if (!catRevenue[catName]) catRevenue[catName] = { name: catName, icon: cat?.icon || '🍴', revenue: 0 };
      catRevenue[catName].revenue += item.price * item.quantity;
    });
  });
  const catRevenueList = Object.values(catRevenue).sort((a, b) => b.revenue - a.revenue);
  const maxCatRevenue = catRevenueList[0]?.revenue || 1;

  // Revenue by location
  const locRevenue: Record<string, { name: string; revenue: number; orders: number }> = {};
  completedOrders.forEach(order => {
    const loc = locations.find(l => l.id === order.locationId);
    const locName = loc?.name || order.locationId;
    if (!locRevenue[order.locationId]) locRevenue[order.locationId] = { name: locName, revenue: 0, orders: 0 };
    locRevenue[order.locationId].revenue += order.total;
    locRevenue[order.locationId].orders += 1;
  });
  const locRevenueList = Object.values(locRevenue).sort((a, b) => b.revenue - a.revenue);
  const maxLocRevenue = locRevenueList[0]?.revenue || 1;

  // Order type breakdown
  const dineIn = completedOrders.filter(o => o.orderType === 'DINE_IN');
  const takeaway = completedOrders.filter(o => o.orderType === 'TAKEAWAY');
  const delivery = completedOrders.filter(o => o.orderType === 'DELIVERY');

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 italic">💰 Revenue Intelligence</h1>
              <p className="text-slate-400 mt-1">Sales performance, food cost analysis, and tax provisions.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-800 text-slate-300">
                <Calendar className="h-4 w-4 mr-2" /> This Period
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                <Download className="h-4 w-4 mr-2" /> Export P&L
              </Button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">Rs {totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> {completedOrders.length} orders
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Gross Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">Rs {grossProfit.toLocaleString()}</div>
                <p className="text-xs text-slate-500 mt-1">Food cost: Rs {totalCost.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{marginPercent}%</div>
                <p className="text-xs text-slate-500 mt-1">Across all categories</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">VAT Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">Rs {Math.round(totalVat).toLocaleString()}</div>
                <p className="text-xs text-orange-500 mt-1">Pending submission</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Avg. Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">Rs {Math.round(avgTicket).toLocaleString()}</div>
                <p className="text-xs text-slate-500 mt-1">{totalCovers} covers served</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue by Menu Category */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-emerald-400" />
                  Revenue by Category
                </CardTitle>
                <CardDescription>Sales breakdown by menu section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {catRevenueList.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{cat.icon} {cat.name}</span>
                      <span className="text-slate-100 font-bold">Rs {cat.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(cat.revenue / maxCatRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Revenue by Outlet */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-400" />
                  Revenue by Outlet
                </CardTitle>
                <CardDescription>Performance across restaurant locations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {locRevenueList.map((loc) => (
                  <div key={loc.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{loc.name}</span>
                      <span className="text-slate-100 font-bold">Rs {loc.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(loc.revenue / maxLocRevenue) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">{loc.orders} orders</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Type Breakdown */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6 text-center">
                <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                <p className="text-2xl font-bold text-slate-100">{dineIn.length}</p>
                <p className="text-sm text-slate-400">Dine-In Orders</p>
                <p className="text-xs text-emerald-400 mt-1">Rs {dineIn.reduce((a, o) => a + o.total, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold text-slate-100">{takeaway.length}</p>
                <p className="text-sm text-slate-400">Takeaway Orders</p>
                <p className="text-xs text-blue-400 mt-1">Rs {takeaway.reduce((a, o) => a + o.total, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6 text-center">
                <Users2 className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold text-slate-100">{delivery.length}</p>
                <p className="text-sm text-slate-400">Delivery Orders</p>
                <p className="text-xs text-purple-400 mt-1">Rs {delivery.reduce((a, o) => a + o.total, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Fiscal Deadlines */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Upcoming Fiscal Deadlines</CardTitle>
              <CardDescription>Stay ahead of regulatory payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'VAT Quarterly Filing', date: 'March 31, 2026', status: 'Urgent' },
                { title: 'Corporate Tax (Advance)', date: 'June 15, 2026', status: 'Scheduled' },
                { title: 'Social Security (CSG)', date: 'Monthly, 15th', status: 'Recurring' },
                { title: 'Liquor License Renewal', date: 'June 30, 2026', status: 'Scheduled' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={item.status === 'Urgent' ? 'border-orange-500/50 text-orange-500' : 'border-slate-700 text-slate-500'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
