import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Layers,
  DollarSign,
  TrendingUp,
  Target,
  Wand2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import type { UserBusinessInput } from '../types/pitch';
import { REFERENCE_DECKS_DATABASE } from '../services/referenceDecks';
import { CUSTOM_DECK_REGISTRY } from '../services/pdfIndexer';
import { getStoredGeminiApiKey } from '../services/geminiService';
import { detectDomainProfile, deriveStartupBrandName } from '../agents/dynamicGenerator';

interface InputWizardProps {
  onGenerate: (input: UserBusinessInput) => void;
  isGenerating: boolean;
  initialInput?: UserBusinessInput | null;
}

const PRESET_CONCEPTS: {
  label: string;
  badge: string;
  data: UserBusinessInput;
}[] = [
  {
    label: 'Supply Chain AI Risk Engine',
    badge: 'Enterprise SaaS',
    data: {
      businessIdea: 'Predictive supply chain disruption intelligence orchestrating autonomous rerouting for Fortune 500 retailers and manufacturers.',
      targetAudience: 'Chief Supply Chain Officers, VP Logistics, Global Procurement Teams',
      industryVertical: 'Logistics & Supply Chain',
      fundingStage: 'Seed Round ($2.5M)',
      revenueModel: 'Tiered Enterprise SaaS ($25k - $120k ARR / license)',
      uspOrMoat: 'Proprietary multi-modal satellite & maritime telemetry graph with autonomous self-healing logistics rerouting.',
      selectedReferenceArchetype: 'sequoia-blueprint',
    }
  },
  {
    label: 'Ambient Clinical AI Scribe',
    badge: 'HealthTech AI',
    data: {
      businessIdea: 'Zero-click ambient voice intelligence for hospital networks converting natural patient-doctor conversations into verified FHIR medical records.',
      targetAudience: 'Hospital Health Systems, Physician Practice Groups, Chief Medical Officers',
      industryVertical: 'Healthcare / BioTech / HealthTech',
      fundingStage: 'Seed Round ($2.5M)',
      revenueModel: 'Per-Clinician Monthly Subscription ($499/mo) + Enterprise EHR Integration Fee',
      uspOrMoat: 'Sub-second clinical entity extraction with 99.8% medical billing code accuracy and native Epic/Cerner bi-directional sync.',
      selectedReferenceArchetype: 'buffer-2011',
    }
  },
  {
    label: 'Developer AI Agent Mesh',
    badge: 'DeepTech Infra',
    data: {
      businessIdea: 'Distributed serverless runtime providing deterministic state management, memory isolation, and safety guardrails for autonomous AI agent swarms.',
      targetAudience: 'Software Engineering Teams, CTOs, AI Infrastructure Architects',
      industryVertical: 'AI / DeepTech / Developer Tools',
      fundingStage: 'Seed Round ($2.5M)',
      revenueModel: 'Usage-based compute & token gateway + Enterprise SOC2 cluster hosting',
      uspOrMoat: 'Zero-latency edge memory coordination with deterministic rollback guaranteeing 100% auditable execution.',
      selectedReferenceArchetype: 'stripe-2010',
    }
  },
  {
    label: 'CleanTech Grid Telemetry',
    badge: 'ClimateTech',
    data: {
      businessIdea: 'AI-driven dynamic load balancing and battery energy storage arbitrage for commercial microgrids and renewable solar installations.',
      targetAudience: 'Commercial Real Estate Operators, Grid Utilities, Energy Storage Asset Managers',
      industryVertical: 'ClimateTech / Clean Energy / Hardware',
      fundingStage: 'Seed Round ($2.5M)',
      revenueModel: 'Base SaaS Platform Fee + 15% Performance Share of Energy Arbitrage Savings',
      uspOrMoat: 'Sub-minute weather-predictive dispatch algorithm delivering 28% higher ROI on battery storage cycles.',
      selectedReferenceArchetype: 'uber-2008',
    }
  }
];

export const InputWizard: React.FC<InputWizardProps> = ({
  onGenerate,
  isGenerating,
  initialInput,
}) => {
  const [formData, setFormData] = useState<UserBusinessInput>({
    businessIdea: '',
    targetAudience: '',
    industryVertical: 'B2B SaaS / Enterprise Software',
    fundingStage: 'Seed Round ($2.5M)',
    revenueModel: 'Tiered B2B SaaS Subscription',
    uspOrMoat: '',
    selectedReferenceArchetype: 'sequoia-blueprint',
  });

  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialInput) {
      setFormData(initialInput);
    }
    setHasApiKey(Boolean(getStoredGeminiApiKey()));
  }, [initialInput]);

  const handleApplyPreset = (preset: UserBusinessInput) => {
    setFormData(preset);
    setValidationError(null);
  };

  const handleAutoExpandIdea = () => {
    const raw = formData.businessIdea.trim().toLowerCase();
    setValidationError(null);
    
    if (raw === 'hi' || raw === 'hello' || raw === 'chat' || raw === 'messaging') {
      setFormData({
        businessIdea: 'SayHi — Ambient conversational intelligence and async video presence for distributed engineering teams, reducing meeting fatigue and message interruptions by 70%.',
        targetAudience: 'Distributed Engineering Leads, Remote Knowledge Workers & Global Teams',
        industryVertical: 'Conversational AI & Workplace Communication',
        fundingStage: 'Seed Round ($2.5M)',
        revenueModel: 'Per-User Monthly SaaS ($12 - $24/seat/mo) with Self-Serve Freemium Loop',
        uspOrMoat: 'Sub-second WebRTC async video snippets with automated AI thread summaries and zero-distraction availability signals.',
        selectedReferenceArchetype: 'buffer-2011'
      });
      return;
    }

    // Generic intelligent expansion
    const detected = detectDomainProfile(formData.businessIdea, formData.industryVertical);
    const brand = deriveStartupBrandName(formData.businessIdea || 'Platform', detected);
    
    setFormData({
      ...formData,
      businessIdea: `${brand.name} — Next-generation automated intelligence platform solving operational friction for ${detected.primaryMetricName.toLowerCase()}.`,
      targetAudience: formData.targetAudience.trim() || detected.primaryMetricName,
      revenueModel: formData.revenueModel.trim() || detected.pricingModelType,
      uspOrMoat: formData.uspOrMoat.trim() || `Proprietary ${detected.category.toLowerCase()} workflow engine with built-in ${detected.regulatoryFocus}.`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idea = formData.businessIdea.trim();

    // 1. Check minimum length
    if (!idea || idea.length < 15) {
      setValidationError(
        `Your input ("${idea || 'empty'}") is too brief to generate an authentic pitch deck. A genuine investor pitch requires at least a 1-sentence description (15+ characters) of the problem and solution, or click one of the verified startup presets above.`
      );
      return;
    }

    // 2. Check for spam / filler words e.g. "hi", "test", "asdf", repeated single words
    const words = idea.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const commonSpam = ['hi', 'hello', 'test', 'asdf', 'qwerty', 'fake', 'random', 'spam', 'blah', 'xxx', 'aaa', '123'];
    const isAllSpamWords = words.length <= 4 && words.every(w => commonSpam.includes(w));
    const isSingleWordRepeated = words.length >= 3 && new Set(words).size === 1;

    if (isAllSpamWords || isSingleWordRepeated) {
      setValidationError(
        `Placeholder spam detected ("${idea}"). Institutional investor decks cannot be synthesized from placeholder text. Please describe a genuine startup concept or choose one of our 4 vetted startup presets above.`
      );
      return;
    }

    setValidationError(null);
    onGenerate(formData);
  };

  const ideaLength = formData.businessIdea.trim().length;
  const isTooShort = ideaLength > 0 && ideaLength < 15;
  const detectedProfile = detectDomainProfile(formData.businessIdea, formData.industryVertical);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-white">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4D44FF]/15 border border-[#4D44FF]/30 text-[#A5B4FC] text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#FFCCD5]" />
          Venture Pitch Studio Engine
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Describe Your Startup Concept
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Enter any startup idea below. Our multi-agent swarm will calculate bottom-up market sizing, architect 10 investor slides, and stress-test the deck against VC rubrics.
        </p>

        {/* Engine Status Callout */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono pt-1">
          <span className="text-slate-400">Synthesis Engine:</span>
          {hasApiKey ? (
            <span className="text-[#05F1CD] flex items-center gap-1 font-semibold bg-[#05F1CD]/10 px-2.5 py-0.5 rounded-full border border-[#05F1CD]/30">
              <CheckCircle2 className="w-3 h-3" /> Live Google Gemini 2.0 Flash Active
            </span>
          ) : (
            <span className="text-[#A5B4FC] flex items-center gap-1 font-semibold bg-[#4D44FF]/15 px-2.5 py-0.5 rounded-full border border-[#4D44FF]/30">
              <ShieldCheck className="w-3 h-3 text-[#FFCCD5]" /> Autonomous Multi-Agent Synthesis Engine Active
            </span>
          )}
        </div>
      </div>

      {/* Quick Concept Presets */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5B4FC] flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#FFCCD5]" />
          Quick Idea Presets:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_CONCEPTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className={`p-3.5 rounded-2xl border text-left transition-all group ${
                formData.businessIdea === preset.data.businessIdea
                  ? 'bg-[#1E2548] text-white shadow-lg border-[#4D44FF] ring-1 ring-[#4D44FF]'
                  : 'bg-[#11162C] border-white/10 text-slate-300 hover:text-white hover:bg-[#181E38] hover:border-white/20'
              }`}
            >
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border block w-fit mb-1.5 ${
                formData.businessIdea === preset.data.businessIdea
                  ? 'bg-[#4D44FF] text-white border-transparent'
                  : 'bg-[#181E38] text-[#FFCCD5] border-white/10'
              }`}>
                {preset.badge}
              </span>
              <span className="text-xs font-bold line-clamp-1 text-white">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Alert Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-white flex items-start gap-3 shadow-xl animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="font-bold text-amber-300 text-sm">
              Input Quality Notice — Substantive Thesis Required
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {validationError}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Quick-start with a verified concept:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(PRESET_CONCEPTS[0].data)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#181E38] hover:bg-[#222A4E] text-[#FFCCD5] border border-white/20 transition-all cursor-pointer"
              >
                Supply Chain AI
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(PRESET_CONCEPTS[1].data)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#181E38] hover:bg-[#222A4E] text-[#05F1CD] border border-white/20 transition-all cursor-pointer"
              >
                Ambient Clinical Scribe
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(PRESET_CONCEPTS[2].data)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#181E38] hover:bg-[#222A4E] text-[#38BDF8] border border-white/20 transition-all cursor-pointer"
              >
                Developer AI Agent Mesh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Concept Form */}
      <form onSubmit={handleSubmit} className="bg-[#11162C] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        {/* Field 1: Core Business Idea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#FFCCD5]" />
              1. What is your Core Business Idea &amp; Value Proposition? <span className="text-[#FFCCD5]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                ideaLength >= 15 ? 'text-[#05F1CD] bg-[#05F1CD]/10' : ideaLength > 0 ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500'
              }`}>
                {ideaLength}/15 min chars
              </span>
              {isTooShort && (
                <button
                  type="button"
                  onClick={handleAutoExpandIdea}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#05F1CD] hover:text-white bg-[#05F1CD]/10 hover:bg-[#05F1CD]/20 px-2.5 py-1 rounded-lg border border-[#05F1CD]/30 transition-all cursor-pointer font-bold"
                >
                  <Wand2 className="w-3 h-3 text-[#05F1CD]" />
                  Auto-Expand Idea
                </button>
              )}
            </div>
          </div>

          <textarea
            required
            rows={3}
            value={formData.businessIdea}
            onChange={(e) => {
              setFormData({ ...formData, businessIdea: e.target.value });
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. AI-powered dynamic route optimization for cold-chain pharmaceutical freight, reducing spoilage by 40%..."
            className="w-full bg-[#181E38] border border-white/15 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all"
          />

          {isTooShort && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-slate-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Detailed thesis needed: </span>
                Please write at least 15 characters describing what problem your product solves, or click{' '}
                <button type="button" onClick={handleAutoExpandIdea} className="text-[#05F1CD] underline hover:text-white font-semibold cursor-pointer">
                  Auto-Expand Idea
                </button>{' '}
                to convert "{formData.businessIdea.trim()}" into a complete startup thesis.
              </div>
            </div>
          )}

          {formData.businessIdea.trim().length > 0 && !isTooShort && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Detected Sector:</span>
              <span className="text-[#05F1CD] font-bold bg-[#05F1CD]/10 px-2 py-0.5 rounded border border-[#05F1CD]/20">
                {detectedProfile.category}
              </span>
            </div>
          )}
        </div>

        {/* 2-Column Row: Target ICP & Vertical */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Field 2: Target Audience / ICP */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#FFCCD5]" />
              2. Target Audience / Ideal Customer Profile (ICP) <span className="text-[#FFCCD5]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder={detectedProfile.primaryMetricName || "e.g. VP Logistics, Fleet Managers"}
              className="w-full bg-[#181E38] border border-white/15 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all"
            />
          </div>

          {/* Field 3: Industry Vertical */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#FFCCD5]" />
              3. Industry Vertical &amp; Domain <span className="text-[#FFCCD5]">*</span>
            </label>
            <select
              value={formData.industryVertical}
              onChange={(e) => setFormData({ ...formData, industryVertical: e.target.value })}
              aria-label="Industry Vertical & Domain"
              className="w-full bg-[#181E38] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all cursor-pointer"
            >
              <option value="Conversational AI & Workplace Communication">Conversational AI & Workplace Communication</option>
              <option value="B2B SaaS / Enterprise Software">B2B SaaS / Enterprise Software</option>
              <option value="AI / DeepTech / Developer Tools">AI / DeepTech / Developer Tools</option>
              <option value="Fintech / Payments / Insurtech">Fintech / Payments / Insurtech</option>
              <option value="Healthcare / BioTech / HealthTech">Healthcare / BioTech / HealthTech</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              <option value="ClimateTech / Clean Energy / Hardware">ClimateTech / Clean Energy / Hardware</option>
              <option value="E-Commerce & Digital Retail">E-Commerce & Digital Retail</option>
              <option value="FoodTech & Hospitality Systems">FoodTech & Hospitality Systems</option>
              <option value="Gaming & Interactive Entertainment">Gaming & Interactive Entertainment</option>
              <option value="PropTech & Real Estate Innovation">PropTech & Real Estate Innovation</option>
              <option value="Pet Care & Veterinary Services">Pet Care & Veterinary Services</option>
              <option value="EdTech & Future of Learning">EdTech & Future of Learning</option>
              <option value="Consumer / Marketplace / Social">Consumer / Marketplace / Social</option>
            </select>
          </div>
        </div>

        {/* 2-Column Row: Funding Stage & Revenue Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Field 4: Funding Stage */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#FFCCD5]" />
              4. Target Funding Stage
            </label>
            <select
              value={formData.fundingStage}
              onChange={(e) => setFormData({ ...formData, fundingStage: e.target.value })}
              aria-label="Target Funding Stage"
              className="w-full bg-[#181E38] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all cursor-pointer"
            >
              <option value="Pre-Seed Round ($750k)">Pre-Seed Round ($750k)</option>
              <option value="Seed Round ($2.5M)">Seed Round ($2.5M)</option>
              <option value="Series A Round ($8.5M)">Series A Round ($8.5M)</option>
              <option value="Series B Round ($20.0M)">Series B Round ($20.0M)</option>
            </select>
          </div>

          {/* Field 5: Revenue Model */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#FFCCD5]" />
              5. Revenue Model / Monetization
            </label>
            <input
              type="text"
              value={formData.revenueModel}
              onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
              placeholder={detectedProfile.pricingModelType || "e.g. Tiered Enterprise Subscription"}
              className="w-full bg-[#181E38] border border-white/15 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all"
            />
          </div>
        </div>

        {/* Field 6: Secret Sauce / Unfair Advantage */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center justify-between">
            <span>6. Unfair Advantage / Secret Sauce / Moat (Optional)</span>
            <span className="text-[11px] text-slate-400 font-normal">Used by Critic Agent to evaluate defensibility</span>
          </label>
          <input
            type="text"
            value={formData.uspOrMoat}
            onChange={(e) => setFormData({ ...formData, uspOrMoat: e.target.value })}
            placeholder="e.g. Proprietary real-time context models with 99.8% precision"
            className="w-full bg-[#181E38] border border-white/15 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all"
          />
        </div>

        {/* Field 7: Reference Deck Archetype Grounding */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center justify-between">
            <span>7. Ground Structure with Reference Archetype:</span>
            <span className="text-[11px] text-slate-400 font-semibold font-mono">
              {REFERENCE_DECKS_DATABASE.length + CUSTOM_DECK_REGISTRY.length} Archetypes Available
            </span>
          </label>
          <select
            value={formData.selectedReferenceArchetype}
            onChange={(e) => setFormData({ ...formData, selectedReferenceArchetype: e.target.value })}
            aria-label="Reference Deck Archetype Grounding"
            className="w-full bg-[#181E38] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#4D44FF] focus:ring-1 focus:ring-[#4D44FF] transition-all cursor-pointer font-mono"
          >
            {REFERENCE_DECKS_DATABASE.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#11162C] text-white">
                {d.name} ({d.year}) — {d.industry}
              </option>
            ))}
            {CUSTOM_DECK_REGISTRY.map((cd) => (
              <option key={cd.id} value={cd.id} className="bg-[#11162C] text-white">
                [Custom Ingested] {cd.title} ({cd.pageCount} slides)
              </option>
            ))}
          </select>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isGenerating || !formData.businessIdea.trim()}
            className="w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base btn-cobalt-primary shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#FFCCD5]" />
            <span>{isGenerating ? 'Synthesizing Deck & Sizing Market...' : 'Generate 10-Slide Pitch Deck'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
