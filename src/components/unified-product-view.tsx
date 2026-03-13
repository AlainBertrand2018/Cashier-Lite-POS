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
        "group relative aspect-square flex flex-col overflow-hidden transition-all hover:shadow-xl cursor-pointer border-slate-200 dark:border-slate-800 rounded-2xl",
        disabled && "opacity-60 cursor-not-allowed"
      )}
      onClick={() => !disabled && addProductToOrder(product)}
    >
      {/* Background Image / Icon */}
      <div className="absolute inset-0 w-full h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <span className="text-5xl">{iconSrc || '🍴'}</span>
          </div>
        )}
      </div>

      {/* Badges/Tags (Overlay Top) */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
        <Badge 
          variant={disabled ? 'destructive' : 'secondary'} 
          className={cn(
            'text-[10px] px-2 py-0.5 h-auto shadow-md backdrop-blur-sm border-none font-bold uppercase tracking-wider',
            !disabled && 'bg-emerald-500 text-white'
          )}
        >
          {is86 ? "86'd" : isOutOfStock ? 'Sold Out' : `${product.stock} Left`}
        </Badge>
      </div>

      {/* Content Section (Bottom White Overlay) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900/95 p-3 flex flex-col gap-0.5 border-t border-slate-100 dark:border-slate-800 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)]">
        <p className="text-[11px] font-bold leading-tight line-clamp-1 text-slate-800 dark:text-slate-100 uppercase tracking-tight">
          {product.name}
        </p>
        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
          Rs {price.toFixed(2)}
        </p>
      </div>

      {/* Hover Selection Effect */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300 pointer-events-none" />
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
    fetchCategories(true);
    fetchProducts(true);
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
