'use client';

import { useStore } from '@/lib/store';
import type { Product, Category } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { Coffee, UtensilsCrossed } from 'lucide-react';
import { Button } from './ui/button';

// Helper to determine if a category is considered "Drinks"
function isDrinkCategory(categoryName: string) {
  const name = categoryName.toLowerCase();
  return (
    name.includes('drink') || 
    name.includes('beverage') || 
    name.includes('beer') || 
    name.includes('wine') || 
    name.includes('cocktail') || 
    name.includes('spirit') || 
    name.includes('coffee') || 
    name.includes('tea') ||
    name.includes('juice')
  );
}

function ProductCard({ product, iconSrc }: { product: Product, iconSrc?: string }) {
  const { addProductToOrder, activeShift, getProductPrice } = useStore();
  
  const price = useMemo(() => {
    if (!activeShift) return product.basePrice;
    return getProductPrice(product.id, activeShift.locationId);
  }, [product, activeShift, getProductPrice]);

  const isOutOfStock = product.stock <= 0;
  const is86 = product.isAvailable === false;
  
  const disabled = isOutOfStock || is86;

  return (
    <Card 
      className={cn(
        "flex flex-col overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full relative border-slate-200 dark:border-slate-800",
        disabled && "opacity-50 cursor-not-allowed hover:shadow-sm"
        )}
      onClick={() => !disabled && addProductToOrder(product)}
    >
        <CardContent className="relative flex-grow p-0 flex flex-col items-center gap-0">
            {/* Image Section */}
            <div className="w-full h-24 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <span className="text-4xl">{iconSrc || '🍴'}</span>
              )}

              <Badge 
                variant={disabled ? 'destructive' : 'secondary'} 
                className={cn(
                    'absolute top-2 right-2 text-[10px] px-1.5 py-0 h-4 shadow-sm',
                    !disabled && 'bg-emerald-500 text-white border-none'
                )}
              >
              {is86 ? "86'd" : isOutOfStock ? 'Empty' : `${product.stock} left`}
              </Badge>
            </div>

            {/* Content Section */}
            <div className="p-3 w-full text-center flex flex-col gap-1">
              <p className="text-xs font-bold leading-tight line-clamp-1 text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                {product.name}
              </p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                Rs {price.toFixed(2)}
              </p>
            </div>
        </CardContent>
    </Card>
  );
}

export default function UnifiedProductView() {
  const { products, categories, fetchCategories, fetchProducts, activeShift } = useStore();
  
  // Default mode based on role
  const initialMode = activeShift?.role === 'Floor' ? 'FOOD' : 'DRINKS';
  const [menuMode, setMenuMode] = useState<'FOOD' | 'DRINKS'>(initialMode);

  // Sync mode if activeShift role changes (e.g., another user logs in using same browser window)
  useEffect(() => {
    setMenuMode(activeShift?.role === 'Floor' ? 'FOOD' : 'DRINKS');
  }, [activeShift?.role]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Separate categories into Food and Drinks
  const drinkCategoryIds = useMemo(() => {
    return categories.filter(c => isDrinkCategory(c.name)).map(c => c.id);
  }, [categories]);

  // Get products based on current mode
  const displayedProducts = useMemo(() => {
    if (menuMode === 'DRINKS') {
      return products.filter(p => drinkCategoryIds.includes(p.categoryId));
    } else {
      return products.filter(p => !drinkCategoryIds.includes(p.categoryId));
    }
  }, [menuMode, products, drinkCategoryIds]);

  // Group products by category to display them in a visually organized way
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    displayedProducts.forEach(product => {
      if (!groups[product.categoryId]) {
        groups[product.categoryId] = [];
      }
      groups[product.categoryId].push(product);
    });
    
    // Sort groups by category sortOrder
    const sortedGroups = Object.entries(groups).sort(([catIdA], [catIdB]) => {
      const catA = categories.find(c => c.id === catIdA);
      const catB = categories.find(c => c.id === catIdB);
      return (catA?.sortOrder || 0) - (catB?.sortOrder || 0);
    });

    return sortedGroups;
  }, [displayedProducts, categories]);

  return (
    <div className="space-y-4">
      {/* Top Toggle Bar */}
      <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1 gap-1">
        <Button 
          variant={menuMode === 'FOOD' ? 'default' : 'ghost'}
          className={cn("flex-1 font-semibold text-lg h-12", menuMode === 'FOOD' && "bg-white text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 shadow-sm")}
          onClick={() => setMenuMode('FOOD')}
        >
          <UtensilsCrossed className="w-5 h-5 mr-2" />
          FOOD MENU
        </Button>
        <Button 
          variant={menuMode === 'DRINKS' ? 'default' : 'ghost'}
          className={cn("flex-1 font-semibold text-lg h-12", menuMode === 'DRINKS' && "bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400 shadow-sm")}
          onClick={() => setMenuMode('DRINKS')}
        >
          <Coffee className="w-5 h-5 mr-2" />
          DRINKS
        </Button>
      </div>

      {/* Product Grid Grouped by Category */}
      <div className="space-y-6 pb-20">
        {groupedProducts.map(([categoryId, catProducts]) => {
          const category = categories.find(c => c.id === categoryId);
          if (!category) return null;

          return (
            <div key={categoryId} className="space-y-3">
              <h3 className="flex items-center gap-2 text-md font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                  {catProducts.map(product => (
                      <ProductCard key={product.id} product={product} iconSrc={category.icon} />
                  ))}
              </div>
            </div>
          );
        })}

        {displayedProducts.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center text-slate-500">
              No menu items found in this section.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
