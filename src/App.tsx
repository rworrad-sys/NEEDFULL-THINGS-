import React, { useState, useEffect } from 'react';
import { DigitalProduct, Order, StoreSettings } from './types';
import { COMPREHENSIVE_STAPLE_PRODUCTS } from './data/comprehensiveProducts';
import { Navbar } from './components/Navbar';
import { ProductCreator } from './components/ProductCreator';
import { DigitalVault } from './components/DigitalVault';
import { TrendingRadar } from './components/TrendingRadar';
import { MarketingStudio } from './components/MarketingStudio';
import { FlipbookModal } from './components/FlipbookModal';
import { LiveStorefront } from './components/LiveStorefront';
import { OrdersLedger } from './components/OrdersLedger';
import { CheckoutModal } from './components/CheckoutModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('storefront');
  const [checkoutProduct, setCheckoutProduct] = useState<DigitalProduct | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('pdf_profit_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          squareEnabled: parsed.squareEnabled ?? true,
          primaryGateway: parsed.primaryGateway ?? 'square',
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      storeName: 'Turnkey Digital Vault',
      tagline: 'Premium digital manuals, masterclasses, and productivity frameworks with instant Square checkout & PDF delivery.',
      currency: 'USD',
      stripeEnabled: true,
      squareEnabled: true,
      squareLocationId: '',
      squareEnvironment: 'sandbox',
      primaryGateway: 'square',
      payhipStoreUrl: '',
      supportEmail: 'support@turnkeyvault.com',
      announcement: 'Production Storefront Online - 24/7 Automated Square & Card Delivery',
      isLive: true,
    };
  });
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem('pdf_profit_vault');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return COMPREHENSIVE_STAPLE_PRODUCTS;
  });


  const [viewerProduct, setViewerProduct] = useState<DigitalProduct | null>(null);

  useEffect(() => {
    localStorage.setItem('pdf_profit_vault', JSON.stringify(products));
  }, [products]);

  // Handle URL query parameters for Square redirect (?square_success=true), direct checkout links (?product=1), or direct store (?store=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const squareSuccess = params.get('square_success');
    const orderId = params.get('order_id');
    const prodId = params.get('product') || params.get('product_id');
    const prodTitle = params.get('product_title');
    const amount = params.get('amount');
    const customerEmail = params.get('customer_email');
    const storeParam = params.get('store');

    if (squareSuccess === 'true') {
      const targetProduct = (prodId ? products.find((p) => p.id === prodId) : null) || products[0];
      const numericAmount = amount ? parseFloat(amount) : (targetProduct ? parseFloat(targetProduct.price.replace(/[^0-9.]/g, '')) : 47);

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prodId || (targetProduct ? targetProduct.id : 'square-product'),
          productTitle: prodTitle || (targetProduct ? targetProduct.title : 'Digital Product'),
          amount: numericAmount,
          customerEmail: customerEmail || 'square.buyer@orders.turnkeyvault.com',
          customerName: 'Square Verified Buyer',
          paymentMethod: 'square',
        }),
      })
        .then((r) => r.json())
        .then(() => {
          if (targetProduct) {
            setCheckoutProduct(targetProduct);
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => console.error('Square order recording error:', err));

      setActiveTab('storefront');
      return;
    }

    if (prodId) {
      const found = products.find((p) => p.id === prodId);
      if (found) {
        setCheckoutProduct(found);
        setActiveTab('storefront');
      }
    } else if (storeParam === 'true') {
      setActiveTab('storefront');
    }
  }, [products]);


  const handleSaveProduct = (newProduct: DigitalProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSelectTrendingNiche = (nicheName: string, topic: string, price: string) => {
    setActiveTab('creator');
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    localStorage.setItem('pdf_profit_settings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vaultCount={products.length}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <main className="pb-16">
        {activeTab === 'creator' && (
          <ProductCreator
            onSaveProduct={handleSaveProduct}
            onOpenViewer={(product) => setViewerProduct(product)}
            onOpenCheckout={(product) => setCheckoutProduct(product)}
          />
        )}

        {activeTab === 'vault' && (
          <DigitalVault
            products={products}
            onOpenViewer={(product) => setViewerProduct(product)}
            onDeleteProduct={handleDeleteProduct}
            onLoadTemplate={(product) => setActiveTab('creator')}
            onOpenCheckout={(product) => setCheckoutProduct(product)}
            onNavigateToStore={() => setActiveTab('storefront')}
          />
        )}

        {activeTab === 'storefront' && (
          <LiveStorefront
            products={products}
            onOpenViewer={(product) => setViewerProduct(product)}
            onOpenCheckout={(product) => setCheckoutProduct(product)}
            payhipStoreUrl={storeSettings.payhipStoreUrl}
            storeName={storeSettings.storeName}
            tagline={storeSettings.tagline}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersLedger
            products={products}
            onOpenStorefront={() => setActiveTab('storefront')}
          />
        )}

        {activeTab === 'trending' && (
          <TrendingRadar
            onSelectNiche={handleSelectTrendingNiche}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingStudio />
        )}
      </main>

      {viewerProduct && (
        <FlipbookModal
          product={viewerProduct}
          onClose={() => setViewerProduct(null)}
        />
      )}

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
          onOrderCompleted={(order) => {
            // Order recorded
          }}
          payhipStoreUrl={storeSettings.payhipStoreUrl}
        />
      )}

      {showSettingsModal && (
        <StoreSettingsModal
          settings={storeSettings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
