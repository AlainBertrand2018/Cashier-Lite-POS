'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronRight, 
  Plus, 
  AlertCircle,
  UtensilsCrossed,
  Flame,
  Leaf,
  Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AddProductDialog from '@/components/add-product-dialog';
import EditProductDialog from '@/components/edit-product-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, MoreVertical, Trash2, EyeOff, Eye } from 'lucide-react';

export default function MenuPage() {
  const { 
    products, 
    categories,
    suppliers,
    fetchProducts, 
    fetchSuppliers,
    fetchCategories,
    deleteProduct,
    editProduct,
    simulatedUser
  } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchCategories();
  }, [fetchProducts, fetchSuppliers, fetchCategories]);

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !activeCategory || p.categoryId === activeCategory)
    .sort((a, b) => {
      const catA = categories.find(c => c.id === a.categoryId);
      const catB = categories.find(c => c.id === b.categoryId);
      return (catA?.sortOrder || 0) - (catB?.sortOrder || 0);
    });

  const lowStockProducts = products.filter(p => p.stock < 10);
  const unavailableCount = products.filter(p => p.isAvailable === false).length;

  const toggle86 = (productId: string, current: boolean) => {
    editProduct(productId, { isAvailable: !current });
  };

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
               <h1 className="text-3xl font-bold tracking-tight text-slate-100 italic">🍽️ Menu & Stock</h1>
              <p className="text-slate-400 mt-1">Manage your menu items, pricing, and daily availability.</p>
            </div>
            <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Menu Item
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500">Total Menu Items</p>
                <p className="text-2xl font-bold text-slate-100">{products.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500">Low Stock</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</p>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500">86'd Items</p>
                <p className="text-2xl font-bold text-red-500">{unavailableCount}</p>
              </CardContent>
            </Card>
             <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-500">Categories</p>
                <p className="text-2xl font-bold text-blue-500">{categories.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button 
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className={activeCategory === null ? "bg-emerald-600 text-white" : "border-slate-800 text-slate-400"}
            >
              All
            </Button>
            {categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map(cat => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={activeCategory === cat.id ? "bg-emerald-600 text-white" : "border-slate-800 text-slate-400"}
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </div>

          {/* Search + Menu Grid */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search menu items..." 
              className="pl-10 bg-slate-950 border-slate-800 text-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const category = categories.find(c => c.id === product.categoryId);
              const supplier = suppliers.find(s => s.id === product.supplierId);
              const isLow = product.stock < 10;
              const is86 = product.isAvailable === false;
              return (
                <Card 
                  key={product.id} 
                  className={`bg-slate-900 border-slate-800 relative group transition-all ${is86 ? 'opacity-50' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category?.icon || '🍴'}</span>
                        <div>
                          <CardTitle className="text-sm leading-tight">{product.name}</CardTitle>
                          <CardDescription className="text-xs mt-0.5 line-clamp-1">{product.description}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                          <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" onClick={() => setEditingProduct(product)}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" onClick={() => toggle86(product.id, !!product.isAvailable)}>
                            {product.isAvailable !== false ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {product.isAvailable !== false ? '86 This Item' : 'Make Available'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-emerald-400">Rs {product.basePrice}</span>
                      <span className="text-[10px] text-slate-500">Cost: Rs {product.buyingPrice}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {product.dietaryTags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] h-5 border-slate-700 text-slate-400">
                          {tag === 'Vegan' && <Leaf className="h-2.5 w-2.5 mr-0.5 text-green-400" />}
                          {tag === 'Spicy' && <Flame className="h-2.5 w-2.5 mr-0.5 text-red-400" />}
                          {tag}
                        </Badge>
                      ))}
                      {product.prepTime && product.prepTime > 0 && (
                        <Badge variant="outline" className="text-[10px] h-5 border-slate-700 text-slate-400">
                          <Clock className="h-2.5 w-2.5 mr-0.5" /> {product.prepTime}m
                        </Badge>
                      )}
                    </div>

                    {/* Stock bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Stock</span>
                        <span className={isLow ? 'text-orange-400 font-bold' : ''}>{product.stock} units</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isLow ? 'bg-orange-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((product.stock / (product.initialStock || 100)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {is86 && (
                      <div className="text-center">
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">86'd — Unavailable</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <AddProductDialog isOpen={isAddOpen} onOpenChange={setAddOpen} />
        {editingProduct && (
          <EditProductDialog 
            isOpen={!!editingProduct} 
            onOpenChange={(open) => !open && setEditingProduct(null)} 
            product={editingProduct} 
          />
        )}
      </main>
    </div>
  );
}
