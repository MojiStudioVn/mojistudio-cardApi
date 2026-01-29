require("dotenv").config();

/**
 * Cấu hình ứng dụng
 * Tự động đọc từ file .env
 */

const config = {
  // API Configuration
  partnerKey: process.env.PARTNER_KEY,
  partnerId: process.env.PARTNER_ID,

  // Domain - hỗ trợ 2 cách:
  // 1. Nếu chỉ có DOMAIN: dùng chung cho tất cả
  // 2. Nếu có DOMAIN_POST, DOMAIN_BUY: dùng riêng cho từng chức năng
  domain: process.env.DOMAIN,
  domainPost: process.env.DOMAIN_POST || process.env.DOMAIN,
  domainBuy: process.env.DOMAIN_BUY || process.env.DOMAIN,
  domainTopup: process.env.DOMAIN_TOPUP || process.env.DOMAIN,

  // Request Configuration
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || "30000"),

  // Environment
  environment: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",

  // Helper method để validate config
  validate() {
    const errors = [];

    if (!this.partnerKey) {
      errors.push("PARTNER_KEY không được để trống");
    }
    if (!this.partnerId) {
      errors.push("PARTNER_ID không được để trống");
    }
    if (!this.domain && !this.domainPost && !this.domainBuy) {
      errors.push("DOMAIN hoặc DOMAIN_POST/DOMAIN_BUY không được để trống");
    }

    if (errors.length > 0) {
      throw new Error(
        `Cấu hình không hợp lệ:\n${errors.join("\n")}\n\nVui lòng kiểm tra file .env`,
      );
    }

    return true;
  },

  // Helper method để display config (không hiển thị key)
  display() {
    return {
      environment: this.environment,
      partnerId: this.partnerId,
      domain: this.domain || "(không thiết lập)",
      domainPost: this.domainPost,
      domainBuy: this.domainBuy,
      domainTopup: this.domainTopup,
      requestTimeout: this.requestTimeout,
      logLevel: this.logLevel,
    };
  },
};

module.exports = config;
