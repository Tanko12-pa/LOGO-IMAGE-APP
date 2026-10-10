import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Fingerprint,
  Wifi,
  WifiOff,
  HelpCircle,
  Plus,
  Bot,
  User,
  ShieldCheck,
  Check,
  Menu,
  Moon,
  Sun,
  Eye,
  LogOut,
  Battery,
  BatteryCharging,
  BatteryWarning,
  BatteryMedium,
  BatteryLow,
  Zap,
  RefreshCw,
  AlertTriangle,
  SlidersHorizontal,
  Clock,
  Lock,
  Mail,
  Command,
} from 'lucide-react';
import { NavView, NotificationItem, UserProfile, SyncStatus } from '../types';

interface TopNavProps {
  onSelectView: (view: NavView) => void;
  onOpenMobileMenu: () => void;
  onOpenAssistant: () => void;
  onStartTour: () => void;
  onLockBiometric: () => void;
  onOpenCommandPalette?: () => void;
  userProfile: UserProfile;
  trialDetails?: {
    isPaid: boolean;
    isExpired: boolean;
    days: number;
    hours: number;
    minutes: number;
    percentageRemaining: number;
    status: string;
  };
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  isOffline: boolean;
  onToggleOffline?: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  syncStatus?: SyncStatus;
  onTriggerSync?: () => void;
  firebaseUser?: any;
  onSignInWithGoogle?: () => void;
  onSignOut?: () => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup') => void;
  firebaseConnected?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onSelectView,
  onOpenMobileMenu,
  onOpenAssistant,
  onStartTour,
  onLockBiometric,
  onOpenCommandPalette,
  userProfile,
  trialDetails,
  notifications,
  onMarkNotificationsRead,
  isOffline,
  onToggleOffline,
  onSearch,
  searchQuery,
  syncStatus,
  onTriggerSync,
  firebaseUser,
  onSignInWithGoogle,
  onSignOut,
  onOpenAuthModal,
  firebaseConnected = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showBatteryDetails, setShowBatteryDetails] = useState(false);

  // Battery Status API state
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isSimulatedLowBattery, setIsSimulatedLowBattery] = useState<boolean>(false);

  // Query and listen to Web Battery API
  useEffect(() => {
    let batteryRef: any = null;

    const handleBatteryUpdate = (battery: any) => {
      if (battery) {
        setBatteryLevel(battery.level);
        setIsCharging(battery.charging);
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          batteryRef = battery;
          handleBatteryUpdate(battery);

          battery.addEventListener('levelchange', () => handleBatteryUpdate(battery));
          battery.addEventListener('chargingchange', () => handleBatteryUpdate(battery));
        })
        .catch(() => {
          // Graceful fallback for restricted contexts
          setBatteryLevel(0.85);
        });
    } else {
      // Standard fallback for desktop browsers without Battery API
      setBatteryLevel(0.85);
    }

    return () => {
      if (batteryRef) {
        try {
          batteryRef.removeEventListener('levelchange', () => {});
          batteryRef.removeEventListener('chargingchange', () => {});
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Compute effective battery level (allowing simulated <20% testing)
  const effectiveBatteryLevel = isSimulatedLowBattery ? 0.16 : (batteryLevel ?? 0.85);
  const batteryPercentage = Math.round(effectiveBatteryLevel * 100);
  const isLowBattery = batteryPercentage < 20 && !isCharging;

  // Active sync state from prop or persistent notification
  const persistentSyncItem = notifications.find((n) => n.id === 'notif-sync-persistent' || n.isPersistent);
  const isSyncing = syncStatus?.isSyncing ?? persistentSyncItem?.isSyncing ?? false;
  const syncProgress = syncStatus?.progress ?? persistentSyncItem?.progress ?? 100;
  const syncStatusText =
    syncStatus?.statusText ??
    persistentSyncItem?.message ??
    'All designs and vector assets synchronized with Cloud AI Studio.';

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isPersistent).length;
  const regularNotifications = notifications.filter((n) => !n.isPersistent && n.id !== 'notif-sync-persistent');

  return (
    <header className="h-16 px-4 lg:px-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger + search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search logos, images, brand kits, prompts & templates... (Ctrl+K for command menu)"
            className="w-full pl-10 pr-20 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] focus:ring-1 focus:ring-[#F27430]/30 transition-all font-sans"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearch('')}
                className="text-zinc-500 hover:text-white text-xs px-1"
              >
                Clear
              </button>
            ) : null}
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                title="Command Palette & Keyboard Shortcuts (Ctrl+K)"
                className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/80 text-[10px] font-mono text-[#FFE566] cursor-pointer transition-colors"
              >
                <Command className="w-2.5 h-2.5 text-[#F27430]" />
                <span>Ctrl+K</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3 ml-4">
        {/* Offline / Online Badge & Toggle */}
        <button
          type="button"
          onClick={onToggleOffline}
          title={
            isOffline
              ? 'Working in Offline Mode. Click to reconnect and trigger cloud synchronization.'
              : 'Connected to Cloud AI Studio. Click to toggle offline mode.'
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isOffline
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 ring-1 ring-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isOffline ? 'Offline' : 'Online'}</span>
        </button>

        {/* Firebase Cloud Connection Status */}
        <div
          title={
            firebaseConnected
              ? 'Firebase Firestore & Auth Connected (Encrypted Real-Time Sync)'
              : 'Connecting to Firebase...'
          }
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#F27430] animate-pulse" />
          <span className="font-semibold text-zinc-300">Firebase</span>
          <span className="text-[#FFE566] text-[10px]">Cloud Sync</span>
        </div>

        {/* 7-Day Free Trial & Subscription Status Badge */}
        {trialDetails?.isExpired ? (
          <button
            type="button"
            onClick={() => onSelectView('billing')}
            title="Your 7-Day Free Trial has expired. Click to subscribe and restore access."
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25 ring-1 ring-rose-500/30 shadow-xs transition-all cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-bold">Trial Expired</span>
            <span className="text-[10px] text-rose-300 hidden md:inline">• Subscribe</span>
          </button>
        ) : !trialDetails?.isPaid ? (
          <button
            type="button"
            onClick={() => onSelectView('billing')}
            title={`7-Day Free Trial Active. ${trialDetails ? `${trialDetails.days} days and ${trialDetails.hours} hours remaining` : 'Full access'}. Click to view plans.`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-[#800020]/20 text-[#FFE566] border-[#800020]/40 hover:bg-[#800020]/40 transition-all cursor-pointer shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-[#F27430]" />
            <span className="font-semibold hidden sm:inline">7-Day Trial:</span>
            <span className="font-bold text-white">
              {trialDetails ? `${trialDetails.days}d ${trialDetails.hours}h left` : '7d left'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectView('billing')}
            title="Active Paid Subscription. Click to manage subscription."
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-[#FFE566]" />
            <span className="font-semibold">
              {userProfile.plan === 'YEARLY_199_99' ? 'Enterprise Pro' : 'Monthly Pro'}
            </span>
          </button>
        )}

        {/* Subtle Battery Status Indicator (Changes to Red when < 20%) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBatteryDetails(!showBatteryDetails)}
            title={
              isLowBattery
                ? `Low Battery Warning (${batteryPercentage}%): Power below 20%. Connect charger for intensive AI generation tasks.`
                : `Battery Level: ${batteryPercentage}%${isCharging ? ' (Charging)' : ''}`
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              isLowBattery
                ? 'bg-red-500/15 text-red-400 border-red-500/60 ring-1 ring-red-500/40 shadow-sm shadow-red-950/80 animate-pulse'
                : isCharging
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50'
                : batteryPercentage < 40
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {isCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            ) : isLowBattery ? (
              <BatteryLow className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            ) : batteryPercentage < 40 ? (
              <BatteryMedium className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className={`font-semibold ${isLowBattery ? 'text-red-400 font-bold' : ''}`}>
              {batteryPercentage}%
            </span>
            {isCharging && <Zap className="w-2.5 h-2.5 text-[#FFE566]" />}
          </button>

          {/* Battery Details Popover with Power Advisory & Simulation Switch */}
          {showBatteryDetails && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isLowBattery
                        ? 'bg-red-500/20 text-red-400'
                        : isCharging
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {isCharging ? (
                      <BatteryCharging className="w-4 h-4" />
                    ) : isLowBattery ? (
                      <BatteryLow className="w-4 h-4 text-red-400" />
                    ) : (
                      <Battery className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Battery Power Monitor</div>
                    <div className="text-[10px] text-zinc-400">
                      {isCharging
                        ? 'AC Power Connected (Charging)'
                        : isLowBattery
                        ? 'Low Power (< 20%)'
                        : 'Discharging (On Battery)'}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isLowBattery
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {batteryPercentage}%
                </span>
              </div>

              {/* Progress gauge */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Capacity Level</span>
                  <span className={isLowBattery ? 'text-red-400 font-bold' : ''}>
                    {isLowBattery ? 'Critical Low (< 20%)' : 'Sufficient'}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLowBattery
                        ? 'bg-red-500'
                        : batteryPercentage < 40
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, batteryPercentage))}%` }}
                  />
                </div>
              </div>

              {/* AI Generation Power Advisory */}
              <div
                className={`mt-3 p-2.5 rounded-xl border leading-relaxed ${
                  isLowBattery
                    ? 'bg-red-950/40 border-red-500/40 text-red-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {isLowBattery ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Zap className="w-4 h-4 text-[#FFE566] flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div
                      className={`font-semibold text-[11px] ${
                        isLowBattery ? 'text-red-400' : 'text-zinc-200'
                      }`}
                    >
                      {isLowBattery ? 'Low Power Warning (<20%)' : 'AI Workload Power Availability'}
                    </div>
                    <p className="text-[10px] mt-0.5 text-zinc-400">
                      {isLowBattery
                        ? 'Battery level is below 20%. Multi-concept logo diffusion, computer vision scans, and batch vector renders demand high processor load. Connect to AC power to prevent unexpected shutdowns.'
                        : 'Power capacity is optimal for intensive AI vector synthesis, image generation, and multi-threaded batch queues.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Testing Simulation Toggle */}
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">Test Low Battery (&lt;20%)</span>
                <button
                  type="button"
                  onClick={() => setIsSimulatedLowBattery(!isSimulatedLowBattery)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                    isSimulatedLowBattery
                      ? 'bg-red-500 text-white border-red-400'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                  }`}
                >
                  {isSimulatedLowBattery ? 'Simulated 16% (Red)' : 'Simulate <20%'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Create Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white font-semibold text-xs shadow-md shadow-[#800020]/20 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4 text-[#FFE566]" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {showCreateMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Create Asset
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectView('logo-generator');
                  setShowCreateMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
                <div>
                  <div className="font-semibold">AI Vector Logo</div>
                  <div className="text-[10px] text-zinc-400">1, 4 or 8 concepts</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('image-generator');
                  setShowCreateMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F27430]" />
                <div>
                  <div className="font-semibold">AI High-Res Image</div>
                  <div className="text-[10px] text-zinc-400">Photorealistic & 3D</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('image-editor');
                  setShowCreateMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#FFE566]" />
                <div>
                  <div className="font-semibold">AI Image Editor & Create</div>
                  <div className="text-[10px] text-zinc-400">gemini-3.1-flash-image-preview</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('brand-studio');
                  setShowCreateMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">Brand Identity Kit</div>
                  <div className="text-[10px] text-zinc-400">Logos, palettes & cards</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('computer-vision');
                  setShowCreateMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold">Scan with Computer Vision</div>
                  <div className="text-[10px] text-zinc-400">Object detection & AR</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* LOGMAGE Assistant Trigger */}
        <button
          type="button"
          onClick={onOpenAssistant}
          title="Open LOGMAGE AI Assistant"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-[#F27430] hover:text-[#FFE566] transition-all text-xs font-semibold"
        >
          <Bot className="w-4 h-4 text-[#F27430]" />
          <span className="hidden md:inline">LOGMAGE</span>
        </button>

        {/* App Tour */}
        <button
          type="button"
          onClick={onStartTour}
          title="Start interactive app walkthrough"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Biometric Quick Lock */}
        <button
          type="button"
          onClick={onLockBiometric}
          title="Lock with Biometric Passkey"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#FFE566] hover:border-[#800020] transition-colors"
        >
          <Fingerprint className="w-4 h-4 text-[#FFE566]" />
        </button>

        {/* Notifications Bell with Persistent Sync Progress Indicator */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {isSyncing ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F27430] text-white text-[9px] font-bold flex items-center justify-center animate-spin">
                <RefreshCw className="w-2.5 h-2.5" />
              </span>
            ) : unreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F27430] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            ) : null}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-3 px-3.5 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications & Sync
                  </span>
                  {isSyncing && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F27430]/20 text-[#FFE566] border border-[#F27430]/40">
                      Syncing
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkNotificationsRead}
                    className="text-[11px] text-[#FFE566] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* PERSISTENT SYNCHRONIZATION PROGRESS INDICATOR CARD */}
              <div
                className={`mt-3 p-3 rounded-xl border transition-all ${
                  isSyncing
                    ? 'bg-zinc-950 border-[#F27430]/50 shadow-md shadow-[#800020]/20 ring-1 ring-[#F27430]/30'
                    : isOffline
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-zinc-950 border-zinc-800/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSyncing
                          ? 'bg-[#F27430]/20 text-[#FFE566]'
                          : isOffline
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F27430]" />
                      ) : isOffline ? (
                        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Cloud Synchronization</span>
                        {isSyncing && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F27430] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F27430]"></span>
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {isSyncing
                          ? 'Reconnection sync in progress'
                          : isOffline
                          ? 'Offline - Changes cached locally'
                          : 'Persistent Cloud State Active'}
                      </div>
                    </div>
                  </div>

                  {/* Percentage or Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isSyncing
                        ? 'bg-[#F27430]/20 text-[#FFE566] border border-[#F27430]/40'
                        : isOffline
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isOffline ? 'Offline' : `${syncProgress}%`}
                  </span>
                </div>

                {/* Progress Bar Gauge */}
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isSyncing
                        ? 'bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566]'
                        : isOffline
                        ? 'bg-amber-500/40 w-0'
                        : 'bg-emerald-500 w-full'
                    }`}
                    style={{ width: isOffline ? '0%' : `${syncProgress}%` }}
                  />
                </div>

                {/* Current Stage Status Message */}
                <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                  {syncStatusText}
                </p>

                {/* Bottom metadata and Sync Now action */}
                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>
                    {isSyncing
                      ? 'Synchronizing local cache...'
                      : syncStatus?.lastSyncedAt
                      ? `Last synced: ${new Date(syncStatus.lastSyncedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : 'Live sync active'}
                  </span>

                  <button
                    type="button"
                    onClick={onTriggerSync}
                    disabled={isSyncing || isOffline}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] font-semibold border border-zinc-700/80"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>
              </div>

              {/* Regular Notifications List */}
              <div className="mt-2 pt-2 border-t border-zinc-800/60">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-1 mb-1">
                  Recent Alerts
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-zinc-800/60 pr-1">
                  {regularNotifications.length === 0 ? (
                    <div className="text-center py-4 text-zinc-500 text-xs">
                      No new alerts
                    </div>
                  ) : (
                    regularNotifications.map((n) => (
                      <div key={n.id} className="py-2 px-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200">{n.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign In / Register Button (when not signed in) */}
        {!firebaseUser && (
          <button
            type="button"
            onClick={() => onOpenAuthModal?.('signup')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] hover:opacity-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#FFE566]" />
            <span className="hidden sm:inline">Sign Up / Sign In</span>
            <span className="sm:hidden">Account</span>
          </button>
        )}

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-900 transition-colors"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#800020]"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-zinc-800">
                <div className="font-bold text-xs text-white truncate">{userProfile.name}</div>
                <div className="text-[11px] text-zinc-400 truncate">{userProfile.email}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold">
                  {trialDetails?.isExpired ? (
                    <span className="text-rose-400 border-rose-800 bg-rose-950/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> TRIAL EXPIRED
                    </span>
                  ) : !trialDetails?.isPaid ? (
                    <span className="text-[#FFE566] border-[#800020] bg-[#800020]/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#F27430]" /> 7-DAY TRIAL ({trialDetails ? `${trialDetails.days}d left` : '7d'})
                    </span>
                  ) : (
                    <span className="text-emerald-400 border-emerald-800 bg-emerald-950/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-[#FFE566]" /> {userProfile.plan === 'YEARLY_199_99' ? 'ENTERPRISE PRO' : 'MONTHLY PRO'}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectView('settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" /> Account & Security
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('billing');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Subscription & Invoices
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView('landing');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 border-t border-zinc-800 mt-1"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Public Landing Page
              </button>

              {/* Firebase Authentication Section */}
              <div className="pt-2 px-3 pb-1 border-t border-zinc-800 mt-1 space-y-2">
                {firebaseUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut?.();
                      setShowUserMenu(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-rose-950/40 border border-zinc-700/80 hover:border-rose-500/50 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuthModal?.('signup');
                        setShowUserMenu(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] hover:opacity-95 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#FFE566]" />
                      <span>Sign In / Sign Up with Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSignInWithGoogle?.();
                        setShowUserMenu(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
