import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  login,
  signup,
  verifySignup,
  closeAuthModal,
  setAuthModalTab,
  clearError,
} from '../../redux/slices/auth.slice.js';
import { fetchServerCart } from '../../redux/slices/cart.slice.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { ShinyText } from '../reactbits/ShinyText.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';

export const AuthModal = () => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const { isAuthModalOpen, authModalTab, authModalData, loading, error, isAuthenticated } =
    useSelector((state) => state.auth);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP verification states
  const [pendingPhone, setPendingPhone] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Reset password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Reset inputs when modal opens or tab changes
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      dispatch(clearError());
      if (authModalData?.phone) {
        setPhone(authModalData.phone.replace('+91', '').trim());
        setPendingPhone(authModalData.phone);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen, authModalTab, authModalData, dispatch]);

  // Close modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      dispatch(closeAuthModal());
      dispatch(fetchServerCart());
    }
  }, [isAuthenticated, isAuthModalOpen, dispatch]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if ((authModalTab === 'verify' || authModalTab === 'reset') && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [authModalTab, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Format 10 digit Indian phone number input
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length <= 10) {
      setPhone(rawVal);
    }
  };

  // Helper to ensure +91 standard format for API
  const getFormattedPhone = () => {
    const clean = phone.replace(/\D/g, '');
    return clean.startsWith('91') && clean.length === 12 ? `+${clean}` : `+91${clean}`;
  };

  // 1. Submit Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }
    if (!password) {
      toast.error('Enter your password');
      return;
    }

    try {
      const fullPhone = getFormattedPhone();
      await dispatch(login({ phone: fullPhone, password })).unwrap();
      toast.success('Welcome back!');
      dispatch(closeAuthModal());
      dispatch(fetchServerCart());
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Login failed';
      toast.error(msg);
    }
  };

  // 2. Submit Sign Up (Triggers OTP)
  const handleSignupSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!name.trim()) {
      toast.error('Enter your full name');
      return;
    }
    if (phone.length < 10) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const fullPhone = getFormattedPhone();
      setPendingPhone(fullPhone);
      await dispatch(
        signup({
          name: name.trim(),
          phone: fullPhone,
          email: email.trim() || undefined,
          password,
        })
      ).unwrap();

      toast.success('OTP sent to your number');
      setResendTimer(60);
      setCanResend(false);
      dispatch(setAuthModalTab('verify'));
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  // 3. Submit OTP Verification
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }

    try {
      await dispatch(
        verifySignup({
          phone: pendingPhone || getFormattedPhone(),
          otp,
        })
      ).unwrap();

      toast.success('Account verified successfully!');
      dispatch(closeAuthModal());
      dispatch(fetchServerCart());
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Invalid or expired OTP';
      toast.error(msg);
    }
  };

  // 4. Request Password Reset OTP
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }

    const fullPhone = getFormattedPhone();
    setPendingPhone(fullPhone);

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { phone: fullPhone });
      toast.success('Reset code sent');
      setResendTimer(60);
      setCanResend(false);
      dispatch(setAuthModalTab('reset'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    }
  };

  // 5. Submit New Password Reset
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Enter 6-digit reset code');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password too short');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        phone: pendingPhone,
        otp,
        newPassword,
      });
      toast.success('Password updated');
      setPassword('');
      dispatch(setAuthModalTab('login'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background Click to Dismiss */}
      <div
        className="absolute inset-0"
        onClick={() => dispatch(closeAuthModal())}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Close Button */}
        <button
          onClick={() => dispatch(closeAuthModal())}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors z-20 cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-5 px-6 text-center border-b border-stone-100 bg-stone-50/70 relative z-10">
          <div className="inline-flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-display font-black tracking-tight leading-none text-stone-900">
              The Dogs <span className="text-amber-700">Garage</span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            {authModalTab === 'login' && 'Sign in to access your account & orders'}
            {authModalTab === 'signup' && 'Create your account for pets & accessories'}
            {authModalTab === 'verify' && 'Verify your mobile number with OTP'}
            {authModalTab === 'forgot' && 'Reset your password with OTP'}
            {authModalTab === 'reset' && 'Create a new secure password'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10">
          {/* TAB 1: SIGN IN */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Phone Input with styled +91 badge */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Mobile Number</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-700 font-bold text-xs select-none shrink-0 min-w-[52px]">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    required
                    maxLength={10}
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400 tracking-wide"
                  />
                </div>
              </div>

              {/* Password Input with matching icon badge */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => dispatch(setAuthModalTab('forgot'))}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <Lock className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 self-stretch flex items-center justify-center text-stone-400 hover:text-stone-600 cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button with ClickSpark & ShinyText */}
              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 cursor-pointer hover:scale-101 active:scale-99"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShinyText speed={2.5}>Sign In</ShinyText>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </ClickSpark>

              <div className="text-center pt-2">
                <p className="text-xs text-stone-500 font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => dispatch(setAuthModalTab('signup'))}
                    className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {authModalTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Full Name with matching User badge */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Full Name *</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <UserIcon className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    required
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Phone with styled +91 Prefix */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Mobile Number *</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-700 font-bold text-xs select-none shrink-0 min-w-[52px]">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    required
                    maxLength={10}
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400 tracking-wide"
                  />
                </div>
              </div>

              {/* Optional Email with matching Mail badge */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Email Address (Optional)</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <Mail className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@gmail.com"
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Password with matching Lock badge */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Create Password (min 6 chars) *</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <Lock className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 self-stretch flex items-center justify-center text-stone-400 hover:text-stone-600 cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit with ClickSpark & ShinyText */}
              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 cursor-pointer hover:scale-101 active:scale-99"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShinyText speed={2.5}>Create Account & Send OTP</ShinyText>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                    </>
                  )}
                </button>
              </ClickSpark>

              {/* Switch link below Create Account button */}
              <div className="text-center pt-2">
                <p className="text-xs text-stone-500 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => dispatch(setAuthModalTab('login'))}
                    className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 3: VERIFY OTP */}
          {authModalTab === 'verify' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-center">
                <p className="text-xs text-stone-600 font-medium">
                  We sent a 6-digit verification code to:
                </p>
                <p className="text-sm font-black text-stone-900 font-display tracking-wide mt-0.5">
                  {pendingPhone}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Enter 6-Digit OTP</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <KeyRound className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    autoFocus
                    required
                    className="w-full py-3 text-center text-xl font-black tracking-widest text-stone-900 bg-transparent outline-none font-display"
                  />
                </div>
              </div>

              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 cursor-pointer hover:scale-101 active:scale-99"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <ShinyText speed={2}>Verify & Continue</ShinyText>
                    </>
                  )}
                </button>
              </ClickSpark>

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={() => dispatch(setAuthModalTab('signup'))}
                  className="text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  Change Number
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSignupSubmit}
                    className="text-amber-700 hover:text-amber-800 hover:underline font-bold cursor-pointer"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-stone-400">Resend in {resendTimer}s</span>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {authModalTab === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Registered Mobile Number</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-700 font-bold text-xs select-none shrink-0 min-w-[52px]">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    required
                    maxLength={10}
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400 tracking-wide"
                  />
                </div>
              </div>

              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 cursor-pointer hover:scale-101 active:scale-99"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShinyText speed={2}>Send Reset Code</ShinyText>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                    </>
                  )}
                </button>
              </ClickSpark>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => dispatch(setAuthModalTab('login'))}
                  className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: RESET PASSWORD */}
          {authModalTab === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">6-Digit Reset Code</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <KeyRound className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    required
                    className="w-full py-3 text-center text-lg font-black tracking-widest text-stone-900 bg-transparent outline-none font-display"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">New Password (min 6 chars)</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <Lock className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Confirm New Password</label>
                <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                    <Lock className="w-4 h-4 text-stone-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-3 bg-transparent text-xs font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 cursor-pointer hover:scale-101 active:scale-99"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <ShinyText speed={2}>Reset Password & Sign In</ShinyText>
                    </>
                  )}
                </button>
              </ClickSpark>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
