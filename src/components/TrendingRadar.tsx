import React, { useEffect, useState } from 'react';
import { NicheIdea } from '../types';
import { TrendingUp, Sparkles, DollarSign, Users, Flame, ArrowRight, Loader2 } from 'lucide-react';

interface TrendingRadarProps {
  onSelectNiche: (nicheName: string, topic: string, price: string) => void;
}

export const TrendingRadar: React.FC<TrendingRadarProps> = ({ onSelectNiche }) => {
  const [niches, setNiches] = useState<NicheIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trending-niches')
      .then((res) => res.json())
      .then((data) => {
        if (data.niches) {
          setNiches(data.niches);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Bestseller Radar</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Hottest Digital Product Niches on Etsy & Payhip
        </h2>
        <p className="text-slate-400 text-sm">
          Scraped and analyzed from top-performing digital storefronts. Click any niche to instantly load into the AI Product Creator.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {niches.map((niche) => (
            <div key={niche.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {niche.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Hot Score: {niche.hotScore}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-all">
                  {niche.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
                  {niche.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Target Audience:</span>
                    <span className="text-slate-200">{niche.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sweet Spot Price:</span>
                    <span className="text-amber-400 font-bold">{niche.avgPrice}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectNiche(niche.category, niche.title, niche.avgPrice)}
                className="w-full py-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider group-hover:shadow-lg group-hover:shadow-amber-500/20 cursor-pointer"
              >
                <span>Generate This Product Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
