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
  ChevronDown,
  Menu,
  X,
  Store,
  PawPrint,
  FileText,
  Sliders,
  Bell,
  Sparkles,
  BarChart3,
  Globe,
  ExternalLink,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../redux/slices/auth.slice.js';
import { ScrollToTop } from '../components/common/ScrollToTop.jsx';

const getInitials = (name) => {
  if (!name) return 'AD';
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().substring(0, 2);
};

export const AdminLayout = () => {
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(() => {
    return localStorage.getItem('tdg_admin_sidebar_collapsed') !== 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Collapsible menu groups
  const [openGroups, setOpenGroups] = useState({
    cms: true,
    users: false,
    catalog: false,
    orders: false,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { user } = useSelector((state) => state.auth);
  const { cms } = useSelector((state) => state.cms);
  const { dashboard } = useSelector((state) => state.admin);
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
    toast.success('Logged out successfully');
  };

  // Sidebar navigation configuration matching UI Reference Image
  const menuConfig = [
    {
      type: 'link',
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      type: 'group',
      id: 'cms',
      name: 'Content (CMS)',
      icon: FileText,
      badge: 'Live',
      badgeColor: 'bg-amber-400 text-stone-950',
      children: [
        { name: 'CMS Editor', path: '/admin/cms' },
        { name: 'Home Sections', path: '/admin/cms?tab=home' },
        { name: 'About Page', path: '/admin/cms?tab=about' },
        { name: 'Contact Page', path: '/admin/cms?tab=contact' },
        { name: 'Store & Global', path: '/admin/cms?tab=global' },
      ],
    },
    {
      type: 'group',
      id: 'catalog',
      name: 'Live Stock & Store',
      icon: Dog,
      children: [
        { name: 'Puppies (Live Stock)', path: '/admin/pets' },
        { name: 'Add New Puppy', path: '/admin/pets/add' },
        { name: 'Accessories & Care', path: '/admin/accessories' },
      ],
    },
    {
      type: 'group',
      id: 'users',
      name: 'Users',
      icon: Users,
      badge: '18',
      badgeColor: 'bg-amber-400 text-stone-950',
      children: [
        { name: 'Customers', path: '/admin/customers', badge: '18', badgeColor: 'bg-amber-400 text-stone-950' },
        { name: 'Orders & Payments', path: '/admin/orders', badge: '12', badgeColor: 'bg-orange-500 text-white' },
      ],
    },
    {
      type: 'link',
      name: 'Reports & Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
    },
    {
      type: 'link',
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      badge: '2',
      badgeColor: 'bg-orange-500 text-white',
    },
  ];

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/cms')) return 'Content Management System (CMS)';
    if (location.pathname.startsWith('/admin/dashboard')) return 'Admin Panel';
    if (location.pathname.startsWith('/admin/orders')) return 'Customer Orders';
    if (location.pathname.startsWith('/admin/pets')) return 'Live Stock Companions';
    if (location.pathname.startsWith('/admin/accessories')) return 'Accessories & Store Products';
    if (location.pathname.startsWith('/admin/customers')) return 'Customers Directory';
    if (location.pathname.startsWith('/admin/analytics')) return 'Reports & Analytics';
    if (location.pathname.startsWith('/admin/settings')) return 'Store Settings';
    return 'Admin Panel';
  };

  return (
    <div className="flex min-h-screen bg-[#F6F7F9] text-zinc-900 font-sans antialiased">
      <ScrollRestoration />
      <ScrollToTop />

      {/* Mobile Drawer Overlay */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Sidebar (Jet Black Theme matching Reference Image) */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0C0D0E] text-white shadow-2xl lg:hidden flex flex-col justify-between border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm shadow-xs">
                <PawPrint className="w-4 h-4 fill-current" />
              </div>
              <span className="font-black text-sm tracking-wider uppercase font-display text-white">
                ADMIN PANEL
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items with Tree Connections */}
          <nav className="p-4 space-y-1.5 text-xs">
            {menuConfig.map((item, idx) => {
              const Icon = item.icon;

              if (item.type === 'link') {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={idx}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold ${
                      isActive
                        ? 'bg-zinc-800 text-white font-bold shadow-xs'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-zinc-400" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor || 'bg-zinc-800 text-zinc-200'}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              }

              // Group
              const isGroupOpen = openGroups[item.id];
              const isGroupActive = item.children.some((child) => location.pathname.startsWith(child.path.split('?')[0]));

              return (
                <div key={idx} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold cursor-pointer ${
                      isGroupActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isGroupActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Tree-branch indented subitems */}
                  {isGroupOpen && (
                    <div className="ml-5 pl-3 border-l border-zinc-800 space-y-1 py-1">
                      {item.children.map((sub, sIdx) => {
                        const isSubActive =
                          location.pathname + location.search === sub.path ||
                          (sub.path.includes('?') ? location.pathname === sub.path.split('?')[0] && location.search.includes(sub.path.split('?')[1]) : location.pathname === sub.path);

                        return (
                          <Link
                            key={sIdx}
                            to={sub.path}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] transition-all relative ${
                              isSubActive
                                ? 'text-amber-400 font-bold bg-zinc-800/60'
                                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/40'
                            }`}
                          >
                            <span>{sub.name}</span>
                            {sub.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${sub.badgeColor || 'bg-zinc-700 text-zinc-300'}`}>
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Mobile Profile Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#08090A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                {getInitials(user?.name)}
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-zinc-500 font-medium">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Jet Black Sidebar (Matching Reference Image Exactly) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden lg:flex flex-col justify-between bg-[#0C0D0E] text-white border-r border-zinc-800/80 transition-all duration-300 print:hidden ${
          desktopSidebarExpanded ? 'w-[250px]' : 'w-[76px]'
        }`}
      >
        <div className="overflow-y-auto overflow-x-hidden scrollbar-none">
          {/* Header */}
          <div
            className={`flex items-center h-[70px] border-b border-zinc-800/80 ${
              desktopSidebarExpanded ? 'px-5 justify-between' : 'justify-center'
            }`}
          >
            {desktopSidebarExpanded ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm shadow-xs">
                  <PawPrint className="w-4 h-4 fill-current" />
                </div>
                <div className="leading-tight">
                  <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-display text-white">
                    ADMIN PANEL
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm shadow-xs">
                <PawPrint className="w-4 h-4 fill-current" />
              </div>
            )}

            {desktopSidebarExpanded && (
              <button
                onClick={() => setDesktopSidebarExpanded(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand toggle for collapsed mode */}
          {!desktopSidebarExpanded && (
            <div className="pt-2 pb-1 flex justify-center">
              <button
                onClick={() => setDesktopSidebarExpanded(true)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 text-xs">
            {menuConfig.map((item, idx) => {
              const Icon = item.icon;

              if (item.type === 'link') {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={idx}
                    to={item.path}
                    className={`flex items-center transition-all font-semibold rounded-xl ${
                      desktopSidebarExpanded ? 'px-3 py-2.5 justify-between' : 'w-10 h-10 mx-auto justify-center'
                    } ${
                      isActive
                        ? 'bg-zinc-800 text-white font-bold shadow-xs'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                    title={!desktopSidebarExpanded ? item.name : ''}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                      {desktopSidebarExpanded && <span className="truncate">{item.name}</span>}
                    </div>
                    {desktopSidebarExpanded && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor || 'bg-zinc-800 text-zinc-200'}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              }

              // Group
              const isGroupOpen = openGroups[item.id];
              const isGroupActive = item.children.some((child) => location.pathname.startsWith(child.path.split('?')[0]));

              return (
                <div key={idx} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!desktopSidebarExpanded) setDesktopSidebarExpanded(true);
                      toggleGroup(item.id);
                    }}
                    className={`w-full flex items-center transition-all font-semibold rounded-xl cursor-pointer ${
                      desktopSidebarExpanded ? 'px-3 py-2.5 justify-between' : 'w-10 h-10 mx-auto justify-center'
                    } ${
                      isGroupActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                    title={!desktopSidebarExpanded ? item.name : ''}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isGroupActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                      {desktopSidebarExpanded && <span className="truncate">{item.name}</span>}
                    </div>

                    {desktopSidebarExpanded && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </button>

                  {/* Subitems with Tree Connecting Line (Reference Image UI) */}
                  {desktopSidebarExpanded && isGroupOpen && (
                    <div className="ml-5 pl-3 border-l border-zinc-800 space-y-1 py-1">
                      {item.children.map((sub, sIdx) => {
                        const isSubActive =
                          location.pathname + location.search === sub.path ||
                          (sub.path.includes('?') ? location.pathname === sub.path.split('?')[0] && location.search.includes(sub.path.split('?')[1]) : location.pathname === sub.path);

                        return (
                          <Link
                            key={sIdx}
                            to={sub.path}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                              isSubActive
                                ? 'text-amber-400 font-bold bg-zinc-800/70'
                                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/40'
                            }`}
                          >
                            <span className="truncate">{sub.name}</span>
                            {sub.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${sub.badgeColor || 'bg-zinc-700 text-zinc-300'}`}>
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Profile Mini Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#08090A]">
          {desktopSidebarExpanded ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-xs shrink-0">
                  {getInitials(user?.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-snug">{user?.name || 'Admin User'}</p>
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider truncate">ADMINISTRATOR</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-zinc-500 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-xs"
                title={user?.name || 'Admin User'}
              >
                {getInitials(user?.name)}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 print:pl-0 ${
          desktopSidebarExpanded ? 'lg:pl-[250px]' : 'lg:pl-[76px]'
        }`}
      >
        {/* Top Navbar Header matching Reference Image */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 lg:h-[70px] px-4 sm:px-6 lg:px-8 bg-white border-b border-zinc-200/80 shadow-2xs print:hidden">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title / Breadcrumb (Reference Image Left Header) */}
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-stone-900 font-display tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Header: Notification Bell with Badge, User Avatar, Live Store */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Open Live Store Button */}
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 shadow-2xs transition-all hover:scale-102"
              title="Open Live Customer Website"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Live Store</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>

            {/* Notification Bell with Badge '1' (Directly from Reference Image) */}
            <div className="relative">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors relative cursor-pointer"
                title="Notifications"
                onClick={() => toast('No new unread alerts', { icon: '🔔' })}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                  1
                </span>
              </button>
            </div>

            {/* User Profile Avatar with Name (Directly from Reference Image) */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs flex items-center justify-center text-stone-800 font-black text-xs">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(user?.name)}</span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-bold text-zinc-800 max-w-[120px] truncate">
                {user?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12 print:p-0 print:m-0 print:max-w-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
