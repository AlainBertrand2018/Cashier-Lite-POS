'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  RefreshCcw,
  FileText,
  Calendar
} from 'lucide-react';
import { useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import AddComplianceDialog from '@/components/add-compliance-dialog';
import EditComplianceDialog from '@/components/edit-compliance-dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';

export default function CompliancePage() {
  const { 
    complianceRecords, 
    fetchCompliance,
    deleteComplianceRecord,
    simulatedUser
  } = useStore();

  const [isAddOpen, setAddOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

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
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 italic">📋 Licenses & Compliance</h1>
              <p className="text-slate-400 mt-1">Food hygiene, liquor license, fire safety, and regulatory filings.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-800 text-slate-300">
                <Download className="h-4 w-4 mr-2" /> Audit Trail
              </Button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> New Filing
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Compliance Status</p>
                    <p className="text-2xl font-bold text-slate-100">92% Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Critical Actions</p>
                    <p className="text-2xl font-bold text-slate-100">2 Renewals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <RefreshCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Last Audit</p>
                    <p className="text-2xl font-bold text-slate-100">14 Days Ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Documents Registry</CardTitle>
              <CardDescription>Track the validity of your business licenses and tax records.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950/60 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
                        <FileText className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200">{record.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            Expiry: {record.expiryDate || 'N/A'}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">Last Verified: Jan 2026</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={
                        record.status === 'COMPLIANT' 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }>
                        {record.status}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hidden group-hover:flex"
                        >
                            View Document
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuItem 
                                className="hover:bg-white/5 cursor-pointer"
                                onClick={() => setEditingRecord(record)}
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                                onClick={() => deleteComplianceRecord(record.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Filing
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AddComplianceDialog isOpen={isAddOpen} onOpenChange={setAddOpen} />
        {editingRecord && (
            <EditComplianceDialog 
                isOpen={!!editingRecord} 
                onOpenChange={(open) => !open && setEditingRecord(null)} 
                record={editingRecord} 
            />
        )}
      </main>
    </div>
  );
}
