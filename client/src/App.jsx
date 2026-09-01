import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { Check, AlertCircle, X } from 'lucide-react';
import { router } from './routes/index.jsx';
import { getMe } from './redux/slices/auth.slice.js';
import { fetchServerCart } from './redux/slices/cart.slice.js';
import { fetchStoreSettings } from './redux/slices/setting.slice.js';
import { AuthModal } from './components/auth/AuthModal.jsx';

export function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStoreSettings());
    if (localStorage.getItem('tdg_auth_token')) {
      dispatch(getMe());
      dispatch(fetchServerCart());
    }
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <AuthModal />
      <Toaster position="bottom-left" reverseOrder={false} gutter={10}>
        {(t) => (
          <div
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border shadow-lg transition-all duration-300 pointer-events-auto select-none ${
              t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
            } ${
              t.type === 'error'
                ? 'bg-[#FEF2F2] border-red-200/90 text-stone-900 shadow-red-950/5'
                : t.type === 'loading'
                ? 'bg-[#F8FAFC] border-stone-200 text-stone-900 shadow-stone-950/5'
                : 'bg-[#EBF5EE] border-emerald-200/90 text-stone-900 shadow-emerald-950/5'
            }`}
          >
            {/* Status Icon Badge */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs ${
                t.type === 'error'
                  ? 'bg-[#EF4444]'
                  : t.type === 'loading'
                  ? 'bg-tdg-orange'
                  : 'bg-[#10B981]'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : t.type === 'loading' ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              )}
            </div>

            {/* Concise Message Text */}
            <p className="text-xs sm:text-[13px] font-bold text-stone-800 tracking-tight leading-snug pr-1">
              {typeof t.message === 'function' ? t.message(t) : t.message}
            </p>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-black/5 rounded-lg transition-colors cursor-pointer shrink-0 ml-auto"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </Toaster>
    </>
  );
}

export default App;
