import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  X,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Globe,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Palette,
  Eye,
  Info,
  Layers,
  Sliders,
  Grid,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { LogoConcept } from '../types';
import {
  formatSvgForExport,
  downloadSvgFile,
  svgToPngDataUrl,
  transformSvgViewMode,
  SvgInspectionMode,
} from '../services/svgLogoGenerator';

export interface SvgExportModalProps {
  concept?: LogoConcept | null;
  svgCode?: string;
  title?: string;
  brandName?: string;
  isOpen: boolean;
  onClose: () => void;
}

type SvgPreset = 'standard' | 'print-300dpi' | 'web-minified' | 'monochrome' | 'app-icon';

export const SvgExportModal: React.FC<SvgExportModalProps> = ({
  concept,
  svgCode: rawSvgCodeProp,
  title: propTitle,
  brandName = 'Brand',
  isOpen,
  onClose,
}) => {
  // View mode: Wireframe, Fill, Stroke, Combined
  const [viewMode, setViewMode] = useState<SvgInspectionMode>('combined');

  // Wireframe options
  const [wireframeColor, setWireframeColor] = useState<string>('#38BDF8');
  const [wireframeWidth, setWireframeWidth] = useState<number>(1.25);
  const [showCadGrid, setShowCadGrid] = useState<boolean>(true);

  // Stroke options
  const [strokeOnlyWidth, setStrokeOnlyWidth] = useState<number>(2);
  const [strokeOnlyColor, setStrokeOnlyColor] = useState<string>('#FFFFFF');

  // Export preset & canvas
  const [activePreset, setActivePreset] = useState<SvgPreset>('standard');
  const [bgColor, setBgColor] = useState<'transparent' | '#FFFFFF' | '#09090B' | '#800020'>(
    'transparent'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [rasterizing, setRasterizing] = useState<boolean>(false);
  const [exportCurrentViewOnly, setExportCurrentViewOnly] = useState<boolean>(false);

  if (!isOpen) return null;

  // Resolve SVG code and title from concept or direct props
  const baseSvg = concept?.svgCode || rawSvgCodeProp || '';
  const itemTitle = concept?.title || propTitle || 'Vector Asset';

  if (!baseSvg) return null;

  // Transform SVG according to active viewMode (wireframe / fill / stroke / combined)
  const transformedSvg = transformSvgViewMode(baseSvg, {
    mode: viewMode,
    wireframeStrokeColor: wireframeColor,
    wireframeStrokeWidth: wireframeWidth,
    strokeOnlyColor,
    strokeOnlyWidth,
    backgroundColor: viewMode === 'wireframe' ? 'transparent' : bgColor,
  });

  // Target SVG for export: if exportCurrentViewOnly is checked, export what's on screen; otherwise standard export
  const exportTargetSvg = exportCurrentViewOnly
    ? transformedSvg
    : formatSvgForExport(baseSvg, {
        preset: activePreset,
        backgroundColor: bgColor,
        includeXmlDeclaration: true,
        includeMetadata: true,
      });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportTargetSvg);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadSvg = () => {
    const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${itemTitle.toLowerCase().replace(/\s+/g, '-')}-${viewMode}.svg`;
    downloadSvgFile(exportTargetSvg, filename, {
      preset: activePreset,
      backgroundColor: bgColor,
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleDownloadRasterProof = async () => {
    setRasterizing(true);
    try {
      const pngUrl = await svgToPngDataUrl(exportTargetSvg, 2048, 2048);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${itemTitle.toLowerCase().replace(/\s+/g, '-')}-proof-2048px.png`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setRasterizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-2xl space-y-5 max-h-[94vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/25 border border-[#800020]/50 text-[#FFE566] text-xs font-mono font-semibold mb-2">
              <FileCode className="w-3.5 h-3.5 text-[#F27430]" />
              <span>Interactive SVG Vector Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              {itemTitle} — Vector Preview & Export
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Inspect mathematical Bézier geometry across wireframe outlines, pure silhouette fills, and vector strokes prior to production export.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-400 mr-1.5 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#FFE566]" /> View Mode:
            </span>

            {/* Wireframe Button */}
            <button
              type="button"
              onClick={() => setViewMode('wireframe')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'wireframe'
                  ? 'bg-sky-500/20 border border-sky-400 text-sky-300 shadow-sm shadow-sky-500/30'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-sky-400" />
              <span>Wireframe</span>
            </button>

            {/* Fill Button */}
            <button
              type="button"
              onClick={() => setViewMode('fill')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'fill'
                  ? 'bg-[#F27430]/20 border border-[#F27430] text-[#FFE566] shadow-sm shadow-[#F27430]/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#F27430]" />
              <span>Fill Only</span>
            </button>

            {/* Stroke Button */}
            <button
              type="button"
              onClick={() => setViewMode('stroke')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'stroke'
                  ? 'bg-[#800020]/40 border border-[#FFE566]/60 text-white shadow-sm shadow-[#800020]/40'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#FFE566]" />
              <span>Stroke Only</span>
            </button>

            {/* Combined Button */}
            <button
              type="button"
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'combined'
                  ? 'bg-[#800020]/30 border border-[#F27430] text-white shadow-sm shadow-[#800020]/30'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FFE566]" />
              <span>Combined</span>
            </button>
          </div>

          {/* Mode Sub-Toggles */}
          <div className="flex items-center gap-2 text-xs">
            {viewMode === 'wireframe' && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-[11px]">Wire Color:</span>
                {[
                  { color: '#38BDF8', label: 'Cyan' },
                  { color: '#FFE566', label: 'Amber' },
                  { color: '#F27430', label: 'Tangerine' },
                  { color: '#FFFFFF', label: 'White' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setWireframeColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      wireframeColor === c.color ? 'scale-125 border-white ring-2 ring-white/50' : 'border-zinc-700'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            )}

            {viewMode === 'stroke' && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-[11px]">Stroke Width:</span>
                {[1, 2, 4, 6].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setStrokeOnlyWidth(w)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                      strokeOnlyWidth === w
                        ? 'bg-[#800020] border-[#FFE566] text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid: Interactive Canvas & Export Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FFE566]" />
                Vector Viewport ({viewMode.toUpperCase()} VIEW)
              </span>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-[#FFE566] w-12 text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(400, zoomLevel + 25))}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="text-[10px] text-zinc-400 hover:text-white ml-1 px-1 rounded bg-zinc-800"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Interactive Vector Preview Stage */}
            <div
              className={`relative aspect-square w-full rounded-2xl border border-zinc-800 flex items-center justify-center p-6 overflow-hidden select-none transition-colors ${
                viewMode === 'wireframe'
                  ? 'bg-zinc-950 border-sky-500/30'
                  : bgColor === 'transparent'
                  ? 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950'
                  : bgColor === '#FFFFFF'
                  ? 'bg-white'
                  : bgColor === '#800020'
                  ? 'bg-[#800020]'
                  : 'bg-[#09090B]'
              }`}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="w-full h-full flex items-center justify-center pointer-events-none"
                dangerouslySetInnerHTML={{ __html: transformedSvg }}
              />

              {/* Viewport Overlay Tag */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-zinc-700/60 pointer-events-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  MODE: {viewMode.toUpperCase()} • {zoomLevel}% ZOOM
                </span>
              </div>
            </div>

            {/* Background Color Selector */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-400">Preview Backdrop:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setBgColor('transparent')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                    bgColor === 'transparent'
                      ? 'bg-[#800020]/30 border-[#F27430] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Checkerboard
                </button>
                <button
                  type="button"
                  onClick={() => setBgColor('#FFFFFF')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                    bgColor === '#FFFFFF'
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => setBgColor('#09090B')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                    bgColor === '#09090B'
                      ? 'bg-zinc-900 border-[#FFE566] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Slate
                </button>
                <button
                  type="button"
                  onClick={() => setBgColor('#800020')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                    bgColor === '#800020'
                      ? 'bg-[#800020] border-[#FFE566] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Burgundy
                </button>
              </div>
            </div>
          </div>

          {/* Right Presets & Export Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Vector Preset & Target Medium
            </span>

            {/* Presets List */}
            <div className="space-y-2">
              {[
                {
                  id: 'standard',
                  title: 'Universal Scalable Vector',
                  desc: 'Clean W3C standard SVG with viewBox and responsive scaling.',
                  icon: Sparkles,
                },
                {
                  id: 'print-300dpi',
                  title: 'Print & Prepress (300+ DPI)',
                  desc: 'High-res vector bounds for packaging, apparel, and signage.',
                  icon: Printer,
                },
                {
                  id: 'web-minified',
                  title: 'Web & Digital Optimized',
                  desc: 'Lightweight inline SVG markup for React and web graphics.',
                  icon: Globe,
                },
                {
                  id: 'monochrome',
                  title: 'Monochrome Silhouette',
                  desc: 'Pure single-tone paths for foil stamping, laser etching, and CNC.',
                  icon: Palette,
                },
              ].map((preset) => {
                const Icon = preset.icon;
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePreset(preset.id as SvgPreset)}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#800020]/30 border-[#F27430] text-white ring-1 ring-[#F27430]/40'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FFE566]' : 'text-zinc-400'}`} />
                      <span className="text-xs font-bold text-white">{preset.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 pl-6 leading-relaxed">
                      {preset.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Option to export current transformed view */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer hover:bg-zinc-850">
              <input
                type="checkbox"
                checked={exportCurrentViewOnly}
                onChange={(e) => setExportCurrentViewOnly(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-[#800020] focus:ring-[#800020]"
              />
              <span>Export active {viewMode.toUpperCase()} geometry view (.svg)</span>
            </label>

            {/* XML Source Inspector Toggle */}
            <div className="pt-1 space-y-3">
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <FileCode className="w-3.5 h-3.5 text-[#FFE566]" />
                  {showCode ? 'Hide Raw XML Code' : 'Inspect SVG XML Source'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {showCode ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showCode && (
                <div className="relative">
                  <pre className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300 max-h-36 overflow-y-auto leading-relaxed">
                    {exportTargetSvg}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-xs text-zinc-300 hover:text-white transition-colors"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#FFE566]" />
                      <span>Copy SVG XML</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadRasterProof}
                  disabled={rasterizing}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-[#F27430]" />
                  <span>{rasterizing ? 'Exporting...' : '2K PNG Proof'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white text-xs font-bold shadow-xl shadow-[#800020]/30 hover:opacity-95 flex items-center justify-center gap-2 transition-all"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#FFE566]" />
                      <span>Vector SVG Exported Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Scalable SVG (.svg)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
