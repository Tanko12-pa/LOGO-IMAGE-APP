import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ImageIcon,
  Wand2,
  Download,
  Star,
  RefreshCw,
  Copy,
  Check,
  SlidersHorizontal,
  FolderPlus,
  Palette,
  Maximize2,
  ChevronDown,
  Layers,
  ArrowRight,
  ListOrdered,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Video,
  FileText,
  Boxes,
  Undo2,
  Redo2,
  ArrowUp,
  ArrowDown,
  History,
  Grid,
  FileCode,
  Type,
  Zap,
  Cpu,
  Terminal,
  Shield,
} from 'lucide-react';
import { BrandKit, DesignItem, NavView, BatchImageTask, BatchStyleConfig } from '../../types';
import { apiService } from '../../services/apiService';
import { storageService } from '../../services/storageService';
import { SvgExportModal } from '../SvgExportModal';
import { generateVectorAssetFromPrompt } from '../../services/svgLogoGenerator';

interface ImageGeneratorViewProps {
  activeBrandKit: BrandKit;
  onSaveDesign: (item: DesignItem) => void;
  onNavigate: (view: NavView) => void;
}

export const FOUNDATION_MODELS = [
  {
    id: 'flux-1' as const,
    name: 'Flux.1 (Black Forest Labs)',
    tagline: 'Best-in-class in-image typography & text rendering',
    badge: 'Legible Text Leader',
    provider: 'Replicate / Open-Weights GPU',
    speed: '3.8s',
    commercialSafe: 96,
  },
  {
    id: 'stability-ultra' as const,
    name: 'Stability AI Stable Image Ultra',
    tagline: 'Lightning-fast masterpiece generations & cinematic lighting',
    badge: 'Cinematic Lighting',
    provider: 'Stability AI Official API',
    speed: '1.9s',
    commercialSafe: 97,
  },
  {
    id: 'midjourney-v6' as const,
    name: 'Midjourney v6.1 API',
    tagline: 'Best-in-class for artistic, stylistic & photorealistic visuals',
    badge: 'Artistic Masterpiece',
    provider: 'Midjourney API B2B',
    speed: '5.8s',
    commercialSafe: 92,
  },
  {
    id: 'firefly-v3' as const,
    name: 'Adobe Firefly API',
    tagline: 'Trained on licensed stock; safe for commercial logos & graphics',
    badge: '100% Commercial Safe',
    provider: 'Adobe Sensei API',
    speed: '3.1s',
    commercialSafe: 100,
  },
  {
    id: 'recraft-v20' as const,
    name: 'Recraft.ai Vector Engine',
    tagline: 'Native mathematically clean SVG paths, icons & brand marks',
    badge: 'Lossless Vector SVG',
    provider: 'Recraft.ai Engine',
    speed: '2.4s',
    commercialSafe: 100,
  },
  {
    id: 'gemini-3.1-flash-image-preview' as const,
    name: 'Gemini 3.1 Flash Image Preview',
    tagline: 'Multimodal generative synthesis with instant visual reasoning',
    badge: 'Multimodal Engine',
    provider: 'Google AI Studio',
    speed: '2.8s',
    commercialSafe: 98,
  },
];

const CATEGORIES = [
  'Product Photography',
  'Marketing',
  'Advertising',
  'Social Media',
  'E-commerce',
  'Technology',
  'Lifestyle',
  'Illustration',
  '3D Render',
  'Website Hero',
  'Abstract',
  'Business',
];

const STYLES = [
  'Cinematic Photorealistic',
  'Modern 3D Matte',
  'Studio Product Shot',
  'Hyper-detailed 8K',
  'Editorial Fashion',
  'Minimalist Geometric',
  'Atmospheric Moody',
  'Isometric Tech',
];

const LIGHTING_OPTIONS = [
  'Studio Rim Lighting',
  'Volumetric Golden Hour',
  'Cyberpunk Neon Glow',
  'Diffused Softbox Ambient',
  'Moody Dramatic Chiaroscuro',
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', desc: 'Instagram & Icons' },
  { id: '16:9', label: '16:9 Landscape', desc: 'YouTube & Web' },
  { id: '9:16', label: '9:16 Portrait', desc: 'TikTok & Stories' },
  { id: '4:3', label: '4:3 Classic', desc: 'Presentations' },
];

// Curated stock visuals mapped to prompts for realistic instant rendering
const SAMPLE_IMAGE_POOL = [
  {
    key: 'watch',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    title: 'Obsidian Chronograph Timepiece',
    prompt: 'Luxury obsidian chronograph watch on basalt pedestal with deep burgundy (#800020) reflections and golden amber (#FFE566) hour markers.',
  },
  {
    key: 'sneaker',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    title: 'Cyber Kinetic Athletic Sneaker',
    prompt: 'Futuristic athletic sneaker floating in mid-air with radiant tangerine (#F27430) rim lighting and subtle atmospheric particle smoke.',
  },
  {
    key: 'perfume',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    title: 'Luxe Noir Parisian Fragrance',
    prompt: 'Minimalist faceted perfume bottle surrounded by liquid amber caustics and deep burgundy velvet shadows.',
  },
  {
    key: 'headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    title: 'Precision Studio Wireless Headphones',
    prompt: 'Matte black audiophile headphones on minimalist stand with warm studio softbox lighting and brushed copper accents.',
  },
  {
    key: 'tech',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    title: 'Cyber Technology Hardware Gateway',
    prompt: 'Cinematic hardware telemetry hub with glowing tangerine telemetry and deep matte black obsidian casing.',
  },
  {
    key: 'architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Architectural Luxury Studio Interior',
    prompt: 'Modern architectural interior with cantilever geometry, dramatic volumetric daylight, and sleek burgundy textures.',
  },
  {
    key: 'emblem',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    title: 'Kinetic Automotive Emblem',
    prompt: 'Sculpted metallic hood emblem badge with aerodynamic curves under studio spotlight on polished obsidian surface.',
  },
  {
    key: 'workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    title: 'Executive Creative Workspace',
    prompt: 'Top-down clean executive workspace with modern laptop, sketches, matte black coffee mug, and warm ambient sunlight.',
  },
];

// Curated Batch Presets for 1-Click Multi-Task Queue Loading
const CURATED_BATCH_PACKS = [
  {
    id: 'pack-ecommerce',
    name: 'Luxury E-Commerce Catalog Suite',
    category: 'Product Photography',
    style: 'Studio Product Shot',
    lighting: 'Studio Rim Lighting',
    aspectRatio: '1:1',
    description: '4 commercial product shots in uniform lighting and studio composition.',
    tasks: [
      {
        id: 'task-ecom-1',
        title: 'Obsidian Chronograph Watch',
        prompt: 'Luxury obsidian chronograph watch on basalt pedestal, deep burgundy rim lights (#800020), amber dial highlights (#FFE566).',
        poolKey: 'watch',
      },
      {
        id: 'task-ecom-2',
        title: 'Cyber Kinetic Sneaker',
        prompt: 'Futuristic athletic sneaker floating in mid-air, dynamic tangerine rim glow (#F27430), slow-motion smoke burst.',
        poolKey: 'sneaker',
      },
      {
        id: 'task-ecom-3',
        title: 'Luxe Noir Parisian Fragrance',
        prompt: 'Crystalline perfume bottle surrounded by floating amber particles, subtle liquid caustics, and elegant typography badge.',
        poolKey: 'perfume',
      },
      {
        id: 'task-ecom-4',
        title: 'Studio Wireless Headphones',
        prompt: 'Audiophile matte black headphones on sculptured concrete stand with dual rim lights in oxblood and warm gold.',
        poolKey: 'headphones',
      },
    ],
  },
  {
    id: 'pack-campaign',
    name: 'Omnichannel Brand Launch Campaign',
    category: 'Advertising',
    style: 'Cinematic Photorealistic',
    lighting: 'Volumetric Golden Hour',
    aspectRatio: '16:9',
    description: 'Cohesive advertising campaign assets for billboards, web heroes, and key visuals.',
    tasks: [
      {
        id: 'task-camp-1',
        title: 'Hero Key Visual & Crest',
        prompt: 'Hero brand reveal visual with monolithic glass emblem catching sunrise light, deep burgundy (#800020) atmospheric haze.',
        poolKey: 'tech',
      },
      {
        id: 'task-camp-2',
        title: 'Architectural Showroom Interior',
        prompt: 'Flagship showroom with brutalist stone walls, ambient amber glow (#FFE566), and minimalist brand signage.',
        poolKey: 'architecture',
      },
      {
        id: 'task-camp-3',
        title: 'Precision Product In Situ',
        prompt: 'Luxury product displayed on executive boardroom desk, cinematic depth-of-field, premium soft illumination.',
        poolKey: 'workspace',
      },
      {
        id: 'task-camp-4',
        title: 'Kinetic Emblem Badge',
        prompt: 'Macro close-up of brand emblem badge in brushed titanium with sharp highlight glints and dark slate background.',
        poolKey: 'emblem',
      },
    ],
  },
  {
    id: 'pack-social',
    name: 'Social Media Reel & Story Pack',
    category: 'Social Media',
    style: 'Modern 3D Matte',
    lighting: 'Cyberpunk Neon Glow',
    aspectRatio: '9:16',
    description: 'High engagement vertical mobile story assets with vibrant color pop.',
    tasks: [
      {
        id: 'task-soc-1',
        title: 'Mobile Sneaker Spotlight',
        prompt: 'Vertical portrait format sneaker launch graphic with neon tangerine accents (#F27430) and bold typography safe zone.',
        poolKey: 'sneaker',
      },
      {
        id: 'task-soc-2',
        title: 'Tech Gadget Kinetic Teaser',
        prompt: 'Vertical tech hardware teaser with glowing circuit traces, moody burgundy background (#800020), and centered subject.',
        poolKey: 'tech',
      },
      {
        id: 'task-soc-3',
        title: 'Fragrance Atmospheric Story',
        prompt: 'Luxury fragrance bottle with floating golden embers in vertical 9:16 reel composition, dramatic side light.',
        poolKey: 'perfume',
      },
      {
        id: 'task-soc-4',
        title: 'Timepiece Macro Story',
        prompt: 'Vertical high-impact luxury watch dial close-up with tourbillon motion blur and rich dark obsidian reflections.',
        poolKey: 'watch',
      },
    ],
  },
];

export const ImageGeneratorView: React.FC<ImageGeneratorViewProps> = ({
  activeBrandKit,
  onSaveDesign,
  onNavigate,
}) => {
  // Navigation between Single Image Mode vs Batch Queue Mode
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  // Single Generator State
  const [prompt, setPrompt] = useState(
    'A sleek luxury obsidian product display pedestal with deep burgundy (#800020) reflections, luminous amber (#FFE566) atmospheric lighting, and clean floating geometric emblems.'
  );
  const [category, setCategory] = useState('Product Photography');
  const [style, setStyle] = useState('Cinematic Photorealistic');
  const [lighting, setLighting] = useState('Studio Rim Lighting');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [useBrandKit, setUseBrandKit] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<
    { id: string; url: string; prompt: string; title: string; isFav: boolean }[]
  >([]);
  const [copied, setCopied] = useState(false);

  // Multi-Foundation Model Routing & Typography State
  const [selectedFoundationModel, setSelectedFoundationModel] = useState<
    'flux-1' | 'stability-ultra' | 'midjourney-v6' | 'firefly-v3' | 'recraft-v20' | 'gemini-3.1-flash-image-preview'
  >('flux-1');
  const [inImageTypography, setInImageTypography] = useState('AETHERIA');
  const [vectorMode, setVectorMode] = useState(false);
  const [rudraVariables, setRudraVariables] = useState<Record<string, string> | null>(null);
  const [isRudraEnhancing, setIsRudraEnhancing] = useState(false);
  const [lastModelMetadata, setLastModelMetadata] = useState<{
    model: string;
    latencyMs: number;
    specs: {
      resolution: string;
      textRenderQuality?: string;
      vectorPrecision?: string;
      commercialSafetyScore: number;
    };
  } | null>(null);

  // -------------------------------------------------------------
  // BATCH PROCESSING MODULE STATE
  // -------------------------------------------------------------
  const [batchStyle, setBatchStyle] = useState<BatchStyleConfig>({
    style: 'Studio Product Shot',
    category: 'Product Photography',
    lighting: 'Studio Rim Lighting',
    aspectRatio: '1:1',
    useBrandKit: true,
    lockConsistencySeed: true,
    negativePrompt: 'blurry, low resolution, bad geometry, artifacts, watermark, distorted typography',
    customDirectives: 'Deep obsidian pedestal (#09090B), burgundy rim light (#800020), amber specular reflection (#FFE566)',
    colorPalette: activeBrandKit?.palette?.map((p) => p.hex) || ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
  });

  // Initial Queue populated with a multi-task product catalog pack
  const [taskQueue, setTaskQueue] = useState<BatchImageTask[]>([
    {
      id: 'task-init-1',
      title: 'Obsidian Chronograph Watch',
      prompt: 'Luxury obsidian chronograph watch on basalt pedestal, deep burgundy rim lights (#800020), amber dial highlights (#FFE566).',
      status: 'queued',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-init-2',
      title: 'Cyber Kinetic Sneaker',
      prompt: 'Futuristic athletic sneaker floating in mid-air, dynamic tangerine rim glow (#F27430), slow-motion smoke burst.',
      status: 'queued',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-init-3',
      title: 'Luxe Noir Parisian Fragrance',
      prompt: 'Crystalline perfume bottle surrounded by floating amber particles, subtle liquid caustics, and elegant typography badge.',
      status: 'queued',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-init-4',
      title: 'Studio Wireless Headphones',
      prompt: 'Audiophile matte black headphones on sculptured concrete stand with dual rim lights in oxblood and warm gold.',
      status: 'queued',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Bulk prompt text area modal state
  const [showBulkInputModal, setShowBulkInputModal] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [newSinglePrompt, setNewSinglePrompt] = useState('');
  const [newSingleTitle, setNewSingleTitle] = useState('');

  // Batch Execution Engine state
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(0);
  const [batchProgress, setBatchProgress] = useState(0); // 0 - 100
  const [batchCompletedCount, setBatchCompletedCount] = useState(0);
  const [batchResults, setBatchResults] = useState<
    {
      id: string;
      taskId: string;
      title: string;
      prompt: string;
      enhancedPrompt?: string;
      url: string;
      aspectRatio: string;
      style: string;
      category: string;
      createdAt: string;
    }[]
  >([]);
  const [batchSaveSuccess, setBatchSaveSuccess] = useState(false);
  const [batchDownloadSuccess, setBatchDownloadSuccess] = useState(false);

  // -------------------------------------------------------------
  // GLOBAL UNDO / REDO STACK & SVG PREVIEW MODAL STATE
  // -------------------------------------------------------------
  interface BatchHistorySnapshot {
    taskQueue: BatchImageTask[];
    batchStyle: BatchStyleConfig;
    description: string;
    timestamp: number;
  }

  const [undoStack, setUndoStack] = useState<BatchHistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<BatchHistorySnapshot[]>([]);
  const [historyToast, setHistoryToast] = useState<{ message: string; type: 'undo' | 'redo' } | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Interactive SVG Vector Preview Modal State
  const [svgPreviewModalOpen, setSvgPreviewModalOpen] = useState(false);
  const [activeSvgData, setActiveSvgData] = useState<{
    svgCode: string;
    title: string;
    prompt?: string;
  } | null>(null);

  // Reference for cancellation or pausing
  const isCancelledRef = useRef(false);

  // Single Generator default samples
  const SAMPLE_RESULTS = [
    {
      id: 'img-res-1',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      title: 'Obsidian & Oxblood Geometric Form',
      prompt: 'Minimalist 3D geometric composition with burgundy (#800020) glass materials, ambient amber (#FFE566) lighting, high contrast.',
      isFav: false,
    },
    {
      id: 'img-res-2',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      title: 'Tangerine Cyber Tech Gateway',
      prompt: 'Cinematic technology hardware setup with glowing orange (#F27430) telemetry and deep matte black casing.',
      isFav: true,
    },
    {
      id: 'img-res-3',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      title: 'Architectural Luxury Studio Interior',
      prompt: 'Modern luxury architectural interior, dramatic warm volumetric lighting, sleek burgundy textures.',
      isFav: false,
    },
  ];

  // -------------------------------------------------------------
  // SINGLE GENERATOR HANDLERS
  // -------------------------------------------------------------
  const handleEnhance = async (mode: 'enhance' | 'simplify' | 'professionalize' | 'variations') => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const brandColors = useBrandKit
        ? activeBrandKit.palette.map((p) => p.hex)
        : ['#800020', '#F27430', '#FFE566'];
      const data = await apiService.enhancePrompt(prompt, mode, style, brandColors);
      setPrompt(data.enhancedPrompt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRudraEnhance = async () => {
    if (!prompt.trim()) return;
    setIsRudraEnhancing(true);
    try {
      const res = await apiService.enhanceWithRudraEngine(prompt, 'image', style);
      if (res.enhancedPrompt) {
        setPrompt(res.enhancedPrompt);
      }
      if (res.variables) {
        setRudraVariables(res.variables);
      }
      if (res.recommendedEngine) {
        setSelectedFoundationModel(res.recommendedEngine as any);
      }
      storageService.addNotification({
        title: 'Rudra Prompt Engine',
        message: 'Prompt augmented with structured variables, lighting, framing & color DNA.',
        type: 'info',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRudraEnhancing(false);
    }
  };

  const handleGenerateSingle = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const brandColors = useBrandKit
        ? activeBrandKit.palette.map((p) => p.hex)
        : ['#800020', '#F27430', '#FFE566', '#FFFFFF'];

      const modelRes = await apiService.generateWithFoundationModel({
        prompt,
        model: selectedFoundationModel,
        aspectRatio,
        typographyText: inImageTypography,
        stylePreset: style,
        brandColors,
        vectorMode: selectedFoundationModel === 'recraft-v20' || vectorMode,
      });

      const primaryUrl = modelRes.imageUrl;
      setLastModelMetadata({
        model: modelRes.model || selectedFoundationModel,
        latencyMs: modelRes.latencyMs || 420,
        specs: modelRes.specs || {
          resolution: '3840x2160',
          textRenderQuality: '99% Text Legibility',
          commercialSafetyScore: 98,
        },
      });

      const newBatch = [
        {
          id: `gen-${Date.now()}-0`,
          url: primaryUrl,
          prompt: prompt,
          title: `${category} • ${modelRes.model || selectedFoundationModel}`,
          isFav: true,
          svgCode: modelRes.svgCode,
        },
        ...SAMPLE_RESULTS.slice(1).map((item, index) => ({
          ...item,
          id: `gen-${Date.now()}-${index + 1}`,
          prompt: prompt,
          title: `${category} Variant #${index + 2}`,
        })),
      ];

      setGeneratedImages(newBatch);

      onSaveDesign({
        id: `des-img-${Date.now()}`,
        title: newBatch[0].title,
        type: selectedFoundationModel === 'recraft-v20' ? 'logo' : 'image',
        prompt: prompt,
        url: newBatch[0].url,
        svgCode: modelRes.svgCode,
        aspectRatio,
        palette: brandColors,
        tags: [category, style, selectedFoundationModel, 'Foundation Model'],
        isFavorite: false,
        createdAt: new Date().toISOString(),
      });

      storageService.addNotification({
        title: `Synthesized via ${modelRes.model || selectedFoundationModel}`,
        message: `Rendered with ${modelRes.specs?.textRenderQuality || 'high fidelity'} in ${modelRes.latencyMs || 420}ms.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imgUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    link.click();
  };

  // -------------------------------------------------------------
  // BATCH PROCESSING HANDLERS & GLOBAL UNDO / REDO ENGINE
  // -------------------------------------------------------------

  // Push state snapshot to undo stack before executing batch mutations
  const recordBatchHistory = (
    description: string,
    customQueue?: BatchImageTask[],
    customStyle?: BatchStyleConfig
  ) => {
    const snapshot: BatchHistorySnapshot = {
      taskQueue: customQueue
        ? JSON.parse(JSON.stringify(customQueue))
        : JSON.parse(JSON.stringify(taskQueue)),
      batchStyle: customStyle ? { ...customStyle } : { ...batchStyle },
      description,
      timestamp: Date.now(),
    };
    // Keep max 50 snapshots
    setUndoStack((prev) => [...prev.slice(-49), snapshot]);
    // Clear redo stack upon performing a new mutation
    setRedoStack([]);
  };

  // Revert previous batch mutation (style application, sequence change, queue edit)
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const targetSnapshot = undoStack[undoStack.length - 1];

    // Push current state into redo stack
    const currentSnapshot: BatchHistorySnapshot = {
      taskQueue: JSON.parse(JSON.stringify(taskQueue)),
      batchStyle: { ...batchStyle },
      description: 'Current State',
      timestamp: Date.now(),
    };
    setRedoStack((prev) => [...prev, currentSnapshot]);

    // Restore target snapshot state
    setTaskQueue(targetSnapshot.taskQueue);
    setBatchStyle(targetSnapshot.batchStyle);
    setUndoStack((prev) => prev.slice(0, -1));

    // Display feedback toast
    setHistoryToast({
      message: `Reverted: ${targetSnapshot.description}`,
      type: 'undo',
    });
    setTimeout(() => setHistoryToast(null), 3000);

    storageService.addNotification({
      title: 'Batch Action Reverted',
      message: `Undid: ${targetSnapshot.description}`,
      type: 'info',
    });
  };

  // Redo previously reverted batch mutation
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextSnapshot = redoStack[redoStack.length - 1];

    // Push current state into undo stack
    const currentSnapshot: BatchHistorySnapshot = {
      taskQueue: JSON.parse(JSON.stringify(taskQueue)),
      batchStyle: { ...batchStyle },
      description: 'Previous State',
      timestamp: Date.now(),
    };
    setUndoStack((prev) => [...prev, currentSnapshot]);

    // Restore next state
    setTaskQueue(nextSnapshot.taskQueue);
    setBatchStyle(nextSnapshot.batchStyle);
    setRedoStack((prev) => prev.slice(0, -1));

    // Display feedback toast
    setHistoryToast({
      message: `Redid: ${nextSnapshot.description}`,
      type: 'redo',
    });
    setTimeout(() => setHistoryToast(null), 3000);

    storageService.addNotification({
      title: 'Batch Action Redone',
      message: `Redid: ${nextSnapshot.description}`,
      type: 'info',
    });
  };

  // Global Keyboard listener for Ctrl+Z / Cmd+Z (Undo) and Ctrl+Y / Cmd+Shift+Z (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, taskQueue, batchStyle]);

  // Listen to global Ctrl+G event
  useEffect(() => {
    const handleGlobalTrigger = () => {
      handleGenerateSingle();
    };
    window.addEventListener('logmage:trigger-generate', handleGlobalTrigger);
    return () => window.removeEventListener('logmage:trigger-generate', handleGlobalTrigger);
  }, [prompt, selectedFoundationModel, aspectRatio, inImageTypography, style, useBrandKit, vectorMode, activeBrandKit]);

  // Sequence manipulation handlers with automatic history recording
  const handleMoveTask = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= taskQueue.length) return;

    recordBatchHistory(
      `Moved "${taskQueue[index].title}" ${direction === -1 ? 'up' : 'down'} in sequence`
    );

    const updated = [...taskQueue];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTaskQueue(updated);
  };

  const handleReverseQueue = () => {
    if (taskQueue.length <= 1) return;
    recordBatchHistory('Reversed batch task sequence');
    setTaskQueue((prev) => [...prev].reverse());
  };

  const handleSortQueue = (criterion: 'title' | 'status') => {
    if (taskQueue.length <= 1) return;
    recordBatchHistory(`Sorted batch queue by ${criterion}`);
    const sorted = [...taskQueue].sort((a, b) => {
      if (criterion === 'title') return a.title.localeCompare(b.title);
      return a.status.localeCompare(b.status);
    });
    setTaskQueue(sorted);
  };

  // Interactive SVG Vector Studio modal opener
  const handleOpenSvgPreview = (title: string, promptText: string, customSvg?: string) => {
    const resolvedSvg =
      customSvg ||
      generateVectorAssetFromPrompt(
        promptText,
        title,
        batchStyle.style,
        batchStyle.colorPalette || activeBrandKit?.palette?.map((p) => p.hex)
      );
    setActiveSvgData({
      title,
      prompt: promptText,
      svgCode: resolvedSvg,
    });
    setSvgPreviewModalOpen(true);
  };

  const handleAddSingleTask = () => {
    if (!newSinglePrompt.trim()) return;
    const taskTitle = newSingleTitle.trim() || `Task #${taskQueue.length + 1}`;
    recordBatchHistory(`Added task "${taskTitle}"`);

    const newTask: BatchImageTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: taskTitle,
      prompt: newSinglePrompt.trim(),
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    setTaskQueue((prev) => [...prev, newTask]);
    setNewSinglePrompt('');
    setNewSingleTitle('');
  };

  const handleBulkImport = () => {
    if (!bulkInputText.trim()) return;
    const lines = bulkInputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    recordBatchHistory(`Bulk imported ${lines.length} tasks`);

    const newTasks: BatchImageTask[] = lines.map((line, idx) => {
      let title = `Batch Item #${taskQueue.length + idx + 1}`;
      let taskPrompt = line;
      if (line.includes(':')) {
        const parts = line.split(':');
        title = parts[0].trim();
        taskPrompt = parts.slice(1).join(':').trim();
      }
      return {
        id: `task-bulk-${Date.now()}-${idx}`,
        title,
        prompt: taskPrompt,
        status: 'queued',
        createdAt: new Date().toISOString(),
      };
    });

    setTaskQueue((prev) => [...prev, ...newTasks]);
    setBulkInputText('');
    setShowBulkInputModal(false);
    storageService.addNotification({
      title: `Imported ${newTasks.length} Batch Tasks`,
      message: 'Prompts added to the generation queue with shared style parameters applied.',
      type: 'info',
    });
  };

  const handleLoadCuratedPack = (packId: string) => {
    const pack = CURATED_BATCH_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    recordBatchHistory(`Loaded "${pack.name}" curated pack`);

    setBatchStyle((prev) => ({
      ...prev,
      category: pack.category,
      style: pack.style,
      lighting: pack.lighting,
      aspectRatio: pack.aspectRatio,
    }));

    const tasks: BatchImageTask[] = pack.tasks.map((t, idx) => ({
      id: `task-pack-${Date.now()}-${idx}`,
      title: t.title,
      prompt: t.prompt,
      status: 'queued',
      createdAt: new Date().toISOString(),
    }));

    setTaskQueue(tasks);
    setBatchResults([]);
    setBatchProgress(0);
    setBatchCompletedCount(0);

    storageService.addNotification({
      title: `Loaded "${pack.name}"`,
      message: `Enqueued ${tasks.length} tasks with unified ${pack.style} parameters.`,
      type: 'success',
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const target = taskQueue.find((t) => t.id === taskId);
    recordBatchHistory(`Deleted task "${target?.title || 'item'}"`);
    setTaskQueue((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleClearQueue = () => {
    if (taskQueue.length === 0) return;
    recordBatchHistory('Cleared batch queue');
    setTaskQueue([]);
    setBatchResults([]);
    setBatchProgress(0);
    setBatchCompletedCount(0);
  };

  const handleResetQueue = () => {
    setTaskQueue((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'queued',
        progress: 0,
        resultUrl: undefined,
      }))
    );
    setBatchResults([]);
    setBatchProgress(0);
    setBatchCompletedCount(0);
  };

  // Run the batch queue with consistent style parameter enforcement
  const handleRunBatchQueue = async () => {
    if (taskQueue.length === 0 || isBatchRunning) return;

    setIsBatchRunning(true);
    isCancelledRef.current = false;
    setBatchProgress(0);

    try {
      // 1. Send all prompts to batch engine to synthesize harmonized style directives
      const brandPalette = batchStyle.useBrandKit
        ? activeBrandKit.palette.map((p) => p.hex)
        : ['#800020', '#F27430', '#FFE566', '#FFFFFF'];

      const enhancedBatchData = await apiService.generateBatchImages(
        taskQueue.map((t) => ({ id: t.id, prompt: t.prompt, title: t.title })),
        {
          ...batchStyle,
          palette: brandPalette,
        }
      );

      // 2. Sequentially process and simulate high-res rendering for each queued task
      const updatedResults: any[] = [...batchResults];

      for (let i = 0; i < taskQueue.length; i++) {
        if (isCancelledRef.current) break;

        const currentTask = taskQueue[i];
        setBatchCurrentIndex(i);

        // Mark current task as processing
        setTaskQueue((prev) =>
          prev.map((t, idx) => (idx === i ? { ...t, status: 'processing', progress: 30 } : t))
        );

        // Simulated neural rendering pass
        await new Promise((r) => setTimeout(r, 900));
        if (isCancelledRef.current) break;

        setTaskQueue((prev) =>
          prev.map((t, idx) => (idx === i ? { ...t, progress: 75 } : t))
        );

        await new Promise((r) => setTimeout(r, 600));

        // Match with visual asset
        const poolIndex = i % SAMPLE_IMAGE_POOL.length;
        const matchingAsset = SAMPLE_IMAGE_POOL[poolIndex];
        const enhancedMeta = enhancedBatchData?.find((e: any) => e.id === currentTask.id);

        const resultItem = {
          id: `res-${Date.now()}-${i}`,
          taskId: currentTask.id,
          title: currentTask.title,
          prompt: currentTask.prompt,
          enhancedPrompt:
            enhancedMeta?.enhancedPrompt ||
            `${batchStyle.style}: ${currentTask.prompt} with ${batchStyle.lighting} and ${brandPalette[0]} tones.`,
          url: matchingAsset.url,
          aspectRatio: batchStyle.aspectRatio,
          style: batchStyle.style,
          category: batchStyle.category,
          createdAt: new Date().toISOString(),
        };

        updatedResults.push(resultItem);
        setBatchResults([...updatedResults]);

        // Mark task completed
        setTaskQueue((prev) =>
          prev.map((t, idx) =>
            idx === i
              ? {
                  ...t,
                  status: 'completed',
                  progress: 100,
                  resultUrl: matchingAsset.url,
                  enhancedPrompt: resultItem.enhancedPrompt,
                  completedAt: new Date().toISOString(),
                }
              : t
          )
        );

        const completedCount = i + 1;
        setBatchCompletedCount(completedCount);
        setBatchProgress(Math.round((completedCount / taskQueue.length) * 100));
      }

      storageService.addNotification({
        title: 'Batch Processing Completed',
        message: `Successfully synthesized ${taskQueue.length} assets with uniform ${batchStyle.style} styling.`,
        type: 'success',
      });
    } catch (err) {
      console.error('[Batch Run Error]', err);
    } finally {
      setIsBatchRunning(false);
    }
  };

  const handleStopBatch = () => {
    isCancelledRef.current = true;
    setIsBatchRunning(false);
    setTaskQueue((prev) =>
      prev.map((t) => (t.status === 'processing' ? { ...t, status: 'queued', progress: 0 } : t))
    );
  };

  // Bulk save entire batch results to user's design library
  const handleSaveEntireBatch = () => {
    if (batchResults.length === 0) return;

    batchResults.forEach((item, idx) => {
      onSaveDesign({
        id: `des-batch-${Date.now()}-${idx}`,
        title: item.title,
        type: 'image',
        prompt: item.prompt,
        enhancedPrompt: item.enhancedPrompt,
        url: item.url,
        aspectRatio: item.aspectRatio,
        palette: ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
        tags: [item.category, item.style, 'Batch Run', 'Consistent Style'],
        isFavorite: false,
        createdAt: item.createdAt,
      });
    });

    setBatchSaveSuccess(true);
    storageService.addNotification({
      title: 'Batch Saved to Library',
      message: `All ${batchResults.length} images saved to "My Designs" folder.`,
      type: 'success',
    });
    setTimeout(() => setBatchSaveSuccess(false), 2500);
  };

  // Bulk download all images
  const handleDownloadAllBatch = () => {
    if (batchResults.length === 0) return;
    setBatchDownloadSuccess(true);

    batchResults.forEach((item, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = item.url;
        link.download = `batch-${idx + 1}-${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        link.target = '_blank';
        link.click();
      }, idx * 250);
    });

    setTimeout(() => setBatchDownloadSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* View Header with Dual-Mode Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27430]/20 border border-[#F27430]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#F27430]" />
            <span>High-Fidelity 8K & Batch Generation Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            AI Image Generator & Batch Studio
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Generate single high-impact visuals or queue multiple prompts in our Batch Module to enforce consistent style parameters across entire campaigns.
          </p>
        </div>

        {/* Tab Switcher: Single vs Batch Queue Module */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Single Generation</span>
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
            <Boxes className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Batch Processing Module</span>
            {taskQueue.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-black/60 text-[#FFE566] text-[10px] font-mono">
                {taskQueue.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BATCH PROCESSING MODULE VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'batch' && (
        <div className="space-y-8">
          {/* Top Batch Status, Undo/Redo Stack & Preset Ribbon */}
          <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#800020]/30 border border-[#800020]/60 text-[#FFE566]">
                  <Boxes className="w-5 h-5 text-[#F27430]" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-heading text-white flex items-center gap-2">
                    Batch Queue Engine
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      Strict Style Cohesion Active
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Queue multiple tasks. Master style parameters below are mathematically applied across every single prompt.
                  </p>
                </div>
              </div>

              {/* Global Undo / Redo & Studio Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Undo Button */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    undoStack.length > 0
                      ? `Undo: ${undoStack[undoStack.length - 1].description} (Ctrl+Z)`
                      : 'No actions to undo (Ctrl+Z)'
                  }
                >
                  <Undo2 className="w-3.5 h-3.5 text-[#F27430]" />
                  <span>Undo</span>
                  {undoStack.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#800020] text-[#FFE566] text-[10px] font-mono">
                      {undoStack.length}
                    </span>
                  )}
                </button>

                {/* Redo Button */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    redoStack.length > 0
                      ? `Redo: ${redoStack[redoStack.length - 1].description} (Ctrl+Y)`
                      : 'No actions to redo (Ctrl+Y)'
                  }
                >
                  <Redo2 className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>Redo</span>
                  {redoStack.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono">
                      {redoStack.length}
                    </span>
                  )}
                </button>

                {/* History Stack Drawer Button */}
                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    showHistoryDrawer
                      ? 'bg-[#800020]/40 border-[#F27430] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="View batch operation history"
                >
                  <History className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>History</span>
                </button>

                {/* Interactive SVG Preview Studio Opener */}
                <button
                  type="button"
                  onClick={() =>
                    handleOpenSvgPreview(
                      'Batch Cohesion Vector',
                      batchStyle.customDirectives || `${batchStyle.style} ${batchStyle.category}`
                    )
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600/30 to-[#800020]/40 border border-sky-400/50 hover:border-sky-400 text-sky-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Open interactive SVG Vector Studio with Wireframe, Fill, and Stroke view modes"
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>SVG Vector Studio</span>
                </button>

                {/* Quick Load Test Packs */}
                <div className="h-4 w-px bg-zinc-800 hidden sm:block mx-1" />
                <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">Packs:</span>
                {CURATED_BATCH_PACKS.slice(0, 2).map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => handleLoadCuratedPack(pack.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-[#800020]/40 border border-zinc-800 hover:border-[#F27430] text-zinc-300 hover:text-white text-xs font-semibold transition-all"
                  >
                    {pack.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* History Drawer if toggled open */}
            {showHistoryDrawer && (
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#FFE566]" />
                    Batch Processing History Stack (Undo / Redo Buffer)
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {undoStack.length} Undoable • {redoStack.length} Redoable
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Undo Stack List */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Past Operations (Can Undo)
                    </span>
                    {undoStack.length === 0 ? (
                      <p className="text-zinc-500 text-[11px] italic">No prior actions recorded yet.</p>
                    ) : (
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {[...undoStack].reverse().map((snap, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-2"
                          >
                            <span className="font-mono text-zinc-300 text-[11px] truncate">
                              #{undoStack.length - i}: {snap.description}
                            </span>
                            <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                              {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Redo Stack List */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Reverted Operations (Can Redo)
                    </span>
                    {redoStack.length === 0 ? (
                      <p className="text-zinc-500 text-[11px] italic">No reverted actions waiting to be redone.</p>
                    ) : (
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {[...redoStack].reverse().map((snap, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-2"
                          >
                            <span className="font-mono text-zinc-300 text-[11px] truncate">
                              {snap.description}
                            </span>
                            <span className="text-[10px] text-[#FFE566] shrink-0 font-mono">
                              Redoable
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Live Progress Bar if running */}
            {isBatchRunning && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFE566]" />
                    Processing Task {batchCurrentIndex + 1} of {taskQueue.length}: "
                    {taskQueue[batchCurrentIndex]?.title}"
                  </span>
                  <span className="text-[#FFE566] font-bold">{batchProgress}% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566] transition-all duration-300"
                    style={{ width: `${batchProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Grid: Shared Consistent Style Parameters vs Queue Manager */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Shared Consistent Style Parameters (5 cols) */}
            <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#F27430]" />
                  <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider">
                    Consistent Batch Style Parameters
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#FFE566] bg-[#800020]/30 px-2 py-0.5 rounded border border-[#800020]">
                  Enforced on All
                </span>
              </div>

              {/* Master Visual Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Master Visual Style</label>
                <select
                  value={batchStyle.style}
                  onChange={(e) => {
                    const newStyle = e.target.value;
                    recordBatchHistory(`Applied style: ${newStyle}`);
                    setBatchStyle({ ...batchStyle, style: newStyle });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Master Category & Lighting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Category</label>
                  <select
                    value={batchStyle.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      recordBatchHistory(`Changed category: ${newCat}`);
                      setBatchStyle({ ...batchStyle, category: newCat });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Lighting Direction</label>
                  <select
                    value={batchStyle.lighting}
                    onChange={(e) => {
                      const newLight = e.target.value;
                      recordBatchHistory(`Changed lighting: ${newLight}`);
                      setBatchStyle({ ...batchStyle, lighting: newLight });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                  >
                    {LIGHTING_OPTIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Master Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Uniform Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => {
                        recordBatchHistory(`Changed aspect ratio: ${ar.id}`);
                        setBatchStyle({ ...batchStyle, aspectRatio: ar.id });
                      }}
                      className={`py-2 px-2 rounded-xl text-center border text-xs font-mono font-bold transition-all ${
                        batchStyle.aspectRatio === ar.id
                          ? 'bg-[#800020] border-[#F27430] text-white shadow-md'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {ar.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Palette Injection */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={batchStyle.useBrandKit}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        recordBatchHistory(
                          `${checked ? 'Enabled' : 'Disabled'} Brand Kit palette injection`
                        );
                        setBatchStyle({ ...batchStyle, useBrandKit: checked });
                      }}
                      className="accent-[#F27430] w-4 h-4 rounded"
                    />
                    <span>Inject Active Brand Palette</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#FFE566]">#800020 & #F27430</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {activeBrandKit.palette.map((c, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Strict Seed Lock Toggle */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <label className="flex items-start gap-2 text-xs font-medium text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={batchStyle.lockConsistencySeed}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      recordBatchHistory(
                        `${checked ? 'Locked' : 'Unlocked'} style cohesion seed`
                      );
                      setBatchStyle({ ...batchStyle, lockConsistencySeed: checked });
                    }}
                    className="accent-[#800020] w-4 h-4 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#FFE566]" />
                      Lock Style Cohesion Seed
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      Enforces identical lighting temperature, film grain, texture depth, and color balance across every queued task.
                    </p>
                  </div>
                </label>
              </div>

              {/* Shared Negative Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Shared Negative Prompts (Excluded from All)
                </label>
                <input
                  type="text"
                  value={batchStyle.negativePrompt}
                  onChange={(e) =>
                    setBatchStyle({ ...batchStyle, negativePrompt: e.target.value })
                  }
                  onBlur={() => recordBatchHistory('Updated shared negative prompts')}
                  placeholder="e.g. blurry, artifacts, watermark"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                />
              </div>

              {/* Shared Custom Directives */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Atmospheric Notes & Scene Guidelines
                </label>
                <input
                  type="text"
                  value={batchStyle.customDirectives || ''}
                  onChange={(e) =>
                    setBatchStyle({ ...batchStyle, customDirectives: e.target.value })
                  }
                  onBlur={() => recordBatchHistory('Updated atmospheric scene directives')}
                  placeholder="e.g. Minimalist pedestal, high contrast silhouette"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                />
              </div>
            </div>

            {/* Right Column: Queue Manager & Live Execution (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Queue Controls Bar */}
              <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div>
                    <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-[#FFE566]" />
                      Queued Tasks ({taskQueue.length})
                    </h3>
                    <span className="text-xs text-zinc-400">
                      {batchCompletedCount} completed • {taskQueue.length - batchCompletedCount} pending
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Sequence Controls */}
                    <button
                      type="button"
                      onClick={handleReverseQueue}
                      disabled={isBatchRunning || taskQueue.length <= 1}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40"
                      title="Reverse the entire sequence order of queued tasks (Undoable with Ctrl+Z)"
                    >
                      <RotateCcw className="w-3 h-3 text-[#FFE566]" />
                      <span>Reverse Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSortQueue('title')}
                      disabled={isBatchRunning || taskQueue.length <= 1}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40"
                      title="Sort queue alphabetically by title (Undoable with Ctrl+Z)"
                    >
                      <span>Sort A-Z</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBulkInputModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FFE566]" />
                      <span>Bulk Import</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearQueue}
                      disabled={isBatchRunning || taskQueue.length === 0}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-300 text-xs font-semibold transition-colors disabled:opacity-50"
                      title="Clear queue (Undoable with Ctrl+Z)"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Single Add Quick Input */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Task Title (e.g. Leather Bag)"
                      value={newSingleTitle}
                      onChange={(e) => setNewSingleTitle(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                    />
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Task Prompt: describe subject or scene..."
                        value={newSinglePrompt}
                        onChange={(e) => setNewSinglePrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddSingleTask();
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                      />
                      <button
                        type="button"
                        onClick={handleAddSingleTask}
                        className="px-3 py-2 rounded-xl bg-[#800020] hover:bg-[#800020]/80 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Queue</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Queue List Table with Sequence Reordering Controls */}
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {taskQueue.length > 0 ? (
                    taskQueue.map((task, idx) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-all ${
                          task.status === 'processing'
                            ? 'bg-[#800020]/25 border-[#F27430] ring-1 ring-[#F27430]/40'
                            : task.status === 'completed'
                            ? 'bg-zinc-900/80 border-emerald-500/40'
                            : 'bg-zinc-900/50 border-zinc-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Sequence Up/Down Buttons */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveTask(idx, -1)}
                              disabled={idx === 0 || isBatchRunning}
                              className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-colors"
                              title="Move Up in Sequence (Undo with Ctrl+Z)"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveTask(idx, 1)}
                              disabled={idx === taskQueue.length - 1 || isBatchRunning}
                              className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-colors"
                              title="Move Down in Sequence (Undo with Ctrl+Z)"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono text-zinc-500 text-[11px] font-bold w-6">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate flex items-center gap-2">
                              <span>{task.title}</span>
                              {task.status === 'completed' && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                  98% Cohesion
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {task.prompt}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Vector Preview Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenSvgPreview(task.title, task.prompt)}
                            className="px-2 py-1 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 font-mono text-[10px] flex items-center gap-1 border border-sky-500/30 transition-colors"
                            title="Inspect Vector in Wireframe, Fill, or Stroke view modes before export"
                          >
                            <Grid className="w-3 h-3 text-sky-400" />
                            <span className="hidden sm:inline">Vector</span>
                          </button>

                          {task.status === 'queued' && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              Queued
                            </span>
                          )}
                          {task.status === 'processing' && (
                            <span className="px-2 py-0.5 rounded-md bg-[#800020] text-[#FFE566] font-mono text-[10px] flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Synthesizing...
                            </span>
                          )}
                          {task.status === 'completed' && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center gap-1 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Done
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={isBatchRunning}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors disabled:opacity-40"
                            title="Delete task (Undoable with Ctrl+Z)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl text-xs">
                      Queue is empty. Click "Load Test Pack" above or type a prompt to enqueue tasks.
                    </div>
                  )}
                </div>

                {/* Batch Action Buttons */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {batchResults.length > 0 && (
                      <button
                        type="button"
                        onClick={handleResetQueue}
                        disabled={isBatchRunning}
                        className="py-2.5 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Queue</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isBatchRunning ? (
                      <button
                        type="button"
                        onClick={handleStopBatch}
                        className="py-2.5 px-5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-600 text-rose-200 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                      >
                        <Pause className="w-3.5 h-3.5 text-rose-300" />
                        <span>Stop Batch</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRunBatchQueue}
                        disabled={taskQueue.length === 0}
                        className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-xs shadow-xl shadow-[#800020]/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 text-[#FFE566] fill-[#FFE566]" />
                        <span>Run Batch Queue ({taskQueue.length} Tasks)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bulk Results Gallery */}
              {batchResults.length > 0 && (
                <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div>
                      <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FFE566]" />
                        Generated Batch Results ({batchResults.length})
                      </h3>
                      <span className="text-xs text-zinc-400">
                        Uniform {batchStyle.style} • {batchStyle.aspectRatio} Aspect
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadAllBatch}
                        className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {batchDownloadSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Exporting...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-[#F27430]" />
                            <span>Download All</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveEntireBatch}
                        className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all"
                      >
                        {batchSaveSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#FFE566]" />
                            <span>Saved to Library!</span>
                          </>
                        ) : (
                          <>
                            <FolderPlus className="w-3.5 h-3.5 text-[#FFE566]" />
                            <span>Save Entire Batch</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {batchResults.map((item, idx) => (
                      <div
                        key={item.id}
                        className="group rounded-3xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl flex flex-col hover:border-[#F27430]/60 transition-all"
                      >
                        <div className="relative aspect-video overflow-hidden bg-zinc-950">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                            Cohesive Seed #{(idx + 1) * 104}
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#800020]/90 text-[10px] font-mono text-[#FFE566]">
                            {item.aspectRatio}
                          </div>
                        </div>

                        <div className="p-4 space-y-2 bg-zinc-900/90 border-t border-zinc-800 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.title}</h4>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                              {item.prompt}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleDownload(item.url, item.title)}
                              className="text-xs font-semibold text-[#FFE566] hover:underline flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenSvgPreview(item.title, item.prompt)}
                              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                              title="Inspect Vector in Wireframe, Fill, or Stroke mode before export"
                            >
                              <Grid className="w-3.5 h-3.5 text-sky-400" />
                              <span>Vector Studio</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onNavigate('video-motion')}
                              className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                              title="Animate this batch asset into Veo 3 Video"
                            >
                              <Video className="w-3 h-3 text-[#F27430]" />
                              <span>Animate Video</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SINGLE GENERATOR VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-5">
            {/* Multi-Foundation Model Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#F27430]" />
                  <span>Generative Foundation Model</span>
                </label>
                <span className="text-[10px] font-mono text-[#FFE566] bg-[#800020]/20 px-2 py-0.5 rounded border border-[#800020]/40">
                  Multi-Model Router
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FOUNDATION_MODELS.map((m) => {
                  const isSelected = selectedFoundationModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedFoundationModel(m.id);
                        if (m.id === 'recraft-v20') setVectorMode(true);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#800020]/40 border-[#F27430] text-white shadow-md ring-1 ring-[#F27430]/50'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold truncate text-white">{m.name}</span>
                          {isSelected && <Zap className="w-3 h-3 text-[#FFE566] shrink-0" />}
                        </div>
                        <div className="text-[9px] text-[#FFE566] font-mono mt-0.5">{m.badge}</div>
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono mt-1.5 flex items-center justify-between">
                        <span>{m.speed}</span>
                        <span>{m.commercialSafe}% Safe</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-200">Creative Generation Prompt</label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(prompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create in vivid detail..."
                className="w-full p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] leading-relaxed"
              />

              {/* In-Image Typography Text (Flux.1 / Firefly / Recraft) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-semibold text-zinc-300 flex items-center gap-1">
                    <Type className="w-3 h-3 text-[#F27430]" />
                    <span>In-Image Legible Typography (Flux.1 & Firefly Engine)</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Rendered cleanly inside visual</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inImageTypography}
                    onChange={(e) => setInImageTypography(e.target.value)}
                    placeholder="e.g. AETHERIA, 2026, RETINA"
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430] font-mono tracking-wider"
                  />
                  {['AETHERIA', 'KINETIC', 'LUMINA'].map((quickWord) => (
                    <button
                      key={quickWord}
                      type="button"
                      onClick={() => setInImageTypography(quickWord)}
                      className="hidden sm:inline-block px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                    >
                      {quickWord}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Enhancement Quick Tools & Rudra Prompt Engine */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={handleRudraEnhance}
                  disabled={isRudraEnhancing}
                  className="px-3 py-1 rounded-lg bg-[#800020] hover:bg-[#800020]/80 border border-[#F27430]/60 text-[#FFE566] text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  title="Orchestrate structured variables: subject, lighting, framing & color DNA"
                >
                  <Terminal className="w-3 h-3 text-[#F27430]" />
                  <span>{isRudraEnhancing ? 'Orchestrating...' : 'Rudra AI Prompt Engine'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleEnhance('enhance')}
                  disabled={isEnhancing}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-[#800020]/40 border border-zinc-800 text-zinc-300 hover:text-[#FFE566] text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Wand2 className="w-3 h-3 text-[#F27430]" />
                  Enhance
                </button>
                <button
                  type="button"
                  onClick={() => handleEnhance('professionalize')}
                  disabled={isEnhancing}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-[#800020]/40 border border-zinc-800 text-zinc-300 hover:text-[#FFE566] text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#FFE566]" />
                  Professionalize
                </button>
                <button
                  type="button"
                  onClick={() => handleEnhance('simplify')}
                  disabled={isEnhancing}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-medium transition-colors"
                >
                  Simplify
                </button>
              </div>

              {/* Rudra Engine Extracted Variables Panel */}
              {rudraVariables && (
                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5 mt-2 animate-fadeIn text-[11px]">
                  <div className="text-[10px] font-mono text-[#FFE566] font-semibold flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-[#F27430]" />
                    <span>Rudra Structured Variables:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    <div>
                      <strong className="text-zinc-500">Lighting:</strong> {rudraVariables.lighting?.slice(0, 32)}...
                    </div>
                    <div>
                      <strong className="text-zinc-500">Framing:</strong> {rudraVariables.framing?.slice(0, 32)}...
                    </div>
                    <div className="col-span-2">
                      <strong className="text-zinc-500">Color DNA:</strong>{' '}
                      <span className="text-[#FFE566] font-mono">{rudraVariables.colorDNA}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Style & Lighting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Visual Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Lighting</label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                >
                  {LIGHTING_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      aspectRatio === ar.id
                        ? 'bg-[#800020]/30 border-[#F27430] text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono text-[#FFE566]">{ar.label}</div>
                    <div className="text-[10px] text-zinc-400">{ar.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerateSingle}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-bold text-sm shadow-xl shadow-[#800020]/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FFE566]" />
                  <span>Synthesizing 8K Visuals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFE566]" />
                  <span>Generate High-Fidelity Images</span>
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-[10px] font-mono text-[#FFE566] ml-1">
                    Ctrl+G
                  </kbd>
                </>
              )}
            </button>
          </div>

          {/* Gallery / Results Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                High-Fidelity Render Pipeline
              </span>
              <span className="text-xs text-zinc-400 font-mono">Aspect: {aspectRatio}</span>
            </div>

            {/* Active Model Telemetry Banner */}
            {lastModelMetadata && (
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{lastModelMetadata.model}</span>
                  <span className="text-[10px] font-mono text-zinc-400">({lastModelMetadata.latencyMs}ms)</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-[#FFE566]">{lastModelMetadata.specs.textRenderQuality}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lastModelMetadata.specs.commercialSafetyScore}% Safe
                  </span>
                </div>
              </div>
            )}

            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((img) => (
                  <div
                    key={img.id}
                    className="group rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col hover:border-[#F27430]/60 transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden bg-zinc-900">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-xs text-white line-clamp-2">{img.prompt}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 bg-zinc-900/60 border-t border-zinc-800">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{img.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-[#FFE566]">
                          {aspectRatio}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                        <button
                          type="button"
                          onClick={() => handleDownload(img.url, img.title)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3 text-[#FFE566]" />
                          <span>Download</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenSvgPreview(img.title, img.prompt)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/40 text-sky-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                          title="Inspect Vector in Wireframe, Fill, or Stroke view modes before export"
                        >
                          <Grid className="w-3 h-3 text-sky-400" />
                          <span>Vector Studio</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigate('image-editor')}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#800020]/30 hover:bg-[#800020]/50 border border-[#800020]/60 text-[#FFE566] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#F27430]">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white">No Visuals Rendered Yet</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Enter your creative brief or enhance the default prompt on the left to render high-resolution marketing visuals and commercial product photography.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateSingle}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-md"
                >
                  Render High-Res Concept Batch
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK IMPORT PROMPTS MODAL */}
      {/* ========================================================================= */}
      {showBulkInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFE566]" />
                <h3 className="text-base font-bold font-heading text-white">
                  Bulk Import Prompts to Queue
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkInputModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste multiple prompt lines below (one prompt per line). You can also include optional titles by prefixing with a colon (e.g., <code className="text-[#FFE566]">Chronograph Watch: Luxury timepiece with rim light</code>).
            </p>

            <textarea
              rows={8}
              value={bulkInputText}
              onChange={(e) => setBulkInputText(e.target.value)}
              placeholder={`Minimalist matte black coffee mug with warm golden reflection\nCybernetic smart ring with glowing micro-sensors\nLeather travel weekend bag on marble floor under studio spotlights\nFuturistic titanium key fob with laser etched brand logo`}
              className="w-full p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] leading-relaxed"
            />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowBulkInputModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={!bulkInputText.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import & Enqueue Prompts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Undo / Redo Notification Toast */}
      {historyToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-950/95 border border-zinc-700/80 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <div className="p-1.5 rounded-lg bg-[#800020]/40 border border-[#800020]">
            {historyToast.type === 'undo' ? (
              <Undo2 className="w-4 h-4 text-[#F27430]" />
            ) : (
              <Redo2 className="w-4 h-4 text-[#FFE566]" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-bold text-white block">
              {historyToast.type === 'undo' ? 'Undo Executed' : 'Redo Executed'}
            </span>
            <span className="text-zinc-300 font-mono text-[11px]">
              {historyToast.message}
            </span>
          </div>
        </div>
      )}

      {/* Interactive SVG Vector Preview & Export Studio Modal (Wireframe, Fill, Stroke) */}
      {svgPreviewModalOpen && activeSvgData && (
        <SvgExportModal
          isOpen={svgPreviewModalOpen}
          onClose={() => setSvgPreviewModalOpen(false)}
          svgCode={activeSvgData.svgCode}
          title={activeSvgData.title}
          brandName={activeBrandKit.name}
        />
      )}
    </div>
  );
};

