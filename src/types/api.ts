// ──────────────────────────────────────────────
// API response envelopes & common utilities
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * JWT token payload for authenticated requests.
 */
export interface AuthTokenPayload {
  sub: string; // staff or system owner ID
  organizationId: string;
  locationId?: string;
  role: string;
  iat: number;
  exp: number;
}
