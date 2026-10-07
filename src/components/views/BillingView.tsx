import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Lock,
  Copy,
  Check,
  Terminal,
  Clock,
  Gift,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { apiService } from '../../services/apiService';

interface BillingViewProps {
  userProfile: UserProfile;
  onUpdatePlan: (plan: 'FREE' | 'PRO' | 'BUSINESS' | 'TRIAL_7_DAYS' | 'MONTHLY_19_99' | 'YEARLY_199_99') => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ userProfile, onUpdatePlan }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState<string | null>(null);

  // Copy-Paste Google AI Studio Build Prompt State
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  const googleAIStudioPrompt = `Update, add, and implement a backend tech stack that handles hyper-realistic text-to-image synthesis, precise vector/logo output, text rendering within images, and localized image editing:
1. Foundation Models for Image Generation
- Stability AI Stable Image Core & Ultra: Lightning-fast high-fidelity masterpiece generations, cinematic lighting, and dense prompt logic.
- Midjourney API (via Third-Party Providers / Official B2B): Artistic, stylistic, and hyper-realistic digital artwork.
- Adobe Firefly API: Commercial safe generative engine for text-to-graphics and vector-aligned layouts.
- Flux.1 (Black Forest Labs via Replicate): Industry-leading legible in-image typography and text rendering.
- Gemini 3.1 Flash Image Preview: Multimodal image generation and real-time localized editing.

2. Specialized Logo & Vector AI Tools
- Recraft.ai: Native vector art, brand marks, and corporate brand kits with mathematically clean SVG paths.
- Vectorizer.ai: Automatic raster-to-vector tracer transforming PNG/JPG pixels into high-quality, fully scalable SVGs.

3. Image Editing & Asset Manipulation APIs (AI Lab / Quick Tools)
- Photoroom API: Rapid AI background removal, product image isolation, and auto-shadow generation.
- Claid.ai API: Auto 4K upscaling, sharpening blurry generations, 300 DPI print adjustment, and lighting normalization.
- Magnific AI: Hallucinatory micro-detail injection transforming standard 1024x1024 generations into print-ready resolutions.

4. Infrastructure & Development Ecosystem
- Rudra Prompt Engine Setup: Structured prompt variables turning basic user keywords into complex stylized rendering prompts.
- ComfyUI / Replicate: Managed cloud GPU infrastructure for hosting open-weights models (Flux.1, SD Ultra).
- Subscriptions: Sign Up with 7-Day Free Trial, $19.99/Monthly, OR $199.99/Yearly (Save $40/year).`;

  const plans = [
    {
      id: 'TRIAL_7_DAYS' as const,
      name: '7-Day Free Trial',
      tagline: 'Zero-risk access to all 5 foundation models & vector engines',
      badge: 'Zero Commitment',
      priceDisplay: '$0.00',
      periodDisplay: 'for 7 days',
      subtext: 'Auto-renews at $19.99/mo after 7 days. Cancel anytime.',
      credits: '150 Free AI Credits',
      features: [
        'Full access to Flux.1 (in-image typography)',
        'Midjourney v6.1 & Stability AI Ultra',
        'Recraft.ai native vector SVG output',
        'Photoroom background removal & auto-shadows',
        'Claid.ai 4K upscaler & Magnific AI details',
        'Full commercial usage rights',
      ],
      cta: 'Start 7-Day Free Trial',
      highlighted: false,
    },
    {
      id: 'MONTHLY_19_99' as const,
      name: 'Monthly Pro',
      tagline: 'Complete creative flexibility for creators & agencies',
      badge: 'Most Flexible',
      priceDisplay: '$19.99',
      periodDisplay: '/ month',
      subtext: 'Billed monthly. Cancel anytime with 1-click.',
      credits: '600 AI Credits / mo',
      features: [
        'Unlimited Flux.1 typography & Midjourney synthesis',
        'High-speed Stability Image Core & Ultra',
        'Native Vector SVG export via Recraft.ai',
        'Vectorizer.ai deep curve tracing (240+ nodes)',
        'Photoroom background removal & auto-shadows',
        'Claid.ai 4K upscaling & 300 DPI print calibration',
        'Commercial safe Adobe Firefly engine',
      ],
      cta: 'Subscribe Monthly ($19.99)',
      highlighted: false,
    },
    {
      id: 'YEARLY_199_99' as const,
      name: 'Annual Enterprise Pro',
      tagline: 'Maximum power & savings with dedicated GPU priority queue',
      badge: 'Best Value • Save $40/yr',
      priceDisplay: '$199.99',
      periodDisplay: '/ year',
      subtext: 'Equivalent to ~$16.66/month (Save ~17% vs monthly)',
      credits: '7,500 AI Credits / yr',
      features: [
        'Everything in Monthly Pro included',
        'Save $40 annually vs monthly billing',
        'Priority GPU queue (<1s latency on Replicate/ComfyUI)',
        'Batch ZIP archive export with metadata manifests',
        'Magnific AI hallucinatory detail injector',
        'Unlimited Brand Kit color harmonies & typography rules',
        'Dedicated creative AI engineer support',
      ],
      cta: 'Subscribe Yearly ($199.99)',
      highlighted: true,
    },
  ];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(googleAIStudioPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSelectPlan = async (planId: 'TRIAL_7_DAYS' | 'MONTHLY_19_99' | 'YEARLY_199_99') => {
    setSelectedPlanId(planId);
    setIsProcessingCheckout(true);

    try {
      const result = await apiService.updateSubscription(planId);
      onUpdatePlan(planId);
      setCheckoutSuccessMsg(
        planId === 'TRIAL_7_DAYS'
          ? '🎉 7-Day Free Trial activated! You now have 150 AI credits.'
          : `🎉 Subscribed successfully to ${planId === 'MONTHLY_19_99' ? '$19.99/Monthly' : '$199.99/Yearly'}!`
      );
      setTimeout(() => setCheckoutSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(`Subscription failed: ${err?.message || 'Error processing plan update'}`);
    } finally {
      setIsProcessingCheckout(false);
      setSelectedPlanId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold">
          <Zap className="w-3.5 h-3.5 text-[#F27430]" />
          <span>SaaS Subscriptions & Multi-Model Foundation Stack</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Transparent, Creator-First Pricing
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Access Flux.1 in-image typography, Midjourney artistic synthesis, Stability AI Ultra, Recraft.ai native vectors, and the AI Lab suite.
        </p>

        {/* Quick prompt copy banner */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsPromptModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#F27430] text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>View Google AI Studio Build Prompt</span>
          </button>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="px-4 py-2 rounded-xl bg-[#800020]/30 border border-[#800020]/60 text-xs font-mono text-[#FFE566] hover:bg-[#800020]/50 transition-all flex items-center gap-1.5"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Build Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {checkoutSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-between animate-fadeIn max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{checkoutSuccessMsg}</span>
          </div>
          <button type="button" onClick={() => setCheckoutSuccessMsg(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Credit Status Card */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#800020]/30 border border-[#800020] text-[#FFE566] flex items-center justify-center font-bold font-mono">
            <Zap className="w-6 h-6 text-[#F27430]" />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-400">Active AI Generation Credits</div>
            <div className="text-2xl font-bold font-heading text-white">
              {userProfile.creditsRemaining}{' '}
              <span className="text-xs text-zinc-500 font-normal">credits available</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right text-[11px] font-mono text-zinc-400 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800 w-full sm:w-auto">
          <div>
            Current Plan: <strong className="text-[#FFE566]">{userProfile.plan}</strong>
          </div>
          <div className="text-emerald-400 flex items-center gap-1 sm:justify-end mt-0.5">
            <Clock className="w-3 h-3" /> Multi-Model API Active
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid (Exact Plans: 7-Day Free Trial, $19.99/mo, $199.99/yr) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = userProfile.plan === plan.id;
          const isProcessingThis = isProcessingCheckout && selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-[#800020]/40 via-zinc-950 to-zinc-950 border-2 border-[#F27430] shadow-2xl ring-2 ring-[#F27430]/30'
                  : 'bg-zinc-950 border border-zinc-800 shadow-xl hover:border-zinc-700'
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white'
                      : 'bg-zinc-900 border border-zinc-700 text-[#FFE566]'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading text-white">{plan.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[#FFE566]">
                    {plan.credits}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold font-heading text-white">{plan.priceDisplay}</span>
                  <span className="text-xs text-zinc-400 font-mono">{plan.periodDisplay}</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mt-1">{plan.subtext}</div>

                <div className="mt-6 pt-6 border-t border-zinc-900 space-y-2.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    What's included:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-[#FFE566] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent || isProcessingCheckout}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-zinc-900 text-zinc-500 cursor-default border border-zinc-800'
                      : plan.highlighted
                      ? 'bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white shadow-lg shadow-[#800020]/40 hover:opacity-95'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-[#F27430]'
                  } disabled:opacity-50`}
                >
                  {isProcessingThis ? (
                    <span>Processing Plan...</span>
                  ) : isCurrent ? (
                    <span>Active Current Plan</span>
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backend Tech Stack Specifications Breakdown */}
      <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFE566]" />
              Integrated Backend Tech Stack & Foundation Models
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Production foundation models, vector pipelines, and image manipulation tools connected via unified API routing.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400">
            Multi-Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F27430]" />
              <span>1. Foundation Models</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong>Flux.1</strong> (legible in-image text), <strong>Midjourney v6.1</strong> (hyper-realistic art), <strong>Stability AI Ultra</strong> (cinematic lighting), and <strong>Adobe Firefly</strong> (commercial safe).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#800020]" />
              <span>2. Vector & Logo Tools</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong>Recraft.ai</strong> generates native vector art and clean corporate brand identities. <strong>Vectorizer.ai</strong> automatically traces raster pixels into lossless SVGs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE566]" />
              <span>3. AI Lab & Editing Suite</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong>Photoroom API</strong> (background removal & auto-shadows), <strong>Claid.ai API</strong> (4K upscale, 300 DPI print), and <strong>Magnific AI</strong> (hallucinatory detail injection).
            </p>
          </div>
        </div>
      </div>

      {/* Copy-Paste Build Prompt Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#FFE566]" />
                <h3 className="text-base font-bold font-heading text-white">
                  Google AI Studio Copy-Paste Build Prompt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPromptModalOpen(false)}
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
              {googleAIStudioPrompt}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500 font-mono">Ready to paste into Google AI Studio</span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt ? 'Copied to Clipboard!' : 'Copy Entire Specification'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
