import React, { useState } from 'react';
import { DigitalProduct } from '../types';
import { ShoppingBag, Eye, ShieldCheck, Zap, Download, Lock, CheckCircle2, Share2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface LiveStorefrontProps {
  products: DigitalProduct[];
  onOpenViewer: (product: DigitalProduct) => void;
  onOpenCheckout: (product: DigitalProduct) => void;
  payhipStoreUrl?: string;
  storeName?: string;
  tagline?: string;
}

export const LiveStorefront: React.FC<LiveStorefrontProps> = ({
  products,
  onOpenViewer,
  onOpenCheckout,
  payhipStoreUrl,
  storeName = "Turnkey Digital Vault",
  tagline = "Premium digital manuals, masterclasses, and productivity frameworks with instant PDF delivery.",
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.niche)))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.niche === selectedCategory);

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Live Production Status Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute inset-0" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Production Storefront Online
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Cloud Run Live
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Customers can purchase directly right here with instant automated PDF delivery.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={handleCopyStoreLink}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Store Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Store URL for Bio</span>
              </>
            )}
          </button>

          {payhipStoreUrl && (
            <a
              href={payhipStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium rounded-xl border border-amber-500/20 transition-all"
            >
              <span>Payhip Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Digital Release Catalog</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {storeName}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {tagline}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <Zap className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-xs font-semibold text-white">Instant Delivery</span>
          <span className="text-[10px] text-slate-400">Direct PDF download</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <Lock className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-xs font-semibold text-white">Encrypted Checkout</span>
          <span className="text-[10px] text-slate-400">256-Bit SSL Protection</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <ShieldCheck className="w-4 h-4 text-indigo-400 mb-1" />
          <span className="text-xs font-semibold text-white">Perpetual License</span>
          <span className="text-[10px] text-slate-400">Lifetime personal use</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <Download className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-xs font-semibold text-white">Turnkey Formats</span>
          <span className="text-[10px] text-slate-400">PDF, Flipbook & Print</span>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all group"
          >
            {/* Top Mockup / Cover Banner */}
            <div className="h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 p-5 relative flex flex-col justify-between border-b border-slate-800">
              <div className="flex items-center justify-between z-10">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {product.niche}
                </span>
                <span className="text-lg font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  {product.price}
                </span>
              </div>

              {product.coverImage ? (
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                />
              ) : null}

              <div className="z-10 mt-auto">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {product.productType}
                </span>
                <h3 className="text-base font-bold text-white line-clamp-2 mt-0.5 group-hover:text-amber-400 transition-colors">
                  {product.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {product.topic}
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant PDF Download</span>
                  </span>
                  <span>100% Guaranteed</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenViewer(product)}
                    className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Read Preview</span>
                  </button>

                  <button
                    onClick={() => onOpenCheckout(product)}
                    className="flex items-center justify-center space-x-1.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy {product.price}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
