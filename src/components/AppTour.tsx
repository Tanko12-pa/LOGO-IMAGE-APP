import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  ScanEye,
  Scale,
  Palette,
  Fingerprint,
  SlidersHorizontal,
  Bot,
  Layers,
} from 'lucide-react';
import { NavView } from '../types';

interface AppTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: NavView) => void;
}

interface TourStep {
  title: string;
  tagline: string;
  description: string;
  view: NavView;
  icon: React.ElementType;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Single Panel Navigation',
    tagline: 'All Tools in One Intuitive Left-Hand Panel',
    description:
      'All creative functions are arranged cleanly in a single panel on the left side of the screen. You can collapse it for maximum workspace, or drag and drop to reorder frequently used tools.',
    view: 'dashboard',
    icon: Layers,
    highlights: ['Collapsible sidebar', 'Drag-and-drop tool customization', 'One-click quick actions'],
  },
  {
    title: 'Dual-Pipeline AI Logo Creator',
    tagline: '1, 4, or 8 Scalable Vector Concepts',
    description:
      'Generate production-ready vector logos with mathematical balance and high contrast. Includes live SVG code, transparent PNG exports, and an automated brand checklist (contrast, scalability, simplicity).',
    view: 'logo-generator',
    icon: Sparkles,
    highlights: ['Multi-concept generation (1, 4, or 8)', 'Export clean SVG & high-res PNG', 'Pre-flight design checklist'],
  },
  {
    title: 'Computer Vision & AR Overlays',
    tagline: 'Visual Analysis & Real-World Object Detection',
    description:
      'Upload any photograph or product snapshot. The Computer Vision engine detects prominent objects with bounding boxes, extracts dominant color palettes, and generates tailored vector logo and image prompts.',
    view: 'computer-vision',
    icon: ScanEye,
    highlights: ['Sub-50ms object recognition', 'Interactive AR bounding box overlays', 'Instant prompt extraction from imagery'],
  },
  {
    title: 'A2A with Judge Agent',
    tagline: 'Autonomous Creator & Judge Dual Orchestration',
    description:
      'Agent 1 (Creator) crafts the design specification. Agent 2 (Judge) audits contrast, trademark compliance, and vector geometry, self-maintaining and repairing any ambiguities before final rendering.',
    view: 'a2a-judge',
    icon: Scale,
    highlights: ['Autonomous dual-agent reasoning', 'Automated prompt self-healing & bug fixing', 'Scored compliance audit'],
  },
  {
    title: 'Brand Studio & Consistency',
    tagline: 'Signature Palette & Multi-Asset Alignment',
    description:
      'Maintain unified brand authority using our signature color system (#800020 burgundy, #F27430 tangerine, #FFE566 gold, #FFFFFF white). Generates primary marks, business card mockups, and social covers.',
    view: 'brand-studio',
    icon: Palette,
    highlights: ['Signature color harmony', 'Active Brand Kit toggle in all tools', 'Automated social media asset kits'],
  },
  {
    title: 'Biometric Passkey & Offline Mode',
    tagline: 'Uncompromising Security & Cloud Sync',
    description:
      'Secure sensitive designs with Face ID and Touch ID biometric passkeys. Core features work completely offline, caching all your designs and projects locally with automatic cloud backup synchronization.',
    view: 'settings',
    icon: Fingerprint,
    highlights: ['Touch ID & Face ID biometric lock', 'Full offline capability with local caching', 'Exportable JSON cloud backups'],
  },
  {
    title: 'Meet LOGMAGE AI Assistant',
    tagline: 'Your Conversational Design Advisor',
    description:
      'Need inspiration or prompt troubleshooting? Click the LOGMAGE button anytime in the top bar to ask design questions, refine color theory, or get instant prompts.',
    view: 'dashboard',
    icon: Bot,
    highlights: ['Context-aware design guidance', 'Instant prompt rewriting', 'Accessible anytime'],
  },
];

export const AppTour: React.FC<AppTourProps> = ({ isOpen, onClose, onNavigate }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigate(TOUR_STEPS[nextIdx].view);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigate(TOUR_STEPS[prevIdx].view);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566] blur-3xl opacity-30 pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Counter */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#800020] to-[#F27430] text-[#FFE566]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFE566]">
              Feature Tour • Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <h3 className="text-lg font-bold font-heading text-white">{currentStep.title}</h3>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#F27430] mb-2">{currentStep.tagline}</div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">{currentStep.description}</p>

        {/* Feature Highlights */}
        <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 space-y-2 mb-6">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Key Capabilities
          </div>
          {currentStep.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-200">
              <CheckCircle className="w-4 h-4 text-[#FFE566] shrink-0" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Dots & Nav Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  onNavigate(TOUR_STEPS[idx].view);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex ? 'w-6 bg-[#F27430]' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-md shadow-[#800020]/20 hover:opacity-90 flex items-center gap-1.5"
            >
              <span>{isLast ? 'Start Creating' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
