import React, { useState, useEffect } from 'react';
import { DigitalProduct } from './types';
import { Navbar } from './components/Navbar';
import { ProductCreator } from './components/ProductCreator';
import { DigitalVault } from './components/DigitalVault';
import { TrendingRadar } from './components/TrendingRadar';
import { MarketingStudio } from './components/MarketingStudio';
import { FlipbookModal } from './components/FlipbookModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('creator');
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem('pdf_profit_vault');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: '1',
        title: 'Dark Psychology & Behavioral Influence Masterclass',
        niche: 'High-Value Guide',
        topic: 'Dark Psychology & Influence',
        price: '$67',
        productType: 'PDF Ebook & Action Manual',
        content: `# Dark Psychology & Behavioral Influence Masterclass

## A. CONTENT TITLE
**The Art of Unseen Persuasion: Decoding Dark Psychology & Protecting Your Mind**

## B. FINAL MANUSCRIPT / CHAPTERS

### Chapter 1: The Architecture of Unspoken Influence
In every negotiation, boardroom, and social exchange, 90% of influence occurs beneath the surface of conscious awareness. This manual dismantles the core pillars of psychological framing, anchoring, and authority positioning.

### Chapter 2: Defending Against Manipulation Tactics
- **Gaslighting & Reality Re-framing:** How to spot subtle reality distortions and anchor yourself in objective data.
- **The Scarcity Trap:** Recognizing manufactured urgency and maintaining strategic detachment.
- **Reciprocity Shielding:** Uncoupling genuine generosity from manipulative debt obligations.

### Chapter 3: Ethical Authority & Positioning
Position yourself as the undisputed expert without resorting to aggression. Master the subtle art of silence, calibrated questions, and decisive framing.

---

## C. PAYHIP METADATA & SEO TAGS
- **Recommended Price:** $67 (High Perceived Value)
- **Payhip Description:** Transform your influence and protect your decision-making with this comprehensive 45-page masterclass guide. Instant PDF download.
- **SEO Tags:** dark psychology guide, persuasion masterclass, influence playbook, payhip digital product, self-improvement pdf.

## D. VIRAL TIKTOK / INSTAGRAM SCRIPT
- **Hook:** "3 dark psychology triggers used in every high-stakes negotiation."
- **Body:** Most people think influence is about talking louder. It's actually about tactical pauses and emotional framing.
- **CTA:** Link in bio to download the complete 45-page masterclass guide.

VERIFICATION MANDATORY: Due to the specialized nature of this content, manual verification by the user against known safety standards is required before publication.`,
        createdAt: '7/9/2026',
      },
      {
        id: '2',
        title: 'The $10k/Mo AI Prompt & Printables Profit Blueprint',
        niche: 'Digital Business',
        topic: 'AI Prompt Engineering & Digital Printables for Etsy/Payhip',
        price: '$97',
        productType: 'AI Prompt & Printables Pack',
        content: `# The $10k/Mo AI Prompt & Printables Profit Blueprint

## A. CONTENT TITLE
**AI Printables Empire: The Complete $10k/Month Prompt Engineering & Passive Income Manual**

## B. FINAL MANUSCRIPT / CHAPTERS

### Chapter 1: The Zero-Cost Digital Business Model
Why digital PDFs and printables have 100% profit margins. No inventory, zero shipping, automated Payhip delivery 24/7.

### Chapter 2: The Master Prompt Library for Canva & Etsy
- **Prompt Set A:** High-Converting Daily Planner Interiors.
- **Prompt Set B:** Luxury Minimalist Affirmation Cards & Wall Art.
- **Prompt Set C:** Executive Budgeting & Expense Tracking Spreadsheets.

### Chapter 3: Automated Traffic & Sales Funnels
How to leverage zero-cost TikTok and Instagram Reels to drive organic buyers to your Payhip storefront without running paid ads.

---

## C. PAYHIP METADATA & SEO TAGS
- **Recommended Price:** $97 (Masterclass Bundle)
- **Payhip Description:** Build a $10k/month passive income stream selling digital printables and AI prompts. Complete manual + copy-paste prompt library.
- **SEO Tags:** ai prompt engineering, digital printables, payhip passive income, etsy seller blueprint, digital product store.

## D. VIRAL TIKTOK / INSTAGRAM SCRIPT
- **Hook:** "How I make $3,400 a month selling digital PDFs I generated with ChatGPT."
- **Body:** You don't need inventory or expensive software. AI writes the guides, Canva formats the PDFs, and Payhip delivers them automatically.
- **CTA:** Check the link in my bio for the full $10k blueprint manual.

VERIFICATION MANDATORY: Due to the specialized nature of this content, manual verification by the user against known safety standards is required before publication.`,
        createdAt: '7/9/2026',
      },
      {
        id: '3',
        title: '365-Day Dopamine Reset & Focus Master Planner',
        niche: 'Hyper-Niche Planner',
        topic: 'Dopamine Detox & ADHD Focus Mastery',
        price: '$37',
        productType: 'Hyper-Niche Planner Template',
        content: `# 365-Day Dopamine Reset & Focus Master Planner

## A. CONTENT TITLE
**The Dopamine Reset: 365 Days of Frictionless Focus & Deep Work Mastery**

## B. FINAL MANUSCRIPT / CHAPTERS

### Chapter 1: The Neuroscience of Digital Distraction
Understanding how constant notifications hijack your attention span and how to reclaim 4 hours of deep work daily.

### Chapter 2: The 30-Day Dopamine Fasting Framework
Step-by-step daily journaling prompts, evening reflection templates, and screen-time boundaries designed for high performers.

### Chapter 3: Sustainable Habit Stacking
Building unbreakable morning routines that eliminate decision fatigue and supercharge output.

---

## C. PAYHIP METADATA & SEO TAGS
- **Recommended Price:** $37 (Quick Win Planner)
- **Payhip Description:** Reclaim your focus and reset your attention span with this 365-day dopamine detox planner. Instant digital download.
- **SEO Tags:** dopamine detox planner, focus masterclass, adhd planner template, digital daily journal, payhip planner.

## D. VIRAL TIKTOK / INSTAGRAM SCRIPT
- **Hook:** "Stop letting your phone steal 4 hours of your day."
- **Body:** This 365-day dopamine reset planner eliminated my phone addiction and doubled my daily output. Zero fluff, 100% execution.
- **CTA:** Link in bio to download your instant copy.

VERIFICATION MANDATORY: Due to the specialized nature of this content, manual verification by the user against known safety standards is required before publication.`,
        createdAt: '7/9/2026',
      },
      {
        id: '4',
        title: 'ADHD Executive Function & Life Mastery Toolkit',
        niche: 'Hyper-Niche Template',
        topic: 'ADHD Time Blocking & Executive Function Systems',
        price: '$47',
        productType: 'Hyper-Niche Template',
        content: `# ADHD Executive Function & Life Mastery Toolkit

## A. CONTENT TITLE
**The ADHD Executive: Frictionless Time-Blocking & Life Mastery Templates**

## B. FINAL MANUSCRIPT / CHAPTERS

### Chapter 1: Overcoming Executive Dysfunction
Why traditional planners fail neurodivergent brains and how sensory-friendly time-blocking unlocks effortless productivity.

### Chapter 2: The Visual Time-Wedge System
- **The 15-Minute Rule:** Breaking overwhelming projects into micro-tasks.
- **Dopamine Menuing:** Structuring rewards and accountability loops.

### Chapter 3: Home & Work Management Templates
Ready-to-use checklist templates designed to save 10+ hours a week and eliminate task paralysis.

---

## C. PAYHIP METADATA & SEO TAGS
- **Recommended Price:** $47 (Standard Guide)
- **Payhip Description:** Frictionless time-blocking and executive function templates designed specifically for neurodivergent adults and busy creators.
- **SEO Tags:** adhd executive function, time blocking template, adhd planner, neurodivergent productivity, payhip toolkit.

## D. VIRAL TIKTOK / INSTAGRAM SCRIPT
- **Hook:** "If traditional planners don't work for your brain, try this instead."
- **Body:** This ADHD executive function toolkit uses sensory-friendly time blocking to save 10+ hours a week. Zero overwhelm.
- **CTA:** Tap the link in my bio to download the templates.

VERIFICATION MANDATORY: Due to the specialized nature of this content, manual verification by the user against known safety standards is required before publication.`,
        createdAt: '7/9/2026',
      },
      {
        id: '5',
        title: 'Forgotten Empires: The Ken Burns Style Historical Compendium',
        niche: 'Premium Hardcover Book',
        topic: 'Epic Historical Narratives & Chronology',
        price: '$125',
        productType: 'Hardcover Book Manuscript',
        content: `# Forgotten Empires: The Ken Burns Style Historical Compendium

## A. CONTENT TITLE
**Forgotten Empires: Epic Narratives & Photographic Chronology of Lost Civilizations**

## B. FINAL MANUSCRIPT / CHAPTERS

### Chapter 1: Echoes in Stone - The Architecture of Antiquity
Deep narrative exploration into the lost engineering triumphs of ancient river civilizations, Anatolian mountain fortresses, and Mesoamerican city-states.

### Chapter 2: The Human Tapestry - Letters from the Frontlines of History
Unpublished primary source letters, diary entries, and intimate human chronicles interwoven with sweeping geopolitical analysis.

### Chapter 3: The Legacy of Memory - Preservation and Discovery
How modern archival science and digital reconstruction bring centuries-old manuscripts back to life for modern collectors and historians.

---

## C. PAYHIP METADATA & SEO TAGS
- **Recommended Price:** $125 (Premium Hardcover / Collector Edition)
- **Payhip Description:** A stunning Ken Burns style historical compendium formatted for Print-on-Demand hardcover publishing and digital collectors.
- **SEO Tags:** historical compendium, ken burns style history, premium hardcover book, lost civilizations manuscript, payhip luxury ebook.

## D. VIRAL TIKTOK / INSTAGRAM SCRIPT
- **Hook:** "The most fascinating history book you will read this year."
- **Body:** Forgotten Empires dives deep into the intimate diaries and lost architectural wonders of antiquity. Formatted for premium hardcover collectors.
- **CTA:** Link in bio to get your digital collector edition.

VERIFICATION MANDATORY: Due to the specialized nature of this content, manual verification by the user against known safety standards is required before publication.`,
        createdAt: '7/9/2026',
      }
    ];
  });


  const [viewerProduct, setViewerProduct] = useState<DigitalProduct | null>(null);

  useEffect(() => {
    localStorage.setItem('pdf_profit_vault', JSON.stringify(products));
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vaultCount={products.length}
      />

      <main className="pb-16">
        {activeTab === 'creator' && (
          <ProductCreator
            onSaveProduct={handleSaveProduct}
            onOpenViewer={(product) => setViewerProduct(product)}
          />
        )}

        {activeTab === 'vault' && (
          <DigitalVault
            products={products}
            onOpenViewer={(product) => setViewerProduct(product)}
            onDeleteProduct={handleDeleteProduct}
            onLoadTemplate={(product) => setActiveTab('creator')}
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
    </div>
  );
}
