import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const fullPhone = `+91${phone.replace(/\D/g, '').slice(-10)}`;
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { phone: fullPhone });
      toast.success('OTP sent to your phone number!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    const fullPhone = `+91${phone.replace(/\D/g, '').slice(-10)}`;
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        phone: fullPhone,
        otp,
        newPassword,
      });
      toast.success('Password updated successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-[#FAFAFA] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="bg-white w-full max-w-md rounded-3xl p-8 border border-stone-200/90 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-1.5 pb-1">
          <Link to="/" className="inline-flex items-center justify-center">
            <h2 className="text-2xl font-display font-black tracking-tight leading-tight text-stone-900">
              The Dogs <span className="text-amber-700">Garage</span>
            </h2>
          </Link>
          <p className="text-xs text-stone-500 font-medium">
            {step === 1
              ? 'Enter your mobile number to receive a verification OTP.'
              : 'Enter the OTP and set your new password.'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-stone-700 font-bold">Registered Mobile Number</label>
              <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-700 font-bold text-xs select-none shrink-0 min-w-[52px]">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-3.5 py-3 bg-transparent font-bold text-stone-900 outline-none placeholder:text-stone-400 tracking-wide text-xs"
                />
              </div>
            </div>

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
                    <ShinyText speed={2.5}>Send Verification OTP</ShinyText>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </>
                )}
              </button>
            </ClickSpark>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-stone-700 font-bold">6-Digit OTP</label>
              <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                  <KeyRound className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full py-3 text-center text-xl font-black tracking-widest text-stone-900 bg-transparent outline-none font-display"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-stone-700 font-bold">New Password (min 6 characters)</label>
              <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                  <Lock className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-3 bg-transparent font-bold text-stone-900 outline-none placeholder:text-stone-400 text-xs"
                />
              </div>
            </div>

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
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <ShinyText speed={2.5}>Update Password & Sign In</ShinyText>
                  </>
                )}
              </button>
            </ClickSpark>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-stone-500 hover:text-stone-900"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
