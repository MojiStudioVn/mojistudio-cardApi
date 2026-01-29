/**
 * Utility functions for API operations
 */

import * as crypto from "crypto";
import { stringify } from "querystring";
import type { SignatureParams } from "./types";

/**
 * Generate MD5 signature
 * @param data String to hash
 * @returns MD5 hash
 */
export function generateSignature(data: string): string {
  return crypto.createHash("md5").update(data).digest("hex");
}

/**
 * Build signature for API request
 * @param params Parameters to include in signature
 * @param partnerKey Partner key for signature
 * @returns MD5 signature
 */
export function buildSignature(
  params: SignatureParams,
  partnerKey: string,
): string {
  const sortedKeys = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .sort();

  const signatureString = sortedKeys.map((key) => params[key]).join("");

  return generateSignature(partnerKey + signatureString);
}

/**
 * Build query string from parameters
 * @param params Object containing parameters
 * @returns Query string
 */
export function buildQueryString(params: Record<string, any>): string {
  return stringify(params);
}

/**
 * Parse URL and extract domain
 * @param url Full URL
 * @returns Domain
 */
export function parseDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    return url;
  }
}

/**
 * Build full URL with path and query
 * @param domain Base domain
 * @param path API path
 * @param query Query parameters
 * @returns Full URL
 */
export function buildURL(
  domain: string,
  path: string,
  query?: Record<string, any>,
): string {
  const cleanDomain = domain.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!query || Object.keys(query).length === 0) {
    return `${cleanDomain}${cleanPath}`;
  }

  const queryString = buildQueryString(query);
  return `${cleanDomain}${cleanPath}?${queryString}`;
}

/**
 * Validate required parameters
 * @param params Parameters to validate
 * @param required Required parameter names
 * @throws Error if required parameters are missing
 */
export function validateParams(params: any, required: string[]): void {
  const missing = required.filter((key) => !params[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(", ")}`);
  }
}

/**
 * Format parameters for API request
 * @param params Input parameters
 * @returns Formatted parameters
 */
export function formatParams(params: Record<string, any>): Record<string, any> {
  const formatted: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      formatted[key] =
        typeof value === "object" ? JSON.stringify(value) : String(value);
    }
  }

  return formatted;
}

/**
 * Merge configurations with defaults
 * @param base Base configuration
 * @param override Override values
 * @returns Merged configuration
 */
export function mergeConfig<T extends Record<string, any>>(
  base: T,
  override?: Partial<T>,
): T {
  return {
    ...base,
    ...(override || {}),
  };
}

/**
 * Deep copy object
 * @param obj Object to copy
 * @returns Deep copied object
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
