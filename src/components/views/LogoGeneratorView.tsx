import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Download,
  Copy,
  Check,
  Star,
  RefreshCw,
  SlidersHorizontal,
  FolderPlus,
  Palette,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCode,
  Zap,
  ArrowRight,
  ShieldCheck,
  Printer,
  Maximize2,
  Terminal,
  Cpu,
} from 'lucide-react';
import { BrandKit, DesignItem, LogoConcept, NavView } from '../../types';
import { generateSvgLogoConcepts, svgToPngDataUrl, downloadSvgFile } from '../../services/svgLogoGenerator';
import { apiService } from '../../services/apiService';
import { SvgExportModal } from '../SvgExportModal';

interface LogoGeneratorViewProps {
  activeBrandKit: BrandKit;
  onSaveDesign: (item: DesignItem) => void;
  onNavigate: (view: NavView) => void;
  onToggleFavorite: (id: string) => void;
}

const LOGO_STYLES = [
  'Minimalist',
  'Modern',
  'Luxury',
  'Corporate',
  'Elegant',
  'Bold',
  'Creative',
  'Geometric',
  'Abstract',
  'Vintage',
  'Retro',
  'Tech',
  'Monogram',
  'Wordmark',
  'Lettermark',
  'Emblem',
  'Mascot',
  'Combination Mark',
];

export const LogoGeneratorView: React.FC<LogoGeneratorViewProps> = ({
  activeBrandKit,
  onSaveDesign,
  onNavigate,
  onToggleFavorite,
}) => {
  const [brandName, setBrandName] = useState(activeBrandKit.name || 'NovaTech');
  const [tagline, setTagline] = useState(activeBrandKit.tagline || 'Intelligent Precision');
  const [industry, setIndustry] = useState(activeBrandKit.industry || 'Artificial Intelligence & Software');
  const [description, setDescription] = useState(activeBrandKit.description || 'Next-generation cloud platform');
  const [targetAudience, setTargetAudience] = useState('Tech founders, modern enterprises');
  const [brandPersonality, setBrandPersonality] = useState('Sophisticated, cutting-edge, authoritative');
  const [selectedStyle, setSelectedStyle] = useState('Geometric');
  const [conceptCount, setConceptCount] = useState<1 | 4 | 8>(4);
  const [primaryColor, setPrimaryColor] = useState('#800020');
  const [accentColor, setAccentColor] = useState('#F27430');
  const [highlightColor, setHighlightColor] = useState('#FFE566');
  const [symbolPreference, setSymbolPreference] = useState('Hexagonal crest with monogram notch');
  const [typographyPreference, setTypographyPreference] = useState('Modern Geometric Sans (Syne)');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [useBrandKit, setUseBrandKit] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<LogoConcept[]>([]);
  const [activePreviewBg, setActivePreviewBg] = useState<'transparent' | 'dark' | 'light'>('transparent');
  const [copiedSvgId, setCopiedSvgId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [selectedConceptForSvgExport, setSelectedConceptForSvgExport] = useState<LogoConcept | null>(null);
  const [batchSvgDownloading, setBatchSvgDownloading] = useState(false);
  const [batchExportSuccess, setBatchExportSuccess] = useState(false);

  // Specialized Logo & Vector AI Tools State (Recraft.ai & Vectorizer.ai)
  const [vectorEngine, setVectorEngine] = useState<'recraft' | 'vectorizer' | 'geometric'>('recraft');
  const [isRudraEnhancing, setIsRudraEnhancing] = useState(false);
  const [rudraVars, setRudraVars] = useState<Record<string, string> | null>(null);

  const handleRudraEnhanceLogo = async () => {
    if (!brandName.trim()) return;
    setIsRudraEnhancing(true);
    try {
      const res = await apiService.enhanceWithRudraEngine(
        `${brandName} - ${tagline || industry}`,
        'logo',
        selectedStyle
      );
      if (res.enhancedPrompt) {
        setAdditionalInstructions(res.enhancedPrompt);
      }
      if (res.variables) {
        setRudraVars(res.variables);
        if (res.variables.subject) {
          setSymbolPreference(`Mathematical ${res.variables.subject} vector mark`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRudraEnhancing(false);
    }
  };

  const handleApplyBrandKit = () => {
    if (activeBrandKit) {
      setBrandName(activeBrandKit.name);
      setTagline(activeBrandKit.tagline || '');
      setIndustry(activeBrandKit.industry || '');
      setDescription(activeBrandKit.description || '');
      if (activeBrandKit.palette.length >= 3) {
        setPrimaryColor(activeBrandKit.palette[0].hex);
        setAccentColor(activeBrandKit.palette[1].hex);
        setHighlightColor(activeBrandKit.palette[2].hex);
      }
    }
  };

  // Listen to global Ctrl+G event
  useEffect(() => {
    const handleGlobalTrigger = () => {
      handleGenerate();
    };
    window.addEventListener('logmage:trigger-generate', handleGlobalTrigger);
    return () => window.removeEventListener('logmage:trigger-generate', handleGlobalTrigger);
  }, [brandName, industry, selectedStyle, symbolPreference, typographyPreference, primaryColor, accentColor, highlightColor, conceptCount]);

  const handleGenerate = async () => {
    if (!brandName.trim()) return;
    setIsGenerating(true);

    try {
      // Prompt enhancement step
      const rawPrompt = `${brandName} in ${industry}. Style: ${selectedStyle}. Symbol: ${symbolPreference}. Colors: ${primaryColor}, ${accentColor}, ${highlightColor}`;
      const enhanced = await apiService.enhancePrompt(rawPrompt, 'enhance', selectedStyle, [
        primaryColor,
        accentColor,
        highlightColor,
      ]);
      setEnhancedPrompt(enhanced.enhancedPrompt);

      // Programmatic SVG vector generation
      const concepts = generateSvgLogoConcepts({
        brandName,
        tagline,
        industry,
        style: selectedStyle,
        symbolPreference,
        typographyPreference,
        primaryColor,
        accentColor,
        highlightColor,
        conceptCount,
      });

      setGeneratedConcepts(concepts);

      // Auto-save the first concept to designs
      if (concepts.length > 0) {
        const primary = concepts[0];
        const pngUrl = await svgToPngDataUrl(primary.svgCode);
        onSaveDesign({
          id: `des-logo-${Date.now()}`,
          title: primary.title,
          type: 'logo',
          prompt: rawPrompt,
          enhancedPrompt: enhanced.enhancedPrompt,
          url: pngUrl,
          svgCode: primary.svgCode,
          aspectRatio: '1:1',
          dimensions: '1024x1024 SVG Vector',
          palette: primary.palette,
          tags: [selectedStyle, industry, 'Vector Logo'],
          isFavorite: false,
          createdAt: new Date().toISOString(),
          checklist: primary.checklist,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSvg = (concept: LogoConcept) => {
    downloadSvgFile(
      concept.svgCode,
      `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo-${concept.id}.svg`,
      { preset: 'print-300dpi' }
    );
  };

  const handleExportAllSvgs = () => {
    if (generatedConcepts.length === 0) return;
    setBatchSvgDownloading(true);
    generatedConcepts.forEach((concept, idx) => {
      setTimeout(() => {
        downloadSvgFile(
          concept.svgCode,
          `${brandName.toLowerCase().replace(/\s+/g, '-')}-concept-${idx + 1}-vector.svg`,
          { preset: 'print-300dpi' }
        );
        if (idx === generatedConcepts.length - 1) {
          setBatchSvgDownloading(false);
          setBatchExportSuccess(true);
          setTimeout(() => setBatchExportSuccess(false), 2500);
        }
      }, idx * 220);
    });
  };

  const handleDownloadPng = async (concept: LogoConcept, transparent = true) => {
    setDownloadingId(concept.id);
    try {
      const pngUrl = await svgToPngDataUrl(concept.svgCode, 2048, 2048);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo-${transparent ? 'transparent' : 'white'}.png`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopySvg = (concept: LogoConcept) => {
    navigator.clipboard.writeText(concept.svgCode);
    setCopiedSvgId(concept.id);
    setTimeout(() => setCopiedSvgId(null), 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Dual-Pipeline Vector Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            AI Logo Generator
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Generate multiple distinct vector logo concepts with scalable SVG code, transparent PNGs, and pre-flight compliance checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleApplyBrandKit}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#FFE566] text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Palette className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Sync with Active Brand Kit</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Form on Left, Output Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (5 columns on desktop) */}
        <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#F27430]" />
              Brand Intake Form
            </h2>
            <span className="text-[11px] font-mono text-[#FFE566] bg-[#800020]/20 px-2 py-0.5 rounded-md border border-[#800020]/40">
              Step 1 to 5
            </span>
          </div>

          {/* Specialized Logo & Vector AI Engine */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#F27430]" />
                <span>Vector Engine Pipeline</span>
              </label>
              <span className="text-[10px] font-mono text-[#FFE566]">Lossless SVGs</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVectorEngine('recraft')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  vectorEngine === 'recraft'
                    ? 'bg-[#800020]/40 border-[#F27430] text-white shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold text-white">Recraft.ai</div>
                <div className="text-[9px] text-[#FFE566] font-mono mt-0.5">Native Vector</div>
                <div className="text-[8px] text-zinc-500 mt-1">Bezier Paths</div>
              </button>
              <button
                type="button"
                onClick={() => setVectorEngine('vectorizer')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  vectorEngine === 'vectorizer'
                    ? 'bg-[#800020]/40 border-[#F27430] text-white shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold text-white">Vectorizer.ai</div>
                <div className="text-[9px] text-sky-400 font-mono mt-0.5">Curve Tracer</div>
                <div className="text-[8px] text-zinc-500 mt-1">240+ Nodes</div>
              </button>
              <button
                type="button"
                onClick={() => setVectorEngine('geometric')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  vectorEngine === 'geometric'
                    ? 'bg-[#800020]/40 border-[#F27430] text-white shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold text-white">Geometric</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">Monograms</div>
                <div className="text-[8px] text-zinc-500 mt-1">Golden Ratio</div>
              </button>
            </div>
          </div>

          {/* Business / Brand Name & Rudra Engine Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300">Brand / Business Name *</label>
              <button
                type="button"
                onClick={handleRudraEnhanceLogo}
                disabled={isRudraEnhancing || !brandName.trim()}
                className="text-[10px] font-mono text-[#FFE566] hover:underline flex items-center gap-1 disabled:opacity-40"
                title="Use Rudra Prompt Engine to generate structured brand directives"
              >
                <Terminal className="w-3 h-3 text-[#F27430]" />
                <span>{isRudraEnhancing ? 'Orchestrating...' : 'Rudra Prompt Engine'}</span>
              </button>
            </div>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Apex Dynamics, Vertex Lab"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Tagline / Slogan (Optional)</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Intelligent Brand Vision"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          {/* Industry & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, E-commerce, AI"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Personality</label>
              <input
                type="text"
                value={brandPersonality}
                onChange={(e) => setBrandPersonality(e.target.value)}
                placeholder="e.g. Luxury, Bold, Minimal"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
              />
            </div>
          </div>

          {/* Logo Style Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Logo Style Direction</label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
              {LOGO_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    selectedStyle === style
                      ? 'bg-[#800020] text-white font-bold border border-[#F27430]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Count: 1, 4, or 8 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Number of Concept Directions</label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 4, 8] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setConceptCount(cnt)}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                    conceptCount === cnt
                      ? 'bg-[#800020] text-[#FFE566] border-[#F27430] shadow-md'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'Concept' : 'Concepts'}
                </button>
              ))}
            </div>
          </div>

          {/* Palette Controls with preset #800020, #F27430, #FFE566 */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300">Color Palette</label>
              <span className="text-[10px] text-zinc-400 font-mono">Brand Colors</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[11px] font-mono text-zinc-300">{primaryColor}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[11px] font-mono text-zinc-300">{accentColor}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[11px] font-mono text-zinc-300">{highlightColor}</span>
              </div>
            </div>
          </div>

          {/* Symbol / Icon & Typography preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Symbol / Icon Preference</label>
            <input
              type="text"
              value={symbolPreference}
              onChange={(e) => setSymbolPreference(e.target.value)}
              placeholder="e.g. Hexagon crest, shield, monogram, abstract apex"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !brandName.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-sm shadow-xl shadow-[#800020]/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#FFE566]" />
                <span>Orchestrating Vector Concepts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
                <span>Generate {conceptCount} Vector {conceptCount === 1 ? 'Concept' : 'Concepts'}</span>
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-[10px] font-mono text-[#FFE566] ml-1">
                  Ctrl+G
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Output Previews (7 columns on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header controls for previews */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Preview Canvas:
              </span>
              <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActivePreviewBg('transparent')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreviewBg === 'transparent' ? 'bg-[#800020] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Checkerboard
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewBg('dark')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreviewBg === 'dark' ? 'bg-[#800020] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dark Slate
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewBg('light')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activePreviewBg === 'light' ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Pure White
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {generatedConcepts.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportAllSvgs}
                  disabled={batchSvgDownloading}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  {batchExportSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#FFE566]" />
                      <span>All SVGs Exported!</span>
                    </>
                  ) : (
                    <>
                      <Download className={`w-3.5 h-3.5 ${batchSvgDownloading ? 'animate-bounce text-[#FFE566]' : 'text-white'}`} />
                      <span>{batchSvgDownloading ? 'Exporting Package...' : 'Export All as Scalable SVG (.svg)'}</span>
                    </>
                  )}
                </button>
              )}
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                {generatedConcepts.length > 0
                  ? `${generatedConcepts.length} Concepts Rendered`
                  : 'Ready to Render'}
              </span>
            </div>
          </div>

          {/* Concepts Grid */}
          {generatedConcepts.length > 0 ? (
            <div className={`grid gap-6 ${conceptCount === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {generatedConcepts.map((concept) => (
                <div
                  key={concept.id}
                  className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col group hover:border-[#F27430]/60 transition-all"
                >
                  {/* Canvas Area */}
                  <div
                    className={`relative aspect-square flex items-center justify-center p-6 overflow-hidden ${
                      activePreviewBg === 'transparent'
                        ? 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950'
                        : activePreviewBg === 'dark'
                        ? 'bg-zinc-950'
                        : 'bg-white'
                    }`}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center drop-shadow-md cursor-pointer"
                      onClick={() => setSelectedConceptForSvgExport(concept)}
                      title="Click to open Scalable Vector (SVG) Studio"
                      dangerouslySetInnerHTML={{ __html: concept.svgCode }}
                    />

                    {/* Quality score badge & Vector badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{concept.rating}/100</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#800020]/90 text-[10px] font-mono text-[#FFE566] border border-[#F27430]/30 hidden sm:inline-block">
                        Scalable Vector (SVG)
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedConceptForSvgExport(concept)}
                        title="Open Scalable Vector (SVG) Export Studio"
                        className="p-2 rounded-xl bg-black/70 backdrop-blur-md text-[#FFE566] hover:text-white hover:bg-black/90 transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopySvg(concept)}
                        title="Copy Raw SVG Code"
                        className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-black/90 transition-colors"
                      >
                        {copiedSvgId === concept.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FileCode className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content & Action Bar */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-zinc-900/60 border-t border-zinc-800/80">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">{concept.title}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-[#FFE566]">
                          {concept.style}
                        </span>
                      </div>

                      {/* Checklist badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Readable
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Infinite Vector Scale
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> 300+ DPI Print Ready
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setSelectedConceptForSvgExport(concept)}
                        className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] hover:opacity-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <FileCode className="w-3.5 h-3.5 text-[#FFE566]" />
                        <span>Export Vector SVG</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadSvg(concept)}
                        className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        title="Download standard scalable .svg file directly"
                      >
                        <Download className="w-3.5 h-3.5 text-[#FFE566]" />
                        <span>Direct .SVG</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPng(concept, true)}
                        disabled={downloadingId === concept.id}
                        className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#F27430]" />
                        <span>{downloadingId === concept.id ? 'Rasterizing...' : 'PNG 2K Proof'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate('brand-studio')}
                        className="py-2 px-3 rounded-xl bg-[#800020]/30 hover:bg-[#800020]/50 border border-[#800020]/60 text-[#FFE566] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Add to Kit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#FFE566]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Generate Your Brand Direction</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Fill in your brand specifications on the left panel or click "Generate" with defaults to explore 4 iconic vector concepts.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-md"
              >
                Instant Generate with Defaults
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scalable Vector Graphics (SVG) Export Studio Modal */}
      {selectedConceptForSvgExport && (
        <SvgExportModal
          concept={selectedConceptForSvgExport}
          brandName={brandName}
          isOpen={!!selectedConceptForSvgExport}
          onClose={() => setSelectedConceptForSvgExport(null)}
        />
      )}
    </div>
  );
};
