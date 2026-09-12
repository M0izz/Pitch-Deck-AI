import React from 'react';
import {
  HelpCircle,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import type { VCCritiqueResult, VCPersona } from '../types/pitch';
import { VC_PERSONAS } from '../agents/criticAgent';

interface VCAuditPanelProps {
  critique: VCCritiqueResult;
  activePersona: VCPersona;
  onSelectPersona: (p: VCPersona) => void;
}

export const VCAuditPanel: React.FC<VCAuditPanelProps> = ({
  critique,
  activePersona,
  onSelectPersona,
}) => {
  const currentPersona = VC_PERSONAS[activePersona];

  return (
    <div className="w-full space-y-6">
      {/* Header & Persona Selector Bar */}
      <div className="bg-[#11162C] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Active Persona Card */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#4D44FF]/20 text-[#A5B4FC] border border-[#4D44FF]/40 flex items-center justify-center font-poster text-3xl font-bold flex-shrink-0 shadow-lg">
              {currentPersona.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold text-white font-display tracking-tight">{currentPersona.name}</h2>
                <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest bg-[#4D44FF]/15 text-[#A5B4FC] border border-[#4D44FF]/30 font-mono">
                  {currentPersona.title}
                </span>
              </div>
              <p className="text-xs text-[#05F1CD] font-mono tracking-wider mt-1 uppercase">{currentPersona.firmType}</p>
              <p className="text-sm text-slate-300 mt-2.5 max-w-xl italic font-sans leading-relaxed">
                "{currentPersona.evaluationBias}"
              </p>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-5 bg-[#0D1122] p-5 rounded-2xl border border-white/10 lg:min-w-[280px] justify-between shadow-inner">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">
                Readiness Score
              </div>
              <div className="text-4xl font-extrabold text-[#05F1CD] tracking-tight font-poster">
                {critique.overallScore}<span className="text-xl text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5 tracking-wider uppercase font-mono">
                {critique.verdict}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#05F1CD]/10 text-[#05F1CD] border border-[#05F1CD]/30 shadow-md">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="mt-8 pt-5 border-t border-white/10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFCCD5] font-mono block mb-3">
            Switch Evaluation Persona:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(VC_PERSONAS).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activePersona === p.id
                    ? 'bg-[#4D44FF] border-[#6A62FF] text-white shadow-xl scale-[1.02] font-bold'
                    : 'bg-[#181E38] border-white/10 text-slate-300 hover:text-white hover:bg-[#1E2548]'
                }`}
              >
                <div className={`text-xs font-bold font-display ${activePersona === p.id ? 'text-white' : 'text-slate-200'}`}>{p.name}</div>
                <div className={`text-[10px] truncate mt-0.5 font-mono ${activePersona === p.id ? 'text-white/80' : 'text-slate-400'}`}>{p.firmType.split('(')[0].trim()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Scores Breakdown */}
      <div className="bg-[#11162C] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#A5B4FC] mb-5 flex items-center gap-2 font-mono">
          <TrendingUp className="w-4 h-4 text-[#05F1CD]" />
          5-Dimension Institutional Evaluation Rubric
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { label: 'Market Opportunity (TAM)', score: critique.categoryScores.marketOpportunity },
            { label: 'Defensibility & Moat', score: critique.categoryScores.defensibilityAndMoat },
            { label: 'Unit Economics Rigor', score: critique.categoryScores.unitEconomicsRigor },
            { label: 'GTM Execution Clarity', score: critique.categoryScores.gtmExecutionClarity },
            { label: 'Ask & Runway Logic', score: critique.categoryScores.askAndRunwayLogic },
          ].map((cat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#181E38] border border-white/10 flex flex-col justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1 font-mono uppercase tracking-wider">
                  {cat.label}
                </span>
                <div className="text-3xl font-extrabold text-white font-poster">
                  {cat.score}<span className="text-sm text-slate-400 font-normal">/100</span>
                </div>
              </div>
              <div className="w-full bg-[#0D1122] rounded-full h-2 mt-4 overflow-hidden border border-white/10">
                <div
                  className="bg-[#05F1CD] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tough Partner Objections Drills */}
      <div className="bg-[#11162C] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5] mb-5 flex items-center gap-2 font-mono">
          <HelpCircle className="w-4 h-4 text-[#FFCCD5]" />
          Partner Meeting Drill: Hard Questions &amp; Recommended Answers
        </h3>

        <div className="space-y-4">
          {critique.partnerObjections.map((obj, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#181E38] border border-white/10 shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-[#4D44FF]/20 text-[#A5B4FC] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-mono shadow-sm border border-[#4D44FF]/30">
                  Q{idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-white mb-1.5 font-display">{obj.question}</h4>
                  <p className="text-xs text-amber-300/90 mb-3.5 italic">
                    <strong className="text-slate-300 font-semibold">Why the VC is asking: </strong>
                    {obj.objectionContext}
                  </p>
                  <div className="p-4 rounded-xl bg-[#0D1122] border border-white/10 text-xs text-slate-200 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-[#05F1CD] mb-1 font-mono uppercase tracking-wider text-[10px]">
                      <Zap className="w-3.5 h-3.5 text-[#05F1CD]" />
                      Recommended Response &amp; Narrative Pivot:
                    </div>
                    {obj.suggestedRemedy}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
