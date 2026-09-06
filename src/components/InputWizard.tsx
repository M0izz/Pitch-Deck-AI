import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Layers,
  DollarSign,
  TrendingUp,
  Target
} from 'lucide-react';
import type { UserBusinessInput } from '../types/pitch';
import { REFERENCE_DECKS_DATABASE } from '../services/referenceDecks';
import { CUSTOM_DECK_REGISTRY } from '../services/pdfIndexer';

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
      industryVertical: 'B2B SaaS / Enterprise Software',
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
      fundingStage: 'Seed Round ($3.0M)',
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
      fundingStage: 'Seed Round ($2.0M)',
      revenueModel: 'Usage-based compute & token gateway + Enterprise SOC2 cluster hosting',
      uspOrMoat: 'Zero-latency edge memory coordination with deterministic rollback guaranteeing 100% autitable execution.',
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

  useEffect(() => {
    if (initialInput) {
      setFormData(initialInput);
    }
  }, [initialInput]);

  const handleApplyPreset = (preset: UserBusinessInput) => {
    setFormData(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessIdea.trim()) return;
    onGenerate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-white">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="pill-badge shadow-sm">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Venture Pitch Studio
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#FFCCD5] tracking-tight">
          Describe Your Startup Concept
        </h1>
        <p className="text-sm text-white/90 max-w-xl mx-auto">
          Enter your startup details below. We'll size your market with bottom-up arithmetic, build 10 structured investor slides, and evaluate your pitch against partner-level rubrics.
        </p>
      </div>

      {/* Quick Concept Presets */}
      <div className="space-y-2">
        <div className="text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#FFCCD5]" />
          Optional One-Click Idea Presets:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_CONCEPTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className={`p-3.5 rounded-2xl border text-left transition-all group ${
                formData.businessIdea === preset.data.businessIdea
                  ? 'bg-[#FFCCD5] text-[#2612B0] shadow-lg border-[#FFCCD5] scale-105'
                  : 'bg-[#2A15C2]/80 border-white/20 text-white/80 hover:text-white hover:bg-[#3823D9]'
              }`}
            >
              <span className={`text-[10px] font-mono-micro font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border block w-fit mb-1.5 ${
                formData.businessIdea === preset.data.businessIdea
                  ? 'bg-[#2612B0] text-[#FFCCD5] border-transparent'
                  : 'bg-[#3823D9] text-[#FFCCD5] border-[#FFCCD5]/30'
              }`}>
                {preset.badge}
              </span>
              <span className="text-xs font-bold line-clamp-1">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Concept Form */}
      <form onSubmit={handleSubmit} className="bg-[#2A15C2]/95 p-6 sm:p-8 rounded-3xl border border-white/30 shadow-2xl space-y-6">
        {/* Field 1: Core Business Idea */}
        <div className="space-y-2">
          <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#FFCCD5]" />
              1. What is your Core Business Idea &amp; Value Proposition? <span className="text-white">*</span>
            </span>
            <span className="text-[11px] text-white/60 font-normal">Be as specific or visionary as you like</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.businessIdea}
            onChange={(e) => setFormData({ ...formData, businessIdea: e.target.value })}
            placeholder="e.g. AI-powered dynamic route optimization for cold-chain pharmaceutical freight, reducing spoilage by 40%..."
            className="w-full bg-[#3823D9] border border-white/25 rounded-2xl p-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FFCCD5] transition-colors"
          />
        </div>

        {/* 2-Column Row: Target ICP & Vertical */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Field 2: Target Audience / ICP */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#FFCCD5]" />
              2. Target Audience / Ideal Customer Profile (ICP) <span className="text-white">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="e.g. VP Logistics, Fleet Managers, Pharma Supply Chain Leads"
              className="w-full bg-[#3823D9] border border-white/25 rounded-xl p-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FFCCD5] transition-colors"
            />
          </div>

          {/* Field 3: Industry Vertical */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#FFCCD5]" />
              3. Industry Vertical &amp; Domain <span className="text-white">*</span>
            </label>
            <select
              value={formData.industryVertical}
              onChange={(e) => setFormData({ ...formData, industryVertical: e.target.value })}
              aria-label="Industry Vertical & Domain"
              className="w-full bg-[#3823D9] border border-white/25 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFCCD5] transition-colors cursor-pointer"
            >
              <option value="B2B SaaS / Enterprise Software">B2B SaaS / Enterprise Software</option>
              <option value="AI / DeepTech / Developer Tools">AI / DeepTech / Developer Tools</option>
              <option value="Fintech / Payments / Insurtech">Fintech / Payments / Insurtech</option>
              <option value="Healthcare / BioTech / HealthTech">Healthcare / BioTech / HealthTech</option>
              <option value="ClimateTech / Clean Energy / Hardware">ClimateTech / Clean Energy / Hardware</option>
              <option value="Consumer / Marketplace / Social">Consumer / Marketplace / Social</option>
            </select>
          </div>
        </div>

        {/* 2-Column Row: Funding Stage & Revenue Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Field 4: Funding Stage */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#FFCCD5]" />
              4. Target Funding Stage
            </label>
            <select
              value={formData.fundingStage}
              onChange={(e) => setFormData({ ...formData, fundingStage: e.target.value })}
              aria-label="Target Funding Stage"
              className="w-full bg-[#3823D9] border border-white/25 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFCCD5] transition-colors cursor-pointer"
            >
              <option value="Pre-Seed Round ($750k)">Pre-Seed Round ($750k)</option>
              <option value="Seed Round ($2.5M)">Seed Round ($2.5M)</option>
              <option value="Series A Round ($8.0M)">Series A Round ($8.0M)</option>
              <option value="Series B Round ($20.0M)">Series B Round ($20.0M)</option>
            </select>
          </div>

          {/* Field 5: Revenue Model */}
          <div className="space-y-2">
            <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#FFCCD5]" />
              5. Revenue Model / Monetization
            </label>
            <input
              type="text"
              value={formData.revenueModel}
              onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
              placeholder="e.g. Tiered Enterprise Subscription ($15k - $60k/yr) + Usage API"
              className="w-full bg-[#3823D9] border border-white/25 rounded-xl p-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FFCCD5] transition-colors"
            />
          </div>
        </div>

        {/* Field 6: Secret Sauce / Unfair Advantage */}
        <div className="space-y-2">
          <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center justify-between">
            <span>6. Unfair Advantage / Secret Sauce / Defensibility Moat (Optional)</span>
            <span className="text-[11px] text-white/60 font-normal">Used by Critic Agent to test defensibility</span>
          </label>
          <input
            type="text"
            value={formData.uspOrMoat}
            onChange={(e) => setFormData({ ...formData, uspOrMoat: e.target.value })}
            placeholder="e.g. Proprietary telematics dataset with 500M miles of historical sensor telemetry"
            className="w-full bg-[#3823D9] border border-white/25 rounded-xl p-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FFCCD5] transition-colors"
          />
        </div>

        {/* Field 7: Reference Deck Archetype Grounding */}
        <div className="space-y-2 pt-2 border-t border-white/20">
          <label className="block text-xs font-mono-micro font-bold uppercase tracking-wider text-[#FFCCD5] flex items-center justify-between">
            <span>7. Ground Structure with Reference Deck Archetype:</span>
            <span className="text-[11px] text-white/80 font-semibold font-mono-micro">
              {REFERENCE_DECKS_DATABASE.length + CUSTOM_DECK_REGISTRY.length} Archetypes Available
            </span>
          </label>
          <select
            value={formData.selectedReferenceArchetype}
            onChange={(e) => setFormData({ ...formData, selectedReferenceArchetype: e.target.value })}
            aria-label="Reference Deck Archetype Grounding"
            className="w-full bg-[#3823D9] border border-white/25 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFCCD5] transition-colors cursor-pointer font-mono-micro"
          >
            {REFERENCE_DECKS_DATABASE.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#2A15C2] text-white">
                {d.name} ({d.year}) — {d.industry}
              </option>
            ))}
            {CUSTOM_DECK_REGISTRY.map((cd) => (
              <option key={cd.id} value={cd.id} className="bg-[#2A15C2] text-white">
                [Custom Ingested] {cd.title} ({cd.pageCount} slides)
              </option>
            ))}
          </select>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating || !formData.businessIdea.trim()}
            className="w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base btn-pink-primary shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[#2612B0]" />
            <span>{isGenerating ? 'Synthesizing Deck & Sizing Market...' : 'Generate 10-Slide Pitch Deck'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
