import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  ImageIcon,
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
  Settings,
  MessageSquareHeart,
  LayoutDashboard,
  Shield,
  ArrowRight,
  Command,
  X,
  Keyboard,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { NavView } from '../types';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Views' | 'Quick Actions' | 'Generators';
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: NavView) => void;
  onTriggerGenerate?: () => void;
  onOpenBatchVision?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerGenerate,
  onOpenBatchVision,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Quick Actions
    {
      id: 'quick-generate',
      title: 'Run AI Generation',
      subtitle: 'Trigger instant generation in active workspace',
      category: 'Quick Actions',
      icon: Sparkles,
      shortcut: 'Ctrl+G',
      action: () => {
        onClose();
        if (onTriggerGenerate) {
          onTriggerGenerate();
        } else {
          onNavigate('logo-generator');
        }
      },
    },
    {
      id: 'quick-batch-vision',
      title: 'Batch Process Images (Computer Vision)',
      subtitle: 'Upload multiple images to export spreadsheet summary',
      category: 'Quick Actions',
      icon: FileSpreadsheet,
      shortcut: 'Ctrl+B',
      action: () => {
        onClose();
        onNavigate('computer-vision');
        if (onOpenBatchVision) {
          setTimeout(() => onOpenBatchVision(), 100);
        }
      },
    },
    // Views - Generators
    {
      id: 'view-logo',
      title: 'AI Logo Creator',
      subtitle: 'Vector logo generator with geometric SVG export',
      category: 'Generators',
      icon: Sparkles,
      shortcut: 'Ctrl+1',
      action: () => {
        onClose();
        onNavigate('logo-generator');
      },
    },
    {
      id: 'view-image',
      title: 'AI Image Creator',
      subtitle: '8K cinematic visuals, typography & Midjourney/Flux',
      category: 'Generators',
      icon: ImageIcon,
      shortcut: 'Ctrl+2',
      action: () => {
        onClose();
        onNavigate('image-generator');
      },
    },
    {
      id: 'view-vision',
      title: 'Computer Vision & AR Overlay',
      subtitle: 'Real-time object detection, HUD & batch spreadsheet',
      category: 'Generators',
      icon: ScanEye,
      shortcut: 'Ctrl+3',
      action: () => {
        onClose();
        onNavigate('computer-vision');
      },
    },
    {
      id: 'view-a2a',
      title: 'A2A Judge Agent',
      subtitle: 'Dual-agent creator & judge automated brand audit',
      category: 'Generators',
      icon: Scale,
      shortcut: 'Ctrl+4',
      action: () => {
        onClose();
        onNavigate('a2a-judge');
      },
    },
    {
      id: 'view-video',
      title: 'Video & Motion (Veo 3)',
      subtitle: 'Neural video ads, product showcase & animations',
      category: 'Generators',
      icon: Video,
      shortcut: 'Ctrl+5',
      action: () => {
        onClose();
        onNavigate('video-motion');
      },
    },
    // Views - Workspace & System
    {
      id: 'view-dashboard',
      title: 'Dashboard Overview',
      subtitle: 'Activity, active credits, and recent generations',
      category: 'Views',
      icon: LayoutDashboard,
      shortcut: 'Ctrl+0',
      action: () => {
        onClose();
        onNavigate('dashboard');
      },
    },
    {
      id: 'view-brand-studio',
      title: 'Brand Studio & Brand Kits',
      subtitle: 'Color harmony palettes, typography & guidelines',
      category: 'Views',
      icon: Palette,
      action: () => {
        onClose();
        onNavigate('brand-studio');
      },
    },
    {
      id: 'view-editor',
      title: 'AI Image Editor & Lab',
      subtitle: 'Photoroom isolation, Claid 4K upscaler & filters',
      category: 'Views',
      icon: SlidersHorizontal,
      action: () => {
        onClose();
        onNavigate('image-editor');
      },
    },
    {
      id: 'view-templates',
      title: 'Template Library',
      subtitle: 'Curated corporate, modern & minimal brand templates',
      category: 'Views',
      icon: LayoutTemplate,
      action: () => {
        onClose();
        onNavigate('templates');
      },
    },
    {
      id: 'view-projects',
      title: 'Projects & Workspaces',
      subtitle: 'Organize design assets into client project folders',
      category: 'Views',
      icon: FolderKanban,
      action: () => {
        onClose();
        onNavigate('projects');
      },
    },
    {
      id: 'view-my-designs',
      title: 'My Saved Designs',
      subtitle: 'View, filter and export all generated creations',
      category: 'Views',
      icon: Library,
      action: () => {
        onClose();
        onNavigate('my-designs');
      },
    },
    {
      id: 'view-favorites',
      title: 'Starred Favorites',
      subtitle: 'Quickly access pinned and highlighted designs',
      category: 'Views',
      icon: Star,
      action: () => {
        onClose();
        onNavigate('favorites');
      },
    },
    {
      id: 'view-history',
      title: 'Generation History',
      subtitle: 'Timestamped timeline of past generations',
      category: 'Views',
      icon: History,
      action: () => {
        onClose();
        onNavigate('history');
      },
    },
    {
      id: 'view-billing',
      title: 'Subscription & Billing',
      subtitle: 'Manage 7-day trial, PayPal plans & AI credits',
      category: 'Views',
      icon: CreditCard,
      action: () => {
        onClose();
        onNavigate('billing');
      },
    },
    {
      id: 'view-settings',
      title: 'Settings & Security',
      subtitle: 'Biometric passkeys, preferences & infrastructure',
      category: 'Views',
      icon: Settings,
      action: () => {
        onClose();
        onNavigate('settings');
      },
    },
    {
      id: 'view-feedback',
      title: 'Feedback & Support',
      subtitle: 'Send feedback, bug reports and feature requests',
      category: 'Views',
      icon: MessageSquareHeart,
      action: () => {
        onClose();
        onNavigate('feedback');
      },
    },
    {
      id: 'view-admin',
      title: 'Admin Dashboard',
      subtitle: 'Multi-tenant infrastructure & service status',
      category: 'Views',
      icon: Shield,
      action: () => {
        onClose();
        onNavigate('admin');
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center gap-3 bg-zinc-900/40">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, views, or tools... (e.g., 'generate', 'vision', 'batch')"
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-zinc-900/60"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Command className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No commands matching "{query}"</p>
              <p className="text-[11px] text-zinc-600">Try searching "logo", "batch", or "generate"</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#800020]/30 to-[#F27430]/20 border border-[#F27430]/40 text-white'
                      : 'hover:bg-zinc-900/60 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#800020] text-[#FFE566] border border-[#F27430]/60'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[9px] font-mono uppercase text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                          {cmd.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{cmd.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.shortcut && (
                      <kbd className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-[#FFE566] font-semibold">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-[#FFE566]' : ''
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 bg-zinc-900/60 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 px-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">↵</kbd>
              <span>Execute</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">Ctrl+G</kbd>
              <span>Instant Generate</span>
            </span>
          </div>
          <span className="text-[#FFE566] font-semibold flex items-center gap-1">
            <Keyboard className="w-3 h-3 text-[#F27430]" />
            <span>Power User Mode</span>
          </span>
        </div>
      </div>
    </div>
  );
};
