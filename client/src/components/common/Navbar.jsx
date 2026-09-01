import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  User,
  Package,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { logout, openAuthModal } from '../../redux/slices/auth.slice.js';
import { openCartDrawer } from '../../redux/slices/cart.slice.js';
import { SearchModal } from './SearchModal.jsx';
import { Logo } from './Logo.jsx';
import { FlowingMenu } from '../reactbits/FlowingMenu.jsx';
import { ShinyText } from '../reactbits/ShinyText.jsx';
import { Magnet } from '../reactbits/Magnet.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItemsCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Puppies', path: '/pets' },
    { name: 'Shop', path: '/accessories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200/70 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo with Magnet effect */}
            <div className="flex items-center">
              <Logo size="md" />
            </div>

            {/* Desktop Center Nav Links with FlowingMenu */}
            <div className="hidden md:flex items-center">
              <FlowingMenu items={navLinks} />
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search trigger */}
              <Magnet padding={15} magnetStrength={0.2}>
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-200 cursor-pointer"
                  title="Search pets and products"
                >
                  <Search className="w-5 h-5" />
                </button>
              </Magnet>

              {/* Cart Bag Icon with Animated Badge */}
              <Magnet padding={15} magnetStrength={0.2}>
                <ClickSpark sparkColor="#E86A2C">
                  <button
                    type="button"
                    onClick={() => dispatch(openCartDrawer())}
                    className="relative p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-200 cursor-pointer"
                    title="Shopping Bag"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <AnimatePresence>
                      {totalItemsCount > 0 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                        >
                          {totalItemsCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </ClickSpark>
              </Magnet>

              {/* User Dropdown / Profile Button */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-stone-200 hover:border-stone-400 transition-all duration-200 shadow-xs hover:shadow-subtle cursor-pointer select-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs overflow-hidden leading-none">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="leading-none flex items-center justify-center">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-stone-900 max-w-[110px] truncate leading-none">
                      {user.role === 'ADMIN' ? 'Admin' : user.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 overflow-hidden"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Signed in as</p>
                          <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-stone-500 truncate">{user.phone}</p>
                        </div>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-700" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          to="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <User className="w-4 h-4 text-stone-400" />
                          My Profile & Addresses
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <Package className="w-4 h-4 text-stone-400" />
                          My Orders
                        </Link>

                        <div className="border-t border-stone-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <ClickSpark sparkColor="#E86A2C">
                  <button
                    onClick={() => dispatch(openAuthModal({ tab: 'login' }))}
                    className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <ShinyText speed={2.5}>Sign In</ShinyText>
                  </button>
                </ClickSpark>
              )}
            </div>

            {/* Mobile Actions: Search & Profile Dropdown */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full cursor-pointer"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Profile Trigger & Dropdown */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs shadow-xs overflow-hidden cursor-pointer shrink-0 leading-none"
                    title="Account Options"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="leading-none flex items-center justify-center">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => dispatch(openAuthModal({ tab: 'login' }))}
                    className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full cursor-pointer transition-colors"
                    title="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}

                {/* Mobile Dropdown Menu Popup */}
                <AnimatePresence>
                  {dropdownOpen && isAuthenticated && user && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-display">Signed in as</p>
                        <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user.phone || user.email}</p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-700" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>My Profile & Addresses</span>
                      </Link>

                      <Link
                        to="/account/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        <span>My Orders</span>
                      </Link>

                      <div className="border-t border-stone-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};

export default Navbar;
