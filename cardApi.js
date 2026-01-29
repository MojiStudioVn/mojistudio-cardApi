const crypto = require("crypto");
const https = require("https");
const config = require("./config");

class CardAPI {
  /**
   * Constructor
   * @param {Object} options - Tùy chỉnh cấu hình
   */
  constructor(options = {}) {
    // Validate config từ .env
    try {
      config.validate();
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }

    // Override with custom options
    this.partnerKey = options.partnerKey || config.partnerKey;
    this.partnerId = options.partnerId || config.partnerId;
    this.domainPost = options.domainPost || config.domainPost;
    this.domainBuy = options.domainBuy || config.domainBuy;
    this.domainTopup = options.domainTopup || config.domainTopup;
    this.timeout = options.timeout || config.requestTimeout;
  }

  /**
   * Tính chữ ký MD5
   * @param {string} data - Dữ liệu cần mã hóa
   * @returns {string} - MD5 hash
   */
  generateSignature(data) {
    return crypto.createHash("md5").update(data).digest("hex");
  }

  /**
   * ĐỔI THẺ - Gửi thẻ lên hệ thống
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async submitCard(params) {
    const {
      telco,
      code,
      serial,
      amount,
      requestId,
      command = "charging",
    } = params;
    const sign = this.generateSignature(this.partnerKey + code + serial);

    const data = {
      telco,
      code,
      serial,
      amount,
      request_id: requestId,
      partner_id: this.partnerId,
      sign,
      command,
    };

    return this.makeRequest(`${this.domainPost}/chargingws/v2`, "POST", data);
  }

  /**
   * ĐỔI THẺ - Kiểm tra trạng thái thẻ
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async checkCardStatus(params) {
    const { telco, code, serial, amount, requestId } = params;
    const sign = this.generateSignature(this.partnerKey + code + serial);

    const data = {
      telco,
      code,
      serial,
      amount,
      request_id: requestId,
      partner_id: this.partnerId,
      sign,
      command: "check",
    };

    return this.makeRequest(`${this.domainPost}/chargingws/v2`, "POST", data);
  }

  /**
   * ĐỔI THẺ - Lấy giá tẩy thẻ
   * @returns {Promise}
   */
  async getCardPrices() {
    const url = `${this.domainPost}/chargingws/v2/getfee?partner_id=${this.partnerId}`;
    return this.makeRequest(url, "GET");
  }

  /**
   * KIỂM TRA SERI - Kiểm tra seri
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async checkSerial(params) {
    const { telco, serial } = params;
    const sign = this.generateSignature(this.partnerKey + serial);

    const url = `${this.domainPost}/api/checkcard?telco=${telco}&serial=${serial}&partner_id=${this.partnerId}&sign=${sign}`;
    return this.makeRequest(url, "POST");
  }

  /**
   * MUA THẺ - Mua thẻ cào
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async buyCard(params) {
    const { serviceCode, walletNumber, value, qty, requestId } = params;
    const sign = this.generateSignature(
      this.partnerKey + this.partnerId + "buycard" + requestId,
    );

    const url = `${this.domainBuy}/api/cardws?partner_id=${this.partnerId}&command=buycard&request_id=${requestId}&service_code=${serviceCode}&wallet_number=${walletNumber}&value=${value}&qty=${qty}&sign=${sign}`;

    return this.makeRequest(url, "POST");
  }

  /**
   * MUA THẺ - Kiểm tra tồn kho
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async checkCardAvailability(params) {
    const { serviceCode, value, qty } = params;

    const url = `${this.domainBuy}/api/cardws?partner_id=${this.partnerId}&command=checkavailable&service_code=${serviceCode}&value=${value}&qty=${qty}`;

    return this.makeRequest(url, "POST");
  }

  /**
   * MUA THẺ - Tải lại thẻ
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async redownloadCard(params) {
    const { requestId, orderCode } = params;
    const sign = this.generateSignature(
      this.partnerKey + this.partnerId + "redownload" + requestId,
    );

    const url = `${this.domainBuy}/api/cardws?partner_id=${this.partnerId}&command=redownload&request_id=${requestId}&order_code=${orderCode}&sign=${sign}`;

    return this.makeRequest(url, "POST");
  }

  /**
   * NẠP TOPUP - Tạo lệnh nạp
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async createTopupOrder(params) {
    const { serviceCode, amount, qty, requestId, accountInfo } = params;
    const sign = this.generateSignature(
      this.partnerKey + this.partnerId + "topup" + requestId,
    );

    const data = {
      partner_id: this.partnerId,
      command: "topup",
      request_id: requestId,
      service_code: serviceCode,
      amount,
      qty,
      account_info: accountInfo,
      sign,
    };

    return this.makeRequest(`${this.domainTopup}/api/rechargews`, "POST", data);
  }

  /**
   * NẠP TOPUP - Lấy trạng thái
   * @param {Object} params - Tham số
   * @returns {Promise}
   */
  async getTopupStatus(params) {
    const { requestId, orderCode } = params;
    const sign = this.generateSignature(
      this.partnerKey + this.partnerId + "getstatus" + requestId,
    );

    const data = {
      partner_id: this.partnerId,
      command: "getstatus",
      request_id: requestId,
      order_code: orderCode,
      sign,
    };

    return this.makeRequest(`${this.domainTopup}/api/rechargews`, "POST", data);
  }

  /**
   * NẠP TOPUP - Lấy danh sách sản phẩm
   * @returns {Promise}
   */
  async getProductList() {
    const sign = this.generateSignature(
      this.partnerKey + this.partnerId + "productlist",
    );

    const data = {
      partner_id: this.partnerId,
      command: "productlist",
      sign,
    };

    return this.makeRequest(`${this.domainTopup}/api/rechargews`, "POST", data);
  }

  /**
   * NẠP TOPUP - Lấy số dư
   * @returns {Promise}
   */
  async getBalance() {
    const sign = this.generateSignature(
      this.partnerKey + this.partnerId + "getbalance",
    );

    const data = {
      partner_id: this.partnerId,
      command: "getbalance",
      sign,
    };

    return this.makeRequest(`${this.domainTopup}/api/rechargews`, "POST", data);
  }

  /**
   * Gửi request HTTP
   * @param {string} url - URL endpoint
   * @param {string} method - HTTP method (GET, POST)
   * @param {Object} data - Dữ liệu gửi
   * @returns {Promise}
   */
  async makeRequest(url, method = "GET", data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      let requestUrl = url;
      let postData = null;

      if (method === "POST" && data) {
        postData = JSON.stringify(data);
        options.headers["Content-Length"] = Buffer.byteLength(postData);
      }

      try {
        const httpModule = url.startsWith("https")
          ? require("https")
          : require("http");

        const req = httpModule.request(url, options, (res) => {
          let responseData = "";

          res.on("data", (chunk) => {
            responseData += chunk;
          });

          res.on("end", () => {
            try {
              const jsonResponse = JSON.parse(responseData);
              resolve(jsonResponse);
            } catch (e) {
              resolve(responseData);
            }
          });
        });

        req.on("error", (error) => {
          reject(error);
        });

        if (postData) {
          req.write(postData);
        }

        req.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = CardAPI;
