import React, { useState } from 'react';
import { DigitalProduct } from '../types';
import { X, ChevronLeft, ChevronRight, Download, Copy, Check, BookOpen, Printer, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

interface FlipbookModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const FlipbookModal: React.FC<FlipbookModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'reader' | 'metadata' | 'marketing'>('reader');

  const handleCopy = () => {
    navigator.clipboard.writeText(product.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([product.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(16);
    doc.text(product.title, 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Niche: ${product.niche} | Type: ${product.productType} | Price: ${product.price}`, 20, 27);

    doc.setLineWidth(0.4);
    doc.line(20, 31, 190, 31);

    doc.setFontSize(10);
    doc.setTextColor(40);

    const splitText = doc.splitTextToSize(product.content, 170);
    let cursorY = 38;
    const pageHeight = 280;

    for (let i = 0; i < splitText.length; i++) {
      if (cursorY > pageHeight) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(splitText[i], 20, cursorY);
      cursorY += 5.5;
    }

    doc.save(`${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg line-clamp-1">{product.title}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                <span className="text-amber-400 font-semibold">{product.price}</span>
                <span>•</span>
                <span>{product.niche}</span>
                <span>•</span>
                <span>{product.productType}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Markdown</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="bg-slate-950/50 border-b border-slate-800 px-6 py-2 flex items-center space-x-4">
          <button
            onClick={() => setActiveView('reader')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
              activeView === 'reader' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            📖 Interactive E-Reader / PDF View
          </button>
          <button
            onClick={() => setActiveView('metadata')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
              activeView === 'metadata' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏷️ Payhip / Gumroad Listing & SEO
          </button>
          <button
            onClick={() => setActiveView('marketing')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
              activeView === 'marketing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎬 TikTok & IG Traffic Scripts
          </button>
        </div>

        {/* Modal Body / Reader Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-900/50">
          <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-xl p-8 sm:p-12 shadow-2xl relative">
            <div className="absolute top-4 right-4 text-xs font-mono text-slate-500">
              CANVA & PAYHIP READY
            </div>
            
            <div className="markdown-body prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed">
              <ReactMarkdown>{product.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div>VERIFICATION MANDATORY: Manual review required before publishing.</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
