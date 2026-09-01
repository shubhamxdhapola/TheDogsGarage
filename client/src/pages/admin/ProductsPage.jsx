import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit3, Trash2, Image, Check, X, Box, ChevronDown, UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal.jsx';
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../redux/slices/product.slice.js';
import { formatCurrency } from '../../utils/helpers.js';

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, categories, pagination, loading } = useSelector((state) => state.products);

  const productFileRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [prodToDelete, setProdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Dog Food',
    price: '',
    originalPrice: '',
    discount: 0,
    stock: 20,
    description: '',
    packageSize: '1 unit',
    images: [],
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (category !== 'All') params.category = category;

    dispatch(fetchProducts(params));
  }, [dispatch, search, category, page]);

  const handleOpenAddModal = () => {
    setEditingProd(null);
    setFormData({
      name: '',
      sku: `TDG-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      category: 'Dog Food',
      price: '',
      originalPrice: '',
      discount: 0,
      stock: 10,
      description: '',
      packageSize: '',
      images: [],
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProd(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      discount: prod.discount || 0,
      stock: prod.stock,
      description: prod.description,
      packageSize: prod.packageSize || '1 unit',
      images: prod.images && prod.images.length > 0 ? prod.images : [],
      isActive: prod.isActive !== undefined ? prod.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        images: formData.images && formData.images.length > 0 ? formData.images.slice(0, 5) : [],
      };

      if (editingProd) {
        await dispatch(updateProduct({ id: editingProd._id, data: payload })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success('Product created successfully!');
      }
      setModalOpen(false);
      dispatch(fetchProducts({ page, limit: 10 }));
    } catch (err) {
      toast.error(err || 'Failed to save product');
    }
  };

  const handleConfirmDelete = async () => {
    if (!prodToDelete) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteProduct(prodToDelete._id)).unwrap();
      toast.success(`Product "${prodToDelete.name}" deleted successfully`);
      setProdToDelete(null);
      dispatch(fetchProducts({ page, limit: 10 }));
    } catch (err) {
      toast.error(err || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentCount = formData.images?.length || 0;
    if (currentCount + files.length > 5) {
      toast.error(`Maximum 5 photos allowed per product. (Currently have ${currentCount})`);
      return;
    }

    setUploadingImage(true);
    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append('images', file));
    uploadFormData.append('folder', 'the-dogs-garage/products');

    try {
      const res = await axiosInstance.post(API_PATHS.UPLOAD.IMAGE, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrls = (res.data.files || []).map((f) => f.secure_url || f.url);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls].slice(0, 5),
      }));
      toast.success(`Uploaded ${uploadedUrls.length} photo(s)!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      if (productFileRef.current) productFileRef.current.value = '';
    }
  };

  const handleRemoveProductImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
    }));
  };

  const handleToggleStatus = async (prod) => {
    try {
      await dispatch(
        updateProduct({ id: prod._id, data: { isActive: !prod.isActive } })
      ).unwrap();
      toast.success(`Product ${prod.name} is now ${!prod.isActive ? 'Active' : 'Inactive'}`);
      dispatch(fetchProducts({ page, limit: 10 }));
    } catch (err) {
      toast.error(err || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
            Accessories & Inventory
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Manage pet foods, shampoos, grooming accessories and stock levels
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 w-fit rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter / Search Bar matching BarbaeQ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-700 outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Dog Food">Dog Food</option>
              <option value="Shampoo & Grooming">Shampoo & Grooming</option>
              <option value="Treats & Chews">Treats & Chews</option>
              <option value="Toys">Toys</option>
              <option value="Grooming">Grooming</option>
              <option value="Supplements">Supplements</option>
              <option value="Fragrances">Fragrances</option>
              <option value="Accessories">Accessories</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table matching BarbaeQ */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Product</th>
                <th className="py-4 px-6 whitespace-nowrap">SKU</th>
                <th className="py-4 px-6 whitespace-nowrap">Category</th>
                <th className="py-4 px-6 whitespace-nowrap">Price</th>
                <th className="py-4 px-6 whitespace-nowrap">Stock</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900 mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 font-bold">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0] || '/images/product-shampoo.jpg'}
                          alt={prod.name}
                          className="w-10 h-10 rounded-xl object-contain bg-zinc-50 p-1 border border-zinc-200/80"
                        />
                        <span className="font-bold text-zinc-900">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-500 text-[11px] whitespace-nowrap">{prod.sku}</td>
                    <td className="py-4 px-6 text-zinc-700 whitespace-nowrap">{prod.category}</td>
                    <td className="py-4 px-6 font-bold text-zinc-900 whitespace-nowrap">{formatCurrency(prod.price)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`font-bold ${prod.stock < 10 ? 'text-amber-600' : 'text-zinc-700'}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          prod.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/60 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProdToDelete(prod)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200/60 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal matching BarbaeQ Dialog */}
      {modalOpen && createPortal(
        <div
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 99999 }}
        >
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-base text-zinc-900 font-display">
                {editingProd ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-zinc-600">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Royal Canin Puppy Food – 3kg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-600">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none font-mono text-zinc-900 focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-600">Category *</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 cursor-pointer focus:border-zinc-900 focus:bg-white"
                    >
                      <option value="Dog Food">Dog Food</option>
                      <option value="Shampoo & Grooming">Shampoo & Grooming</option>
                      <option value="Treats & Chews">Treats & Chews</option>
                      <option value="Toys">Toys</option>
                      <option value="Grooming">Grooming</option>
                      <option value="Supplements">Supplements</option>
                      <option value="Fragrances">Fragrances</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-600">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1450"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-600">Original Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="1650"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-600">Stock Count *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Product Photos Upload (Max 5) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-600 font-bold">
                    Product Photos ({(formData.images || []).length}/5) *
                  </label>
                  <span className="text-[11px] text-zinc-400 font-medium">Up to 5 photos (1st is cover)</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={productFileRef}
                    multiple
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={uploadingImage || (formData.images || []).length >= 5}
                    onClick={() => productFileRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Uploading photos...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 text-amber-400" />
                        <span>{(formData.images || []).length >= 5 ? 'Max 5 Photos Added' : 'Upload Photos'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 5-Photo Grid Preview */}
                <div className="grid grid-cols-5 gap-2.5 pt-1">
                  {(formData.images || []).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-2xl overflow-hidden border border-zinc-200 aspect-square bg-zinc-50 p-1 flex items-center justify-center"
                    >
                      <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-contain" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-zinc-900/80 text-white text-[9px] font-bold">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveProductImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {[...Array(Math.max(0, 5 - (formData.images || []).length))].map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      onClick={() => {
                        if (!uploadingImage && (formData.images || []).length < 5) {
                          productFileRef.current?.click();
                        }
                      }}
                      className="rounded-2xl border-2 border-dashed border-zinc-200 aspect-square flex flex-col items-center justify-center text-zinc-300 hover:border-zinc-400 hover:text-zinc-400 transition-colors cursor-pointer"
                      title="Click to add photo"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">Slot {(formData.images || []).length + i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-600">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nutritional facts and features..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-600 font-bold text-xs hover:bg-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs shadow-sm hover:bg-zinc-800 cursor-pointer active:scale-95 transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Minimal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(prodToDelete)}
        onClose={() => setProdToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        itemName={prodToDelete?.name}
        description={`Are you sure you want to permanently delete "${prodToDelete?.name}" (${prodToDelete?.sku})? This action will remove the product and inventory record.`}
        loading={isDeleting}
      />
    </div>
  );
};
