import React, { useState } from 'react';
import { Video, Sparkles, Copy, Check, Mail, Layers, Zap, ArrowRight, Share2, DollarSign } from 'lucide-react';
import { CopySwipeVault } from './CopySwipeVault';
import { CampaignMixer } from './CampaignMixer';

export const MarketingStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'swipe' | 'mixer' | 'video'>('swipe');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const scripts = [
    {
      title: "The Zero-Cost Software Alternative Hook",
      type: "TikTok / IG Reel (15s)",
      niche: "Productivity & Planners",
      hook: "Stop paying $49/mo for productivity apps that just distract you.",
      body: "I made a single $37 PDF manual on Canva and Payhip that completely fixed my daily focus without any software subscriptions. It takes 10 seconds to download and works forever.",
      cta: "Link in bio to grab your instant copy."
    },
    {
      title: "The Time-Saving / Money-Saving Angle",
      type: "TikTok / IG Reel (30s)",
      niche: "Digital Business",
      hook: "How I saved 10 hours a week using a frictionless digital planner.",
      body: "Most planners are too complicated. I built a minimalist execution system designed specifically for busy founders and creators. Zero fluff, 100% execution.",
      cta: "Tap the link in my bio to download yours instantly."
    },
    {
      title: "The Passive Income / Entrepreneur Flex",
      type: "TikTok / IG Reel (20s)",
      niche: "Digital Business",
      hook: "The exact digital product blueprint making $3,200/mo on autopilot.",
      body: "You don't need inventory or a warehouse. AI writes the guide, Canva formats the PDF, and Payhip delivers it 24/7. Here is my exact framework.",
      cta: "Check the pinned comment for the full profit breakdown."
    },
    {
      title: "The Dark Psychology / Influence Hook",
      type: "TikTok / IG Reel (25s)",
      niche: "Dark Psychology & Mindset",
      hook: "3 conversational tricks high-stakes negotiators use to win every discussion.",
      body: "Never argue when someone tries to frame the reality. Use the strategic 3-second pause and re-anchor with data. I break down all 12 defense frameworks in my 45-page masterclass manual.",
      cta: "Link in my bio to download the complete guide."
    }
  ];

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(title);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Conversion Growth Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Marketing & Copywriting Studio
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Store, customize, and deploy high-converting email subject lines, headlines, call-to-actions, and viral traffic scripts.
          </p>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('swipe')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'swipe'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Copy Swipe Vault</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mixer')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'mixer'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campaign Mixer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('video')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Viral Video Scripts</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: COPY SWIPE VAULT (Primary requested feature) */}
      {activeSubTab === 'swipe' && <CopySwipeVault />}

      {/* SUB-VIEW 2: CAMPAIGN MIXER */}
      {activeSubTab === 'mixer' && <CampaignMixer />}

      {/* SUB-VIEW 3: VIDEO SCRIPTS */}
      {activeSubTab === 'video' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>Organic Viral Traffic Scripts</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">TikTok & Instagram Reels Scripts</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Engineered 15–30 second scripts to drive organic traffic to your Payhip storefront by emphasizing time savings, financial leverage, and instant PDF delivery.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {scripts.map((script, idx) => {
              const fullText = `${script.title}\n\nHOOK:\n"${script.hook}"\n\nBODY:\n${script.body}\n\nCTA:\n${script.cta}`;
              const isCopied = copiedScript === script.title;

              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {script.type}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                        {script.niche}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(fullText, script.title)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all cursor-pointer"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied Script' : 'Copy Script'}</span>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{script.title}</h3>

                  <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800 text-sm text-slate-300">
                    <div>
                      <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                        Hook (First 3 Seconds):
                      </span>
                      <p className="font-semibold text-white">"{script.hook}"</p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">Body:</span>
                      <p className="text-slate-300">{script.body}</p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">Call to Action:</span>
                      <p className="text-emerald-400 font-medium">{script.cta}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
