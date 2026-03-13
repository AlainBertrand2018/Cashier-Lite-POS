
'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function OrderSummary() {
  const { 
    currentOrder, 
    updateProductQuantity, 
    removeProductFromOrder, 
    clearCurrentOrder,
    completeOrder,
    categories
  } = useStore();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || '';
  };

  const subtotal = currentOrder.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const handlePlaceOrder = async () => {
    if (currentOrder.length > 0) {
      setIsPlacingOrder(true);
      await completeOrder();
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <CardTitle>Basket</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-6">
          {currentOrder.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
               <p>Your basket is empty.</p>
               <p className="text-sm">Select items from the menu.</p>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              {currentOrder.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <p className="font-medium text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Rs {item.price.toFixed(2)} {getCategoryName(item.categoryId) && `• ${getCategoryName(item.categoryId)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateProductQuantity(item.productId, parseInt(e.target.value, 10) || 1)}
                      className="h-8 w-14 p-1 text-center text-sm"
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
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <div className="mt-auto p-6 pt-0">
        <Separator className="my-4" />
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
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
      </div>
      <CardFooter className="flex flex-col gap-2 p-6 pt-0">
        <Button 
          className="w-full h-12 text-lg shadow-md" 
          onClick={handlePlaceOrder}
          disabled={currentOrder.length === 0 || isPlacingOrder}
        >
          {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPlacingOrder ? 'Processing...' : 'Complete Order'}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-muted-foreground" 
          onClick={clearCurrentOrder}
          disabled={currentOrder.length === 0 || isPlacingOrder}
        >
          Cancel Order
        </Button>
      </CardFooter>
    </div>
  );
}