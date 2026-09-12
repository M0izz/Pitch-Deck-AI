import React from 'react';
import {
  Sparkles,
  Bot,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react';
import type { SlideRevisionDiff } from '../types/pitch';

interface BeforeAfterDiffProps {
  diffs: SlideRevisionDiff[];
}

export const BeforeAfterDiff: React.FC<BeforeAfterDiffProps> = ({ diffs }) => {
  if (!diffs || diffs.length === 0) {
    return (
      <div className="w-full bg-[#11162C] rounded-3xl p-10 text-center border border-white/10 shadow-2xl text-white">
        <Bot className="w-12 h-12 text-[#FFCCD5] mx-auto mb-3 opacity-70" />
        <h3 className="text-xl font-bold text-white mb-1 font-display">
          No Slide Revisions Triggered
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
          The initial draft met all institutional thresholds (&gt;85/100) without critical red flags.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-[#4D44FF]/15 text-[#A5B4FC] border border-[#4D44FF]/30 mb-2 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCCD5]" />
            Autonomous Multi-Agent Self-Correction Loop
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-poster tracking-wide">
            Before &amp; After Agentic Refinement Diff
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Comparing initial drafts against autonomous revisions triggered by VC Critic partner objections.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {diffs.map((diff, idx) => (
          <div
            key={idx}
            className="bg-[#11162C] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden text-white"
          >
            {/* Header / Trigger Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-[#4D44FF] text-white font-mono text-xs font-extrabold shadow-sm">
                  SLIDE 0{diff.slideNumber} • {diff.slideType.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-[#05F1CD] flex items-center gap-1 bg-[#05F1CD]/10 px-3 py-1 rounded-xl border border-[#05F1CD]/30 font-mono">
                  <TrendingUp className="w-3.5 h-3.5 text-[#05F1CD]" />
                  Score Delta: +{diff.scoreDelta} pts
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#181E38] px-3.5 py-1.5 rounded-xl border border-white/10 max-w-xl font-mono">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="truncate">
                  <strong className="text-amber-400 font-bold">Trigger Objection: </strong>
                  {diff.triggerObjection}
                </span>
              </div>
            </div>

            {/* Actions Taken by Swarm */}
            <div className="mb-5 bg-[#181E38] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-[#A5B4FC] uppercase tracking-widest block mb-2 font-mono">
                Autonomous Refinement Actions Executed:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {diff.agenticActionsTaken.map((action, aIdx) => (
                  <li key={aIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#05F1CD] flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Side-by-Side Diff Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Draft v1 */}
              <div className="p-5 rounded-2xl bg-[#181E38] border border-white/10 relative shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Draft v1 (Initial Heuristic Output)
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">
                    Flagged by VC
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono bg-[#0D1122] p-4 rounded-xl overflow-x-auto max-h-56 leading-relaxed border border-white/10">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(diff.originalDraft.content, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Revised v2 */}
              <div className="p-5 rounded-2xl bg-[#181E38] border border-[#05F1CD]/30 relative shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 text-[#05F1CD]" />
                    Revised v2 (Grounded &amp; Defended)
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#05F1CD] text-[#090C19] font-mono font-black">
                    Verified &amp; Passed
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-mono bg-[#0D1122] p-4 rounded-xl overflow-x-auto max-h-56 leading-relaxed border border-white/10">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(diff.revisedVersion.content, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
