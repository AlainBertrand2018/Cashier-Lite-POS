
'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import type { Location } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

export default function LocationManagementCard() {
  const { locations, fetchLocations, setActiveLocation, activeLocation } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadLocations() {
        setIsLoading(true);
        await fetchLocations(true);
        setIsLoading(false);
    }
    loadLocations();
  }, [fetchLocations]);

  const handleToggleActive = (locationId: string, newIsActive: boolean) => {
    if (newIsActive) {
      setActiveLocation(locationId);
    }
  };


  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Location Management</CardTitle>
        <CardDescription>
          Select the active business location. Permanent outlets and temporary events are listed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                 <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-10 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : locations.length > 0 ? (
              locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{loc.name}</div>
                    {loc.type === 'Event' && loc.startDate && loc.endDate && (
                        <div className="text-[10px] text-muted-foreground">
                            {format(new Date(loc.startDate), 'dd MMM')} - {format(new Date(loc.endDate), 'dd MMM yyyy')}
                        </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={loc.type === 'Permanent' ? 'outline' : 'secondary'} className="text-[10px]">
                        {loc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={activeLocation?.id === loc.id}
                      onCheckedChange={(checked) => handleToggleActive(loc.id, checked)}
                      aria-label={`Activate ${loc.name}`}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
