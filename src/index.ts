/**
 * Entry point - Export all public APIs
 */

export { CardAPI, default } from "./cardApi";
export type {
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
  APIResponse,
} from "./types";

export {
  generateSignature,
  buildSignature,
  buildQueryString,
  buildURL,
} from "./utils";
export { validateConfig, resolveDomain, defaultConfig } from "./config";
