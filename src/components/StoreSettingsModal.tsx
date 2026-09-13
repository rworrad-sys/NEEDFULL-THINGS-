import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { X, ShieldCheck, Check, Copy, ExternalLink, Sparkles, Key, DollarSign, Globe, Lock } from 'lucide-react';

interface StoreSettingsModalProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  onClose: () => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  settings,
  onSaveSettings,
  onClose,
}) => {
  const [form, setForm] = useState<StoreSettings>(settings);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null);
  const [squareStatus, setSquareStatus] = useState<{
    configured: boolean;
    hasToken: boolean;
    hasLocation: boolean;
    locationId: string;
    environment: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        setStripeConfigured(data.stripeConfigured);
        if (data.squareConfigured !== undefined) {
          setSquareStatus({
            configured: Boolean(data.squareConfigured && data.squareLocationConfigured),
            hasToken: Boolean(data.squareConfigured),
            hasLocation: Boolean(data.squareLocationConfigured),
            locationId: data.squareLocationId || '',
            environment: data.squareEnvironment || 'sandbox',
          });
        }
      })
      .catch(() => setStripeConfigured(false));

    fetch('/api/square/status')
      .then((r) => r.json())
      .then((sqData) => {
        setSquareStatus(sqData);
      })
      .catch((e) => console.error(e));
  }, []);


  const liveStoreUrl = window.location.origin;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(liveStoreUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2 text-white">
            <Globe className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Production Store & Payment Gateway Setup</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Live Storefront Public Link */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Live Customer Store URL</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Active & Hosted
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={liveStoreUrl}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Paste this link into your TikTok, Instagram bio, or Twitter/X to direct traffic to your store.
            </p>
          </div>

          {/* Payment Gateways */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Connected Payment Gateways
            </h4>

            {/* Square Payment Gateway */}
            <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-3.5 space-y-3 bg-gradient-to-br from-emerald-950/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                    Sq
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>Square Online Payment Gateway</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {squareStatus?.environment || 'Square'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Process cards, Apple Pay, and Google Pay with Square Payment Links.
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  squareStatus?.configured
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold'
                    : squareStatus?.hasToken
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {squareStatus?.configured ? 'LIVE & READY' : squareStatus?.hasToken ? 'TOKEN LOADED' : 'AWAITING KEY'}
                </span>
              </div>

              {/* Location ID input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Square Location ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. L... or location_id"
                    value={form.squareLocationId || ''}
                    onChange={(e) => setForm({ ...form, squareLocationId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Primary Checkout Method
                  </label>
                  <select
                    value={form.primaryGateway || 'square'}
                    onChange={(e) => setForm({ ...form, primaryGateway: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="square">Square Hosted Pay (Recommended)</option>
                    <option value="direct">Direct Card Checkout</option>
                    <option value="stripe">Stripe Hosted Checkout</option>
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-300">How to connect your Square account:</div>
                <p>
                  1. Open AI Studio <strong>Settings &rarr; Secrets</strong> and add:
                </p>
                <div className="font-mono text-[10px] text-emerald-400 space-y-0.5 pl-2">
                  <div>• <code className="text-amber-300">SQUARE_ACCESS_TOKEN</code> = your Square OAuth/access token</div>
                  <div>• <code className="text-amber-300">SQUARE_LOCATION_ID</code> = your Square merchant Location ID</div>
                  <div>• <code className="text-amber-300">SQUARE_ENVIRONMENT</code> = <span className="text-slate-300">production</span> or <span className="text-slate-300">sandbox</span></div>
                </div>
                <p className="text-slate-500 text-[10px]">
                  When set, customer payments route directly into your Square seller balance.
                </p>
              </div>
            </div>

            {/* In-app Direct Checkout */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct Card Checkout & Instant Delivery</div>
                  <div className="text-[11px] text-slate-400">
                    Built-in production payment authorization with instant PDF fulfillment.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            {/* Stripe Gateway */}

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Stripe Checkout Hosted Gateway</div>
                    <div className="text-[11px] text-slate-400">
                      Send buyers to official Stripe hosted payment pages.
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  stripeConfigured
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {stripeConfigured ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>
              {!stripeConfigured && (
                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  To connect your real Stripe account, add <code className="text-amber-400 font-mono">STRIPE_SECRET_KEY</code> in the AI Studio Settings secrets panel. The app will automatically route to your Stripe account!
                </div>
              )}
            </div>

            {/* Payhip Connection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Optional: Payhip Storefront URL
              </label>
              <input
                type="text"
                placeholder="https://payhip.com/yourstore"
                value={form.payhipStoreUrl}
                onChange={(e) => setForm({ ...form, payhipStoreUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                If you also maintain a Payhip storefront, linking it here displays a Payhip button in checkout.
              </p>
            </div>
          </div>

          {/* Store Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Store Branding
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store Name</label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Support Email</label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Store Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              Save Production Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
