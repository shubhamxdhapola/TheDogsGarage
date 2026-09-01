import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation, ScrollRestoration } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  ShoppingBag,
  Dog,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Store,
  PawPrint,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../redux/slices/auth.slice.js';
import { Logo } from '../components/common/Logo.jsx';
import { ScrollToTop } from '../components/common/ScrollToTop.jsx';

const getInitials = (name) => {
  if (!name) return 'AD';
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export const AdminLayout = () => {
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(() => {
    return localStorage.getItem('tdg_admin_sidebar_collapsed') !== 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tdg_admin_sidebar_collapsed', desktopSidebarExpanded ? 'false' : 'true');
  }, [desktopSidebarExpanded]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Live Stock (Pets)', path: '/admin/pets', icon: Dog },
    { name: 'Accessories', path: '/admin/accessories', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentNavItem = navItems.find((item) => location.pathname.startsWith(item.path)) || navItems[0];

  const navItemClass = ({ isActive }) => {
    const base = "flex items-center gap-3 transition-all duration-150 outline-none text-xs sm:text-sm font-semibold cursor-pointer group";
    
    if (desktopSidebarExpanded) {
      const active = "mx-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white shadow-sm font-bold";
      const inactive = "mx-2 px-3.5 py-2.5 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 font-medium";
      return `${base} ${isActive ? active : inactive}`;
    } else {
      const active = "mx-auto w-10 h-10 rounded-xl bg-zinc-900 text-white shadow-sm justify-center font-bold";
      const inactive = "mx-auto w-10 h-10 rounded-xl text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 justify-center font-medium";
      return `${base} ${isActive ? active : inactive}`;
    }
  };

  const mobileNavItemClass = ({ isActive }) => {
    const base = "flex items-center gap-3 mx-2 px-4 py-3 rounded-xl transition-all duration-150 outline-none text-sm font-semibold cursor-pointer";
    const active = "bg-zinc-900 text-white shadow-sm font-bold";
    const inactive = "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 font-medium";
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-zinc-900 font-sans antialiased">
      <ScrollRestoration />
      <ScrollToTop />
      {/* Mobile Drawer Overlay */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-xs lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Sidebar with Smooth Sliding Animation */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl lg:hidden flex flex-col justify-between border-r border-zinc-200 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-100">
            <Logo size="sm" to="/admin/dashboard" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="py-4 flex flex-col gap-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink key={idx} to={item.path} className={mobileNavItemClass}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50 m-2.5 rounded-2xl border border-zinc-200 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200/80 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate leading-snug">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5 truncate">ADMIN</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-white hover:bg-rose-50 border border-zinc-200/80 shadow-2xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar matching BarbaeQ DashboardLayout */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden lg:flex flex-col justify-between bg-white border-r border-zinc-200/80 transition-all duration-300 print:hidden ${
          desktopSidebarExpanded ? "w-[260px]" : "w-[80px]"
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className={`flex items-center h-[72px] border-b border-zinc-100 ${desktopSidebarExpanded ? "px-4 justify-between" : "justify-center"}`}>
            {desktopSidebarExpanded ? (
              <Logo size="sm" to="/admin/dashboard" />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-black text-sm shadow-sm">
                <PawPrint className="w-5 h-5 text-white fill-current" />
              </div>
            )}

            {desktopSidebarExpanded && (
              <button
                onClick={() => setDesktopSidebarExpanded(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand Button for Collapsed Mode */}
          {!desktopSidebarExpanded && (
            <div className="pt-2.5 pb-1 flex justify-center">
              <button
                onClick={() => setDesktopSidebarExpanded(true)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="py-4 flex flex-col gap-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={navItemClass}
                  title={!desktopSidebarExpanded ? item.name : ""}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {desktopSidebarExpanded && (
                    <span className="whitespace-nowrap truncate">{item.name}</span>
                  )}
                  {item.badge && desktopSidebarExpanded && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Mini Footer */}
        <div className={`border-t border-zinc-100 ${desktopSidebarExpanded ? "p-2.5" : "p-2 pb-3"}`}>
          <div
            className={`w-full transition-all ${
              desktopSidebarExpanded
                ? "p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between shadow-2xs"
                : "flex justify-center"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200/80 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                title={!desktopSidebarExpanded ? user?.name : ""}
              >
                {getInitials(user?.name)}
              </div>

              {desktopSidebarExpanded && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate leading-snug">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5 truncate">ADMIN</p>
                </div>
              )}
            </div>

            {desktopSidebarExpanded && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 print:pl-0 ${desktopSidebarExpanded ? "lg:pl-[260px]" : "lg:pl-[80px]"}`}>
        {/* Sticky Frosted Glass Top Navbar matching BarbaeQ */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 lg:h-[72px] px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs print:hidden">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">Admin</span>
              <span className="text-zinc-300 font-bold">/</span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">{currentNavItem?.name || 'Dashboard'}</span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Store Button */}
            <Link
              to="/"
              target="_blank"
              className="w-9 h-9 sm:w-auto sm:px-3 sm:py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
              title="Open Live Customer Store"
            >
              <Store className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Store</span>
            </Link>

            {/* Logout Button (Hidden on Phone screens, available inside mobile drawer) */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex sm:px-3 sm:py-1.5 items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-rose-600 bg-zinc-50 hover:bg-rose-50/70 border border-zinc-200 hover:border-rose-200 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
              title="Log Out"
            >
              <LogOut className="w-4 h-4 text-zinc-500" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full pb-24 lg:pb-7 print:p-0 print:m-0 print:max-w-none print:w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
