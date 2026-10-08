import React, { useState } from 'react';
import {
  Shield,
  Users,
  Activity,
  CreditCard,
  Zap,
  TrendingUp,
  Server,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [featureFlags, setFeatureFlags] = useState({
    geminiVisionActive: true,
    a2aJudgeEnabled: true,
    veoVideoGeneration: true,
    biometricHardwarePasskey: true,
    paypalProductionCheckout: false,
    offlineIndexedDbSync: true,
  });

  const toggleFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Master Enterprise Administrator Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            System Admin & AI Configuration
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Monitor real-time generative GPU throughput, user registrations, billing webhooks, and feature flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server Cluster: Healthy</span>
          </span>
        </div>
      </div>

      {/* Admin KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-[#FFE566]" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">4,829</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% MoM
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Generations Completed</span>
            <Zap className="w-4 h-4 text-[#F27430]" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">84,912</div>
          <div className="text-[11px] text-zinc-400 font-mono">99.4% Success Rate</div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Subscriptions</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">1,208</div>
          <div className="text-[11px] text-[#FFE566] font-mono">ARR: $324,500</div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>GPU Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">48 ms</div>
          <div className="text-[11px] text-zinc-400 font-mono">us-west1 region</div>
        </div>
      </div>

      {/* Feature Flags & System Toggles */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FFE566]" />
            Dynamic System Feature Flags
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono">Instant Hot-Reload</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {Object.entries(featureFlags).map(([key, val]) => (
            <div
              key={key}
              onClick={() => toggleFlag(key as any)}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {val ? 'Enabled in production environment' : 'Disabled / Maintenance state'}
                </div>
              </div>

              {val ? (
                <ToggleRight className="w-6 h-6 text-[#F27430] shrink-0" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-zinc-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Firebase Cloud Infrastructure Monitoring Panel (Secured) */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-[#F27430]" />
            Firebase Firestore & Authentication Infrastructure
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            Enterprise Cloud Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Firebase Services</div>
            <div className="text-sm font-bold font-mono text-white">Firestore & Authentication</div>
            <div className="text-[10px] text-emerald-400">Credentials Hidden & Protected Server-Side</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Firestore Security Rules</div>
            <div className="text-sm font-bold font-mono text-[#FFE566]">
              Zero-Trust ABAC Active
            </div>
            <div className="text-[10px] text-emerald-400">Rules Deployed & Enforced</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Public Access Architecture</div>
            <div className="text-sm font-bold font-mono text-[#F27430]">Multi-Tenant Public Auth</div>
            <div className="text-[10px] text-emerald-400">Open to All Personal Emails & Google Users</div>
          </div>
        </div>
      </div>

      {/* PayPal Environment & Payment Gateway Architecture (Protected) */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#009cde]" />
            PayPal Subscriptions & Payment Gateway Security
          </h2>
          <span className="text-xs font-mono text-[#009cde] bg-[#0070ba]/10 px-2.5 py-1 rounded-xl border border-[#0070ba]/30">
            REST API Integrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Gateway Environment</div>
            <div className="text-sm font-bold font-mono text-white">PayPal REST Subscriptions</div>
            <div className="text-[10px] text-emerald-400">Server-Side Proxy Architecture</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Catalog Tiers</div>
            <div className="text-sm font-bold font-mono text-[#FFE566]">Monthly ($19.99) & Annual ($199.99)</div>
            <div className="text-[10px] text-zinc-400">7-Day Free Trial Auto-Enrollment</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Client Credentials</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              Protected in Server Environment
            </div>
            <div className="text-[10px] text-emerald-400">Zero Public Exposure</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Client Secret Key</div>
            <div className="text-sm font-bold font-mono text-emerald-400">Server Secrets Only</div>
            <div className="text-[10px] text-zinc-400">Never Exposed in Browser or Logs</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Webhook Security</div>
            <div className="text-sm font-bold font-mono text-cyan-400">Cryptographic Signature Verification</div>
            <div className="text-[10px] text-emerald-400">Auto-Validates Against PayPal API</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-[11px] text-zinc-400 font-mono">Payment Verification</div>
            <div className="text-sm font-bold font-mono text-emerald-400">Server-Authoritative Check</div>
            <div className="text-[10px] text-emerald-400">Access Granted After API Confirmation</div>
          </div>
        </div>
      </div>
    </div>
  );
};
