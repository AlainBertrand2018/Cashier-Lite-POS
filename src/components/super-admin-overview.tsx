'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  UtensilsCrossed, 
  MapPin, 
  Users2, 
  ClipboardCheck, 
  TrendingUp, 
  Clock,
  Briefcase,
  ShieldAlert,
  DollarSign,
  Flame,
  Wine,
  Star,
  UserCheck
} from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from './ui/badge';

export default function SuperAdminOverview() {
  const { 
    businessProfile, 
    locations, 
    staff, 
    products,
    completedOrders,
    complianceRecords,
    fetchBusinessProfile,
    fetchLocations,
    fetchStaff,
    fetchProducts,
    fetchCompletedOrders,
    fetchCompliance
  } = useStore();

  useEffect(() => {
    fetchBusinessProfile();
    fetchLocations();
    fetchStaff();
    fetchProducts();
    fetchCompletedOrders();
    fetchCompliance();
  }, []);

  // ─── CALCULATE RESTAURANT KPIs ──────────────────
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayOrders = completedOrders.filter(o => o.createdAt >= todayStart.getTime());
  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.total, 0);
  const totalCovers = todayOrders.reduce((acc, o) => acc + (o.guestCount || 1), 0);
  const avgTicket = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  // Top selling items
  const itemSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      if (!itemSales[item.productId]) {
        itemSales[item.productId] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemSales[item.productId].qty += item.quantity;
      itemSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topDishes = Object.values(itemSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.total, 0);
  const lowStockItems = products.filter(p => p.stock < 10);
  const unavailableItems = products.filter(p => p.isAvailable === false);
  const activeStaff = staff.filter(s => s.isActive).length;

  const kpis = [
    {
      title: "Today's Revenue",
      value: `Rs ${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: `${todayOrders.length} orders served`,
      color: 'text-emerald-500'
    },
    {
      title: 'Covers Served',
      value: totalCovers,
      icon: UserCheck,
      trend: `Avg. ticket: Rs ${Math.round(avgTicket).toLocaleString()}`,
      color: 'text-blue-500'
    },
    {
      title: 'Menu Items',
      value: products.length,
      icon: UtensilsCrossed,
      trend: lowStockItems.length > 0 ? `${lowStockItems.length} low stock alerts` : 'All stocked',
      color: 'text-orange-500'
    },
    {
      title: 'Active Team',
      value: activeStaff,
      icon: Users2,
      trend: `${staff.filter(s => s.role === 'WAITER' || s.role === 'HEAD_WAITER').length} floor staff`,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          🍽️ Restaurant Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Live operations overview for {businessProfile.name || 'Your Restaurant'}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{kpi.value}</div>
              <p className="text-xs text-slate-500 mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Dishes */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              Best Sellers
            </CardTitle>
            <CardDescription>Most ordered items across all outlets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDishes.map((dish, idx) => (
              <div key={dish.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{dish.name}</p>
                    <p className="text-xs text-slate-500">{dish.qty} orders · Rs {dish.revenue.toLocaleString()}</p>
                  </div>
                </div>
                {idx === 0 && <Star className="h-4 w-4 text-amber-400" />}
              </div>
            ))}
            {topDishes.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No sales data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Compliance & Licenses */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-400" />
              Licenses & Compliance
            </CardTitle>
            <CardDescription>Food hygiene, liquor, and regulatory status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${record.status === 'COMPLIANT' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-orange-400/10 text-orange-400'}`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{record.title}</p>
                    <p className="text-xs text-slate-500">{record.status === 'COMPLIANT' ? 'Valid until' : 'Action needed by'} {record.expiryDate}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${record.status === 'COMPLIANT' ? 'border-emerald-500/30 text-emerald-400' : 'border-orange-500/30 text-orange-400'}`}>
                  {record.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Active Outlets */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              Active Outlets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {locations.filter(l => l.isActive).map(loc => (
              <div key={loc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-slate-200">{loc.name}</p>
                  <p className="text-xs text-slate-500">{loc.type} · {loc.tableCount || 0} tables</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kitchen & Floor Team */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-400" />
              Key Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {staff.filter(s => ['HEAD_CHEF', 'SOUS_CHEF', 'HEAD_WAITER', 'MANAGER', 'BARTENDER'].includes(s.role)).slice(0, 5).map(member => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{member.firstName} {member.lastName}</p>
                  <p className="text-xs text-slate-500">{member.role.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card className={`border-slate-800 ${lowStockItems.length > 0 ? 'bg-orange-950/20 border-orange-500/20' : 'bg-emerald-950/20 border-emerald-500/20'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-base flex items-center gap-2 ${lowStockItems.length > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
              <Wine className="h-4 w-4" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.name}</p>
                      <p className="text-xs text-orange-400 font-bold">{item.stock} remaining</p>
                    </div>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs">Low</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-emerald-400 font-medium">All items well stocked</p>
                <p className="text-xs text-slate-500 mt-1">No immediate restock required.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
