
'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Building, Upload, Check, Store, MapPin, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

type OnboardingStep = 1 | 2 | 3;

export default function BrandingOnboarding({ onComplete }: { onComplete: () => void }) {
  const { businessProfile, updateBusinessProfile, addLocation, setActiveLocation } = useStore();
  
  // Step 1: Corporate
  const [step, setStep] = useState<OnboardingStep>(1);
  const [name, setName] = useState(businessProfile.name || '');
  const [logo, setLogo] = useState(businessProfile.logo || '');
  const [corpAddress, setCorpAddress] = useState(businessProfile.corporateAddress || '');
  const [brn, setBrn] = useState(businessProfile.brn || '');
  const [vat, setVat] = useState(businessProfile.vat || '');

  // Step 2: Main Location
  const [mainLocationName, setMainLocationName] = useState('Main HQ');
  const [mainLocationAddress, setMainLocationAddress] = useState('');

  // Step 3: Local Instance (Active node)
  const [localNodeAddress, setLocalNodeAddress] = useState('');
  const [mainCashier, setMainCashier] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinalize = async () => {
    setIsSubmitting(true);
    
    // 1. Create the Main Location first to get an ID
    const locId = await addLocation({
      name: mainLocationName,
      type: 'Permanent',
      address: mainLocationAddress,
    });

    // 2. Update Business Profile
    await updateBusinessProfile({
      ...businessProfile,
      name,
      logo,
      corporateAddress: corpAddress,
      brn,
      vat,
      mainLocationId: locId
    });

    // 3. Set this as the active location for this node
    await setActiveLocation(locId);

    setIsSubmitting(false);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Building className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 text-center">Corporate Identity</h2>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Global business network setup</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Business Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lumina Global" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">BRN</Label>
                  <Input value={brn} onChange={e => setBrn(e.target.value)} placeholder="C12345" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
                </div>
                 <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">VAT Number</Label>
                  <Input value={vat} onChange={e => setVat(e.target.value)} placeholder="VAT-123" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">HQ Address</Label>
                <Input value={corpAddress} onChange={e => setCorpAddress(e.target.value)} placeholder="Corporate Headquarters" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Brand Logo</Label>
                <div className="relative group flex items-center justify-center p-4 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 hover:bg-zinc-100/50 transition-all cursor-pointer">
                  {logo ? <Image src={logo} alt="Logo" width={40} height={40} className="object-contain" /> : <Upload className="text-zinc-300 w-5 h-5" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Store className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Network Infrastructure</h2>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Initialize primary location</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Location Name</Label>
                <Input value={mainLocationName} onChange={e => setMainLocationName(e.target.value)} placeholder="e.g. Waterfront Branch" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Permanent Address</Label>
                <Input value={mainLocationAddress} onChange={e => setMainLocationAddress(e.target.value)} placeholder="Main physical site address" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-[10px] text-zinc-500 font-medium">Secondary locations and events can be added later by the Super Admin via the dashboard.</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 text-center">Local Node Activation</h2>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Instance identification</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Node Address</Label>
                <Input value={localNodeAddress} onChange={e => setLocalNodeAddress(e.target.value)} placeholder="Specific address of this machine" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Main Cashier / Attendant</Label>
                <Input value={mainCashier} onChange={e => setMainCashier(e.target.value)} placeholder="Name of primary user for this node" className="rounded-xl border-zinc-100 bg-zinc-50/30" />
              </div>
               <div className="flex items-center gap-2 p-3 bg-zinc-900/5 rounded-xl border border-zinc-900/10">
                <ShieldCheck className="w-4 h-4 text-zinc-600" />
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">System will initialize with Super Admin privileges.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 selection:bg-primary/20">
      <Card className="w-full max-w-lg border-zinc-200 bg-white/80 backdrop-blur-2xl text-zinc-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-8 pb-4">
           {/* Progress Indicator */}
           <div className="flex justify-center gap-2 mb-6">
              {[1,2,3].map(i => (
                <div key={i} className={`h-1 duration-500 rounded-full transition-all ${i === step ? 'w-8 bg-zinc-900' : 'w-4 bg-zinc-100'}`} />
              ))}
           </div>
        </CardHeader>
        
        <CardContent className="px-10 pb-8 min-h-[350px] flex flex-col justify-center">
            {renderStep()}
        </CardContent>

        <CardFooter className="px-10 pb-12 flex gap-3">
          {step > 1 && (
            <Button 
                variant="outline" 
                onClick={() => setStep(s => (s-1) as OnboardingStep)}
                className="h-14 w-14 rounded-2xl border-zinc-100"
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <Button 
            onClick={() => step < 3 ? setStep(s => (s+1) as OnboardingStep) : handleFinalize()}
            disabled={(step === 1 && !name) || (step === 2 && !mainLocationAddress) || isSubmitting}
            className="flex-1 h-14 text-sm font-black uppercase tracking-[0.2em] bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-xl rounded-2xl group"
          >
            {isSubmitting ? 'Initializing...' : step === 3 ? 'Finalize Setup' : 'Continue'}
            {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
