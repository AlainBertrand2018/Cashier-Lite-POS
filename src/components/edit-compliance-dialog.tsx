
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { ComplianceRecord } from '@/lib/types';

const formSchema = z.object({
  type: z.enum(['VAT', 'CSG', 'NSF', 'FOOD_HYGIENE', 'LIQUOR_LICENSE', 'FIRE_SAFETY', 'HEALTH_INSPECTION', 'TRADE_LICENSE', 'INSURANCE']),
  title: z.string().min(2, { message: 'Title is required.' }),
  status: z.enum(['COMPLIANT', 'PENDING', 'EXPIRED', 'NOT_APPLICABLE']),
  expiryDate: z.string().optional(),
  lastRenewalDate: z.string().optional(),
});

interface EditComplianceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  record: ComplianceRecord;
}

export default function EditComplianceDialog({ isOpen, onOpenChange, record }: EditComplianceDialogProps) {
  const { editComplianceRecord } = useStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: record.type,
      title: record.title,
      status: record.status,
      expiryDate: record.expiryDate || '',
      lastRenewalDate: record.lastRenewalDate || '',
    },
  });

  useEffect(() => {
    form.reset({
      type: record.type,
      title: record.title,
      status: record.status,
      expiryDate: record.expiryDate || '',
      lastRenewalDate: record.lastRenewalDate || '',
    });
  }, [record, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await editComplianceRecord(record.id, values);
    setIsSubmitting(false);

    toast({
      title: 'Filing Updated',
      description: `Record "${values.title}" has been updated.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Compliance Record</DialogTitle>
          <DialogDescription>
            Modify the status or details of this legal requirement.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['VAT', 'CSG', 'NSF', 'FOOD_HYGIENE', 'LIQUOR_LICENSE', 'FIRE_SAFETY', 'HEALTH_INSPECTION', 'TRADE_LICENSE', 'INSURANCE'].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['COMPLIANT', 'PENDING', 'EXPIRED', 'NOT_APPLICABLE'].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastRenewalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Update Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
