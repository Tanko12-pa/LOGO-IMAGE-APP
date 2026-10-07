export type NavView =
  | 'dashboard'
  | 'logo-generator'
  | 'image-generator'
  | 'computer-vision'
  | 'a2a-judge'
  | 'brand-studio'
  | 'image-editor'
  | 'video-motion'
  | 'templates'
  | 'projects'
  | 'my-designs'
  | 'favorites'
  | 'history'
  | 'billing'
  | 'admin'
  | 'settings'
  | 'feedback'
  | 'landing';

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface BrandKit {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  mission?: string;
  palette: ColorSwatch[];
  typography: {
    headingFont: string;
    bodyFont: string;
    displayStyle?: string;
    recommendations?: string;
  };
  primaryLogoSvg?: string;
  secondaryLogoSvg?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface LogoConcept {
  id: string;
  title: string;
  style: string;
  svgCode: string;
  previewUrl?: string;
  symbolType: string;
  palette: string[];
  checklist: {
    readable: boolean;
    balanced: boolean;
    simple: boolean;
    scalable: boolean;
    worksOnDark: boolean;
    worksOnLight: boolean;
  };
  rating: number;
}

export interface DesignItem {
  id: string;
  title: string;
  type: 'logo' | 'image' | 'brand_kit' | 'social' | 'product' | 'banner' | 'video';
  prompt: string;
  enhancedPrompt?: string;
  url: string;
  svgCode?: string;
  aspectRatio: string;
  dimensions?: string;
  palette: string[];
  tags: string[];
  isFavorite: boolean;
  projectId?: string;
  createdAt: string;
  checklist?: LogoConcept['checklist'];
  metadata?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  brandKitId?: string;
  itemsCount: number;
  itemIds: string[];
  isArchived: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  category: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] (0-1000)
  dominantColor: string;
  metadata: string;
}

export interface VisionAnalysisResult {
  summary: string;
  dominantPalette: string[];
  detectedObjects: DetectedObject[];
  extractedPrompts: {
    logoPrompt: string;
    imagePrompt: string;
    variations: string[];
  };
  arOverlayInfo: {
    brandSuggestion: string;
    recommendedStyle: string;
    designScores: {
      simplicity: number;
      brandability: number;
      scalability: number;
    };
  };
}

export interface A2AJudgeResult {
  creatorDraft: string;
  judgeAudit: {
    score: number;
    breakdown: {
      contrastScore: number;
      scalabilityScore: number;
      originalityScore: number;
      brandFidelity: number;
    };
    detectedIssues: string[];
    selfHealingActions: string[];
  };
  finalApprovedPrompt: string;
  technicalSpecs: {
    recommendedPalette: string[];
    vectorGeometry: string;
    recommendedAspectRatio: string;
  };
}

export type FoundationModelId =
  | 'flux-1'
  | 'midjourney-v6'
  | 'stability-ultra'
  | 'stability-core'
  | 'firefly-v3'
  | 'recraft-v20'
  | 'gemini-3.1-flash-image-preview';

export type VectorEngineId = 'recraft-vector' | 'vectorizer-ai' | 'firefly-svg';

export type AILabToolId =
  | 'photoroom-bg-remove'
  | 'photoroom-auto-shadow'
  | 'claid-upscale-4k'
  | 'claid-dpi-print'
  | 'magnific-micro-detail'
  | 'vectorizer-trace';

export interface SubscriptionInfo {
  status: 'trial' | 'active' | 'expired' | 'canceled';
  planType: 'TRIAL_7_DAYS' | 'MONTHLY_19_99' | 'YEARLY_199_99' | 'FREE';
  trialEndsAt?: string;
  renewsAt?: string;
  priceMonthly: number; // 19.99
  priceYearly: number;  // 199.99
  daysRemaining?: number;
}

export interface RudraPromptVariables {
  subject: string;
  stylePreset: string;
  lighting: string;
  framing: string;
  typographyInImage?: string;
  colorDNA: string;
  renderingEngine: string;
  negativePrompt: string;
}

export interface ModelRouteResult {
  imageUrl: string;
  svgCode?: string;
  model: string;
  engineCategory: 'foundation' | 'vector' | 'editing';
  latencyMs: number;
  specs: {
    resolution: string;
    textRenderQuality?: string;
    vectorPrecision?: string;
    commercialSafetyScore: number;
  };
  promptUsed: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'TRIAL_7_DAYS' | 'MONTHLY_19_99' | 'YEARLY_199_99';
  subscription?: SubscriptionInfo;
  creditsRemaining: number;
  creditsUsed: number;
  biometricRegistered: boolean;
  biometricLocked: boolean;
  offlineEnabled: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
}

export interface SyncStatus {
  isSyncing: boolean;
  progress: number; // 0 - 100
  statusText: string;
  lastSyncedAt: string | null;
  pendingItemsCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'sync';
  timestamp: string;
  isRead: boolean;
  progress?: number;
  isPersistent?: boolean;
  isSyncing?: boolean;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'Logos' | 'Business' | 'Social' | 'E-commerce' | 'Events' | 'Technology';
  style: string;
  previewUrl: string;
  svgCode?: string;
  prompt: string;
  palette: string[];
}

export interface AppGalleryItem {
  id: string;
  appName: string;
  category: string;
  tagline: string;
  platforms: ('Web' | 'iOS' | 'Android')[];
  coverImage: string;
  logoSvg: string;
  videoPreviewUrl?: string;
  palette: string[];
  promptRecipe: string;
  visionSpecs: string;
  architecture: {
    visionModel: string;
    generationEngine: string;
    objectDetectionSpecs: string;
    brandKitUsed: string;
  };
  features: string[];
}

export interface CustomInstructions {
  appStyle: string;
  brandVoice: string;
  colorPreferences: string;
  typographyRules: string;
  strictVectorGeometry: boolean;
  negativePrompts: string;
  preferredModel: string;
}

export interface VideoScene {
  timecode: string;
  cameraMotion: string;
  visualAction: string;
  lightingColor: string;
  soundDesign: string;
}

export interface VideoStoryboard {
  title: string;
  tagline: string;
  scenes: VideoScene[];
  cameraCoordinates: {
    zoomLevel: number;
    rotationDeg: number;
    motionPath: string;
  };
  voiceoverScript: string;
  technicalSpecs: {
    engine: string;
    renderResolution: string;
    frameRate: string;
    colorSpace: string;
  };
}

export interface NotificationPreferences {
  newFeatures: boolean;
  successfulGenerations: boolean;
  complianceAlerts: boolean;
  weeklyDigest: boolean;
  soundEnabled: boolean;
}

export type BatchTaskStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface BatchImageTask {
  id: string;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  status: BatchTaskStatus;
  progress?: number;
  resultUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface BatchStyleConfig {
  style: string;
  category: string;
  lighting: string;
  aspectRatio: string;
  useBrandKit: boolean;
  lockConsistencySeed: boolean;
  negativePrompt: string;
  customDirectives?: string;
  colorPalette: string[];
}

export interface SvgExportOptions {
  preset: 'standard' | 'print-300dpi' | 'web-minified' | 'monochrome' | 'app-icon';
  viewBox: string;
  width?: number | string;
  height?: number | string;
  backgroundColor: 'transparent' | '#FFFFFF' | '#09090B' | '#800020' | string;
  includeXmlDeclaration: boolean;
  includeMetadata: boolean;
}

