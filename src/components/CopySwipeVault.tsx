import React, { useState, useEffect, useMemo } from 'react';
import { CopySwipeItem, CopyCategory } from '../types';
import { INITIAL_SWIPE_ITEMS, NICHES } from '../data/copySwipeData';
import {
  Mail,
  Heading,
  MousePointerClick,
  Sparkles,
  Plus,
  Search,
  Copy,
  Check,
  Star,
  Trash2,
  Edit3,
  Download,
  Tag,
  Zap,
  Bookmark,
  FileText,
  X,
  TrendingUp,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const STORAGE_KEY = 'pdf_profit_copy_swipe_vault';

export const CopySwipeVault: React.FC = () => {
  const [items, setItems] = useState<CopySwipeItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load swipe file from storage', e);
      }
    }
    return INITIAL_SWIPE_ITEMS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNiche, setSelectedNiche] = useState<string>('All Niches');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [showCustomOnly, setShowCustomOnly] = useState<boolean>(false);

  // Modal states for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CopySwipeItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    category: CopyCategory;
    niche: string;
    text: string;
    subtext: string;
    conversionMetric: string;
    angle: string;
    notes: string;
  }>({
    category: 'subject_line',
    niche: 'Digital Business',
    text: '',
    subtext: '',
    conversionMetric: '',
    angle: '',
    notes: '',
  });

  // Copied item indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save swipe file to storage', e);
    }
  }, [items]);

  // Handle copy text with feedback
  const handleCopyText = (text: string, id: string, label: string = 'Text') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopyFeedback(label);
    setTimeout(() => {
      setCopiedId(null);
      setCopyFeedback(null);
    }, 2000);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to remove this copy asset from your swipe file?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      category: selectedCategory === 'all' || selectedCategory === 'favorites' || selectedCategory === 'custom'
        ? 'subject_line'
        : (selectedCategory as CopyCategory),
      niche: selectedNiche === 'All Niches' ? 'Digital Business' : selectedNiche,
      text: '',
      subtext: '',
      conversionMetric: 'Proven High-Converter',
      angle: 'Curiosity Gap',
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: CopySwipeItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      niche: item.niche,
      text: item.text,
      subtext: item.subtext || '',
      conversionMetric: item.conversionMetric || '',
      angle: item.angle || '',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    if (editingItem) {
      // Edit existing
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                category: formData.category,
                niche: formData.niche,
                text: formData.text.trim(),
                subtext: formData.subtext.trim() || undefined,
                conversionMetric: formData.conversionMetric.trim() || undefined,
                angle: formData.angle.trim() || undefined,
                notes: formData.notes.trim() || undefined,
              }
            : item
        )
      );
    } else {
      // Create new
      const newItem: CopySwipeItem = {
        id: `custom-${Date.now()}`,
        category: formData.category,
        niche: formData.niche,
        text: formData.text.trim(),
        subtext: formData.subtext.trim() || undefined,
        conversionMetric: formData.conversionMetric.trim() || 'Custom Tested',
        angle: formData.angle.trim() || 'Direct Hook',
        notes: formData.notes.trim() || undefined,
        isCustom: true,
        isFavorite: true,
        createdAt: new Date().toLocaleDateString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Reset to default swipe library
  const handleResetDefaults = () => {
    if (confirm('Reset swipe library to default high-converting templates? Custom items will be refreshed.')) {
      setItems(INITIAL_SWIPE_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SWIPE_ITEMS));
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'favorites') {
          if (!item.isFavorite) return false;
        } else if (selectedCategory === 'custom') {
          if (!item.isCustom) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Niche filter
      if (selectedNiche !== 'All Niches' && item.niche !== selectedNiche) {
        return false;
      }

      // Favorites only toggle
      if (showFavoritesOnly && !item.isFavorite) {
        return false;
      }

      // Custom only toggle
      if (showCustomOnly && !item.isCustom) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = item.text.toLowerCase().includes(query);
        const subtextMatch = item.subtext?.toLowerCase().includes(query) || false;
        const nicheMatch = item.niche.toLowerCase().includes(query);
        const angleMatch = item.angle?.toLowerCase().includes(query) || false;
        const metricMatch = item.conversionMetric?.toLowerCase().includes(query) || false;
        const notesMatch = item.notes?.toLowerCase().includes(query) || false;
        return textMatch || subtextMatch || nicheMatch || angleMatch || metricMatch || notesMatch;
      }

      return true;
    });
  }, [items, selectedCategory, selectedNiche, showFavoritesOnly, showCustomOnly, searchQuery]);

  // Counts for tabs
  const subjectCount = items.filter((i) => i.category === 'subject_line').length;
  const headlineCount = items.filter((i) => i.category === 'headline').length;
  const ctaCount = items.filter((i) => i.category === 'cta').length;
  const favCount = items.filter((i) => i.isFavorite).length;
  const customCount = items.filter((i) => i.isCustom).length;

  // Export as Markdown
  const handleExportMarkdown = () => {
    let md = `# High-Converting Copywriting Swipe File\nGenerated from PDF Profit Engine Marketing Studio\nDate: ${new Date().toLocaleDateString()}\n\n`;

    const groups: { [key: string]: CopySwipeItem[] } = {
      'Email Subject Lines': filteredItems.filter((i) => i.category === 'subject_line'),
      'Sales Headlines': filteredItems.filter((i) => i.category === 'headline'),
      'Call-to-Action (CTA) Phrases': filteredItems.filter((i) => i.category === 'cta'),
    };

    Object.entries(groups).forEach(([title, groupItems]) => {
      if (groupItems.length === 0) return;
      md += `## ${title} (${groupItems.length})\n\n`;
      groupItems.forEach((item, index) => {
        md += `### ${index + 1}. [${item.niche}] ${item.angle ? `(${item.angle})` : ''}\n`;
        md += `**Copy:** "${item.text}"\n`;
        if (item.subtext) md += `**Subtext/Preview:** ${item.subtext}\n`;
        if (item.conversionMetric) md += `**Metric:** ${item.conversionMetric}\n`;
        if (item.notes) md += `**Notes:** ${item.notes}\n`;
        md += `\n---\n\n`;
      });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Copywriting_Swipe_File_${selectedNiche.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export as PDF
  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('High-Converting Copywriting Swipe File', 20, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Niche Filter: ${selectedNiche} | Category: ${selectedCategory.toUpperCase()} | Items: ${filteredItems.length}`, 20, 27);

    doc.setLineWidth(0.4);
    doc.line(20, 31, 190, 31);

    doc.setFontSize(9);
    doc.setTextColor(40);

    let cursorY = 38;
    const pageHeight = 275;

    filteredItems.forEach((item, idx) => {
      if (cursorY > pageHeight - 30) {
        doc.addPage();
        cursorY = 20;
      }

      // Title/Niche line
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      const catLabel = item.category === 'subject_line' ? 'EMAIL SUBJECT' : item.category === 'headline' ? 'HEADLINE' : 'CTA PHRASE';
      doc.text(`${idx + 1}. [${catLabel}] - ${item.niche} (${item.angle || 'Direct Hook'})`, 20, cursorY);
      cursorY += 5;

      // Copy text
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const splitText = doc.splitTextToSize(`"${item.text}"`, 170);
      for (let i = 0; i < splitText.length; i++) {
        if (cursorY > pageHeight) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(splitText[i], 20, cursorY);
        cursorY += 4.5;
      }

      // Subtext & Metric if available
      if (item.subtext || item.conversionMetric) {
        doc.setFont('Helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        const subStr = [item.subtext ? `Subtext: ${item.subtext}` : '', item.conversionMetric ? `Metric: ${item.conversionMetric}` : ''].filter(Boolean).join(' | ');
        const splitSub = doc.splitTextToSize(subStr, 170);
        for (let i = 0; i < splitSub.length; i++) {
          if (cursorY > pageHeight) {
            doc.addPage();
            cursorY = 20;
          }
          doc.text(splitSub[i], 20, cursorY);
          cursorY += 4;
        }
      }

      cursorY += 4;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, cursorY, 190, cursorY);
      cursorY += 5;
    });

    doc.save(`copywriting_swipe_file_${selectedNiche.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const getCategoryIcon = (category: CopyCategory) => {
    switch (category) {
      case 'subject_line':
        return <Mail className="w-4 h-4 text-sky-400" />;
      case 'headline':
        return <Heading className="w-4 h-4 text-amber-400" />;
      case 'cta':
        return <MousePointerClick className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getCategoryBadge = (category: CopyCategory) => {
    switch (category) {
      case 'subject_line':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Mail className="w-3 h-3" />
            <span>Email Subject Line</span>
          </span>
        );
      case 'headline':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Heading className="w-3 h-3" />
            <span>Sales Headline</span>
          </span>
        );
      case 'cta':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MousePointerClick className="w-3 h-3" />
            <span>Call to Action</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>High-Converting Swipe File & Asset Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Email Subject Lines, Headlines & CTA Vault
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Battle-tested copywriting frameworks calibrated to maximize email open rates, landing page conversions, and Payhip checkout click-throughs across any niche. Store, customize, and reuse your winning assets.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Copy</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Download filtered items as formatted PDF"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Export as Markdown"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Subjects</span>
            </div>
            <p className="text-xl font-bold text-white">{subjectCount}</p>
            <p className="text-[11px] text-slate-400">Avg. 52.4% Open Rate</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
              <Heading className="w-3.5 h-3.5" />
              <span>Sales Headlines</span>
            </div>
            <p className="text-xl font-bold text-white">{headlineCount}</p>
            <p className="text-[11px] text-slate-400">Avg. 6.3% Page CVR</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Call to Actions</span>
            </div>
            <p className="text-xl font-bold text-white">{ctaCount}</p>
            <p className="text-[11px] text-slate-400">Avg. 13.8% Click CTR</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1">
              <Star className="w-3.5 h-3.5 fill-indigo-400/30" />
              <span>Saved & Custom</span>
            </div>
            <p className="text-xl font-bold text-white">{customCount + favCount}</p>
            <p className="text-[11px] text-slate-400">Your Active Library</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All Copy Assets ({items.length})
          </button>

          <button
            onClick={() => setSelectedCategory('subject_line')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'subject_line'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Subject Lines ({subjectCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('headline')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'headline'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Heading className="w-3.5 h-3.5" />
            <span>Headlines ({headlineCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('cta')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'cta'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Call to Actions ({ctaCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('favorites')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'favorites'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Starred Favorites ({favCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('custom')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'custom'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Custom Saved ({customCount})</span>
          </button>
        </div>

        {/* Niche selector & Search bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Niche selector dropdown */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
            >
              {NICHES.map((niche) => (
                <option key={niche} value={niche} className="bg-slate-900 text-slate-200">
                  {niche}
                </option>
              ))}
            </select>
          </div>

          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords, niche, psychological angle, or metric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset Library / Count */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 text-xs text-slate-400 font-mono">
            <span>Showing {filteredItems.length} items</span>
            <button
              onClick={handleResetDefaults}
              className="text-slate-500 hover:text-slate-300 underline text-[11px] cursor-pointer"
              title="Reset swipe library defaults"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Copied {copyFeedback} to Clipboard!</span>
        </div>
      )}

      {/* Copy Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No copy assets found</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto mb-4">
            Try adjusting your search query, selecting a different niche, or create a brand new custom copy asset.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            Create New Copy Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;
            const fullCopy = item.subtext ? `${item.text}\n\n${item.subtext}` : item.text;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Card Header: Category badge, Niche, and Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center flex-wrap gap-1.5">
                      {getCategoryBadge(item.category)}
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded-md text-[11px] font-mono">
                        {item.niche}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        title={item.isFavorite ? 'Remove from favorites' : 'Star as favorite'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>

                      {item.isCustom && (
                        <>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            title="Edit custom copy"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Primary Copy Text */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 mb-3 relative group/box">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-white font-semibold text-sm leading-relaxed tracking-tight">
                        {item.category === 'subject_line' ? `"${item.text}"` : item.text}
                      </p>
                    </div>

                    {/* Subtext / Preview if present */}
                    {item.subtext && (
                      <div className="mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-0.5">
                          {item.category === 'subject_line'
                            ? 'Preview Text / Subtext:'
                            : item.category === 'headline'
                            ? 'Sub-headline / Promise:'
                            : 'Button Micro-copy / Guarantee:'}
                        </span>
                        <p className="italic text-slate-300">{item.subtext}</p>
                      </div>
                    )}
                  </div>

                  {/* Metadata Chips: Angle & Metric */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
                    {item.angle && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 border border-slate-700/50">
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>Angle: {item.angle}</span>
                      </span>
                    )}

                    {item.conversionMetric && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3" />
                        <span>{item.conversionMetric}</span>
                      </span>
                    )}
                  </div>

                  {/* Notes / Tips if present */}
                  {item.notes && (
                    <p className="text-[11px] text-slate-400 mb-4 bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                      <span className="font-semibold text-slate-300">💡 Playbook Tip:</span> {item.notes}
                    </p>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    {item.isCustom ? 'Custom Stored Asset' : 'Verified Swipe File'}
                  </span>

                  <div className="flex items-center space-x-2">
                    {item.subtext && (
                      <button
                        onClick={() => handleCopyText(fullCopy, `${item.id}-all`, 'Full Copy Block')}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
                        title="Copy both primary text and subtext"
                      >
                        Copy All
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyText(item.text, item.id, item.category === 'subject_line' ? 'Subject Line' : item.category === 'headline' ? 'Headline' : 'CTA Phrase')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? 'Edit Copy Asset' : 'Add High-Converting Copy Asset'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {/* Category & Niche Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Copy Type
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CopyCategory })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="subject_line">Email Subject Line</option>
                    <option value="headline">Sales Page / Product Headline</option>
                    <option value="cta">Call to Action (CTA) Phrase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Niche
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Digital Business, AI Prompts, Mindset"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Primary Copy Text */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  {formData.category === 'subject_line'
                    ? 'Email Subject Line Text'
                    : formData.category === 'headline'
                    ? 'Main Sales Headline Text'
                    : 'Call-to-Action (CTA) Phrase'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    formData.category === 'subject_line'
                      ? 'e.g. The $37 PDF that out-earned my 9-to-5 this week [Download inside]'
                      : formData.category === 'headline'
                      ? 'e.g. Build a 100% Margin Digital Empire with Zero Inventory and Zero Code'
                      : 'e.g. Get Instant Access — Download Your Master Guide Now ($37)'
                  }
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Subtext / Preview text */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  {formData.category === 'subject_line'
                    ? 'Email Preview Text / Sub-hook (Optional)'
                    : formData.category === 'headline'
                    ? 'Sub-headline / Value Statement (Optional)'
                    : 'Button Subtext / Guarantee Line (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Includes the step-by-step checklist + zero-cost tools."
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Angle & Conversion Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Psychological Angle / Hook
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Curiosity Gap, Urgency, Radical Simplicity"
                    value={formData.angle}
                    onChange={(e) => setFormData({ ...formData, angle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Conversion Metric / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 54% Open Rate, 7.2% Sales CVR"
                    value={formData.conversionMetric}
                    onChange={(e) => setFormData({ ...formData, conversionMetric: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Notes / Tips */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Playbook Notes / When to Use (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best sent on Tuesday mornings; pair with quick 3-bullet body."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Store Copy Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
