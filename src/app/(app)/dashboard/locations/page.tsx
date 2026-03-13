'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Plus, 
  Store, 
  Settings, 
  Activity, 
  DollarSign, 
  Users,
  Search,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AddLocationDialog from '@/components/add-location-dialog';
import EditLocationDialog from '@/components/edit-location-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';

export default function LocationsPage() {
  const { 
    locations, 
    fetchLocations,
    deleteLocation,
    simulatedUser
  } = useStore();
  const [search, setSearch] = useState('');
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );

  if (simulatedUser?.role !== 'SUPER_ADMIN') {
    return <div className="p-20 text-center">Unauthorized Access</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 italic">📍 Restaurant Outlets</h1>
              <p className="text-slate-400 mt-1">Manage all restaurant branches, kiosks, and pop-up events.</p>
            </div>
            <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> New Outlet
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search locations..." 
                className="pl-10 bg-slate-900 border-slate-800 text-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((loc) => (
              <Card key={loc.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-blue-500/50 transition-all">
                <CardHeader className="bg-slate-950/50 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={loc.isActive ? 'default' : 'secondary'} className={loc.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : ''}>
                          {loc.isActive ? 'Operational' : 'Closed'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuItem 
                                className="hover:bg-white/5 cursor-pointer"
                                onClick={() => setEditingLocation(loc)}
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                                onClick={() => deleteLocation(loc.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Remove Location
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-slate-100">{loc.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    {loc.type || 'Physical Store'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Activity className="h-3 w-3" /> Performance
                      </p>
                      <p className="text-sm font-semibold text-emerald-400">+12.5%</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                        <DollarSign className="h-3 w-3" /> Daily Rev.
                      </p>
                      <p className="text-sm font-semibold text-slate-100">Rs 45,200</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="flex items-center -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-6 w-6 rounded-full border border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold">
                           {i === 3 ? '+4' : 'S'}
                         </div>
                       ))}
                       <span className="ml-4 text-xs text-slate-500">Active Staff</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8"
                        onClick={() => setEditingLocation(loc)}
                    >
                      Manage <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <AddLocationDialog isOpen={isAddOpen} onOpenChange={setAddOpen} />
        {editingLocation && (
            <EditLocationDialog 
                isOpen={!!editingLocation} 
                onOpenChange={(open) => !open && setEditingLocation(null)} 
                location={editingLocation} 
            />
        )}
      </main>
    </div>
  );
}
