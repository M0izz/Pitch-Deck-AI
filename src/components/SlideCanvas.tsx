import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles
} from 'lucide-react';
import type { Slide } from '../types/pitch';

interface SlideCanvasProps {
  slide: Slide;
  totalSlides: number;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({ slide, totalSlides }) => {
  const content = slide.content as any;

  return (
    <div className="w-full space-y-3">
      {/* Editorial Review Note (if slide was revised by the audit loop) */}
      {slide.resolutionNote && (
        <div className="px-4 py-2.5 rounded-2xl bg-[#2A15C2] border border-[#FFCCD5]/40 flex items-center justify-between text-xs text-white shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFCCD5] flex-shrink-0" />
            <span>
              <strong className="text-[#FFCCD5] font-mono-micro uppercase tracking-wider font-bold">Editorial Review Note: </strong>
              {slide.resolutionNote}
            </span>
          </div>
          <span className="pill-badge text-[10px] py-0.5 px-2.5">
            Audit-Optimized
          </span>
        </div>
      )}

      {/* 16:9 Aspect Ratio Container */}
      <div
        id="active-pitch-slide-canvas"
        className="w-full bg-[#2A15C2] rounded-3xl border border-white/30 shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[580px] text-white"
      >
        {/* Slide Top Bar */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="pill-badge text-xs font-bold py-1 px-3">
              SLIDE {slide.slideNumber} / {totalSlides}
            </span>
            <span className="text-xs font-mono-micro font-bold text-white/90 uppercase tracking-widest">
              {slide.navTitle.replace(/^\d+\.\s*/, '')}
            </span>
            {slide.revisionCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#3823D9] text-[#FFCCD5] text-[11px] font-semibold border border-[#FFCCD5]/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#FFCCD5]" />
                Revised (v{slide.revisionCount + 1})
              </span>
            )}
          </div>

          {slide.groundedArchetypeCitation && (
            <div className="text-[11px] text-white/80 font-mono-micro flex items-center gap-1.5 bg-[#3823D9] px-3 py-1 rounded-xl border border-white/20">
              <Zap className="w-3.5 h-3.5 text-[#FFCCD5]" />
              <span className="font-bold text-[#FFCCD5]">Benchmark:</span>
              <span className="truncate max-w-[260px] sm:max-w-md">{slide.groundedArchetypeCitation}</span>
            </div>
          )}
        </div>

        {/* Slide Content Body */}
        <div className="flex-1 relative z-10 my-2">
          {/* 1. PROBLEM */}
          {slide.type === 'problem' && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-sm text-white/90 mt-1">{content.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {content.painPoints.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="w-7 h-7 rounded-lg bg-[#2A15C2] text-[#FFCCD5] flex items-center justify-center font-bold text-xs mb-3 border border-[#FFCCD5]/40">
                        0{idx + 1}
                      </div>
                      <h3 className="text-sm font-bold text-[#FFCCD5] mb-1.5">{p.title}</h3>
                      <p className="text-xs text-white/90 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/20">
                      <div className="text-[10px] text-white/60 font-mono-micro uppercase font-semibold">Quantified Impact</div>
                      <div className="text-xs font-bold text-[#FFCCD5] mt-0.5">{p.quantifiedLoss}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#3823D9] border border-white/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FFCCD5] flex-shrink-0" />
                  <span className="text-white/90"><strong className="text-[#FFCCD5]">Urgency Trigger:</strong> {content.urgencyTrigger}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SOLUTION */}
          {slide.type === 'solution' && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-sm text-white/90 font-medium mt-1">{content.tagline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {content.corePillars.map((pillar: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="w-7 h-7 rounded-lg bg-[#2A15C2] text-[#FFCCD5] flex items-center justify-center font-bold text-xs mb-3 border border-[#FFCCD5]/40">
                        0{idx + 1}
                      </div>
                      <h3 className="text-sm font-bold text-[#FFCCD5] mb-1">{pillar.name}</h3>
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#2A15C2] text-white text-[11px] font-semibold border border-white/30 mb-2">
                        {pillar.benefit}
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed">{pillar.howItWorks}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#3823D9] border border-white/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FFCCD5] flex-shrink-0" />
                  <span className="text-white/90"><strong className="text-[#FFCCD5]">Unfair Advantage / Moat:</strong> {content.secretSauce}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. MARKET SIZE (TAM / SAM / SOM) */}
          {slide.type === 'market_size' && (
            <div>
              <div className="mb-5">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="pill-badge text-xs py-0.5 px-2.5">
                    CAGR: {content.cagr}
                  </span>
                  <span className="text-xs text-white/80">{content.marketDescription}</span>
                </div>
              </div>

              {/* 3 Sizing Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 relative overflow-hidden shadow-lg">
                  <div className="text-xs font-mono-micro font-bold text-white/70 uppercase tracking-wider">TAM (Global Market)</div>
                  <div className="text-3xl font-extrabold text-white my-1">{content.tam.value}</div>
                  <p className="text-xs text-white/90 leading-relaxed">{content.tam.description}</p>
                  <div className="mt-2 text-[10px] text-white/60 font-mono-micro">{content.tam.methodology}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 relative overflow-hidden shadow-lg">
                  <div className="text-xs font-mono-micro font-bold text-white/70 uppercase tracking-wider">SAM (Serviceable Segment)</div>
                  <div className="text-3xl font-extrabold text-white my-1">{content.sam.value}</div>
                  <p className="text-xs text-white/90 leading-relaxed">{content.sam.description}</p>
                  <div className="mt-2 text-[10px] text-white/60 font-mono-micro">{content.sam.methodology}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#3823D9] border border-[#FFCCD5]/40 relative overflow-hidden shadow-lg">
                  <div className="text-xs font-mono-micro font-bold text-[#FFCCD5] uppercase tracking-wider">SOM (Beachhead 3-Yr)</div>
                  <div className="text-3xl font-extrabold text-[#FFCCD5] my-1">{content.som.value}</div>
                  <p className="text-xs text-white/90 leading-relaxed">{content.som.description}</p>
                  <div className="mt-2 text-[10px] text-[#FFCCD5] font-semibold font-mono-micro">{content.som.methodology}</div>
                </div>
              </div>

              {/* Bottom-up Formula Card */}
              <div className="p-3.5 rounded-2xl bg-[#3823D9] border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#FFCCD5]" />
                  <span className="text-xs font-mono-micro font-bold text-[#FFCCD5] uppercase tracking-wider">
                    Transparent Bottom-Up Beachhead Arithmetic
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs py-1">
                  <div className="bg-[#2A15C2] p-2.5 rounded-xl border border-white/20">
                    <span className="text-white/60 block text-[10px] font-mono-micro">Target Beachhead Volume</span>
                    <strong className="text-white">{content.bottomUpFormula.targetCustomers}</strong>
                  </div>
                  <div className="bg-[#2A15C2] p-2.5 rounded-xl border border-white/20">
                    <span className="text-white/60 block text-[10px] font-mono-micro">Annual Contract Value (ACV)</span>
                    <strong className="text-white">{content.bottomUpFormula.arpuAnnual}</strong>
                  </div>
                  <div className="bg-[#2A15C2] p-2.5 rounded-xl border border-white/20">
                    <span className="text-white/60 block text-[10px] font-mono-micro">Derived Beachhead Opportunity</span>
                    <strong className="text-[#FFCCD5]">{content.bottomUpFormula.derivedMarket}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-white/80 mt-1 italic">{content.bottomUpFormula.derivationStep}</p>
              </div>
            </div>
          )}

          {/* 4. BUSINESS MODEL */}
          {slide.type === 'business_model' && (
            <div>
              <div className="mb-5">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <span className="pill-badge text-xs py-0.5 px-2.5 mt-1">
                  Model: {content.modelType}
                </span>
              </div>

              {/* Pricing Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {content.pricingTiers.map((tier: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      tier.isPrimary
                        ? 'bg-[#3823D9] border-[#FFCCD5] shadow-xl'
                        : 'bg-[#3823D9]/80 border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#FFCCD5]">{tier.name}</span>
                        {tier.isPrimary && (
                          <span className="text-[9px] font-mono-micro font-bold px-2 py-0.5 rounded-full bg-[#FFCCD5] text-[#2612B0]">
                            CORE
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-extrabold text-white">{tier.price}</span>
                        <span className="text-xs text-white/60">{tier.period}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-white/90">
                        {tier.features.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFCCD5] flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unit Economics Bar */}
              <div className="p-3.5 rounded-2xl bg-[#3823D9] border border-white/20">
                <div className="text-[11px] font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] mb-2">
                  Institutional Unit Economics &amp; SaaS Efficiency Benchmarks
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#2A15C2] border border-white/20">
                    <span className="text-[10px] text-white/60 font-mono-micro block">Target CAC</span>
                    <strong className="text-white text-sm">{content.unitEconomics.cac}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#2A15C2] border border-white/20">
                    <span className="text-[10px] text-white/60 font-mono-micro block">Customer LTV</span>
                    <strong className="text-white text-sm">{content.unitEconomics.ltv}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#2A15C2] border border-white/20">
                    <span className="text-[10px] text-white/60 font-mono-micro block">LTV : CAC Ratio</span>
                    <strong className="text-[#FFCCD5] text-sm">{content.unitEconomics.ltvCacRatio}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#2A15C2] border border-white/20">
                    <span className="text-[10px] text-white/60 font-mono-micro block">CAC Payback</span>
                    <strong className="text-white text-sm">{content.unitEconomics.paybackMonths}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#2A15C2] border border-white/20">
                    <span className="text-[10px] text-white/60 font-mono-micro block">Gross Margin</span>
                    <strong className="text-white text-sm">{content.unitEconomics.grossMarginPercent}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. COMPETITION */}
          {slide.type === 'competition' && (
            <div>
              <div className="mb-4">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-xs text-white/80 mt-1 font-mono-micro">2x2 Strategic Positioning Matrix vs Incumbents</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                {/* 2x2 Matrix Canvas */}
                <div className="h-60 rounded-2xl bg-[#3823D9] border border-white/20 p-4 relative flex flex-col justify-between shadow-lg">
                  <div className="text-[10px] text-white/70 font-mono-micro text-center">{content.yAxisLabel}</div>
                  <div className="relative flex-1 my-2 border-b border-l border-white/30">
                    {/* Quadrant Lines */}
                    <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-white/20" />
                    <div className="absolute top-0 bottom-0 left-1/2 border-r border-dashed border-white/20" />

                    {/* Competitor Pins */}
                    {content.competitors.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        style={{ left: `${c.x}%`, top: `${100 - c.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#2A15C2] border border-white/40 flex items-center justify-center text-[8px] font-bold text-white shadow">
                          {idx + 1}
                        </div>
                        <div className="absolute left-4 top-0 bg-[#2A15C2] border border-white/25 px-2 py-0.5 rounded text-[10px] whitespace-nowrap text-white pointer-events-none">
                          {c.name}
                        </div>
                      </div>
                    ))}

                    {/* Our Platform Pin */}
                    <div
                      style={{ left: `${content.ourPosition.x}%`, top: `${100 - content.ourPosition.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FFCCD5] border-2 border-[#2612B0] flex items-center justify-center text-[11px] font-extrabold text-[#2612B0] shadow-xl">
                        ★
                      </div>
                      <div className="absolute left-7 top-0 bg-[#FFCCD5] text-[#2612B0] px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-md">
                        {content.ourPosition.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/70 font-mono-micro text-center">{content.xAxisLabel}</div>
                </div>

                {/* Defensibility Moats */}
                <div className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] block mb-2.5">
                      Structural Defensibility Moats
                    </span>
                    <ul className="space-y-2.5 text-xs text-white/90">
                      {content.defensibilityMoats.map((m: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#FFCCD5] flex-shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. GO-TO-MARKET */}
          {slide.type === 'go_to_market' && (
            <div>
              <div className="mb-4">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-xs text-white/80 mt-1 font-mono-micro">Core Motion: {content.salesMotion}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {content.primaryChannels.map((ch: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#FFCCD5]">{ch.channel}</span>
                      <span className="pill-badge text-[9px] py-0.5 px-2">
                        {ch.sharePercent}% share
                      </span>
                    </div>
                    <p className="text-xs text-white/90 mb-2">{ch.strategy}</p>
                    <div className="text-[10px] text-white/60 font-mono-micro">
                      Expected Blended CAC: <strong className="text-[#FFCCD5]">{ch.expectedCac}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phases */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.phases.map((ph: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#3823D9] border border-white/20">
                    <div className="text-[10px] font-mono-micro font-bold text-[#FFCCD5] uppercase">{ph.timeline}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{ph.phase}</div>
                    <div className="text-[11px] text-white/80 mt-1">{ph.targetMilestone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. TEAM */}
          {slide.type === 'team' && (
            <div>
              <div className="mb-4">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-xs text-white/80 mt-1">{content.teamRationale}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {content.members.map((m: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#2A15C2] border border-[#FFCCD5]/40 flex items-center justify-center text-[#FFCCD5] font-bold text-sm mb-2 shadow">
                        {m.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <h3 className="text-sm font-bold text-[#FFCCD5]">{m.name}</h3>
                      <div className="text-xs text-white/80 font-medium mb-1">{m.role}</div>
                      <div className="text-[11px] text-white font-semibold mb-2">{m.pedigree}</div>
                      <p className="text-xs text-white/90 leading-relaxed">{m.domainSuperpower}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-[#3823D9] border border-white/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#FFCCD5] font-mono-micro font-semibold">Key Advisory Board: </span>
                  <span className="text-white/90">
                    {content.advisors.map((a: any) => `${a.name} (${a.affiliation})`).join('  •  ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 8. FINANCIALS */}
          {slide.type === 'financials' && (
            <div>
              <div className="mb-4">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-xs text-[#FFCCD5] font-semibold mt-1">{content.breakevenTimeline}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
                <div className="lg:col-span-2 h-52 bg-[#3823D9] rounded-2xl p-3 border border-white/20 shadow-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={content.forecastYears} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="year" stroke="#ffffff" fontSize={11} />
                      <YAxis stroke="#ffffff" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#2A15C2', borderColor: '#FFCCD5', fontSize: '11px', color: '#ffffff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#ffffff' }} />
                      <Bar dataKey="revenue" name="Revenue ($M)" fill="#FFCCD5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses ($M)" fill="#ffffff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 flex flex-col justify-center">
                  {content.forecastYears.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#3823D9] border border-white/20 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#FFCCD5]">{f.year}</strong>
                        <div className="text-[10px] text-white/70 font-mono-micro">{f.customers} Accounts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{f.formattedRevenue} ARR</div>
                        <div className="text-[10px] text-[#FFCCD5] font-semibold">Margin: {f.grossMarginPercent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 9. TRACTION */}
          {slide.type === 'traction' && (
            <div>
              <div className="mb-4">
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                  {content.title}
                </h2>
                <p className="text-xs text-white/80 mt-1">{content.stageSummary}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {content.keyMetrics.map((kpi: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 text-center shadow-lg">
                    <div className="text-[10px] font-mono-micro font-bold text-white/70 uppercase tracking-wider">{kpi.label}</div>
                    <div className="text-2xl font-extrabold text-[#FFCCD5] my-1">{kpi.value}</div>
                    {kpi.growthRate && (
                      <span className="pill-badge text-[10px] py-0.5 px-2">
                        {kpi.growthRate}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 text-xs italic text-white/90">
                "{content.pilotOrCustomerProof}"
              </div>
            </div>
          )}

          {/* 10. FUNDING ASK */}
          {slide.type === 'funding_ask' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
                    {content.title}
                  </h2>
                  <p className="text-xs text-white/90 font-semibold mt-1 font-mono-micro">Runway: {content.runwayMonths}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/70 uppercase font-mono-micro font-semibold">Target Round</div>
                  <div className="text-2xl sm:text-4xl font-extrabold text-[#FFCCD5]">{content.targetAmount}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {content.useOfFunds.map((u: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#3823D9] border border-white/20 shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{u.category}</span>
                      <span className="text-xs font-extrabold text-[#FFCCD5]">{u.percentage}%</span>
                    </div>
                    <div className="text-sm font-bold text-[#FFCCD5] mb-1">{u.allocationAmount}</div>
                    <p className="text-xs text-white/90 leading-relaxed">{u.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#3823D9] border border-white/20">
                <div className="text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] mb-2">
                  Key Milestones Unlocked With This Round:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
                  {content.milestonesTargetedWithCapital.map((m: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FFCCD5] flex-shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Data Sources & Citations Footer Bar */}
        {slide.provenanceList && slide.provenanceList.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/20 relative z-10">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFCCD5]" />
                <span className="text-[10px] font-mono-micro font-bold uppercase tracking-widest text-[#FFCCD5]">
                  Market Research &amp; Industry Citations
                </span>
              </div>
              <span className="text-[9px] text-white/70 font-mono-micro">
                Verified against public filings &amp; industry reports
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {slide.provenanceList.map((p) => {
                const isHigh = p.confidenceScore >= 90;

                return (
                  <div
                    key={p.id}
                    className="px-2.5 py-1 rounded-lg border border-white/20 bg-[#3823D9] text-[10px] flex items-center gap-1.5 text-white/90 font-mono-micro"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isHigh ? 'bg-[#FFCCD5]' : 'bg-white'
                      }`}
                    />
                    <strong className="font-bold text-[#FFCCD5]">{p.confidenceScore}% conf:</strong>
                    <span className="opacity-90">{p.sourceLabel} —</span>
                    <span className="opacity-75 truncate max-w-xs">{p.claim}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
