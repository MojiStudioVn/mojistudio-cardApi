// Load .env if exists (optional)
try {
  require("dotenv").config();
} catch (e) {
  // .env is optional, continue without it
}

/**
 * Default configuration from environment variables
 * This is optional - you can pass config directly to CardAPI constructor
 */
const config = {
  // API Configuration
  partnerKey: process.env.PARTNER_KEY,
  partnerId: process.env.PARTNER_ID,

  // Domain - supports 2 modes:
  // 1. Single DOMAIN for all APIs
  // 2. Separate DOMAIN_POST, DOMAIN_BUY, DOMAIN_TOPUP
  domain: process.env.DOMAIN,
  domainPost: process.env.DOMAIN_POST || process.env.DOMAIN,
  domainBuy: process.env.DOMAIN_BUY || process.env.DOMAIN,
  domainTopup: process.env.DOMAIN_TOPUP || process.env.DOMAIN,

  // Request Configuration
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || "30000"),

  // Environment
  environment: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
};

module.exports = config;
