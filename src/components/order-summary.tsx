
'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Trash2, 
  ShoppingCart, 
  ChefHat, 
  CreditCard, 
  Users, 
  Hash,
  Clock,
  User,
  Phone
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { OrderType } from '@/lib/types';

export default function OrderSummary() {
  const { 
    currentOrder, 
    updateProductQuantity, 
    removeProductFromOrder, 
    clearCurrentOrder,
    completeOrder,
    submitOrderToKitchen,
    categories,
    selectedOrderType,
    selectedTable,
    selectedGuests,
    selectedCustomerName,
    selectedCustomerPhone,
    setOrderType,
    setTable,
    setGuests,
    setCustomerInfo,
    isTableOccupied
  } = useStore();
  
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || '';
  };

  const subtotal = currentOrder.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const hasPendingItems = currentOrder.some(i => i.status === 'pending');
  const hasSentItems = currentOrder.some(i => i.status === 'sent');

  // Validation Logic
  const isDineInValid = selectedOrderType === 'DINE_IN' && selectedTable !== null && selectedTable > 0;
  const isTakeawayDeliveryValid = (selectedOrderType === 'TAKEAWAY' || selectedOrderType === 'DELIVERY') && 
                                  selectedCustomerName.trim() !== '' && 
                                  selectedCustomerPhone.trim() !== '';
  
  const isValid = selectedOrderType === 'DINE_IN' ? isDineInValid : isTakeawayDeliveryValid;

  const handleSendToKitchen = async () => {
    if (!isValid) {
      setShowValidationErrors(true);
      toast({
        title: "Information Required",
        description: "Please fill in all mandatory fields before sending to the kitchen.",
        variant: "destructive"
      });
      return;
    }

    if (selectedOrderType === 'DINE_IN' && selectedTable && isTableOccupied(selectedTable)) {
      toast({
        title: "Table Occupied",
        description: `Table ${selectedTable} is currently in use by another open order.`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    await submitOrderToKitchen();
    setShowValidationErrors(false);
    toast({
      title: "Order Processed",
      description: "✅ Kitchen ticket printed (1 copy). Items sent.",
    });
    setIsProcessing(false);
  };

  const handleCompletePayment = async () => {
    if (hasPendingItems) {
      toast({
        title: "Pending Items",
        description: "Please send all items to the kitchen before completing the payment.",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    await completeOrder();
    toast({
      title: "Payment Complete",
      description: "✅ Bill printed (2 copies: Customer & Internal).",
    });
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <CardTitle>Basket</CardTitle>
          </div>
          {hasSentItems && (
             <Badge variant="outline" className="text-xs font-normal border-amber-200 bg-amber-50 text-amber-700 animate-pulse">
               <Clock className="w-3 h-3 mr-1" />
               Live Order
             </Badge>
          )}
        </div>
        
        <Tabs 
          value={selectedOrderType} 
          onValueChange={(v) => {
            setOrderType(v as OrderType);
            setShowValidationErrors(false);
          }}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="DINE_IN" className="text-xs">Dine-In</TabsTrigger>
            <TabsTrigger value="TAKEAWAY" className="text-xs">Takeaway</TabsTrigger>
            <TabsTrigger value="DELIVERY" className="text-xs">Delivery</TabsTrigger>
          </TabsList>
        </Tabs>

        {selectedOrderType === 'DINE_IN' && (
          <div className="grid grid-cols-2 gap-2 mt-3">
             <div className="relative">
                <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Table #" 
                  type="number" 
                  value={selectedTable || ''} 
                  onChange={(e) => setTable(parseInt(e.target.value) || null)}
                  className={`pl-8 h-9 text-sm transition-all ${showValidationErrors && !selectedTable ? 'border-destructive ring-1 ring-destructive' : ''}`}
                />
                {showValidationErrors && !selectedTable && <span className="text-[10px] text-destructive absolute -bottom-4 left-0">Required*</span>}
             </div>
             <div className="relative">
                <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Guests" 
                  type="number"
                  value={selectedGuests || ''} 
                  onChange={(e) => setGuests(parseInt(e.target.value) || null)}
                  className="pl-8 h-9 text-sm"
                />
             </div>
          </div>
        )}

        {(selectedOrderType === 'TAKEAWAY' || selectedOrderType === 'DELIVERY') && (
          <div className="grid grid-cols-2 gap-2 mt-3">
             <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Customer Name" 
                  value={selectedCustomerName} 
                  onChange={(e) => setCustomerInfo(e.target.value, selectedCustomerPhone)}
                  className={`pl-8 h-9 text-sm transition-all ${showValidationErrors && !selectedCustomerName ? 'border-destructive ring-1 ring-destructive' : ''}`}
                />
                {showValidationErrors && !selectedCustomerName && <span className="text-[10px] text-destructive absolute -bottom-4 left-0">Required*</span>}
             </div>
             <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Mobile Num" 
                  value={selectedCustomerPhone}
                  onChange={(e) => setCustomerInfo(selectedCustomerName, e.target.value)}
                  className={`pl-8 h-9 text-sm transition-all ${showValidationErrors && !selectedCustomerPhone ? 'border-destructive ring-1 ring-destructive' : ''}`}
                />
                {showValidationErrors && !selectedCustomerPhone && <span className="text-[10px] text-destructive absolute -bottom-4 left-0">Required*</span>}
             </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0 mt-2">
        <ScrollArea className="h-full px-6">
          {currentOrder.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
               <p>Your basket is empty.</p>
               <p className="text-sm">Select items from the menu.</p>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              {currentOrder.map((item) => (
                <div key={item.id} className={`group flex items-start justify-between gap-4 p-2 rounded-lg transition-colors ${item.status === 'sent' ? 'bg-slate-50/50' : 'bg-primary/5'}`}>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm leading-tight text-slate-800">{item.name}</p>
                      {item.status === 'sent' ? (
                        <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px] h-4 px-1">SENT</Badge>
                      ) : (
                        <Badge variant="default" className="bg-emerald-500 text-white text-[10px] h-4 px-1">NEW</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rs {item.price.toFixed(2)} {getCategoryName(item.categoryId) && `• ${getCategoryName(item.categoryId)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateProductQuantity(item.productId, parseInt(e.target.value, 10) || 1)}
                          className="h-8 w-12 p-1 text-center text-sm bg-white"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeProductFromOrder(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-700">x{item.quantity}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">sent</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <div className="mt-auto p-6 pt-0 bg-white shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <Separator className="mb-4" />
        <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
                <span>VAT (15%)</span>
                <span>Rs {vat.toFixed(2)}</span>
            </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-extrabold text-xl text-slate-900">
          <span>Total</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
      </div>

      <CardFooter className="flex flex-col gap-2 p-6 pt-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="default"
            className="flex-1 h-12 text-md font-semibold bg-primary hover:bg-primary/90 shadow-md" 
            onClick={handleSendToKitchen}
            disabled={currentOrder.length === 0 || !hasPendingItems || isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <ChefHat className="w-4 h-4 mr-2" />
            Place Order
          </Button>
          
          <Button 
            variant="secondary"
            className="flex-1 h-12 text-md font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md disabled:bg-slate-200" 
            onClick={handleCompletePayment}
            disabled={currentOrder.length === 0 || hasPendingItems || isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
          onClick={clearCurrentOrder}
          disabled={currentOrder.length === 0 || isProcessing}
        >
          Cancel Order
        </Button>
      </CardFooter>
    </div>
  );
}