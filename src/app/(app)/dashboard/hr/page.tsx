'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2,
  Trash2,
  Edit2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddStaffDialog from '@/components/add-staff-dialog';
import EditStaffDialog from '@/components/edit-staff-dialog';
import AddDepartmentDialog from '@/components/add-department-dialog';
import EditDepartmentDialog from '@/components/edit-department-dialog';

export default function HRPage() {
  const { 
    staff, 
    departments, 
    fetchStaff, 
    fetchDepartments,
    deleteStaff,
    deleteDepartment,
    simulatedUser
  } = useStore();
  const [search, setSearch] = useState('');
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isAddDeptOpen, setAddDeptOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, [fetchStaff, fetchDepartments]);

  const filteredStaff = staff.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.idNumber.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 italic">👥 Team Management</h1>
              <p className="text-slate-400 mt-1">Kitchen brigade, floor staff, bar team, and department structure.</p>
            </div>
            <div className="flex gap-2">
                <Button 
                    variant="outline"
                    className="border-slate-800 text-slate-300 hover:bg-white/5"
                    onClick={() => setAddDeptOpen(true)}
                >
                <Building2 className="h-4 w-4 mr-2" /> New Department
                </Button>
                <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setAddOpen(true)}
                >
                <Plus className="h-4 w-4 mr-2" /> Recruit Member
                </Button>
            </div>
          </div>

          <Tabs defaultValue="staff" className="space-y-4">
            <TabsList className="bg-slate-900 border-slate-800">
                <TabsTrigger value="staff">Staff Members</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search by name, role or ID..." 
                        className="pl-10 bg-slate-950 border-slate-800 text-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    </div>
                    <Button variant="outline" className="border-slate-800 text-slate-400">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                    </Button>
                </div>
                </CardHeader>
                <CardContent>
                <div className="rounded-md border border-slate-800">
                    <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-slate-950 text-slate-500">
                        <tr>
                        <th className="px-6 py-4 font-medium">Employee</th>
                        <th className="px-6 py-4 font-medium">Department</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">ID Number</th>
                        <th className="px-6 py-4 font-medium">Joining Date</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredStaff.map((member) => {
                        const dept = departments.find(d => d.id === member.departmentId);
                        return (
                            <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                                    {member.firstName[0]}{member.lastName[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-200">{member.firstName} {member.lastName}</p>
                                    <p className="text-xs text-slate-500">{member.email}</p>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
                                {dept?.name || 'Unassigned'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{member.role}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{member.idNumber}</td>
                            <td className="px-6 py-4 text-slate-500">{member.hiredAt}</td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                    <DropdownMenuItem 
                                        className="hover:bg-white/5 cursor-pointer"
                                        onClick={() => setEditingMember(member)}
                                    >
                                    <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                                    <Mail className="h-4 w-4 mr-2" /> Contact
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                    className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                                    onClick={() => deleteStaff(member.id)}
                                    >
                                    <Trash2 className="h-4 w-4 mr-2" /> Terminate Contract
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="departments" className="space-y-4">
               <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Organization Units</CardTitle>
                    <CardDescription>Manage departments and allocated budgets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDepts.map((dept) => (
                            <div key={dept.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/30 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                            <DropdownMenuItem 
                                                className="hover:bg-white/5 cursor-pointer"
                                                onClick={() => setEditingDept(dept)}
                                            >
                                                <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                                                onClick={() => deleteDepartment(dept.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" /> Dissolve Unit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-100">{dept.name}</h3>
                                    <p className="text-xs text-slate-500">{dept.staffCount} Active members</p>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Monthly Budget</span>
                                    <span className="text-emerald-400 font-bold">Rs {dept.budget?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <AddStaffDialog isOpen={isAddOpen} onOpenChange={setAddOpen} />
        {editingMember && (
            <EditStaffDialog 
                isOpen={!!editingMember} 
                onOpenChange={(open) => !open && setEditingMember(null)} 
                member={editingMember} 
            />
        )}

        <AddDepartmentDialog isOpen={isAddDeptOpen} onOpenChange={setAddDeptOpen} />
        {editingDept && (
            <EditDepartmentDialog 
                isOpen={!!editingDept} 
                onOpenChange={(open) => !open && setEditingDept(null)} 
                department={editingDept} 
            />
        )}
      </main>
    </div>
  );
}
