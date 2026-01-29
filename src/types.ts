/**
 * Type definitions for Card API
 */

// ============================================
// CARD EXCHANGE (ĐỔI THẺ)
// ============================================

export interface SubmitCardParams {
  telco: "VIETTEL" | "VINAPHONE" | "MOBIFONE" | "ZING" | string;
  code: string;
  serial: string;
  amount: string;
  requestId: string;
  command?: string;
}

export interface CheckCardStatusParams {
  telco: string;
  code: string;
  serial: string;
  amount: string;
  requestId: string;
  command?: string;
}

export interface CardPricesParams {
  command?: string;
}

export interface CardPricesResponse {
  [key: string]: {
    [key: string]: number;
  };
}

// ============================================
// SERIAL CHECK (KIỂM TRA SERI)
// ============================================

export interface CheckSerialParams {
  telco: string;
  serial: string;
  command?: string;
}

// ============================================
// BUY CARD (MUA THẺ)
// ============================================

export interface BuyCardParams {
  serviceCode: string;
  walletNumber: string;
  value: string;
  qty: string;
  requestId: string;
  command?: string;
}

export interface CheckCardAvailabilityParams {
  serviceCode: string;
  value: string;
  qty: string;
  command?: string;
}

export interface RedownloadCardParams {
  requestId: string;
  orderCode: string;
  command?: string;
}

// ============================================
// TOPUP (NẠP TOPUP)
// ============================================

export interface CreateTopupOrderParams {
  serviceCode: string;
  amount: string;
  qty: string;
  requestId: string;
  accountInfo?: {
    phone?: string;
    [key: string]: any;
  };
  command?: string;
}

export interface GetTopupStatusParams {
  requestId: string;
  orderCode: string;
  command?: string;
}

export interface GetProductListParams {
  command?: string;
}

export interface GetBalanceParams {
  command?: string;
}

// ============================================
// API REQUEST/RESPONSE
// ============================================

export interface APIRequest {
  path: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  body?: string;
  signature?: string;
}

export interface APIResponse {
  status: number;
  data: any;
  error?: string;
}

// ============================================
// SIGNATURE
// ============================================

export interface SignatureParams {
  [key: string]: string | undefined;
}

// ============================================
// CARD API CONFIG
// ============================================

export interface CardAPIConfig {
  partnerKey: string;
  partnerId: string;
  domain?: string;
  domainPost?: string;
  domainBuy?: string;
  domainTopup?: string;
  timeout?: number;
}

export interface CardAPIRequestOptions {
  method?: "GET" | "POST";
  timeout?: number;
  headers?: Record<string, string>;
}
