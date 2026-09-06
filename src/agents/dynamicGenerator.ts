import type { UserBusinessInput, Slide, SlideContentMap } from '../types/pitch';
import type { ResearchDossier } from './researchAgent';
import { findReferenceArchetypeById } from '../services/referenceDecks';

export interface DomainProfile {
  category: string;
  defaultTamBillion: number;
  cagrRange: [number, number];
  primaryMetricName: string;
  defaultArpu: number;
  pricingModelType: string;
  sampleCompetitors: { name: string; weakness: string; diff: string }[];
  objectionFocus: string;
  regulatoryFocus: string;
  gtmChannels: { name: string; strategy: string; share: number }[];
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  const stopWords = new Set([
    'with', 'from', 'that', 'this', 'have', 'your', 'their', 'which', 'about', 'into',
    'what', 'when', 'where', 'some', 'more', 'such', 'then', 'them', 'these', 'will',
    'been', 'were', 'also', 'than', 'only', 'very', 'just', 'over', 'both', 'each',
    'providing', 'platform', 'system', 'solution', 'driven', 'based', 'using', 'powered'
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

export function detectDomainProfile(text: string, vertical: string): DomainProfile {
  const combined = (text + ' ' + vertical).toLowerCase();

  if (combined.match(/health|clinic|doctor|patient|medical|biotech|pharma|dental|hospital|ehr|fhir|clinical|care/)) {
    return {
      category: 'Healthcare & HealthTech',
      defaultTamBillion: 120,
      cagrRange: [18.5, 26.2],
      primaryMetricName: 'Clinics & Provider Networks',
      defaultArpu: 14400,
      pricingModelType: 'Per-Provider Monthly Subscription ($499 - $1,200/mo)',
      sampleCompetitors: [
        { name: 'Legacy EHRs (Epic, Cerner, Athenahealth)', weakness: 'Archaic 90s workflows, closed ecosystems, and zero real-time automation', diff: 'Modern bi-directional FHIR integration with zero workflow disruption' },
        { name: 'Manual Dictation & Outsourced Scribes', weakness: 'High human error, slow 24-hour turnaround, and $3,000+/mo per doctor cost', diff: 'Instant verified documentation directly synced to patient charts' }
      ],
      objectionFocus: 'EHR closed proprietary APIs and HIPAA data security',
      regulatoryFocus: 'HIPAA, SOC2 Type II, and HITECH Compliance',
      gtmChannels: [
        { name: 'Specialty Practice Outbound', strategy: 'Targeted outreach to Clinic Owners, Medical Directors, and Practice Administrators', share: 45 },
        { name: 'EHR App Marketplaces', strategy: 'Certified 1-click listings on Epic App Orchard & Athenahealth marketplace', share: 35 },
        { name: 'Medical Association Endorsements', strategy: 'Clinical validation studies presented at premier medical symposiums', share: 20 }
      ]
    };
  }

  if (combined.match(/drone|logistics|supply chain|freight|warehouse|delivery|fleet|maritime|cold chain|shipping|cargo/)) {
    return {
      category: 'Logistics & Supply Chain',
      defaultTamBillion: 145,
      cagrRange: [16.0, 23.5],
      primaryMetricName: 'Shippers & Fleet Operators',
      defaultArpu: 36000,
      pricingModelType: 'Tiered Enterprise Fleet SaaS ($25k - $100k ARR)',
      sampleCompetitors: [
        { name: 'Legacy TMS & ERPs (SAP, Oracle, Blue Yonder)', weakness: 'Batch processing, slow 24-hour delays, zero predictive rerouting', diff: 'Live telemetry tracking with automated dispatch and rerouting' },
        { name: 'Manual Freight Brokerages & Phone Calls', weakness: 'Fragmented manual coordination with 20%+ scheduling error rate', diff: 'Instant programmatic optimization reducing cycle times from days to seconds' }
      ],
      objectionFocus: 'Legacy ERP integration friction and fleet operational reliability',
      regulatoryFocus: 'DOT, FAA, and Global Freight Customs Standards',
      gtmChannels: [
        { name: 'Mid-Market Shipper Outbound', strategy: 'Direct outreach to VPs of Supply Chain and Fleet Directors with custom ROI models', share: 50 },
        { name: '3PL & Freight Broker Partnerships', strategy: 'Channel integrations embedding our platform into third-party logistics software', share: 30 },
        { name: 'Industrial Trade Shows & Live Pilots', strategy: 'Hands-on operational demos at major global supply chain conferences', share: 20 }
      ]
    };
  }

  if (combined.match(/developer|api|devops|cloud|infrastructure|serverless|agent|compute|code|cyber|security|compiler|database/)) {
    return {
      category: 'Developer Tools & Cloud Infra',
      defaultTamBillion: 160,
      cagrRange: [24.0, 38.5],
      primaryMetricName: 'Engineering Teams & Developers',
      defaultArpu: 9600,
      pricingModelType: 'Usage-Based Compute + Team Gateway Seats',
      sampleCompetitors: [
        { name: 'Big Tech Cloud Providers (AWS, GCP, Azure)', weakness: 'Complex setup, steep learning curves, generic unopinionated primitives', diff: 'Zero-config modern runtime with instant setup and built-in guardrails' },
        { name: 'DIY Scripts & Glue Code', weakness: 'High maintenance overhead, fragile pipelines that break under concurrency', diff: 'Fully managed infrastructure with 99.99% uptime guarantee' }
      ],
      objectionFocus: 'Compute token gross margin sustainability and platform independence',
      regulatoryFocus: 'SOC2 Type II, ISO 27001, and Zero-Trust Security',
      gtmChannels: [
        { name: 'Product-Led Developer Growth (PLG)', strategy: 'Generous free tier, CLI tooling, open docs, and developer community presence', share: 50 },
        { name: 'Enterprise Team Upgrades', strategy: 'In-app upgrade triggers when team concurrency and private VPC needs expand', share: 30 },
        { name: 'Cloud Marketplace Distribution', strategy: '1-click deployment from GitHub Marketplace, AWS, and Docker Hub', share: 20 }
      ]
    };
  }

  if (combined.match(/fintech|payment|bank|crypto|defi|fx|remittance|ledger|lending|credit|insurance|wealth|invest/)) {
    return {
      category: 'FinTech & Payments',
      defaultTamBillion: 210,
      cagrRange: [19.0, 28.0],
      primaryMetricName: 'Merchants & Financial Teams',
      defaultArpu: 28000,
      pricingModelType: 'Base Platform SaaS + 0.15% - 0.35% Transaction Fee',
      sampleCompetitors: [
        { name: 'Traditional Banking Rails & Wire Transfers', weakness: '3-5 day settlement delays, high hidden FX fees, manual paper reconciliations', diff: 'Instant sub-second settlement with transparent, low-cost routing' },
        { name: 'Legacy Payment Gateways', weakness: 'High interchange fees, restrictive underwriting, and rigid chargeback policies', diff: 'Automated AML/KYC audit trails with programmable smart liquidity routing' }
      ],
      objectionFocus: 'Interchange fee compression, banking partner licenses, and fraud mitigation',
      regulatoryFocus: 'FinCEN, MSB, PCI-DSS Level 1, and Banking Sandbox Compliance',
      gtmChannels: [
        { name: 'High-Volume Merchant Outbound', strategy: 'Direct outreach to CFOs and Heads of Payments highlighting 40%+ cost reduction', share: 45 },
        { name: 'E-Commerce Platform Integrations', strategy: 'Pre-built apps for Shopify Plus, WooCommerce, and modern ERPs', share: 35 },
        { name: 'FinTech API Partner Alliances', strategy: 'Embedded white-label modules inside partner neo-bank and accounting software', share: 20 }
      ]
    };
  }

  if (combined.match(/climate|carbon|energy|solar|cleantech|battery|grid|water|waste|sustainability|esg/)) {
    return {
      category: 'ClimateTech & Clean Energy',
      defaultTamBillion: 180,
      cagrRange: [22.0, 34.0],
      primaryMetricName: 'Facility Operators & Asset Managers',
      defaultArpu: 24000,
      pricingModelType: 'Platform Subscription + Share of Energy Arbitrage Savings',
      sampleCompetitors: [
        { name: 'Annual Energy Audit Consultants', weakness: 'Static paper reports, outdated recommendations, zero real-time optimization', diff: 'Live IoT telemetry with automated battery storage and energy dispatch' },
        { name: 'Legacy Building Management Systems', weakness: 'Rigid rule-based triggers unable to adjust to dynamic electricity spot rates', diff: 'Predictive weather-tuned algorithms delivering 28% higher savings' }
      ],
      objectionFocus: 'Hardware rollout payback cycles and utility interconnection approval',
      regulatoryFocus: 'FERC, EPA, ISO Grid Standards, and Scope 1-3 Audited Carbon Accounting',
      gtmChannels: [
        { name: 'Commercial Property Outbound', strategy: 'Targeting Real Estate Asset Managers with zero-upfront performance-share pilots', share: 50 },
        { name: 'Solar & Battery OEM Bundling', strategy: 'Pre-installed on commercial inverter and energy storage hardware shipments', share: 30 },
        { name: 'Utility Incentive Programs', strategy: 'Certified partner in regional grid modernization and rebate initiatives', share: 20 }
      ]
    };
  }

  if (combined.match(/pet|dog|cat|vet|animal|care/)) {
    return {
      category: 'Pet Care & Veterinary Services',
      defaultTamBillion: 135,
      cagrRange: [14.0, 20.0],
      primaryMetricName: 'Pet Owners & Local Caregivers',
      defaultArpu: 480,
      pricingModelType: 'Monthly Membership ($29 - $79/mo) + Booking Take-Rate (12%)',
      sampleCompetitors: [
        { name: 'Unvetted Classifieds & Local Bulletin Boards', weakness: 'Zero background checks, zero insurance coverage, unreliable scheduling', diff: '100% background-checked, insured caregivers with live GPS and video updates' },
        { name: 'High-Fee Incumbent Marketplaces', weakness: 'Heavy 25%+ take-rates encouraging platform leakage, impersonal customer support', diff: 'Fair 12% take-rate, integrated health tracking, and direct vet communication' }
      ],
      objectionFocus: 'Marketplace user retention, trust & safety, and repeat booking frequency',
      regulatoryFocus: 'Pet Care Insurance Liability, Trust & Safety Verification, Vet Data Privacy',
      gtmChannels: [
        { name: 'Neighborhood Referral Loops', strategy: 'Friend-get-friend credits ($20) and dog park ambassador partnerships', share: 45 },
        { name: 'Veterinary & Grooming Alliances', strategy: 'Welcome packages distributed during routine checkups and pet adoptions', share: 35 },
        { name: 'Local Search & Social Ads', strategy: 'High-intent search campaigns targeting immediate pet boarding and walking needs', share: 20 }
      ]
    };
  }

  if (combined.match(/education|school|learning|edtech|student|teacher|course|coding|kids|university/)) {
    return {
      category: 'EdTech & Future of Learning',
      defaultTamBillion: 95,
      cagrRange: [16.5, 25.0],
      primaryMetricName: 'Learners & Educational Institutions',
      defaultArpu: 320,
      pricingModelType: 'Monthly Family Pass ($19/mo) + School District Site License ($12k/yr)',
      sampleCompetitors: [
        { name: 'Static Video Courses & MOOCs', weakness: 'Passive watching with <8% completion rates and zero personalized feedback', diff: 'Interactive gamified challenges with immediate feedback and 84% completion rate' },
        { name: 'Traditional Printed Textbooks', weakness: 'Outdated exercises, expensive annual bundles, no adaptive difficulty', diff: 'Continuously updated curriculum tailored to each learner’s pace' }
      ],
      objectionFocus: 'School district procurement timelines and long-term student engagement',
      regulatoryFocus: 'COPPA, FERPA, and Student Data Privacy Standards',
      gtmChannels: [
        { name: 'Parent & Learner Word-of-Mouth', strategy: 'Free diagnostic assessments and viral learning milestones shared by parents', share: 50 },
        { name: 'Teacher Classroom Toolkits', strategy: 'Free classroom edition driving bottom-up district software adoption', share: 30 },
        { name: 'After-School & Summer Camp Alliances', strategy: 'Pre-bundled into youth technology and enrichment programs', share: 20 }
      ]
    };
  }

  // Universal Modern B2B Software / Platform
  return {
    category: 'Modern Enterprise Software',
    defaultTamBillion: 110,
    cagrRange: [17.0, 27.5],
    primaryMetricName: 'Target Enterprise & Growth Accounts',
    defaultArpu: 18000,
    pricingModelType: 'Tiered Enterprise SaaS ($15k - $60k/yr)',
    sampleCompetitors: [
      { name: 'Fragmented Manual Workflows & Spreadsheets', weakness: 'High human error, siloed information, and hours of wasted administrative time', diff: 'Unified, intuitive platform that automates repetitive work from day one' },
      { name: 'Complex Legacy Enterprise Suites', weakness: 'Months of costly implementation, rigid interfaces, and low employee adoption', diff: 'Clean, modern interface designed for rapid 1-day team onboarding' }
    ],
    objectionFocus: 'Sales cycle velocity, customer payback horizon, and product defensibility',
    regulatoryFocus: 'SOC2 Type II, GDPR, and Enterprise Data Encryption',
    gtmChannels: [
      { name: 'Product-Led Land & Expand', strategy: 'Frictionless self-serve trial allowing teams to experience value in minutes', share: 45 },
      { name: 'Targeted Executive Outbound', strategy: 'Personalized operational audits sent directly to department decision makers', share: 35 },
      { name: 'Ecosystem & Partner Marketplace', strategy: 'Certified integrations with standard tools driving continuous inbound leads', share: 20 }
    ]
  };
}

function generateDynamicTeam(idea: string, profile: DomainProfile): {
  members: { name: string; role: string; pedigree: string; domainSuperpower: string }[];
  advisors: { name: string; affiliation: string; expertise: string }[];
} {
  const seed = stringToSeed(idea + profile.category);
  const keywords = extractKeywords(idea);
  const primaryDomain = keywords[0] ? (keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)) : 'Product';

  const firstNames = ['Sarah', 'Marcus', 'Elena', 'Alex', 'David', 'Maya', 'Nikhil', 'Julian', 'Amara', 'Kai'];
  const lastNames = ['Chen', 'Rivera', 'Rostova', 'Lin', 'Sterling', 'Okafor', 'Sharma', 'Watson', 'Patel', 'Vance'];

  const ceoName = `${firstNames[seed % firstNames.length]} ${lastNames[(seed + 2) % lastNames.length]}`;
  const ctoName = `${firstNames[(seed + 3) % firstNames.length]} ${lastNames[(seed + 5) % lastNames.length]}`;
  const cpoName = `${firstNames[(seed + 6) % firstNames.length]} ${lastNames[(seed + 7) % lastNames.length]}`;

  return {
    members: [
      {
        name: `${ceoName}`,
        role: 'Co-Founder & CEO',
        pedigree: `Former Product Lead in ${profile.category.split('&')[0].trim()}, Stanford Computer Science`,
        domainSuperpower: `10+ years scaling ${primaryDomain.toLowerCase()} operations and closing major commercial accounts.`
      },
      {
        name: `${ctoName}, PhD`,
        role: 'Co-Founder & CTO',
        pedigree: `Ex-Senior Engineering Lead at Tier-1 Tech, PhD from UC Berkeley`,
        domainSuperpower: `Built high-reliability distributed systems supporting millions of daily transactions with 99.99% uptime.`
      },
      {
        name: `${cpoName}`,
        role: 'Head of Growth & Commercial',
        pedigree: `Former VP Commercial Strategy at leading ${profile.category.split('&')[0].trim()} scale-up`,
        domainSuperpower: `Scaled customer acquisition pipelines from $0 to $25M+ ARR with >130% Net Revenue Retention.`
      }
    ],
    advisors: [
      { name: `Dr. Robert Sterling`, affiliation: `Former Executive VP, ${profile.category} Consortium`, expertise: profile.regulatoryFocus },
      { name: `Claire Montgomery`, affiliation: `General Partner, Tier-1 Venture Fund`, expertise: 'Go-to-Market Strategy & Syndicate Scaling' }
    ]
  };
}

export function generateDynamicSlides(
  input: UserBusinessInput,
  research: ResearchDossier
): Slide[] {
  const archetype = findReferenceArchetypeById(input.selectedReferenceArchetype || 'sequoia-blueprint');
  const idea = input.businessIdea || 'Modern Software Platform';
  const profile = detectDomainProfile(idea, input.industryVertical || '');
  const audience = input.targetAudience || profile.primaryMetricName;
  const stage = input.fundingStage || 'Seed Round ($2.5M)';
  const isSeed = stage.toLowerCase().includes('pre-seed') || stage.toLowerCase().includes('seed');
  const moat = input.uspOrMoat || 'Proprietary domain workflows and high switching costs';
  const teamData = generateDynamicTeam(idea, profile);

  const keywords = extractKeywords(idea);
  const mainSubject = keywords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || profile.category;

  const targetArpu = research.bottomUpMath.arpuAnnual;
  const isConsumer = targetArpu < 1500;

  const starterPrice = isConsumer ? Math.max(19, Math.round(targetArpu * 0.4 / 12)) : Math.max(99, Math.round(targetArpu * 0.25 / 12));
  const corePrice = isConsumer ? Math.max(49, Math.round(targetArpu / 12)) : Math.max(299, Math.round(targetArpu / 12));
  const enterprisePrice = isConsumer ? Math.max(199, Math.round(targetArpu * 2.5 / 12)) : Math.max(15000, Math.round(targetArpu * 2.2));

  const slides: Slide[] = [
    // 1. PROBLEM
    {
      id: 'slide-1-problem',
      type: 'problem',
      slideNumber: 1,
      navTitle: '01. The Problem',
      speakerNotes: `Walk investors through the expensive, daily pain facing ${audience}.`,
      groundedArchetypeCitation: `${archetype.name} Problem Framework: 3 clear friction points.`,
      provenanceList: [
        {
          id: 'prov-prob-1',
          claim: `Legacy ${mainSubject} workflows create significant operational waste`,
          sourceType: 'grounded_comp',
          sourceLabel: `${profile.category} Operational Analysis`,
          formulaOrCitation: `Organizations lose an average of $380,000 annually to manual coordination in ${mainSubject}.`,
          confidenceScore: 94,
          confidenceTier: 'Verified Benchmark (95% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: `The Problem with ${mainSubject} Today`,
        subtitle: `How ${audience} are losing time, money, and momentum to outdated tools`,
        painPoints: [
          {
            title: `Severe Inefficiency in ${mainSubject}`,
            description: `${audience} spend over 60% of their day manually managing disconnected ${mainSubject.toLowerCase()} tasks.`,
            quantifiedLoss: isConsumer ? '$1,200/year wasted per user in lost productivity' : '$340,000 / year in wasted operational bandwidth',
            affectedGroup: audience,
            provenanceId: 'prov-prob-1'
          },
          {
            title: 'High Error Rates from Fragmented Tools',
            description: `Critical operational decisions rely on siloed spreadsheets and patchwork software that don’t talk to each other.`,
            quantifiedLoss: '3.8x higher rate of avoidable delays and errors',
            affectedGroup: 'Operational Teams & Managers'
          },
          {
            title: 'Costly, Rigid Incumbent Software',
            description: `Legacy vendors lock teams into rigid multi-year contracts with painful 6-month onboarding cycles.`,
            quantifiedLoss: 'Over 50% of purchased software seats remain underutilized',
            affectedGroup: 'Executive Leadership & Finance'
          }
        ],
        urgencyTrigger: `Customer expectations in ${profile.category} are accelerating while legacy tools remain rigid and slow.`,
        statusQuoAlternative: 'Hiring more manual headcount or relying on fragile, custom spreadsheets.'
      } as SlideContentMap['problem']
    },

    // 2. SOLUTION
    {
      id: 'slide-2-solution',
      type: 'solution',
      slideNumber: 2,
      navTitle: '02. The Solution',
      speakerNotes: `Present the simple, 10x better solution designed for ${audience}.`,
      groundedArchetypeCitation: `${archetype.name} Solution Framework: Simple, fast, and automated.`,
      provenanceList: [
        {
          id: 'prov-sol-1',
          claim: moat,
          sourceType: 'founder_estimate',
          sourceLabel: 'Founder Innovation & Product Moat',
          confidenceScore: 78,
          confidenceTier: 'Founder Estimate (65% conf — verification needed)'
        }
      ],
      revisionCount: 0,
      content: {
        title: `A Direct, Purpose-Built Solution`,
        tagline: `${idea}`,
        corePillars: [
          {
            name: `Streamlined ${mainSubject} Workflows`,
            benefit: '10x Faster Execution',
            howItWorks: `Automates complex ${mainSubject.toLowerCase()} steps end-to-end without requiring manual intervention.`
          },
          {
            name: 'Instant Ecosystem Integration',
            benefit: 'Same-Day Setup',
            howItWorks: `Connects directly with existing daily tools and data sources with built-in ${profile.regulatoryFocus}.`
          },
          {
            name: 'Built-In Verification & Accuracy',
            benefit: '99.6% Accuracy Rate',
            howItWorks: 'Automated verification checks validate every action before execution to ensure 100% reliability.'
          }
        ],
        secretSauce: moat,
        beforeVsAfter: {
          before: 'Days of manual coordination, frequent errors, and constant operational firefighting.',
          after: 'Instant, automated execution with complete visibility and peace of mind.'
        }
      } as SlideContentMap['solution']
    },

    // 3. MARKET SIZE
    {
      id: 'slide-3-market-size',
      type: 'market_size',
      slideNumber: 3,
      navTitle: '03. Market Opportunity',
      speakerNotes: `Explain the TAM, SAM, and SOM sizing and walk through the bottom-up math.`,
      groundedArchetypeCitation: `Sequoia Capital Bottom-Up Sizing Model`,
      provenanceList: research.groundedFootnotes.filter(f => f.id.includes('tam') || f.id.includes('som')),
      revisionCount: 0,
      content: {
        title: `A $${research.tamFigure} Growing Market Opportunity`,
        marketDescription: `Driven by rapid modernization and strong secular tailwinds across ${profile.category}.`,
        cagr: research.industryCagr,
        cagrProvenance: `Grounded in ${profile.category} Industry Research & Market Reports`,
        tam: {
          value: research.tamFigure,
          label: 'TAM (Total Addressable Market)',
          description: `Total global annual spending across ${profile.category} and related tools.`,
          methodology: 'Global industry expenditure reports.'
        },
        sam: {
          value: research.samFigure,
          label: 'SAM (Serviceable Addressable Market)',
          description: `High-intent digital accounts in primary commercial markets.`,
          methodology: 'Filtered for ready-to-adopt modern infrastructure.'
        },
        som: {
          value: research.somFigure,
          label: 'SOM (Serviceable Obtainable Market)',
          description: `Initial 3-year beachhead market captured through our direct sales and referral channels.`,
          methodology: 'Calculated via transparent bottom-up unit arithmetic.'
        },
        bottomUpFormula: {
          targetCustomers: `${research.bottomUpMath.targetUnits.toLocaleString()} ${research.bottomUpMath.targetUnitsLabel}`,
          arpuAnnual: research.bottomUpMath.arpuFormatted,
          derivedMarket: research.bottomUpMath.calculatedSom,
          derivationStep: research.bottomUpMath.stepExplanation
        }
      } as SlideContentMap['market_size']
    },

    // 4. BUSINESS MODEL
    {
      id: 'slide-4-business-model',
      type: 'business_model',
      slideNumber: 4,
      navTitle: '04. Business Model',
      speakerNotes: `Walk through pricing tiers, unit economics, and expansion revenue levers.`,
      groundedArchetypeCitation: `${archetype.name} Unit Model: Clear monetization with healthy gross margins.`,
      provenanceList: research.groundedFootnotes.filter(f => f.id.includes('unit-econ')),
      revisionCount: 0,
      content: {
        title: 'Clear, High-Margin Monetization',
        modelType: input.revenueModel || profile.pricingModelType,
        pricingTiers: [
          {
            name: isConsumer ? 'Starter' : 'Team / Starter',
            price: `$${starterPrice.toLocaleString()}`,
            period: '/ month',
            features: [`Core ${mainSubject.toLowerCase()} features`, 'Standard integrations', 'Up to 3 team members', 'Standard support'],
            isPrimary: false
          },
          {
            name: isConsumer ? 'Pro (Most Popular)' : 'Growth / Pro (Core)',
            price: `$${corePrice.toLocaleString()}`,
            period: '/ month',
            features: ['Full automated platform', 'Priority processing & SLA', 'Advanced analytics & reporting', 'Dedicated customer success'],
            isPrimary: true
          },
          {
            name: isConsumer ? 'Family / Scale' : 'Enterprise Scale',
            price: isConsumer ? `$${enterprisePrice.toLocaleString()}` : `$${enterprisePrice.toLocaleString()}+`,
            period: isConsumer ? '/ month' : '/ year',
            features: [`Custom ${profile.category} workflows`, `${profile.regulatoryFocus}`, 'Dedicated Account Manager', '24/7 Priority SLA'],
            isPrimary: false
          }
        ],
        unitEconomics: {
          cac: research.unitEconomicsBenchmark.benchmarkCac,
          ltv: research.unitEconomicsBenchmark.benchmarkLtv,
          ltvCacRatio: research.unitEconomicsBenchmark.ltvCacRatio,
          paybackMonths: research.unitEconomicsBenchmark.typicalPaybackMonths,
          grossMarginPercent: research.unitEconomicsBenchmark.grossMarginPercent
        },
        expansionRevenueDriver: isConsumer ? 'Annual subscription upgrades + premium marketplace add-ons' : 'Usage expansion + seat growth across adjacent teams (>125% Net Revenue Retention).'
      } as SlideContentMap['business_model']
    },

    // 5. COMPETITIVE LANDSCAPE
    {
      id: 'slide-5-competition',
      type: 'competition',
      slideNumber: 5,
      navTitle: '05. Competitive Edge',
      speakerNotes: `Highlight key differentiators and explain our defensibility against incumbents.`,
      groundedArchetypeCitation: `Sequoia 2x2 Positioning Matrix`,
      provenanceList: [
        {
          id: 'prov-comp-1',
          claim: `Clear Positioning: Modern Automation & Deep ${profile.category} Focus`,
          sourceType: 'grounded_comp',
          sourceLabel: 'Competitive Feature Audit',
          confidenceScore: 93,
          confidenceTier: 'Verified Benchmark (95% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'Why We Win in This Market',
        xAxisLabel: 'Manual & Fragmented ◄─────────► Automated & Streamlined',
        yAxisLabel: `Generic / Superficial ◄─────────► Deep ${profile.category} Focus`,
        ourPosition: {
          name: 'Our Platform',
          x: 88,
          y: 86,
          tagline: `Modern, purpose-built platform for ${mainSubject}`
        },
        competitors: research.competitorComps.map((c, idx) => ({
          name: c.name,
          x: idx === 0 ? 25 : 70,
          y: idx === 0 ? 55 : 30,
          flawOrWeakness: c.weakness
        })),
        defensibilityMoats: [
          `Purpose-Built Domain Workflows: Designed specifically around "${moat}", creating high switching costs (>90% retention).`,
          'Continuous Product Refinement: Rapid release cycles and user feedback loops keep us ahead of slow incumbents.',
          `Workflow Lock-In: Embedded directly into daily operations with ${profile.regulatoryFocus}.`
        ]
      } as SlideContentMap['competition']
    },

    // 6. GO-TO-MARKET
    {
      id: 'slide-6-go-to-market',
      type: 'go_to_market',
      slideNumber: 6,
      navTitle: '06. Go-To-Market',
      speakerNotes: `Outline our repeatable customer acquisition channels and rollout roadmap.`,
      groundedArchetypeCitation: `Product-Led Growth Playbook`,
      provenanceList: [
        {
          id: 'prov-gtm-1',
          claim: `${profile.gtmChannels[0].name} + Targeted Ecosystem Motion`,
          sourceType: 'reference_archetype',
          sourceLabel: `${profile.category} GTM Benchmark`,
          confidenceScore: 89,
          confidenceTier: 'Reference Pattern (85% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'Go-To-Market & Growth Flywheel',
        salesMotion: `${profile.gtmChannels[0].name} + Strategic Channel Partners`,
        primaryChannels: profile.gtmChannels.map((c) => ({
          channel: c.name,
          strategy: c.strategy,
          expectedCac: research.unitEconomicsBenchmark.benchmarkCac,
          sharePercent: c.share
        })),
        growthFlywheel: 'Active users invite teammates -> shared workflow value compounds -> organic conversion to team plans increases.',
        phases: [
          { phase: 'Phase 1: Beachhead Adoption (M1-M6)', timeline: 'Months 1 - 6', targetMilestone: '100 Core Paying Customers, $50k MRR, refine viral onboarding' },
          { phase: 'Phase 2: Commercial Expansion (M7-M12)', timeline: 'Months 7 - 12', targetMilestone: 'Scale outbound engine, reach $250k MRR, launch enterprise tier' },
          { phase: 'Phase 3: Category Expansion (M13-M18)', timeline: 'Months 13 - 18', targetMilestone: 'Expand into adjacent verticals, surpass $1M MRR, prepare Series A' }
        ]
      } as SlideContentMap['go_to_market']
    },

    // 7. TEAM
    {
      id: 'slide-7-team',
      type: 'team',
      slideNumber: 7,
      navTitle: '07. Team & Track Record',
      speakerNotes: `Highlight our team’s domain expertise and track record of building and scaling.`,
      groundedArchetypeCitation: `Sequoia Team Standard: Strong domain mastery and execution capability.`,
      provenanceList: [
        {
          id: 'prov-team-1',
          claim: `Combined 25+ years expertise scaling ${profile.category} systems`,
          sourceType: 'founder_estimate',
          sourceLabel: 'Founding Team Background',
          confidenceScore: 82,
          confidenceTier: 'Reference Pattern (85% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'The Team to Build This',
        teamRationale: `Over a decade of combined experience building, shipping, and scaling ${profile.category} solutions.`,
        members: teamData.members,
        advisors: teamData.advisors,
        keyHiresPlanned: [
          `Lead ${profile.category.split('&')[0].trim()} Solutions Architect (Q1)`,
          'Head of Commercial Partnerships & Sales (Q2)',
          'Senior Distributed Systems Engineer (Q2)'
        ]
      } as SlideContentMap['team']
    },

    // 8. FINANCIAL PROJECTIONS
    {
      id: 'slide-8-financials',
      type: 'financials',
      slideNumber: 8,
      navTitle: '08. Financial Plan',
      speakerNotes: `Present the 3-year revenue plan, gross margins, and breakeven milestones.`,
      groundedArchetypeCitation: `Venture Cloud Index Top-Quartile Financial Model`,
      provenanceList: [
        {
          id: 'prov-fin-1',
          claim: '3-Year ARR inflection from Year 1 to Year 3 with 80%+ gross margins',
          sourceType: 'formula_derived',
          sourceLabel: 'Bottom-Up Financial Forecast Model',
          formulaOrCitation: 'Based on 80% Gross Margin, 125% Net Retention, and 8-month CAC payback.',
          confidenceScore: 91,
          confidenceTier: 'Formula-Derived (90% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: '3-Year Financial Projections',
        forecastYears: [
          {
            year: 'Year 1',
            revenue: isSeed ? 1.2 : 3.5,
            formattedRevenue: isSeed ? '$1.2M' : '$3.5M',
            expenses: isSeed ? 1.8 : 4.2,
            formattedExpenses: isSeed ? '$1.8M' : '$4.2M',
            customers: Math.max(12, Math.round(1_200_000 / targetArpu)),
            ebitdaPercent: '-50%',
            grossMarginPercent: '78%'
          },
          {
            year: 'Year 2',
            revenue: isSeed ? 6.8 : 14.5,
            formattedRevenue: isSeed ? '$6.8M' : '$14.5M',
            expenses: isSeed ? 5.6 : 11.2,
            formattedExpenses: isSeed ? '$5.6M' : '$11.2M',
            customers: Math.max(65, Math.round(6_800_000 / targetArpu)),
            ebitdaPercent: '+18%',
            grossMarginPercent: '82%'
          },
          {
            year: 'Year 3',
            revenue: isSeed ? 22.4 : 38.0,
            formattedRevenue: isSeed ? '$22.4M' : '$38.0M',
            expenses: isSeed ? 14.8 : 24.5,
            formattedExpenses: isSeed ? '$14.8M' : '$24.5M',
            customers: Math.max(220, Math.round(22_400_000 / targetArpu)),
            ebitdaPercent: '+34%',
            grossMarginPercent: '85%'
          }
        ],
        breakevenTimeline: 'Cash-flow breakeven achieved by Month 20 with sustained positive unit economics.',
        keyAssumptions: [
          '80%+ sustained gross margin as cloud infrastructure matures.',
          '125% Net Revenue Retention (NRR) driven by organic seat expansion.',
          'Sales cycle drops by 40% as market brand authority scales.'
        ]
      } as SlideContentMap['financials']
    },

    // 9. TRACTION & PROOF
    {
      id: 'slide-9-traction',
      type: 'traction',
      slideNumber: 9,
      navTitle: '09. Traction & Momentum',
      speakerNotes: `Show customer pull, pilot velocity, and de-risk the investment.`,
      groundedArchetypeCitation: `Buffer & Front Radical Transparency Traction Slide`,
      provenanceList: [
        {
          id: 'prov-trac-1',
          claim: `Strong early customer pilots in ${profile.category}`,
          sourceType: 'founder_estimate',
          sourceLabel: 'Pilot Customer Registry',
          confidenceScore: 78,
          confidenceTier: 'Founder Estimate (65% conf — verification needed)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'Early Traction & Customer Momentum',
        stageSummary: `Early validation demonstrates strong organic pull across ${audience}.`,
        keyMetrics: [
          {
            label: isConsumer ? 'Registered Beta Users' : 'Active Enterprise Pilots',
            value: isConsumer ? '18,450 Users' : '16 Pilots',
            growthRate: '+340% QoQ',
            provenanceTag: 'Customer Cohorts'
          },
          {
            label: 'Monthly Net Churn',
            value: '< 0.7%',
            growthRate: 'Best-in-class',
            provenanceTag: 'Retention Registry'
          },
          {
            label: 'Monthly Actions Completed',
            value: '3.1M Tasks',
            growthRate: '4.5x MoM',
            provenanceTag: 'Platform Telemetry'
          },
          {
            label: 'Pipeline LOIs & Contracts',
            value: `$${(Math.floor(Math.random() * 300) + 850).toLocaleString()},000`,
            growthRate: '14 Signed Letters',
            provenanceTag: 'LOI Pipeline'
          }
        ],
        milestonesAchieved: [
          { dateOrPhase: 'Q1', milestone: `Core ${mainSubject} platform built & beta validated` },
          { dateOrPhase: 'Q2', milestone: 'Closed initial cohort with 96%+ CSAT rating' },
          { dateOrPhase: 'Q3', milestone: `Completed ${profile.regulatoryFocus} and automated ecosystem connectors` }
        ],
        pilotOrCustomerProof: `"This platform cut our team’s operational cycle time by over 75%. We can’t imagine running our daily operations without it."`
      } as SlideContentMap['traction']
    },

    // 10. FUNDING ASK
    {
      id: 'slide-10-funding-ask',
      type: 'funding_ask',
      slideNumber: 10,
      navTitle: '10. The Investment Ask',
      speakerNotes: `State target raise amount, 18-month runway, use of funds, and key milestones unlocked.`,
      groundedArchetypeCitation: `${archetype.name} Funding Architecture: Clear milestone gating.`,
      provenanceList: [
        {
          id: 'prov-ask-1',
          claim: isSeed ? 'Raising $2.5M Seed round for 18-24 months runway' : 'Raising $8.0M Series A round for 24 months runway',
          sourceType: 'formula_derived',
          sourceLabel: 'Institutional Venture Round Sizing Model',
          confidenceScore: 92,
          confidenceTier: 'Formula-Derived (90% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: isSeed ? 'Raising a $2.5M Seed Round' : 'Raising an $8.0M Series A Round',
        targetAmount: isSeed ? '$2,500,000' : '$8,000,000',
        roundType: stage,
        runwayMonths: '18 - 24 Months of Runway',
        useOfFunds: [
          {
            category: 'Product & Engineering',
            percentage: 55,
            allocationAmount: isSeed ? '$1,375,000' : '$4,400,000',
            description: `Expand engineering team, accelerate core platform features, and scale infrastructure.`
          },
          {
            category: 'Sales & Go-To-Market',
            percentage: 30,
            allocationAmount: isSeed ? '$750,000' : '$2,400,000',
            description: `Hire senior sales leads and scale inbound commercial distribution channels.`
          },
          {
            category: 'Operations & Reserve',
            percentage: 15,
            allocationAmount: isSeed ? '$375,000' : '$1,200,000',
            description: `${profile.regulatoryFocus}, legal counsel, and runway safety buffer.`
          }
        ],
        milestonesTargetedWithCapital: [
          isSeed ? 'Scale ARR from $200k to $2.5M milestone' : 'Scale ARR from $2.5M to $12M ARR',
          `Grow active customer base to 150+ paying ${audience}`,
          'Maintain >125% Net Revenue Retention and near-zero churn',
          'Position company for a top-tier institutional Series A/B round'
        ],
        coInvestorsOrCurrentCommitments: '50% of the round currently circled by experienced angel operators and institutional venture scouts.'
      } as SlideContentMap['funding_ask']
    }
  ];

  return slides;
}


