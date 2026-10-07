import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Bot,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Code2,
  Zap,
} from 'lucide-react';
import { A2AJudgeResult, BrandKit, NavView } from '../../types';
import { apiService } from '../../services/apiService';

interface A2AJudgeViewProps {
  activeBrandKit: BrandKit;
  onNavigate: (view: NavView) => void;
}

export const A2AJudgeView: React.FC<A2AJudgeViewProps> = ({
  activeBrandKit,
  onNavigate,
}) => {
  const [promptInput, setPromptInput] = useState(
    'Create an iconic luxury crest logo for a quantum computing firm called NovaShield. High contrast, modern geometry, isolated vector paths.'
  );
  const [targetMode, setTargetMode] = useState<'logo' | 'image'>('logo');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [auditResult, setAuditResult] = useState<A2AJudgeResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunAudit = async () => {
    if (!promptInput.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await apiService.runA2AJudge(promptInput, targetMode, activeBrandKit);
      setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Initial audit run
  React.useEffect(() => {
    handleRunAudit();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE566]/20 border border-[#FFE566]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Autonomous Dual-Agent Orchestration & Self-Maintenance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            A2A Creator & Judge Agent Studio
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Simulate Creator & Judge dual AI agents collaborating in sequence to optimize design prompts, enforce strict vector constraints, and self-heal syntax ambiguities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#FFE566] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Self-Healing Engine: Active</span>
          </div>
        </div>
      </div>

      {/* Input Brief Section */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider">
            User Intent & Creative Brief
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTargetMode('logo')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                targetMode === 'logo'
                  ? 'bg-[#800020] text-white border border-[#F27430]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Vector Logo
            </button>
            <button
              type="button"
              onClick={() => setTargetMode('image')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                targetMode === 'image'
                  ? 'bg-[#800020] text-white border border-[#F27430]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Cinematic Image
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Enter the raw prompt or design script to be evaluated by the Judge Agent..."
          className="w-full p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430] leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-zinc-400 font-mono">
            Active Brand Kit: <strong className="text-white">{activeBrandKit.name}</strong> (#800020, #F27430, #FFE566)
          </span>

          <button
            type="button"
            onClick={handleRunAudit}
            disabled={isEvaluating || !promptInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white text-xs font-bold shadow-lg shadow-[#800020]/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFE566]" />
                <span>Running A2A Evaluation...</span>
              </>
            ) : (
              <>
                <Scale className="w-3.5 h-3.5 text-[#FFE566]" />
                <span>Execute A2A Judge Audit & Self-Repair</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit & Execution Breakdown */}
      {auditResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Agent 1: Creator Draft & Agent 2: Judge Audit (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Creator Agent Card */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#800020] text-[#FFE566]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Agent 1: Creator Agent
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Initial Creative Draft</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800/80 font-mono leading-relaxed">
                {auditResult.creatorDraft}
              </p>
            </div>

            {/* Judge Agent Audit Breakdown */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FFE566]/20 text-[#FFE566]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Agent 2: Judge Agent Audit
                    </h3>
                    <span className="text-[10px] text-zinc-400 font-mono">Quality & Compliance Review</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
                  {auditResult.judgeAudit.score} / 100
                </div>
              </div>

              {/* Score Meters */}
              <div className="space-y-3 pt-2">
                {Object.entries(auditResult.judgeAudit.breakdown).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-400 capitalize">
                        {key.replace(/Score|Score/, '')}
                      </span>
                      <span className="text-[#FFE566] font-bold">{val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566]"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detected Ambiguities & Bugs */}
              <div className="space-y-2 pt-3 border-t border-zinc-900">
                <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Detected Design Risks Prior to Healing:
                </span>
                <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                  {auditResult.judgeAudit.detectedIssues.map((issue, idx) => (
                    <li key={idx} className="text-zinc-300">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Self-Healing Actions & Final Approved Prompt (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Self-Healing Actions Applied */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Self-Maintenance Patches Applied
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Automated Code & Prompt Repair</span>
                </div>
              </div>

              <div className="space-y-2">
                {auditResult.judgeAudit.selfHealingActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Certified Prompt */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#800020] to-[#F27430] text-[#FFE566]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Final Certified Prompt
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-mono">Production Ready (95+ Rating)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(auditResult.finalApprovedPrompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono leading-relaxed select-all">
                {auditResult.finalApprovedPrompt}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-zinc-500">Geometry</div>
                  <div className="text-white font-bold truncate">
                    {auditResult.technicalSpecs.vectorGeometry}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-zinc-500">Aspect Ratio</div>
                  <div className="text-white font-bold truncate">
                    {auditResult.technicalSpecs.recommendedAspectRatio}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(targetMode === 'logo' ? 'logo-generator' : 'image-generator')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white text-xs font-bold shadow-lg shadow-[#800020]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Generation with Certified Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
