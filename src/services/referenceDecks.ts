import type { ReferenceDeckArchetype, SlideType } from '../types/pitch';

/**
 * Widely-cited public 11-point pitch deck outline.
 * Represents a standard institutional framework rather than any single company's proprietary structure.
 */
export const STANDARD_PITCH_OUTLINE: readonly string[] = [
  'Problem',
  'Solution',
  'Product',
  'Market Size',
  'Business Model',
  'Underlying Magic',
  'Competition',
  'Better/Different',
  'Marketing Plan',
  'Team',
  'Traction/Milestones',
] as const;

/**
 * Curated structural metadata for 9 historical company fundraises and public frameworks.
 * All entries are original syntheses of public facts, not scraped from third-party template sites.
 */
export const REFERENCE_DECKS_DATABASE: ReferenceDeckArchetype[] = [
  {
    id: 'airbnb-2008',
    name: 'Airbnb',
    company: 'Airbnb (AirBed & Breakfast)',
    industry: 'Hospitality & Travel Marketplace',
    businessModel: 'Two-Sided Peer-to-Peer Marketplace (10% Transaction Fee)',
    stage: 'Seed',
    roundStage: 'Seed',
    amountRaised: '$600,000',
    location: 'San Francisco, CA',
    year: 2008,
    leadInvestors: ['Sequoia Capital', 'Y Combinator'],
    coreInsight: 'Connecting travelers with local hosts to monetize surplus living space with low transaction friction.',
    slideSequence: [
      'Problem',
      'Solution',
      'Market Validation',
      'Market Size',
      'Product',
      'Business Model',
      'Market Adoption',
      'Competition',
      'Competitive Advantages',
      'Team',
      'Press',
      'User Testimonials',
      'Financials / Ask'
    ],
    narrativeNotes: [
      'Led with a personal, relatable three-part problem statement (price, hotel isolation, lack of local booking) before introducing any market sizing.',
      'Grounded the total market size in tangible global trip volume rather than abstract top-down industry spend.',
      'Framed the business model as an unmistakable, single-line unit equation (10% commission on average transaction size).'
    ],
    keyLesson: 'Anchor early marketplace pitches around a concrete unit transaction rather than abstract gross merchandise volume.',
    winningSlidePatterns: [
      {
        slideType: 'problem',
        patternDescription: '3-bullet friction framework focusing on high price, impersonal hotels, and lack of host connectivity.',
        benchmarkFormula: 'Quantified price delta + Host monthly earning potential.',
        iconicQuote: 'Save money when traveling, make money when hosting.'
      },
      {
        slideType: 'market_size',
        patternDescription: 'Triangulated trips funnel from global travel volume to serviceable budget online bookings.',
        benchmarkFormula: 'Target Market = Available Booking Volume × Average Take-Rate Fee.',
        iconicQuote: 'Over 10.6 million target budget trips booked annually.'
      },
      {
        slideType: 'business_model',
        patternDescription: 'Single take-rate monetization model across all marketplace transactions.',
        benchmarkFormula: '$25 avg fee per 3-night stay at 10% commission.',
        iconicQuote: 'We take a 10% commission on each transaction.'
      },
      {
        slideType: 'funding_ask',
        patternDescription: '12-month runway targeting 80,000 completed guest trips to reach operational breakeven.',
        benchmarkFormula: '$600k seed capital for 12 months runway.',
        iconicQuote: 'Raising $600k to reach key volume inflection.'
      }
    ],
    colorPalette: { primary: '#FF5A5F', secondary: '#00A699' }
  },
  {
    id: 'uber-2008',
    name: 'Uber',
    company: 'Uber (UberCab)',
    industry: 'On-Demand Urban Transportation',
    businessModel: 'On-Demand Platform Commission (Asset-Light 20% Fee)',
    stage: 'Seed',
    roundStage: 'Seed',
    amountRaised: '$1,570,000',
    location: 'San Francisco, CA',
    year: 2008,
    leadInvestors: ['First Round Capital', 'Lowercase Capital'],
    coreInsight: 'GPS-enabled smartphone dispatch turning private black cars into an on-demand personal utility.',
    slideSequence: [
      'Problem',
      'Solution',
      'The UberCab Concept',
      'Underlying Technology',
      'Use Cases',
      'User Benefits',
      'Market Size',
      'Market Expansion',
      'Fleet Logistics',
      'Traction / Milestones',
      'Financial Model',
      'Risk Mitigation'
    ],
    narrativeNotes: [
      'Contrast-driven problem framing comparing 10th-century radio dispatch to 1-click modern mobile dispatch.',
      'Introduced a market expansion multiplier argument, explaining how lowering consumer friction organically increases overall addressable ride frequency.',
      'Explicitly detailed unit-level driver dispatch economics to prove positive contribution margins from day one.'
    ],
    keyLesson: 'When entering a regulated or incumbent market, prove that reducing user friction expands total market demand beyond historic boundaries.',
    winningSlidePatterns: [
      {
        slideType: 'problem',
        patternDescription: 'Legacy taxi dispatch inefficiencies, long wait times, and unpredictable payment friction.',
        benchmarkFormula: 'Dispatch latency reduction from 25 minutes to under 5 minutes.',
        iconicQuote: 'Cabs rely on aging medallion radio systems with zero real-time location awareness.'
      },
      {
        slideType: 'market_size',
        patternDescription: 'Conservative core vs expansion scenarios showing latent demand unlocked by reliability.',
        benchmarkFormula: 'TAM Multiplier = Existing Limousine Market × 3x Latent Commuter Utility.',
        iconicQuote: 'Market size dynamically expands as ride hail becomes a daily habit.'
      }
    ],
    colorPalette: { primary: '#000000', secondary: '#1FBAD6' }
  },
  {
    id: 'doordash-2013',
    name: 'DoorDash',
    company: 'DoorDash (PaloAltoDelivery)',
    industry: 'Last-Mile Logistics & On-Demand Food Delivery',
    businessModel: 'Three-Sided Marketplace (Delivery Fee + Restaurant Commission)',
    stage: 'Seed',
    roundStage: 'Seed (YC S13)',
    amountRaised: '$2,400,000',
    location: 'Palo Alto, CA',
    year: 2013,
    leadInvestors: ['Khosla Ventures', 'Y Combinator', 'CRV'],
    coreInsight: 'Solving suburban merchant logistics with algorithmic batching and dedicated driver supply.',
    slideSequence: [
      'Problem',
      'Solution',
      'Product Demo',
      'Merchant Value Proposition',
      'Driver Fleet Model',
      'Unit Economics',
      'Local Density & Retention',
      'Market Size',
      'Competitive Matrix',
      'Team',
      'The Ask'
    ],
    narrativeNotes: [
      'Emphasized hyper-local merchant pain: 85%+ of local suburban restaurants had zero delivery capability prior to DoorDash.',
      'Proved demand density through early manual pilot operations conducted directly by the founders in Palo Alto.',
      'Broke down three-sided unit economics (merchant take-rate, customer delivery fee, and driver payout) to show contribution profitability per drop.'
    ],
    keyLesson: 'Demonstrate deep operational grit by showing hand-delivered founder validation before claiming automated platform scale.',
    winningSlidePatterns: [
      {
        slideType: 'problem',
        patternDescription: 'Local small merchants lack delivery fleets and cannot service off-premise consumer demand.',
        benchmarkFormula: 'Unserviced demand: 85% of restaurants had no delivery infrastructure.',
        iconicQuote: 'Local commerce is broken for suburban restaurants without dedicated logistics.'
      },
      {
        slideType: 'business_model',
        patternDescription: 'Three-sided fee model balancing merchant commission, customer delivery fee, and driver payout.',
        benchmarkFormula: 'Net Contribution Margin = (Commission + Delivery Fee) - Driver Cost.',
        iconicQuote: 'Positive contribution margin achieved on every completed local order.'
      }
    ],
    colorPalette: { primary: '#FF3008', secondary: '#191919' }
  },
  {
    id: 'facebook-2004',
    name: 'Facebook',
    company: 'Thefacebook',
    industry: 'Social Network & Digital Advertising',
    businessModel: 'Engagement-Driven Digital Advertising & Campus Sponsorships',
    stage: 'Angel / Seed',
    roundStage: 'Angel',
    amountRaised: '$500,000',
    location: 'Cambridge, MA / Palo Alto, CA',
    year: 2004,
    leadInvestors: ['Peter Thiel'],
    coreInsight: 'Real-identity collegiate social graph driving unprecedented daily user engagement and retention.',
    slideSequence: [
      'Mission Statement',
      'Campus Expansion Traction',
      'User Engagement Metrics',
      'Demographics & Audience',
      'Ad Products & Sponsorships',
      'Marketing Services',
      'Competitive Context',
      'Growth Trajectory',
      'Partnership Proposals'
    ],
    narrativeNotes: [
      'Led with raw, undeniable user engagement ratios rather than long-term monetization theories (over 60% of students logged in daily).',
      'Showcased rapid viral campus adoption without paid marketing spend to prove self-sustaining network effects.',
      'Framed the audience value around verified real-identity demographics that advertisers could not reach through television or print.'
    ],
    keyLesson: 'When early consumer engagement metrics are extraordinary, let the raw retention and frequency data lead the narrative.',
    winningSlidePatterns: [
      {
        slideType: 'traction',
        patternDescription: 'Extreme user retention: 70,000 users across initial campuses with 60%+ daily active return rate.',
        benchmarkFormula: 'DAU/MAU Engagement Ratio > 60% across launched colleges.',
        iconicQuote: 'Our users log in multiple times every single day.'
      },
      {
        slideType: 'business_model',
        patternDescription: 'Highly targeted collegiate advertising and brand sponsorships monetizing verified identity graph.',
        benchmarkFormula: 'CPM Sponsorship Licensing across collegiate sub-networks.',
        iconicQuote: 'Direct access to the most coveted demographic in the world.'
      }
    ],
    colorPalette: { primary: '#1877F2', secondary: '#4267B2' }
  },
  {
    id: 'y-combinator-template',
    name: 'Y Combinator Template Framework',
    company: 'Y Combinator (Standard Framework)',
    industry: 'Venture Accelerators & Early-Stage Startups',
    businessModel: 'Universal Early-Stage Framework (Clarity-First)',
    stage: 'Universal Standard',
    roundStage: 'Universal Blueprint',
    amountRaised: 'Accelerator Standard',
    location: 'Silicon Valley, CA',
    year: 2024,
    leadInvestors: ['Y Combinator'],
    coreInsight: 'Distilling startup pitches into 7 to 10 unambiguous slides focused entirely on problem clarity, organic traction, and founder insight.',
    slideSequence: [
      'Company Purpose',
      'Problem',
      'Solution',
      'Why Now?',
      'Market Size',
      'Traction',
      'Business Model',
      'Competition / Unfair Advantage',
      'Team',
      'The Ask'
    ],
    narrativeNotes: [
      'Enforces plainspoken language with zero buzzwords: describe what the company does in one clear sentence.',
      'Mandates a strong "Why Now" catalyst explaining what technological, regulatory, or behavioral shifts enable this business today.',
      'Prioritizes week-over-week growth rate over vanity total numbers to demonstrate authentic momentum.'
    ],
    keyLesson: 'Eliminate jargon; investor conviction stems from clarity of thought, simple unit math, and demonstrated user love.',
    winningSlidePatterns: [
      {
        slideType: 'problem',
        patternDescription: 'Plainspoken single-sentence problem definition with zero marketing fluff.',
        benchmarkFormula: 'State the exact user, their painful bottleneck, and the quantified loss.',
        iconicQuote: 'Make something people want by solving a real, recurring pain.'
      },
      {
        slideType: 'solution',
        patternDescription: 'Concise explanation of product capability and why it is 10x better than existing alternatives.',
        benchmarkFormula: '10x Speed / 10x Cheaper / 10x More Reliable.',
        iconicQuote: 'Describe your product in simple, everyday terms.'
      }
    ],
    colorPalette: { primary: '#FF6600', secondary: '#222222' }
  },
  {
    id: 'youtube-2005',
    name: 'YouTube',
    company: 'YouTube',
    industry: 'Consumer Internet & Online Video Hosting',
    businessModel: 'Ad-Supported Streaming Platform & Video Syndication',
    stage: 'Seed / Series A',
    roundStage: 'Seed',
    amountRaised: '$3,500,000',
    location: 'San Mateo, CA',
    year: 2005,
    leadInvestors: ['Sequoia Capital'],
    coreInsight: 'Browser-based universal video streaming eliminating bulky codec plugins and enabling frictionless web embeds.',
    slideSequence: [
      'Company Purpose',
      'Problem',
      'Solution',
      'Market Opportunity & Timing',
      'Product Architecture',
      'Go-To-Market / Virality',
      'Competition',
      'Team',
      'Financial Plan & Use of Funds'
    ],
    narrativeNotes: [
      'The deck was remarkably lean and concise—at the time of raise user count was early, so the narrative leaned heavily on category timing.',
      'Emphasized the technological inflection: rapid consumer broadband adoption + universal Flash video player in modern browsers.',
      'Highlighted organic embed loops: every video shared on third-party blogs or social sites functioned as a free distribution channel for YouTube.'
    ],
    keyLesson: 'When early traction is nascent, articulate why a major technological shift makes your product inevitable right now.',
    winningSlidePatterns: [
      {
        slideType: 'solution',
        patternDescription: 'One-click web embed widget removing download barriers and plugin incompatibilities.',
        benchmarkFormula: 'Zero codec downloads + universal iframe embed distribution.',
        iconicQuote: 'YouTube makes video sharing as simple as copy-pasting a URL.'
      },
      {
        slideType: 'traction',
        patternDescription: 'Exponential early stream volume growth powered by viral blog embeds.',
        benchmarkFormula: 'Viral K-Factor > 1.5 driven by embeddable web player.',
        iconicQuote: 'Rapidly compounding daily video streams via organic web embeds.'
      }
    ],
    colorPalette: { primary: '#FF0000', secondary: '#282828' }
  },
  {
    id: 'linkedin-2004',
    name: 'LinkedIn',
    company: 'LinkedIn',
    industry: 'Professional Networking & Human Capital Software',
    businessModel: 'Multi-Pronged Subscription (Recruiter SaaS + Premium Search + Ads)',
    stage: 'Series B',
    roundStage: 'Series B',
    amountRaised: '$10,000,000',
    location: 'Mountain View, CA',
    year: 2004,
    leadInvestors: ['Greylock Partners', 'Sequoia Capital'],
    coreInsight: 'Creating the professional identity network where economic value scales with two-sided recruiter and talent network density.',
    slideSequence: [
      'Executive Summary',
      'Market Opportunity',
      'Network Effects & Strategy',
      'Product Services',
      'Monetization Streams',
      'User Growth & Engagement',
      'Competitive Landscape',
      'Financial Model & Projections',
      'Team & Advisory Board',
      'Investment Terms'
    ],
    narrativeNotes: [
      'Structured around clear analogy framing: positioned as the professional counterpart to existing consumer search and social graphs.',
      'Detailed a multi-engine monetization roadmap showing how the free network would transition into high-margin enterprise recruiter subscriptions.',
      'Argued the defensibility of data network effects: replacement costs for competing networks compound quadratically with network size.'
    ],
    keyLesson: 'Use credible mental models to explain how an initial free network will layer high-margin monetization streams over time.',
    winningSlidePatterns: [
      {
        slideType: 'market_size',
        patternDescription: 'Professional graph sizing multiplying global knowledge workers by enterprise recruiter seat values.',
        benchmarkFormula: 'Enterprise Recruiter Seats ($8,000/yr) + Premium Consumer Subscriptions.',
        iconicQuote: 'The professional graph will become the standard operating system for global business talent.'
      },
      {
        slideType: 'competition',
        patternDescription: 'Two-sided network moat creating switching costs that scale quadratically with graph size.',
        benchmarkFormula: 'Network Moat: Defensibility increases with user graph completeness.',
        iconicQuote: 'Proprietary professional data creates an enduring, defensible moat.'
      }
    ],
    colorPalette: { primary: '#0A66C2', secondary: '#004182' }
  },
  {
    id: 'snapchat-2012',
    name: 'Snapchat',
    company: 'Snapchat (Snap Inc.)',
    industry: 'Visual Mobile Messaging & Media',
    businessModel: 'Ephemeral Messaging with Sponsored Geofilters & Brand Media Stories',
    stage: 'Seed / Series A',
    roundStage: 'Seed',
    amountRaised: '$485,000',
    location: 'Venice, CA',
    year: 2012,
    leadInvestors: ['Lightspeed Venture Partners', 'Benchmark'],
    coreInsight: 'Ephemeral photo messaging removing permanent digital record anxiety, driving intense teenage engagement.',
    slideSequence: [
      'Problem: Permanent Digital Record',
      'Solution: Ephemeral Visual Messaging',
      'The Core Experience',
      'Engagement & Sharing Velocity',
      'Demographic Focus (High School / College)',
      'Behavioral Habits vs Traditional Social',
      'Monetization Vision',
      'Team'
    ],
    narrativeNotes: [
      'Challenged the prevailing dogma of the social web by arguing that permanent photo feeds created social pressure and lowered sharing volume.',
      'Showcased staggering daily message velocity per active user rather than total registered accounts.',
      'Positioned the camera as the primary communication input rather than a secondary text-based status update.'
    ],
    keyLesson: 'Question established industry orthodoxies by showing how counterintuitive user behavior unlocks massive engagement.',
    winningSlidePatterns: [
      {
        slideType: 'problem',
        patternDescription: 'Social media permanence causes anxiety, restricting spontaneous visual communication.',
        benchmarkFormula: 'Sharing frequency drop on permanent profile networks.',
        iconicQuote: 'Permanent digital records prevent people from sharing authentic moments.'
      },
      {
        slideType: 'traction',
        patternDescription: 'Compounding snaps sent daily with extraordinary frequency per active user.',
        benchmarkFormula: 'Snaps per active user per day > 10x industry average.',
        iconicQuote: 'Millions of snaps sent daily with zero server storage costs.'
      }
    ],
    colorPalette: { primary: '#FFFC00', secondary: '#000000' }
  },
  {
    id: 'crypto-web3-archetype',
    name: 'Cryptocurrency / Web3 Archetype',
    company: 'Decentralized Protocol / Web3 Infrastructure',
    industry: 'Blockchain Infrastructure, DeFi & Token Networks',
    businessModel: 'Protocol Fee Protocol Take-Rate, Staking Yield & Developer API Gas',
    stage: 'Seed / Token Round',
    roundStage: 'Seed',
    amountRaised: '$3,000,000',
    location: 'Decentralized / Global',
    year: 2024,
    leadInvestors: ['Paradigm', 'a16z crypto', 'Polychain Capital'],
    coreInsight: 'Cryptographic state verification and open composability enabling permissionless financial rails and decentralized coordination.',
    slideSequence: [
      'System Inefficiency / Centralized Bottleneck',
      'Protocol Architecture',
      'Underlying Cryptographic Primitive',
      'Token Economics & Incentive Flywheel',
      'Developer Composability & Ecosystem',
      'Network Traction (TVL / Active Wallets)',
      'Competitive Protocol Matrix',
      'Security & Formal Verification',
      'Core Contributors',
      'Treasury & Token Distribution'
    ],
    narrativeNotes: [
      'Detailed the alignment of incentives: how early token distribution coordinates developers, liquidity providers, and node operators.',
      'Separated technical throughput metrics (TPS, sub-second finality, gas efficiency) from commercial adoption metrics (TVL, active contracts).',
      'Addressed regulatory and protocol security posture directly through formal verification and multi-sig governance roadmaps.'
    ],
    keyLesson: 'Clearly delineate the relationship between developer ecosystem adoption, cryptographic security, and token economic value capture.',
    winningSlidePatterns: [
      {
        slideType: 'solution',
        patternDescription: 'Permissionless settlement layer with instant cryptographic finality and verifiable execution.',
        benchmarkFormula: 'Sub-second finality + 100x lower gas cost vs legacy L1 networks.',
        iconicQuote: 'Trust-minimized decentralized execution with full ecosystem composability.'
      },
      {
        slideType: 'business_model',
        patternDescription: 'Protocol fee burn / revenue distribution aligned with active transaction throughput.',
        benchmarkFormula: 'Protocol Revenue = Network Transaction Volume × Base Fee Take-Rate.',
        iconicQuote: 'Sustainable protocol value capture through network usage fees.'
      }
    ],
    colorPalette: { primary: '#627EEA', secondary: '#1E1E1E' }
  }
];

export function findReferenceArchetypeById(id: string): ReferenceDeckArchetype {
  const match = REFERENCE_DECKS_DATABASE.find(d => d.id === id);
  return match || REFERENCE_DECKS_DATABASE[0];
}

export function searchArchetypesForSlide(slideType: SlideType): { archetype: ReferenceDeckArchetype; pattern: any }[] {
  const results: { archetype: ReferenceDeckArchetype; pattern: any }[] = [];
  for (const arch of REFERENCE_DECKS_DATABASE) {
    if (arch.winningSlidePatterns) {
      const pattern = arch.winningSlidePatterns.find(p => p.slideType === slideType);
      if (pattern) {
        results.push({ archetype: arch, pattern });
      }
    }
  }
  return results;
}
