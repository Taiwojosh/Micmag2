import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import CapSpecificationsPage from './pages/CapSpecificationsPage';
import OrderPage from './pages/OrderPage';
import ContactPage from './pages/ContactPage';
import ProductsPage from './pages/ProductsPage';
import TeamPage from './pages/TeamPage';
import ScrollToTop from './components/ScrollToTop';
import { BrandProvider } from './BrandContext';

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<HomePage />} />
          <Route path="/core-values" element={<HomePage />} />
          <Route path="/collections" element={<ProductsPage />} />
          <Route path="/why" element={<HomePage />} />
          <Route path="/locations" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/specifications" element={<CapSpecificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
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

