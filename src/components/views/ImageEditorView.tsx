import React, { useState, useRef } from 'react';
import {
  SlidersHorizontal,
  Upload,
  Sparkles,
  Scissors,
  Wand2,
  Undo2,
  Redo2,
  Download,
  RefreshCw,
  Layers,
  Eye,
  Columns,
  Image as ImageIcon,
  Save,
  Check,
  Zap,
  Info,
  Palette,
  Maximize2,
  Sliders,
  RotateCcw,
  FileCode,
  ShieldCheck,
  Cpu,
  Copy,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { NavView } from '../../types';
import { apiService } from '../../services/apiService';
import { storageService } from '../../services/storageService';

interface ImageEditorViewProps {
  onNavigate: (view: NavView) => void;
}

const RESIZE_PRESETS = [
  { id: 'ig-post', label: 'Instagram Post', dims: '1080 x 1080', ratio: '1:1' },
  { id: 'ig-story', label: 'Instagram Story', dims: '1080 x 1920', ratio: '9:16' },
  { id: 'yt-thumb', label: 'YouTube Thumbnail', dims: '1280 x 720', ratio: '16:9' },
  { id: 'li-banner', label: 'LinkedIn Banner', dims: '1584 x 396', ratio: '4:1' },
  { id: 'x-post', label: 'X / Twitter Post', dims: '1200 x 675', ratio: '16:9' },
  { id: 'flyer', label: 'Print Flyer (A4)', dims: '2480 x 3508', ratio: '1:1.41' },
  { id: 'ecom', label: 'E-commerce Product', dims: '1200 x 1200', ratio: '1:1' },
  { id: 'web-hero', label: 'Website Hero', dims: '1920 x 800', ratio: '2.4:1' },
];

const PRESET_SAMPLES = [
  {
    id: 'sample-1',
    name: 'Hexagonal Brand Crest',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sample-2',
    name: 'Cybernetic Gateway',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sample-3',
    name: 'Luxury Product Staging',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sample-4',
    name: 'Automotive Emblem',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
];

const QUICK_EDIT_CHIPS = [
  'Change lighting to dramatic burgundy studio rim light with soft volumetric mist (#800020)',
  'Add floating holographic neon circuit rings around the central logo (#FFE566)',
  'Turn into a sleek minimalist flat vector emblem on pure transparent background',
  'Apply luxury gold-leaf foil embossing and metallic reflections',
  'Place product on polished black obsidian pedestal with mirror reflections',
  'Infuse vibrant tangerine energy accents and futuristic highlights (#F27430)',
];

const QUICK_CREATE_CHIPS = [
  'Luxury modern automotive crest logo on matte obsidian carbon fiber surface, dramatic studio lighting',
  'Minimalist geometric tech brand icon, deep burgundy and warm gold tones, crisp vector precision',
  'Futuristic holographic cyber gateway portal with neon tangerine telemetry, 8k resolution',
  'High-end perfume cosmetic bottle on sculpted marble pedestal with warm sunset rim reflections',
];

export const ImageEditorView: React.FC<ImageEditorViewProps> = ({ onNavigate }) => {
  const [currentImage, setCurrentImage] = useState(PRESET_SAMPLES[0].url);
  const [originalImage, setOriginalImage] = useState(PRESET_SAMPLES[0].url);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ai-prompt' | 'ai-lab' | 'background' | 'enhance' | 'resize'>('ai-prompt');
  const [aiMode, setAiMode] = useState<'edit' | 'create'>('edit');
  const [promptInput, setPromptInput] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [activeBgOption, setActiveBgOption] = useState<'transparent' | 'studio' | 'neon' | 'white'>('studio');
  const [selectedPreset, setSelectedPreset] = useState('ig-post');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeModelAttribution, setActiveModelAttribution] = useState('gemini-3.1-flash-image-preview');

  // AI Lab & Quick Tools State (Photoroom, Claid.ai, Magnific AI, Vectorizer.ai)
  const [tracedSvg, setTracedSvg] = useState<string | null>(null);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [vectorizerMeta, setVectorizerMeta] = useState<{
    engine: string;
    nodeCount: number;
    bezierSegments: number;
    toleranceMm: number;
    colorLayers: number;
  } | null>(null);
  const [magnificIntensity, setMagnificIntensity] = useState(1.2);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Push to undo stack
  const updateCurrentImage = (newImg: string, keepRedo = false) => {
    setUndoStack((prev) => [...prev, currentImage]);
    if (!keepRedo) setRedoStack([]);
    setCurrentImage(newImg);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((old) => old.slice(0, old.length - 1));
    setRedoStack((old) => [...old, currentImage]);
    setCurrentImage(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((old) => old.slice(0, old.length - 1));
    setUndoStack((old) => [...old, currentImage]);
    setCurrentImage(next);
  };

  // AI Create & Edit Handler using gemini-3.1-flash-image-preview
  const handleRunAiPrompt = async () => {
    if (!promptInput.trim()) return;

    setIsProcessing(true);
    setProcessingStatus(
      aiMode === 'edit'
        ? 'Editing image with gemini-3.1-flash-image-preview...'
        : 'Generating high-fidelity image with gemini-3.1-flash-image-preview...'
    );

    try {
      const res = await apiService.createOrEditImageWithAI({
        action: aiMode,
        prompt: promptInput,
        imageBase64: aiMode === 'edit' ? currentImage : undefined,
        aspectRatio: selectedAspectRatio,
        style: 'Commercial Luxury',
        brandColors: ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
      });

      if (res.imageUrl) {
        updateCurrentImage(res.imageUrl);
        setActiveModelAttribution(res.model || 'gemini-3.1-flash-image-preview');
        storageService.addNotification({
          title: aiMode === 'edit' ? 'AI Image Edit Completed' : 'AI Image Created',
          message: `Processed via ${res.model || 'gemini-3.1-flash-image-preview'}: "${promptInput.slice(0, 48)}..."`,
          type: 'success',
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // AI Lab Specialized APIs (Photoroom, Claid.ai, Magnific AI, Vectorizer.ai)
  const handleRunAILabTool = async (
    tool: 'photoroom-bg-remove' | 'photoroom-auto-shadow' | 'claid-upscale-4k' | 'magnific-micro-detail'
  ) => {
    setIsProcessing(true);
    const toolTitles: Record<string, string> = {
      'photoroom-bg-remove': 'Photoroom API: Removing background & isolating product subject...',
      'photoroom-auto-shadow': 'Photoroom API: Synthesizing studio ambient drop shadows...',
      'claid-upscale-4k': 'Claid.ai API: Super-resolution 4K & 300 DPI print calibration...',
      'magnific-micro-detail': 'Magnific AI: Injecting hyper-intricate micro-textures & details...',
    };
    setProcessingStatus(toolTitles[tool] || 'Executing AI Lab tool...');

    try {
      const res = await apiService.executeAILabTool({
        tool,
        imageBase64: currentImage,
        intensity: magnificIntensity,
      });

      if (res.imageUrl) {
        updateCurrentImage(res.imageUrl);
        setActiveModelAttribution(res.tool || tool);
        storageService.addNotification({
          title: res.tool || 'AI Lab Transformation',
          message: res.actionSummary || 'Applied asset enhancement successfully.',
          type: 'success',
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleRunVectorizer = async () => {
    setIsProcessing(true);
    setProcessingStatus('Vectorizer.ai: Converting raster pixels into mathematically clean SVG bezier curves...');

    try {
      const res = await apiService.vectorizeImage(currentImage, 'precision', 6);
      if (res.svgCode) {
        setTracedSvg(res.svgCode);
        setVectorizerMeta(res.metadata);
        setActiveModelAttribution('Vectorizer.ai (240+ Bezier Nodes)');
        storageService.addNotification({
          title: 'Vectorizer.ai Deep Curve Tracing Complete',
          message: `Generated lossless SVG with ${res.metadata?.nodeCount || 244} Bezier nodes and 0.001mm tolerance.`,
          type: 'success',
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleDownloadTracedSvg = () => {
    if (!tracedSvg) return;
    const blob = new Blob([tracedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vectorizer-traced-logo.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyBackground = async (bgType: 'transparent' | 'studio' | 'neon' | 'white') => {
    setActiveBgOption(bgType);
    setIsProcessing(true);
    setProcessingStatus(`Applying AI segmentation: ${bgType}...`);

    try {
      const prompt =
        bgType === 'transparent'
          ? 'Isolate main visual on clean transparent background with crisp anti-aliased alpha edges.'
          : bgType === 'studio'
          ? 'Replace background with a deep matte obsidian studio (#09090b) with subtle burgundy rim illumination.'
          : bgType === 'neon'
          ? 'Replace background with a luxury dark gradient from #800020 burgundy to #F27430 vibrant tangerine with neon glow.'
          : 'Replace background with a clean commercial pure white studio backdrop for e-commerce catalog.';

      const res = await apiService.createOrEditImageWithAI({
        action: 'edit',
        prompt,
        imageBase64: currentImage,
      });

      if (res.imageUrl) {
        updateCurrentImage(res.imageUrl);
      }
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleApplyEnhance = async (type: 'contrast' | 'sharpen' | 'luxury') => {
    setIsProcessing(true);
    setProcessingStatus(`Applying neural filter: ${type}...`);

    try {
      const prompt =
        type === 'contrast'
          ? 'Balance dynamic range, optimize lighting contrast, and enrich shadow depth with #800020 tones.'
          : type === 'sharpen'
          ? 'Sharpen fine vector contours, eliminate raster blurring, enhance bevel specular highlights.'
          : 'Apply luxury boutique visual grade with warm amber highlights (#FFE566) and cinematic color correction.';

      const res = await apiService.createOrEditImageWithAI({
        action: 'edit',
        prompt,
        imageBase64: currentImage,
      });

      if (res.imageUrl) {
        updateCurrentImage(res.imageUrl);
      }
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setOriginalImage(reader.result);
        updateCurrentImage(reader.result);
        storageService.addNotification({
          title: 'Custom Image Loaded',
          message: `Loaded "${file.name}" for AI editing & enhancement.`,
          type: 'info',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveToDesigns = () => {
    storageService.saveDesign({
      id: `design-${Date.now()}`,
      title: promptInput ? `AI Edit: ${promptInput.slice(0, 24)}` : `Studio Asset ${selectedPreset}`,
      type: 'image',
      url: currentImage,
      prompt: promptInput || 'AI Image Studio processed visual with gemini-3.1-flash-image-preview',
      palette: ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
      tags: ['AI Edit', 'gemini-3.1-flash-image-preview', selectedPreset],
      aspectRatio: selectedAspectRatio,
      dimensions: RESIZE_PRESETS.find((p) => p.id === selectedPreset)?.dims || '1080 x 1080',
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `gemini-3.1-flash-image-${selectedPreset}-${Date.now()}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F27430] animate-pulse" />
            <span>AI Image Creator & Editor • Powered by gemini-3.1-flash-image-preview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            AI Image Studio & Generative Editor
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Create brand visuals from text prompts or edit existing images with natural language instructions using gemini-3.1-flash-image-preview.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              comparisonMode
                ? 'bg-[#800020] text-[#FFE566] border-[#F27430]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{comparisonMode ? 'Split View: ON' : 'Compare Original'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToDesigns}
            disabled={savedSuccess}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#FFE566] text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#FFE566]" />
                <span>Save Design</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Export Asset</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Canvas on Left, Operations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Viewport Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-300">
                Canvas ({RESIZE_PRESETS.find((p) => p.id === selectedPreset)?.dims})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#800020]/20 text-[#FFE566] border border-[#800020]/40">
                {activeModelAttribution}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                title="Undo last edit"
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                title="Redo"
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  updateCurrentImage(originalImage);
                }}
                title="Reset to Original"
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div
            className={`relative rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-zinc-800 shadow-inner select-none ${
              activeBgOption === 'transparent'
                ? 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950'
                : activeBgOption === 'studio'
                ? 'bg-zinc-950'
                : activeBgOption === 'neon'
                ? 'bg-gradient-to-br from-[#800020] via-zinc-950 to-[#F27430]'
                : 'bg-white'
            }`}
          >
            {comparisonMode ? (
              <div className="relative w-full h-full flex overflow-hidden">
                <div className="w-1/2 h-full overflow-hidden border-r-2 border-[#FFE566] relative">
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-zinc-300 font-mono">
                    BEFORE (ORIGINAL)
                  </span>
                </div>
                <div className="w-1/2 h-full relative">
                  <img src={currentImage} alt="Edited" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#800020]/90 text-[10px] text-[#FFE566] font-mono">
                    AFTER (AI EDITED)
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={currentImage}
                alt="Studio Visual"
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                  activeBgOption === 'transparent' ? 'drop-shadow-2xl' : ''
                }`}
              />
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
                <RefreshCw className="w-8 h-8 text-[#FFE566] animate-spin" />
                <div className="text-center px-4">
                  <div className="text-xs font-mono font-bold text-white tracking-wide">
                    {processingStatus || 'Synthesizing with gemini-3.1-flash-image-preview...'}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Applying neural transformation & brand color consistency
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Presets Strip */}
          <div className="pt-2 border-t border-zinc-800/80">
            <div className="text-[11px] text-zinc-400 mb-2 flex items-center justify-between">
              <span>Starter Image Library</span>
              <span className="text-[10px] text-zinc-500">Click to load into editor</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setOriginalImage(sample.url);
                    updateCurrentImage(sample.url);
                  }}
                  className={`relative rounded-xl overflow-hidden border p-0.5 group transition-all ${
                    originalImage === sample.url
                      ? 'border-[#F27430] ring-1 ring-[#F27430]/40'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-12 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] font-semibold text-white truncate">{sample.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editing Tools Panel (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
          {/* Main Category Tabs */}
          <div className="grid grid-cols-5 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('ai-prompt')}
              className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'ai-prompt' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#FFE566]" />
              <span>AI Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai-lab')}
              className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'ai-lab' ? 'bg-[#800020] text-white shadow-sm ring-1 ring-[#F27430]/40' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3 text-[#F27430]" />
              <span>AI Lab</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('background')}
              className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'background' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Scissors className="w-3 h-3" />
              <span>BG</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('enhance')}
              className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'enhance' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3 h-3" />
              <span>Polish</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resize')}
              className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'resize' ? 'bg-[#800020] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span>Resize</span>
            </button>
          </div>

          {/* TAB 1: AI TEXT EDIT & CREATE WITH GEMINI-3.1-FLASH-IMAGE-PREVIEW */}
          {activeTab === 'ai-prompt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#800020]/20 text-[#FFE566]">
                    <Sparkles className="w-4 h-4 text-[#F27430]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">gemini-3.1-flash-image-preview</div>
                    <div className="text-[10px] text-zinc-400">Prompt-driven creation & editing</div>
                  </div>
                </div>

                {/* Sub-mode Toggle (Edit vs Create) */}
                <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setAiMode('edit')}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                      aiMode === 'edit'
                        ? 'bg-[#800020] text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Edit Canvas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiMode('create')}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                      aiMode === 'create'
                        ? 'bg-[#800020] text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Create New
                  </button>
                </div>
              </div>

              {/* Prompt Input Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>
                    {aiMode === 'edit'
                      ? 'Prompt: Describe edits to apply to current image'
                      : 'Prompt: Describe new image to generate'}
                  </span>
                  <span className="text-[10px] font-mono text-[#FFE566]">gemini-3.1-flash-image</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={
                      aiMode === 'edit'
                        ? 'e.g., Change lighting to dramatic burgundy studio rim light with soft volumetric mist, add gold highlights on edges...'
                        : 'e.g., Luxury modern automotive crest logo on matte obsidian carbon fiber surface, dramatic studio lighting...'
                    }
                    className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] focus:ring-1 focus:ring-[#F27430]/30 transition-all font-sans leading-relaxed resize-none"
                  />
                  {promptInput && (
                    <button
                      type="button"
                      onClick={() => setPromptInput('')}
                      className="absolute right-2.5 top-2.5 text-[10px] text-zinc-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Aspect Ratio Options (if creating new) */}
              {aiMode === 'create' && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400">Aspect Ratio</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setSelectedAspectRatio(ratio)}
                        className={`py-1.5 rounded-lg border text-center text-xs font-mono transition-all ${
                          selectedAspectRatio === ratio
                            ? 'bg-[#800020]/30 border-[#F27430] text-[#FFE566] font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleRunAiPrompt}
                disabled={isProcessing || !promptInput.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white text-xs font-bold shadow-lg shadow-[#800020]/25 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FFE566]" />
                    <span>Processing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFE566]" />
                    <span>
                      {aiMode === 'edit'
                        ? 'Apply AI Edit (gemini-3.1-flash-image-preview)'
                        : 'Generate Image (gemini-3.1-flash-image-preview)'}
                    </span>
                  </>
                )}
              </button>

              {/* Quick Inspiration Chips */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] font-semibold text-zinc-400">
                  {aiMode === 'edit' ? 'Quick Edit Directives' : 'Creative Prompt Ideas'}
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(aiMode === 'edit' ? QUICK_EDIT_CHIPS : QUICK_CREATE_CHIPS).map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPromptInput(chip)}
                      className="w-full text-left p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-[#F27430]/60 hover:bg-zinc-800/60 text-[11px] text-zinc-300 leading-snug transition-all flex items-start gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-[#FFE566] flex-shrink-0 mt-0.5" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI LAB & QUICK TOOLS (Photoroom, Claid.ai, Magnific AI, Vectorizer.ai) */}
          {activeTab === 'ai-lab' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#800020]/20 text-[#FFE566]">
                    <Cpu className="w-4 h-4 text-[#F27430]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">AI Lab & Quick Tools Suite</div>
                    <div className="text-[10px] text-zinc-400">Specialized Asset Manipulation APIs</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  APIs Connected
                </span>
              </div>

              {/* 1. Photoroom API Suite */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-[#F27430]" />
                    <span className="text-xs font-bold text-white">Photoroom API</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#FFE566]">Rapid Subject Matting</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Sub-pixel foreground extraction, product isolation & realistic studio shadow generation.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleRunAILabTool('photoroom-bg-remove')}
                    disabled={isProcessing}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Scissors className="w-3 h-3 text-[#FFE566]" />
                    <span>Cutout Background</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunAILabTool('photoroom-auto-shadow')}
                    disabled={isProcessing}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Layers className="w-3 h-3 text-[#F27430]" />
                    <span>Auto-Shadow Drop</span>
                  </button>
                </div>
              </div>

              {/* 2. Claid.ai API Suite */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 text-[#FFE566]" />
                    <span className="text-xs font-bold text-white">Claid.ai API</span>
                  </div>
                  <span className="text-[9px] font-mono text-sky-400">4K & 300 DPI Print</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Super-resolution sharpening, artifact removal, lighting normalization & DPI adjustment.
                </p>
                <button
                  type="button"
                  onClick={() => handleRunAILabTool('claid-upscale-4k')}
                  disabled={isProcessing}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Maximize2 className="w-3 h-3 text-[#FFE566]" />
                  <span>Claid 4K Super-Resolution (300 DPI)</span>
                </button>
              </div>

              {/* 3. Magnific AI Micro-Detail Suite */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F27430]" />
                    <span className="text-xs font-bold text-white">Magnific AI</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400">Hallucinatory Upscaler</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Injects intricate micro-details, surface textures & specular glints into 1024x1024 renders.
                </p>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>Micro-Detail Intensity:</span>
                    <span className="font-mono text-[#FFE566]">{magnificIntensity}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={magnificIntensity}
                    onChange={(e) => setMagnificIntensity(parseFloat(e.target.value))}
                    className="w-full accent-[#F27430]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRunAILabTool('magnific-micro-detail')}
                  disabled={isProcessing}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-[#FFE566]" />
                  <span>Synthesize Magnific Micro-Details</span>
                </button>
              </div>

              {/* 4. Vectorizer.ai Raster-to-SVG Pipeline */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-bold text-white">Vectorizer.ai Tracing</span>
                  </div>
                  <span className="text-[9px] font-mono text-sky-400">Lossless Vector</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Converts bitmap pixels (Midjourney / Stability) into mathematically clean scalable SVG curves.
                </p>
                <button
                  type="button"
                  onClick={handleRunVectorizer}
                  disabled={isProcessing}
                  className="w-full py-2 px-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>Trace to SVG Bezier Paths</span>
                </button>

                {tracedSvg && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-sky-500/30 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                      <span>{vectorizerMeta?.nodeCount || 244} Bezier Nodes</span>
                      <span className="text-emerald-400">Lossless 0.001mm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadTracedSvg}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download SVG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(tracedSvg);
                          setCopiedSvg(true);
                          setTimeout(() => setCopiedSvg(false), 1500);
                        }}
                        className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono flex items-center gap-1 transition-all"
                      >
                        {copiedSvg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSvg ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BACKGROUND SEGMENTATION */}
          {activeTab === 'background' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Background Isolation & Staging
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyBackground('transparent')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    activeBgOption === 'transparent'
                      ? 'bg-[#800020]/20 border-[#F27430] text-white font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Scissors className="w-4 h-4 text-[#FFE566] mb-1.5" />
                  <div>Remove BG</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Transparent Cutout</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyBackground('studio')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    activeBgOption === 'studio'
                      ? 'bg-[#800020]/20 border-[#F27430] text-white font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#F27430] mb-1.5" />
                  <div>Dark Studio</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Matte Obsidian</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyBackground('neon')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    activeBgOption === 'neon'
                      ? 'bg-[#800020]/20 border-[#F27430] text-white font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-400 mb-1.5" />
                  <div>Brand Gradient</div>
                  <div className="text-[10px] text-zinc-500 font-mono">#800020 & #F27430</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyBackground('white')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    activeBgOption === 'white'
                      ? 'bg-[#800020]/20 border-[#F27430] text-white font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4 text-zinc-300 mb-1.5" />
                  <div>Pure White</div>
                  <div className="text-[10px] text-zinc-500 font-mono">E-commerce Marketplace</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ENHANCE & POLISH */}
          {activeTab === 'enhance' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Visual Polish Filters
              </span>
              <button
                type="button"
                onClick={() => handleApplyEnhance('contrast')}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-[#FFE566] text-xs text-white flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-semibold">AI Contrast & Lighting Balance</div>
                  <div className="text-[10px] text-zinc-400">Deep burgundy highlights with warm ambient glow</div>
                </div>
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
              </button>
              <button
                type="button"
                onClick={() => handleApplyEnhance('sharpen')}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-[#F27430] text-xs text-white flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-semibold">Vector Edge Sharpening</div>
                  <div className="text-[10px] text-zinc-400">Crisp silhouettes and zero raster pixelation</div>
                </div>
                <Wand2 className="w-4 h-4 text-[#F27430]" />
              </button>
              <button
                type="button"
                onClick={() => handleApplyEnhance('luxury')}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-emerald-400 text-xs text-white flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-semibold">Luxury Gold-Foil Grade</div>
                  <div className="text-[10px] text-zinc-400">Premium amber accents and high specular depth</div>
                </div>
                <Palette className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}

          {/* TAB 4: SMART RESIZE */}
          {activeTab === 'resize' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Multi-Platform Dimensions
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {RESIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      selectedPreset === preset.id
                        ? 'bg-[#800020]/20 border-[#F27430] text-white font-bold'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div>{preset.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{preset.dims}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#FFE566]">{preset.ratio}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
