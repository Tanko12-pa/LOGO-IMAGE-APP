import { DesignItem, Project, BrandKit, UserProfile, NotificationItem, TemplateItem, CustomInstructions, NotificationPreferences, SyncStatus } from '../types';

const STORAGE_KEYS = {
  DESIGNS: 'logo_image_designs_v1',
  PROJECTS: 'logo_image_projects_v1',
  BRAND_KITS: 'logo_image_brandkits_v1',
  USER_PROFILE: 'logo_image_profile_v1',
  NOTIFICATIONS: 'logo_image_notifications_v1',
  ACTIVE_BRAND_KIT: 'logo_image_active_brandkit_v1',
  HISTORY: 'logo_image_history_v1',
  CUSTOM_INSTRUCTIONS: 'logo_image_custom_instructions_v1',
  NOTIFICATION_PREFS: 'logo_image_notification_prefs_v1',
  SYNC_STATUS: 'logo_image_sync_status_v1',
};

export const DEFAULT_SYNC_STATUS: SyncStatus = {
  isSyncing: false,
  progress: 100,
  statusText: 'All designs and vector assets synchronized with Cloud AI Studio.',
  lastSyncedAt: new Date().toISOString(),
  pendingItemsCount: 0,
};

export const DEFAULT_CUSTOM_INSTRUCTIONS: CustomInstructions = {
  appStyle: 'Sleek luxury dark mode with high contrast accents and sharp geometry',
  brandVoice: 'Authoritative, modern, premium, and minimalist',
  colorPreferences: 'Harmonize with signature #800020 (burgundy), #F27430 (tangerine), #FFE566 (amber), and #FFFFFF',
  typographyRules: 'Syne & Plus Jakarta Sans with generous letter-spacing (+0.03em)',
  strictVectorGeometry: true,
  negativePrompts: 'blurry, raster noise, low-res, clunky gradients, watermark, distorted typography',
  preferredModel: 'gemini-3.8-flash',
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  newFeatures: true,
  successfulGenerations: true,
  complianceAlerts: true,
  weeklyDigest: true,
  soundEnabled: true,
};

// Initial Brand Kit with the specified signature colors: #800020, #FFFFFF, #FFE566, #F27430
export const DEFAULT_BRAND_KIT: BrandKit = {
  id: 'bk-signature-1',
  name: 'Oxblood & Tangerine Signature',
  industry: 'Creative Technology & AI',
  tagline: 'Precision Visual Intelligence',
  description: 'Signature luxury identity built on deep burgundy roots with energetic sunburst tangerine accents.',
  mission: 'Empower forward-thinking creators with iconic vector branding and computer vision intelligence.',
  palette: [
    { name: 'Imperial Burgundy', hex: '#800020', role: 'Primary Core' },
    { name: 'Pure Canvas White', hex: '#FFFFFF', role: 'Contrast Surface' },
    { name: 'Sunburst Amber', hex: '#FFE566', role: 'Warm Highlight' },
    { name: 'Vibrant Tangerine', hex: '#F27430', role: 'Energy Accent' },
    { name: 'Obsidian Noir', hex: '#0B0B0E', role: 'Dark Base' },
  ],
  typography: {
    headingFont: 'Syne',
    bodyFont: 'Plus Jakarta Sans',
    displayStyle: 'High-contrast Modern Geometric',
    recommendations: 'Headings in Syne 700 with +0.02em letter spacing; subtext in Plus Jakarta Sans 500.',
  },
  isDefault: true,
  createdAt: new Date().toISOString(),
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Creative Director',
  email: 'creator@logoimage.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  plan: 'TRIAL_7_DAYS',
  subscriptionStatus: 'trial',
  trialStartedAt: new Date().toISOString(),
  trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  subscription: {
    status: 'trial',
    planType: 'TRIAL_7_DAYS',
    trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    priceMonthly: 19.99,
    priceYearly: 199.99,
    daysRemaining: 7,
  },
  creditsRemaining: 150,
  creditsUsed: 0,
  biometricRegistered: true,
  biometricLocked: false,
  offlineEnabled: true,
  highContrast: false,
  screenReaderOptimized: false,
};

export const INITIAL_DESIGNS: DesignItem[] = [
  {
    id: 'des-1',
    title: 'Aetheria Kinetic Hexagon',
    type: 'logo',
    prompt: 'Modern hexagonal kinetic monogram with interlocking vector ribbons in oxblood, tangerine, and amber gold',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-des1-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#800020"/>
      <stop offset="100%" stop-color="#F27430"/>
    </linearGradient>
    <linearGradient id="grad-des1-b" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F27430"/>
      <stop offset="100%" stop-color="#FFE566"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0B0B0E" rx="36"/>
  <g transform="translate(250, 250)">
    <polygon points="0,-150 130,-75 130,75 0,150 -130,75 -130,-75" fill="none" stroke="url(#grad-des1-a)" stroke-width="14" stroke-linejoin="round"/>
    <path d="M0,-110 L95,-55 L95,55 L0,110 L-95,55 L-95,-55 Z" fill="none" stroke="url(#grad-des1-b)" stroke-width="8" stroke-dasharray="16 8"/>
    <circle cx="0" cy="0" r="45" fill="url(#grad-des1-a)"/>
    <polygon points="0,-25 22,12 -22,12" fill="#FFFFFF"/>
  </g>
</svg>`,
    aspectRatio: '1:1',
    dimensions: '1024x1024',
    palette: ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
    tags: ['hexagonal', 'geometric', 'vector', 'oxblood', 'branding'],
    isFavorite: true,
    projectId: 'proj-1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    metadata: {
      visualCharacteristics: {
        geometry: 'Hexagonal Symmetrical',
        topology: 'Lossless Vector Bezier',
        contrastRatio: '14.2:1 AAA',
        colorSystem: 'Oxblood & Tangerine DNA',
      },
    },
  },
  {
    id: 'des-2',
    title: 'Obsidian Studio Architecture',
    type: 'image',
    prompt: 'Minimalist brutalist architectural interior with amber sunlight beams, monolithic basalt pedestal, and warm studio lighting',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    dimensions: '1920x1080',
    palette: ['#0B0B0E', '#F27430', '#FFE566', '#262626'],
    tags: ['interior', 'minimalist', 'studio', 'brutalist', 'amber'],
    isFavorite: true,
    projectId: 'proj-1',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    metadata: {
      visualCharacteristics: {
        style: 'Cinematic Hyperrealistic',
        lighting: 'Warm Ambient Key Light',
        mood: 'Sophisticated Luxury',
      },
    },
  },
  {
    id: 'des-3',
    title: 'Lumina Solar Core Emblem',
    type: 'logo',
    prompt: 'Circular geometric emblem with radiating solar flares and sleek central monogram in burgundy and amber gold',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <radialGradient id="grad-des3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFE566"/>
      <stop offset="60%" stop-color="#F27430"/>
      <stop offset="100%" stop-color="#800020"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0B0B0E" rx="36"/>
  <g transform="translate(250, 250)">
    <circle cx="0" cy="0" r="140" fill="none" stroke="url(#grad-des3)" stroke-width="10"/>
    <circle cx="0" cy="0" r="100" fill="none" stroke="#FFE566" stroke-width="3" stroke-dasharray="10 10"/>
    <circle cx="0" cy="0" r="60" fill="url(#grad-des3)"/>
    <path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>`,
    aspectRatio: '1:1',
    dimensions: '1024x1024',
    palette: ['#800020', '#FFE566', '#FFFFFF'],
    tags: ['solar', 'circular', 'minimal', 'vector', 'emblem'],
    isFavorite: false,
    projectId: 'proj-1',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    metadata: {
      visualCharacteristics: {
        geometry: 'Radial Circular',
        contrastRatio: '12.8:1 AAA',
      },
    },
  },
  {
    id: 'des-4',
    title: 'Volt Racing Kinetic Chevron',
    type: 'logo',
    prompt: 'Aerodynamic automotive emblem with bold diagonal speed lines and tangerine energy chevron',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-des4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F27430"/>
      <stop offset="100%" stop-color="#800020"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0B0B0E" rx="36"/>
  <g transform="translate(250, 250)">
    <polygon points="-120,-60 -20,-60 80,60 -20,60" fill="url(#grad-des4)"/>
    <polygon points="-40,-60 60,-60 160,60 60,60" fill="#FFE566" opacity="0.9"/>
    <line x1="-150" y1="90" x2="150" y2="90" stroke="#F27430" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>`,
    aspectRatio: '1:1',
    dimensions: '1024x1024',
    palette: ['#F27430', '#800020', '#FFE566', '#FFFFFF'],
    tags: ['automotive', 'racing', 'speed', 'chevron', 'tangerine'],
    isFavorite: true,
    projectId: 'proj-2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    metadata: {
      visualCharacteristics: {
        geometry: 'Dynamic Chevron',
        motionEnergy: 'High Kinetic',
      },
    },
  },
  {
    id: 'des-5',
    title: 'Neo-Tokyo Cyber Neural Hub',
    type: 'image',
    prompt: 'Cyberpunk volumetric server room with glowing amber and oxblood fiber optic cabling, 8k cinematic depth of field',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    dimensions: '1920x1080',
    palette: ['#800020', '#F27430', '#FFE566', '#1E1B4B'],
    tags: ['cyberpunk', 'neural', 'server', 'neon', 'volumetric'],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    metadata: {
      visualCharacteristics: {
        style: 'Cyberpunk Emissive',
        lighting: 'Voluminescent Radiance',
      },
    },
  },
  {
    id: 'des-6',
    title: 'Fluid Sine Wave Intelligence',
    type: 'logo',
    prompt: 'Continuous biomorphic sine wave logo symbolizing fluid AI intelligence and audio motion',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-des6" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#800020"/>
      <stop offset="50%" stop-color="#F27430"/>
      <stop offset="100%" stop-color="#FFE566"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0B0B0E" rx="36"/>
  <g transform="translate(100, 250)">
    <path d="M0,0 Q75,-120 150,0 T300,0" fill="none" stroke="url(#grad-des6)" stroke-width="16" stroke-linecap="round"/>
    <circle cx="150" cy="0" r="16" fill="#FFE566"/>
  </g>
</svg>`,
    aspectRatio: '1:1',
    dimensions: '1024x1024',
    palette: ['#800020', '#F27430', '#FFE566'],
    tags: ['fluid', 'wave', 'organic', 'intelligence', 'minimal'],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    metadata: {
      visualCharacteristics: {
        geometry: 'Biomorphic Wave',
        topology: 'Smooth Bezier',
      },
    },
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Aetheria Cloud Brand Launch',
    description: 'Modern luxury AI SaaS branding, vector emblems, social banners, and marketing mockups.',
    brandKitId: 'bk-signature-1',
    itemsCount: 6,
    itemIds: ['des-1', 'des-2', 'des-3'],
    isArchived: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Volt Racing Apparel',
    description: 'Bold sports merchandise logos, high-contrast automotive visuals, and apparel prints.',
    brandKitId: 'bk-signature-1',
    itemsCount: 4,
    itemIds: ['des-4'],
    isArchived: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-sync-persistent',
    title: 'Cloud Synchronization Active',
    message: 'All local vector designs and project pipelines are synchronized with Cloud AI Studio.',
    type: 'sync',
    timestamp: 'Connected',
    isRead: false,
    progress: 100,
    isPersistent: true,
    isSyncing: false,
  },
  {
    id: 'notif-1',
    title: 'Computer Vision Model Ready',
    message: 'Real-time object recognition and AR overlay engine initialized with sub-50ms latency.',
    type: 'success',
    timestamp: '10m ago',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Biometric Passkey Configured',
    message: 'Biometric Touch ID / Face ID authentication is active for instant and secure workspace access.',
    type: 'info',
    timestamp: '1h ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'A2A Judge Audit Completed',
    message: 'Creator and Judge agents approved brand prompt with 97/100 WCAG contrast rating.',
    type: 'success',
    timestamp: '2h ago',
    isRead: true,
  },
];

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Local storage write error:', e);
    }
  }

  // Designs
  getDesigns(): DesignItem[] {
    const items = this.getItem<DesignItem[]>(STORAGE_KEYS.DESIGNS, []);
    if (!items || items.length === 0) {
      this.setItem(STORAGE_KEYS.DESIGNS, INITIAL_DESIGNS);
      return INITIAL_DESIGNS;
    }
    return items;
  }

  saveDesign(design: DesignItem): void {
    const list = this.getDesigns();
    const existingIndex = list.findIndex((d) => d.id === design.id);
    if (existingIndex >= 0) {
      list[existingIndex] = design;
    } else {
      list.unshift(design);
    }
    this.setItem(STORAGE_KEYS.DESIGNS, list);
  }

  deleteDesign(id: string): void {
    const list = this.getDesigns().filter((d) => d.id !== id);
    this.setItem(STORAGE_KEYS.DESIGNS, list);
  }

  toggleFavorite(id: string): boolean {
    const list = this.getDesigns();
    const item = list.find((d) => d.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      this.setItem(STORAGE_KEYS.DESIGNS, list);
      return item.isFavorite;
    }
    return false;
  }

  // Projects
  getProjects(): Project[] {
    return this.getItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  saveProject(project: Project): void {
    const list = this.getProjects();
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      list[idx] = project;
    } else {
      list.unshift(project);
    }
    this.setItem(STORAGE_KEYS.PROJECTS, list);
  }

  deleteProject(id: string): void {
    const list = this.getProjects().filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.PROJECTS, list);
  }

  // Brand Kits
  getBrandKits(): BrandKit[] {
    return this.getItem<BrandKit[]>(STORAGE_KEYS.BRAND_KITS, [DEFAULT_BRAND_KIT]);
  }

  saveBrandKit(brandKit: BrandKit): void {
    const list = this.getBrandKits();
    const idx = list.findIndex((b) => b.id === brandKit.id);
    if (idx >= 0) {
      list[idx] = brandKit;
    } else {
      list.push(brandKit);
    }
    this.setItem(STORAGE_KEYS.BRAND_KITS, list);
  }

  getActiveBrandKit(): BrandKit {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_BRAND_KIT);
    const kits = this.getBrandKits();
    return kits.find((k) => k.id === activeId) || kits[0] || DEFAULT_BRAND_KIT;
  }

  setActiveBrandKit(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BRAND_KIT, id);
  }

  // User Profile
  getUserProfile(): UserProfile {
    const profile = this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
    
    // Auto-calculate trial status & expiration
    if (profile.plan === 'TRIAL_7_DAYS' || profile.subscriptionStatus === 'trial') {
      const endsAtTime = profile.trialEndsAt ? new Date(profile.trialEndsAt).getTime() : (Date.now() + 7 * 86400000);
      const now = Date.now();
      const diffMs = endsAtTime - now;
      const daysRemaining = Math.max(0, Math.ceil(diffMs / 86400000));
      
      if (diffMs <= 0) {
        profile.subscriptionStatus = 'expired';
        if (profile.subscription) {
          profile.subscription.status = 'expired';
          profile.subscription.daysRemaining = 0;
        }
      } else {
        profile.subscriptionStatus = 'trial';
        if (!profile.subscription) {
          profile.subscription = {
            status: 'trial',
            planType: 'TRIAL_7_DAYS',
            trialEndsAt: new Date(endsAtTime).toISOString(),
            priceMonthly: 19.99,
            priceYearly: 199.99,
            daysRemaining,
          };
        } else {
          profile.subscription.status = 'trial';
          profile.subscription.daysRemaining = daysRemaining;
        }
      }
    }
    return profile;
  }

  isAccessGranted(): boolean {
    const profile = this.getUserProfile();
    if (profile.plan === 'MONTHLY_19_99' || profile.plan === 'YEARLY_199_99' || profile.subscriptionStatus === 'active') {
      return true;
    }
    if (profile.plan === 'TRIAL_7_DAYS' || profile.subscriptionStatus === 'trial') {
      const endsAtTime = profile.trialEndsAt ? new Date(profile.trialEndsAt).getTime() : 0;
      return endsAtTime > Date.now();
    }
    return false;
  }

  getTrialDetails() {
    const profile = this.getUserProfile();
    const isPaid = profile.plan === 'MONTHLY_19_99' || profile.plan === 'YEARLY_199_99' || profile.subscriptionStatus === 'active';
    const endsAt = profile.trialEndsAt ? new Date(profile.trialEndsAt).getTime() : (Date.now() + 7 * 86400000);
    const now = Date.now();
    const diffMs = Math.max(0, endsAt - now);
    const totalTrialDurationMs = 7 * 86400000;
    const isExpired = !isPaid && diffMs <= 0;
    
    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const percentageRemaining = isPaid ? 100 : Math.min(100, Math.max(0, Math.round((diffMs / totalTrialDurationMs) * 100)));

    return {
      isPaid,
      isExpired,
      days,
      hours,
      minutes,
      diffMs,
      endsAt: new Date(endsAt).toISOString(),
      percentageRemaining,
      status: isPaid ? 'active' : isExpired ? 'expired' : 'trial',
    };
  }

  activateTrial(userName?: string, userEmail?: string): UserProfile {
    const profile = this.getUserProfile();
    const now = Date.now();
    const endsAt = new Date(now + 7 * 86400000).toISOString();
    
    const updated: UserProfile = {
      ...profile,
      name: userName || profile.name || 'Vision Creator',
      email: userEmail || profile.email || 'creator@logoimage.ai',
      plan: 'TRIAL_7_DAYS',
      subscriptionStatus: 'trial',
      trialStartedAt: new Date(now).toISOString(),
      trialEndsAt: endsAt,
      creditsRemaining: Math.max(profile.creditsRemaining, 150),
      subscription: {
        status: 'trial',
        planType: 'TRIAL_7_DAYS',
        trialEndsAt: endsAt,
        priceMonthly: 19.99,
        priceYearly: 199.99,
        daysRemaining: 7,
      },
    };
    
    this.saveUserProfile(updated);
    this.addNotification({
      title: '7-Day Free Trial Activated',
      message: 'Welcome! You have full access to all 5 foundation models and 150 AI credits for 7 days.',
      type: 'success',
    });
    return updated;
  }

  simulateTrialExpired(): UserProfile {
    const profile = this.getUserProfile();
    const expiredTime = new Date(Date.now() - 3600000).toISOString();
    const updated: UserProfile = {
      ...profile,
      plan: 'TRIAL_7_DAYS',
      subscriptionStatus: 'expired',
      trialEndsAt: expiredTime,
      subscription: {
        status: 'expired',
        planType: 'TRIAL_7_DAYS',
        trialEndsAt: expiredTime,
        priceMonthly: 19.99,
        priceYearly: 199.99,
        daysRemaining: 0,
      },
    };
    this.saveUserProfile(updated);
    this.addNotification({
      title: '7-Day Free Trial Expired',
      message: 'Your 7-Day Free Trial has expired. Access to AI tools is restricted until a subscription is activated.',
      type: 'warning',
    });
    return updated;
  }

  checkAndNotifyTrialMilestones(): void {
    const details = this.getTrialDetails();
    if (details.isPaid) return;

    const lastAlertKey = 'vision_genai_last_trial_alert';
    const lastAlert = localStorage.getItem(lastAlertKey);

    if (details.isExpired && lastAlert !== 'expired') {
      localStorage.setItem(lastAlertKey, 'expired');
      this.addNotification({
        title: '7-Day Free Trial Expired',
        message: 'Your 7-day trial period has ended. Access to creative tools is locked. Select a plan to restore access.',
        type: 'warning',
      });
    } else if (!details.isExpired && details.days <= 2 && lastAlert !== `expiring_${details.days}`) {
      localStorage.setItem(lastAlertKey, `expiring_${details.days}`);
      this.addNotification({
        title: 'Trial Expiring Soon',
        message: `Your 7-Day Free Trial expires in ${details.days === 0 ? 'less than 24 hours' : `${details.days} days`}. Upgrade today to keep generating without interruption!`,
        type: 'warning',
      });
    }
  }

  saveUserProfile(profile: UserProfile): void {
    this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  deductCredits(amount = 1): number {
    if (!this.isAccessGranted()) {
      throw new Error('Your 7-Day Free Trial has expired. Please upgrade your subscription to continue generating.');
    }
    const profile = this.getUserProfile();
    profile.creditsRemaining = Math.max(0, profile.creditsRemaining - amount);
    profile.creditsUsed += amount;
    this.saveUserProfile(profile);
    return profile.creditsRemaining;
  }

  // Notifications & Cloud Synchronization
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private isCurrentlySyncing = false;

  subscribeSyncStatus(callback: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(callback);
    return () => {
      this.syncListeners = this.syncListeners.filter((cb) => cb !== callback);
    };
  }

  private notifySyncListeners(status: SyncStatus): void {
    this.syncListeners.forEach((cb) => {
      try {
        cb(status);
      } catch (err) {
        console.error('Error in sync listener callback:', err);
      }
    });
  }

  getSyncStatus(): SyncStatus {
    return this.getItem<SyncStatus>(STORAGE_KEYS.SYNC_STATUS, DEFAULT_SYNC_STATUS);
  }

  saveSyncStatus(status: SyncStatus): void {
    this.setItem(STORAGE_KEYS.SYNC_STATUS, status);
    this.notifySyncListeners(status);
  }

  updatePersistentSyncNotification(syncState: SyncStatus): void {
    const list = this.getNotifications().filter(
      (n) => n.id !== 'notif-sync-persistent' && !n.isPersistent
    );

    const persistentItem: NotificationItem = {
      id: 'notif-sync-persistent',
      title: syncState.isSyncing
        ? `Cloud Synchronization in Progress (${syncState.progress}%)`
        : syncState.progress === 100
        ? 'Cloud Synchronization Active'
        : 'Cloud Synchronization Paused',
      message: syncState.statusText,
      type: syncState.isSyncing ? 'sync' : syncState.progress === 100 ? 'success' : 'warning',
      timestamp: syncState.isSyncing ? 'Syncing...' : 'Just now',
      isRead: false,
      progress: syncState.progress,
      isPersistent: true,
      isSyncing: syncState.isSyncing,
    };

    list.unshift(persistentItem);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // Execute online sync sequence when returning online from offline mode
  async startOnlineSync(onProgressUpdate?: (status: SyncStatus) => void): Promise<void> {
    if (this.isCurrentlySyncing) return;
    this.isCurrentlySyncing = true;
    try {
      const designs = this.getDesigns();
      const projects = this.getProjects();
      const totalItems = designs.length + projects.length;

      const stages = [
        { progress: 12, text: 'Reconnected: Establishing secure Cloud AI Studio handshake...' },
        { progress: 32, text: `Auditing local cache: ${designs.length} vector logo & image designs queued...` },
        { progress: 60, text: `Synchronizing ${projects.length} project pipelines, presets & brand kits...` },
        { progress: 84, text: 'Verifying A2A neural inference cache & compliance audits...' },
        { progress: 100, text: 'All local assets & queue states successfully synchronized with Cloud AI Studio.' },
      ];

      for (const stage of stages) {
        const isDone = stage.progress === 100;
        const status: SyncStatus = {
          isSyncing: !isDone,
          progress: stage.progress,
          statusText: stage.text,
          lastSyncedAt: isDone ? new Date().toISOString() : this.getSyncStatus().lastSyncedAt,
          pendingItemsCount: isDone ? 0 : Math.max(1, Math.round(totalItems * ((100 - stage.progress) / 100))),
        };

        this.saveSyncStatus(status);
        this.updatePersistentSyncNotification(status);
        if (onProgressUpdate) onProgressUpdate(status);

        // Realistic asynchronous synchronization stepping
        if (!isDone) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    } finally {
      this.isCurrentlySyncing = false;
    }
  }

  getNotifications(): NotificationItem[] {
    return this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): void {
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    // Keep persistent notification at the top if present
    const persistentIdx = list.findIndex((n) => n.id === 'notif-sync-persistent' || n.isPersistent);
    if (persistentIdx === 0) {
      list.splice(1, 0, newNotif);
    } else {
      list.unshift(newNotif);
    }
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 30));
  }

  markAllNotificationsRead(): void {
    const list = this.getNotifications().map((n) => (n.isPersistent ? n : { ...n, isRead: true }));
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // Custom Instructions
  getCustomInstructions(): CustomInstructions {
    return this.getItem<CustomInstructions>(
      STORAGE_KEYS.CUSTOM_INSTRUCTIONS,
      DEFAULT_CUSTOM_INSTRUCTIONS
    );
  }

  saveCustomInstructions(instructions: CustomInstructions): void {
    this.setItem(STORAGE_KEYS.CUSTOM_INSTRUCTIONS, instructions);
  }

  // Notification Preferences
  getNotificationPreferences(): NotificationPreferences {
    return this.getItem<NotificationPreferences>(
      STORAGE_KEYS.NOTIFICATION_PREFS,
      DEFAULT_NOTIFICATION_PREFERENCES
    );
  }

  saveNotificationPreferences(prefs: NotificationPreferences): void {
    this.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, prefs);
  }

  // Export / Import Cloud Backup
  exportBackupJson(): string {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      designs: this.getDesigns(),
      projects: this.getProjects(),
      brandKits: this.getBrandKits(),
      userProfile: this.getUserProfile(),
    };
    return JSON.stringify(data, null, 2);
  }

  importBackupJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.designs) this.setItem(STORAGE_KEYS.DESIGNS, data.designs);
      if (data.projects) this.setItem(STORAGE_KEYS.PROJECTS, data.projects);
      if (data.brandKits) this.setItem(STORAGE_KEYS.BRAND_KITS, data.brandKits);
      if (data.userProfile) this.setItem(STORAGE_KEYS.USER_PROFILE, data.userProfile);
      return true;
    } catch (e) {
      console.error('Backup import error:', e);
      return false;
    }
  }
}

export const storageService = new StorageService();
