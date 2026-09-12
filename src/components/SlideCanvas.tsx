import React, { useState } from 'react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line
} from 'recharts';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Palette,
  Sun,
  Moon,
  Flame
} from 'lucide-react';
import type { Slide } from '../types/pitch';

export type SlideThemePreset = 'graphite' | 'light' | 'midnight' | 'aurora';

interface SlideCanvasProps {
  slide: Slide;
  totalSlides: number;
  activeTheme?: SlideThemePreset;
  onThemeChange?: (theme: SlideThemePreset) => void;
  hideThemeBar?: boolean;
}

export const THEMES: Record<SlideThemePreset, {
  id: SlideThemePreset;
  name: string;
  bgClass: string;
  cardClass: string;
  subCardClass: string;
  borderClass: string;
  textPrimary: string;
  textMuted: string;
  textHighlight: string;
  accentColor: string;
  chartTextColor: string;
  chartColors: string[];
}> = {
  graphite: {
    id: 'graphite',
    name: 'Graphite Dark',
    bgClass: 'bg-[#0F172A]',
    cardClass: 'bg-[#1E293B] border-slate-700/60 shadow-lg',
    subCardClass: 'bg-[#162032] border-slate-700/40',
    borderClass: 'border-slate-700/60',
    textPrimary: 'text-white',
    textMuted: 'text-slate-300',
    textHighlight: 'text-[#38BDF8]',
    accentColor: '#38BDF8',
    chartTextColor: '#94A3B8',
    chartColors: ['#38BDF8', '#818CF8', '#05F1CD', '#F59E0B']
  },
  light: {
    id: 'light',
    name: 'Executive Light',
    bgClass: 'bg-[#F8FAFC]',
    cardClass: 'bg-white border-slate-200 shadow-md',
    subCardClass: 'bg-slate-50 border-slate-200',
    borderClass: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textMuted: 'text-slate-600',
    textHighlight: 'text-[#2563EB]',
    accentColor: '#2563EB',
    chartTextColor: '#475569',
    chartColors: ['#2563EB', '#7C3AED', '#059669', '#D97706']
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Cobalt',
    bgClass: 'bg-[#0A0F29]',
    cardClass: 'bg-[#131B45] border-[#4D44FF]/30 shadow-lg',
    subCardClass: 'bg-[#0E1436] border-white/10',
    borderClass: 'border-[#4D44FF]/30',
    textPrimary: 'text-white',
    textMuted: 'text-slate-300',
    textHighlight: 'text-[#05F1CD]',
    accentColor: '#05F1CD',
    chartTextColor: '#CBD5E1',
    chartColors: ['#4D44FF', '#05F1CD', '#FFCCD5', '#F59E0B']
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Gradient',
    bgClass: 'bg-gradient-to-br from-[#161238] via-[#0B112C] to-[#0A1A33]',
    cardClass: 'bg-[#151D42]/85 border-white/15 backdrop-blur-md shadow-xl',
    subCardClass: 'bg-[#0F1532]/90 border-white/10',
    borderClass: 'border-white/15',
    textPrimary: 'text-white',
    textMuted: 'text-slate-200',
    textHighlight: 'text-[#FFCCD5]',
    accentColor: '#FFCCD5',
    chartTextColor: '#E2E8F0',
    chartColors: ['#FFCCD5', '#38BDF8', '#A78BFA', '#05F1CD']
  }
};

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  totalSlides,
  activeTheme: externalTheme,
  onThemeChange,
  hideThemeBar = false
}) => {
  const [localTheme, setLocalTheme] = useState<SlideThemePreset>('graphite');
  const currentThemeKey = externalTheme || localTheme;
  const theme = THEMES[currentThemeKey];

  const handleSelectTheme = (newTheme: SlideThemePreset) => {
    setLocalTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const content = slide.content as any;
  const isLight = currentThemeKey === 'light';

  return (
    <div className="w-full space-y-3 select-none">
      {/* Editorial Review Note (if slide was revised by the audit loop) */}
      {slide.resolutionNote && (
        <div className="px-4 py-2.5 rounded-2xl bg-[#181E38] border border-[#05F1CD]/40 flex items-center justify-between text-xs text-white shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#05F1CD] flex-shrink-0" />
            <span>
              <strong className="text-[#05F1CD] font-mono uppercase tracking-wider font-bold">
                Partner Audit Revision Note:{' '}
              </strong>
              {slide.resolutionNote}
            </span>
          </div>
          <span className="pill-badge-mint text-[10px] py-0.5 px-2.5">
            Audit-Optimized
          </span>
        </div>
      )}

      {/* Theme Presets Switcher Bar */}
      {!hideThemeBar && (
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Palette className="w-3.5 h-3.5 text-[#A5B4FC]" />
            <span>Slide Theme Preset:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#11162C] p-1 rounded-xl border border-white/10 shadow-md">
            <button
              onClick={() => handleSelectTheme('graphite')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentThemeKey === 'graphite'
                  ? 'bg-[#38BDF8] text-[#090C19] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Graphite Slate Dark Theme"
            >
              <Moon className="w-3 h-3" />
              <span>Graphite</span>
            </button>

            <button
              onClick={() => handleSelectTheme('light')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentThemeKey === 'light'
                  ? 'bg-[#2563EB] text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Executive Light Canvas (High Contrast)"
            >
              <Sun className="w-3 h-3" />
              <span>Executive Light</span>
            </button>

            <button
              onClick={() => handleSelectTheme('midnight')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentThemeKey === 'midnight'
                  ? 'bg-[#4D44FF] text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Midnight Royal Cobalt Theme"
            >
              <Flame className="w-3 h-3" />
              <span>Midnight</span>
            </button>

            <button
              onClick={() => handleSelectTheme('aurora')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentThemeKey === 'aurora'
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#FFCCD5] text-[#1E1242] font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Cosmic Aurora Gradient Theme"
            >
              <Sparkles className="w-3 h-3" />
              <span>Aurora</span>
            </button>
          </div>
        </div>
      )}

      {/* 16:9 Aspect Ratio Slide Container */}
      <div
        id="active-pitch-slide-canvas"
        className={`w-full rounded-3xl border ${theme.borderClass} ${theme.bgClass} shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[580px] transition-all duration-300`}
      >
        {/* Slide Top Bar */}
        <div className={`flex items-center justify-between border-b ${isLight ? 'border-slate-200' : 'border-white/10'} pb-4 mb-4 relative z-10`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold py-1 px-3 rounded-full font-mono uppercase tracking-wider ${
              isLight
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-[#4D44FF]/20 text-[#A5B4FC] border border-[#4D44FF]/40'
            }`}>
              SLIDE {slide.slideNumber} / {totalSlides}
            </span>
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${theme.textPrimary}`}>
              {slide.navTitle.replace(/^\d+\.\s*/, '')}
            </span>
            {slide.revisionCount > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 font-mono ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-[#05F1CD]/10 text-[#05F1CD] border-[#05F1CD]/30'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                Audited &amp; Revised
              </span>
            )}
          </div>

          {slide.groundedArchetypeCitation && (
            <div className={`text-[11px] font-mono flex items-center gap-1.5 px-3 py-1 rounded-xl border ${theme.subCardClass} ${theme.textMuted}`}>
              <Zap className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-[#FFCCD5]'}`} />
              <span className="font-bold">Archetype:</span>
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
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-sm mt-1.5 ${theme.textMuted}`}>{content.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {content.painPoints.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border ${theme.cardClass} flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                          isLight ? 'text-rose-600' : 'text-amber-400'
                        }`}>
                          Friction Point 0{idx + 1}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-white/10 text-slate-300 border-white/10'
                        }`}>
                          {p.affectedGroup}
                        </span>
                      </div>
                      <h3 className={`text-sm font-bold mb-1.5 ${theme.textPrimary}`}>{p.title}</h3>
                      <p className={`text-xs leading-relaxed ${theme.textMuted}`}>{p.description}</p>
                    </div>

                    <div className={`mt-4 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                      <span className={`text-[10px] font-mono block ${theme.textMuted}`}>Quantified Impact:</span>
                      <strong className={`text-xs font-mono font-bold ${
                        isLight ? 'text-rose-600' : 'text-[#FFCCD5]'
                      }`}>
                        {p.quantifiedLoss}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Urgency Trigger */}
              <div className={`p-4 rounded-2xl border ${theme.subCardClass} flex items-center justify-between text-xs`}>
                <div>
                  <span className={`font-mono font-bold uppercase tracking-wider block text-[10px] ${
                    isLight ? 'text-blue-700' : 'text-[#05F1CD]'
                  }`}>
                    Why Now / Catalyst:
                  </span>
                  <span className={theme.textPrimary}>{content.urgencyTrigger}</span>
                </div>
                <div className="text-right hidden sm:block">
                  <span className={`font-mono text-[10px] block ${theme.textMuted}`}>Status Quo Alternative:</span>
                  <span className={`font-bold ${theme.textPrimary}`}>{content.statusQuoAlternative}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SOLUTION */}
          {slide.type === 'solution' && (
            <div>
              <div className="mb-6">
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-sm mt-1.5 ${theme.textHighlight} font-medium`}>{content.tagline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {content.corePillars.map((pillar: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border ${theme.cardClass} flex flex-col justify-between`}
                  >
                    <div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs mb-3 shadow ${
                        isLight
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-[#4D44FF]/20 text-[#A5B4FC] border border-[#4D44FF]/40'
                      }`}>
                        0{idx + 1}
                      </div>
                      <h3 className={`text-sm font-bold mb-1 ${theme.textPrimary}`}>{pillar.name}</h3>
                      <div className={`text-xs font-mono font-semibold mb-2 ${
                        isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                      }`}>
                        {pillar.benefit}
                      </div>
                      <p className={`text-xs leading-relaxed ${theme.textMuted}`}>{pillar.howItWorks}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Before vs After */}
              <div className={`p-4 rounded-2xl border ${theme.subCardClass} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs`}>
                <div className="flex-1 text-xs">
                  <span className={`text-[10px] font-mono uppercase tracking-wider block mb-0.5 ${
                    isLight ? 'text-rose-600' : 'text-amber-400'
                  }`}>
                    Before (Legacy Status Quo)
                  </span>
                  <span className={`${theme.textMuted} line-through opacity-80`}>{content.beforeVsAfter.before}</span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  isLight ? 'bg-blue-100 text-blue-700' : 'bg-[#05F1CD]/20 text-[#05F1CD]'
                }`}>
                  →
                </div>
                <div className="flex-1 text-xs">
                  <span className={`text-[10px] font-mono uppercase tracking-wider block mb-0.5 ${
                    isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                  }`}>
                    With Platform After
                  </span>
                  <strong className={theme.textPrimary}>{content.beforeVsAfter.after}</strong>
                </div>
              </div>
            </div>
          )}

          {/* 3. MARKET SIZE (TAM / SAM / SOM with Concentric Breakdown Donut) */}
          {slide.type === 'market_size' && (
            <div>
              <div className="mb-5">
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs py-0.5 px-2.5 rounded-full font-mono font-bold ${
                    isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'pill-badge-mint'
                  }`}>
                    CAGR: {content.cagr}
                  </span>
                  <span className={`text-xs ${theme.textMuted}`}>{content.marketDescription}</span>
                </div>
              </div>

              {/* Sizing Grid with Donut Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                {/* Visual Market Share Donut Chart */}
                <div className={`lg:col-span-1 p-4 rounded-2xl border ${theme.cardClass} flex flex-col items-center justify-center`}>
                  <div className={`text-xs font-mono font-bold uppercase tracking-wider mb-1 ${theme.textHighlight}`}>
                    Market Sizing Tiers
                  </div>
                  <div className="w-full h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'TAM', value: 68 },
                            { name: 'SAM', value: 24 },
                            { name: 'SOM (Beachhead)', value: 8 }
                          ]}
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          <Cell fill={theme.chartColors[0]} />
                          <Cell fill={theme.chartColors[1]} />
                          <Cell fill={theme.chartColors[2]} />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                            borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.15)',
                            fontSize: '11px',
                            color: isLight ? '#0F172A' : '#FFFFFF',
                            borderRadius: '10px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.chartColors[0] }} /> TAM
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.chartColors[1] }} /> SAM
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.chartColors[2] }} /> SOM
                    </span>
                  </div>
                </div>

                {/* TAM */}
                <div className={`p-4 rounded-2xl border ${theme.cardClass} flex flex-col justify-between`}>
                  <div>
                    <div className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.textMuted}`}>TAM (Global)</div>
                    <div className={`text-3xl font-extrabold my-1 ${theme.textPrimary}`}>{content.tam.value}</div>
                    <p className={`text-xs leading-relaxed ${theme.textMuted}`}>{content.tam.description}</p>
                  </div>
                  <div className={`mt-2 text-[10px] font-mono ${theme.textMuted}`}>{content.tam.methodology}</div>
                </div>

                {/* SAM */}
                <div className={`p-4 rounded-2xl border ${theme.cardClass} flex flex-col justify-between`}>
                  <div>
                    <div className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.textHighlight}`}>SAM (Target Segment)</div>
                    <div className={`text-3xl font-extrabold my-1 ${theme.textHighlight}`}>{content.sam.value}</div>
                    <p className={`text-xs leading-relaxed ${theme.textMuted}`}>{content.sam.description}</p>
                  </div>
                  <div className={`mt-2 text-[10px] font-mono ${theme.textMuted}`}>{content.sam.methodology}</div>
                </div>

                {/* SOM */}
                <div className={`p-4 rounded-2xl border ${theme.cardClass} flex flex-col justify-between ${
                  isLight ? 'border-emerald-300' : 'border-[#05F1CD]/40'
                }`}>
                  <div>
                    <div className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                    }`}>
                      SOM (Beachhead 3-Yr)
                    </div>
                    <div className={`text-3xl font-extrabold my-1 ${
                      isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                    }`}>
                      {content.som.value}
                    </div>
                    <p className={`text-xs leading-relaxed ${theme.textMuted}`}>{content.som.description}</p>
                  </div>
                  <div className={`mt-2 text-[10px] font-semibold font-mono ${
                    isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                  }`}>
                    {content.som.methodology}
                  </div>
                </div>
              </div>

              {/* Bottom-up Formula Card with BigQuery Badge */}
              <div className={`p-4 rounded-2xl border ${theme.subCardClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-blue-600' : 'bg-[#05F1CD]'}`} />
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isLight ? 'text-blue-700' : 'text-[#05F1CD]'
                    }`}>
                      Transparent Bottom-Up Beachhead Arithmetic
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-sm ${
                    isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-[#4D44FF]/20 text-[#A5B4FC] border-[#4D44FF]/40'
                  }`}>
                    ⚡ Google BigQuery Census Grounded
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs py-1">
                  <div className={`p-3 rounded-xl border ${theme.cardClass}`}>
                    <span className={`block text-[10px] font-mono ${theme.textMuted}`}>Target Beachhead Volume</span>
                    <strong className={theme.textPrimary}>{content.bottomUpFormula.targetCustomers}</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${theme.cardClass}`}>
                    <span className={`block text-[10px] font-mono ${theme.textMuted}`}>Annual Contract Value (ACV)</span>
                    <strong className={theme.textPrimary}>{content.bottomUpFormula.arpuAnnual}</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${theme.cardClass}`}>
                    <span className={`block text-[10px] font-mono ${theme.textMuted}`}>Derived Beachhead SOM</span>
                    <strong className={isLight ? 'text-emerald-700' : 'text-[#05F1CD]'}>
                      {content.bottomUpFormula.derivedMarket}
                    </strong>
                  </div>
                </div>
                <p className={`text-[11px] mt-1.5 italic ${theme.textMuted}`}>{content.bottomUpFormula.derivationStep}</p>
              </div>
            </div>
          )}

          {/* 4. BUSINESS MODEL & REVENUE DONUT */}
          {slide.type === 'business_model' && (
            <div>
              <div className="mb-4">
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                  isLight ? 'bg-blue-100 text-blue-800' : 'pill-badge'
                }`}>
                  Model: {content.modelType}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                {/* Revenue Streams Donut Chart */}
                <div className={`lg:col-span-1 p-4 rounded-2xl border ${theme.cardClass} flex flex-col items-center justify-center`}>
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider mb-1 ${theme.textHighlight}`}>
                    Revenue Mix
                  </span>
                  <div className="w-full h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Core Subscriptions', value: 65 },
                            { name: 'Usage Expansion', value: 25 },
                            { name: 'Enterprise Add-ons', value: 10 }
                          ]}
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          <Cell fill={theme.chartColors[0]} />
                          <Cell fill={theme.chartColors[1]} />
                          <Cell fill={theme.chartColors[2]} />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                            borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.15)',
                            fontSize: '11px',
                            color: isLight ? '#0F172A' : '#FFFFFF',
                            borderRadius: '10px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <span className={`text-[10px] font-mono ${theme.textMuted}`}>65% Sub • 25% Usage • 10% Ent</span>
                </div>

                {/* Pricing Tiers (3 items) */}
                {content.pricingTiers.map((tier: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      tier.isPrimary
                        ? isLight
                          ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500 shadow-md'
                          : 'bg-[#181E38] border-[#4D44FF] ring-1 ring-[#4D44FF] shadow-xl'
                        : theme.cardClass
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold ${isLight ? 'text-blue-700' : 'text-[#FFCCD5]'}`}>
                          {tier.name}
                        </span>
                        {tier.isPrimary && (
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isLight ? 'bg-blue-600 text-white' : 'bg-[#4D44FF] text-white'
                          }`}>
                            CORE PLAN
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-2xl font-extrabold ${theme.textPrimary}`}>{tier.price}</span>
                        <span className={`text-xs ${theme.textMuted}`}>{tier.period}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {tier.features.map((f: string, fIdx: number) => (
                          <li key={fIdx} className={`flex items-center gap-1.5 ${theme.textMuted}`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isLight ? 'text-blue-600' : 'text-[#05F1CD]'
                            }`} />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unit Economics Bar */}
              <div className={`p-4 rounded-2xl border ${theme.subCardClass}`}>
                <div className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-2 ${theme.textHighlight}`}>
                  Unit Economics &amp; Margin Waterfall
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className={`p-2.5 rounded-xl border ${theme.cardClass}`}>
                    <span className={`text-[10px] font-mono block ${theme.textMuted}`}>Target CAC</span>
                    <strong className={`text-sm ${theme.textPrimary}`}>{content.unitEconomics.cac}</strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${theme.cardClass}`}>
                    <span className={`text-[10px] font-mono block ${theme.textMuted}`}>Customer LTV</span>
                    <strong className={`text-sm ${theme.textPrimary}`}>{content.unitEconomics.ltv}</strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${theme.cardClass}`}>
                    <span className={`text-[10px] font-mono block ${theme.textMuted}`}>LTV : CAC Ratio</span>
                    <strong className={`text-sm ${isLight ? 'text-emerald-700' : 'text-[#05F1CD]'}`}>
                      {content.unitEconomics.ltvCacRatio}
                    </strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${theme.cardClass}`}>
                    <span className={`text-[10px] font-mono block ${theme.textMuted}`}>CAC Payback</span>
                    <strong className={`text-sm ${theme.textPrimary}`}>{content.unitEconomics.paybackMonths}</strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${theme.cardClass}`}>
                    <span className={`text-[10px] font-mono block ${theme.textMuted}`}>Gross Margin</span>
                    <strong className={`text-sm ${theme.textPrimary}`}>{content.unitEconomics.grossMarginPercent}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. COMPETITION (2x2 Strategic Positioning Matrix) */}
          {slide.type === 'competition' && (
            <div>
              <div className="mb-4">
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-xs mt-1 font-mono ${theme.textMuted}`}>
                  2x2 Strategic Positioning Matrix vs Incumbents
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                {/* 2x2 Matrix Canvas */}
                <div className={`h-64 rounded-2xl border ${theme.cardClass} p-4 relative flex flex-col justify-between shadow-lg`}>
                  <div className={`text-[10px] font-mono font-bold text-center ${theme.textHighlight}`}>
                    ▲ {content.yAxisLabel} (Enterprise Moat)
                  </div>
                  <div className={`relative flex-1 my-2 border-b border-l ${isLight ? 'border-slate-300' : 'border-white/20'}`}>
                    {/* Quadrant Labels */}
                    <span className="absolute top-1 left-2 text-[9px] font-mono text-slate-400 opacity-60">Niche Point Tools</span>
                    <span className={`absolute top-1 right-2 text-[9px] font-mono font-bold opacity-80 ${
                      isLight ? 'text-blue-700' : 'text-[#05F1CD]'
                    }`}>
                      ★ Leader / Defensible
                    </span>
                    <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400 opacity-60">Legacy Manual</span>
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 opacity-60">Horizontal Incumbents</span>

                    {/* Quadrant Dividing Lines */}
                    <div className={`absolute top-1/2 left-0 right-0 border-b border-dashed ${isLight ? 'border-slate-300' : 'border-white/15'}`} />
                    <div className={`absolute top-0 bottom-0 left-1/2 border-r border-dashed ${isLight ? 'border-slate-300' : 'border-white/15'}`} />

                    {/* Competitor Pins */}
                    {content.competitors.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        style={{ left: `${c.x}%`, top: `${100 - c.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold shadow ${
                          isLight ? 'bg-slate-200 text-slate-700 border-slate-400' : 'bg-[#0D1122] text-slate-300 border-white/40'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className={`absolute left-5 top-0 border px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-sm pointer-events-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-[#0D1122] border-white/20 text-slate-300'
                        }`}>
                          {c.name}
                        </div>
                      </div>
                    ))}

                    {/* Our Platform Pin */}
                    <div
                      style={{ left: `${content.ourPosition.x}%`, top: `${100 - content.ourPosition.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 animate-pulse"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-xl">
                        ★
                      </div>
                      <div className="absolute left-8 top-0 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-md">
                        {content.ourPosition.name}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-mono font-bold text-center ${theme.textHighlight}`}>
                    ► {content.xAxisLabel} (Speed &amp; Automation)
                  </div>
                </div>

                {/* Defensibility Moats */}
                <div className={`p-5 rounded-2xl border ${theme.cardClass} flex flex-col justify-between shadow-lg`}>
                  <div>
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider block mb-3 ${theme.textHighlight}`}>
                      Structural Defensibility Moats
                    </span>
                    <ul className="space-y-3 text-xs">
                      {content.defensibilityMoats.map((m: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <ShieldCheck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            isLight ? 'text-blue-600' : 'text-[#05F1CD]'
                          }`} />
                          <span className={theme.textPrimary}>{m}</span>
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
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-xs mt-1 font-mono ${theme.textMuted}`}>Core Motion: {content.salesMotion}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {content.primaryChannels.map((ch: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${theme.cardClass} shadow-lg`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${theme.textHighlight}`}>{ch.channel}</span>
                      <span className={`text-[9px] font-mono font-bold py-0.5 px-2 rounded-full ${
                        isLight ? 'bg-blue-100 text-blue-800' : 'pill-badge-cobalt'
                      }`}>
                        {ch.sharePercent}% share
                      </span>
                    </div>
                    <p className={`text-xs mb-2.5 ${theme.textMuted}`}>{ch.strategy}</p>
                    <div className={`text-[10px] font-mono ${theme.textMuted}`}>
                      Expected CAC: <strong className={isLight ? 'text-emerald-700' : 'text-[#05F1CD]'}>{ch.expectedCac}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phases */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.phases.map((ph: any, idx: number) => (
                  <div key={idx} className={`p-3.5 rounded-2xl border ${theme.subCardClass}`}>
                    <div className={`text-[10px] font-mono font-bold uppercase ${
                      isLight ? 'text-blue-600' : 'text-[#05F1CD]'
                    }`}>
                      {ph.timeline}
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${theme.textPrimary}`}>{ph.phase}</div>
                    <div className={`text-[11px] mt-1 ${theme.textMuted}`}>{ph.targetMilestone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. TEAM */}
          {slide.type === 'team' && (
            <div>
              <div className="mb-4">
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-xs mt-1 ${theme.textMuted}`}>{content.teamRationale}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {content.members.map((m: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${theme.cardClass} flex flex-col justify-between shadow-lg`}>
                    <div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow ${
                        isLight ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-[#4D44FF]/20 text-[#A5B4FC] border border-[#4D44FF]/40'
                      }`}>
                        {m.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <h3 className={`text-sm font-bold ${theme.textPrimary}`}>{m.name}</h3>
                      <div className={`text-xs font-medium mb-1 ${theme.textHighlight}`}>{m.role}</div>
                      <div className={`text-[11px] font-semibold mb-2 ${isLight ? 'text-purple-700' : 'text-[#FFCCD5]'}`}>
                        {m.pedigree}
                      </div>
                      <p className={`text-xs leading-relaxed ${theme.textMuted}`}>{m.domainSuperpower}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-3.5 rounded-2xl border ${theme.subCardClass} flex items-center justify-between text-xs`}>
                <div>
                  <span className={`font-mono font-semibold ${theme.textHighlight}`}>Key Advisory Board: </span>
                  <span className={theme.textMuted}>
                    {content.advisors.map((a: any) => `${a.name} (${a.affiliation})`).join('  •  ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 8. FINANCIALS (Composed Chart + Cost Donut) */}
          {slide.type === 'financials' && (
            <div>
              <div className="mb-4">
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-xs font-semibold mt-1 font-mono ${
                  isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                }`}>
                  {content.breakevenTimeline}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
                <div className={`lg:col-span-2 h-56 rounded-2xl p-4 border ${theme.cardClass} shadow-lg`}>
                  <div className={`text-xs font-mono font-bold uppercase tracking-wider mb-1 ${theme.textHighlight}`}>
                    3-Year Revenue &amp; Margin Projections
                  </div>
                  <ResponsiveContainer width="100%" height="85%">
                    <ComposedChart data={content.forecastYears} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <XAxis dataKey="year" stroke={theme.chartTextColor} fontSize={11} />
                      <YAxis stroke={theme.chartTextColor} fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                          borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.15)',
                          fontSize: '11px',
                          color: isLight ? '#0F172A' : '#FFFFFF',
                          borderRadius: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', color: theme.chartTextColor }} />
                      <Bar dataKey="revenue" name="Revenue ($M)" fill={theme.chartColors[0]} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses ($M)" fill={theme.chartColors[1]} radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="grossMarginPercent" name="Margin" stroke={theme.chartColors[2]} strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 flex flex-col justify-center">
                  {content.forecastYears.map((f: any, idx: number) => (
                    <div key={idx} className={`p-3 rounded-xl border ${theme.cardClass} flex items-center justify-between text-xs`}>
                      <div>
                        <strong className={theme.textPrimary}>{f.year}</strong>
                        <div className={`text-[10px] font-mono ${theme.textMuted}`}>{f.customers} Accounts</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isLight ? 'text-emerald-700' : 'text-[#05F1CD]'}`}>
                          {f.formattedRevenue} ARR
                        </div>
                        <div className={`text-[10px] font-semibold ${theme.textMuted}`}>
                          Margin: {f.grossMarginPercent}
                        </div>
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
                <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                  {content.title}
                </h2>
                <p className={`text-xs mt-1 ${theme.textMuted}`}>{content.stageSummary}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {content.keyMetrics.map((kpi: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${theme.cardClass} text-center shadow-lg`}>
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme.textMuted}`}>
                      {kpi.label}
                    </div>
                    <div className={`text-2xl font-extrabold my-1 ${
                      isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                    }`}>
                      {kpi.value}
                    </div>
                    {kpi.growthRate && (
                      <span className={`text-[10px] py-0.5 px-2 rounded-full font-mono font-bold inline-block ${
                        isLight ? 'bg-emerald-100 text-emerald-800' : 'pill-badge-mint'
                      }`}>
                        {kpi.growthRate}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-2xl border ${theme.subCardClass} text-xs italic ${theme.textMuted}`}>
                "{content.pilotOrCustomerProof}"
              </div>
            </div>
          )}

          {/* 10. FUNDING ASK (With Capital Allocation Donut Chart) */}
          {slide.type === 'funding_ask' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                    {content.title}
                  </h2>
                  <p className={`text-xs font-semibold mt-1 font-mono ${theme.textMuted}`}>
                    Runway: {content.runwayMonths}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xs uppercase font-mono font-semibold ${theme.textMuted}`}>Target Capital</div>
                  <div className={`text-2xl sm:text-4xl font-extrabold ${
                    isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                  }`}>
                    {content.targetAmount}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                {/* Allocation Donut Chart */}
                <div className={`lg:col-span-1 p-4 rounded-2xl border ${theme.cardClass} flex flex-col items-center justify-center shadow-lg`}>
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider mb-1 ${theme.textHighlight}`}>
                    Use of Funds
                  </span>
                  <div className="w-full h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={content.useOfFunds.map((u: any) => ({
                            name: u.category,
                            value: u.percentage
                          }))}
                          innerRadius={28}
                          outerRadius={48}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {content.useOfFunds.map((_: any, idx: number) => (
                            <Cell key={idx} fill={theme.chartColors[idx % theme.chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                            borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.15)',
                            fontSize: '11px',
                            color: isLight ? '#0F172A' : '#FFFFFF',
                            borderRadius: '10px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <span className={`text-[10px] font-mono ${theme.textMuted}`}>
                    {content.useOfFunds.length} Strategic Buckets
                  </span>
                </div>

                {/* Fund Breakdown Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {content.useOfFunds.map((u: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${theme.cardClass} shadow-lg flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold ${theme.textPrimary}`}>{u.category}</span>
                          <span className={`text-xs font-extrabold ${
                            isLight ? 'text-blue-700' : 'text-[#FFCCD5]'
                          }`}>
                            {u.percentage}%
                          </span>
                        </div>
                        <p className={`text-xs mb-2 ${theme.textMuted}`}>{u.allocationRationale}</p>
                      </div>
                      <div className={`text-[10px] font-mono font-bold ${
                        isLight ? 'text-emerald-700' : 'text-[#05F1CD]'
                      }`}>
                        Milestone: {u.milestoneUnlocked}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Catalysts */}
              <div className={`p-3.5 rounded-2xl border ${theme.subCardClass} flex items-center justify-between text-xs`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-[#FFCCD5]'}`} />
                  <span className={`font-mono font-bold ${theme.textHighlight}`}>Target Unlocked Milestones: </span>
                  <span className={theme.textPrimary}>{content.milestonesUnlocked.join('  •  ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
