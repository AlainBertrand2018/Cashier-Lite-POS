'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardCheck, 
  LayoutDashboard, 
  MapPin, 
  Package, 
  Users2,
  Wallet,
  Settings,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useStore } from '@/lib/store';
import { UtensilsCrossed } from 'lucide-react';

const superAdminLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Outlets', href: '/dashboard/locations', icon: MapPin },
  { name: 'Menu & Stock', href: '/dashboard/inventory', icon: UtensilsCrossed },
  { name: 'Team', href: '/dashboard/hr', icon: Users2 },
  { name: 'Compliance', href: '/dashboard/compliance', icon: ClipboardCheck },
  { name: 'Revenue', href: '/dashboard/financials', icon: Wallet },
  { name: 'Restaurant Settings', href: '/dashboard/settings', icon: Building2 },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { simulatedUser, setSimulatedRole } = useStore();

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-slate-950 text-slate-200 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center px-4 border-b border-white/5">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            CashierLite HQ
          </span>
        )}
        {isCollapsed && <Building2 className="h-6 w-6 text-emerald-400 mx-auto" />}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {superAdminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "hover:bg-white/5 text-slate-400 hover:text-slate-200",
                isCollapsed && "justify-center px-0"
              )}
            >
              <link.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-emerald-400" : "text-slate-400")} />
              {!isCollapsed && <span>{link.name}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t border-white/5 p-4 space-y-4">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
            {simulatedUser?.name?.[0] || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{simulatedUser?.name}</p>
              <p className="text-xs text-slate-500 truncate">{simulatedUser?.role}</p>
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10", isCollapsed && "justify-center p-0")}
          onClick={() => setSimulatedRole('CASHIER')}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Exit Dashboard</span>}
        </Button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-slate-900 text-slate-400 hover:text-white"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}
