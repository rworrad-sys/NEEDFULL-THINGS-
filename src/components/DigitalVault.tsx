import React from 'react';
import { DigitalProduct } from '../types';
import { BookOpen, Trash2, Eye, Download, Sparkles, FolderArchive } from 'lucide-react';

interface DigitalVaultProps {
  products: DigitalProduct[];
  onOpenViewer: (product: DigitalProduct) => void;
  onDeleteProduct: (id: string) => void;
  onLoadTemplate: (product: DigitalProduct) => void;
}

export const DigitalVault: React.FC<DigitalVaultProps> = ({ products, onOpenViewer, onDeleteProduct, onLoadTemplate }) => {
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <FolderArchive className="w-8 h-8" />
          </div>
          <h3 className="text-white font-bold text-xl">Your Digital Vault is Empty</h3>
          <p className="text-slate-400 text-sm">
            Generate your first high-margin digital product in the AI Product Creator to save it here for Payhip deployment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Digital Product Vault</h2>
          <p className="text-slate-400 text-sm">Manage, preview, and export your turnkey Payhip digital products.</p>
        </div>
        <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 inline-flex items-center space-x-2">
          <span>Total Products in Vault:</span>
          <span className="font-bold text-white">{products.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {product.niche}
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">{product.price}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-all">
                {product.title}
              </h3>
              <p className="text-slate-400 text-xs line-clamp-3 mb-4">
                {product.topic}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Created: {product.createdAt}</span>
                <span>Payhip Ready</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onOpenViewer(product)}
                  className="flex items-center justify-center space-x-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([product.content], { type: 'text/markdown;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center justify-center space-x-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="flex items-center justify-center py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-xl transition-all border border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
