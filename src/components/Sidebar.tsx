import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  ScanEye,
  Scale,
  Palette,
  SlidersHorizontal,
  Video,
  LayoutTemplate,
  FolderKanban,
  Library,
  Star,
  History,
  CreditCard,
  Shield,
  MessageSquareHeart,
  Settings,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Globe,
  Lock,
  Cpu,
  Zap,
} from 'lucide-react';
import { NavView } from '../types';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  favoriteCount: number;
  projectCount: number;
}

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category: 'core' | 'ai-tools' | 'workspace' | 'system';
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  // CORE
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
  { id: 'logo-generator', label: 'AI Logo Creator', icon: Sparkles, badge: 'Vector', category: 'core' },
  { id: 'image-generator', label: 'AI Image Creator', icon: ImageIcon, badge: '8K', category: 'core' },

  // AI & VISION TOOLS
  { id: 'computer-vision', label: 'Computer Vision & AR', icon: ScanEye, badge: 'Live', category: 'ai-tools' },
  { id: 'a2a-judge', label: 'A2A Judge Agent', icon: Scale, badge: 'Dual AI', category: 'ai-tools' },
  { id: 'brand-studio', label: 'Brand Studio', icon: Palette, category: 'ai-tools' },
  { id: 'image-editor', label: 'AI Image Editor', icon: SlidersHorizontal, badge: 'Gemini 3.1', category: 'ai-tools' },
  { id: 'video-motion', label: 'Video & Motion', icon: Video, badge: 'Veo 3', category: 'ai-tools' },

  // WORKSPACE
  { id: 'templates', label: 'Template Library', icon: LayoutTemplate, category: 'workspace' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, category: 'workspace' },
  { id: 'my-designs', label: 'My Designs', icon: Library, category: 'workspace' },
  { id: 'favorites', label: 'Favorites', icon: Star, category: 'workspace' },
  { id: 'history', label: 'Generation History', icon: History, category: 'workspace' },

  // SYSTEM & FEEDBACK
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, category: 'system' },
  { id: 'admin', label: 'Admin Dashboard', icon: Shield, category: 'system' },
  { id: 'feedback', label: 'Feedback & Support', icon: MessageSquareHeart, category: 'system' },
  { id: 'settings', label: 'Settings & Security', icon: Settings, category: 'system' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  favoriteCount,
  projectCount,
}) => {
  const [navItems, setNavItems] = useState<NavItem[]>(() => {
    try {
      const saved = localStorage.getItem('logo_image_sidebar_order_v1');
      if (saved) {
        const orderIds = JSON.parse(saved) as NavView[];
        const map = new Map(DEFAULT_NAV_ITEMS.map((item) => [item.id, item]));
        const sorted: NavItem[] = [];
        for (const id of orderIds) {
          if (map.has(id)) {
            sorted.push(map.get(id)!);
            map.delete(id);
          }
        }
        return [...sorted, ...Array.from(map.values())];
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NAV_ITEMS;
  });

  const [draggedId, setDraggedId] = useState<NavView | null>(null);

  const handleDragStart = (e: React.DragEvent, id: NavView) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: NavView) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const fromIndex = navItems.findIndex((item) => item.id === draggedId);
    const toIndex = navItems.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const updated = [...navItems];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setNavItems(updated);
    localStorage.setItem('logo_image_sidebar_order_v1', JSON.stringify(updated.map((i) => i.id)));
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Single Left-Hand Panel */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 ease-in-out shadow-2xl ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Main Application Control Panel"
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
          {!isCollapsed ? (
            <div
              onClick={() => onSelectView('dashboard')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] via-[#F27430] to-[#FFE566] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#FFE566]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                  LOGO & IMAGE
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#800020] text-[#FFE566] border border-[#F27430]/30 font-bold">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium tracking-tight truncate max-w-[150px]">
                  Vision & Creative Suite
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => onSelectView('dashboard')}
              className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] via-[#F27430] to-[#FFE566] p-0.5 cursor-pointer shadow-md"
            >
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FFE566]" />
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-zinc-800 bg-zinc-900 items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Reordering Hint for Non-collapsed */}
        {!isCollapsed && (
          <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 font-mono">
              <GripVertical className="w-3.5 h-3.5 text-zinc-500" /> Reorder tools anytime
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-[#FFE566]">Drag & Drop</span>
          </div>
        )}

        {/* Navigation Items (Single Panel) */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const badgeCount =
              item.id === 'favorites' && favoriteCount > 0
                ? favoriteCount
                : item.id === 'projects' && projectCount > 0
                ? projectCount
                : null;

            return (
              <div
                key={item.id}
                draggable={!isCollapsed}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#800020] via-[#800020]/90 to-[#F27430]/60 text-white font-semibold shadow-lg shadow-[#800020]/20 border border-[#F27430]/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Drag handle */}
                {!isCollapsed && (
                  <GripVertical className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing -ml-1" />
                )}

                {/* Icon */}
                <div
                  className={`flex items-center justify-center rounded-lg p-1 transition-colors ${
                    isActive ? 'text-[#FFE566]' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </div>

                {/* Label & Badges */}
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-xs truncate tracking-tight">{item.label}</span>
                    <div className="flex items-center gap-1.5 ml-2">
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800/80 text-[#FFE566] border border-zinc-700/50 font-bold shrink-0">
                          {item.badge}
                        </span>
                      )}
                      {badgeCount !== null && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#F27430] text-white font-bold shrink-0">
                          {badgeCount}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#FFE566] rounded-r-full shadow-sm" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Quick Status & Hardware Lock Card */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-950">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-[#F27430]" />
                  AI Credits
                </span>
                <span className="font-mono text-[#FFE566] font-bold">480 / 600</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566]"
                  style={{ width: '80%' }}
                />
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Offline Ready
                </span>
                <button
                  type="button"
                  onClick={() => onSelectView('settings')}
                  className="text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-[#FFE566]" /> Passkey
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                title="AI Credits 480/600"
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFE566] cursor-pointer"
                onClick={() => onSelectView('billing')}
              >
                <Zap className="w-4 h-4 text-[#F27430]" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
