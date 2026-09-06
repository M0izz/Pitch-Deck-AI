export type SlideType =
  | 'problem'
  | 'solution'
  | 'market_size'
  | 'business_model'
  | 'competition'
  | 'go_to_market'
  | 'team'
  | 'financials'
  | 'traction'
  | 'funding_ask';

export type ProvenanceType =
  | 'grounded_comp'
  | 'reference_archetype'
  | 'formula_derived'
  | 'founder_estimate';

export type ConfidenceTier =
  | 'Verified Benchmark (95% conf)'
  | 'Formula-Derived (90% conf)'
  | 'Reference Pattern (85% conf)'
  | 'Founder Estimate (65% conf — verification needed)';

export interface ProvenanceFootnote {
  id: string;
  claim: string;
  sourceType: ProvenanceType;
  sourceLabel: string;
  formulaOrCitation?: string;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
}

export interface ProblemSlideData {
  title: string;
  subtitle: string;
  painPoints: {
    title: string;
    description: string;
    quantifiedLoss: string;
    affectedGroup: string;
    provenanceId?: string;
  }[];
  urgencyTrigger: string;
  statusQuoAlternative: string;
}

export interface SolutionSlideData {
  title: string;
  tagline: string;
  corePillars: {
    name: string;
    benefit: string;
    howItWorks: string;
  }[];
  secretSauce: string;
  beforeVsAfter: {
    before: string;
    after: string;
  };
}

export interface MarketSizeSlideData {
  title: string;
  marketDescription: string;
  cagr: string;
  cagrProvenance?: string;
  tam: {
    value: string;
    label: string;
    description: string;
    methodology: string;
  };
  sam: {
    value: string;
    label: string;
    description: string;
    methodology: string;
  };
  som: {
    value: string;
    label: string;
    description: string;
    methodology: string;
  };
  bottomUpFormula: {
    targetCustomers: string;
    arpuAnnual: string;
    derivedMarket: string;
    derivationStep: string;
  };
}

export interface BusinessModelSlideData {
  title: string;
  modelType: string;
  pricingTiers: {
    name: string;
    price: string;
    period: string;
    features: string[];
    isPrimary?: boolean;
  }[];
  unitEconomics: {
    cac: string;
    ltv: string;
    ltvCacRatio: string;
    paybackMonths: string;
    grossMarginPercent: string;
  };
  expansionRevenueDriver: string;
}

export interface CompetitionSlideData {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  ourPosition: {
    name: string;
    x: number;
    y: number;
    tagline: string;
  };
  competitors: {
    name: string;
    x: number;
    y: number;
    flawOrWeakness: string;
  }[];
  defensibilityMoats: string[];
}

export interface GtmSlideData {
  title: string;
  primaryChannels: {
    channel: string;
    strategy: string;
    expectedCac: string;
    sharePercent: number;
  }[];
  growthFlywheel: string;
  phases: {
    phase: string;
    timeline: string;
    targetMilestone: string;
  }[];
  salesMotion: string;
}

export interface TeamSlideData {
  title: string;
  teamRationale: string;
  members: {
    name: string;
    role: string;
    pedigree: string;
    domainSuperpower: string;
    avatarUrl?: string;
  }[];
  advisors: {
    name: string;
    affiliation: string;
    expertise: string;
  }[];
  keyHiresPlanned: string[];
}

export interface FinancialsSlideData {
  title: string;
  forecastYears: {
    year: string;
    revenue: number;
    formattedRevenue: string;
    expenses: number;
    formattedExpenses: string;
    customers: number;
    ebitdaPercent: string;
    grossMarginPercent: string;
  }[];
  breakevenTimeline: string;
  keyAssumptions: string[];
}

export interface TractionSlideData {
  title: string;
  stageSummary: string;
  keyMetrics: {
    label: string;
    value: string;
    growthRate?: string;
    provenanceTag: string;
  }[];
  milestonesAchieved: {
    dateOrPhase: string;
    milestone: string;
  }[];
  pilotOrCustomerProof: string;
}

export interface FundingAskSlideData {
  title: string;
  targetAmount: string;
  roundType: string;
  runwayMonths: string;
  useOfFunds: {
    category: string;
    percentage: number;
    allocationAmount: string;
    description: string;
  }[];
  milestonesTargetedWithCapital: string[];
  coInvestorsOrCurrentCommitments: string;
}

export interface SlideContentMap {
  problem: ProblemSlideData;
  solution: SolutionSlideData;
  market_size: MarketSizeSlideData;
  business_model: BusinessModelSlideData;
  competition: CompetitionSlideData;
  go_to_market: GtmSlideData;
  team: TeamSlideData;
  financials: FinancialsSlideData;
  traction: TractionSlideData;
  funding_ask: FundingAskSlideData;
}

export interface Slide<T extends SlideType = SlideType> {
  id: string;
  type: T;
  slideNumber: number;
  navTitle: string;
  content: SlideContentMap[T];
  speakerNotes: string;
  groundedArchetypeCitation?: string;
  provenanceList: ProvenanceFootnote[];
  revisionCount: number;
  resolutionNote?: string;
}

export type VCPersona =
  | 'seed_bull'
  | 'saas_skeptic'
  | 'deeptech_specialist'
  | 'strategic_corporate';

export interface VCPersonaConfig {
  id: VCPersona;
  name: string;
  title: string;
  firmType: string;
  avatarIcon: string;
  focusAreas: string[];
  evaluationBias: string;
  weights: {
    marketOpportunity: number;
    defensibilityAndMoat: number;
    unitEconomicsRigor: number;
    gtmExecutionClarity: number;
    askAndRunwayLogic: number;
  };
  colorAccent: string;
}

export interface VCCritiqueResult {
  overallScore: number;
  persona: VCPersona;
  verdict: 'Strong Invest' | 'Proceed to Partner Meeting' | 'Conditional Interest (Needs Revision)' | 'Pass';
  categoryScores: {
    marketOpportunity: number;
    defensibilityAndMoat: number;
    unitEconomicsRigor: number;
    gtmExecutionClarity: number;
    askAndRunwayLogic: number;
  };
  rubricThresholdPassed: boolean;
  rubricExplanation: string;
  executiveSummary: string;
  criticalRedFlags: string[];
  partnerObjections: {
    question: string;
    objectionContext: string;
    suggestedRemedy: string;
  }[];
  slideSpecificCritiques: {
    slideType: SlideType;
    status: 'pass' | 'warning' | 'needs_revision';
    issue: string;
    recommendation: string;
  }[];
}

export interface SlideRevisionDiff {
  slideType: SlideType;
  slideNumber: number;
  originalDraft: Partial<Slide>;
  revisedVersion: Partial<Slide>;
  triggerObjection: string;
  agenticActionsTaken: string[];
  scoreDelta: number;
  resolutionSummary: string;
}

export type AgentRole =
  | 'orchestrator'
  | 'researcher'
  | 'narrative_architect'
  | 'vc_critic'
  | 'revision_specialist';

export interface AgentLogMessage {
  id: string;
  timestamp: string;
  agentRole: AgentRole;
  agentName: string;
  type: 'thought' | 'tool_call' | 'tool_result' | 'revision' | 'status';
  content: string;
  toolName?: string;
  toolArgs?: Record<string, any>;
  durationMs?: number;
}

export interface UserBusinessInput {
  businessIdea: string;
  targetAudience: string;
  industryVertical: string;
  fundingStage: string;
  revenueModel: string;
  uspOrMoat: string;
  selectedReferenceArchetype?: string;
}

export interface ReferenceDeckArchetype {
  id: string;
  name: string;
  company: string;
  industry: string;
  businessModel: string;
  stage: string;
  roundStage?: string;
  amountRaised: string;
  location: string;
  year: number;
  leadInvestors?: string[];
  coreInsight: string;
  slideSequence: string[];
  narrativeNotes: string[];
  keyLesson: string;
  winningSlidePatterns?: {
    slideType: SlideType;
    patternDescription: string;
    benchmarkFormula: string;
    iconicQuote: string;
  }[];
  colorPalette?: {
    primary: string;
    secondary: string;
  };
}

export interface ReadinessDeltaMetrics {
  initialScore: number;
  finalScore: number;
  scoreDelta: number;
  revisionPasses: number;
  unresolvedFlags: string[];
}
