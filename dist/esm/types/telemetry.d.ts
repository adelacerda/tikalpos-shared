import type { HighPrecisionTimestamp } from './loyalty';
export type TelemetrySeverity = 'INFO' | 'WARN' | 'CRITICAL';
export type TelemetryHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type TelemetryNetworkFailureKind = 'OK' | 'TIMEOUT' | 'OFFLINE' | '5XX' | '4XX' | 'TLS' | 'DNS';
export type TelemetryBatteryState = 'UNKNOWN' | 'UNPLUGGED' | 'CHARGING' | 'FULL';
export type TelemetryThermalState = 'NOMINAL' | 'FAIR' | 'SERIOUS' | 'CRITICAL';
export type TelemetryAnomalyKind = 'API_DEGRADED' | 'FRAME_DROP_BURST' | 'LOW_BATTERY' | 'THERMAL_THROTTLE' | 'MEMORY_PRESSURE';
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
export declare const TELEMETRY_BUFFER_CAPS: {
    readonly network: 200;
    readonly hardware: 60;
    readonly anomaly: 50;
};
export declare const TELEMETRY_FLUSH_INTERVAL_MS: number;
//# sourceMappingURL=telemetry.d.ts.map