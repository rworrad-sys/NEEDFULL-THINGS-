import React, { useState } from 'react';
import { DigitalProduct } from '../types';
import { Sparkles, DollarSign, BookOpen, Layers, ShieldCheck, ArrowRight, Loader2, Copy, Check, Download, Eye, Image as ImageIcon, ShoppingBag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ProductCreatorProps {
  onSaveProduct: (product: DigitalProduct) => void;
  onOpenViewer: (product: DigitalProduct) => void;
  onOpenCheckout?: (product: DigitalProduct) => void;
}

export const ProductCreator: React.FC<ProductCreatorProps> = ({ onSaveProduct, onOpenViewer, onOpenCheckout }) => {
  const [niche, setNiche] = useState('High-Value Guide');
  const [topic, setTopic] = useState('Dark Psychology & Behavioral Influence Masterclass');
  const [price, setPrice] = useState('$67');
  const [productType, setProductType] = useState('PDF Ebook & Action Manual (45 Pages)');
  
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const niches = [
    { name: 'High-Value Guide', example: 'Dark Psychology, PDF Profit Blueprint, AI Prompts' },
    { name: 'Hyper-Niche Influencer Template', example: 'ADHD Executive Planner, Dopamine Reset, Fitness Journal' },
    { name: 'Premium Hardcover Book', example: 'Ken Burns Style Historical Compendium & Chronology' },
    { name: 'AI Prompt & Printables Empire', example: 'ChatGPT Passive Income Playbook + Canva Planners' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResult(null);
    setCoverImage(null);
    setSaved(false);

    try {
      const res = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, topic, price, productType }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedResult(data.content);
        // Extract title from content if possible
        const lines = data.content.split('\n');
        const titleLine = lines.find((l: string) => l.includes('TITLE:') || l.includes('A. CONTENT TITLE'));
        if (titleLine) {
          setGeneratedTitle(titleLine.replace(/.*TITLE:\s*/i, '').replace(/[\*\_]/g, '').trim());
        } else {
          setGeneratedTitle(topic);
        }

        // Automatically trigger cover image generation
        generateCover(topic, niche);
      } else {
        alert(data.error || 'Generation failed');
      }
    } catch (err: any) {
      console.error(err);
      alert('Network error during generation');
    } finally {
      setLoading(false);
    }
  };

  const generateCover = async (titleStr: string, nicheStr: string) => {
    setCoverLoading(true);
    try {
      const res = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleStr, niche: nicheStr }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCoverImage(data.imageUrl);
      }
    } catch (err) {
      console.error('Cover gen error:', err);
    } finally {
      setCoverLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedResult) return;
    const newProduct: DigitalProduct = {
      id: Date.now().toString(),
      title: generatedTitle || topic,
      niche,
      topic,
      price,
      productType,
      content: generatedResult,
      coverImage: coverImage || undefined,
      createdAt: new Date().toLocaleDateString(),
    };
    onSaveProduct(newProduct);
    setSaved(true);
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Intro */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero-Cost Digital Entrepreneur Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Generate $20–$125 Payhip Digital Products & Viral Traffic in Seconds
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Zero editing. Zero formatting. High-margin AI-crafted guides, planners, and Canva-ready templates designed for instant sales and zero-cost TikTok traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Product Specifications</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                1. Select Profit Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
              >
                {niches.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name} ({n.example})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                2. Specific Topic / Problem Solved
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. ADHD Executive Function Life Mastery & Time Blocking"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
                required
              />
              <p className="text-xs text-slate-500 mt-1 font-mono">Focus on saving time or money for the customer.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  3. Payhip Price
                </label>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-all font-mono text-amber-400"
                >
                  <option value="$27">$27 (Quick Win)</option>
                  <option value="$47">$47 (Standard Guide)</option>
                  <option value="$67">$67 (Bestseller PDF)</option>
                  <option value="$97">$97 (Masterclass Bundle)</option>
                  <option value="$125">$125 (Hardcover / Premium)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  4. Format
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
                >
                  <option value="PDF Ebook & Action Manual">PDF Ebook & Manual</option>
                  <option value="Hyper-Niche Planner Template">Hyper-Niche Planner</option>
                  <option value="AI Prompt & Printables Pack">AI Prompt & Printables</option>
                  <option value="Hardcover Book Manuscript">Hardcover Manuscript</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Profitable Product...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Complete Product & Scripts</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Tips */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Margin Business Model</span>
            </div>
            <p>Products are generated with Canva copy-paste readiness, Payhip SEO tags, and zero-cost TikTok hook scripts.</p>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-white font-bold text-lg">Crafting High-Value Digital Product...</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Structuring chapters, writing Canva layout instructions, generating Payhip SEO metadata, and scripting viral TikTok hooks.
              </p>
            </div>
          )}

          {!loading && !generatedResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-slate-300 font-bold text-lg">Your Digital Product Empire Awaits</h3>
              <p className="text-slate-500 text-sm max-w-md">
                Select your niche and topic on the left, then click generate to create your complete turnkey digital product ready for Payhip.
              </p>
            </div>
          )}

          {generatedResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Product Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
                    <span>{niche}</span>
                    <span>•</span>
                    <span className="font-bold">{price}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{generatedTitle || topic}</h3>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => onOpenViewer({
                      id: 'temp',
                      title: generatedTitle || topic,
                      niche,
                      topic,
                      price,
                      productType,
                      content: generatedResult,
                      coverImage: coverImage || undefined,
                      createdAt: new Date().toLocaleDateString(),
                    })}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>E-Reader View</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {onOpenCheckout && (
                    <button
                      onClick={() => onOpenCheckout({
                        id: Date.now().toString(),
                        title: generatedTitle || topic,
                        niche,
                        topic,
                        price,
                        productType,
                        content: generatedResult,
                        coverImage: coverImage || undefined,
                        createdAt: new Date().toLocaleDateString(),
                      })}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Sell Live ({price})</span>
                    </button>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      saved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    }`}
                  >
                    {saved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    <span>{saved ? 'Saved to Vault!' : 'Save to Vault'}</span>
                  </button>
                </div>
              </div>

              {/* Cover Image Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-44 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                  {coverLoading ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      <span className="text-[10px] text-slate-400 font-mono">Generating Cover...</span>
                    </div>
                  ) : coverImage ? (
                    <img src={coverImage} alt="Ebook Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-500 font-mono">Canva Cover Art Ready</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Canva Cover & Visual Asset Strategy</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3">
                    Use the generated AI cover or copy the Canva layout instructions below. Designed for maximum click-through rate on Payhip, Pinterest, and TikTok showcase pins.
                  </p>
                  <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 inline-block">
                    Pricing Position: {price} (High Perceived Value / Low Friction)
                  </div>
                </div>
              </div>

              {/* Manuscript Content Render */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 max-h-[600px] overflow-y-auto">
                <div className="markdown-body prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed text-sm">
                  <ReactMarkdown>{generatedResult}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
