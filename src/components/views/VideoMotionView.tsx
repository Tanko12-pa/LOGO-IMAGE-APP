import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Play,
  Pause,
  Sparkles,
  Upload,
  Download,
  Share2,
  RefreshCw,
  Film,
  Camera,
  Maximize2,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Layers,
  Check,
  ArrowRight,
  Tv,
  Smartphone,
  Square,
  Sparkle,
  Clapperboard,
  RotateCw,
} from 'lucide-react';
import { NavView, VideoStoryboard } from '../../types';
import { apiService } from '../../services/apiService';
import { storageService } from '../../services/storageService';

interface VideoMotionViewProps {
  onNavigate: (view: NavView) => void;
  onSaveToDesigns?: (item: any) => void;
}

type VideoMode = 'product_ad' | 'portrait_animation' | 'text_to_video';

interface SamplePreset {
  id: string;
  name: string;
  category: string;
  mode: VideoMode;
  url: string;
  prompt: string;
  motion: string;
}

const VIDEO_SAMPLES: SamplePreset[] = [
  {
    id: 'sample-watch',
    name: 'Obsidian Chronograph Watch',
    category: 'Product Photo',
    mode: 'product_ad',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Luxury obsidian chronograph on matte pedestal, deep burgundy rim lights (#800020), amber dial highlights (#FFE566), 360 rotation.',
    motion: 'orbit',
  },
  {
    id: 'sample-sneaker',
    name: 'Cyber Kinetic Sneaker',
    category: 'Product Photo',
    mode: 'product_ad',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Futuristic athletic sneaker floating in mid-air, dynamic tangerine rim glow (#F27430), slow-motion smoke burst, cinematic dolly zoom.',
    motion: 'dolly',
  },
  {
    id: 'sample-portrait',
    name: 'Cyberpunk Character Portrait',
    category: 'Character Portrait',
    mode: 'portrait_animation',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Cinematic character portrait, gentle head movement, expressive eye blink, neon burgundy and golden rim lights reflecting in pupils.',
    motion: 'pulse',
  },
  {
    id: 'sample-perfume',
    name: 'Luxe Noir Parisian Fragrance',
    category: 'Product Photo',
    mode: 'product_ad',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Crystalline perfume bottle surrounded by floating amber particles, subtle liquid caustics, and elegant typography badge.',
    motion: 'orbit',
  },
];

const MOTION_PRESETS = [
  { id: 'orbit', label: '360° Product Orbit', desc: 'Smooth rotational showcase of all angles' },
  { id: 'dolly', label: 'Cinematic Dolly Zoom', desc: 'Forward optical push with dynamic depth' },
  { id: 'pulse', label: 'Brand Light Pulse', desc: 'Rhythmic burgundy & amber lighting shifts' },
  { id: 'pan', label: 'Architectural Sweep', desc: 'Fluid horizontal lateral tracking' },
  { id: 'tilt', label: 'Hero Vertical Tilt', desc: 'Dramatic ground-up reveal of product form' },
  { id: 'drone', label: 'Drone Fly-Through', desc: 'High-speed sweeping cinematic camera' },
];

export const VideoMotionView: React.FC<VideoMotionViewProps> = ({ onNavigate }) => {
  const [activeMode, setActiveMode] = useState<VideoMode>('product_ad');
  const [sourceImage, setSourceImage] = useState<string>(VIDEO_SAMPLES[0].url);
  const [videoPrompt, setVideoPrompt] = useState<string>(VIDEO_SAMPLES[0].prompt);
  const [motionPreset, setMotionPreset] = useState<string>('orbit');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<number>(6);
  const [fps, setFps] = useState<number>(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(2.4);
  const [storyboard, setStoryboard] = useState<VideoStoryboard | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initial video storyboard synthesis
  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    try {
      const customInstructions = storageService.getCustomInstructions();
      const res = await apiService.generateVideo({
        prompt: videoPrompt,
        mode: activeMode,
        motionPreset,
        aspectRatio,
        duration,
        customInstructions,
      });
      setStoryboard(res);
      setCurrentTime(0);
      setIsPlaying(true);
      storageService.addNotification({
        title: 'Video Ad Synthesized',
        message: `Veo 3 completed "${res.title}" in ${aspectRatio} at 60 FPS.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateVideo();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSourceImage(base64);
        if (activeMode === 'product_ad') {
          setVideoPrompt(
            'Dynamic product commercial with 3D orbital lighting, burgundy (#800020) and radiant tangerine (#F27430) reflections, slow floating particles.'
          );
        } else if (activeMode === 'portrait_animation') {
          setVideoPrompt(
            'High-definition character portrait animation, natural eye blink, warm lighting transitions, and subtle smile movement.'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SamplePreset) => {
    setActiveMode(sample.mode);
    setSourceImage(sample.url);
    setVideoPrompt(sample.prompt);
    setMotionPreset(sample.motion);
  };

  // Canvas dynamic renderer simulating camera orbit, dolly, and lighting pulse
  useEffect(() => {
    let startTime = Date.now();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceImage;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const elapsed = ((Date.now() - startTime) / 1000) % duration;
      if (isPlaying) {
        setCurrentTime(parseFloat(elapsed.toFixed(1)));
      }

      const progress = elapsed / duration;

      // Base background
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, width, height);

      // Camera motion calculations
      ctx.save();
      let scale = 1.0;
      let dx = 0;
      let dy = 0;
      let rot = 0;

      if (motionPreset === 'orbit') {
        dx = Math.sin(progress * Math.PI * 2) * 25;
        scale = 1.05 + Math.cos(progress * Math.PI * 2) * 0.05;
      } else if (motionPreset === 'dolly') {
        scale = 1.0 + progress * 0.25;
      } else if (motionPreset === 'pulse') {
        scale = 1.02 + Math.sin(progress * Math.PI * 4) * 0.04;
      } else if (motionPreset === 'pan') {
        dx = (progress - 0.5) * 50;
      } else if (motionPreset === 'tilt') {
        dy = (progress - 0.5) * 40;
        scale = 1.08;
      } else if (motionPreset === 'drone') {
        dx = Math.sin(progress * Math.PI) * 40;
        dy = Math.cos(progress * Math.PI) * 20;
        scale = 1.0 + progress * 0.18;
      }

      ctx.translate(width / 2 + dx, height / 2 + dy);
      ctx.rotate(rot);
      ctx.scale(scale, scale);

      // Draw the image centered
      if (img.complete && img.naturalWidth > 0) {
        const aspect = img.naturalWidth / img.naturalHeight;
        let dw = width;
        let dh = width / aspect;
        if (dh < height) {
          dh = height;
          dw = height * aspect;
        }
        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      }

      ctx.restore();

      // Atmospheric Lighting Shimmer (#800020 & #F27430)
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(progress * Math.PI * 2) * (width * 0.3),
        height * 0.3,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(255, 229, 102, 0.15)'); // #FFE566 Amber
      grad.addColorStop(0.5, 'rgba(128, 0, 32, 0.22)'); // #800020 Burgundy
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Floating Micro Particles
      ctx.fillStyle = 'rgba(255, 229, 102, 0.7)';
      for (let i = 0; i < 15; i++) {
        const px = ((i * 73 + elapsed * 30) % width);
        const py = ((i * 59 + elapsed * 15) % height);
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    img.onload = () => {
      render();
    };
    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sourceImage, motionPreset, isPlaying, duration]);

  const handleDownloadVideo = () => {
    setDownloadSuccess(true);
    // Simulate generating shareable/downloadable file
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `veo3-video-ad-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleSaveToProject = () => {
    const newItem = {
      id: `vid-${Date.now()}`,
      title: storyboard?.title || 'Veo 3 Video Ad Clip',
      type: 'video' as const,
      prompt: videoPrompt,
      url: sourceImage,
      aspectRatio,
      dimensions: aspectRatio === '9:16' ? '1080x1920' : '3840x2160',
      palette: ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
      tags: ['Veo 3', motionPreset, activeMode, '60FPS'],
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    storageService.saveDesign(newItem);
    storageService.addNotification({
      title: 'Video Saved to Library',
      message: `"${newItem.title}" is now available in My Designs.`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#800020]/30 to-[#F27430]/30 border border-[#800020]/60 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <Video className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Google Veo 3.1 Neural Video & Motion Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Animate Images into Video
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Bring product photos and character portraits to life with Veo 3 camera paths, dynamic lighting, and text-to-video generation.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveToProject}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#FFE566] text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Save to Designs</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadVideo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#FFE566]" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export MP4 Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Switcher: 3 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveMode('product_ad');
            setVideoPrompt(
              'Dynamic luxury brand commercial with obsidian pedestal, glowing burgundy rim lights (#800020), and floating holographic product details.'
            );
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeMode === 'product_ad'
              ? 'bg-[#800020]/25 border-[#F27430] ring-1 ring-[#F27430]/40'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#FFE566]" />
            <span className="text-xs font-bold text-white">Animate Product Photo</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Transform static e-commerce products into 3D orbital commercial ads.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('portrait_animation');
            setSourceImage(VIDEO_SAMPLES[2].url);
            setVideoPrompt(VIDEO_SAMPLES[2].prompt);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeMode === 'portrait_animation'
              ? 'bg-[#800020]/25 border-[#F27430] ring-1 ring-[#F27430]/40'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clapperboard className="w-4 h-4 text-[#F27430]" />
            <span className="text-xs font-bold text-white">Animate Character Portrait</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Bring avatar faces to life with breathing, head tilt, and living expressions.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('text_to_video');
            setVideoPrompt(
              'A high-energy startup product reveal with bold typography in #800020 and #F27430, fast-paced motion graphics, and tech UI elements.'
            );
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeMode === 'text_to_video'
              ? 'bg-[#800020]/25 border-[#F27430] ring-1 ring-[#F27430]/40'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Generate Video from Text</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Turn blog scripts or descriptions directly into cinematic scenes.
          </p>
        </button>
      </div>

      {/* Preset Quick Test Bar */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          Quick Test Video Assets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VIDEO_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                sourceImage === sample.url
                  ? 'bg-[#800020]/20 border-[#F27430] ring-1 ring-[#F27430]/40'
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

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls & Prompting (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
          {/* Upload Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                {activeMode === 'portrait_animation' ? 'Character Portrait' : 'Source Product Photo'}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#FFE566] hover:underline font-mono flex items-center gap-1"
              >
                <Upload className="w-3 h-3 text-[#F27430]" />
                <span>Upload Custom</span>
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border border-dashed border-zinc-700 hover:border-[#F27430] bg-zinc-900/60 cursor-pointer flex items-center gap-3 transition-all"
            >
              <img
                src={sourceImage}
                alt="Selected"
                className="w-14 h-14 rounded-xl object-cover border border-zinc-700 shrink-0"
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-semibold text-white">Click to change media</div>
                <div className="text-[11px] text-zinc-400">PNG, JPG, WebP supported (Max 50MB)</div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Script / Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Veo 3 Script & Motion Directive
              </label>
              <span className="text-[10px] font-mono text-[#FFE566]">Neural Prompting</span>
            </div>
            <textarea
              rows={3}
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe camera motion, visual changes, or paste blog script..."
              className="w-full p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] leading-relaxed"
            />
          </div>

          {/* Camera Motion Paths */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Camera Motion Path</label>
            <div className="grid grid-cols-2 gap-2">
              {MOTION_PRESETS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMotionPreset(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    motionPreset === m.id
                      ? 'bg-[#800020]/30 border-[#F27430] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-[#FFE566]">{m.label}</div>
                  <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Video Format & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Format</label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  title="16:9 Landscape"
                  className={`py-1.5 flex justify-center rounded-lg text-xs font-mono font-bold transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-[#800020] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  title="9:16 Reel"
                  className={`py-1.5 flex justify-center rounded-lg text-xs font-mono font-bold transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-[#800020] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  title="1:1 Square"
                  className={`py-1.5 flex justify-center rounded-lg text-xs font-mono font-bold transition-all ${
                    aspectRatio === '1:1'
                      ? 'bg-[#800020] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-[#F27430]"
              >
                <option value={4}>4 Seconds (Fast Ad)</option>
                <option value={6}>6 Seconds (Standard Reel)</option>
                <option value={10}>10 Seconds (Showcase)</option>
                <option value={15}>15 Seconds (Story)</option>
              </select>
            </div>
          </div>

          {/* Synthesize Button */}
          <button
            type="button"
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-sm shadow-xl shadow-[#800020]/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#FFE566]" />
                <span>Synthesizing Veo 3 Video Frames...</span>
              </>
            ) : (
              <>
                <Sparkle className="w-4 h-4 text-[#FFE566]" />
                <span>Synthesize Video with Veo 3</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Player & Scene Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Video Canvas Player */}
          <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-zinc-200 font-semibold">
                  {storyboard?.title || 'Veo 3 Neural Commercial'}
                </span>
              </div>
              <span className="text-[#FFE566] font-mono">
                {currentTime.toFixed(2)}s / {duration}.00s • {fps} FPS ProRes
              </span>
            </div>

            {/* Simulated Animated Video Canvas */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-zinc-800 group select-none ${
                aspectRatio === '16:9'
                  ? 'aspect-video w-full'
                  : aspectRatio === '9:16'
                  ? 'aspect-[9/16] max-w-sm mx-auto'
                  : 'aspect-square max-w-md mx-auto'
              }`}
            >
              <canvas
                ref={canvasRef}
                width={aspectRatio === '9:16' ? 720 : 1280}
                height={aspectRatio === '9:16' ? 1280 : aspectRatio === '1:1' ? 1280 : 720}
                className="w-full h-full object-cover"
              />

              {/* Video Overlay HUD */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-300">
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60">
                    VEO 3.1 NEURAL SYNTH
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#800020]/90 text-[#FFE566] border border-[#F27430]/40">
                    MOTION: {motionPreset.toUpperCase()}
                  </span>
                </div>

                {/* Subtitle / Script Caption */}
                <div className="text-center px-4">
                  <p className="inline-block px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs font-semibold text-white border border-zinc-800 shadow-md">
                    {storyboard?.tagline || 'Redefining the standard of brand presence.'}
                  </p>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FFE566]" />}
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-zinc-300 bg-black/60 px-2 py-1 rounded-md">
                    4K DCI-P3 (#800020 & #F27430)
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Progress Bar */}
            <div className="space-y-1">
              <div
                className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(parseFloat((pos * duration).toFixed(1)));
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566] transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Veo 3 Multi-Scene Storyboard Breakdown */}
          {storyboard && (
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clapperboard className="w-3.5 h-3.5 text-[#FFE566]" />
                  Veo 3 Storyboard & Audio Directives
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">
                  {storyboard.scenes.length} Dynamic Keyframes
                </span>
              </div>

              <div className="space-y-3">
                {storyboard.scenes.map((scene, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                      <span className="text-[#FFE566] font-semibold">{scene.timecode}</span>
                      <span className="text-zinc-300">{scene.cameraMotion}</span>
                    </div>
                    <p className="text-white font-medium">{scene.visualAction}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566]">
                        {scene.lightingColor}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {scene.soundDesign}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voiceover Script box */}
              {storyboard.voiceoverScript && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                  <span className="text-[#FFE566] font-mono font-bold block mb-1">
                    Synchronized Voiceover Copy:
                  </span>
                  "{storyboard.voiceoverScript}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
