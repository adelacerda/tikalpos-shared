import type { HighPrecisionTimestamp } from './loyalty';

// FT-CORE-003 — Terminal Telemetry Pipeline.
//
// LIMITS (intentional, executive-approved 2026-05-27):
//   1. Client pre-aggregates p50/p05/p95 — raw per-sample series is NOT shipped
//      to backend. Historical re-analysis on raw samples is impossible.
//   2. Buffer caps: 200 network / 60 hardware / 50 anomaly per 5-min window.
//      Overflow is silent; cardinality is surfaced as `bufferDroppedCount`.
//   3. No client-side retry. Failed POST → that window is lost. Order/payment
//      sync always wins the radio.
//   4. Backend retention: windows 30d / endpoint stats 14d / anomalies 90d.
//
// Shipping these limits is the deal: a Droplet of $4/mo cannot absorb a raw
// sample firehose. This contract is the cap.

export type TelemetrySeverity = 'INFO' | 'WARN' | 'CRITICAL';

export type TelemetryHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type TelemetryNetworkFailureKind =
  | 'OK'
  | 'TIMEOUT'
  | 'OFFLINE'
  | '5XX'
  | '4XX'
  | 'TLS'
  | 'DNS';

export type TelemetryBatteryState =
  | 'UNKNOWN'
  | 'UNPLUGGED'
  | 'CHARGING'
  | 'FULL';

export type TelemetryThermalState =
  | 'NOMINAL'
  | 'FAIR'
  | 'SERIOUS'
  | 'CRITICAL';

export type TelemetryAnomalyKind =
  | 'API_DEGRADED'
  | 'FRAME_DROP_BURST'
  | 'LOW_BATTERY'
  | 'THERMAL_THROTTLE'
  | 'MEMORY_PRESSURE';

export interface NetworkMetric {
  endpoint: string;
  method: TelemetryHttpMethod;
  latencyMs: number;
  status: number;
  payloadBytes: number | null;
  failureKind: TelemetryNetworkFailureKind;
  observedAt: HighPrecisionTimestamp;
}

export interface HardwareMetric {
  fpsP50: number;
  fpsP05: number;
  droppedFrames: number;
  jsHeapUsedMb: number | null;
  nativeMemRssMb: number | null;
  batteryLevel: number;
  batteryState: TelemetryBatteryState;
  thermalState: TelemetryThermalState;
  observedAt: HighPrecisionTimestamp;
}

export interface TelemetryAnomaly {
  kind: TelemetryAnomalyKind;
  severity: TelemetrySeverity;
  detail: string;
  observedAt: HighPrecisionTimestamp;
}

export interface TelemetryPayload {
  schemaVersion: 1;
  deviceId: string;
  locationId: string;
  organizationId: string;
  appVersion: string;
  osVersion: string;
  windowStart: HighPrecisionTimestamp;
  windowEnd: HighPrecisionTimestamp;
  network: NetworkMetric[];
  hardware: HardwareMetric[];
  anomalies: TelemetryAnomaly[];
  bufferDroppedCount: number;
}

export interface TelemetryIngestResult {
  windowId: string;
  deduplicated: boolean;
}

export const TELEMETRY_BUFFER_CAPS = {
  network: 200,
  hardware: 60,
  anomaly: 50,
} as const;

export const TELEMETRY_FLUSH_INTERVAL_MS = 5 * 60 * 1000;
