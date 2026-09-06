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
      <div className="bg-[#2A15C2]/95 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Active Persona Card */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFCCD5] text-[#2612B0] border border-white/30 flex items-center justify-center font-poster text-3xl font-bold flex-shrink-0 shadow-lg">
              {currentPersona.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold text-white font-display tracking-tight">{currentPersona.name}</h2>
                <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest bg-[#3823D9] text-[#FFCCD5] border border-[#FFCCD5]/40 font-mono">
                  {currentPersona.title}
                </span>
              </div>
              <p className="text-xs text-[#FFCCD5]/80 font-mono tracking-wider mt-1 uppercase">{currentPersona.firmType}</p>
              <p className="text-sm text-white/90 mt-2.5 max-w-xl italic font-sans leading-relaxed">
                "{currentPersona.evaluationBias}"
              </p>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-5 bg-[#1E0E99]/90 p-5 rounded-2xl border border-white/20 lg:min-w-[280px] justify-between shadow-inner">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#FFCCD5]/80 tracking-widest font-mono">
                Readiness Score
              </div>
              <div className="text-4xl font-extrabold text-[#FFCCD5] tracking-tight font-poster">
                {critique.overallScore}<span className="text-xl text-white/60 font-normal">/100</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5 tracking-wider uppercase font-mono">
                {critique.verdict}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFCCD5] text-[#2612B0] shadow-md">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="mt-8 pt-5 border-t border-white/15">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFCCD5] font-mono block mb-3">
            Switch Evaluation Persona:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(VC_PERSONAS).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activePersona === p.id
                    ? 'bg-[#FFCCD5] border-[#FFCCD5] text-[#2612B0] shadow-lg scale-[1.02] font-bold'
                    : 'bg-[#3823D9]/80 border-white/20 text-white hover:text-[#FFCCD5] hover:bg-[#432EEB]'
                }`}
              >
                <div className={`text-xs font-bold font-display ${activePersona === p.id ? 'text-[#2612B0]' : 'text-white'}`}>{p.name}</div>
                <div className={`text-[10px] truncate mt-0.5 font-mono ${activePersona === p.id ? 'text-[#2612B0]/80' : 'text-[#FFCCD5]/70'}`}>{p.firmType.split('(')[0].trim()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Scores Breakdown */}
      <div className="bg-[#2A15C2]/95 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-white">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5] mb-5 flex items-center gap-2 font-mono">
          <TrendingUp className="w-4 h-4 text-[#FFCCD5]" />
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
            <div key={idx} className="p-4 rounded-2xl bg-[#3823D9]/90 border border-white/20 flex flex-col justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold text-[#FFCCD5]/90 block mb-1 font-mono uppercase tracking-wider">
                  {cat.label}
                </span>
                <div className="text-3xl font-extrabold text-white font-poster">
                  {cat.score}<span className="text-sm text-[#FFCCD5]/70 font-normal">/100</span>
                </div>
              </div>
              <div className="w-full bg-[#1E0E99] rounded-full h-2 mt-4 overflow-hidden border border-white/10">
                <div
                  className="bg-[#FFCCD5] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tough Partner Objections Drills */}
      <div className="bg-[#2A15C2]/95 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-white">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5] mb-5 flex items-center gap-2 font-mono">
          <HelpCircle className="w-4 h-4 text-[#FFCCD5]" />
          Partner Meeting Drill: Hard Questions &amp; Recommended Answers
        </h3>

        <div className="space-y-4">
          {critique.partnerObjections.map((obj, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#3823D9]/90 border border-white/20 shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-[#FFCCD5] text-[#2612B0] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-mono shadow-sm">
                  Q{idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-white mb-1.5 font-display">{obj.question}</h4>
                  <p className="text-xs text-[#FFCCD5]/90 mb-3.5 italic">
                    <strong className="text-white font-semibold">Why the VC is asking: </strong>
                    {obj.objectionContext}
                  </p>
                  <div className="p-4 rounded-xl bg-[#1E0E99]/95 border border-white/15 text-xs text-white leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-[#FFCCD5] mb-1 font-mono uppercase tracking-wider text-[10px]">
                      <Zap className="w-3.5 h-3.5 text-[#FFCCD5]" />
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
