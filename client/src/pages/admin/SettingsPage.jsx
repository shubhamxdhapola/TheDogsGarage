import React, { useState, useEffect } from 'react';
import { Save, Store, Phone, Mail, MapPin, Truck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

export const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "The Dog's Garage",
    tagline: 'Your Trusted Companion Haven & Accessories Store',
    contactEmail: 'thedogsgarage@gmail.com',
    contactPhone: '+91 62643 69991',
    whatsappNumber: '+91 62643 69991',
    instagramUrl: 'https://www.instagram.com/the_dogsgarage/',
    address: '100 Feet Road, Indiranagar, Bangalore, Karnataka - 560038',
    freeDeliveryThreshold: 999,
    standardDeliveryFee: 99,
    upiId: 'thedogsgarage@okhdfcbank',
    enableCOD: true,
    enableUPI: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API_PATHS.ADMIN.SETTINGS);
        if (res.data?.settings) {
          setFormData((prev) => ({
            ...prev,
            ...res.data.settings,
          }));
        }
      } catch (err) {
        console.error('Failed to load store settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosInstance.put(API_PATHS.ADMIN.SETTINGS, formData);
      if (res.data?.settings) {
        setFormData((prev) => ({ ...prev, ...res.data.settings }));
      }
      toast.success(res.data?.message || 'Store & Business configuration saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save store configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
          Store Settings
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Configure store business profile, contact channels, delivery rules and payment gateways
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-zinc-200 shadow-card flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
          <p className="text-xs font-semibold text-zinc-500">Loading store settings...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-card space-y-6 text-xs font-semibold"
        >
          {/* Business Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 pb-2 border-b border-zinc-100">
              <Store className="w-4 h-4 text-indigo-600" /> Business Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-600">Store Name</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-600">Store Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-600">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-600">WhatsApp Chat Line</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-600">Support Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-600">Instagram Profile URL</label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/the_dogsgarage/"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-600">Physical Store Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 pb-2 border-b border-zinc-100">
              <Truck className="w-4 h-4 text-emerald-600" /> Delivery & Checkout Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-600">Standard Delivery Charge (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.standardDeliveryFee}
                  onChange={(e) => setFormData({ ...formData, standardDeliveryFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-600">Free Delivery Threshold (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.freeDeliveryThreshold}
                  onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Store Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
