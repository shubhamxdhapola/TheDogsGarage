import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar.jsx';
import { BottomNavbar } from '../components/common/BottomNavbar.jsx';
import { Footer } from '../components/common/Footer.jsx';
import { CartDrawer } from '../components/cart/CartDrawer.jsx';
import { ScrollToTop } from '../components/common/ScrollToTop.jsx';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-stone-900 font-sans pb-16 md:pb-0">
      <ScrollRestoration />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNavbar />
      <CartDrawer />
    </div>
  );
};

export default CustomerLayout;
