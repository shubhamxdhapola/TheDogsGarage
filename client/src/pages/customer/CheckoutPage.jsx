import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, CheckCircle2, CreditCard, ArrowRight, Lock, MapPin, Sparkles, AlertCircle, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createOrder, verifyPayment } from '../../redux/slices/order.slice.js';
import { getMe, updateAddress } from '../../redux/slices/auth.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { Stepper } from '../../components/reactbits/Stepper.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';

// Dynamic Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], subtotal, discount = 0, deliveryCharge, total } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: orderLoading } = useSelector((state) => state.orders);
  const { settings } = useSelector((state) => state.settings);

  const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 999;
  const standardDeliveryFee = settings?.standardDeliveryFee ?? 99;
  const hasSavedAddresses = Boolean(user?.addresses && user.addresses.length > 0);

  // Compute robust totals with fallback
  const computedSubtotal =
    typeof subtotal === 'number' && subtotal > 0
      ? subtotal
      : items.reduce((acc, it) => acc + (it.price || it.product?.price || 0) * (it.quantity || 1), 0);

  const computedDeliveryCharge =
    typeof deliveryCharge === 'number'
      ? deliveryCharge
      : computedSubtotal >= freeDeliveryThreshold || computedSubtotal === 0
      ? 0
      : standardDeliveryFee;

  const computedTotal =
    typeof total === 'number' && total > 0
      ? total
      : computedSubtotal + computedDeliveryCharge;

  const [step, setStep] = useState(1); // 1: Delivery Details, 2: Payment, 3: Review
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isNewAddress, setIsNewAddress] = useState(!hasSavedAddresses);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'COD'
  const [saveAddress, setSaveAddress] = useState(true);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null);

  const handleEditAddressSubmit = async (e) => {
    e.preventDefault();
    if (!editingAddr || !editingAddr._id) return;
    try {
      await dispatch(updateAddress({ id: editingAddr._id, data: editingAddr })).unwrap();
      toast.success('Address updated successfully!');
      setShowEditAddressModal(false);
      if (user?.addresses[selectedAddressIndex]?._id === editingAddr._id) {
        setAddressForm({
          name: editingAddr.name || '',
          phone: editingAddr.phone || '',
          email: editingAddr.email || user.email || '',
          house: editingAddr.house || '',
          street: editingAddr.street || '',
          area: editingAddr.area || '',
          landmark: editingAddr.landmark || '',
          city: editingAddr.city || '',
          state: editingAddr.state || '',
          pincode: editingAddr.pincode || '',
        });
      }
      setEditingAddr(null);
    } catch (err) {
      toast.error(err || 'Failed to update address');
    }
  };

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    house: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      if (!isNewAddress) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddressForm({
          name: defaultAddr.name || user.name || '',
          phone: defaultAddr.phone || user.phone || '',
          email: defaultAddr.email || user.email || '',
          house: defaultAddr.house || '',
          street: defaultAddr.street || '',
          area: defaultAddr.area || '',
          landmark: defaultAddr.landmark || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          pincode: defaultAddr.pincode || '',
        });
      }
    } else {
      setIsNewAddress(true);
    }
  }, [user, isNewAddress]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.house || !addressForm.street || !addressForm.city || !addressForm.pincode) {
      toast.error('Please fill in all required delivery fields.');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep(2);
    }
  };

  // Razorpay Checkout handler
  const openRazorpayWindow = async (orderData, razorpayOrderData) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Could not load secure Razorpay gateway. Please check internet connection.');
      return;
    }

    const rzpOptions = {
      key: razorpayOrderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TUWfCS6KIFn2nu',
      amount: razorpayOrderData.amount,
      currency: razorpayOrderData.currency || 'INR',
      name: settings?.storeName || 'The Dogs Garage',
      description: `Order #${orderData.orderId}`,
      order_id: razorpayOrderData.id,
      prefill: {
        name: addressForm.name || user?.name,
        email: addressForm.email || user?.email,
        contact: addressForm.phone || user?.phone,
      },
      theme: {
        color: '#18181B',
      },
      handler: async function (response) {
        try {
          toast.loading('Verifying payment signature...', { id: 'verifying-payment' });
          await dispatch(
            verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id || razorpayOrderData.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
          ).unwrap();
          toast.dismiss('verifying-payment');

          toast.success('Payment received and verified! Order confirmed.');
          navigate(`/order-success/${orderData.orderId}`);
        } catch (err) {
          toast.dismiss('verifying-payment');
          toast.error(err || 'Payment verification failed');
        }
      },
      modal: {
        ondismiss: function () {
          toast.error('Payment was cancelled or closed.');
          setPendingPaymentOrder({
            order: orderData,
            razorpayOrder: razorpayOrderData,
          });
        },
      },
    };

    const rzp = new window.Razorpay(rzpOptions);
    rzp.on('payment.failed', function (response) {
      toast.error(response.error?.description || 'Payment transaction failed. Please retry.');
      setPendingPaymentOrder({
        order: orderData,
        razorpayOrder: razorpayOrderData,
      });
    });
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    try {
      const shouldSaveAddress = hasSavedAddresses ? (isNewAddress && saveAddress) : saveAddress;

      const payload = {
        items: items.map((i) => ({
          productId: i.product._id || i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: addressForm,
        paymentMethod,
        saveAddress: Boolean(shouldSaveAddress),
      };

      const result = await dispatch(createOrder(payload)).unwrap();

      if (shouldSaveAddress) {
        dispatch(getMe());
      }

      if (paymentMethod === 'COD') {
        toast.success('Order placed successfully with Cash on Delivery!');
        navigate(`/order-success/${result.order.orderId}`);
        return;
      }

      // Online UPI / Razorpay payment flow
      if (result.razorpayOrder) {
        await openRazorpayWindow(result.order, result.razorpayOrder);
      }
    } catch (err) {
      toast.error(err || 'Failed to initiate order. Please try again.');
    }
  };

  const stepsConfig = [
    { title: 'Delivery Details' },
    { title: 'Payment' },
    { title: 'Order Review' },
  ];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Stepper Navigation */}
        <div className="max-w-xl mx-auto px-4 py-2">
          <Stepper
            steps={stepsConfig}
            currentStep={step - 1}
            onStepClick={(idx) => {
              if (idx === 0 || validateAddress()) {
                setStep(idx + 1);
              }
            }}
          />
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form / Steps */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Delivery Details */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" /> Delivery Information
                  </h2>
                  {user?.addresses && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isNewAddress) {
                          setIsNewAddress(true);
                          setSaveAddress(true);
                          setAddressForm({
                            name: user?.name || '',
                            phone: user?.phone || '',
                            email: user?.email || '',
                            house: '',
                            street: '',
                            area: '',
                            landmark: '',
                            city: '',
                            state: '',
                            pincode: '',
                          });
                        } else {
                          setIsNewAddress(false);
                          setSaveAddress(false);
                          const addr = user.addresses[selectedAddressIndex] || user.addresses[0];
                          if (addr) {
                            setAddressForm({
                              name: addr.name || user.name || '',
                              phone: addr.phone || user.phone || '',
                              email: addr.email || user.email || '',
                              house: addr.house || '',
                              street: addr.street || '',
                              area: addr.area || '',
                              landmark: addr.landmark || '',
                              city: addr.city || '',
                              state: addr.state || '',
                              pincode: addr.pincode || '',
                            });
                          }
                        }
                      }}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer transition-colors"
                    >
                      {isNewAddress ? '← Use Saved Address' : '+ Add New Address'}
                    </button>
                  )}
                </div>

                {/* MODE A: Saved Address Selection Cards */}
                {user?.addresses && user.addresses.length > 0 && !isNewAddress ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {user.addresses.map((addr, idx) => {
                        const isSelected = selectedAddressIndex === idx;
                        return (
                          <SpotlightCard
                            key={idx}
                            spotlightColor="rgba(232, 106, 44, 0.08)"
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-2 ring-amber-500/20'
                                : 'border-stone-200/80 hover:border-stone-300 bg-white'
                            }`}
                          >
                            <div
                              onClick={() => {
                                setSelectedAddressIndex(idx);
                                setIsNewAddress(false);
                                setSaveAddress(false);
                                setAddressForm({
                                  name: addr.name || user.name || '',
                                  phone: addr.phone || user.phone || '',
                                  email: addr.email || user.email || '',
                                  house: addr.house || '',
                                  street: addr.street || '',
                                  area: addr.area || '',
                                  landmark: addr.landmark || '',
                                  city: addr.city || '',
                                  state: addr.state || '',
                                  pincode: addr.pincode || '',
                                });
                              }}
                              className="space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="selectedAddress"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="accent-amber-600 w-4 h-4 cursor-pointer"
                                  />
                                  <span className="font-extrabold text-xs text-stone-900">{addr.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {addr.isDefault && (
                                    <span className="text-[10px] font-extrabold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full border border-stone-200">
                                      Default
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingAddr({ ...addr });
                                      setShowEditAddressModal(true);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-400 hover:text-amber-700 p-1 rounded hover:bg-stone-50 transition-colors cursor-pointer"
                                    title="Edit address"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-stone-600 pl-6 leading-relaxed">
                                {addr.house}, {addr.street}, {addr.area ? `${addr.area}, ` : ''}{addr.city} - {addr.pincode}
                              </p>
                            </div>
                            <p className="text-[11px] font-bold text-stone-500 pl-6 mt-2">
                              📞 {addr.phone}
                            </p>
                          </SpotlightCard>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <ClickSpark sparkColor="#E86A2C" className="w-full block">
                        <button
                          type="button"
                          onClick={handleProceedToPayment}
                          className="w-full py-4 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
                        >
                          <ShinyText speed={2.5}>Deliver to this Address</ShinyText>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </button>
                      </ClickSpark>
                    </div>
                  </div>
                ) : (
                  /* MODE B: Add New Address Form */
                  <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">Contact Name <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={addressForm.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">Mobile Phone <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="phone"
                          required
                          value={addressForm.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">Email Address (for invoice & tracking updates)</label>
                      <input
                        type="email"
                        name="email"
                        value={addressForm.email}
                        onChange={handleInputChange}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-stone-700 font-bold block">Flat / House / Building <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="house"
                          required
                          value={addressForm.house}
                          onChange={handleInputChange}
                          placeholder="A-402, Green Acres"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-stone-700 font-bold block">Street / Road / Colony <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="street"
                          required
                          value={addressForm.street}
                          onChange={handleInputChange}
                          placeholder="100ft Road, Indiranagar"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">Area / Locality</label>
                        <input
                          type="text"
                          name="area"
                          value={addressForm.area}
                          onChange={handleInputChange}
                          placeholder="Area / Locality"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">Landmark (Optional)</label>
                        <input
                          type="text"
                          name="landmark"
                          value={addressForm.landmark}
                          onChange={handleInputChange}
                          placeholder="Landmark"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">City <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={addressForm.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">State <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={addressForm.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-stone-700 font-bold block">PIN Code <span className="text-amber-600">*</span></label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={addressForm.pincode}
                          onChange={handleInputChange}
                          placeholder="PIN Code"
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium text-stone-900 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="accent-amber-600 w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-stone-600">Save address to my profile for future orders</span>
                    </label>

                    <div className="pt-4">
                      <ClickSpark sparkColor="#E86A2C" className="w-full block">
                        <button
                          type="submit"
                          className="w-full py-4 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
                        >
                          <ShinyText speed={2.5}>Proceed to Payment</ShinyText>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </button>
                      </ClickSpark>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-600" /> Choose Payment Option
                  </h2>
                  <span className="text-xs font-bold text-stone-400">Step 2 of 3</span>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Razorpay / UPI */}
                  <SpotlightCard
                    spotlightColor="rgba(232, 106, 44, 0.08)"
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <label className="flex items-start gap-4 w-full cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-900 font-display">
                            UPI / QR Code / NetBanking / Cards (Razorpay)
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Fast & Secure
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed font-medium">
                          Pay via Google Pay, PhonePe, Paytm, BHIM UPI, Debit/Credit Card, or NetBanking. Instant automated confirmation.
                        </p>
                      </div>
                    </label>
                  </SpotlightCard>

                  {/* Option 2: COD */}
                  <SpotlightCard
                    spotlightColor="rgba(83, 107, 79, 0.08)"
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <label className="flex items-start gap-4 w-full cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-900 font-display">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed font-medium">
                          Pay in cash or through UPI to the delivery courier when your package arrives.
                        </p>
                      </div>
                    </label>
                  </SpotlightCard>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3.5 px-6 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <ClickSpark sparkColor="#E86A2C" className="flex-1 block">
                    <button
                      onClick={() => setStep(3)}
                      className="w-full py-3.5 px-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
                    >
                      <ShinyText speed={2.5}>Continue to Review</ShinyText>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </ClickSpark>
                </div>
              </div>
            )}

            {/* Step 3: Order Review & Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Review & Confirm Order
                  </h2>
                  <span className="text-xs font-bold text-stone-400">Step 3 of 3</span>
                </div>

                {/* Pending Payment Alert Box if Modal was dismissed */}
                {pendingPaymentOrder && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-amber-900">
                          Payment window for Order {pendingPaymentOrder.order.orderId} was closed
                        </p>
                        <p className="text-[11px] text-amber-800 font-medium">
                          Your order was created with status <strong>Payment Pending</strong>. You can retry paying online now or complete it anytime in My Orders.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openRazorpayWindow(pendingPaymentOrder.order, pendingPaymentOrder.razorpayOrder)}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Retry Payment ({formatCurrency(pendingPaymentOrder.order.total)})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/account/orders')}
                        className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                      >
                        Go to My Orders
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.06)" className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <span className="font-black text-stone-400 uppercase tracking-wider block text-[10px]">Shipping To</span>
                    <p className="font-bold text-stone-900">{addressForm.name}</p>
                    <p className="text-stone-600 font-medium">{addressForm.house}, {addressForm.street}, {addressForm.city} - {addressForm.pincode}</p>
                    <p className="text-stone-500 font-medium">Phone: {addressForm.phone}</p>
                  </SpotlightCard>

                  <SpotlightCard spotlightColor="rgba(83, 107, 79, 0.06)" className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <span className="font-black text-stone-400 uppercase tracking-wider block text-[10px]">Payment Method</span>
                    <p className="font-bold text-stone-900">
                      {paymentMethod === 'UPI' ? 'Online (UPI / Razorpay Standard)' : 'Cash on Delivery'}
                    </p>
                    <p className="text-stone-500 font-medium">
                      {paymentMethod === 'UPI' ? 'Opens secure UPI / Cards window' : 'Pay when you receive package'}
                    </p>
                  </SpotlightCard>
                </div>

                {/* Items in Checkout */}
                <div className="space-y-3 pt-2">
                  <span className="font-black text-stone-400 uppercase tracking-wider block text-[10px]">Items ({items.length})</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.map((i) => (
                      <div key={i.product._id || i.product.id} className="flex items-center justify-between py-2 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={i.product.images?.[0] || i.product.image || '/images/product-shampoo.jpg'}
                            alt={i.product.name}
                            className="w-10 h-10 rounded-xl object-cover bg-stone-50 border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-xs text-stone-900 line-clamp-1">{i.product.name}</p>
                            <p className="text-[11px] text-stone-400 font-medium">Qty: {i.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-xs text-stone-900">
                          {formatCurrency(i.product.price * i.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="py-3.5 px-6 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <ClickSpark sparkColor="#10B981" className="flex-1 block">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="w-full py-4 px-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 cursor-pointer hover:scale-101 active:scale-99"
                    >
                      {orderLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-amber-400" />
                          <ShinyText speed={2.5}>
                            {paymentMethod === 'UPI' ? 'Pay Online Now' : 'Confirm Order (COD)'}
                          </ShinyText>
                        </>
                      )}
                    </button>
                  </ClickSpark>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Total Breakdown with SpotlightCard */}
          <SpotlightCard
            spotlightColor="rgba(232, 106, 44, 0.08)"
            className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-5"
          >
            <h3 className="font-black text-base text-stone-900 font-display pb-3 border-b border-stone-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal ({items.reduce((acc, it) => acc + (it.quantity || 1), 0)} items)</span>
                <span className="text-stone-900 font-bold">{formatCurrency(computedSubtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Product Discounts</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-500">
                <span>Standard Delivery</span>
                <span>{computedDeliveryCharge === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : formatCurrency(computedDeliveryCharge)}</span>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-stone-900">Total Payable</span>
                <span className="text-xl font-black text-stone-900 font-display">
                  {formatCurrency(computedTotal)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 space-y-2 border-t border-stone-100 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-bit encrypted secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>100% Genuine Pet Care guaranteed</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

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

export default CheckoutPage;
