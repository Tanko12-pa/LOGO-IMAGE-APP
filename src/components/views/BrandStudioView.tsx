import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Share2,
  RefreshCw,
  FolderPlus,
  Layers,
  SlidersHorizontal,
  CreditCard,
  Layout,
  ExternalLink,
} from 'lucide-react';
import { BrandKit, NavView } from '../../types';
import { apiService } from '../../services/apiService';
import { generateSvgLogoConcepts, downloadSvgFile } from '../../services/svgLogoGenerator';

interface BrandStudioViewProps {
  activeBrandKit: BrandKit;
  onUpdateBrandKit: (kit: BrandKit) => void;
  onNavigate: (view: NavView) => void;
}

export const BrandStudioView: React.FC<BrandStudioViewProps> = ({
  activeBrandKit,
  onUpdateBrandKit,
  onNavigate,
}) => {
  const [brandName, setBrandName] = useState(activeBrandKit.name || 'Oxblood Signature');
  const [tagline, setTagline] = useState(activeBrandKit.tagline || 'Visual Authority for Modern Leaders');
  const [industry, setIndustry] = useState(activeBrandKit.industry || 'Creative Technology & AI');
  const [description, setDescription] = useState(activeBrandKit.description || 'Premium generative design platform');
  const [mission, setMission] = useState(activeBrandKit.mission || 'To empower creators with iconic visual identities.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdentity, setGeneratedIdentity] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Generate SVG logos for preview
  const primaryLogoSvg = generateSvgLogoConcepts({
    brandName,
    tagline,
    style: 'Luxury Corporate',
    conceptCount: 1,
    primaryColor: '#800020',
    accentColor: '#F27430',
    highlightColor: '#FFE566',
  })[0]?.svgCode;

  const secondaryLogoSvg = generateSvgLogoConcepts({
    brandName,
    tagline: '',
    style: 'Monogram',
    conceptCount: 1,
    primaryColor: '#F27430',
    accentColor: '#800020',
    highlightColor: '#FFE566',
  })[0]?.svgCode;

  const handleGenerateIdentity = async () => {
    if (!brandName.trim()) return;
    setIsGenerating(true);
    try {
      const data = await apiService.generateBrandIdentity({
        brandName,
        industry,
        description,
        mission,
        preferredColors: '#800020, #F27430, #FFE566, #FFFFFF',
      });
      setGeneratedIdentity(data);

      // Update active brand kit
      const updated: BrandKit = {
        ...activeBrandKit,
        name: brandName,
        tagline: data.tagline || tagline,
        industry,
        description,
        mission,
        palette: data.palette || activeBrandKit.palette,
        typography: data.typography || activeBrandKit.typography,
        primaryLogoSvg,
        secondaryLogoSvg,
      };
      onUpdateBrandKit(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportBrandSpecs = () => {
    const specs = {
      brandName,
      tagline,
      industry,
      mission,
      colors: activeBrandKit.palette,
      typography: activeBrandKit.typography,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(specs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-kit.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold mb-2">
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>Brand Kit & Visual Identity Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Brand Studio & Identity Kits
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Establish unified brand authority with harmonized color palettes, primary/secondary logos, social mockups, and business cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportBrandSpecs}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#FFE566] text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Export Brand Kit JSON</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Intake on Left, Mockups & Identity Kit on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Brand Specs Intake Form (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
          <h2 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#F27430]" />
            Brand Core Information
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Mission Statement</label>
            <textarea
              rows={2}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateIdentity}
            disabled={isGenerating || !brandName.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-xs shadow-lg shadow-[#800020]/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFE566]" />
                <span>Crafting Visual Identity...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
                <span>Generate Brand Identity Kit</span>
              </>
            )}
          </button>
        </div>

        {/* Brand Kit Visual Suite (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Color Palette Matrix */}
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Signature Color System
              </span>
              <span className="text-[10px] font-mono text-[#FFE566] bg-[#800020]/30 px-2 py-0.5 rounded border border-[#800020]/60">
                Active Brand Swatches
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {activeBrandKit.palette.map((swatch, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div
                    className="w-full h-12 rounded-xl border border-black/30 shadow-sm"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white truncate">{swatch.name}</div>
                    <div className="text-[10px] font-mono text-[#FFE566]">{swatch.hex}</div>
                    <div className="text-[9px] text-zinc-400 mt-0.5 truncate">{swatch.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary & Secondary Logos Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Primary Logomark</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-[#FFE566]">
                  SVG Vector (Infinite Scale)
                </span>
              </div>
              <div
                className="w-full aspect-video rounded-2xl bg-zinc-900/80 border border-zinc-800/80 p-4 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: primaryLogoSvg }}
              />
              <button
                type="button"
                onClick={() =>
                  downloadSvgFile(
                    primaryLogoSvg,
                    `${brandName.toLowerCase().replace(/\s+/g, '-')}-primary-logo.svg`,
                    { preset: 'print-300dpi' }
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-[#800020] text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#FFE566]" />
                <span>Export Scalable Vector (.svg)</span>
              </button>
            </div>

            <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Secondary Monogram</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-[#F27430]">
                  App Icon / Favicon SVG
                </span>
              </div>
              <div
                className="w-full aspect-video rounded-2xl bg-zinc-900/80 border border-zinc-800/80 p-4 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: secondaryLogoSvg }}
              />
              <button
                type="button"
                onClick={() =>
                  downloadSvgFile(
                    secondaryLogoSvg,
                    `${brandName.toLowerCase().replace(/\s+/g, '-')}-monogram-icon.svg`,
                    { preset: 'app-icon' }
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-[#800020] text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#F27430]" />
                <span>Export Scalable Vector (.svg)</span>
              </button>
            </div>
          </div>

          {/* Mockup Showcase: Social Banner & Luxury Business Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Social Header Banner Mockup */}
            <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-[#FFE566]" />
                Social Cover Banner Mockup
              </span>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/1] bg-gradient-to-r from-[#800020] via-zinc-950 to-[#F27430]/70 p-4 flex flex-col justify-between border border-zinc-800">
                <div className="text-[10px] font-mono text-[#FFE566] tracking-widest uppercase">
                  {brandName}
                </div>
                <div>
                  <div className="text-sm font-extrabold font-heading text-white">{tagline}</div>
                  <div className="text-[10px] text-zinc-300 mt-0.5">{mission}</div>
                </div>
              </div>
            </div>

            {/* Business Card Mockup */}
            <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#F27430]" />
                Luxury Business Card Mockup
              </span>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/1.8] bg-zinc-900 p-4 flex flex-col justify-between border border-[#800020]/40 shadow-inner">
                <div className="flex justify-between items-start">
                  <div className="font-heading font-bold text-white text-sm tracking-wider">
                    {brandName.toUpperCase()}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#FFE566]" />
                </div>
                <div className="space-y-0.5 text-[10px] font-mono text-zinc-400">
                  <div className="text-white font-bold">Creative Director</div>
                  <div>hello@{brandName.toLowerCase().replace(/\s+/g, '')}.ai</div>
                  <div className="text-[#F27430]">+1 (555) 019-2831</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
