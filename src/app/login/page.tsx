
'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/login-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eraser, ArrowLeft } from 'lucide-react';
import AppFooter from '@/components/app-footer';
import Link from 'next/link';

export default function LoginPage() {
  const { activeShift, activeAdmin, isReportingDone, clearCompletedOrders, completedOrders, _hasHydrated } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    if (_hasHydrated && (activeShift || activeAdmin)) {
        router.replace('/dashboard');
    }
  }, [_hasHydrated, activeShift, activeAdmin, router]);
  
  const handleResetShift = () => {
    clearCompletedOrders();
    setIsResetDialogOpen(false);
    toast({
      title: 'Shift Reset',
      description: 'All completed orders for the previous session have been cleared.',
    });
  };
  
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse text-sm font-medium tracking-widest">LOADING SESSION</p>
        </div>
      </div>
    );
  }
  
  if (activeShift || activeAdmin) {
    return null;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

        <div className="absolute top-8 left-8 z-20">
            <Button variant="ghost" asChild className="text-slate-400 hover:text-white hover:bg-white/5">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Splash
                </Link>
            </Button>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Access Portal</h1>
                <p className="text-slate-400 text-lg">Identify yourself to continue</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
                <LoginForm />
            </div>
            
            <div className="pt-6 text-center">
                 <Button 
                    variant="outline" 
                    className="border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
                    onClick={() => setIsResetDialogOpen(true)}
                    disabled={completedOrders.length === 0 || !isReportingDone}
                >
                    <Eraser className="mr-2 h-4 w-4" />
                    Reset Shift Data
                </Button>
            </div>
        </div>
      </div>
      <AppFooter />
      <AlertDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white rounded-3xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-lg">
              This action cannot be undone. This will permanently clear all{' '}
              <span className="text-white font-bold">{completedOrders.length}</span> completed order(s) from the previous session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 h-12 px-6 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetShift} className="bg-red-600 hover:bg-red-700 h-12 px-6 rounded-xl">
              Yes, reset shift
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
