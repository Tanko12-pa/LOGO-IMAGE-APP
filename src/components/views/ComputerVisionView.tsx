import React, { useState, useRef, useEffect } from 'react';
import {
  ScanEye,
  Upload,
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Eye,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Sliders,
  Palette,
  ExternalLink,
  Video,
  SwitchCamera,
  Crosshair,
  Info,
  FileSpreadsheet,
} from 'lucide-react';
import { NavView, VisionAnalysisResult, DetectedObject } from '../../types';
import { apiService } from '../../services/apiService';
import { storageService } from '../../services/storageService';
import { BatchVisionProcessor } from './BatchVisionProcessor';

interface ComputerVisionViewProps {
  onNavigate: (view: NavView) => void;
  onApplyPrompt?: (prompt: string, targetView: 'logo-generator' | 'image-generator' | 'a2a-judge' | 'video-motion') => void;
  initialMode?: 'single' | 'batch';
}

const PRESET_SAMPLES = [
  {
    id: 'sample-1',
    name: 'Hexagonal Brand Crest',
    category: 'Logos & Symbols',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-2',
    name: 'Modern Cyber Gateway',
    category: 'Hardware & Tech',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-3',
    name: 'Luxury Studio Composition',
    category: 'Product & Interior',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-4',
    name: 'Automotive Kinetic Emblem',
    category: 'Automotive Design',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
];

export const ComputerVisionView: React.FC<ComputerVisionViewProps> = ({
  onNavigate,
  onApplyPrompt,
  initialMode = 'single',
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>(initialMode);
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_SAMPLES[0].url);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [arOverlayActive, setArOverlayActive] = useState(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleAnalyze = async (imgSource: string) => {
    setIsAnalyzing(true);
    try {
      const sample = PRESET_SAMPLES.find((s) => s.url === imgSource);
      const result = await apiService.analyzeImage(imgSource, sample?.id);
      setAnalysisResult(result);
      if (result.detectedObjects && result.detectedObjects.length > 0) {
        setSelectedObjectId(result.detectedObjects[0].id);
      }
      storageService.addNotification({
        title: 'Computer Vision Analysis Complete',
        message: `Identified ${result.detectedObjects.length} objects with AR metadata & brand prompts.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run initial analysis on first load
  useEffect(() => {
    handleAnalyze(selectedImage);
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleToggleLiveCamera = async () => {
    if (isLiveCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsLiveCameraActive(false);
      setCameraError(null);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacingMode },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsLiveCameraActive(true);
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError('Camera access unavailable. You can upload any photo or use our test samples.');
      }
    }
  };

  const handleCaptureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        setSelectedImage(base64);
        setIsLiveCameraActive(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        handleAnalyze(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        setIsLiveCameraActive(false);
        handleAnalyze(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyPrompt = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const activeSelectedObject =
    analysisResult?.detectedObjects.find((o) => o.id === (selectedObjectId || hoveredObjectId)) ||
    analysisResult?.detectedObjects[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/25 border border-[#800020]/50 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <ScanEye className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Real-Time Computer Vision & AR Recognition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Computer Vision & AR Overlay Studio
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Detect real-world objects, identify brands, view interactive Augmented Reality overlays, and synthesize dual-pipeline prompts.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleLiveCamera}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              isLiveCameraActive
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-[#F27430]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>{isLiveCameraActive ? 'Stop Live Camera' : 'Live Camera AR'}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-[#F27430] hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setArOverlayActive(!arOverlayActive)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              arOverlayActive
                ? 'bg-[#800020] text-[#FFE566] border-[#F27430] shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AR HUD {arOverlayActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ScanEye className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Interactive AR HUD Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'batch'
                ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Batch Process & Spreadsheets</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-950 text-[#FFE566] border border-zinc-800">
              CSV
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-500">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Ctrl+B</kbd>
          <span>Batch</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Ctrl+K</kbd>
          <span>Command</span>
        </div>
      </div>

      {activeTab === 'batch' ? (
        <BatchVisionProcessor
          onSelectImageForView={(dataUrl, res) => {
            setSelectedImage(dataUrl);
            if (res) {
              setAnalysisResult(res);
              if (res.detectedObjects?.length > 0) {
                setSelectedObjectId(res.detectedObjects[0].id);
              }
            }
            setActiveTab('single');
          }}
          onNavigate={onNavigate}
        />
      ) : (
        <>
          {/* Preset Samples Selector */}
          <div className="space-y-2">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          Quick Test Sample Images:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setSelectedImage(sample.url);
                setIsLiveCameraActive(false);
                handleAnalyze(sample.url);
              }}
              className={`p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                selectedImage === sample.url && !isLiveCameraActive
                  ? 'bg-[#800020]/20 border-[#F27430] ring-2 ring-[#F27430]/30'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{sample.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">{sample.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Vision Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Viewport & AR HUD (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl space-y-4 p-5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-emerald-400 font-semibold">
                {isLiveCameraActive ? 'LIVE CAMERA STREAMING (AR HUD)' : 'NEURAL VISION HUD ACTIVE'}
              </span>
            </div>
            <span className="text-zinc-500 font-mono text-[11px]">
              {analysisResult ? `${analysisResult.detectedObjects.length} Objects Isolated` : 'Scanning...'}
            </span>
          </div>

          {/* Interactive AR Viewport Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-zinc-800/80 group select-none">
            {isLiveCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={selectedImage}
                alt="Computer Vision Target"
                className="w-full h-full object-cover"
              />
            )}

            {/* Live Camera Capture Button */}
            {isLiveCameraActive && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center z-30">
                <button
                  type="button"
                  onClick={handleCaptureFrame}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-xs shadow-xl flex items-center gap-2 hover:opacity-95"
                >
                  <Crosshair className="w-4 h-4 text-[#FFE566]" />
                  <span>Scan & Analyze This Frame</span>
                </button>
              </div>
            )}

            {/* Scanning radar beam when analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFE566] to-transparent animate-scanline z-20 pointer-events-none" />
            )}

            {/* AR Overlays (Bounding Boxes + HUD Tags) */}
            {arOverlayActive && analysisResult && !isAnalyzing && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {analysisResult.detectedObjects.map((obj) => {
                  const [ymin, xmin, ymax, xmax] = obj.box2d;
                  const top = `${ymin / 10}%`;
                  const left = `${xmin / 10}%`;
                  const width = `${(xmax - xmin) / 10}%`;
                  const height = `${(ymax - ymin) / 10}%`;
                  const isHovered = (hoveredObjectId || selectedObjectId) === obj.id;

                  return (
                    <div
                      key={obj.id}
                      style={{ top, left, width, height }}
                      className={`absolute border-2 transition-all duration-200 pointer-events-auto cursor-pointer ${
                        isHovered
                          ? 'border-[#FFE566] bg-[#800020]/30 shadow-lg shadow-[#F27430]/30 z-20'
                          : 'border-[#F27430]/80 bg-[#800020]/10 hover:border-[#FFE566]'
                      }`}
                      onClick={() => setSelectedObjectId(obj.id)}
                      onMouseEnter={() => setHoveredObjectId(obj.id)}
                      onMouseLeave={() => setHoveredObjectId(null)}
                    >
                      {/* Bounding box corner brackets */}
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFE566]" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFE566]" />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFE566]" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFE566]" />

                      {/* Floating HUD Tag with Brand Info */}
                      <div className="absolute -top-8 left-0 px-2 py-0.5 rounded-md bg-zinc-950/90 border border-zinc-700 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                        <Target className="w-3 h-3 text-[#F27430]" />
                        <span className="font-bold">{obj.label}</span>
                        <span className="text-[#FFE566] font-semibold">
                          {Math.round(obj.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detected Objects Grid with metadata & touch selection */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-zinc-300">
              Isolated Visual Objects ({analysisResult?.detectedObjects.length || 0})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {analysisResult?.detectedObjects.map((obj) => {
                const isSelected = (selectedObjectId || hoveredObjectId) === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObjectId(obj.id)}
                    onMouseEnter={() => setHoveredObjectId(obj.id)}
                    onMouseLeave={() => setHoveredObjectId(null)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#800020]/30 border-[#FFE566] ring-1 ring-[#FFE566]/40'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{obj.label}</span>
                      <span className="font-mono text-[#FFE566] font-semibold text-[11px]">
                        {Math.round(obj.confidence * 100)}%
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">{obj.metadata}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: obj.dominantColor }}
                        />
                        <span className="text-[10px] font-mono text-zinc-400">{obj.dominantColor}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#F27430] uppercase">
                        {obj.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AR Intelligence, Brand Overlays, & Action Triggers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AR Object Detail Card */}
          {activeSelectedObject && (
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#F27430]" />
                  <span className="text-xs font-bold font-heading text-white uppercase tracking-wider">
                    AR Object Recognition Card
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#FFE566] bg-[#800020]/30 px-2 py-0.5 rounded border border-[#800020]">
                  {Math.round(activeSelectedObject.confidence * 100)}% Confidence
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-lg font-bold text-white">{activeSelectedObject.label}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {activeSelectedObject.metadata}
                </div>
              </div>

              {/* Brand Suggestions from Object */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                <div className="text-[#FFE566] font-mono font-semibold text-[11px] uppercase">
                  Detected Brand Profile:
                </div>
                <div className="text-white font-medium">
                  {analysisResult?.arOverlayInfo.brandSuggestion || 'AURA LABS'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Recommended Style: {analysisResult?.arOverlayInfo.recommendedStyle || 'Minimalist Geometric'}
                </div>
              </div>

              {/* Direct AR Action Triggers */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('logo-generator')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>Create Vector Logo from this Object</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('video-motion')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-[#F27430]" />
                  <span>Animate into Veo 3 Video Ad</span>
                </button>
              </div>
            </div>
          )}

          {/* Visual Analysis Summary & Color Palette (#800020, #F27430, #FFE566, #FFFFFF) */}
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#FFE566]" />
                Extracted Palette & Harmony
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                WCAG Compliant
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {analysisResult?.summary}
            </p>

            {/* Dominant Palette Swatches */}
            <div className="flex items-center gap-2 pt-2">
              {analysisResult?.dominantPalette.map((hex, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full h-8 rounded-lg border border-black/40 shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-[9px] font-mono text-zinc-400">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Extraction Card 1: Vector Logo Pipeline */}
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
                Extracted Logo Prompt (Vector)
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyPrompt(analysisResult?.extractedPrompts.logoPrompt || '', 'logo')
                }
                className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] font-mono"
              >
                {copiedKey === 'logo' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copiedKey === 'logo' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed">
              {analysisResult?.extractedPrompts.logoPrompt}
            </div>
          </div>

          {/* Prompt Extraction Card 2: Cinematic Image Pipeline */}
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F27430]" />
                Extracted Image Prompt (Cinematic)
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyPrompt(analysisResult?.extractedPrompts.imagePrompt || '', 'image')
                }
                className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] font-mono"
              >
                {copiedKey === 'image' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copiedKey === 'image' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed">
              {analysisResult?.extractedPrompts.imagePrompt}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('image-generator')}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Render in 8K</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('a2a-judge')}
                className="py-2.5 px-3 rounded-xl bg-[#800020]/30 hover:bg-[#800020]/50 border border-[#800020]/60 text-[#FFE566] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Audit with A2A</span>
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
