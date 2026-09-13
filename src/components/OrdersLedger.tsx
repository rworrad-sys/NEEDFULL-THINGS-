import React, { useState, useEffect } from 'react';
import { Order, DigitalProduct } from '../types';
import { DollarSign, ShoppingCart, TrendingUp, ShieldCheck, Download, RefreshCw, CheckCircle, ExternalLink, Search } from 'lucide-react';
import jsPDF from 'jspdf';

interface OrdersLedgerProps {
  products: DigitalProduct[];
  onOpenStorefront: () => void;
}

export const OrdersLedger: React.FC<OrdersLedgerProps> = ({ products, onOpenStorefront }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    formattedTotalRevenue: '$0.00',
    totalOrders: 0,
    averageOrderValue: '$0.00',
    totalFulfillments: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.customerEmail.toLowerCase().includes(term) ||
      order.productTitle.toLowerCase().includes(term) ||
      order.licenseKey.toLowerCase().includes(term)
    );
  });

  const handleDownloadFulfillmentPdf = (order: Order) => {
    // Locate the matching product content
    const matchedProduct = products.find((p) => p.id === order.productId) || {
      title: order.productTitle,
      niche: 'Digital Guide',
      content: `# ${order.productTitle}\n\nOfficial fulfillment copy issued to ${order.customerName || order.customerEmail}.\nLicense: ${order.licenseKey}`,
    };

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Cover Page
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, 186, 273);

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL DIGITAL PRODUCT FULFILLMENT', 105, 30, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(matchedProduct.title, 160);
    doc.text(splitTitle, 105, 55, { align: 'center' });

    doc.setFillColor(30, 41, 59);
    doc.roundedRect(30, 115, 150, 45, 3, 3, 'F');

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(9);
    doc.text('LICENSED PURCHASER:', 35, 125);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(order.customerName || order.customerEmail, 35, 134);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${order.id} | License: ${order.licenseKey}`, 35, 143);
    doc.text(`Transaction Status: Completed | Amount: ${order.formattedAmount}`, 35, 151);

    // Content Pages
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(matchedProduct.title, 20, 25);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const cleanedContent = (matchedProduct.content || '')
      .replace(/#+\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '');

    const lines = doc.splitTextToSize(cleanedContent, 170);
    let y = 40;
    for (let i = 0; i < lines.length; i++) {
      if (y > 275) {
        doc.addPage();
        y = 25;
      }
      doc.text(lines[i], 20, y);
      y += 5.5;
    }

    doc.save(`${order.id}_${order.productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Product', 'Amount', 'Payment Method', 'License Key', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      o.createdAt,
      `"${o.customerName}"`,
      o.customerEmail,
      `"${o.productTitle}"`,
      o.amount,
      o.paymentMethod,
      o.licenseKey,
      o.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Live Sales & Orders Ledger</h2>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            Real-time digital sales, Stripe transactions, automated PDF fulfillments, and customer licenses.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchOrders}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 text-xs flex items-center space-x-1.5 transition-all"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenStorefront}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>View Live Storefront</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Gross Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-white mt-2">
            {stats.formattedTotalRevenue}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>100% margin (zero COGS)</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Orders</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-white mt-2">
            {stats.totalOrders}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Real customer transactions
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Average Order Value</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-white mt-2">
            {stats.averageOrderValue}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Optimal digital pricing band
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Automated Deliveries</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-white mt-2">
            {stats.totalFulfillments}
          </div>
          <p className="text-[11px] text-cyan-400 mt-1">
            100% automated instant PDF
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by customer email, order ID, product, or license..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-slate-500 w-full focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment & License</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-white">{order.id}</div>
                      <div className="text-[11px] text-slate-500">{order.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{order.customerName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold line-clamp-1 max-w-xs">
                        {order.productTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {order.formattedAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px]">
                      <div className="text-slate-300 flex items-center space-x-1">
                        {order.paymentMethod === 'square' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                            Square Hosted
                          </span>
                        ) : (
                          <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                        )}
                      </div>
                      <div className="text-indigo-400">{order.licenseKey}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDownloadFulfillmentPdf(order)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all"
                        title="Re-download customer PDF license"
                      >
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
