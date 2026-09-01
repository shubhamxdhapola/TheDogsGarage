import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Home,
  Dog,
  ShoppingBag,
  User,
  ShoppingBasket,
} from 'lucide-react';
import { openCartDrawer } from '../../redux/slices/cart.slice.js';
import { openAuthModal } from '../../redux/slices/auth.slice.js';

export const BottomNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { totalItemsCount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      exact: true,
    },
    {
      name: 'Puppies',
      path: '/pets',
      icon: Dog,
      exact: false,
    },
    {
      name: 'Shop',
      path: '/accessories',
      icon: ShoppingBag,
      exact: false,
    },
  ];

  const handleBagClick = () => {
    dispatch(openCartDrawer());
  };

  const handleAccountClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      dispatch(openAuthModal({ tab: 'login' }));
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-2xl border-t border-stone-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-15 px-1 max-w-md mx-auto">
        {/* Navigation Links */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-0.5"
              >
                <div
                  className={`relative p-1 rounded-xl transition-colors ${
                    isActive
                      ? 'text-stone-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavDot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600"
                    />
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'font-black text-stone-900 font-display'
                      : 'font-bold text-stone-400'
                  }`}
                >
                  {item.name}
                </span>
              </motion.div>
            </NavLink>
          );
        })}

        {/* Bag / Cart Trigger */}
        <button
          type="button"
          onClick={handleBagClick}
          className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none cursor-pointer"
        >
          <motion.div
            whileTap={{ scale: 0.88 }}
            className="flex flex-col items-center gap-0.5"
          >
            <div className="relative p-1 rounded-xl text-stone-400 hover:text-stone-700 transition-colors">
              <ShoppingBasket className="w-5 h-5 stroke-[2.2]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
              Bag
            </span>
          </motion.div>
        </button>

        {/* Account / Login Tab */}
        <NavLink
          to="/account"
          onClick={handleAccountClick}
          className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none"
        >
          {({ isActive }) => {
            const isAccountActive = isActive || location.pathname.startsWith('/account');

            return (
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-0.5"
              >
                <div
                  className={`relative p-1 rounded-xl transition-colors ${
                    isAccountActive
                      ? 'text-stone-900'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <User className="w-5 h-5 stroke-[2.2]" />
                  {isAccountActive && (
                    <motion.div
                      layoutId="bottomNavDot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-600"
                    />
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider transition-colors ${
                    isAccountActive
                      ? 'font-black text-stone-900 font-display'
                      : 'font-bold text-stone-400'
                  }`}
                >
                  {isAuthenticated ? 'Account' : 'Login'}
                </span>
              </motion.div>
            );
          }}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNavbar;
