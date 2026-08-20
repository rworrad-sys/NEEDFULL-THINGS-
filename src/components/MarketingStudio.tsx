import React, { useState } from 'react';
import { Video, Sparkles, Copy, Check, DollarSign, Clock, ArrowRight } from 'lucide-react';

export const MarketingStudio: React.FC = () => {
  const [productTopic, setProductTopic] = useState('365-Day Dopamine Reset & Focus Master Planner ($37)');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const scripts = [
    {
      title: "The Zero-Cost Software Alternative Hook",
      type: "TikTok / IG Reel (15s)",
      hook: "Stop paying $49/mo for productivity apps that just distract you.",
      body: "I made a single $37 PDF manual on Canva and Payhip that completely fixed my daily focus without any software subscriptions. It takes 10 seconds to download and works forever.",
      cta: "Link in bio to grab your instant copy."
    },
    {
      title: "The Time-Saving / Money-Saving Angle",
      type: "TikTok / IG Reel (30s)",
      hook: "How I saved 10 hours a week using a frictionless digital planner.",
      body: "Most planners are too complicated. I built a minimalist execution system designed specifically for busy founders and creators. Zero fluff, 100% execution.",
      cta: "Tap the link in my bio to download yours instantly."
    },
    {
      title: "The Passive Income / Entrepreneur Flex",
      type: "TikTok / IG Reel (20s)",
      hook: "The exact digital product blueprint making $3,200/mo on autopilot.",
      body: "You don't need inventory or a warehouse. AI writes the guide, Canva formats the PDF, and Payhip delivers it 24/7. Here is my exact framework.",
      cta: "Check the pinned comment for the full profit breakdown."
    }
  ];

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(title);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <Video className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero-Cost Traffic Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          TikTok & Instagram Viral Marketing Studio
        </h2>
        <p className="text-slate-400 text-sm">
          High-converting video scripts designed to drive zero-cost traffic to your Payhip storefront by emphasizing time savings, cost savings, and radical simplicity.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {scripts.map((script, idx) => {
          const fullText = `${script.title}\n\nHOOK:\n"${script.hook}"\n\nBODY:\n${script.body}\n\nCTA:\n${script.cta}`;
          const isCopied = copiedScript === script.title;

          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {script.type}
                </span>
                <button
                  onClick={() => handleCopy(fullText, script.title)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied Script' : 'Copy Script'}</span>
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{script.title}</h3>

              <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800 text-sm text-slate-300">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">Hook (First 3 Seconds):</span>
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
  );
};
