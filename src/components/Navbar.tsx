import React from 'react';
import { BookOpen, Sparkles, TrendingUp, Video, Layers, DollarSign } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  vaultCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, vaultCount }) => {
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
            <p className="text-xs text-slate-400 font-mono">Zero-Cost Digital Empire Studio</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('creator')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'creator'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Product Creator</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'vault'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Digital Vault</span>
            {vaultCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {vaultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'trending'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending Niches</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'marketing'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>TikTok / IG Studio</span>
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Payhip / Gumroad 100% Margin Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
};
