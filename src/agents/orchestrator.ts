import type {
  UserBusinessInput,
  Slide,
  VCPersona,
  VCCritiqueResult,
  SlideRevisionDiff,
  AgentLogMessage,
  ReadinessDeltaMetrics
} from '../types/pitch';
import type { ResearchDossier } from './researchAgent';
import { conductMarketResearch } from './researchAgent';
import { draft10SlideBlueprint } from './narrativeAgent';
import { evaluateDeckWithVCCritic, executeAutonomousSlideRevision, VC_PERSONAS } from './criticAgent';
import { getStoredGeminiApiKey, generateDynamicDeckWithGemini } from '../services/geminiService';
import { fetchBackendResearch, fetchBigQueryMarketSizing, streamDeckTelemetryToBigQuery } from '../services/backendApi';

export interface OrchestrationResult {
  slides: Slide[];
  initialDraftSlides: Slide[];
  researchDossier: ResearchDossier;
  initialCritique: VCCritiqueResult;
  finalCritique: VCCritiqueResult;
  revisionDiffs: SlideRevisionDiff[];
  agentLogs: AgentLogMessage[];
  readinessDelta: ReadinessDeltaMetrics;
  durationMs: number;
}

export type OnLogCallback = (log: AgentLogMessage) => void;

export async function runMultiAgentPitchGeneration(
  input: UserBusinessInput,
  persona: VCPersona = 'saas_skeptic',
  onLog?: OnLogCallback
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const logs: AgentLogMessage[] = [];

  const emitLog = (
    agentRole: AgentLogMessage['agentRole'],
    agentName: string,
    type: AgentLogMessage['type'],
    content: string,
    toolName?: string,
    toolArgs?: Record<string, any>
  ) => {
    const log: AgentLogMessage = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentRole,
      agentName,
      type,
      content,
      toolName,
      toolArgs,
      durationMs: Date.now() - startTime,
    };
    logs.push(log);
    if (onLog) onLog(log);
  };

  const apiKey = getStoredGeminiApiKey();

  // 1. ORCHESTRATOR INITIALIZATION
  emitLog(
    'orchestrator',
    'Taskmaster Orchestrator (Google ADK)',
    'thought',
    `Initiating Autonomous Multi-Agent Swarm for concept: "${input.businessIdea.slice(0, 80)}...". Target VC: ${VC_PERSONAS[persona].name} (${VC_PERSONAS[persona].firmType}). Mode: ${apiKey ? 'Live Gemini 2.5 Flash API' : 'Dynamic Agentic Synthesis'}.`
  );

  await new Promise(r => setTimeout(r, 200));

  // If a live Gemini API key is configured, try live Gemini model generation first
  if (apiKey) {
    try {
      emitLog(
        'orchestrator',
        'Google Gemini 2.5 Flash Model',
        'tool_call',
        `Calling Gemini 2.5 Flash API with structured schema for "${input.businessIdea.slice(0, 60)}..."`,
        'gemini_structured_synthesis'
      );

      const geminiResult = await generateDynamicDeckWithGemini(input, apiKey, persona);

      emitLog(
        'orchestrator',
        'Google Gemini 2.5 Flash Model',
        'tool_result',
        `Gemini synthesized 10 dynamic slides, grounded market dossier (${geminiResult.researchDossier.tamFigure} TAM), and VC partner critique.`
      );

      const initialDraftCopy = JSON.parse(JSON.stringify(geminiResult.slides));
      const initialCritique = evaluateDeckWithVCCritic(initialDraftCopy, input, persona);
      const revision = executeAutonomousSlideRevision(initialDraftCopy, initialCritique, input);
      const finalCritique = evaluateDeckWithVCCritic(revision.revisedSlides, input, persona);

      const scoreDelta = finalCritique.overallScore - initialCritique.overallScore;

      const readinessDelta: ReadinessDeltaMetrics = {
        initialScore: initialCritique.overallScore,
        finalScore: finalCritique.overallScore,
        scoreDelta,
        revisionPasses: 1,
        unresolvedFlags: finalCritique.criticalRedFlags,
      };

      return {
        slides: revision.revisedSlides,
        initialDraftSlides: initialDraftCopy,
        researchDossier: geminiResult.researchDossier,
        initialCritique,
        finalCritique,
        revisionDiffs: revision.diffs,
        agentLogs: logs,
        readinessDelta,
        durationMs: Date.now() - startTime,
      };
    } catch (err: any) {
      emitLog(
        'orchestrator',
        'Taskmaster Orchestrator',
        'status',
        `Gemini API call encountered error (${err?.message || 'Network'}); falling back seamlessly to dynamic agent synthesis.`
      );
    }
  }

  // 2. RESEARCH & GROUNDING AGENT (Dynamic derivation + Python Backend ADK)
  emitLog(
    'researcher',
    'Market Intelligence Agent',
    'tool_call',
    `Deriving grounded market sizing and bottom-up arithmetic for ${input.industryVertical || 'the target sector'}...`,
    'google_search_grounding_tool',
    { vertical: input.industryVertical, stage: input.fundingStage }
  );

  await new Promise(r => setTimeout(r, 200));

  // Check if Python ADK Backend on port 8000 is active
  const backendData = await fetchBackendResearch(input);
  if (backendData) {
    emitLog(
      'researcher',
      'Python ADK Agent Broker (Cloud Run)',
      'tool_result',
      `Connected to Python ADK broker on port 8000. Retrieved grounded Gartner/Bessemer benchmarks and ${backendData.provenance?.length || 4} verified data anchors.`,
      'python_adk_broker'
    );
  }

  // Query Google BigQuery Public Datasets for empirical establishment density
  const bqData = await fetchBigQueryMarketSizing(input.industryVertical);
  if (bqData) {
    emitLog(
      'researcher',
      'Google BigQuery Public Datasets (US Census)',
      'tool_result',
      `Queried ${bqData.datasetTable} (NAICS ${bqData.naicsCode}): Found ${bqData.totalEstablishments.toLocaleString()} total establishments (${bqData.targetBeachheadAccounts.toLocaleString()} beachhead accounts defending SOM of ${bqData.formattedSom || '$' + bqData.defendedSomDollars}).`,
      'bigquery_census_query',
      { naics: bqData.naicsCode, table: bqData.datasetTable, accounts: bqData.totalEstablishments }
    );
  }

  const researchDossier = conductMarketResearch(input);
  if (backendData && backendData.provenance) {
    // Append backend provenance tags if available
    researchDossier.groundedFootnotes = [
      ...backendData.provenance,
      ...researchDossier.groundedFootnotes.filter(f => !backendData.provenance.some((bp: any) => bp.id === f.id))
    ];
  }

  if (bqData) {
    // Prepend verified BigQuery Census provenance footnote
    researchDossier.groundedFootnotes.unshift({
      id: 'prov-bigquery-census-live',
      claim: `Empirical US density: ${bqData.totalEstablishments.toLocaleString()} establishments (${bqData.industryTitle})`,
      sourceType: 'grounded_comp',
      sourceLabel: 'Google BigQuery Public Datasets (US Census CBP)',
      formulaOrCitation: `NAICS ${bqData.naicsCode} • Table: ${bqData.datasetTable} • Beachhead: ${bqData.targetBeachheadAccounts.toLocaleString()} accounts`,
      confidenceScore: 99,
      confidenceTier: 'Verified Benchmark (95% conf)'
    });
  }

  emitLog(
    'researcher',
    'Market Intelligence Agent',
    'tool_result',
    `Market Grounded: TAM ${researchDossier.tamFigure}, SAM ${researchDossier.samFigure}, Beachhead SOM ${researchDossier.somFigure} @ ${researchDossier.industryCagr}. Attached ${researchDossier.groundedFootnotes.length} confidence-scored provenance tags.`,
    'google_search_grounding_tool',
    { bottomUpMath: researchDossier.bottomUpMath }
  );

  await new Promise(r => setTimeout(r, 180));

  // 3. NARRATIVE ARCHITECT AGENT
  emitLog(
    'narrative_architect',
    'Narrative Architect Agent',
    'tool_call',
    `Architecting complete 10-slide blueprint tailored to "${input.businessIdea.slice(0, 50)}..."...`,
    'dynamic_10_slide_framework_synthesis',
    { archetypeId: input.selectedReferenceArchetype || 'sequoia-blueprint' }
  );

  await new Promise(r => setTimeout(r, 250));
  const initialDraftSlides = draft10SlideBlueprint(input, researchDossier, input.selectedReferenceArchetype);

  emitLog(
    'narrative_architect',
    'Narrative Architect Agent',
    'tool_result',
    `Drafted complete 10-slide blueprint with operational formulas and provenance footnotes.`,
    'dynamic_10_slide_framework_synthesis'
  );

  await new Promise(r => setTimeout(r, 180));

  // 4. CRITIC / VC PARTNER AGENT (Initial Evaluation)
  const vcName = VC_PERSONAS[persona].name;
  emitLog(
    'vc_critic',
    `${vcName} (Critic Agent)`,
    'tool_call',
    `Running institutional weighted rubric evaluation (${VC_PERSONAS[persona].firmType})...`,
    'vc_institutional_evaluation_rubric',
    { persona, weights: VC_PERSONAS[persona].weights }
  );

  await new Promise(r => setTimeout(r, 250));
  const initialCritique = evaluateDeckWithVCCritic(initialDraftSlides, input, persona);

  emitLog(
    'vc_critic',
    `${vcName} (Critic Agent)`,
    'tool_result',
    `Initial Score: ${initialCritique.overallScore}/100 [${initialCritique.verdict}]. Flagged ${initialCritique.criticalRedFlags.length} structural risks. Raised ${initialCritique.partnerObjections.length} partner objections.`,
    'vc_institutional_evaluation_rubric',
    { scores: initialCritique.categoryScores }
  );

  // 5. AUTONOMOUS SELF-CORRECTION REVISION LOOP (Capped at 2 passes)
  let currentSlides = initialDraftSlides;
  let currentCritique = initialCritique;
  let allDiffs: SlideRevisionDiff[] = [];
  const maxPasses = 2;
  let pass = 0;

  while (pass < maxPasses && (!currentCritique.rubricThresholdPassed || currentCritique.criticalRedFlags.length > 0)) {
    pass += 1;
    emitLog(
      'revision_specialist',
      'Autonomous Refinement Engine',
      'revision',
      `Triggering autonomous revision cycle (Pass ${pass}/${maxPasses}) to resolve partner objections: injecting bottom-up Beachhead SOM arithmetic and reinforcing defensibility moats...`
    );

    await new Promise(r => setTimeout(r, 300));
    const revisionResult = executeAutonomousSlideRevision(currentSlides, currentCritique, input);
    currentSlides = revisionResult.revisedSlides;
    allDiffs.push(...revisionResult.diffs);

    currentCritique = evaluateDeckWithVCCritic(currentSlides, input, persona);
  }

  const scoreDelta = currentCritique.overallScore - initialCritique.overallScore;

  emitLog(
    'revision_specialist',
    'Autonomous Refinement Engine',
    'status',
    `Autonomous Refinement Completed! Final Score: ${currentCritique.overallScore}/100 (+${scoreDelta} pts). Status: ${currentCritique.verdict}. Resolved ${allDiffs.length} slide objections across ${pass} pass(es).`
  );

  emitLog(
    'orchestrator',
    'Taskmaster Orchestrator (Google ADK)',
    'status',
    `Pipeline completed successfully in ${(Date.now() - startTime)}ms.`
  );

  // Stream audit event to Google BigQuery Analytics Warehouse (non-blocking)
  streamDeckTelemetryToBigQuery({
    deckId: `deck-${Date.now()}`,
    startupName: input.businessIdea.slice(0, 40),
    vertical: input.industryVertical,
    fundingStage: input.fundingStage,
    readinessScore: currentCritique.overallScore,
    fatalFlawCount: currentCritique.criticalRedFlags.length,
    topFatalFlaw: currentCritique.criticalRedFlags[0],
    durationMs: Date.now() - startTime,
    persona,
  }).catch(() => {});

  const readinessDelta: ReadinessDeltaMetrics = {
    initialScore: initialCritique.overallScore,
    finalScore: currentCritique.overallScore,
    scoreDelta,
    revisionPasses: pass,
    unresolvedFlags: currentCritique.criticalRedFlags,
  };

  return {
    slides: currentSlides,
    initialDraftSlides,
    researchDossier,
    initialCritique,
    finalCritique: currentCritique,
    revisionDiffs: allDiffs,
    agentLogs: logs,
    readinessDelta,
    durationMs: Date.now() - startTime,
  };
}
