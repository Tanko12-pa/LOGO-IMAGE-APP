import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  ScanEye,
  Scale,
  Palette,
  SlidersHorizontal,
  Video,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Zap,
} from 'lucide-react';
import { NavView } from '../../types';

interface PublicLandingViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup') => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onNavigate, onOpenAuthModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is LOGO & IMAGE GENERATOR?',
      a: 'LOGO & IMAGE GENERATOR is a professional AI-powered visual design platform engineered to produce crisp, scalable vector logos and high-fidelity 8K marketing visuals from simple natural language prompts, featuring real-time Computer Vision visual analysis and A2A Judge agent self-maintenance.',
    },
    {
      q: 'How does AI logo generation work?',
      a: 'Our dual-pipeline architecture separates vector branding from raster images. When generating a logo, prompts are dynamically enriched with geometric, contrast, and transparency rules to produce clean, mathematically balanced SVG vector paths and high-resolution transparent PNG files.',
    },
    {
      q: 'Can I create multiple logo concepts simultaneously?',
      a: 'Yes! You can choose to generate 1, 4, or 8 distinct concept directions. Each concept delivers a unique visual aesthetic rather than slight variations of the same graphic.',
    },
    {
      q: 'What is the Computer Vision and AR Overlay feature?',
      a: 'You can upload any photo or product shot to isolate objects, extract bounding boxes, inspect dominant colors, and automatically convert the visual elements into crisp vector logo and image prompts.',
    },
    {
      q: 'How does the A2A Judge Agent prevent errors?',
      a: 'A2A (Agent-to-Agent) utilizes a Creator Agent to formulate the initial design specs, followed by an Art Director Judge Agent that audits WCAG contrast, geometric scalability, and brand harmony. The Judge Agent automatically debugs and self-heals any detected issues before rendering.',
    },
    {
      q: 'What file formats are supported for export?',
      a: 'We support true SVG vector files for logos, transparent PNG, high-resolution JPEG, WebP, and structured JSON brand kit identity specifications.',
    },
    {
      q: 'Does the application work offline?',
      a: 'Yes, offline mode caches your projects, brand kits, and recent generations in local browser storage, allowing seamless work without an internet connection.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-[#F27430] selection:text-white">
      {/* Top Navbar on Public Landing */}
      <header className="h-16 px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-zinc-900/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#800020] via-[#F27430] to-[#FFE566] p-0.5 shadow-md">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FFE566]" />
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white font-heading">
            LOGIMAGE<span className="text-[#FFE566]">.AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('billing')}
            className="text-xs text-zinc-400 hover:text-white font-semibold transition-colors hidden sm:inline"
          >
            Pricing & Plans
          </button>
          <button
            type="button"
            onClick={() => (onOpenAuthModal ? onOpenAuthModal('signin') : onNavigate('dashboard'))}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 font-semibold transition-all cursor-pointer"
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup') : onNavigate('dashboard'))}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] hover:opacity-95 text-xs text-white font-bold shadow-md shadow-[#800020]/30 transition-all cursor-pointer"
          >
            Sign Up (7-Day Trial)
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-28 md:pt-24 md:pb-36 overflow-hidden text-center">
        {/* Ambient Top Glow using signature colors */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566] blur-[120px] opacity-25 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800020]/25 border border-[#800020]/50 text-[#FFE566] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#F27430]" />
            <span>AI-Powered Logo & Image Creation for Modern Brands</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight leading-[1.1]">
            Create Logos & Images That Make Your Brand{' '}
            <span className="bg-gradient-to-r from-white via-[#FFE566] to-[#F27430] bg-clip-text text-transparent">
              Stand Out.
            </span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Generate professional logos, marketing graphics, product visuals, social-media designs, and brand assets with AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup') : onNavigate('dashboard'))}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-sm shadow-xl shadow-[#800020]/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sign Up with Email (7-Day Free Trial)</span>
              <ArrowRight className="w-4 h-4 text-[#FFE566]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('billing')}
              className="px-7 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white font-bold text-sm hover:bg-zinc-800 hover:border-[#FFE566] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#FFE566]" />
              <span>Subscription & Plans</span>
            </button>
          </div>

          <p className="text-[11px] font-mono text-zinc-400">
            ✓ 7-Day Free Trial included for all new users • 150 AI credits • No credit card required to start
          </p>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-[#FFE566] uppercase tracking-wider">
            Engineered For Creative Excellence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Designed for Modern Businesses
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A complete suite from prompt expansion to vector brand identities and real-world computer vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-[#800020] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#800020]/30 border border-[#800020] text-[#FFE566] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">AI Logo Generator</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate 1, 4, or 8 vector concepts simultaneously. Export clean SVG code, transparent PNGs, and verify contrast with an automated brand checklist.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-[#F27430] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#F27430]/20 border border-[#F27430] text-[#F27430] flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">AI Image Generator</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Turn text briefs into cinematic 8K visuals, product photography setups, and social media banners with automated prompt enhancement.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-purple-500 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500 text-purple-300 flex items-center justify-center">
              <ScanEye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">Computer Vision & AR</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sub-50ms object recognition and interactive HUD bounding box overlays. Extract prompts and dominant color harmonies directly from photographs.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-zinc-950/80 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#FFE566] uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Everything You Need To Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#FFE566]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-zinc-900 text-center text-xs text-zinc-500 space-y-3">
        <div className="flex items-center justify-center gap-2 text-zinc-300 font-bold font-heading">
          <Sparkles className="w-4 h-4 text-[#FFE566]" />
          <span>LOGO & IMAGE GENERATOR</span>
        </div>
        <p>© 2026 LOGO & IMAGE GENERATOR. AI-Powered Visual Design Platform.</p>
        <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-2">
          <button type="button" onClick={() => onNavigate('dashboard')} className="hover:underline">
            Open Dashboard
          </button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('settings')} className="hover:underline">
            Security & Passkeys
          </button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('feedback')} className="hover:underline">
            Feedback
          </button>
        </div>
      </footer>
    </div>
  );
};
