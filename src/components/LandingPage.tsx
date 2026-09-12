import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  TrendingUp,
  ArrowRight,
  Search,
  BookOpen,
  Activity,
  Terminal,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import type { UserBusinessInput } from '../types/pitch';
import { VC_PERSONAS } from '../agents/criticAgent';

interface LandingPageProps {
  onLaunchStudio: (input?: UserBusinessInput) => void;
  onExploreReferenceDecks: () => void;
}

const DYNAMIC_HEADLINE_PHRASES = [
  'Investor-Ready Pitch Decks',
  'Verifiable TAM / SAM / SOM Models',
  'VC Partner Meeting Audits',
  '10-Slide Venture Blueprints',
  'Fundable Series Seed & A Narratives'
];

const DYNAMIC_PLAYGROUND_PRESETS: {
  id: string;
  name: string;
  vertical: string;
  stage: string;
  tam: number;
  sam: number;
  som: number;
  somUnits: string;
  cagr: string;
  initialScore: number;
  revisedScore: number;
  agentThought: string;
  criticObjection: string;
  resolution: string;
  inputData: UserBusinessInput;
}[] = [
  {
    id: 'supply-chain',
    name: 'Supply Chain Risk & Logistics Platform',
    vertical: 'Enterprise Logistics SaaS',
    stage: 'Seed ($2.5M)',
    tam: 85,
    sam: 18.4,
    som: 2.8,
    somUnits: '38,889 Mid-Market Accounts × $18,000/yr ACV',
    cagr: '18.4% (Gartner Index)',
    initialScore: 74,
    revisedScore: 92,
    agentThought: 'Structuring carrier disruption analytics, freight compliance, and enterprise payback benchmarks...',
    criticObjection: 'TAM was top-down only; risk of elongated 9-month enterprise procurement cycles.',
    resolution: 'Modeled transparent bottom-up unit arithmetic ($18k ACV × 38.8k accounts) and highlighted land-and-expand deployment.',
    inputData: {
      businessIdea: 'Predictive supply chain disruption intelligence with automated rerouting for mid-market and enterprise freight operators.',
      targetAudience: 'Chief Supply Chain Officers, VP Logistics, Global Procurement Directors',
      industryVertical: 'B2B SaaS / Enterprise Software',
      fundingStage: 'Seed Round ($2.5M)',
      revenueModel: 'Tiered Enterprise SaaS ($25k - $120k ARR / license)',
      uspOrMoat: 'Direct carrier API integration delivering 2-hour predictive anomaly alerts and automated rerouting workflows.',
      selectedReferenceArchetype: 'sequoia-blueprint',
    }
  },
  {
    id: 'health-scribe',
    name: 'Clinical Documentation & EHR Assistant',
    vertical: 'HealthTech AI Infrastructure',
    stage: 'Seed ($3.0M)',
    tam: 95,
    sam: 15.2,
    som: 1.9,
    somUnits: '52,770 Clinicians × $36,000/yr Practice Contract',
    cagr: '24.8% (Rock Health)',
    initialScore: 71,
    revisedScore: 94,
    agentThought: 'Quantifying physician charting hours saved and verifying EHR integration compatibility...',
    criticObjection: 'Medical billing error liability; risk of incumbent EHR vendors launching native copies.',
    resolution: 'Added 99.8% ICD-10 coding verification workflow and bi-directional Epic/Cerner sync.',
    inputData: {
      businessIdea: 'Ambient voice documentation for physician groups that turns patient consultations into structured, billable EHR charts in seconds.',
      targetAudience: 'Hospital Health Systems, Independent Practice Groups, Chief Medical Officers',
      industryVertical: 'Healthcare / BioTech / HealthTech',
      fundingStage: 'Seed Round ($3.0M)',
      revenueModel: 'Per-Clinician Monthly Subscription ($499/mo) + Enterprise EHR Integration Fee',
      uspOrMoat: 'Sub-second clinical entity extraction with 99.8% medical billing code accuracy and native Epic/Cerner bi-directional sync.',
      selectedReferenceArchetype: 'buffer-2011',
    }
  },
  {
    id: 'dev-mesh',
    name: 'Developer Cloud Infrastructure Platform',
    vertical: 'DeepTech / AI Developer Tools',
    stage: 'Seed ($2.0M)',
    tam: 140,
    sam: 25.2,
    som: 3.5,
    somUnits: '291,667 Developers × $12,000/yr Compute Mesh',
    cagr: '37.3% (Bloomberg GenAI)',
    initialScore: 76,
    revisedScore: 95,
    agentThought: 'Benchmarking token latency reductions, developer workflow speed, and cloud compute unit economics...',
    criticObjection: 'Compute cost per task could erode gross margins; risk of foundation model API commoditization.',
    resolution: 'Demonstrated 4x lower token latency via local caching and structured consumption pricing with 78% margins.',
    inputData: {
      businessIdea: 'Serverless execution runtime providing deterministic state management, memory isolation, and audit logs for AI workloads.',
      targetAudience: 'Software Engineering Teams, CTOs, AI Infrastructure Architects',
      industryVertical: 'AI / DeepTech / Developer Tools',
      fundingStage: 'Seed Round ($2.0M)',
      revenueModel: 'Usage-based compute gateway + Enterprise SOC2 cluster hosting',
      uspOrMoat: 'Zero-latency edge memory coordination with deterministic rollback guaranteeing 100% auditable execution.',
      selectedReferenceArchetype: 'stripe-2010',
    }
  },
  {
    id: 'fintech-ledger',
    name: 'Cross-Border B2B Settlement Ledger',
    vertical: 'FinTech / Payments Infrastructure',
    stage: 'Series A ($8.0M)',
    tam: 210,
    sam: 31.5,
    som: 4.2,
    somUnits: '150,000 Transacting Merchants × $28,000/yr ACV',
    cagr: '21.5% (McKinsey Payments)',
    initialScore: 78,
    revisedScore: 93,
    agentThought: 'Modeling cross-border FX volume, merchant processing spreads, and liquidity velocity...',
    criticObjection: 'Interchange fee compression and international banking license regulatory barriers.',
    resolution: 'Modeled high-margin software compliance fee + integrated automated AML/KYC audit trails.',
    inputData: {
      businessIdea: 'Real-time multi-currency settlement ledger providing zero-fee FX hedging and instant cross-border treasury management for global merchants.',
      targetAudience: 'Chief Financial Officers, Global E-Commerce Marketplaces, Neo-Banks',
      industryVertical: 'Fintech / Payments / Insurtech',
      fundingStage: 'Series A ($8.0M)',
      revenueModel: 'Software Subscription + 0.15% FX Spread Optimization Fee',
      uspOrMoat: 'Sub-second cryptographic settlement with automated liquidity routing across 40+ international central banks.',
      selectedReferenceArchetype: 'coinbase-2012',
    }
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchStudio,
  onExploreReferenceDecks,
}) => {
  const [typedText, setTypedText] = useState<string>('');
  const [phraseIdx, setPhraseIdx] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [displayTam, setDisplayTam] = useState<number>(0);
  const [displaySom, setDisplaySom] = useState<number>(0);
  const [displayScore, setDisplayScore] = useState<number>(0);

  const [activeAgentNode, setActiveAgentNode] = useState<'researcher' | 'narrative' | 'critic' | 'refiner'>('critic');
  const [activePersonaDrill, setActivePersonaDrill] = useState<string>('saas_skeptic');

  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activePreset = DYNAMIC_PLAYGROUND_PRESETS[activePresetIdx];

  // Dynamic Typewriter Effect for Headline
  useEffect(() => {
    const currentPhrase = DYNAMIC_HEADLINE_PHRASES[phraseIdx];
    const typingSpeed = isDeleting ? 30 : 65;

    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        pauseTimer = setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % DYNAMIC_HEADLINE_PHRASES.length);
      } else {
        setTypedText(
          isDeleting
            ? currentPhrase.substring(0, typedText.length - 1)
            : currentPhrase.substring(0, typedText.length + 1)
        );
      }
    }, typingSpeed);

    return () => {
      clearTimeout(timer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [typedText, isDeleting, phraseIdx]);

  // Dynamic Number Counter Tween on Preset Change
  useEffect(() => {
    setIsSimulating(true);
    let startTimestamp: number | null = null;
    let animId: number;
    const duration = 800;

    const targetTam = activePreset.tam;
    const targetSom = activePreset.som;
    const targetScore = activePreset.revisedScore;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayTam(Number((targetTam * ease).toFixed(1)));
      setDisplaySom(Number((targetSom * ease).toFixed(1)));
      setDisplayScore(Math.round(activePreset.initialScore + (targetScore - activePreset.initialScore) * ease));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setIsSimulating(false);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [activePresetIdx]);

  // Dynamic Particle Starfield Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = [];
    const count = Math.min(35, Math.floor(width / 40));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.3 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleLaunch = () => {
    if (customPrompt.trim()) {
      // If the user typed a custom idea, pass it directly to generation
      onLaunchStudio({
        businessIdea: customPrompt.trim(),
        targetAudience: 'Target Customers & Enterprise Decision Makers',
        industryVertical: 'B2B SaaS / Enterprise Software',
        fundingStage: 'Seed Round ($2.5M)',
        revenueModel: 'Tiered Subscription & Usage Expansion',
        uspOrMoat: 'Proprietary workflow integration with rapid time-to-value',
        selectedReferenceArchetype: 'sequoia-blueprint'
      });
    } else {
      // If no prompt was typed, open the Input Wizard so the user can freely type their idea
      onLaunchStudio();
    }
  };

  return (
    <div className="w-full relative overflow-hidden pb-24 text-white min-h-screen bg-[#090C19] bg-grid-architectural">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-25"
      />

      {/* Grid Pattern & Subtle Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[#4D44FF]/12 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#05F1CD]/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-8 sm:pt-12 space-y-20">
        {/* 1. EDITORIAL POSTER HERO SECTION */}
        <section className="text-center space-y-6 max-w-5xl mx-auto">
          {/* Top Micro-Labels & Pill Badge Header */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono tracking-widest uppercase text-slate-300 border-b border-white/10 pb-4">
            <div className="text-left font-bold">
              <div>PITCH STUDIO</div>
              <div className="text-slate-400">AUTONOMOUS</div>
            </div>

            <div className="pill-badge-cobalt shadow-sm">
              ( INSTITUTIONAL STUDIO )
            </div>

            <div className="text-right font-bold">
              <div>MULTI-AGENT</div>
              <div className="text-slate-400">+VC CRITIC AUDIT</div>
            </div>
          </div>

          {/* Massive Editorial Display Title in Pastel Blush Pink & White */}
          <div className="pt-4 space-y-2">
            <h1 className="font-poster text-6xl sm:text-8xl lg:text-9xl tracking-tight text-white leading-[0.85] uppercase drop-shadow-sm">
              PITCH<br />
              <span className="text-[#FFCCD5]">ARCHITECT</span>
            </h1>
          </div>

          {/* Center Micro-Metadata Row */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono tracking-widest uppercase text-slate-400 py-2 border-y border-white/10">
            <div>MULTI-AGENT SWARM</div>
            <div>VERIFIED BOTTOM-UP SIZING</div>
            <div>INSTITUTIONAL GRADE</div>
          </div>

          {/* Elegant Centered Description */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal pt-1">
            Inspired by top venture capital partners and legendary seed decks, the PitchArchitect autonomous multi-agent swarm captures the essence of institutional fundraising, defensible market sizing, and narrative excellence.
          </p>

          {/* Interactive Fast Concept Launcher Input */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="p-2 rounded-2xl border border-white/15 bg-[#11162C]/90 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your startup idea (e.g. AI platform for cold-chain logistics)..."
                  className="w-full bg-[#181E38] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#4D44FF] transition-colors"
                />
              </div>

              <button
                onClick={handleLaunch}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm btn-cobalt-primary shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#FFCCD5]" />
                <span>{customPrompt.trim() ? 'Build Pitch Deck' : 'Create Custom Deck'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. LIVE DYNAMIC INTERACTIVE PLAYGROUND */}
          <div className="pt-6 sm:pt-10 perspective-1400 max-w-5xl mx-auto">
            {/* Concept Switcher Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#A5B4FC] uppercase tracking-wider mr-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#05F1CD]" /> Live Benchmark Demo:
              </span>
              {DYNAMIC_PLAYGROUND_PRESETS.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => setActivePresetIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activePresetIdx === idx
                      ? 'bg-[#4D44FF] text-white font-bold shadow-md scale-105'
                      : 'bg-[#11162C] text-slate-300 hover:text-white border border-white/10 hover:bg-[#181E38]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activePresetIdx === idx ? 'bg-[#05F1CD] animate-pulse' : 'bg-white/30'}`} />
                  {preset.name}
                </button>
              ))}
            </div>

            {/* 3D Card with Mouse Tilt */}
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.8s ease-out'
              }}
              className="transform-style-3d relative rounded-3xl p-1 bg-[#181E38]/80 border border-white/15 shadow-2xl text-left"
            >
              <div className="rounded-[22px] bg-[#11162C] p-5 sm:p-7 border border-white/10 overflow-hidden relative transform-style-3d space-y-5">
                {/* Top Card Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-2xl font-extrabold text-white">{activePreset.name}</h3>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#181E38] text-[#A5B4FC] font-bold border border-white/10">
                        {activePreset.vertical}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{activePreset.inputData.businessIdea}</p>
                  </div>

                  {/* Live Dynamic Score Meter Badge */}
                  <div className="flex items-center gap-2 bg-[#181E38] border border-white/10 px-3.5 py-1.5 rounded-xl shadow-sm self-start sm:self-auto">
                    <TrendingUp className="w-4 h-4 text-[#05F1CD]" />
                    <div>
                      <div className="text-[9px] uppercase font-mono font-bold text-slate-400 tracking-wider">Investor Readiness</div>
                      <div className="text-sm font-extrabold text-white">
                        <span className="text-slate-400 font-normal">{activePreset.initialScore}</span> →{' '}
                        <span className="text-[#05F1CD] font-bold">{displayScore}/100</span>{' '}
                        <span className="text-[10px] text-[#05F1CD] font-semibold">(+{activePreset.revisedScore - activePreset.initialScore} pts)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-Time Metrics & Workflow Stream Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column: Live Analysis Log */}
                  <div className="p-4 rounded-xl bg-[#181E38] border border-white/10 font-mono text-[11px] space-y-2.5 shadow-xl">
                    <div className="text-[#A5B4FC] font-bold flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#05F1CD]" /> Studio Workflow Log
                      </span>
                      {isSimulating && <RefreshCw className="w-3 h-3 text-[#05F1CD] animate-spin" />}
                    </div>

                    <div className="text-slate-300 text-[10px] leading-relaxed">
                      <span className="text-[#05F1CD] font-semibold">Market Grounding:</span> Benchmark CAGR {activePreset.cagr}
                    </div>

                    <div className="text-slate-300 text-[10px] leading-relaxed">
                      <span className="text-[#A5B4FC] font-semibold">Narrative Structure:</span> {activePreset.agentThought}
                    </div>

                    <div className="text-slate-300 text-[10px] leading-relaxed">
                      <span className="text-amber-400 font-semibold">Partner Objection:</span> {activePreset.criticObjection}
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#0D1122] border border-[#05F1CD]/30 text-white text-[10px] leading-tight">
                      <span className="font-bold text-[#05F1CD]">Remediation:</span> {activePreset.resolution}
                    </div>
                  </div>

                  {/* Center & Right Column: Market Sizing Counters */}
                  <div className="md:col-span-2 p-5 rounded-xl bg-[#181E38] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="pill-badge-mint text-[10px] py-0.5 px-2.5">
                        MARKET SIZING BREAKDOWN (TAM / SAM / SOM)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Bottom-Up Unit Arithmetic</span>
                    </div>

                    {/* Animated Number Counters */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-3.5 rounded-xl bg-[#0D1122] border border-white/10">
                        <span className="text-[10px] text-slate-400 block font-bold font-mono uppercase tracking-wider">TAM</span>
                        <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">${displayTam}B</div>
                        <span className="text-[9px] text-slate-500">Total Available</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0D1122] border border-white/10">
                        <span className="text-[10px] text-slate-400 block font-bold font-mono uppercase tracking-wider">SAM</span>
                        <div className="text-xl sm:text-2xl font-extrabold text-[#38BDF8] mt-1">${(displayTam * (activePreset.sam / activePreset.tam)).toFixed(1)}B</div>
                        <span className="text-[9px] text-slate-500">Serviceable Segment</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0D1122] border border-[#05F1CD]/40 shadow-sm">
                        <span className="text-[10px] text-[#05F1CD] block font-bold font-mono uppercase tracking-wider">SOM</span>
                        <div className="text-xl sm:text-2xl font-extrabold text-[#05F1CD] mt-1">${displaySom}B</div>
                        <span className="text-[9px] text-slate-400">Beachhead Target</span>
                      </div>
                    </div>

                    {/* Dynamic Unit Multiplication Footnote */}
                    <div className="p-3 rounded-lg bg-[#0D1122] border border-white/10 text-[11px] text-slate-300">
                      <strong className="text-[#05F1CD]">Bottom-Up Formula: </strong>
                      {activePreset.somUnits} = ${activePreset.som}B Beachhead (Verifiable Model)
                    </div>
                  </div>
                </div>

                {/* Instant Launch Button Inside Card */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-white/10">
                  <span className="text-xs text-slate-300 font-medium">Ready to build your own custom deck?</span>
                  <button
                    onClick={() => onLaunchStudio()}
                    className="btn-cobalt-primary px-5 py-2 text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>Open 10-Slide Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FOUR-STAGE DECK GENERATION WORKFLOW */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="pill-badge-cobalt">
              <Bot className="w-3.5 h-3.5 mr-1 text-[#FFCCD5]" />
              The 4-Stage Pitch Engine
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              From Concept to Term Sheet
            </h2>
            <p className="text-sm text-slate-400">
              Explore how each stage validates market sizing, narrative structure, unit economics, and partner objections.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Stage Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => setActiveAgentNode('researcher')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeAgentNode === 'researcher'
                    ? 'bg-[#4D44FF] text-white shadow-lg border-[#6A62FF] font-bold'
                    : 'bg-[#11162C] border-white/10 text-slate-300 hover:text-white hover:bg-[#181E38]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase opacity-80">Stage 01</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">Market Sizing</div>
                <div className="text-[10px] opacity-75 mt-1">Bottom-Up Arithmetic</div>
              </button>

              <button
                onClick={() => setActiveAgentNode('narrative')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeAgentNode === 'narrative'
                    ? 'bg-[#4D44FF] text-white shadow-lg border-[#6A62FF] font-bold'
                    : 'bg-[#11162C] border-white/10 text-slate-300 hover:text-white hover:bg-[#181E38]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase opacity-80">Stage 02</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">10-Slide Structure</div>
                <div className="text-[10px] opacity-75 mt-1">Historical Blueprints</div>
              </button>

              <button
                onClick={() => setActiveAgentNode('critic')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeAgentNode === 'critic'
                    ? 'bg-[#4D44FF] text-white shadow-lg border-[#6A62FF] font-bold'
                    : 'bg-[#11162C] border-white/10 text-slate-300 hover:text-white hover:bg-[#181E38]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase opacity-80">Stage 03</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">VC Partner Audit</div>
                <div className="text-[10px] opacity-75 mt-1">Rubric Stress-Test</div>
              </button>

              <button
                onClick={() => setActiveAgentNode('refiner')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeAgentNode === 'refiner'
                    ? 'bg-[#4D44FF] text-white shadow-lg border-[#6A62FF] font-bold'
                    : 'bg-[#11162C] border-white/10 text-slate-300 hover:text-white hover:bg-[#181E38]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase opacity-80">Stage 04</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">Deck Refinement</div>
                <div className="text-[10px] opacity-75 mt-1">Objection Fixes</div>
              </button>
            </div>

            {/* Active Node Detail Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#11162C] border border-white/10 shadow-2xl">
              {activeAgentNode === 'researcher' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#05F1CD]" />
                    <h3 className="font-display text-xl font-extrabold text-white">Market Intelligence &amp; Bottom-Up Sizing</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Grounds industry CAGR against sector research and derives bottom-up unit arithmetic ($ACV \times Beachhead Units$) to avoid inflated top-down TAM claims.
                  </p>
                  <div className="p-3 rounded-xl bg-[#181E38] border border-white/10 font-mono text-[11px] text-slate-200">
                    Calculated TAM: <span className="text-[#05F1CD] font-bold">${activePreset.tam}B</span> | SAM: <span className="text-[#38BDF8] font-bold">${activePreset.sam}B</span> | SOM: <span className="text-[#05F1CD] font-bold">${activePreset.som}B</span> ({activePreset.somUnits})
                  </div>
                </div>
              )}

              {activeAgentNode === 'narrative' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFCCD5]" />
                    <h3 className="font-display text-xl font-extrabold text-white">10-Slide Narrative Blueprint</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Applies the proven narrative structure used in historic seed and Series A decks (Airbnb, Uber, DoorDash, Stripe) to build a clear 10-slide deck with concrete customer friction, unit economics, and growth channels.
                  </p>
                  <div className="p-3 rounded-xl bg-[#181E38] border border-white/10 font-mono text-[11px] text-slate-200">
                    Blueprint Archetype: <span className="text-[#FFCCD5] font-bold">Sequoia / YC Standard Format (10 Slides)</span>
                  </div>
                </div>
              )}

              {activeAgentNode === 'critic' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                    <h3 className="font-display text-xl font-extrabold text-white">VC Partner Audit &amp; Rubric Evaluation</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evaluates the draft across 5 institutional criteria: Market Opportunity (20%), Defensibility (25%), Unit Economics (30%), GTM Motion (15%), and Funding Ask (10%), highlighting hard partner questions.
                  </p>
                  <div className="p-3 rounded-xl bg-[#181E38] border border-white/10 font-mono text-[11px] text-slate-200">
                    Baseline Score: <span className="text-[#05F1CD] font-bold">{activePreset.initialScore}/100</span> | Primary Flag: <span className="text-slate-300">{activePreset.criticObjection}</span>
                  </div>
                </div>
              )}

              {activeAgentNode === 'refiner' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#05F1CD]" />
                    <h3 className="font-display text-xl font-extrabold text-white">Iterative Refinement &amp; Objection Resolution</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Addresses partner objections directly by injecting transparent unit calculations into Slide 3 and reinforcing structural moats on Slide 5, bringing the deck to an investor-ready score of {activePreset.revisedScore}/100.
                  </p>
                  <div className="p-3 rounded-xl bg-[#181E38] border border-white/10 font-mono text-[11px] text-slate-200">
                    Post-Audit Score: <span className="text-[#05F1CD] font-bold">{activePreset.revisedScore}/100</span> | Status: <span className="text-[#05F1CD] font-bold">Ready for Partner Meeting</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. DYNAMIC VC PERSONA STRESS-TEST DRILLS */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="pill-badge-cobalt">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-[#FFCCD5]" />
              VC Partner Simulation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Stress-Test Against 4 Investor Personas
            </h2>
            <p className="text-sm text-slate-400">
              Each investor persona evaluates your startup through distinct rubric weights and partner meeting objection drills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.values(VC_PERSONAS).map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePersonaDrill(p.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  activePersonaDrill === p.id
                    ? 'bg-[#181E38] border-[#4D44FF] shadow-2xl scale-[1.02] ring-1 ring-[#4D44FF]'
                    : 'bg-[#11162C] border-white/10 hover:border-white/20 hover:bg-[#181E38]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0D1122] text-[#A5B4FC] border border-white/10">
                      {p.id === 'seed_bull' ? 'Seed' : p.id === 'saas_skeptic' ? 'Series A' : p.id === 'deeptech_specialist' ? 'DeepTech' : 'Growth'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">{p.title} • {p.firmType.split('(')[0].trim()}</div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{p.evaluationBias}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-[#A5B4FC] font-mono">
                  {p.focusAreas.slice(0, 2).join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CALL TO ACTION FOOTER */}
        <section className="rounded-3xl p-8 sm:p-14 text-center space-y-6 bg-[#11162C] border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-poster text-5xl sm:text-7xl font-extrabold text-white uppercase tracking-wide">
              READY TO PITCH WITH <span className="text-[#FFCCD5]">CONVICTION?</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generate, audit, and export your 10-slide investor pitch deck in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onLaunchStudio()}
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-sm btn-cobalt-primary shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFCCD5]" />
              <span>Open Studio Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreReferenceDecks}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm btn-cobalt-secondary transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>Explore 9 Reference Decks</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
