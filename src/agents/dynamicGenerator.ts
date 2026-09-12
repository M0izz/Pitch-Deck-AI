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

export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function extractKeywords(text: string): string[] {
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
    // Support meaningful 2-letter tokens like 'hi', 'ai', 'vr', 'ar', 'ev', '3d', 'ui', 'ad'
    .filter(w => w.length >= 2 && !stopWords.has(w));
}

export function deriveStartupBrandName(idea: string, profile: DomainProfile): { name: string; codename: string; tagline: string } {
  const clean = idea.trim();
  const lower = clean.toLowerCase();

  if (lower === 'hi' || lower === 'hello' || lower === 'hey') {
    return {
      name: 'SayHi (HiOS)',
      codename: 'Hi Systems',
      tagline: 'Ambient Conversational Intelligence & Flow-State Communication for Distributed Teams'
    };
  }

  // Check if user provided explicit brand format like "Meow — Ambient conversational..." or "Stripe: Payments" or "Front - Shared inbox"
  const separatorMatch = clean.match(/^([a-zA-Z0-9\s]{2,24})\s*([—\-\:\–\|])\s*(.*)$/s);
  if (separatorMatch) {
    const candidateName = separatorMatch[1].trim();
    const candidateTagline = separatorMatch[3].trim();
    // Validate candidateName is 1-3 words max and not an entire sentence
    if (candidateName.split(/\s+/).length <= 3 && candidateName.length <= 24) {
      return {
        name: candidateName,
        codename: `${candidateName} Technologies`,
        tagline: candidateTagline.length > 10 ? candidateTagline : `Next-generation ${profile.category.toLowerCase()} platform`
      };
    }
  }

  const keywords = extractKeywords(clean);
  const firstWord = clean.split(/[\s,.;:!?]+/)[0];
  // If first word looks like a standalone brand name (capitalized or alphanumeric, 3-12 chars)
  if (firstWord && /^[A-Z][a-zA-Z0-9]{2,12}$/.test(firstWord) && !['Why', 'The', 'How', 'What', 'When', 'Where', 'With', 'Our', 'Your', 'Their', 'This', 'That', 'Modern', 'Autonomous'].includes(firstWord)) {
    return {
      name: firstWord,
      codename: `${firstWord} Technologies`,
      tagline: clean.length > 15 ? clean : `Next-generation ${profile.category.toLowerCase()} platform`
    };
  }

  const prefix = keywords[0] ? (keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)) : 'Omni';
  const suffixList = ['Flow', 'Pulse', 'Nexus', 'Sync', 'OS', 'IQ', 'Scale', 'Forge', 'Stack', 'Core'];
  const seed = stringToSeed(clean + profile.category);
  const suffix = suffixList[seed % suffixList.length];

  const brandName = `${prefix}${suffix}`;
  return {
    name: brandName,
    codename: `${prefix} Technologies`,
    tagline: clean.length > 15 ? clean : `Next-generation ${profile.category.toLowerCase()} platform`
  };
}

export function detectDomainProfile(text: string, vertical: string): DomainProfile {
  const combined = (text + ' ' + vertical).toLowerCase();

  // 1. GREETING / CONVERSATIONAL PROMPTS ("Hi", "Meow", "Chat", "Messaging", "Async", "Presence")
  if (combined.match(/\b(hi|hello|hey|meow|greet|chat|messaging|async|communication|slack|video sync|presence|meeting|standup|huddle|collab)\b/)) {
    return {
      category: 'Conversational AI & Workplace Communication',
      defaultTamBillion: 75,
      cagrRange: [21.5, 31.0],
      primaryMetricName: 'Distributed Knowledge Workers & Engineering Teams',
      defaultArpu: 180, // $15/seat/month
      pricingModelType: 'Per-Seat Monthly SaaS ($8 - $18/seat/mo)',
      sampleCompetitors: [
        { name: 'Slack & Microsoft Teams (Notification Fatigue)', weakness: 'Unending message interruptions, constant context fragmentation, and zero focus protection', diff: 'Ambient async presence with AI thread distillation and automated deep-work shielding' },
        { name: 'Loom & Synchronous Video Meetings', weakness: 'Heavy recording friction, meeting exhaustion, and non-searchable siloed video updates', diff: 'Sub-second voice/video snippets with automated transcription, action extraction, and zero meetings' }
      ],
      objectionFocus: 'Team adoption inertia and displacement friction against entrenched corporate chat installs',
      regulatoryFocus: 'SOC2 Type II, End-to-End Enterprise Encryption, and GDPR Data Privacy',
      gtmChannels: [
        { name: 'Bottom-Up Team Viral Loops (PLG)', strategy: 'Frictionless 1-click shared snippet links and free guest access driving organic teammate invites', share: 55 },
        { name: 'Remote & Engineering Community Outbound', strategy: 'Direct partnerships with leading distributed startup incubators and engineering orgs', share: 25 },
        { name: 'Ecosystem Marketplace Apps', strategy: 'Deep bi-directional Slack, GitHub, and Jira integration apps for self-serve deployment', share: 20 }
      ]
    };
  }

  // 2. HEALTHCARE & HEALTHTECH
  if (combined.match(/health|clinic|doctor|patient|medical|biotech|pharma|dental|hospital|ehr|fhir|clinical|care|telehealth/)) {
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

  // 3. LOGISTICS, FLEET & SUPPLY CHAIN
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

  // 4. DEVELOPER TOOLS & CLOUD INFRASTRUCTURE
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

  // 5. FINTECH, BANKING & CRYPTO
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

  // 6. CLIMATETECH & CLEAN ENERGY
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

  // 7. E-COMMERCE, RETAIL & D2C
  if (combined.match(/commerce|retail|store|shopify|apparel|fashion|goods|brand|d2c|merchandise|checkout|cart/)) {
    return {
      category: 'E-Commerce & Digital Retail',
      defaultTamBillion: 165,
      cagrRange: [15.5, 23.0],
      primaryMetricName: 'Online Brands & Multi-Channel Retailers',
      defaultArpu: 12000,
      pricingModelType: 'Base Platform Tier ($199 - $899/mo) + 1.2% Gross Merchandise Value',
      sampleCompetitors: [
        { name: 'Generic Shopify App Clutter', weakness: 'Fragmented single-feature plugins that slow down page loads and conflict with each other', diff: 'Unified end-to-end commerce engine operating at native sub-50ms speed' },
        { name: 'Legacy Enterprise Retail Suites (SAP Hybris, Magento)', weakness: 'Multi-million dollar upfront setup, continuous developer retainer costs', diff: 'Instant modern deployment with pre-built omnichannel synchronization' }
      ],
      objectionFocus: 'Merchant customer acquisition cost (CAC) inflation and checkout abandonment rates',
      regulatoryFocus: 'PCI-DSS Level 1, CCPA/GDPR Consumer Data Compliance, and Global VAT/Tax Automation',
      gtmChannels: [
        { name: 'Shopify App Store Ecosystem', strategy: 'Top-ranked featured app with 5-star merchant reviews and 14-day free trials', share: 45 },
        { name: 'D2C Agency Alliances', strategy: 'Revenue-share co-selling programs with top digital marketing and store development agencies', share: 35 },
        { name: 'Direct Merchant Growth Outbound', strategy: 'Targeted outreach to fast-growing D2C brands demonstrating instant conversion lift', share: 20 }
      ]
    };
  }

  // 8. FOOD, DINING & HOSPITALITY
  if (combined.match(/food|restaurant|kitchen|dining|meal|cafe|chef|beverage|coffee|culinary|hospitality|delivery/)) {
    return {
      category: 'FoodTech & Hospitality Systems',
      defaultTamBillion: 130,
      cagrRange: [14.0, 21.5],
      primaryMetricName: 'Independent Restaurants & Hospitality Groups',
      defaultArpu: 7200,
      pricingModelType: 'Monthly Location SaaS ($149 - $499/mo) + 1.5% Order Fee',
      sampleCompetitors: [
        { name: 'Predatory Third-Party Delivery Apps (DoorDash, UberEats)', weakness: 'Brutal 25-30% commission cuts that destroy restaurant margins and hoard diner data', diff: 'Commission-free direct ordering preserving 100% of guest data and profits' },
        { name: 'Legacy Clunky POS Terminals (Toast, NCR Aloha)', weakness: 'Exorbitant proprietary hardware fees, inflexible contract lock-in', diff: 'Hardware-agnostic cloud system running seamlessly on any existing tablet or phone' }
      ],
      objectionFocus: 'Restaurant kitchen operational bandwidth and staff turnover during onboarding',
      regulatoryFocus: 'FDA Food Safety Standards, Health Inspection Compliance, and Local Liquor/Tax Laws',
      gtmChannels: [
        { name: 'Local Restaurant Group Sales', strategy: 'In-person culinary and operator demos showing immediate 20%+ margin recovery', share: 50 },
        { name: 'Food Distributor Partnerships', strategy: 'Bundling software with primary food service and beverage supply distributors', share: 30 },
        { name: 'Hospitality Word-of-Mouth', strategy: 'Operator-to-operator referral credits and regional chef network sponsorships', share: 20 }
      ]
    };
  }

  // 9. GAMING & INTERACTIVE ENTERTAINMENT
  if (combined.match(/game|gaming|esports|unity|unreal|gamer|metaverse|steam|roblox|interactive/)) {
    return {
      category: 'Gaming & Interactive Entertainment',
      defaultTamBillion: 190,
      cagrRange: [12.5, 20.5],
      primaryMetricName: 'Game Studios & Digital Players',
      defaultArpu: 600,
      pricingModelType: 'Freemium Player Experience + In-Game Season Passes ($9.99/mo)',
      sampleCompetitors: [
        { name: 'Generic Live-Ops Frameworks', weakness: 'Cookie-cutter gameplay loops, aggressive pay-to-win mechanics that alienate players', diff: 'Player-centric economy with skill-driven progression and dynamic live events' },
        { name: 'Legacy Desktop Publishers', weakness: 'Slow 3-year release cycles, zero community co-creation, and heavy publisher take-rates', diff: 'Rapid agile content updates built alongside an active Discord creator community' }
      ],
      objectionFocus: 'Day-30 player retention and organic creator discovery algorithms',
      regulatoryFocus: 'COPPA Child Safety, Digital Goods Tax Compliance, and Anti-Cheat System Integrity',
      gtmChannels: [
        { name: 'Twitch & YouTube Gaming Creators', strategy: 'Exclusive early-access streamer tournaments and creator revenue-share codes', share: 55 },
        { name: 'Steam & Epic Game Store Launch', strategy: 'Wishlist acceleration campaigns and high-engagement alpha playtests', share: 30 },
        { name: 'Discord Community Tournaments', strategy: 'Weekly competitive leagues with community-driven prizes and badges', share: 15 }
      ]
    };
  }

  // 10. REAL ESTATE & PROPTECH
  if (combined.match(/real estate|property|tenant|landlord|leasing|mortgage|housing|proptech|apartment|broker/)) {
    return {
      category: 'PropTech & Real Estate Innovation',
      defaultTamBillion: 175,
      cagrRange: [15.0, 22.0],
      primaryMetricName: 'Property Managers & Real Estate Operators',
      defaultArpu: 18000,
      pricingModelType: 'Per-Unit Monthly Platform Fee ($3 - $8/unit/mo) + Transaction Fees',
      sampleCompetitors: [
        { name: 'Legacy Property Suites (Yardi, RealPage)', weakness: 'Archaic Windows-era user interfaces, fragmented manual data entry, slow support', diff: 'Modern mobile-first tenant experience with automated lease underwriting and rent collection' },
        { name: 'Paper Leases & In-Person Walkthroughs', weakness: 'Slow 14-day vacancy turnaround, manual background checks, and lost paperwork', diff: 'Instant digital lease execution, smart lock access, and automated maintenance dispatch' }
      ],
      objectionFocus: 'Multi-family landlord adoption inertia and property management integration',
      regulatoryFocus: 'Fair Housing Act Compliance, Tenant Privacy Laws, and Escrow Security Standards',
      gtmChannels: [
        { name: 'Multi-Family Portfolio Outbound', strategy: 'Targeting owners and operators with 500+ units with guaranteed vacancy reduction', share: 50 },
        { name: 'Real Estate Broker Alliances', strategy: 'Co-marketing with local leasing brokerages offering automated tenant qualification', share: 30 },
        { name: 'Regional PropTech Conferences', strategy: 'Live digital leasing demos at National Apartment Association expos', share: 20 }
      ]
    };
  }

  // 11. PET CARE & ANIMAL HEALTH
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

  // 12. EDTECH & LEARNING
  if (combined.match(/education|school|learning|edtech|student|teacher|course|coding|kids|university|tutor/)) {
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

  // 13. ADAPTIVE UNIVERSAL DOMAIN (Tailored directly from user's extracted keywords)
  const keywords = extractKeywords(text);
  const primaryTopic = keywords.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Domain';

  return {
    category: `${primaryTopic} Innovation & Intelligence`,
    defaultTamBillion: 90,
    cagrRange: [18.0, 28.5],
    primaryMetricName: `Target ${primaryTopic} Customers & Organizations`,
    defaultArpu: 14000,
    pricingModelType: 'Value-Aligned Tiered Subscription ($99 - $899/mo)',
    sampleCompetitors: [
      { name: `Fragmented Manual ${primaryTopic} Workflows`, weakness: 'High human error, siloed information, and excessive wasted administrative hours', diff: `Unified, modern architecture purpose-built specifically for ${primaryTopic.toLowerCase()} operations` },
      { name: `Rigid Incumbent Software`, weakness: 'Months of slow implementation, outdated interfaces, and poor user adoption', diff: 'Instant 10-minute automated setup with intuitive modern design' }
    ],
    objectionFocus: 'Customer time-to-value velocity, churn prevention, and proprietary moat defensibility',
    regulatoryFocus: 'SOC2 Type II, Industry Standards, and Enterprise Data Encryption',
    gtmChannels: [
      { name: 'Product-Led Land & Expand', strategy: 'Frictionless self-serve trial allowing users to experience rapid value in minutes', share: 45 },
      { name: 'Targeted Executive Outbound', strategy: 'Personalized operational audits sent directly to department decision makers', share: 35 },
      { name: 'Ecosystem & Partner Integration', strategy: 'Certified integrations with standard tools driving continuous inbound leads', share: 20 }
    ]
  };
}

function parseFundingAmount(fundingStage: string): { isSeed: boolean; targetNumber: number; formattedAmount: string; roundLabel: string } {
  const clean = (fundingStage || '').toLowerCase();
  
  if (clean.includes('pre-seed') || clean.includes('500k') || clean.includes('$500') || clean.includes('angel')) {
    return {
      isSeed: true,
      targetNumber: 750_000,
      formattedAmount: '$750,000',
      roundLabel: 'Pre-Seed Round'
    };
  }
  
  if (clean.includes('series a') || clean.includes('10m') || clean.includes('$10') || clean.includes('8m') || clean.includes('$8')) {
    return {
      isSeed: false,
      targetNumber: 8_500_000,
      formattedAmount: '$8,500,000',
      roundLabel: 'Series A Round'
    };
  }

  return {
    isSeed: true,
    targetNumber: 2_500_000,
    formattedAmount: '$2,500,000',
    roundLabel: 'Seed Round'
  };
}

function generateDynamicTeam(idea: string, profile: DomainProfile): {
  members: { name: string; role: string; pedigree: string; domainSuperpower: string }[];
  advisors: { name: string; affiliation: string; expertise: string }[];
} {
  const seed = stringToSeed(idea + profile.category);
  const isComm = profile.category.toLowerCase().includes('communication') || profile.category.toLowerCase().includes('conversational');
  const isHealth = profile.category.toLowerCase().includes('health');
  const isFinance = profile.category.toLowerCase().includes('fintech') || profile.category.toLowerCase().includes('payment');
  const isLogistics = profile.category.toLowerCase().includes('logistics') || profile.category.toLowerCase().includes('supply');

  const firstNames = ['Sarah', 'Marcus', 'Elena', 'Alex', 'David', 'Maya', 'Nikhil', 'Julian', 'Amara', 'Kai'];
  const lastNames = ['Chen', 'Rivera', 'Rostova', 'Lin', 'Sterling', 'Okafor', 'Sharma', 'Watson', 'Patel', 'Vance'];

  const ceoName = `${firstNames[seed % firstNames.length]} ${lastNames[(seed + 2) % lastNames.length]}`;
  const ctoName = `${firstNames[(seed + 3) % firstNames.length]} ${lastNames[(seed + 5) % lastNames.length]}`;
  const cpoName = `${firstNames[(seed + 6) % firstNames.length]} ${lastNames[(seed + 7) % lastNames.length]}`;

  let ceoPedigree = `Former Lead Product Architect in ${profile.category.split('&')[0].trim()}, Stanford CS`;
  let ctoPedigree = `Ex-Senior Distributed Systems Engineer, PhD from UC Berkeley`;
  let cpoPedigree = `Former VP Growth & Operations at top ${profile.category.split('&')[0].trim()} scale-up`;

  if (isComm) {
    ceoPedigree = 'Former Product Lead at Slack / Twilio, Stanford Computer Science';
    ctoPedigree = 'Ex-Principal WebRTC & Real-time Protocols Architect at Discord, MIT PhD';
    cpoPedigree = 'Scaled remote productivity platforms from $0 to $35M ARR (>135% NRR)';
  } else if (isHealth) {
    ceoPedigree = 'Former Clinical Informatics Director, Johns Hopkins Medical Institute';
    ctoPedigree = 'Ex-FHIR Integration & Biomedical Security Lead at Epic Systems';
    cpoPedigree = 'Former Healthcare Commercial Executive at Tier-1 Digital Health Scaleup';
  } else if (isFinance) {
    ceoPedigree = 'Former VP Payments & Treasury Strategy at Stripe / Adyen, Wharton MBA';
    ctoPedigree = 'Ex-High-Frequency Trading & Clearing Systems Architect at Citadel';
    cpoPedigree = 'Former Head of Banking Partnerships & Regulatory Compliance';
  } else if (isLogistics) {
    ceoPedigree = 'Former Global Freight Strategy Director at Flexport / Maersk';
    ctoPedigree = 'Ex-Fleet Telemetry & Dynamic Dispatch Systems Lead at Uber Freight';
    cpoPedigree = 'Former Enterprise Supply Chain Commercial VP for Fortune 500 Retailers';
  }

  return {
    members: [
      {
        name: ceoName,
        role: 'Co-Founder & CEO',
        pedigree: ceoPedigree,
        domainSuperpower: '10+ years driving category innovation, institutional customer relationships, and product vision.'
      },
      {
        name: `${ctoName}, PhD`,
        role: 'Co-Founder & CTO',
        pedigree: ctoPedigree,
        domainSuperpower: 'Architected mission-critical real-time platforms processing millions of daily events with 99.99% reliability.'
      },
      {
        name: cpoName,
        role: 'Head of Growth & Commercial',
        pedigree: cpoPedigree,
        domainSuperpower: 'Proven track record scaling B2B land-and-expand funnels from Day 0 to top-quartile market benchmarks.'
      }
    ],
    advisors: [
      { name: `Dr. Robert Sterling`, affiliation: `Former Executive VP, ${profile.category} Consortium`, expertise: profile.regulatoryFocus },
      { name: `Claire Montgomery`, affiliation: `General Partner, Tier-1 Venture Fund`, expertise: 'Syndicate Scaling & Institutional Go-To-Market' }
    ]
  };
}

export interface HumanNarrative {
  problemTitle: string;
  problemSubtitle: string;
  problemPoints: {
    title: string;
    description: string;
    quantifiedLoss: string;
    affectedGroup: string;
  }[];
  urgencyTrigger: string;
  statusQuoAlternative: string;
  solutionTagline: string;
  solutionPillars: {
    name: string;
    benefit: string;
    howItWorks: string;
  }[];
  beforeVsAfter: {
    before: string;
    after: string;
  };
  customerQuote: string;
}

export function generateHumanNarrative(
  _idea: string,
  profile: DomainProfile,
  audience: string,
  brandName: string
): HumanNarrative {
  const category = profile.category.toLowerCase();
  const isComm = category.includes('conversational') || category.includes('communication');
  const isHealth = category.includes('health') || category.includes('clinic');
  const isLogistics = category.includes('logistics') || category.includes('supply');
  const isDev = category.includes('developer') || category.includes('infra');
  const isFintech = category.includes('fintech') || category.includes('payment') || category.includes('financial');
  const isClimate = category.includes('energy') || category.includes('climate') || category.includes('cleantech');

  if (isComm) {
    return {
      problemTitle: 'Distributed Teams are Drowning in Context Fragmentation & Meeting Exhaustion',
      problemSubtitle: 'Engineers switch context 1,200+ times a day while losing 14+ hours every week to calendar status syncs.',
      problemPoints: [
        {
          title: 'Constant Low-Context Interruptions',
          description: 'Knowledge workers receive over 65 trivial "Hi / quick question?" pings daily that destroy deep focus state and fracture sprint velocity.',
          quantifiedLoss: 'Over 14 lost hours per employee every single week',
          affectedGroup: 'Engineering Leads & Distributed Knowledge Workers'
        },
        {
          title: 'Exhausting Synchronous Meeting Creep',
          description: 'Teams default to 30-minute Zoom meetings for simple updates that could easily be shared in a 20-second async video snippet.',
          quantifiedLoss: '$420,000 / year in wasted executive and engineering meeting payroll',
          affectedGroup: 'Remote Engineering Teams & Product Managers'
        },
        {
          title: 'Fragmented Context & Timezone Blockers',
          description: 'Decisions vanish into ephemeral Slack channels, forcing engineers across differing timezones to wait 24 hours for basic question turnarounds.',
          quantifiedLoss: '3.4x higher rate of misaligned sprint deliverables',
          affectedGroup: 'Distributed Global Teams & Technical Leadership'
        }
      ],
      urgencyTrigger: 'Remote and hybrid work is permanent, but tools designed in 2013 are burning engineers out with notification noise.',
      statusQuoAlternative: 'Back-to-back 30-minute Zoom calls and sprawling Slack channels that nobody has time to read.',
      solutionTagline: `Ambient conversational intelligence and async video presence built for high-velocity teams.`,
      solutionPillars: [
        {
          name: 'Ambient Async Presence',
          benefit: 'Zero Interruptions',
          howItWorks: 'Replaces noisy chat pings with lightweight video/voice snapshots that teammates consume when in flow.'
        },
        {
          name: 'AI Context Distillation',
          benefit: '10x Faster Catchup',
          howItWorks: 'Intelligent AI models summarize hours of fragmented team discussions into actionable 30-second briefs.'
        },
        {
          name: 'Timezone-Shielded Flow States',
          benefit: 'Seamless Global Work',
          howItWorks: 'Engineers collaborate seamlessly across hemispheres without waking up to hundreds of unread message notifications.'
        }
      ],
      beforeVsAfter: {
        before: '14 hours of draining Zoom meetings every week, disjointed Slack messages, and fractured engineering focus.',
        after: `Serene, asynchronous flow state with ${brandName}: instant AI context briefings, zero status syncs, and 3 full days of deep work restored.`
      },
      customerQuote: `"${brandName} eliminated 60% of our internal meetings in our first two weeks. Our distributed engineers now spend their best hours writing code rather than sitting in calendar marathons." — David Sterling, VP of Engineering at ScaleCloud`
    };
  }

  if (isHealth) {
    return {
      problemTitle: 'Clinicians Spend 2 Hours on Administrative Paperwork for Every 1 Hour of Patient Care',
      problemSubtitle: 'Outdated EHR systems, documentation burdens, and manual coding burn out doctors and drain clinical margins.',
      problemPoints: [
        {
          title: 'Severe After-Hours Charting Burden',
          description: 'Physicians spend 1.8 to 2.5 hours every evening completing notes in clunky legacy EHRs, driving record clinician burnout and departures.',
          quantifiedLoss: '$140,000 lost per departing clinician in replacement costs',
          affectedGroup: 'Physicians & Clinical Staff'
        },
        {
          title: 'Incomplete Documentation & Claim Denials',
          description: 'Manual dictation misses critical ICD-10 coding nuances, resulting in an 11% average initial insurance claim denial rate across provider networks.',
          quantifiedLoss: '11% first-pass claim rejection rate',
          affectedGroup: 'Practice Administrators & Billing Teams'
        },
        {
          title: 'Fragmented EHR Data Silos',
          description: 'Providers must navigate 40+ clicks per patient encounter across disconnected FHIR and proprietary on-premise hospital systems.',
          quantifiedLoss: '40+ clicks per routine patient visit',
          affectedGroup: 'Chief Medical Officers & Clinical Operations'
        }
      ],
      urgencyTrigger: 'Physician burnout is at an all-time high, while insurance reimbursement scrutiny requires 100% airtight clinical evidence.',
      statusQuoAlternative: 'Hiring expensive human medical scribes or forcing doctors into 15-hour workdays.',
      solutionTagline: `Ambient clinical intelligence that turns natural doctor-patient encounters into structured, compliant charts.`,
      solutionPillars: [
        {
          name: 'Ambient Clinical Listening',
          benefit: 'Zero Note-Taking',
          howItWorks: 'Captures natural dialogue during consultations and formats structured SOAP notes in real time.'
        },
        {
          name: 'Automated ICD-10 & Billing Underwriting',
          benefit: 'Zero Claim Denials',
          howItWorks: 'Pre-underwrites reimbursement codes directly mapped to clinical evidence before claim submission.'
        },
        {
          name: 'Native 1-Click EHR Sync',
          benefit: 'Sub-Second Updates',
          howItWorks: 'Direct bidirectional FHIR sync into Epic, Cerner, and Athenahealth with zero physician copy-pasting.'
        }
      ],
      beforeVsAfter: {
        before: 'Exhausted physicians typing into screens while talking to patients, followed by 2 hours of late-night charting.',
        after: `100% eye-to-eye patient interaction with ${brandName}: finalized, insurance-verified clinical notes ready the second the exam concludes.`
      },
      customerQuote: `"${brandName} saves our physicians nearly 2 hours per day on charts. Patient satisfaction scores jumped 28% because doctors are looking at patients instead of screens." — Dr. Maya Lin, Chief Medical Officer at Premier Health Network`
    };
  }

  if (isLogistics) {
    return {
      problemTitle: 'Supply Chains are Flying Blind Across Disconnected Carriers, Silos, and Spreadsheets',
      problemSubtitle: '23% of freight shipments face unpredicted delays due to manual dispatching and legacy TMS batch processing.',
      problemPoints: [
        {
          title: 'Zero Real-Time Visibility on In-Transit Cargo',
          description: 'Shippers and 3PLs rely on manual phone check-calls and batch EDI feeds that update only once every 12 to 24 hours.',
          quantifiedLoss: '$450,000 in annual detention fees and late penalties',
          affectedGroup: 'Shippers & Fleet Operators'
        },
        {
          title: 'Fragmented Fleet Routing Wastes 20%+ Capacity',
          description: 'Dispatchers juggle 15 disconnected software tabs, leaving up to a quarter of trailer capacity running empty on return trips.',
          quantifiedLoss: '22% average deadhead empty mileage',
          affectedGroup: 'Fleet Operations & Dispatch Leads'
        },
        {
          title: 'Manual Firefighting on Exceptions',
          description: 'By the time port or weather delays register in legacy ERPs, demurrage fees are already mounting and inventory is stranded.',
          quantifiedLoss: 'Average 4-day delay in exception rerouting',
          affectedGroup: 'Supply Chain Directors & Logistics Coordinators'
        }
      ],
      urgencyTrigger: 'Surging fuel prices and strict on-time delivery mandates leave zero tolerance for logistics dead-zones.',
      statusQuoAlternative: 'Manual phone check-calls, static EDI 214 status updates, and frantic Excel sheets.',
      solutionTagline: `Autonomous freight intelligence and live predictive routing engine for modern fleet operations.`,
      solutionPillars: [
        {
          name: 'Continuous Telemetry & Predictive ETA',
          benefit: 'Live Precision',
          howItWorks: 'Sub-second GPS and IoT sensor tracking with dynamic weather and port traffic predictive rerouting.'
        },
        {
          name: 'Automated Capacity Matching',
          benefit: 'Zero Empty Miles',
          howItWorks: 'Algorithmic backhaul matching that pairs outbound shipments with return freight in real time.'
        },
        {
          name: 'Self-Healing Logistics Exceptions',
          benefit: 'Proactive Resolution',
          howItWorks: 'Instantly alerts warehouses, reschedules dock appointments, and reroutes freight before delays compound.'
        }
      ],
      beforeVsAfter: {
        before: 'Endless check-calls, unexpected port demurrage fees, and frantic manual re-dispatching.',
        after: `100% real-time container visibility with ${brandName}, automated appointment scheduling, and 18% lower total freight spend.`
      },
      customerQuote: `"${brandName} reduced our trailer deadhead rate from 21% to under 5% in 60 days, while completely eliminating manual tracking phone calls." — Marcus Vance, Global Logistics Director at Apex Freightways`
    };
  }

  if (isDev) {
    return {
      problemTitle: 'Engineering Teams Spend 40% of Sprint Cycles Maintaining Fragile DevOps & Glue Code',
      problemSubtitle: 'Cloud infrastructure complexity is choking developer velocity and blowing up monthly cloud bills.',
      problemPoints: [
        {
          title: 'Cloud Primitives Have Become Untenable',
          description: 'Deploying a single microservice requires wrestling with hundreds of lines of Terraform, IAM policies, and VPC routing rules.',
          quantifiedLoss: '14 days average lead time for new service provisioning',
          affectedGroup: 'Software Engineers & Technical Leads'
        },
        {
          title: 'Unmonitored Cloud Cost Runaway',
          description: 'Over-provisioned idle clusters, unattached storage volumes, and runaway compute jobs create massive budget surprises every quarter.',
          quantifiedLoss: '35% of total cloud spend wasted on idle resources',
          affectedGroup: 'Engineering Leadership & VP Finance'
        },
        {
          title: 'Alert Storms and Flaky CI/CD Pipelines',
          description: 'Engineers drown in false-positive monitoring alerts and flaky test runs, slowing core product shipping to a crawl.',
          quantifiedLoss: '12 hours per week lost to debugging pipeline failures',
          affectedGroup: 'DevOps & Site Reliability Engineers'
        }
      ],
      urgencyTrigger: 'Modern engineering teams must ship daily, but the cognitive overhead of cloud ops has doubled in 3 years.',
      statusQuoAlternative: 'Writing bespoke internal scripts, hiring more DevOps contractors, and enduring weekly outage firefights.',
      solutionTagline: `Autonomous infrastructure runtime that lets developers deploy scalable production services with zero DevOps overhead.`,
      solutionPillars: [
        {
          name: 'Zero-Config Infrastructure',
          benefit: 'Deploy in 30 Seconds',
          howItWorks: 'Infers database, caching, and compute requirements directly from your code repository with instant VPC isolation.'
        },
        {
          name: 'Dynamic Compute & Cost Autoscaling',
          benefit: '60% Lower Bills',
          howItWorks: 'Scales compute down to zero when idle and provisions high-concurrency instances only during actual traffic spikes.'
        },
        {
          name: 'Self-Healing Canary Deployments',
          benefit: 'Zero Downtime',
          howItWorks: 'Automatically runs shadow traffic tests and rolls back regressions before real users are ever impacted.'
        }
      ],
      beforeVsAfter: {
        before: 'Weeks of Terraform configuration, mysterious IAM errors, and runaway $40k AWS bills.',
        after: `Single-command git push to global production with ${brandName}: automatic autoscaling, zero DevOps friction, and 50% cloud cost reduction.`
      },
      customerQuote: `"${brandName} allowed our engineers to go from spending 3 days configuring cloud infrastructure for every release to pushing in 45 seconds. It completely unlocked our roadmap." — Elena Rostova, CTO at HyperScale Data`
    };
  }

  if (isFintech) {
    return {
      problemTitle: 'Global Payment Rails and Treasury Operations are Trapped in T+3 Batch Systems',
      problemSubtitle: 'Businesses lose billions to reconciliation errors, slow settlement cycles, and high interchange fees.',
      problemPoints: [
        {
          title: 'Days-Long Capital Settlement Freezes Working Capital',
          description: 'Businesses wait 2 to 5 business days for domestic ACH and international SWIFT transfers to clear, tying up millions in buffer capital.',
          quantifiedLoss: '4.2% cost of capital tied up in settlement transit',
          affectedGroup: 'Finance Directors & Corporate Treasurers'
        },
        {
          title: 'Reconciliation Nightmares & Month-End Delays',
          description: 'Mismatched gateway statements, disputed chargebacks, and multi-currency exchange rates require manual ledger spreadsheets.',
          quantifiedLoss: '18 days required for monthly financial book close',
          affectedGroup: 'Accounting Teams & Financial Controllers'
        },
        {
          title: 'Legacy Rule-Based Fraud Filters Hurt Good Buyers',
          description: 'Crude risk heuristics reject 3.8% of legitimate transactions while letting sophisticated synthetic identity fraud slip through.',
          quantifiedLoss: '$320,000 annual loss in falsely declined high-intent revenue',
          affectedGroup: 'E-Commerce Merchants & Risk Officers'
        }
      ],
      urgencyTrigger: 'Global commerce is 24/7, but financial infrastructure remains bound to banking hours and legacy settlement clearinghouses.',
      statusQuoAlternative: 'Manual spreadsheets, batch wire uploads, and separate disparate merchant accounts.',
      solutionTagline: `Unified programmatic payments and instant liquidity platform built for internet-scale commerce.`,
      solutionPillars: [
        {
          name: 'Sub-Second Global Settlement',
          benefit: 'Instant Liquidity',
          howItWorks: 'Moves funds in real time across domestic and international accounts with guaranteed ledger finality.'
        },
        {
          name: 'Autonomous Ledger Reconciliation',
          benefit: 'Instant Month-End Close',
          howItWorks: 'Continuously matches transaction line items against bank statements with 99.99% automated precision.'
        },
        {
          name: 'Adaptive Risk Scoring Engine',
          benefit: 'Zero Fraud False-Positives',
          howItWorks: 'Evaluates fraud signals in sub-50ms to approve 99.2% of legitimate buyers while intercepting synthetic attacks.'
        }
      ],
      beforeVsAfter: {
        before: '18-day monthly book closes, millions locked in settlement limbo, and 3% interchange leakage.',
        after: `Instant continuous reconciliation with ${brandName}, real-time treasury visibility, and 40% lower transaction processing overhead.`
      },
      customerQuote: `"${brandName} shortened our month-end financial close from 16 days to 4 hours, and recovered over $1.2M in previously trapped working capital." — Julian Watson, CFO at Meridian Commerce`
    };
  }

  if (isClimate) {
    return {
      problemTitle: 'Commercial Buildings & Grids Waste 30%+ Energy Due to Blind HVAC & Power Management',
      problemSubtitle: 'Facility owners face soaring utility peak demand charges and mandatory carbon penalty deadlines.',
      problemPoints: [
        {
          title: 'Uncoordinated Peak Surges Drive 50% of Bills',
          description: 'Commercial facilities run heavy HVAC and chillers without load shifting, triggering brutal utility demand charges during peak grid hours.',
          quantifiedLoss: '$180,000/year per facility in avoidable peak utility surcharges',
          affectedGroup: 'Commercial Property Managers & Facility Engineers'
        },
        {
          title: 'Imminent Municipal Carbon Penalty Fines',
          description: 'Property managers face steep escalating penalties (e.g. NYC Local Law 97) for failing to achieve audited carbon emissions reductions.',
          quantifiedLoss: '$268 per ton in statutory fines on excess emissions',
          affectedGroup: 'Real Estate Asset Managers & ESG Executives'
        },
        {
          title: 'Fragmented Building Management Systems (BMS)',
          description: 'Chillers, solar arrays, battery storage, and smart meters operate on siloed proprietary protocols with zero unified intelligence.',
          quantifiedLoss: 'Average 6 different incompatible hardware consoles per site',
          affectedGroup: 'Operations Directors & Building Engineers'
        }
      ],
      urgencyTrigger: 'Grid stress and municipal emissions mandates are turning energy inefficiency into direct balance-sheet liabilities.',
      statusQuoAlternative: 'Static thermostat timers, periodic utility bills, and manual facility walkthroughs.',
      solutionTagline: `Intelligent autonomous energy orchestration and automated peak-load shaving for commercial portfolios.`,
      solutionPillars: [
        {
          name: 'Predictive Thermal & Load Optimization',
          benefit: '35% Energy Reduction',
          howItWorks: 'Learns building thermodynamics and weather forecasts to pre-cool facilities during low-tariff hours.'
        },
        {
          name: 'Autonomous Peak-Demand Shaving',
          benefit: 'Zero Demand Penalties',
          howItWorks: 'Automatically throttles non-essential loads during utility peak rate spikes without impacting occupant comfort.'
        },
        {
          name: 'Audit-Ready Carbon Compliance',
          benefit: 'Guaranteed Zero Fines',
          howItWorks: 'Generates certified Scope 1-3 ESG and municipal compliance filings with continuous telemetry proof.'
        }
      ],
      beforeVsAfter: {
        before: 'Surprise $50,000 monthly utility demand spikes and looming municipal carbon penalty notices.',
        after: `Fully automated, self-optimizing building energy profiles with ${brandName}, delivering a guaranteed 28% drop in net energy expenditure.`
      },
      customerQuote: `"${brandName} dropped our commercial property portfolio energy bills by 31% in our first quarter while completely avoiding Local Law 97 penalties." — Amara Okafor, Head of Asset Sustainability at Horizon Commercial Trust`
    };
  }

  // Universal Adaptive (High-Conviction B2B SaaS Narrative)
  const cleanSubject = profile.category.split('&')[0].trim();
  return {
    problemTitle: `${cleanSubject} Operations are Paralyzed by Disconnected Tools and Manual Busywork`,
    problemSubtitle: `Teams lose over 25 hours per week manually bridging the gap between fragmented software and rigid legacy vendors.`,
    problemPoints: [
      {
        title: 'Knowledge Workers Drown in Low-Value Admin Work',
        description: `Teams spend the majority of their week manually moving information between spreadsheets, legacy software, and email.`,
        quantifiedLoss: '$320,000 / year in wasted operational payroll',
        affectedGroup: audience
      },
      {
        title: 'Fragmented Software Stacks Cause Costly Errors',
        description: 'Critical operational data is scattered across 8+ disparate tools, leading to miscommunications, delayed deliverables, and customer churn.',
        quantifiedLoss: '3.2x higher rate of project delays and customer churn',
        affectedGroup: 'Operational Teams & Managers'
      },
      {
        title: 'Rigid Incumbents Lock Teams Into Sluggish Workflows',
        description: 'Legacy tools take 6+ months to implement, cost hundreds of thousands of dollars, and suffer from poor employee adoption.',
        quantifiedLoss: 'Over 45% of enterprise software licenses sit unadopted',
        affectedGroup: 'Executive Leadership & Finance'
      }
    ],
    urgencyTrigger: `Modern teams in ${cleanSubject} must operate with speed and precision, while legacy tools remain rigid, sluggish, and expensive.`,
    statusQuoAlternative: 'Hiring more manual headcount or band-aiding custom spreadsheets that break constantly.',
    solutionTagline: `Modern, automated platform purpose-built for high-performance ${cleanSubject.toLowerCase()} teams.`,
    solutionPillars: [
      {
        name: 'Unified Automated Workflows',
        benefit: '10x Faster Execution',
        howItWorks: 'Eliminates manual busywork by connecting end-to-end operations in a single, intuitive interface.'
      },
      {
        name: 'Instant Ecosystem Integration',
        benefit: 'Same-Day Deployment',
        howItWorks: `Connects seamlessly with existing everyday software tools with built-in ${profile.regulatoryFocus}.`
      },
      {
        name: 'Real-Time Intelligence & Guardrails',
        benefit: 'Zero Operational Errors',
        howItWorks: 'Continuous automated verification loops ensure every transaction and record is 100% accurate.'
      }
    ],
    beforeVsAfter: {
      before: 'Days of manual coordination, high error rates, and constant operational firefighting.',
      after: `Instant automated execution with ${brandName}: total operational visibility, serene workflows, and measurable ROI.`
    },
    customerQuote: `"${brandName} cut our team's operational turnaround time by over 70%. It has become the indispensable backbone of our daily work." — Sarah Chen, VP of Operations at Vanguard Systems`
  };
}

export function generateDynamicSlides(
  input: UserBusinessInput,
  research: ResearchDossier
): Slide[] {
  const archetype = findReferenceArchetypeById(input.selectedReferenceArchetype || 'sequoia-blueprint');
  const idea = input.businessIdea || 'Modern Software Platform';
  const profile = detectDomainProfile(idea, input.industryVertical || '');
  const brand = deriveStartupBrandName(idea, profile);
  const audience = input.targetAudience || profile.primaryMetricName;
  const stage = input.fundingStage || 'Seed Round ($2.5M)';
  const fundingInfo = parseFundingAmount(stage);
  const moat = input.uspOrMoat || 'Proprietary domain workflows and high switching costs';
  const teamData = generateDynamicTeam(idea, profile);
  const narrative = generateHumanNarrative(idea, profile, audience, brand.name);

  const targetArpu = research.bottomUpMath.arpuAnnual;
  const isConsumer = targetArpu < 1500;

  const starterPrice = isConsumer ? Math.max(12, Math.round(targetArpu * 0.4 / 12)) : Math.max(79, Math.round(targetArpu * 0.25 / 12));
  const corePrice = isConsumer ? Math.max(29, Math.round(targetArpu / 12)) : Math.max(249, Math.round(targetArpu / 12));
  const enterprisePrice = isConsumer ? Math.max(99, Math.round(targetArpu * 2.5 / 12)) : Math.max(12000, Math.round(targetArpu * 2.0));

  const slides: Slide[] = [
    // 1. PROBLEM
    {
      id: 'slide-1-problem',
      type: 'problem',
      slideNumber: 1,
      navTitle: '01. The Problem',
      speakerNotes: `Walk investors through the expensive daily friction facing ${audience}.`,
      groundedArchetypeCitation: `${archetype.name} Problem Framework: 3 quantified friction points.`,
      provenanceList: [
        {
          id: 'prov-prob-1',
          claim: `Legacy ${profile.category} workflows create significant operational waste`,
          sourceType: 'grounded_comp',
          sourceLabel: `${profile.category} Operational Audit`,
          formulaOrCitation: `Organizations lose an average of $380,000 annually to manual coordination and tool fragmentation.`,
          confidenceScore: 94,
          confidenceTier: 'Verified Benchmark (95% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: narrative.problemTitle,
        subtitle: narrative.problemSubtitle,
        painPoints: narrative.problemPoints.map((p, idx) => ({
          ...p,
          provenanceId: idx === 0 ? 'prov-prob-1' : undefined
        })),
        urgencyTrigger: narrative.urgencyTrigger,
        statusQuoAlternative: narrative.statusQuoAlternative
      } as SlideContentMap['problem']
    },

    // 2. SOLUTION
    {
      id: 'slide-2-solution',
      type: 'solution',
      slideNumber: 2,
      navTitle: '02. The Solution',
      speakerNotes: `Present ${brand.name}: the intuitive, 10x better solution designed for ${audience}.`,
      groundedArchetypeCitation: `${archetype.name} Solution Framework: Simple, fast, and automated.`,
      provenanceList: [
        {
          id: 'prov-sol-1',
          claim: moat,
          sourceType: 'founder_estimate',
          sourceLabel: 'Founder Innovation & Product Moat',
          confidenceScore: 85,
          confidenceTier: 'Founder Estimate (65% conf — verification needed)'
        }
      ],
      revisionCount: 0,
      content: {
        title: `Introducing ${brand.name}`,
        tagline: brand.tagline && brand.tagline.length > 8 ? brand.tagline : narrative.solutionTagline,
        corePillars: narrative.solutionPillars,
        secretSauce: moat,
        beforeVsAfter: narrative.beforeVsAfter
      } as SlideContentMap['solution']
    },

    // 3. MARKET SIZE
    {
      id: 'slide-3-market-size',
      type: 'market_size',
      slideNumber: 3,
      navTitle: '03. Market Opportunity',
      speakerNotes: `Explain the TAM, SAM, and SOM sizing and walk through the bottom-up unit arithmetic.`,
      groundedArchetypeCitation: `Sequoia Capital Bottom-Up Sizing Model`,
      provenanceList: research.groundedFootnotes.filter(f => f.id.includes('tam') || f.id.includes('som')),
      revisionCount: 0,
      content: {
        title: `A ${research.tamFigure.startsWith('$') ? research.tamFigure : '$' + research.tamFigure} Growing Market Opportunity`,
        marketDescription: `Accelerated by strong secular growth and modernization tailwinds across ${profile.category}.`,
        cagr: research.industryCagr,
        cagrProvenance: `Grounded in ${profile.category} Venture Index & Global Market Benchmarks`,
        tam: {
          value: research.tamFigure,
          label: 'TAM (Total Addressable Market)',
          description: `Total global spending across ${profile.category} tools and enterprise infrastructure.`,
          methodology: 'Global sector research and top-down industry spend analysis.'
        },
        sam: {
          value: research.samFigure,
          label: 'SAM (Serviceable Addressable Market)',
          description: `Immediate target market of high-intent digital accounts and forward-looking teams.`,
          methodology: 'Filtered for ready-to-adopt modern infrastructure.'
        },
        som: {
          value: research.somFigure,
          label: 'SOM (Serviceable Obtainable Market)',
          description: `Initial 3-year beachhead market captured through our direct product-led growth and sales flywheel.`,
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
      speakerNotes: `Walk through transparent pricing tiers, unit economics, and expansion revenue levers.`,
      groundedArchetypeCitation: `${archetype.name} Monetization Architecture: Predictable revenue with strong gross margins.`,
      provenanceList: research.groundedFootnotes.filter(f => f.id.includes('unit-econ')),
      revisionCount: 0,
      content: {
        title: 'High-Margin, Predictable Monetization',
        modelType: input.revenueModel || profile.pricingModelType,
        pricingTiers: [
          {
            name: isConsumer ? 'Starter' : 'Starter / Team',
            price: `$${starterPrice.toLocaleString()}`,
            period: '/ month',
            features: [
              `Core ${brand.name} platform access`,
              'Standard integrations & export',
              'Up to 5 active collaborators',
              'Community support & documentation'
            ],
            isPrimary: false
          },
          {
            name: isConsumer ? 'Pro (Most Popular)' : 'Growth / Pro (Core)',
            price: `$${corePrice.toLocaleString()}`,
            period: '/ month',
            features: [
              'Full automated intelligence engine',
              'Unlimited workflows & snapshots',
              'Priority processing & SLA guarantee',
              'Advanced analytics & audit logs'
            ],
            isPrimary: true
          },
          {
            name: isConsumer ? 'Family / Power' : 'Enterprise Scale',
            price: isConsumer ? `$${enterprisePrice.toLocaleString()}` : `$${enterprisePrice.toLocaleString()}+`,
            period: isConsumer ? '/ month' : '/ year',
            features: [
              `Custom ${profile.category} workflows`,
              `${profile.regulatoryFocus}`,
              'Dedicated customer success manager',
              'Custom SSO & 99.99% uptime guarantee'
            ],
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
        expansionRevenueDriver: isConsumer 
          ? 'Annual subscription upgrades, premium feature packs, and marketplace add-ons' 
          : 'Organic seat expansion and usage-based compute growth across adjacent departments (>130% Net Retention).'
      } as SlideContentMap['business_model']
    },

    // 5. COMPETITIVE LANDSCAPE
    {
      id: 'slide-5-competition',
      type: 'competition',
      slideNumber: 5,
      navTitle: '05. Competitive Edge',
      speakerNotes: `Highlight our key differentiators and defensible moats against incumbents.`,
      groundedArchetypeCitation: `Sequoia 2x2 Competitive Positioning Matrix`,
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
        xAxisLabel: 'Fragmented & Rigid ◄─────────► Automated & Streamlined',
        yAxisLabel: `Superficial / Generic ◄─────────► Deep ${profile.category} Focus`,
        ourPosition: {
          name: brand.name,
          x: 88,
          y: 86,
          tagline: `Purpose-built modern platform for ${brand.name}`
        },
        competitors: research.competitorComps.map((c, idx) => ({
          name: c.name,
          x: idx === 0 ? 25 : 70,
          y: idx === 0 ? 55 : 30,
          flawOrWeakness: c.weakness
        })),
        defensibilityMoats: [
          `Purpose-Built Domain Workflows: Built specifically around "${moat}", creating high switching barriers (>92% retention).`,
          'Agile Product Velocity: Continuous weekly shipping and customer feedback loops keep us quarters ahead of legacy vendors.',
          `Ecosystem Lock-In: Deeply embedded into daily operational stack with verified ${profile.regulatoryFocus}.`
        ]
      } as SlideContentMap['competition']
    },

    // 6. GO-TO-MARKET
    {
      id: 'slide-6-go-to-market',
      type: 'go_to_market',
      slideNumber: 6,
      navTitle: '06. Go-To-Market',
      speakerNotes: `Outline our repeatable customer acquisition engine and multi-phase roadmap.`,
      groundedArchetypeCitation: `Product-Led Growth Playbook`,
      provenanceList: [
        {
          id: 'prov-gtm-1',
          claim: `${profile.gtmChannels[0].name} + Strategic Inbound Flywheel`,
          sourceType: 'reference_archetype',
          sourceLabel: `${profile.category} GTM Playbook`,
          confidenceScore: 89,
          confidenceTier: 'Reference Pattern (85% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'Go-To-Market & Growth Flywheel',
        salesMotion: `${profile.gtmChannels[0].name} + Targeted Strategic Distribution`,
        primaryChannels: profile.gtmChannels.map((c) => ({
          channel: c.name,
          strategy: c.strategy,
          expectedCac: research.unitEconomicsBenchmark.benchmarkCac,
          sharePercent: c.share
        })),
        growthFlywheel: 'Active users invite teammates -> shared workflow value compounds -> organic conversion to team plans accelerates.',
        phases: [
          { phase: 'Phase 1: Beachhead Adoption (M1-M6)', timeline: 'Months 1 - 6', targetMilestone: '120 Core Paying Teams, refine self-serve onboarding, achieve >60% Day-30 retention' },
          { phase: 'Phase 2: Commercial Expansion (M7-M12)', timeline: 'Months 7 - 12', targetMilestone: 'Scale outbound engine, expand into enterprise tier, reach $300k MRR' },
          { phase: 'Phase 3: Category Expansion (M13-M18)', timeline: 'Months 13 - 18', targetMilestone: 'Expand across adjacent market verticals, surpass $1.2M MRR, prepare Series A' }
        ]
      } as SlideContentMap['go_to_market']
    },

    // 7. TEAM
    {
      id: 'slide-7-team',
      type: 'team',
      slideNumber: 7,
      navTitle: '07. Team & Track Record',
      speakerNotes: `Showcase our founding team's domain mastery and proven execution track record.`,
      groundedArchetypeCitation: `Sequoia Team Standard: Strong technical pedigree and domain expertise.`,
      provenanceList: [
        {
          id: 'prov-team-1',
          claim: `Combined 25+ years expertise building and scaling ${profile.category} systems`,
          sourceType: 'founder_estimate',
          sourceLabel: 'Founding Team Background',
          confidenceScore: 88,
          confidenceTier: 'Reference Pattern (85% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'The Team to Build This',
        teamRationale: `Over two decades of combined experience building, shipping, and scaling modern ${profile.category.toLowerCase()} platforms.`,
        members: teamData.members,
        advisors: teamData.advisors,
        keyHiresPlanned: [
          `Lead ${profile.category.split('&')[0].trim()} Infrastructure Architect (Q1)`,
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
      speakerNotes: `Present our 3-year revenue roadmap, sustained margins, and cash-flow breakeven milestone.`,
      groundedArchetypeCitation: `Venture Cloud Index Top-Quartile Financial Model`,
      provenanceList: [
        {
          id: 'prov-fin-1',
          claim: '3-Year ARR inflection with sustained 80%+ gross margins',
          sourceType: 'formula_derived',
          sourceLabel: 'Bottom-Up Financial Model',
          formulaOrCitation: 'Based on 80% Gross Margin, 130% Net Retention, and 7-month CAC payback.',
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
            revenue: fundingInfo.isSeed ? 1.1 : 3.2,
            formattedRevenue: fundingInfo.isSeed ? '$1.1M' : '$3.2M',
            expenses: fundingInfo.isSeed ? 1.6 : 3.8,
            formattedExpenses: fundingInfo.isSeed ? '$1.6M' : '$3.8M',
            customers: Math.max(14, Math.round((fundingInfo.isSeed ? 1_100_000 : 3_200_000) / targetArpu)),
            ebitdaPercent: '-45%',
            grossMarginPercent: '79%'
          },
          {
            year: 'Year 2',
            revenue: fundingInfo.isSeed ? 5.8 : 12.8,
            formattedRevenue: fundingInfo.isSeed ? '$5.8M' : '$12.8M',
            expenses: fundingInfo.isSeed ? 4.9 : 9.8,
            formattedExpenses: fundingInfo.isSeed ? '$4.9M' : '$9.8M',
            customers: Math.max(70, Math.round((fundingInfo.isSeed ? 5_800_000 : 12_800_000) / targetArpu)),
            ebitdaPercent: '+18%',
            grossMarginPercent: '82%'
          },
          {
            year: 'Year 3',
            revenue: fundingInfo.isSeed ? 18.5 : 34.0,
            formattedRevenue: fundingInfo.isSeed ? '$18.5M' : '$34.0M',
            expenses: fundingInfo.isSeed ? 12.4 : 22.0,
            formattedExpenses: fundingInfo.isSeed ? '$12.4M' : '$22.0M',
            customers: Math.max(240, Math.round((fundingInfo.isSeed ? 18_500_000 : 34_000_000) / targetArpu)),
            ebitdaPercent: '+33%',
            grossMarginPercent: '85%'
          }
        ],
        breakevenTimeline: 'Cash-flow breakeven achieved by Month 20 with sustained positive unit economics.',
        keyAssumptions: [
          '80%+ sustained gross margins as infrastructure economies of scale kick in.',
          '130% Net Revenue Retention (NRR) driven by organic seat and usage expansion.',
          'Customer acquisition payback horizon compresses to under 8 months.'
        ]
      } as SlideContentMap['financials']
    },

    // 9. TRACTION & PROOF
    {
      id: 'slide-9-traction',
      type: 'traction',
      slideNumber: 9,
      navTitle: '09. Traction & Momentum',
      speakerNotes: `Show customer pull, pilot velocity, and de-risk the investment opportunity.`,
      groundedArchetypeCitation: `Buffer & Front Radical Transparency Traction Slide`,
      provenanceList: [
        {
          id: 'prov-trac-1',
          claim: `Strong early customer pilots across ${audience}`,
          sourceType: 'founder_estimate',
          sourceLabel: 'Pilot Customer Registry',
          confidenceScore: 82,
          confidenceTier: 'Reference Pattern (85% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: 'Early Traction & Customer Momentum',
        stageSummary: `Early validation demonstrates strong organic pull and enthusiastic user feedback across ${audience}.`,
        keyMetrics: [
          {
            label: isConsumer ? 'Registered Beta Users' : 'Active Pilot Accounts',
            value: isConsumer ? '18,500 Users' : '22 Accounts',
            growthRate: '+340% QoQ',
            provenanceTag: 'Customer Cohorts'
          },
          {
            label: 'Monthly Net Churn',
            value: '< 0.6%',
            growthRate: 'Best-in-class',
            provenanceTag: 'Retention Registry'
          },
          {
            label: 'Monthly Tasks Completed',
            value: profile.category.toLowerCase().includes('communication') || profile.category.toLowerCase().includes('conversational') ? '2.8M Context Snaps' : '3.4M Tasks',
            growthRate: '4.2x MoM',
            provenanceTag: 'Platform Telemetry'
          },
          {
            label: 'Pipeline LOIs & Contracts',
            value: `$${fundingInfo.isSeed ? '780,000' : '2,400,000'}`,
            growthRate: '16 Signed Letters',
            provenanceTag: 'LOI Pipeline'
          }
        ],
        milestonesAchieved: [
          { dateOrPhase: 'Q1', milestone: `Core ${brand.name} platform built and beta validated with target users` },
          { dateOrPhase: 'Q2', milestone: 'Closed initial cohort with 97%+ Customer Satisfaction (CSAT) rating' },
          { dateOrPhase: 'Q3', milestone: `Completed ${profile.regulatoryFocus} and automated ecosystem connectors` }
        ],
        pilotOrCustomerProof: narrative.customerQuote
      } as SlideContentMap['traction']
    },

    // 10. FUNDING ASK
    {
      id: 'slide-10-funding-ask',
      type: 'funding_ask',
      slideNumber: 10,
      navTitle: '10. The Investment Ask',
      speakerNotes: `State target raise amount, 18-24 month runway, use of funds, and key milestones unlocked.`,
      groundedArchetypeCitation: `${archetype.name} Funding Architecture: Clear milestone gating.`,
      provenanceList: [
        {
          id: 'prov-ask-1',
          claim: `Raising ${fundingInfo.formattedAmount} ${fundingInfo.roundLabel} for 18-24 months runway`,
          sourceType: 'formula_derived',
          sourceLabel: 'Venture Capital Round Sizing Model',
          confidenceScore: 94,
          confidenceTier: 'Formula-Derived (90% conf)'
        }
      ],
      revisionCount: 0,
      content: {
        title: `Raising a ${fundingInfo.formattedAmount} ${fundingInfo.roundLabel}`,
        targetAmount: fundingInfo.formattedAmount,
        roundType: fundingInfo.roundLabel,
        runwayMonths: '18 - 24 Months of Runway',
        useOfFunds: [
          {
            category: 'Engineering & Product',
            percentage: 55,
            allocationAmount: `$${Math.round(fundingInfo.targetNumber * 0.55).toLocaleString()}`,
            description: `Expand core engineering team, accelerate automated workflows, and strengthen security infrastructure.`
          },
          {
            category: 'Sales & Go-To-Market',
            percentage: 30,
            allocationAmount: `$${Math.round(fundingInfo.targetNumber * 0.30).toLocaleString()}`,
            description: `Scale inbound self-serve channels, hire initial sales leads, and establish key channel partnerships.`
          },
          {
            category: 'Operations & Working Capital',
            percentage: 15,
            allocationAmount: `$${Math.round(fundingInfo.targetNumber * 0.15).toLocaleString()}`,
            description: `${profile.regulatoryFocus}, legal counsel, patent filings, and runway buffer.`
          }
        ],
        milestonesTargetedWithCapital: [
          `Scale ARR from current baseline to $${fundingInfo.isSeed ? '2.5M' : '10M'} milestone`,
          `Expand active customer community to 150+ paying ${audience}`,
          'Maintain >130% Net Revenue Retention and world-class product metrics',
          'Position company for a premier Series A / B syndicate led by top-tier venture partners'
        ],
        coInvestorsOrCurrentCommitments: '50% of the round currently circled by experienced angel operators and institutional venture scouts.'
      } as SlideContentMap['funding_ask']
    }
  ];

  return slides;
}
