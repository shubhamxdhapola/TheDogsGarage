import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from '../layouts/CustomerLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';

// Customer Pages
import { HomePage } from '../pages/customer/HomePage.jsx';
import { PetsPage } from '../pages/customer/PetsPage.jsx';
import { PetDetailPage } from '../pages/customer/PetDetailPage.jsx';
import { AccessoriesPage } from '../pages/customer/AccessoriesPage.jsx';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage.jsx';
import { CartPage } from '../pages/customer/CartPage.jsx';
import { CheckoutPage } from '../pages/customer/CheckoutPage.jsx';
import { OrderSuccessPage } from '../pages/customer/OrderSuccessPage.jsx';
import { AccountPage } from '../pages/customer/AccountPage.jsx';
import { OrdersPage as CustomerOrdersPage } from '../pages/customer/OrdersPage.jsx';
import { OrderDetailPage as CustomerOrderDetailPage } from '../pages/customer/OrderDetailPage.jsx';
import { AboutPage } from '../pages/customer/AboutPage.jsx';
import { ContactPage } from '../pages/customer/ContactPage.jsx';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { SignupPage } from '../pages/auth/SignupPage.jsx';
import { VerifyOtpPage } from '../pages/auth/VerifyOtpPage.jsx';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage.jsx';

// Admin Pages
import { DashboardPage as AdminDashboardPage } from '../pages/admin/DashboardPage.jsx';
import { OrdersPage as AdminOrdersPage } from '../pages/admin/OrdersPage.jsx';
import { AdminOrderDetailPage } from '../pages/admin/AdminOrderDetailPage.jsx';
import { ProductsPage as AdminProductsPage } from '../pages/admin/ProductsPage.jsx';
import { AdminPetsPage } from '../pages/admin/PetsPage.jsx';
import { AddEditPetPage } from '../pages/admin/AddEditPetPage.jsx';
import { CustomersPage as AdminCustomersPage } from '../pages/admin/CustomersPage.jsx';
import { AnalyticsPage as AdminAnalyticsPage } from '../pages/admin/AnalyticsPage.jsx';
import { SettingsPage as AdminSettingsPage } from '../pages/admin/SettingsPage.jsx';

// Route Guards
import { ProtectedRoute, GuestRoute } from '../components/ProtectedRoute.jsx';
import { UserRole } from '../utils/constants.js';

export const router = createBrowserRouter([
  // Public Customer Experience
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'pets', element: <PetsPage /> },
      { path: 'pets/:id', element: <PetDetailPage /> },
      { path: 'accessories', element: <AccessoriesPage /> },
      { path: 'accessories/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute roles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
      {
        path: 'account',
        element: (
          <ProtectedRoute roles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/orders',
        element: (
          <ProtectedRoute roles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
            <CustomerOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account/orders/:id',
        element: (
          <ProtectedRoute roles={[UserRole.CUSTOMER, UserRole.ADMIN]}>
            <CustomerOrderDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },

  // Public Guest Auth Routes
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <SignupPage />
      </GuestRoute>
    ),
  },
  {
    path: '/verify-otp',
    element: (
      <GuestRoute>
        <VerifyOtpPage />
      </GuestRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    ),
  },

  // Dedicated Admin Panel Application (Matching Reference Image 2)
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={[UserRole.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'orders/:id', element: <AdminOrderDetailPage /> },
      { path: 'pets', element: <AdminPetsPage /> },
      { path: 'pets/add', element: <AddEditPetPage /> },
      { path: 'pets/edit/:id', element: <AddEditPetPage /> },
      { path: 'accessories', element: <AdminProductsPage /> },
      { path: 'customers', element: <AdminCustomersPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
      { path: 'reviews', element: <AdminAnalyticsPage /> },
      { path: 'coupons', element: <AdminSettingsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
