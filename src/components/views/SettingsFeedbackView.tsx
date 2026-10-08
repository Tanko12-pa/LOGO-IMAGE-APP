import React, { useState } from 'react';
import {
  Settings,
  Fingerprint,
  Moon,
  Eye,
  Volume2,
  HardDrive,
  Download,
  Upload,
  MessageSquareHeart,
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
  Bell,
  BellRing,
  Sliders,
  Share2,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Key,
  Smartphone,
  Check,
  Send,
  HelpCircle,
  Accessibility,
  CreditCard,
} from 'lucide-react';
import { UserProfile, CustomInstructions, NotificationPreferences } from '../../types';
import { storageService } from '../../services/storageService';

interface SettingsFeedbackViewProps {
  mode: 'settings' | 'feedback';
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onTriggerBiometricSetup: () => void;
}

export const SettingsFeedbackView: React.FC<SettingsFeedbackViewProps> = ({
  mode,
  userProfile,
  onUpdateProfile,
  onTriggerBiometricSetup,
}) => {
  const [activeTab, setActiveTab] = useState<
    'custom-instructions' | 'feedback' | 'notifications' | 'security' | 'accessibility' | 'deploy'
  >(mode === 'feedback' ? 'feedback' : 'custom-instructions');

  // Custom Instructions state
  const [customInstructions, setCustomInstructions] = useState<CustomInstructions>(() =>
    storageService.getCustomInstructions()
  );
  const [customSavedMessage, setCustomSavedMessage] = useState(false);

  // Notification Preferences state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() =>
    storageService.getNotificationPreferences()
  );

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Logo Quality');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState(userProfile.email);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Profile & System state
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [highContrast, setHighContrast] = useState(userProfile.highContrast);
  const [screenReader, setScreenReader] = useState(userProfile.screenReaderOptimized);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  const appShareUrl = window.location.origin;

  const handleSaveCustomInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveCustomInstructions(customInstructions);
    setCustomSavedMessage(true);
    storageService.addNotification({
      title: 'Custom Instructions Saved',
      message: 'Gemini and Veo 3 generation pipelines updated with your design rules.',
      type: 'success',
    });
    setTimeout(() => setCustomSavedMessage(false), 2500);
  };

  const handleToggleNotificationPref = (key: keyof NotificationPreferences) => {
    const updated = {
      ...notificationPrefs,
      [key]: !notificationPrefs[key],
    };
    setNotificationPrefs(updated);
    storageService.saveNotificationPreferences(updated);
  };

  const handleTestPushNotification = () => {
    storageService.addNotification({
      title: 'Push Notification Test',
      message: 'Push alert channels configured successfully. You will receive real-time updates.',
      type: 'info',
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name,
      email,
      highContrast,
      screenReaderOptimized: screenReader,
    };
    onUpdateProfile(updated);
    storageService.addNotification({
      title: 'Profile Updated',
      message: 'Your workspace preferences were saved.',
      type: 'success',
    });
  };

  const handleExportBackup = () => {
    const json = storageService.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logo-image-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = storageService.importBackupJson(text);
        if (success) {
          setImportStatus('Backup restored successfully! Refreshing state...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    storageService.addNotification({
      title: 'Feedback Received',
      message: `Thank you for rating our ${feedbackCategory}. Your suggestions directly influence our upcoming AI updates.`,
      type: 'success',
    });
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(appShareUrl);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/25 border border-[#800020]/50 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Settings, Custom Instructions & User Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Workspace Configuration
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Customize AI instructions, configure push notifications, verify biometric security, submit user feedback, and deploy your live app.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('custom-instructions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'custom-instructions'
              ? 'bg-[#800020] text-white border border-[#F27430]'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
          <span>Custom Instructions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'bg-[#800020] text-white border border-[#F27430]'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#F27430]" />
          <span>Dedicated Feedback Form</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-[#800020] text-white border border-[#F27430]'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-[#FFE566]" />
          <span>Push Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#800020] text-white border border-[#F27430]'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
          <span>Biometric & Auth</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deploy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'deploy'
              ? 'bg-[#800020] text-white border border-[#F27430]'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Deploy & Share</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accessibility')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'accessibility'
              ? 'bg-[#800020] text-white border border-[#F27430]'
              : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Accessibility className="w-3.5 h-3.5 text-sky-400" />
          <span>WCAG Accessibility</span>
        </button>
      </div>

      {/* 1. CUSTOM INSTRUCTIONS TAB */}
      {activeTab === 'custom-instructions' && (
        <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFE566]" />
                Custom Instructions for Gemini
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Save custom instructions to define app styles, frameworks, or other preferences to ensure Gemini builds exactly what you have in mind.
              </p>
            </div>
            {customSavedMessage && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" /> Saved & Active
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCustomInstructions} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">App Design & Visual Style</label>
              <input
                type="text"
                value={customInstructions.appStyle}
                onChange={(e) =>
                  setCustomInstructions({ ...customInstructions, appStyle: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                placeholder="e.g. Sleek dark mode, brutalist typography, geometric symmetry"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Brand Voice & Persona</label>
              <input
                type="text"
                value={customInstructions.brandVoice}
                onChange={(e) =>
                  setCustomInstructions({ ...customInstructions, brandVoice: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                placeholder="e.g. Authoritative, modern, premium, minimalist"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Color Palette Directives (#800020, #FFFFFF, #FFE566, #F27430)
              </label>
              <input
                type="text"
                value={customInstructions.colorPreferences}
                onChange={(e) =>
                  setCustomInstructions({ ...customInstructions, colorPreferences: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Negative Prompts (What to avoid)</label>
              <input
                type="text"
                value={customInstructions.negativePrompts}
                onChange={(e) =>
                  setCustomInstructions({ ...customInstructions, negativePrompts: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                placeholder="e.g. blurry, raster noise, low-res, clunky gradients"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="strictVector"
                checked={customInstructions.strictVectorGeometry}
                onChange={(e) =>
                  setCustomInstructions({
                    ...customInstructions,
                    strictVectorGeometry: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded accent-[#800020]"
              />
              <label htmlFor="strictVector" className="text-xs text-zinc-300 font-medium">
                Enforce strict vector geometry (mathematically closed SVG paths, transparent backgrounds)
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white font-bold text-xs shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFE566]" />
                <span>Save Custom Instructions</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. DEDICATED FEEDBACK FORM TAB */}
      {activeTab === 'feedback' && (
        <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#F27430]" />
                Dedicated Feedback & Support Form
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Help us refine our Computer Vision, Logo Generator, and Veo 3 video engine. Your input directly influences future updates.
              </p>
            </div>
          </div>

          {feedbackSubmitted ? (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Thank you for your feedback!</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Your report has been logged and queued for our AI Studio evaluation team.
              </p>
              <button
                type="button"
                onClick={() => setFeedbackSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-white font-medium hover:bg-zinc-700 transition-colors"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-5" aria-label="Feedback submission form">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">How would you rate your experience?</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1.5 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackRating
                            ? 'text-[#FFE566] fill-[#FFE566]'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-zinc-400 ml-2">
                    {feedbackRating === 5
                      ? 'Exceptional (5/5)'
                      : feedbackRating === 4
                      ? 'Great (4/5)'
                      : feedbackRating === 3
                      ? 'Average (3/5)'
                      : 'Needs Work'}
                  </span>
                </div>
              </div>

              {/* Feedback Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Feedback Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Logo Quality', 'Computer Vision & AR', 'Veo 3 Video Studio', 'Accessibility & UI'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFeedbackCategory(cat)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          feedbackCategory === cat
                            ? 'bg-[#800020] text-white border-[#F27430]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Comments Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Detailed Feedback or Issue Description</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share details about what worked well or what we should improve..."
                  className="w-full p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white font-bold text-xs shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#FFE566]" />
                  <span>Submit User Feedback</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. PUSH NOTIFICATIONS CONFIGURATION TAB */}
      {activeTab === 'notifications' && (
        <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#FFE566]" />
                Push Notification Alerts & Visualization
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Configure real-time push alerts for generations, new features, and A2A compliance audits.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestPushNotification}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3 h-3 text-[#FFE566]" />
              <span>Test Push Notification</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white">New Feature & Model Releases</div>
                <div className="text-[11px] text-zinc-400">
                  Receive alerts when Gemini 3.8 Flash or Veo 3 updates are deployed.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.newFeatures}
                onChange={() => handleToggleNotificationPref('newFeatures')}
                className="w-5 h-5 rounded accent-[#800020]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white">Successful Generation Alerts</div>
                <div className="text-[11px] text-zinc-400">
                  Instant push feedback when 8K images or Veo 3 videos finish rendering.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.successfulGenerations}
                onChange={() => handleToggleNotificationPref('successfulGenerations')}
                className="w-5 h-5 rounded accent-[#800020]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white">A2A Compliance & Audit Warnings</div>
                <div className="text-[11px] text-zinc-400">
                  Notifies when contrast scores or trademark checks require remediation.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.complianceAlerts}
                onChange={() => handleToggleNotificationPref('complianceAlerts')}
                className="w-5 h-5 rounded accent-[#800020]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white">Sound Effects & Haptics</div>
                <div className="text-[11px] text-zinc-400">
                  Chime audio feedback on mobile and desktop generation triggers.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.soundEnabled}
                onChange={() => handleToggleNotificationPref('soundEnabled')}
                className="w-5 h-5 rounded accent-[#800020]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SECURITY & BIOMETRIC TAB */}
      {activeTab === 'security' && (
        <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-purple-400" />
                Biometric Login & End-to-End Encryption
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Protect sensitive brand kits, cloud vector keys, and export pipelines with Touch ID, Face ID, and Google Authentication.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
              Hardware Enclave Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#F27430]" />
                  Biometric Passkey (Touch ID / Face ID)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Configured</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Biometric credentials are encrypted and stored inside local hardware passkeys for instant unlocking without password entry.
              </p>
              <button
                type="button"
                onClick={onTriggerBiometricSetup}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-md hover:opacity-95 transition-all"
              >
                Test Biometric Verification
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#FFE566]" />
                  Firebase Firestore & Authentication
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Connected
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Real-time multi-device cloud synchronization with Zero-Trust ABAC security rules and Google Authentication.
              </p>
              <div className="space-y-1 text-[11px] font-mono bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <div className="text-zinc-400 flex justify-between">
                  <span>Firebase Infrastructure:</span>
                  <span className="text-zinc-200">Server-Side Cloud Managed</span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Firestore DB:</span>
                  <span className="text-[#FFE566]">
                    Protected & Encrypted
                  </span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Rules Status:</span>
                  <span className="text-emerald-400">Deployed & Hardened</span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Current User:</span>
                  <span className="text-[#F27430] truncate max-w-[200px]">{userProfile.email}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#009cde]" />
                  PayPal Subscriptions & Environment
                </span>
                <span className="text-[10px] font-mono text-[#009cde] bg-[#0070ba]/10 px-2 py-0.5 rounded border border-[#0070ba]/30">
                  REST Configured
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Billing environment variables configured securely on server for recurring subscriptions ($19.99/mo & $199.99/yr) and catalog product synchronization.
              </p>
              <div className="space-y-1 text-[11px] font-mono bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <div className="text-zinc-400 flex justify-between">
                  <span>Payment Gateway:</span>
                  <span className="text-zinc-200">PayPal REST API</span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Secrets Security:</span>
                  <span className="text-emerald-400">Protected Server-Side</span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Monthly Subscription:</span>
                  <span className="text-[#FFE566]">$19.99/mo (600 Credits)</span>
                </div>
                <div className="text-zinc-400 flex justify-between">
                  <span>Yearly Subscription:</span>
                  <span className="text-emerald-400">$199.99/yr (7,500 Credits)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DEPLOY & SHARE TAB */}
      {activeTab === 'deploy' && (
        <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                Deploy & Share Your Applet
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Go from idea to live application in seconds. Share your live URL to test with users or scan with mobile devices.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
              Live & Cloud-Ready
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Shareable Live Applet URL:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appShareUrl}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-[#FFE566] select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyShareUrl}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-bold shrink-0 shadow-md hover:opacity-95 transition-all"
              >
                {copiedShareUrl ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-[#FFE566] shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Mobile PWA Ready</div>
                  <div className="text-zinc-400 mt-0.5">
                    Open in Safari (iOS) or Chrome (Android) and tap "Add to Home Screen".
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Offline Synced</div>
                  <div className="text-zinc-400 mt-0.5">
                    Generations and brand kits remain accessible even without internet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. WCAG ACCESSIBILITY TAB */}
      {activeTab === 'accessibility' && (
        <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-sky-400" />
                WCAG 2.1 Accessibility & Usability Controls
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Optimized for screen readers, high-contrast environments, and touch-friendly controls across all mobile and tablet screen sizes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white">High Contrast Interface Mode</div>
                <div className="text-[11px] text-zinc-400">
                  Boosts text borders and luminance ratios to exceed WCAG AAA standards.
                </div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-5 h-5 rounded accent-[#800020]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white">Screen Reader Optimization</div>
                <div className="text-[11px] text-zinc-400">
                  Injects ARIA live regions and semantic headings for assistive software.
                </div>
              </div>
              <input
                type="checkbox"
                checked={screenReader}
                onChange={(e) => setScreenReader(e.target.checked)}
                className="w-5 h-5 rounded accent-[#800020]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white font-bold text-xs shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all"
              >
                Save Accessibility Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
