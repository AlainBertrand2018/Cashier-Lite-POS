
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Calendar } from './ui/calendar';
import type { Location } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Location name must be at least 3 characters.' }),
  type: z.enum(['Permanent', 'Event']),
  address: z.string().min(5, { message: 'Address is required.' }),
  isActive: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(data => {
  if (data.type === 'Event' && (!data.startDate || !data.endDate)) return false;
  if (data.startDate && data.endDate && data.endDate < data.startDate) return false;
  return true;
}, {
    message: 'Events require valid start and end dates.',
    path: ['endDate'],
});

interface EditLocationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  location: Location;
}

export default function EditLocationDialog({ isOpen, onOpenChange, location }: EditLocationDialogProps) {
  const { editLocation } = useStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location.name,
      type: location.type,
      address: location.address,
      isActive: location.isActive,
      startDate: location.startDate ? parseISO(location.startDate) : undefined,
      endDate: location.endDate ? parseISO(location.endDate) : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: location.name,
      type: location.type,
      address: location.address,
      isActive: location.isActive,
      startDate: location.startDate ? parseISO(location.startDate) : undefined,
      endDate: location.endDate ? parseISO(location.endDate) : undefined,
    });
  }, [location, form]);

  const locationType = form.watch('type');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const locationData = {
        name: values.name,
        type: values.type,
        address: values.address,
        isActive: values.isActive,
        startDate: values.startDate ? format(values.startDate, 'yyyy-MM-dd') : undefined,
        endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : undefined,
    }
    await editLocation(location.id, locationData);
    setIsSubmitting(false);

    toast({
      title: 'Location Updated',
      description: `Settings for "${values.name}" have been saved.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Update outpost details or operational status.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
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
                    <FormLabel>Location Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Permanent">Permanent Outlet</SelectItem>
                        <SelectItem value="Event">Temporary Event/Fair</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-800 p-2 shadow-sm mt-6">
                    <FormLabel className="text-xs">Operational</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address / Venue</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {locationType === 'Event' && (
              <div className="grid grid-cols-2 gap-4">
                  <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                      <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                          <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                              variant={"outline"}
                              className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                              )}
                              >
                              {field.value ? format(field.value, "PPP") : <span>Pick date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                          />
                          </PopoverContent>
                      </Popover>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                      <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                          <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                              variant={"outline"}
                              className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                              )}
                              >
                              {field.value ? format(field.value, "PPP") : <span>Pick date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                          />
                          </PopoverContent>
                      </Popover>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
