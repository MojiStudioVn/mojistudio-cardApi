/**
 * Card API Client - Pure TypeScript Implementation
 * No external dependencies (except crypto, which is Node.js built-in)
 * All functions are pure - they only accept parameters and return values
 */

import type {
  CardAPIConfig,
  SubmitCardParams,
  CheckCardStatusParams,
  CheckSerialParams,
  BuyCardParams,
  CheckCardAvailabilityParams,
  RedownloadCardParams,
  CreateTopupOrderParams,
  GetTopupStatusParams,
  GetProductListParams,
  GetBalanceParams,
  APIRequest,
} from "./types";

import { validateConfig, resolveDomain, defaultConfig } from "./config";
import { buildSignature, validateParams, formatParams, buildQueryString } from "./utils";

/**
 * Card API Client
 * Pure functions - no HTTP calls, no external state
 * All methods return request objects or formatted data
 */
export class CardAPI {
  private config: CardAPIConfig;

  /**
   * Create a new CardAPI instance
   * @param config Configuration object
   */
  constructor(config: CardAPIConfig) {
    // Merge with defaults
    this.config = { ...defaultConfig, ...config };

    // Validate configuration
    validateConfig(this.config);
  }

  /**
   * Get current configuration (safe - doesn't expose partnerKey)
   */
  getConfig(): Omit<CardAPIConfig, "partnerKey"> {
    const { partnerKey, ...safeConfig } = this.config;
    return safeConfig;
  }

  // ============================================
  // CARD EXCHANGE (ĐỔI THẺ)
  // ============================================

  /**
   * Build request for submitting a card
   */
  buildSubmitCardRequest(params: SubmitCardParams): APIRequest {
    validateParams(params, ["telco", "code", "serial", "amount", "requestId"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      telco: params.telco,
      code: params.code,
      serial: params.serial,
      amount: params.amount,
      request_id: params.requestId,
      command: params.command || "charging",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        telco: formatted.telco,
        code: formatted.code,
        serial: formatted.serial,
        amount: formatted.amount,
        request_id: formatted.request_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/charging",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for checking card status
   */
  buildCheckCardStatusRequest(params: CheckCardStatusParams): APIRequest {
    validateParams(params, ["telco", "code", "serial", "amount", "requestId"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      telco: params.telco,
      code: params.code,
      serial: params.serial,
      amount: params.amount,
      request_id: params.requestId,
      command: params.command || "getcharge",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        telco: formatted.telco,
        code: formatted.code,
        serial: formatted.serial,
        amount: formatted.amount,
        request_id: formatted.request_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/charging",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for getting card prices
   */
  buildGetCardPricesRequest(params: GetProductListParams = {}): APIRequest {
    const formatted = formatParams({
      partner_id: this.config.partnerId,
      command: params.command || "getmoney",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/charging",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  // ============================================
  // SERIAL CHECK (KIỂM TRA SERI)
  // ============================================

  /**
   * Build request for checking serial
   */
  buildCheckSerialRequest(params: CheckSerialParams): APIRequest {
    validateParams(params, ["telco", "serial"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      telco: params.telco,
      serial: params.serial,
      command: params.command || "checkseri",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        telco: formatted.telco,
        serial: formatted.serial,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/seri",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  // ============================================
  // BUY CARD (MUA THẺ)
  // ============================================

  /**
   * Build request for buying card
   */
  buildBuyCardRequest(params: BuyCardParams): APIRequest {
    validateParams(params, [
      "serviceCode",
      "walletNumber",
      "value",
      "qty",
      "requestId",
    ]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      service_code: params.serviceCode,
      wallet_number: params.walletNumber,
      value: params.value,
      qty: params.qty,
      request_id: params.requestId,
      command: params.command || "buycrad",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        service_code: formatted.service_code,
        wallet_number: formatted.wallet_number,
        value: formatted.value,
        qty: formatted.qty,
        request_id: formatted.request_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/card",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for checking card availability
   */
  buildCheckCardAvailabilityRequest(
    params: CheckCardAvailabilityParams,
  ): APIRequest {
    validateParams(params, ["serviceCode", "value", "qty"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      service_code: params.serviceCode,
      value: params.value,
      qty: params.qty,
      command: params.command || "checkbuy",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        service_code: formatted.service_code,
        value: formatted.value,
        qty: formatted.qty,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/card",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for redownloading card
   */
  buildRedownloadCardRequest(params: RedownloadCardParams): APIRequest {
    validateParams(params, ["requestId", "orderCode"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      request_id: params.requestId,
      order_code: params.orderCode,
      command: params.command || "redownload",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        request_id: formatted.request_id,
        order_code: formatted.order_code,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/card",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  // ============================================
  // TOPUP (NẠP TOPUP)
  // ============================================

  /**
   * Build request for creating topup order
   */
  buildCreateTopupOrderRequest(params: CreateTopupOrderParams): APIRequest {
    validateParams(params, ["serviceCode", "amount", "qty", "requestId"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      service_code: params.serviceCode,
      amount: params.amount,
      qty: params.qty,
      request_id: params.requestId,
      account_info: params.accountInfo,
      command: params.command || "topup",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        service_code: formatted.service_code,
        amount: formatted.amount,
        qty: formatted.qty,
        request_id: formatted.request_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for getting topup status
   */
  buildGetTopupStatusRequest(params: GetTopupStatusParams): APIRequest {
    validateParams(params, ["requestId", "orderCode"]);

    const formatted = formatParams({
      partner_id: this.config.partnerId,
      request_id: params.requestId,
      order_code: params.orderCode,
      command: params.command || "gettopup",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        request_id: formatted.request_id,
        order_code: formatted.order_code,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for getting product list
   */
  buildGetProductListRequest(params: GetProductListParams = {}): APIRequest {
    const formatted = formatParams({
      partner_id: this.config.partnerId,
      command: params.command || "getlist",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  /**
   * Build request for getting balance
   */
  buildGetBalanceRequest(params: GetBalanceParams = {}): APIRequest {
    const formatted = formatParams({
      partner_id: this.config.partnerId,
      command: params.command || "getbalance",
    });

    const signature = buildSignature(
      {
        partner_id: formatted.partner_id,
        command: formatted.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildQueryString({
        ...formatted,
        signature,
      }),
      signature,
    };
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get the appropriate domain for an operation
   */
  getDomain(operation: "post" | "buy" | "topup" = "post"): string {
    return resolveDomain(this.config, operation);
  }

  /**
   * Get all configured domains
   */
  getDomains(): {
    post: string;
    buy: string;
    topup: string;
  } {
    return {
      post: resolveDomain(this.config, "post"),
      buy: resolveDomain(this.config, "buy"),
      topup: resolveDomain(this.config, "topup"),
    };
  }
}

export default CardAPI;
