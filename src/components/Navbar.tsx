import React from 'react';
import { BookOpen, Sparkles, TrendingUp, DollarSign, Zap, ShoppingBag, Settings, Receipt } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  vaultCount: number;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  vaultCount,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('creator')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
              PDF Profit Engine
            </h1>
            <p className="text-xs text-slate-400 font-mono">Production Digital Empire & Checkout</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('creator')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'creator'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Creator</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'vault'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Vault</span>
            {vaultCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center justify-center">
                {vaultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('storefront')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'storefront'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Store</span>
            <span className="bg-emerald-500 text-slate-950 text-[9px] font-bold px-1 rounded">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>Sales & Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'trending'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'marketing'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Marketing</span>
          </button>
        </nav>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('storefront')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">Store: </span>
            <span className="font-bold">Production Ready</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-all"
            title="Production Store & Payment Setup"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800/80 bg-slate-950 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('creator')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'creator' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          Creator
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'vault' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          Vault ({vaultCount})
        </button>
        <button
          onClick={() => setActiveTab('storefront')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'storefront' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Live Store
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'orders' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'marketing' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          Marketing
        </button>
      </div>
    </header>
  );
};
