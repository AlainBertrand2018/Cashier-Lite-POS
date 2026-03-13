'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Building
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function settingsPage() {
  const { 
    businessProfile,
    updateBusinessProfile,
    simulatedUser
  } = useStore();

  const [formData, setFormData] = useState(businessProfile);

  useEffect(() => {
    setFormData(businessProfile);
  }, [businessProfile]);

  const handleSave = () => {
    updateBusinessProfile(formData);
  };

  if (simulatedUser?.role !== 'SUPER_ADMIN') {
    return <div className="p-20 text-center">Unauthorized Access</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 font-serif italic">⚙️ Restaurant Settings</h1>
              <p className="text-slate-400 mt-1">Official legal information and restaurant identity.</p>
            </div>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-emerald-400" />
                  Legal Identity
                </CardTitle>
                <CardDescription>How your business appears on legal documents and tax filings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Business Name</Label>
                    <Input 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">BRN (Business Registration Number)</Label>
                    <Input 
                      className="bg-slate-950 border-slate-800 text-slate-200 font-mono" 
                      value={formData.brn} 
                      onChange={(e) => setFormData({...formData, brn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">VAT Number</Label>
                    <Input 
                      className="bg-slate-950 border-slate-800 text-slate-200 font-mono" 
                      value={formData.vat} 
                      onChange={(e) => setFormData({...formData, vat: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Support Email</Label>
                    <Input 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  Contact & Online Presence
                </CardTitle>
                <CardDescription>Primary headquarters address and digital storefront.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Corporate Address</Label>
                  <Input 
                    className="bg-slate-950 border-slate-800 text-slate-200" 
                    value={formData.corporateAddress} 
                    onChange={(e) => setFormData({...formData, corporateAddress: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Website URL</Label>
                    <div className="flex">
                      <div className="h-10 px-3 bg-slate-800 border-r-0 border border-slate-700 flex items-center text-slate-500 rounded-l-md">
                        <Globe className="h-4 w-4" />
                      </div>
                      <Input 
                        className="bg-slate-950 border-slate-800 text-slate-200 rounded-l-none" 
                        value={formData.website} 
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Official Phone</Label>
                    <div className="flex">
                      <div className="h-10 px-3 bg-slate-800 border-r-0 border border-slate-700 flex items-center text-slate-500 rounded-l-md">
                        <Phone className="h-4 w-4" />
                      </div>
                      <Input 
                        className="bg-slate-950 border-slate-800 text-slate-200 rounded-l-none" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
