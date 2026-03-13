
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/lib/store';
import type { Category, CashierRole } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const cashierRoles: CashierRole[] = ['Bar', 'Counter', 'Floor'];

interface ManageCategoryRolesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type CategoryRoleState = Record<string, CashierRole[]>;

export default function ManageCategoryRolesDialog({
  isOpen,
  onOpenChange,
}: ManageCategoryRolesDialogProps) {
  const { categories, fetchCategories } = useStore();
  const { toast } = useToast();
  const [initialCategoryRoles, setInitialCategoryRoles] = useState<CategoryRoleState>({});
  const [categoryRoles, setCategoryRoles] = useState<CategoryRoleState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (isOpen) {
        setIsLoading(true);
        await fetchCategories(); // Fetch all categories
        
        // Mocking the initial state since we're in dev mode without Supabase
        const initialState: CategoryRoleState = {};
        categories.forEach((cat: Category) => {
            initialState[cat.id] = ['Floor', 'Counter', 'Bar']; // Adjusted roles for Restaurant fallback
        });
        setInitialCategoryRoles(initialState);
        setCategoryRoles(initialState);
        setIsLoading(false);
      }
    }
    loadData();
  }, [isOpen, fetchCategories, categories]);

  const handleCheckboxChange = (catId: string, role: CashierRole, checked: boolean) => {
    setCategoryRoles(prevState => {
      const rolesForType = prevState[catId] || [];
      if (checked) {
        // Add role if it doesn't exist
        return { ...prevState, [catId]: [...rolesForType, role] };
      } else {
        // Remove role
        return { ...prevState, [catId]: rolesForType.filter(r => r !== role) };
      }
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // In mock mode, we just pretend it's saved
    setTimeout(() => {
        toast({ title: 'Success (Mock)', description: 'Category roles have been updated locally for development.' });
        setIsSaving(false);
        onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Category Roles</DialogTitle>
          <DialogDescription>
            Assign which cashier roles can see each product category. Changes will apply on next login.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 w-full pr-4">
          <div className="space-y-4">
            {isLoading ? <p>Loading categories...</p> : categories.map((cat, index) => (
              <div key={cat.id}>
                <div className="p-2 rounded-md">
                   <h4 className="font-semibold mb-2">{cat.name}</h4>
                   <div className="flex items-center space-x-4">
                    {['Bar', 'Counter', 'Floor'].map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`${cat.id}-${role}`}
                                checked={(categoryRoles[cat.id] || []).includes(role as CashierRole)}
                                onCheckedChange={(checked) => handleCheckboxChange(cat.id, role as CashierRole, !!checked)}
                            />
                            <label htmlFor={`${cat.id}-${role}`} className="text-sm font-medium">
                                {role}
                            </label>
                        </div>
                    ))}
                   </div>
                </div>
                {index < categories.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
