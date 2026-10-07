import React, { useState } from 'react';
import {
  LayoutTemplate,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Palette,
  Eye,
  Layers,
  Code,
  Smartphone,
  Globe,
  Apple,
  Check,
  Zap,
  RotateCw,
  Video,
  ScanEye,
  X,
} from 'lucide-react';
import { NavView, TemplateItem, AppGalleryItem } from '../../types';
import { storageService } from '../../services/storageService';

interface TemplatesViewProps {
  onNavigate: (view: NavView) => void;
  onApplyPrompt?: (prompt: string, targetView: 'logo-generator' | 'image-generator' | 'brand-studio') => void;
}

const APP_GALLERY_ITEMS: AppGalleryItem[] = [
  {
    id: 'app-aura',
    appName: 'Aura Health & Biometrics',
    category: 'Health & AI Mobile App',
    tagline: 'Precision biometric tracking and circadian wellness mobile ecosystem',
    platforms: ['iOS', 'Android', 'Web'],
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="42" stroke="#800020" stroke-width="8"/><circle cx="50" cy="50" r="26" fill="#F27430"/><circle cx="50" cy="50" r="12" fill="#FFE566"/></svg>`,
    videoPreviewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    palette: ['#800020', '#F27430', '#FFE566', '#FFFFFF', '#09090B'],
    promptRecipe: 'Minimalist circular biometric wave monogram for Aura Health, concentric pulses in deep burgundy (#800020) and amber (#FFE566), transparent background, SVG precision.',
    visionSpecs: 'Concentric ring detection, arterial pulse wave landmarking, 98% confidence on biometric HUD badge.',
    architecture: {
      visionModel: 'Gemini 3.8 Flash Vision',
      generationEngine: 'Veo 3.1 Neural Synth + SVG Generator',
      objectDetectionSpecs: 'Cardiovascular waveform & pulse rings',
      brandKitUsed: 'Aura Signature Palette',
    },
    features: [
      'Real-time pulse rate AR camera overlay',
      'Biometric fingerprint & facial passkey auth',
      'Veo 3 3D product animation for smart wearable',
      'Offline health record synchronization',
    ],
  },
  {
    id: 'app-apex',
    appName: 'Apex Cybernetics Engine',
    category: 'Robotics & AI SaaS',
    tagline: 'Autonomous robotics perception & visual intelligence platform',
    platforms: ['Web', 'iOS', 'Android'],
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="50,15 90,85 10,85" stroke="#F27430" stroke-width="8"/><circle cx="50" cy="58" r="16" fill="#800020"/><polygon points="50,35 65,65 35,65" fill="#FFE566"/></svg>`,
    videoPreviewUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    palette: ['#09090B', '#800020', '#F27430', '#FFE566', '#FFFFFF'],
    promptRecipe: 'Futuristic delta prism emblem for Apex Robotics, sharp beveled geometry, radiant tangerine (#F27430) edge lighting, dark mode contrast.',
    visionSpecs: 'Kinetic geometry isolation, edge orientation angles, HUD bracket overlays.',
    architecture: {
      visionModel: 'Gemini 3.8 Flash Multimodal',
      generationEngine: 'Dual A2A Creator & Judge Pipelines',
      objectDetectionSpecs: 'Robotic actuator joints & sensor lenses',
      brandKitUsed: 'Cybernetic High-Contrast Kit',
    },
    features: [
      'Sub-50ms object recognition HUD pipeline',
      'Autonomous A2A Judge compliance scoring',
      'Full-vector dark mode SVG export suite',
      'One-click multi-cloud shareable deployment',
    ],
  },
  {
    id: 'app-veloce',
    appName: 'Veloce Gourmet Roast',
    category: 'E-commerce & Lifestyle',
    tagline: 'Artisanal single-origin espresso and luxury packaging identity',
    platforms: ['iOS', 'Android', 'Web'],
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="60" height="60" rx="15" stroke="#800020" stroke-width="8"/><path d="M35 50 Q50 30 65 50 T95 50" stroke="#FFE566" stroke-width="6" fill="none"/><circle cx="50" cy="65" r="8" fill="#F27430"/></svg>`,
    palette: ['#800020', '#FFE566', '#F27430', '#FFFFFF', '#18181B'],
    promptRecipe: 'Luxury heritage crest for Veloce Gourmet Espresso, interlocking golden curves with deep oxblood (#800020) packaging badge, vintage elegance.',
    visionSpecs: 'Packaging curvature detection, typography logotype extraction, foil reflection isolation.',
    architecture: {
      visionModel: 'Gemini 3.8 Flash Vision',
      generationEngine: 'Veo 3 360° Orbit Studio',
      objectDetectionSpecs: 'Obsidian coffee bag & embossed gold crest',
      brandKitUsed: 'Prestige Roast Luxury Palette',
    },
    features: [
      '360° orbital product commercial generation with Veo 3',
      'Complete social reel storyboards in 9:16 format',
      'Embossed gold foil business card & packaging specs',
      'Customer review & feedback integration form',
    ],
  },
  {
    id: 'app-solstice',
    appName: 'Solstice Living Architecture',
    category: 'Architecture & Real Estate',
    tagline: 'High-end sustainable architectural developments and spatial branding',
    platforms: ['Web', 'iOS'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10 L85 85 L15 85 Z" stroke="#800020" stroke-width="8"/><line x1="50" y1="10" x2="50" y2="85" stroke="#F27430" stroke-width="6"/><circle cx="50" cy="50" r="12" fill="#FFE566"/></svg>`,
    palette: ['#800020', '#F27430', '#FFFFFF', '#FFE566', '#09090B'],
    promptRecipe: 'Minimalist brutalist architectural monogram for Solstice, cantilever geometry, deep burgundy (#800020) and amber daylight balance.',
    visionSpecs: 'Perspective horizon detection, concrete texture analysis, window grid alignment.',
    architecture: {
      visionModel: 'Gemini 3.8 Flash Vision',
      generationEngine: 'Cinematic 8K Image Synthesis',
      objectDetectionSpecs: 'Structural facades & daylight focal lines',
      brandKitUsed: 'Modernist Concrete & Oxblood Kit',
    },
    features: [
      'Drone fly-through video ads generated with Veo 3',
      'AR building facade overlay with dynamic lighting',
      'WCAG contrast compliant typography standards',
      'Push notification alerts for client approvals',
    ],
  },
];

const TEMPLATE_PRESETS: TemplateItem[] = [
  {
    id: 'tpl-1',
    title: 'Kinetic Quantum Monogram',
    category: 'Logos',
    style: 'Minimalist Vector',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    prompt: 'Minimalist geometric monogram for quantum tech firm, interlocking polygons with #800020 and #F27430, transparent background.',
    palette: ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
  },
  {
    id: 'tpl-2',
    title: 'Luxury Obsidian Product Display',
    category: 'E-commerce',
    style: 'Studio 3D',
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    prompt: 'Obsidian luxury podium with amber rim lighting, dark studio product setup, 360 camera path.',
    palette: ['#0B0B0E', '#FFE566', '#800020'],
  },
  {
    id: 'tpl-3',
    title: 'Fintech Mobile Header Banner',
    category: 'Social',
    style: 'Modern Graphic',
    previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    prompt: 'High conversion fintech header graphic, clean typography layout and metric badges.',
    palette: ['#800020', '#F27430', '#FFFFFF'],
  },
  {
    id: 'tpl-4',
    title: 'Heritage Crest Seal',
    category: 'Logos',
    style: 'Vintage Luxury',
    previewUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    prompt: 'Traditional luxury heraldic shield with modern golden geometry and typography.',
    palette: ['#800020', '#FFE566', '#FFFFFF'],
  },
];

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onNavigate, onApplyPrompt }) => {
  const [activeTab, setActiveTab] = useState<'app-gallery' | 'templates'>('app-gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppGalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Logos', 'E-commerce', 'Social', 'Technology'];

  const filteredApps = APP_GALLERY_ITEMS.filter((app) => {
    return (
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredTemplates = TEMPLATE_PRESETS.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.style.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemixApp = (app: AppGalleryItem) => {
    storageService.addNotification({
      title: `Remixed "${app.appName}"`,
      message: 'App recipe, prompt directions, and color harmony loaded into your creative studio.',
      type: 'success',
    });
    if (onApplyPrompt) {
      onApplyPrompt(app.promptRecipe, 'logo-generator');
    } else {
      onNavigate('logo-generator');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <LayoutTemplate className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Curated Creative Blueprints & App Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            App Gallery & Templates
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Kickstart your project by exploring the App Gallery. See how each complete app is built, inspect its prompt recipe & vision pipeline, and remix it to make it your own.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('app-gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'app-gallery'
                ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Explore App Gallery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Design Templates
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'app-gallery' ? 'Search apps, categories...' : 'Search templates...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430]"
          />
        </div>

        {activeTab === 'templates' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#800020] text-white border border-[#F27430]'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. APP GALLERY VIEW */}
      {activeTab === 'app-gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Media Header */}
                <div className="relative h-48 sm:h-56 bg-zinc-900 overflow-hidden">
                  <img
                    src={app.coverImage}
                    alt={app.appName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  {/* SVG Logo Stamp Badge */}
                  <div
                    className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-zinc-950/90 border border-zinc-700 p-2 shadow-xl backdrop-blur-md"
                    dangerouslySetInnerHTML={{ __html: app.logoSvg }}
                  />

                  {/* Platform Badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    {app.platforms.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-semibold text-zinc-300 border border-zinc-700/60"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* App Category */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-mono text-[#FFE566] uppercase tracking-wider bg-[#800020]/80 px-2 py-0.5 rounded border border-[#800020]">
                      {app.category}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">{app.appName}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{app.tagline}</p>
                  </div>

                  {/* Palette Harmony */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Signature Color DNA:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {app.palette.map((c, idx) => (
                        <div
                          key={idx}
                          title={c}
                          className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1">
                    {app.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-[#FFE566] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0 border-t border-zinc-900 grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>See How It's Built</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemixApp(app)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>Remix App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. TEMPLATES VIEW */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden hover:border-[#F27430] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#FFE566] border border-zinc-700/60">
                    {item.style}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFE566] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>

                  <div className="flex items-center gap-1 pt-1">
                    {item.palette.map((c, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onApplyPrompt) onApplyPrompt(item.prompt, 'logo-generator');
                    else onNavigate('logo-generator');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-[#800020] text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-800 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "See How It's Built" Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 p-2"
                  dangerouslySetInnerHTML={{ __html: selectedApp.logoSvg }}
                />
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{selectedApp.appName}</h3>
                  <span className="text-xs text-[#FFE566] font-mono">{selectedApp.category}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Architecture Stack */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#F27430]" />
                Technical Architecture & AI Engine
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Vision Model</div>
                  <div className="text-white font-semibold mt-0.5">{selectedApp.architecture.visionModel}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Generation Pipeline</div>
                  <div className="text-white font-semibold mt-0.5">{selectedApp.architecture.generationEngine}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Computer Vision Specs</div>
                  <div className="text-white font-semibold mt-0.5">{selectedApp.architecture.objectDetectionSpecs}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">Brand System</div>
                  <div className="text-white font-semibold mt-0.5">{selectedApp.architecture.brandKitUsed}</div>
                </div>
              </div>
            </div>

            {/* Prompt Recipe */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
                Underlying Prompt Recipe
              </span>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed">
                {selectedApp.promptRecipe}
              </div>
            </div>

            {/* Vision Intelligence Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ScanEye className="w-4 h-4 text-purple-400" />
                Computer Vision Analysis Extraction
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {selectedApp.visionSpecs}
              </p>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedApp(null);
                  handleRemixApp(selectedApp);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white font-bold text-xs shadow-xl shadow-[#800020]/30 hover:opacity-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
                <span>Remix This App Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
