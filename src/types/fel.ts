// ──────────────────────────────────────────────
// FEL (Sistema Fiscal Guatemala)
// ──────────────────────────────────────────────

export interface NitLookupResult {
  nit: string;
  name: string;
  address?: string;
  status: 'active' | 'inactive' | 'not_found';
}

export interface FelEmissionRequest {
  nit: string;
  amount: number;
  currency: string;
  date: Date;
}

export interface FelEmissionResponse {
  success: boolean;
  uuid?: string;
  serie?: string;
  numero?: string;
  error?: string;
}

export interface FelVoidRequest {
  uuid: string;
  reason: string;
}

export interface FelVoidResponse {
  success: boolean;
  error?: string;
}

export interface IFelProvider {
  lookupNit(nit: string): Promise<NitLookupResult>;
  emitInvoice(request: FelEmissionRequest): Promise<FelEmissionResponse>;
  voidInvoice(request: FelVoidRequest): Promise<FelVoidResponse>;
}

export interface FELInvoiceData {
  nit: string;
  amount: number;
  currency: string;
  date: Date;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface CertificateInfo {
  subject: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
}

export interface SignedXmlResult {
  xml: string;
  signature: string;
}
