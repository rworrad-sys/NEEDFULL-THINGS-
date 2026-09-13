import React, { useState } from 'react';
import { INITIAL_SWIPE_ITEMS, NICHES } from '../data/copySwipeData';
import { CopySwipeItem } from '../types';
import { Sparkles, Copy, Check, RefreshCw, Mail, Heading, MousePointerClick, Video, Download } from 'lucide-react';

export const CampaignMixer: React.FC = () => {
  const [selectedNiche, setSelectedNiche] = useState<string>('Digital Business');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Filter items by niche
  const nicheSubjects = INITIAL_SWIPE_ITEMS.filter(
    (i) => i.category === 'subject_line' && (i.niche === selectedNiche || selectedNiche === 'All Niches')
  );
  const nicheHeadlines = INITIAL_SWIPE_ITEMS.filter(
    (i) => i.category === 'headline' && (i.niche === selectedNiche || selectedNiche === 'All Niches')
  );
  const nicheCtas = INITIAL_SWIPE_ITEMS.filter(
    (i) => i.category === 'cta' && (i.niche === selectedNiche || selectedNiche === 'All Niches')
  );

  const [selectedSubject, setSelectedSubject] = useState<string>(
    nicheSubjects[0]?.text || 'The $37 PDF that out-earned my 9-to-5 this week [Download inside]'
  );
  const [selectedHeadline, setSelectedHeadline] = useState<string>(
    nicheHeadlines[0]?.text || 'Build a 100% Margin Digital Product Empire with Zero Inventory'
  );
  const [selectedCta, setSelectedCta] = useState<string>(
    nicheCtas[0]?.text || 'Get Instant Access — Download Your Master Guide Now ($37)'
  );

  // When niche changes, pick top items
  const handleNicheChange = (niche: string) => {
    setSelectedNiche(niche);
    const subjects = INITIAL_SWIPE_ITEMS.filter(
      (i) => i.category === 'subject_line' && (i.niche === niche || niche === 'All Niches')
    );
    const headlines = INITIAL_SWIPE_ITEMS.filter(
      (i) => i.category === 'headline' && (i.niche === niche || niche === 'All Niches')
    );
    const ctas = INITIAL_SWIPE_ITEMS.filter(
      (i) => i.category === 'cta' && (i.niche === niche || niche === 'All Niches')
    );

    if (subjects.length > 0) setSelectedSubject(subjects[0].text);
    if (headlines.length > 0) setSelectedHeadline(headlines[0].text);
    if (ctas.length > 0) setSelectedCta(ctas[0].text);
  };

  const handleRandomize = () => {
    const subjects = nicheSubjects.length > 0 ? nicheSubjects : INITIAL_SWIPE_ITEMS.filter((i) => i.category === 'subject_line');
    const headlines = nicheHeadlines.length > 0 ? nicheHeadlines : INITIAL_SWIPE_ITEMS.filter((i) => i.category === 'headline');
    const ctas = nicheCtas.length > 0 ? nicheCtas : INITIAL_SWIPE_ITEMS.filter((i) => i.category === 'cta');

    const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
    const randomHl = headlines[Math.floor(Math.random() * headlines.length)];
    const randomCta = ctas[Math.floor(Math.random() * ctas.length)];

    if (randomSub) setSelectedSubject(randomSub.text);
    if (randomHl) setSelectedHeadline(randomHl.text);
    if (randomCta) setSelectedCta(randomCta.text);
  };

  const fullCampaignText = `--- HIGH-CONVERTING MARKETING LAUNCH BUNDLE ---
Niche: ${selectedNiche}

1. EMAIL SUBJECT LINE:
"${selectedSubject}"

2. SALES PAGE / PAYHIP HEADLINE:
${selectedHeadline}

3. PRIMARY CALL TO ACTION (BUTTON / LINK):
${selectedCta}

4. PROVEN PROMOTIONAL HOOK:
"Stop paying monthly fees. Grab the complete digital guide with instant download and lifetime access."
-------------------------------------------------`;

  const handleCopyBundle = () => {
    navigator.clipboard.writeText(fullCampaignText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Multi-Asset Campaign Assembler</span>
          </div>
          <h3 className="text-xl font-bold text-white">Assemble a Cohesive Launch Bundle</h3>
          <p className="text-xs text-slate-400">
            Combine your winning subject line, headline, and call-to-action into a unified marketing toolkit.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedNiche}
            onChange={(e) => handleNicheChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {NICHES.filter((n) => n !== 'All Niches').map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>

          <button
            onClick={handleRandomize}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Randomize combination"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Subject Line Slot */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-sky-400 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>1. Email Subject</span>
              </span>
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white mb-3"
            >
              {nicheSubjects.map((s) => (
                <option key={s.id} value={s.text}>
                  {s.text}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-300 font-medium italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              "{selectedSubject}"
            </p>
          </div>
        </div>

        {/* Headline Slot */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-amber-400 flex items-center space-x-1">
                <Heading className="w-3.5 h-3.5" />
                <span>2. Sales Headline</span>
              </span>
            </div>
            <select
              value={selectedHeadline}
              onChange={(e) => setSelectedHeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white mb-3"
            >
              {nicheHeadlines.map((h) => (
                <option key={h.id} value={h.text}>
                  {h.text}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-300 font-medium bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {selectedHeadline}
            </p>
          </div>
        </div>

        {/* CTA Slot */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>3. Call to Action</span>
              </span>
            </div>
            <select
              value={selectedCta}
              onChange={(e) => setSelectedCta(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white mb-3"
            >
              {nicheCtas.map((c) => (
                <option key={c.id} value={c.text}>
                  {c.text}
                </option>
              ))}
            </select>
            <p className="text-xs text-emerald-300 font-bold bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {selectedCta}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Ready to deploy to your email autoresponder, Payhip product page, or social bio link.
        </p>

        <button
          onClick={handleCopyBundle}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            copiedAll
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
          }`}
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAll ? 'Bundle Copied to Clipboard!' : 'Copy Complete Launch Bundle'}</span>
        </button>
      </div>
    </div>
  );
};
