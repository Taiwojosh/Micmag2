import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import CapSpecificationsPage from './pages/CapSpecificationsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import TeamPage from './pages/TeamPage';
import ScrollToTop from './components/ScrollToTop';
import { BrandProvider } from './BrandContext';

// Lazy-load the heaviest pages to keep initial bundle lean
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ShowroomPage = lazy(() => import('./pages/ShowroomPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-24 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">Something went wrong</h2>
          <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">
            We encountered an unexpected error while loading this page. Please try refreshing or return to the catalog.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold uppercase tracking-wider shadow cursor-pointer hover:brightness-110"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-white"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <ErrorBoundary>
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
              <Route path="/showroom" element={<ShowroomPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/specifications" element={<CapSpecificationsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
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
        <Analytics />
      </BrowserRouter>
    </BrandProvider>
  );
}

