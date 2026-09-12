import type { UserBusinessInput } from '../types/pitch';

export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8000';

export interface BackendHealthResponse {
  status: string;
  service: string;
  adk_version: string;
  model: string;
  grounding_tool: string;
  has_genai_sdk?: boolean;
  has_env_key?: boolean;
  port?: number;
  server_time?: number;
}

/**
 * Check if the Python FastAPI backend (running locally or on Cloud Run) is accessible.
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as BackendHealthResponse;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Request grounded research benchmarks and provenance from the Python ADK backend.
 */
export async function fetchBackendResearch(input: UserBusinessInput): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${BACKEND_URL}/api/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessIdea: input.businessIdea,
        targetAudience: input.targetAudience,
        industryVertical: input.industryVertical,
        fundingStage: input.fundingStage,
        revenueModel: input.revenueModel,
        uspOrMoat: input.uspOrMoat || '',
        selectedReferenceArchetype: input.selectedReferenceArchetype || 'sequoia-blueprint',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn('Backend research lookup failed, using client fallback:', err);
    return null;
  }
}

export interface BigQueryMarketSizingResult {
  status: string;
  dataSource: string;
  datasetTable: string;
  naicsCode: string;
  industryTitle: string;
  totalEstablishments: number;
  targetBeachheadAccounts: number;
  annualAcv: number;
  defendedSomDollars: number;
  formattedSom?: string;
  sampleQuery?: string;
  provenanceTier: string;
}

export interface BigQueryTelemetryPayload {
  deckId: string;
  startupName: string;
  vertical: string;
  fundingStage: string;
  readinessScore: number;
  fatalFlawCount: number;
  topFatalFlaw?: string;
  durationMs?: number;
  persona?: string;
}

/**
 * Fetch empirical target establishment density and defended bottom-up sizing via BigQuery Census datasets.
 */
export async function fetchBigQueryMarketSizing(vertical: string): Promise<BigQueryMarketSizingResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${BACKEND_URL}/api/bigquery/market-sizing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industryVertical: vertical }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as BigQueryMarketSizingResult;
    }
    return null;
  } catch (err) {
    console.warn('BigQuery market sizing lookup failed, using client fallback:', err);
    return null;
  }
}

/**
 * Stream pitch deck audit telemetry into BigQuery analytics warehouse.
 */
export async function streamDeckTelemetryToBigQuery(payload: BigQueryTelemetryPayload): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/bigquery/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch macro venture audit statistics from BigQuery warehouse.
 */
export async function fetchBigQueryWarehouseStats(): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/bigquery/stats`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}
