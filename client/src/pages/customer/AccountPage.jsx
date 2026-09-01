import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Plus, Trash2, LogOut, Edit3, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfile, addAddress, updateAddress, deleteAddress, logout } from '../../redux/slices/auth.slice.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';

export const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses'
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);

  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ name, email })).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(newAddr)).unwrap();
      toast.success('Address added successfully!');
      setShowAddAddressModal(false);
      setNewAddr({
        name: user?.name || '',
        phone: user?.phone || '',
        house: '',
        street: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
      });
    } catch (err) {
      toast.error(err || 'Failed to add address');
    }
  };

  const handleEditAddressSubmit = async (e) => {
    e.preventDefault();
    if (!editingAddr || !editingAddr._id) return;
    try {
      await dispatch(updateAddress({ id: editingAddr._id, data: editingAddr })).unwrap();
      toast.success('Address updated successfully!');
      setShowEditAddressModal(false);
      setEditingAddr(null);
    } catch (err) {
      toast.error(err || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await dispatch(deleteAddress(addrId)).unwrap();
      toast.success('Address removed');
    } catch (err) {
      toast.error(err || 'Failed to delete address');
    }
  };

  return (
    <div className="pt-8 pb-28 bg-[#FAFAFA] min-h-screen text-stone-900 overflow-x-hidden relative">
      {/* Subtle modern dot-grid background texture matching HomePage */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div>
            <BlurText
              text="My Account"
              delay={60}
              className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight"
            />
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Manage your personal profile, delivery addresses, and purchase history.
            </p>
          </div>
          <Link
            to="/account/orders"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-900 hover:bg-stone-900 hover:text-white transition-all shadow-xs group"
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card space-y-4">
            {/* User Profile Snippet */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-stone-900 font-display truncate">{user?.name}</h3>
                <p className="text-xs text-stone-400 truncate font-medium">{user?.phone}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Verified Customer'}
                </span>
              </div>
            </div>

            {/* Nav Menu */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-stone-900 text-white shadow-card'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <User className="w-4 h-4" /> Personal Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-stone-900 text-white shadow-card'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <MapPin className="w-4 h-4" /> Saved Addresses ({user?.addresses?.length || 0})
              </button>

              <Link
                to="/account/orders"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all text-left"
              >
                <Package className="w-4 h-4" /> Order History
              </Link>

              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-6">
            
            {/* Tab 1: Profile Form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <h2 className="text-xl font-black text-stone-900 font-display pb-3 border-b border-stone-100">
                  Personal Information
                </h2>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-stone-700 font-bold block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-700 font-bold block">Phone Number (Verified)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.phone || ''}
                      className="w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 font-medium text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-700 font-bold block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <ClickSpark sparkColor="#E86A2C">
                    <button
                      type="submit"
                      className="py-3 px-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all cursor-pointer hover:scale-101 active:scale-99"
                    >
                      <ShinyText speed={2}>Save Changes</ShinyText>
                    </button>
                  </ClickSpark>
                </div>
              </form>
            )}

            {/* Tab 2: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-xl font-black text-stone-900 font-display">
                    Saved Delivery Addresses
                  </h2>
                  <ClickSpark sparkColor="#E86A2C">
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-card hover:bg-stone-800 transition-all cursor-pointer hover:scale-101 active:scale-99"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Address</span>
                    </button>
                  </ClickSpark>
                </div>

                {user?.addresses?.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-xs font-medium space-y-2">
                    <MapPin className="w-8 h-8 mx-auto text-stone-300 stroke-[1.5]" />
                    <p>No delivery addresses saved yet. Click "Add Address" above to save one.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <SpotlightCard
                        key={addr._id}
                        spotlightColor="rgba(232, 106, 44, 0.06)"
                        className="p-5 rounded-2xl border border-stone-200/80 hover:border-stone-300 bg-white shadow-2xs space-y-3 relative flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-black text-stone-900 font-display">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full border border-stone-200">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed font-medium">{addr.house}, {addr.street}</p>
                          {addr.area && <p className="text-xs text-stone-500 font-medium">{addr.area}</p>}
                          <p className="text-xs text-stone-500 font-medium">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-xs text-stone-600 font-bold pt-1">📞 {addr.phone}</p>
                        </div>

                        {/* Action Buttons: Edit and Delete */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddr({ ...addr });
                              setShowEditAddressModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-amber-700 p-1.5 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                            title="Edit address"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-float border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-black text-stone-900 font-display">Add Delivery Address</h3>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="Phone Number"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-bold mb-1 block">House / Flat / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat / Building"
                  value={newAddr.house}
                  onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold mb-1 block">Street / Colony *</label>
                <input
                  type="text"
                  required
                  placeholder="Street / Colony"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Area / Locality</label>
                  <input
                    type="text"
                    placeholder="Area / Locality"
                    value={newAddr.area || ''}
                    onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="Landmark"
                    value={newAddr.landmark || ''}
                    onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold shadow-xs hover:bg-stone-800 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditAddressModal && editingAddr && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-float border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-black text-stone-900 font-display">Edit Delivery Address</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditAddressModal(false);
                  setEditingAddr(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditAddressSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={editingAddr.name || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="Phone Number"
                    value={editingAddr.phone || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-bold mb-1 block">House / Flat / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat / Building"
                  value={editingAddr.house || ''}
                  onChange={(e) => setEditingAddr({ ...editingAddr, house: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold mb-1 block">Street / Colony *</label>
                <input
                  type="text"
                  required
                  placeholder="Street / Colony"
                  value={editingAddr.street || ''}
                  onChange={(e) => setEditingAddr({ ...editingAddr, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Area / Locality</label>
                  <input
                    type="text"
                    placeholder="Area / Locality"
                    value={editingAddr.area || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="Landmark"
                    value={editingAddr.landmark || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={editingAddr.city || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={editingAddr.state || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-bold mb-1 block">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={editingAddr.pincode || ''}
                    onChange={(e) => setEditingAddr({ ...editingAddr, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAddressModal(false);
                    setEditingAddr(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold shadow-xs hover:bg-stone-800 cursor-pointer"
                >
                  Update Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
