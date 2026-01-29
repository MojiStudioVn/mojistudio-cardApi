/**
 * Configuration
 */

import type { CardAPIConfig } from "./types";

export const defaultConfig: CardAPIConfig = {
  partnerKey: "",
  partnerId: "",
  timeout: 30000,
};

/**
 * Validate configuration
 * @param config Configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateConfig(config: CardAPIConfig): void {
  const errors: string[] = [];

  if (!config.partnerKey) {
    errors.push("partnerKey is required");
  }

  if (!config.partnerId) {
    errors.push("partnerId is required");
  }

  const hasDomain =
    config.domain ||
    config.domainPost ||
    config.domainBuy ||
    config.domainTopup;

  if (!hasDomain) {
    errors.push(
      "At least one domain must be configured (domain, domainPost, domainBuy, or domainTopup)",
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `CardAPI Configuration Error:\n  - ${errors.join("\n  - ")}`,
    );
  }
}

/**
 * Resolve domain for specific operation
 * @param config Configuration
 * @param operation Operation type
 * @returns Domain for operation
 */
export function resolveDomain(
  config: CardAPIConfig,
  operation: "post" | "buy" | "topup" = "post",
): string {
  switch (operation) {
    case "post":
      return config.domainPost || config.domain || "";
    case "buy":
      return config.domainBuy || config.domain || "";
    case "topup":
      return config.domainTopup || config.domain || "";
    default:
      return config.domain || "";
  }
}
