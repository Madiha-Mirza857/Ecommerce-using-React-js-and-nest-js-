import React, { useState } from 'react';
import {
  X,
  Package,
  FolderTree,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  Tag
} from 'lucide-react';
import { Product, CategoryItem, Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  categories?: CategoryItem[];
  categoriesList?: CategoryItem[];
  orders?: Order[];
  onRefreshData?: () => void;
  onRefreshProducts?: () => void;
  onRefreshCategories?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products = [],
  categories = [],
  categoriesList = [],
  orders = [],
  onRefreshData,
  onRefreshProducts,
  onRefreshCategories,
}) => {
  const safeProducts = products || [];
  const safeCategories = (categories && categories.length > 0) ? categories : categoriesList;
  const safeOrders = orders || [];
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const [searchTerm, setSearchTerm] = useState('');

  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '',
    price: '',
    category: '',
    description: '',
    composition: '',
    careInstructions: '',
    inStock: true,
    isNewArrival: true,
    isBestseller: false,
    images: [] as string[],
    colorsText: 'Onyx Charcoal (#1a1a1a), Sandstone (#d2c8bc)',
    sizesText: 'XS, S, M, L, XL',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  // Status message
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // --- IMAGE FILE UPLOAD HANDLER ---
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls],
      }));
      showNotification(`Uploaded ${data.urls.length} image(s) to project folder!`);
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // --- PRODUCT SUBMIT ---
  const handleOpenProductForm = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        subtitle: prod.subtitle,
        price: String(prod.price),
        category: prod.category,
        description: prod.description,
        composition: prod.composition || '',
        careInstructions: prod.careInstructions || '',
        inStock: prod.inStock,
        isNewArrival: Boolean(prod.isNewArrival),
        isBestseller: Boolean(prod.isBestseller),
        images: prod.images || [],
        colorsText: prod.colors.map((c) => `${c.name} (${c.hex})`).join(', '),
        sizesText: prod.sizes.join(', '),
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        subtitle: '',
        price: '',
        category: categories[0]?.name || 'Outerwear',
        description: '',
        composition: '100% Fine Fibers',
        careInstructions: 'Dry clean only',
        inStock: true,
        isNewArrival: true,
        isBestseller: false,
        images: [],
        colorsText: 'Onyx Charcoal (#1a1a1a), Sandstone (#d2c8bc)',
        sizesText: 'XS, S, M, L, XL',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse colors
    const colors = productForm.colorsText.split(',').map((item) => {
      const match = item.match(/(.+)\((#.+)\)/);
      if (match) return { name: match[1].trim(), hex: match[2].trim() };
      return { name: item.trim() || 'Default', hex: '#1a1a1a' };
    });

    const sizes = productForm.sizesText.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: productForm.name,
      subtitle: productForm.subtitle,
      price: Number(productForm.price),
      category: productForm.category || categories[0]?.name || 'Outerwear',
      description: productForm.description,
      composition: productForm.composition,
      careInstructions: productForm.careInstructions,
      inStock: productForm.inStock,
      isNewArrival: productForm.isNewArrival,
      isBestseller: productForm.isBestseller,
      images: productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000'],
      colors,
      sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save product');
      }

      showNotification(editingProduct ? 'Product updated successfully!' : 'New product created!');
      setIsProductModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    if (onRefreshData) onRefreshData();
    if (onRefreshProducts) onRefreshProducts();
    if (onRefreshCategories) onRefreshCategories();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      showNotification('Product deleted');
      handleRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- CATEGORY SUBMIT ---
  const handleOpenCategoryForm = (cat?: CategoryItem) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ name: cat.name, description: cat.description || '' });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save category');
      }

      showNotification(editingCategory ? 'Category updated!' : 'New category created!');
      setIsCategoryModalOpen(false);
      handleRefresh();
    } catch (err: any) {
      alert(`Error saving category: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      showNotification('Category deleted');
      handleRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- UPDATE ORDER STATUS ---
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update order status');

      showNotification(`Order ${orderId} status set to ${newStatus}`);
      handleRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProducts = safeProducts.filter(
    (p) =>
      p &&
      ((p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof p.category === 'string' ? p.category : (p as any).categoryName || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-[#fdfbf7] rounded-xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl border border-[#1a1a1a]/20 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-[#1a1a1a] text-[#fdfbf7] flex flex-wrap items-center justify-between gap-4 border-b border-[#1a1a1a]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#8b4513] text-white ui-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                ADMIN CONSOLE
              </span>
              <h2 className="serif-display text-2xl font-bold">Atelier Store Management</h2>
            </div>
            <p className="ui-mono text-xs text-[#fdfbf7]/70 mt-0.5">
              Control catalog products, local image uploads, categories, and order fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs ui-mono flex items-center gap-1.5"
              title="Refresh backend database"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Sync DB</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#fdfbf7]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className="bg-[#8b4513] text-white px-6 py-2 text-xs ui-mono font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-[#f7f4ee] border-b border-[#1a1a1a]/15 px-6 flex gap-2 sm:gap-6 ui-mono text-xs font-bold text-[#5a5853]">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent hover:text-[#1a1a1a]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({safeProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3.5 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'categories'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent hover:text-[#1a1a1a]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({safeCategories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#8b4513] text-[#8b4513]'
                : 'border-transparent hover:text-[#1a1a1a]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({safeOrders.length})</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5853]" />
                  <input
                    type="text"
                    placeholder="Search products or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-xs ui-mono text-[#1a1a1a] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>

                <button
                  onClick={() => handleOpenProductForm()}
                  className="bg-[#8b4513] hover:bg-[#1a1a1a] text-white px-4 py-2.5 rounded ui-mono text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload & Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded-lg overflow-x-auto shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#f7f4ee] border-b border-[#1a1a1a]/15 ui-mono font-bold text-[#5a5853]">
                    <tr>
                      <th className="p-3">Garment</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3">Images</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/10">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#f7f4ee]/50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded bg-[#f5f2eb] shrink-0 border border-[#1a1a1a]/10"
                          />
                          <div>
                            <p className="serif-display text-sm font-bold text-[#1a1a1a]">{p.name}</p>
                            <p className="ui-mono text-[10px] text-[#5a5853]">{p.subtitle}</p>
                          </div>
                        </td>
                        <td className="p-3 ui-mono font-bold text-[#1a1a1a]">
                          <span className="bg-[#f7f4ee] border border-[#1a1a1a]/15 px-2 py-1 rounded">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3 ui-mono font-bold text-[#8b4513]">${p.price}</td>
                        <td className="p-3 ui-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.inStock
                                ? 'bg-[#8b4513]/10 text-[#8b4513]'
                                : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-3 ui-mono text-[11px] text-[#5a5853]">
                          {p.images.length} file(s)
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenProductForm(p)}
                            className="p-1.5 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded border border-[#1a1a1a]/15 transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white rounded border border-[#ba1a1a]/20 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES CRUD */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="ui-mono text-xs text-[#5a5853]">
                  Manage dynamic product categories. Products assigned to categories will update automatically.
                </p>
                <button
                  onClick={() => handleOpenCategoryForm()}
                  className="bg-[#8b4513] hover:bg-[#1a1a1a] text-white px-4 py-2.5 rounded ui-mono text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {safeCategories.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded-lg p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="serif-display text-lg font-bold text-[#1a1a1a]">{c.name}</h3>
                        <span className="ui-mono text-[10px] bg-[#8b4513]/10 text-[#8b4513] font-bold px-2 py-0.5 rounded">
                          {c.productCount || 0} Products
                        </span>
                      </div>
                      <p className="ui-mono text-xs text-[#5a5853] mt-1">
                        {c.description || 'Standard atelier collection category.'}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#1a1a1a]/10">
                      <button
                        onClick={() => handleOpenCategoryForm(c)}
                        className="p-1.5 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded border border-[#1a1a1a]/15 text-xs ui-mono font-bold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1.5 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white rounded border border-[#ba1a1a]/20 text-xs ui-mono font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <p className="ui-mono text-xs text-[#5a5853]">
                Customer order history and order fulfillment status management.
              </p>

              <div className="space-y-4">
                {safeOrders.length === 0 ? (
                  <p className="ui-mono text-xs text-[#5a5853] py-8 text-center">No customer orders placed yet.</p>
                ) : (
                  safeOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded-lg p-5 space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1a1a]/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="serif-display text-base font-bold text-[#1a1a1a]">{ord.id}</span>
                            <span className="ui-mono text-[10px] text-[#5a5853]">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="ui-mono text-xs font-bold text-[#8b4513]">
                            {ord.customerName} ({ord.customerEmail})
                          </p>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2">
                          <span className="ui-mono text-xs font-bold text-[#5a5853]">Order Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-[#fdfbf7] border border-[#1a1a1a]/20 rounded px-3 py-1.5 ui-mono text-xs font-bold text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs ui-mono">
                        <div className="md:col-span-2 space-y-2">
                          <p className="font-bold text-[#5a5853]">Order Items:</p>
                          <div className="space-y-2">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-[#fdfbf7] p-2 rounded border border-[#1a1a1a]/10">
                                <div className="flex items-center gap-2">
                                  <img src={item.image} alt={item.productName} className="w-8 h-10 object-cover rounded" />
                                  <div>
                                    <p className="font-bold text-[#1a1a1a]">{item.productName}</p>
                                    <p className="text-[10px] text-[#5a5853]">Color: {item.color} | Size: {item.size} x{item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-bold text-[#8b4513]">${item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#fdfbf7] p-3 rounded border border-[#1a1a1a]/10 space-y-1.5">
                          <p className="font-bold text-[#5a5853]">Shipping Details:</p>
                          <p className="text-[#1a1a1a]">{ord.address}</p>
                          <p className="text-[#1a1a1a]">{ord.city}, {ord.country}</p>
                          <hr className="border-[#1a1a1a]/10 my-1" />
                          <div className="flex justify-between font-bold text-[#1a1a1a]">
                            <span>Total Billed:</span>
                            <span className="text-[#8b4513]">${ord.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: PRODUCT EDIT / CREATE WITH FILE UPLOAD --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-[#fdfbf7] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-[#1a1a1a]/20 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1a1a1a]/15 pb-3">
              <h3 className="serif-display text-xl font-bold text-[#1a1a1a]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-[#1a1a1a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 ui-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Garment Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Subtitle / Headline</label>
                  <input
                    type="text"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  />
                </div>
              </div>

              {/* LOCAL FILE UPLOAD SECTION */}
              <div className="bg-[#f7f4ee] p-4 rounded border border-[#1a1a1a]/15 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-[#1a1a1a] font-bold">
                    📸 Upload Product Images (Saved in /public/uploads):
                  </label>
                  {uploadingImage && <span className="text-[#8b4513] font-bold animate-pulse">Uploading...</span>}
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="block w-full text-xs text-[#5a5853] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#1a1a1a] file:text-white hover:file:bg-[#8b4513] file:cursor-pointer"
                />

                {/* Thumbnails of uploaded images */}
                {productForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {productForm.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img src={imgUrl} alt="uploaded" className="w-16 h-20 object-cover rounded border border-[#1a1a1a]/20" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1 -right-1 bg-[#ba1a1a] text-white rounded-full p-0.5 hover:scale-110"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Colors (e.g. Onyx (#1a1a1a))</label>
                  <input
                    type="text"
                    value={productForm.colorsText}
                    onChange={(e) => setProductForm({ ...productForm, colorsText: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Sizes (e.g. S, M, L, XL)</label>
                  <input
                    type="text"
                    value={productForm.sizesText}
                    onChange={(e) => setProductForm({ ...productForm, sizesText: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="accent-[#8b4513]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                    className="accent-[#8b4513]"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="accent-[#8b4513]"
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a1a1a] hover:bg-[#8b4513] text-white py-3 rounded ui-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CATEGORY EDIT / CREATE --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative bg-[#fdfbf7] rounded-xl max-w-md w-full p-6 border border-[#1a1a1a]/20 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1a1a1a]/15 pb-3">
              <h3 className="serif-display text-xl font-bold text-[#1a1a1a]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 text-[#1a1a1a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 ui-mono text-xs">
              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a1a1a] hover:bg-[#8b4513] text-white py-3 rounded ui-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
