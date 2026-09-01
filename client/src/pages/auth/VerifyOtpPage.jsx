import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, RotateCcw, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifySignup, sendOtp } from '../../redux/slices/auth.slice.js';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';

export const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const signupData = location.state?.signupData;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!signupData) {
      navigate('/signup');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [signupData, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      await dispatch(
        verifySignup({
          phone: signupData.phone,
          otp,
        })
      ).unwrap();

      toast.success('Account verified and logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Invalid or expired OTP');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      const result = await dispatch(sendOtp({ phone: signupData.phone })).unwrap();
      toast.success(result.message || 'New OTP sent!');
      setTimer(60);
    } catch (err) {
      toast.error(err || 'Failed to resend OTP');
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
            Enter the 6-digit verification code sent to your phone.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-center">
          <p className="text-xs text-stone-600 font-medium">OTP sent to:</p>
          <p className="text-sm font-black text-stone-900 font-display tracking-wide mt-0.5">
            {signupData?.phone}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-stone-700 font-bold">Enter 6-Digit OTP</label>
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <ShinyText speed={2}>Verify & Activate Account</ShinyText>
                </>
              )}
            </button>
          </ClickSpark>

          <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <Link to="/signup" className="text-stone-500 hover:text-stone-900">
              Change Number
            </Link>

            {timer === 0 ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-amber-700 hover:text-amber-800 hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Resend OTP
              </button>
            ) : (
              <span className="text-stone-400">Resend in {timer}s</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
