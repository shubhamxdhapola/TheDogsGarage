import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { signup, clearError } from '../../redux/slices/auth.slice.js';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Enter your full name');
      return;
    }
    if (phone.length < 10) {
      toast.error('Invalid mobile number');
      return;
    }
    if (password.length < 6) {
      toast.error('Password too short');
      return;
    }

    const fullPhone = `+91${phone}`;

    try {
      await dispatch(
        signup({ name: name.trim(), phone: fullPhone, email: email.trim(), password })
      ).unwrap();
      toast.success('OTP sent');
      navigate('/verify-otp', {
        state: { phone: fullPhone, signupData: { name, phone: fullPhone, email, password } },
      });
    } catch (err) {
      toast.error(err || 'Registration failed');
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
            Join The Dogs Garage community with phone verification.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 text-xs font-semibold">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-stone-700 font-bold">Full Name *</label>
            <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
              <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                <User className="w-4 h-4 text-stone-400" />
              </div>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-3 bg-transparent font-bold text-stone-900 outline-none placeholder:text-stone-400 text-xs"
              />
            </div>
          </div>

          {/* Phone with +91 Prefix */}
          <div className="space-y-1">
            <label className="text-stone-700 font-bold">Mobile Number *</label>
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

          {/* Optional Email */}
          <div className="space-y-1">
            <label className="text-stone-700 font-bold">Email Address (Optional)</label>
            <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
              <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                <Mail className="w-4 h-4 text-stone-400" />
              </div>
              <input
                type="email"
                placeholder="rahul@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-3 bg-transparent font-bold text-stone-900 outline-none placeholder:text-stone-400 text-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-stone-700 font-bold">Password (min 6 chars) *</label>
            <div className="relative flex items-stretch rounded-xl border border-stone-200/90 bg-stone-50/60 focus-within:border-stone-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 transition-all overflow-hidden">
              <div className="flex items-center justify-center px-4 self-stretch bg-stone-100/80 border-r border-stone-200 text-stone-600 shrink-0 min-w-[52px]">
                <Lock className="w-4 h-4 text-stone-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 bg-transparent font-bold text-stone-900 outline-none placeholder:text-stone-400 text-xs"
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

          {/* Submit */}
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
                  <ShinyText speed={2.5}>Create Account & Verify OTP</ShinyText>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </ClickSpark>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center border-t border-stone-100">
          <p className="text-xs text-stone-500 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
