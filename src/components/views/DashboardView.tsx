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
  TrendingUp,
  FolderKanban,
  Star,
  Download,
  Share2,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Plus,
  RefreshCw,
  ExternalLink,
  Box,
  Shield,
  FileCode,
  Sun,
  Layers,
  Cpu,
  Copy,
  Check,
  X,
  Eye,
} from 'lucide-react';
import { BrandKit, DesignItem, NavView, Project } from '../../types';
import { extractVisualCharacteristics, ExtractedVisualMetadata } from '../../utils/aiMetadataExtractor';

interface DashboardViewProps {
  onNavigate: (view: NavView) => void;
  designs: DesignItem[];
  projects: Project[];
  activeBrandKit: BrandKit;
  onToggleFavorite: (id: string) => void;
  onOpenAssistant: () => void;
  onStartTour: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  designs,
  projects,
  activeBrandKit,
  onToggleFavorite,
  onOpenAssistant,
  onStartTour,
}) => {
  const logosCount = designs.filter((d) => d.type === 'logo').length;
  const imagesCount = designs.filter((d) => d.type === 'image').length;
  const totalCount = designs.length;
  const favoritesCount = designs.filter((d) => d.isFavorite).length;

  const recentDesigns = designs.slice(0, 6);

  // Auto-Tagging & Visual DNA Inspector Modal State
  const [inspectedDesign, setInspectedDesign] = useState<DesignItem | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleDownloadDesign = (item: DesignItem) => {
    if (item.svgCode) {
      const blob = new Blob([item.svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 md:p-10 shadow-2xl">
        {/* Glow ambient background with signature colors: #800020, #F27430, #FFE566 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#800020]/40 via-[#F27430]/25 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#FFE566]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/30 border border-[#800020]/60 text-[#FFE566] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#F27430]" />
              <span>AI-Powered Logo & Image Creation for Modern Brands</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Create something <span className="bg-gradient-to-r from-white via-[#FFE566] to-[#F27430] bg-clip-text text-transparent">remarkable.</span>
            </h1>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Design production-ready vector logos, explore real-world Computer Vision object analysis, run A2A Judge compliance audits, and deploy unified brand visual assets.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('logo-generator')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-semibold text-xs md:text-sm shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
                <span>Generate Logo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('image-generator')}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs md:text-sm hover:bg-zinc-800 hover:border-[#F27430] transition-all flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-[#F27430]" />
                <span>Create AI Image</span>
              </button>
              <button
                type="button"
                onClick={onStartTour}
                className="px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
              >
                Take App Tour
              </button>
            </div>
          </div>

          {/* Active Brand Card Highlight */}
          <div className="w-full lg:w-72 bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 backdrop-blur-md shadow-xl shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <span className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">Active Brand Kit</span>
              <button
                type="button"
                onClick={() => onNavigate('brand-studio')}
                className="text-[#FFE566] hover:underline font-semibold text-[11px]"
              >
                Edit
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <div className="font-bold text-sm text-white">{activeBrandKit.name}</div>
              <div className="text-[11px] text-zinc-400">{activeBrandKit.tagline}</div>
              {/* Palette dots */}
              <div className="flex items-center gap-1.5 pt-1">
                {activeBrandKit.palette.map((swatch, idx) => (
                  <div
                    key={idx}
                    title={`${swatch.name}: ${swatch.hex}`}
                    className="w-5 h-5 rounded-full border border-black/30 shadow-sm"
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row (Clear concise visualizations) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Designs</span>
            <Sparkles className="w-4 h-4 text-[#FFE566]" />
          </div>
          <div className="text-2xl font-bold font-heading text-white mt-2">{totalCount || 12}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <TrendingUp className="w-3 h-3" /> +32% this week
          </div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Logos Created</span>
            <Sparkles className="w-4 h-4 text-[#800020]" />
          </div>
          <div className="text-2xl font-bold font-heading text-white mt-2">{logosCount || 8}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Vector SVG & PNG</div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Images Generated</span>
            <ImageIcon className="w-4 h-4 text-[#F27430]" />
          </div>
          <div className="text-2xl font-bold font-heading text-white mt-2">{imagesCount || 16}</div>
          <div className="text-[11px] text-zinc-400 mt-1">8K & Photorealistic</div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Brand Kits</span>
            <Palette className="w-4 h-4 text-[#FFE566]" />
          </div>
          <div className="text-2xl font-bold font-heading text-white mt-2">1 Active</div>
          <div className="text-[11px] text-[#FFE566] mt-1">#800020 & #F27430</div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Saved Projects</span>
            <FolderKanban className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white mt-2">{projects.length}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Synced to Cloud</div>
        </div>
      </div>

      {/* Configurable Visualizations & Metrics Section */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FFE566]" />
              Visual Intelligence & Activity Analytics
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Clear, concise metrics visualizing asset throughput, AI pipeline speeds, and brand harmony.
            </p>
          </div>

          {/* Timeframe Selector & Customizer */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Window:</span>
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-[#800020] text-white font-semibold"
              >
                7 Days
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white"
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Daily Activity Bar Chart */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Daily Generations</span>
              <span className="text-[#FFE566] font-mono text-[11px]">Avg 8.4/day</span>
            </div>
            {/* Custom SVG Bar Chart */}
            <div className="h-32 flex items-end gap-2 pt-4 px-1">
              {[
                { day: 'Mon', count: 4, height: '40%' },
                { day: 'Tue', count: 7, height: '65%' },
                { day: 'Wed', count: 5, height: '50%' },
                { day: 'Thu', count: 9, height: '85%' },
                { day: 'Fri', count: 12, height: '100%' },
                { day: 'Sat', count: 8, height: '75%' },
                { day: 'Sun', count: 10, height: '90%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    style={{ height: bar.height }}
                    className="w-full rounded-t-md bg-gradient-to-t from-[#800020] to-[#F27430] group-hover:to-[#FFE566] transition-all relative"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-mono bg-black px-1.5 py-0.5 rounded text-white transition-opacity pointer-events-none whitespace-nowrap">
                      {bar.count}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Asset Type Distribution */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Asset Mix Distribution</span>
              <span className="text-zinc-400 font-mono text-[11px]">100% Total</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                  <span>Vector Logos (SVG)</span>
                  <span className="text-[#800020] font-bold">45%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-[#800020]" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                  <span>Cinematic 8K Images</span>
                  <span className="text-[#F27430] font-bold">30%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-[#F27430]" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                  <span>Veo 3 Video Ads</span>
                  <span className="text-[#FFE566] font-bold">15%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-[#FFE566]" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
                  <span>Computer Vision AR Scans</span>
                  <span className="text-purple-400 font-bold">10%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3: Brand Color DNA Saturation */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Palette Utilization</span>
              <span className="text-emerald-400 font-mono text-[11px]">Strict Harmony</span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#800020] border border-black/40" />
                  <span className="font-medium text-white">#800020 Oxblood Base</span>
                </div>
                <span className="font-mono text-xs text-zinc-300">42% weight</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F27430] border border-black/40" />
                  <span className="font-medium text-white">#F27430 Tangerine Energy</span>
                </div>
                <span className="font-mono text-xs text-zinc-300">28% weight</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE566] border border-black/40" />
                  <span className="font-medium text-white">#FFE566 Amber Accent</span>
                </div>
                <span className="font-mono text-xs text-zinc-300">18% weight</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border border-black/40" />
                  <span className="font-medium text-white">#FFFFFF Clean Contrast</span>
                </div>
                <span className="font-mono text-xs text-zinc-300">12% weight</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-heading text-white">Quick Actions</h2>
          <span className="text-xs text-zinc-400 font-mono">Instant Tool Launchers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('logo-generator')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-[#800020] hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#800020]/30 border border-[#800020] text-[#FFE566] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">Generate Logo</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">1, 4 or 8 concepts</div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('image-generator')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-[#F27430] hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F27430]/20 border border-[#F27430] text-[#F27430] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">Generate Image</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Cinematic & 3D</div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('computer-vision')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-purple-500 hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500 text-purple-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ScanEye className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">Computer Vision</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Object scan & AR</div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('a2a-judge')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-[#FFE566] hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFE566]/20 border border-[#FFE566] text-[#FFE566] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">A2A Judge Agent</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Self-healing audits</div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('brand-studio')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500 hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">Brand Studio</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Visual Identity Kit</div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('video-motion')}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-sky-500 hover:bg-zinc-900 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500 text-sky-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">Video & Motion</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Veo 3.1 Ad Animation</div>
          </button>
        </div>
      </div>

      {/* Recent Generations Gallery with AI Visual Characteristics Auto-Tagging */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27430]" />
              Recent Generations & AI Visual Characteristics
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[#FFE566]">
              {designs.length} assets
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AI Auto-Tagging Active</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('my-designs')}
              className="text-xs text-[#FFE566] hover:underline flex items-center gap-1 font-semibold"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {recentDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentDesigns.map((item) => {
              const visualMeta = extractVisualCharacteristics(item);
              const topTags = visualMeta.tags.slice(0, 3);
              const remainingTagsCount = Math.max(0, visualMeta.tags.length - 3);

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden hover:border-[#F27430]/60 transition-all shadow-lg flex flex-col justify-between"
                >
                  {/* Visual Preview */}
                  <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden p-4">
                    {item.svgCode ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: item.svgCode }}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Top badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider">
                        {item.type}
                      </span>
                      {item.svgCode && (
                        <span className="px-2 py-0.5 rounded-md bg-[#800020]/90 text-[#FFE566] text-[10px] font-mono">
                          SVG
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded-md bg-zinc-900/80 border border-zinc-700/80 text-[9px] font-mono text-zinc-300 backdrop-blur-sm flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-[#F27430]" />
                        <span>AI Tagged</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 hover:text-[#FFE566] transition-colors"
                      title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${item.isFavorite ? 'fill-[#FFE566] text-[#FFE566]' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Info Card with Auto-Tagging Badge System */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-zinc-950">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                        <button
                          type="button"
                          onClick={() => setInspectedDesign(item)}
                          className="shrink-0 text-[10px] font-mono text-[#FFE566] bg-[#800020]/30 hover:bg-[#800020]/50 border border-[#800020]/60 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
                          title="View complete AI Visual DNA breakdown"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-[#F27430]" />
                          <span>Visual DNA</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.prompt}
                      </p>

                      {/* Auto-Tagging Badge System: Extracted Key Visual Characteristics */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-900 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Layers className="w-3 h-3 text-[#F27430]" />
                            <span>Visual Characteristics:</span>
                          </span>
                          <span className="text-[10px] text-zinc-400">{visualMeta.contrastRatio}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {topTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => setInspectedDesign(item)}
                              title={`${tag.label}: ${tag.tooltip}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-[#F27430]/60 hover:text-white transition-all text-left"
                            >
                              {tag.category === 'geometry' && <Box className="w-2.5 h-2.5 text-[#FFE566]" />}
                              {tag.category === 'color' && (
                                <span className="flex items-center gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#F27430]" />
                                </span>
                              )}
                              {tag.category === 'fidelity' && <Zap className="w-2.5 h-2.5 text-[#800020]" />}
                              {tag.category === 'lighting' && <Sun className="w-2.5 h-2.5 text-[#FFE566]" />}
                              {tag.category === 'compliance' && <Shield className="w-2.5 h-2.5 text-emerald-400" />}
                              <span>{tag.label}</span>
                            </button>
                          ))}

                          {remainingTagsCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setInspectedDesign(item)}
                              className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-[#FFE566] transition-colors"
                            >
                              +{remainingTagsCount}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with Quick Download and Studio Navigation */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
                      <button
                        type="button"
                        onClick={() => handleDownloadDesign(item)}
                        className="hover:text-white font-semibold flex items-center gap-1 text-[11px] transition-colors"
                        title={item.svgCode ? 'Download SVG Vector' : 'Download Image'}
                      >
                        <Download className="w-3 h-3 text-[#FFE566]" />
                        <span>Export</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate('image-editor')}
                        className="text-[#F27430] hover:underline font-sans font-semibold flex items-center gap-1"
                      >
                        Open in Studio <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Sparkles className="w-6 h-6 text-[#F27430]" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">No Designs Created Yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Ready to build your first iconic vector logo or cinematic visual? Choose a tool from the left panel to begin.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('logo-generator')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold"
              >
                Generate First Logo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Visual DNA Inspector Dialog Modal */}
      {inspectedDesign && (() => {
        const meta = extractVisualCharacteristics(inspectedDesign);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#800020]/30 border border-[#800020]/60 text-[#FFE566] text-[10px] font-mono font-semibold mb-1.5">
                    <Sparkles className="w-3 h-3 text-[#F27430]" />
                    <span>AI Visual Characteristics & Metadata Inspector</span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-white">{inspectedDesign.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{inspectedDesign.prompt}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedDesign(null)}
                  className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview & Key Stats Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-zinc-900 border border-zinc-800 aspect-video flex items-center justify-center p-4 overflow-hidden relative">
                  {inspectedDesign.svgCode ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: inspectedDesign.svgCode }}
                    />
                  ) : (
                    <img
                      src={inspectedDesign.url}
                      alt={inspectedDesign.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-zinc-300">
                    {inspectedDesign.aspectRatio} | {inspectedDesign.dimensions || '1024x1024'}
                  </div>
                </div>

                {/* Visual Architecture Metrics */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-400">Primary Style</span>
                    <span className="text-white font-bold">{meta.primaryStyle}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-400">Dominant Mood</span>
                    <span className="text-[#FFE566]">{meta.dominantMood}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-400">Contrast Ratio</span>
                    <span className="text-emerald-400 font-bold">{meta.contrastRatio}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-400">Scalability Rating</span>
                    <span className="text-[#F27430] font-bold">{meta.scalabilityRating}/100</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex justify-between items-center">
                    <span className="text-zinc-400">Topology Precision</span>
                    <span className="text-zinc-200">{meta.vectorPrecision}</span>
                  </div>
                </div>
              </div>

              {/* Complete AI Auto-Tagging Badges Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
                  <Cpu className="w-3.5 h-3.5 text-[#F27430]" />
                  <span>Extracted AI Visual Characteristic Badges</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {meta.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                          {tag.category === 'geometry' && <Box className="w-3 h-3 text-[#FFE566]" />}
                          {tag.category === 'color' && <Palette className="w-3 h-3 text-[#F27430]" />}
                          {tag.category === 'fidelity' && <Zap className="w-3 h-3 text-[#800020]" />}
                          {tag.category === 'lighting' && <Sun className="w-3 h-3 text-[#FFE566]" />}
                          {tag.category === 'compliance' && <Shield className="w-3 h-3 text-emerald-400" />}
                          <span>{tag.label}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">{tag.confidence}% Match</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">{tag.tooltip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color DNA Swatches */}
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
                  <Palette className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>Harmonized Color Palette</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {(inspectedDesign.palette || ['#800020', '#F27430', '#FFE566', '#FFFFFF']).map((hex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopyHex(hex)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs font-mono"
                      title="Click to copy HEX"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: hex }} />
                      <span className="text-zinc-300">{hex}</span>
                      {copiedHex === hex ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleDownloadDesign(inspectedDesign)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#F27430] text-xs font-semibold text-white transition-all flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>Download {inspectedDesign.svgCode ? 'Vector SVG' : 'Asset'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedDesign(null);
                      onNavigate('image-editor');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all"
                  >
                    Open in Studio
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
