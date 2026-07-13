import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import CapSpecificationsPage from './pages/CapSpecificationsPage';
import OrderPage from './pages/OrderPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import TeamPage from './pages/TeamPage';
import ScrollToTop from './components/ScrollToTop';
import { BrandProvider } from './BrandContext';

// Lazy-load the heaviest pages to keep initial bundle lean
const ProductsPage = lazy(() => import('./pages/ProductsPage'));

function AppLayout() {
  const brandStyles = {
    '--color-brand-red': '#b45309', // Micmag luxury amber core
    '--color-brand-red-deep': '#78350f',
    '--color-brand-text-on-primary': '#ffffff',
  } as React.CSSProperties;

  return (
    <div 
      style={brandStyles} 
      className="min-h-screen bg-brand-cream text-brand-charcoal font-sans antialiased transition-colors duration-500 selection:bg-brand-red/10 selection:text-brand-red"
    >
      <Header />
      
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest animate-pulse">Loading…</span>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="/core-values" element={<Navigate to="/#core-values" replace />} />
            <Route path="/why" element={<Navigate to="/#why" replace />} />
            <Route path="/locations" element={<Navigate to="/#locations" replace />} />
            <Route path="/collections" element={<ProductsPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/specifications" element={<CapSpecificationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout />
      </BrowserRouter>
    </BrandProvider>
  );
}

