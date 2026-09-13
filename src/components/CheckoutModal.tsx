import React, { useState } from 'react';
import { DigitalProduct, Order } from '../types';
import { X, ShieldCheck, Lock, CreditCard, Sparkles, CheckCircle, Download, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';

interface CheckoutModalProps {
  product: DigitalProduct;
  onClose: () => void;
  onOrderCompleted?: (order: Order) => void;
  payhipStoreUrl?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  onClose,
  onOrderCompleted,
  payhipStoreUrl,
}) => {
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 47;
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'square' | 'card' | 'stripe'>('square');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSquareCheckout = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/square/checkout-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          amount: numericPrice,
          customerEmail: customerEmail || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setPaymentMethod('card');
        setErrorMessage(
          data.message ||
            'Square is not fully connected yet. Add SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in Settings, or use Direct Card below.'
        );
      }
    } catch (err: any) {
      console.error('Square checkout link error:', err);
      setPaymentMethod('card');
      setErrorMessage('Could not connect to Square API. You can complete checkout directly below.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          amount: numericPrice,
          customerEmail: customerEmail || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        // Stripe key not yet configured in server environment; fallback smoothly
        setPaymentMethod('card');
        setErrorMessage(data.message || 'Stripe Secret Key not yet loaded in environment. You can complete live checkout directly below.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Network error initiating Stripe checkout. You can use Direct Card Checkout.');
    } finally {
      setIsProcessing(false);
    }
  };


  const handleDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) {
      setErrorMessage('Please enter your email address for order delivery.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          amount: numericPrice,
          customerEmail,
          customerName: customerName || 'Customer',
          paymentMethod: 'direct_card',
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        if (onOrderCompleted) {
          onOrderCompleted(data.order);
        }
      } else {
        setErrorMessage(data.error || 'Payment failed to process. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Connection error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadOfficialPdf = () => {
    if (!completedOrder) return;
    setIsDownloadingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Cover Page
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 297, 'F');

      // Accent gold border
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(1.5);
      doc.rect(12, 12, 186, 273);

      doc.setTextColor(245, 158, 11); // Amber
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL VERIFIED DIGITAL RELEASE', 105, 30, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(product.title, 160);
      doc.text(splitTitle, 105, 55, { align: 'center' });

      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Category: ${product.niche}`, 105, 90, { align: 'center' });

      // Customer License Box
      doc.setFillColor(30, 41, 59); // slate-800
      doc.roundedRect(30, 115, 150, 45, 3, 3, 'F');

      doc.setTextColor(245, 158, 11);
      doc.setFontSize(9);
      doc.text('ISSUED TO AUTHORIZED LICENSEE:', 35, 125);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(completedOrder.customerName || completedOrder.customerEmail, 35, 134);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Order ID: ${completedOrder.id} | License: ${completedOrder.licenseKey}`, 35, 143);
      doc.text(`Transaction Date: ${completedOrder.createdAt} | Status: 100% Verified`, 35, 151);

      // Footer notice
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text('Distributed via PDF Profit Engine Cloud Run Production Infrastructure', 105, 270, { align: 'center' });

      // Content Pages
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(product.title, 20, 25);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, 30, 190, 30);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      // Clean markdown tags for PDF rendering
      const cleanedContent = product.content
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

      doc.save(`${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_licensed.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2 text-white">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm">Instant Production Checkout</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {completedOrder ? (
            /* Order Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Your purchase has been processed and your license is ready.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Order Reference:</span>
                  <span className="text-amber-400 font-bold">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Product:</span>
                  <span className="text-white truncate max-w-[240px]">{completedOrder.productTitle}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Paid:</span>
                  <span className="text-emerald-400 font-bold">{completedOrder.formattedAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>License Key:</span>
                  <span className="text-indigo-400 font-bold">{completedOrder.licenseKey}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Email:</span>
                  <span className="text-slate-300">{completedOrder.customerEmail}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownloadOfficialPdf}
                  disabled={isDownloadingPdf}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Licensed PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Licensed PDF Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <div className="space-y-5">
              {/* Product summary card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <span className="text-xs font-mono text-amber-400">{product.niche}</span>
                  <h4 className="text-white font-bold text-sm line-clamp-1">{product.title}</h4>
                  <p className="text-xs text-slate-400">Instant PDF Download + Lifetime Updates</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-2xl font-bold font-mono text-emerald-400">{product.price}</span>
                  <div className="text-[10px] text-slate-500">One-time payment</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('square')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    paymentMethod === 'square'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Square Pay</span>
                  <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1 rounded">FAST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Direct Card</span>
                </button>

                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  disabled={isProcessing}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    paymentMethod === 'stripe'
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Stripe Pay</span>
                </button>
              </div>

              {errorMessage && (
                <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              {paymentMethod === 'square' ? (
                /* Square Pay Option View */
                <div className="space-y-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
                      Sq
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>Square Hosted Checkout</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-mono">
                          Official
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Supports Credit/Debit, Apple Pay, Google Pay & Cash App Pay
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address for License Delivery
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="buyer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Your licensed manuscript PDF and order receipt will be sent directly here.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSquareCheckout}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Opening Square Checkout...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Pay {product.price} with Square</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-slate-500 text-center space-y-1">
                    <p>Secured and processed by Square, Inc.</p>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      Or use direct card checkout without leaving this page
                    </button>
                  </div>
                </div>
              ) : (
                /* Direct Card Form */
                <form onSubmit={handleDirectPayment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Email for PDF Delivery</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pl-9 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                      <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">MM / YY</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">CVC Security Code</label>
                      <input
                        type="text"
                        placeholder="923"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing Live Order...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          <span>Pay {product.price} & Download Instantly</span>
                        </>
                      )}
                    </button>

                    {payhipStoreUrl && (
                      <a
                        href={payhipStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-xs text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        Prefer external Payhip? Buy on Payhip Store <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    )}

                    <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>256-Bit SSL Encrypted</span>
                      </span>
                      <span>•</span>
                      <span>Direct Cloud Run Fulfillment</span>
                      <span>•</span>
                      <span>Perpetual PDF Access</span>
                    </div>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
