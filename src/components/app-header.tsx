
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, LogOut, Menu, UserCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from './ui/separator';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


function NavigationLinks() {
  const { simulatedUser } = useStore();
  const pathname = usePathname();
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, minRole: 'ADMIN' },
    { href: '/reports', label: 'Reports', icon: BookOpen, minRole: 'CASHIER' },
  ];

  // Logic to filter links by role priority: SUPER_ADMIN (3) > ADMIN (2) > CASHIER (1)
  const rolePriority: Record<string, number> = { 'SUPER_ADMIN': 3, 'ADMIN': 2, 'CASHIER': 1 };
  const userPriority = rolePriority[simulatedUser?.role || 'CASHIER'];

  const filteredLinks = navLinks.filter(link => {
    const requiredPriority = rolePriority[link.minRole];
    return userPriority >= requiredPriority;
  });

  return (
    <>
      {filteredLinks.map((link) => {
        const isActive = pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard');
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all',
              isActive 
                ? 'bg-zinc-900 text-white shadow-lg shadow-black/5' 
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
            )}
          >
            <link.icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "")} />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

function UserInfoAndLogout() {
  const { 
    activeShift, 
    activeAdmin, 
    logoutShift, 
    adminLogout,
    isReportingDone,
    completedOrders,
    simulatedUser,
    setSimulatedRole
  } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    if (activeShift) {
      logoutShift();
    }
    if (activeAdmin) {
      adminLogout();
    }
    router.push('/');
  };

  const isCashierLogoutDisabled = !!(activeShift && completedOrders.length > 0 && !isReportingDone);
  const logoutTooltipMessage = "Complete end-of-shift reporting on the Reports page before logging out.";

  const LogoutButton = () => (
     <Button 
        variant="ghost" 
        onClick={handleLogout} 
        className="w-full md:w-auto md:h-10 justify-start gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        disabled={isCashierLogoutDisabled}
      >
        <LogOut className="h-4 w-4" />
        Exit
      </Button>
  );

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
       {/* Role Switcher (Simulation Only) */}
       <div className="flex items-center bg-zinc-100 rounded-xl p-1 border border-zinc-200 shadow-inner">
          {(['SUPER_ADMIN', 'ADMIN', 'CASHIER'] as const).map(role => (
            <button
              key={role}
              onClick={() => setSimulatedRole(role)}
              className={cn(
                "px-2 py-1 text-[8px] font-black uppercase tracking-tighter rounded-lg transition-all",
                simulatedUser?.role === role 
                  ? "bg-white text-zinc-900 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              {role.split('_')[0]}
            </button>
          ))}
       </div>

       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 bg-zinc-100/50 px-3 py-1.5 rounded-full border border-zinc-200/50">
        <UserCircle className="h-4 w-4 text-primary" />
        <span className="truncate max-w-[120px]">{simulatedUser?.role || 'CASHIER'}</span>
      </div>
       {isCashierLogoutDisabled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div tabIndex={0} className="w-full md:w-auto"> 
                <LogoutButton />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{logoutTooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <LogoutButton />
      )}
    </div>
  );
}

export default function AppHeader() {
  const { businessProfile, fetchBusinessProfile, simulatedUser } = useStore();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

  if (!isClient) {
    return (
       <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 md:px-8">
       </header>
    );
  }


  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 md:px-8">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100">
              <Menu className="h-5 w-5 text-zinc-900" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-white border-zinc-100">
            <nav className="grid gap-2 text-lg font-medium pt-10">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
                    {businessProfile.logo ? (
                        <Image src={businessProfile.logo} alt={businessProfile.name} width={28} height={28} className="object-contain" />
                    ) : (
                        <ShoppingBag className="w-6 h-6 text-primary" />
                    )}
                </div>
                <span className="font-bold text-xl text-zinc-900">{businessProfile.name}</span>
              </Link>
              <NavigationLinks />
            </nav>
            <div className="mt-auto flex flex-col gap-6">
              <Separator className="bg-zinc-100" />
              <UserInfoAndLogout />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <Link href="/dashboard" className="flex items-center gap-4 group transition-all">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 duration-300">
            {businessProfile.logo ? (
                <div className="relative w-8 h-8">
                    <Image src={businessProfile.logo} alt={businessProfile.name} fill className="object-contain" />
                </div>
            ) : (
                <ShoppingBag className="w-6 h-6 text-primary" strokeWidth={1.5} />
            )}
        </div>
        <div className="flex flex-col">
            <span className="hidden md:inline-block font-bold text-lg text-zinc-900 leading-tight">
                {businessProfile.name || 'Lumina Retail'}
            </span>
            <span className="hidden md:inline-block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Professional POS
            </span>
        </div>
      </Link>
      
      <div className="h-8 w-[1px] bg-zinc-100 mx-4 hidden md:block" />

      <nav className="hidden md:flex items-center gap-2">
        <NavigationLinks />
      </nav>
      
      <div className="ml-auto hidden md:flex items-center gap-4">
         <UserInfoAndLogout />
      </div>

      {/* Mobile Logo (Center on Small screens) */}
      <div className="md:hidden flex-1 flex justify-center">
         <span className="font-bold text-sm text-zinc-900 uppercase tracking-[0.2em]">{businessProfile.name}</span>
      </div>
      
      {/* Simulation Bar */}
      <div className="absolute -bottom-6 left-0 right-0 h-6 bg-primary flex items-center justify-center px-4 overflow-hidden pointer-events-none">
          <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.3em] whitespace-nowrap animate-pulse">
            Simulated Perspective: {simulatedUser?.role.replace('_', ' ')} • No Database Connectivity
          </p>
      </div>
    </header>
  );
}
