/**
 * Card API Client - Pure OOP TypeScript Implementation
 * Each request type is a class with constructor - easy to instantiate and reuse
 */

import type {
  CardAPIConfig as ICardAPIConfig,
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
 * Base configuration class
 */
export class CardAPIConfig {
  readonly partnerKey: string;
  readonly partnerId: string;
  readonly domainPost: string;
  readonly domainBuy: string;
  readonly domainTopup: string;
  readonly timeout: number;

  constructor(config: ICardAPIConfig) {
    this.partnerKey = config.partnerKey;
    this.partnerId = config.partnerId;
    this.timeout = config.timeout || 30000;

    validateConfig(config);

    const domain = config.domain || "";
    this.domainPost = config.domainPost || domain;
    this.domainBuy = config.domainBuy || domain;
    this.domainTopup = config.domainTopup || domain;
  }

  getDomain(operation: "post" | "buy" | "topup"): string {
    switch (operation) {
      case "post":
        return this.domainPost;
      case "buy":
        return this.domainBuy;
      case "topup":
        return this.domainTopup;
      default:
        return this.domainPost;
    }
  }
}

/**
 * Base Request class
 */
abstract class BaseRequest {
  protected config: CardAPIConfig;
  protected params: Record<string, any>;

  constructor(config: CardAPIConfig, params: Record<string, any>) {
    this.config = config;
    this.params = params;
  }

  protected buildBody(data: Record<string, any>): string {
    return buildQueryString(data);
  }

  abstract getRequest(): APIRequest;
}

// ============================================
// CARD EXCHANGE (ĐỔI THẺ) - REQUEST CLASSES
// ============================================

/**
 * Submit Card Request
 * Usage: new SubmitCardRequest(config, params).getRequest()
 */
export class SubmitCardRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: SubmitCardParams) {
    validateParams(params, ["telco", "code", "serial", "amount", "requestId"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      telco: params.telco,
      code: params.code,
      serial: params.serial,
      amount: params.amount,
      request_id: params.requestId,
      command: params.command || "charging",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        telco: this.params.telco,
        code: this.params.code,
        serial: this.params.serial,
        amount: this.params.amount,
        request_id: this.params.request_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/charging",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Check Card Status Request
 * Usage: new CheckCardStatusRequest(config, params).getRequest()
 */
export class CheckCardStatusRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: CheckCardStatusParams) {
    validateParams(params, ["telco", "code", "serial", "amount", "requestId"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      telco: params.telco,
      code: params.code,
      serial: params.serial,
      amount: params.amount,
      request_id: params.requestId,
      command: params.command || "getcharge",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        telco: this.params.telco,
        code: this.params.code,
        serial: this.params.serial,
        amount: this.params.amount,
        request_id: this.params.request_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/charging",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Get Card Prices Request
 * Usage: new GetCardPricesRequest(config).getRequest()
 */
export class GetCardPricesRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params?: GetProductListParams) {
    const formatted = formatParams({
      partner_id: config.partnerId,
      command: params?.command || "getmoney",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/charging",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

// ============================================
// SERIAL CHECK (KIỂM TRA SERI) - REQUEST CLASS
// ============================================

/**
 * Check Serial Request
 * Usage: new CheckSerialRequest(config, params).getRequest()
 */
export class CheckSerialRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: CheckSerialParams) {
    validateParams(params, ["telco", "serial"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      telco: params.telco,
      serial: params.serial,
      command: params.command || "checkseri",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        telco: this.params.telco,
        serial: this.params.serial,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/seri",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

// ============================================
// BUY CARD (MUA THẺ) - REQUEST CLASSES
// ============================================

/**
 * Buy Card Request
 * Usage: new BuyCardRequest(config, params).getRequest()
 */
export class BuyCardRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: BuyCardParams) {
    validateParams(params, [
      "serviceCode",
      "walletNumber",
      "value",
      "qty",
      "requestId",
    ]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      service_code: params.serviceCode,
      wallet_number: params.walletNumber,
      value: params.value,
      qty: params.qty,
      request_id: params.requestId,
      command: params.command || "buycrad",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        service_code: this.params.service_code,
        wallet_number: this.params.wallet_number,
        value: this.params.value,
        qty: this.params.qty,
        request_id: this.params.request_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/card",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Check Card Availability Request
 * Usage: new CheckCardAvailabilityRequest(config, params).getRequest()
 */
export class CheckCardAvailabilityRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: CheckCardAvailabilityParams) {
    validateParams(params, ["serviceCode", "value", "qty"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      service_code: params.serviceCode,
      value: params.value,
      qty: params.qty,
      command: params.command || "checkbuy",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        service_code: this.params.service_code,
        value: this.params.value,
        qty: this.params.qty,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/card",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Redownload Card Request
 * Usage: new RedownloadCardRequest(config, params).getRequest()
 */
export class RedownloadCardRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: RedownloadCardParams) {
    validateParams(params, ["requestId", "orderCode"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      request_id: params.requestId,
      order_code: params.orderCode,
      command: params.command || "redownload",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        request_id: this.params.request_id,
        order_code: this.params.order_code,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/card",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

// ============================================
// TOPUP (NẠP TOPUP) - REQUEST CLASSES
// ============================================

/**
 * Create Topup Order Request
 * Usage: new CreateTopupOrderRequest(config, params).getRequest()
 */
export class CreateTopupOrderRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: CreateTopupOrderParams) {
    validateParams(params, ["serviceCode", "amount", "qty", "requestId"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      service_code: params.serviceCode,
      amount: params.amount,
      qty: params.qty,
      request_id: params.requestId,
      account_info: params.accountInfo,
      command: params.command || "topup",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        service_code: this.params.service_code,
        amount: this.params.amount,
        qty: this.params.qty,
        request_id: this.params.request_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Get Topup Status Request
 * Usage: new GetTopupStatusRequest(config, params).getRequest()
 */
export class GetTopupStatusRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params: GetTopupStatusParams) {
    validateParams(params, ["requestId", "orderCode"]);

    const formatted = formatParams({
      partner_id: config.partnerId,
      request_id: params.requestId,
      order_code: params.orderCode,
      command: params.command || "gettopup",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        request_id: this.params.request_id,
        order_code: this.params.order_code,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Get Product List Request
 * Usage: new GetProductListRequest(config).getRequest()
 */
export class GetProductListRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params?: GetProductListParams) {
    const formatted = formatParams({
      partner_id: config.partnerId,
      command: params?.command || "getlist",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

/**
 * Get Balance Request
 * Usage: new GetBalanceRequest(config).getRequest()
 */
export class GetBalanceRequest extends BaseRequest {
  constructor(config: CardAPIConfig, params?: GetBalanceParams) {
    const formatted = formatParams({
      partner_id: config.partnerId,
      command: params?.command || "getbalance",
    });

    super(config, formatted);
  }

  getRequest(): APIRequest {
    const signature = buildSignature(
      {
        partner_id: this.params.partner_id,
        command: this.params.command,
      },
      this.config.partnerKey,
    );

    return {
      path: "/api/topup",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.buildBody({
        ...this.params,
        signature,
      }),
      signature,
    };
  }
}

export default CardAPIConfig;
