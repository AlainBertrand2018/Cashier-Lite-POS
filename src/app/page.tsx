
'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingBag, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppFooter from '@/components/app-footer';
import BrandingOnboarding from '@/components/branding-onboarding';

export default function SplashPage() {
    const { businessProfile, activeLocation, _hasHydrated } = useStore();
    const router = useRouter();
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (_hasHydrated && !businessProfile.name) {
            setShowOnboarding(true);
        }
    }, [_hasHydrated, businessProfile.name]);

    if (!_hasHydrated) {
        return <LoadingScreen />;
    }

    if (showOnboarding) {
        return <BrandingOnboarding onComplete={() => setShowOnboarding(false)} />;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary/30">
            <main className="w-full max-w-2xl flex flex-col items-center gap-10 text-center z-10 animate-in fade-in zoom-in-95 duration-1000">
                
                {/* 1. Logo Container */}
                <div className="w-20 h-20 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-black/10 transition-transform hover:scale-105 duration-500">
                    <ShoppingBag className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>

                {/* 2. Business Branding */}
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
                        {businessProfile.name || 'Lumina Retail'} <span className="text-zinc-300 mx-1">•</span> <span className="text-zinc-400 font-medium">{activeLocation?.name || 'Location'}</span>
                    </h1>
                    
                    {/* 3. Description line */}
                    <p className="text-zinc-400 text-sm md:text-base font-light tracking-wide uppercase">
                        Cashierlite Point Of Sale Management System
                    </p>
                </div>

                {/* 4. Access Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                    <Button 
                        onClick={() => router.push('/login?admin=true')}
                        className="h-14 flex-1 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-semibold shadow-lg shadow-black/5 flex items-center justify-center gap-2 group"
                    >
                        <LayoutDashboard className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                        Admin Dashboard
                    </Button>

                    <Button 
                        onClick={() => router.push('/login')}
                        variant="outline"
                        className="h-14 flex-1 rounded-xl bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-all font-semibold shadow-sm flex items-center justify-center gap-2 group"
                    >
                        <Globe className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        Cashier Login
                    </Button>
                </div>

                {/* 5. Online Status */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase mt-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    SYSTEM ONLINE • V2.4.0
                </div>
            </main>

            <div className="absolute bottom-8 left-0 right-0">
                <AppFooter />
            </div>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center text-zinc-900">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-400 text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Initializing</p>
            </div>
        </div>
    );
}
