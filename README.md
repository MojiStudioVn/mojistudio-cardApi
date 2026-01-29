# mojistudio-card-api v3

[![npm version](https://img.shields.io/npm/v/mojistudio-card-api.svg)](https://www.npmjs.com/package/mojistudio-card-api)
[![npm downloads](https://img.shields.io/npm/dm/mojistudio-card-api.svg)](https://www.npmjs.com/package/mojistudio-card-api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![license](https://img.shields.io/npm/l/mojistudio-card-api.svg)](https://github.com/MojiStudioVn/mojistudio-cardApi/blob/main/LICENSE)

**Pure TypeScript API client library** - Zero dependencies, type-safe, production-ready.

Thư viện hỗ trợ tích hợp API đổi thẻ cào, kiểm tra seri, mua thẻ, và nạp topup. Viết 100% TypeScript, không dependency, mọi function đều pure functions.

## ✨ Features

- 📘 **100% TypeScript** - Full type safety, IntelliSense
- 🚀 **Zero Dependencies** - No node_modules bloat (only Node.js built-in crypto)
- 🎯 **Pure Functions** - Request builders, no HTTP calls, no side effects
- 📦 **Tree-shakeable** - Import only what you need
- 💪 **Production Ready** - Fully tested, type-safe
- 🔐 **Secure** - Built-in MD5 signature generation
- 📚 **Well-documented** - JSDoc for every method

## 📦 Installation

```bash
npm install mojistudio-card-api
```

## 🚀 Quick Start

### Create API Client

```typescript
import { CardAPI } from "mojistudio-card-api";

// Create instance
const api = new CardAPI({
  partnerKey: "your_partner_key",
  partnerId: "your_partner_id",
  domain: "http://api.example.com", // or separate domains
});
```

### Build Requests (No HTTP calls!)

```typescript
// Build a card submission request
const request = api.buildSubmitCardRequest({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "REQ" + Date.now(),
});

// Returns:
// {
//   path: "/api/charging",
//   method: "POST",
//   headers: { "Content-Type": "application/x-www-form-urlencoded" },
//   body: "partner_id=xxx&telco=VIETTEL&code=...&signature=xxx",
//   signature: "xxx"
// }

// You handle the HTTP request yourself:
// - Use fetch, axios, node-fetch, whatever you prefer
// - Send to: domain + request.path
// - Include request headers
// - Send request.body as POST data
```

## 📖 Configuration

```typescript
const api = new CardAPI({
  partnerKey: "your_key", // Required
  partnerId: "your_id", // Required
  domain: "http://api.example.com", // Optional - common domain
  domainPost: "...", // Optional - Card Exchange only
  domainBuy: "...", // Optional - Buy Card only
  domainTopup: "...", // Optional - Topup only
  timeout: 30000, // Optional - default 30s
});
```

**Priority**: Specific domain > Common domain

```typescript
// Example: Use one domain, but override topup
const api = new CardAPI({
  domain: "http://api.example.com",
  domainTopup: "http://different-topup.com", // This takes priority
});
```

## 📚 API Methods

All methods return `APIRequest` object with:

- `path`: API endpoint path
- `method`: HTTP method (GET/POST)
- `headers`: Required headers
- `body`: Request body (for POST)
- `signature`: Calculated signature

### Card Exchange (ĐỔI THẺ)

```typescript
// Submit card for charging
const req1 = api.buildSubmitCardRequest({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "REQ001",
});

// Check card status
const req2 = api.buildCheckCardStatusRequest({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "REQ001",
});

// Get card prices
const req3 = api.buildGetCardPricesRequest();
```

### Serial Check (KIỂM TRA SERI)

```typescript
const request = api.buildCheckSerialRequest({
  telco: "VIETTEL",
  serial: "20000203625855",
});
```

### Buy Card (MUA THẺ)

```typescript
// Buy card
const req1 = api.buildBuyCardRequest({
  serviceCode: "Viettel",
  walletNumber: "0081083966",
  value: "10000",
  qty: "2",
  requestId: "BUY001",
});

// Check availability
const req2 = api.buildCheckCardAvailabilityRequest({
  serviceCode: "Viettel",
  value: "10000",
  qty: "2",
});

// Redownload card
const req3 = api.buildRedownloadCardRequest({
  requestId: "BUY001",
  orderCode: "S61797A53BCEEF",
});
```

### Topup (NẠP TOPUP)

```typescript
// Create topup order
const req1 = api.buildCreateTopupOrderRequest({
  serviceCode: "vinatt",
  amount: "10000",
  qty: "1",
  requestId: "TOP001",
  accountInfo: { phone: "0943793984" },
});

// Check topup status
const req2 = api.buildGetTopupStatusRequest({
  requestId: "TOP001",
  orderCode: "R625931CC50F71",
});

// Get product list
const req3 = api.buildGetProductListRequest();

// Get balance
const req4 = api.buildGetBalanceRequest();
```

## 🔧 Advanced Usage

### Multiple Instances

```typescript
// Different environments
const liveAPI = new CardAPI({
  partnerKey: "live_key",
  partnerId: "live_id",
  domain: "https://api.production.com",
});

const testAPI = new CardAPI({
  partnerKey: "test_key",
  partnerId: "test_id",
  domain: "https://api-test.staging.com",
});

// Different vendors
const vendor1 = new CardAPI({
  partnerKey: "vendor1_key",
  partnerId: "vendor1_id",
  domain: "https://vendor1-api.com",
});
```

### Using with HTTP Client

```typescript
import fetch from "node-fetch"; // or axios, http-client, etc.

const api = new CardAPI({
  partnerKey: "xxx",
  partnerId: "yyy",
  domain: "http://api.example.com",
});

// Build request
const req = api.buildSubmitCardRequest({
  telco: "VIETTEL",
  code: "xxx",
  serial: "xxx",
  amount: "50000",
  requestId: "REQ001",
});

// Send with fetch (or any HTTP client)
const response = await fetch(`${api.getDomain("post")}${req.path}`, {
  method: req.method,
  headers: req.headers,
  body: req.body,
  timeout: 30000,
});

const data = await response.json();
console.log(data);
```

### Utility Functions

```typescript
import {
  generateSignature,
  buildSignature,
  buildQueryString,
  buildURL,
} from "mojistudio-card-api";

// Generate MD5 signature
const sig = generateSignature("data_to_hash");

// Build signature from parameters
const sig2 = buildSignature(
  {
    partner_id: "xxx",
    telco: "VIETTEL",
    code: "xxx",
  },
  "partner_key",
);

// Build query string
const qs = buildQueryString({
  param1: "value1",
  param2: "value2",
});

// Build full URL
const url = buildURL("http://api.example.com", "/api/charging", {
  partner_id: "xxx",
});
```

## 🎯 Key Differences from v2

### v2 (Old)

```typescript
// Had HTTP calls built-in
const api = new CardAPI();
const result = await api.submitCard({...}); // Made HTTP request
```

### v3 (New)

```typescript
// Pure functions - you control HTTP
const api = new CardAPI({...});
const request = api.buildSubmitCardRequest({...}); // Returns request object
// You send the HTTP request yourself
```

### Benefits

- ✅ **Framework agnostic** - Use with fetch, axios, http-client, etc.
- ✅ **Better testing** - Mock at function level, no HTTP mocking needed
- ✅ **More control** - Implement your own retry logic, logging, etc.
- ✅ **Smaller package** - No HTTP client bloat
- ✅ **Type safety** - Full TypeScript support

## 🔒 Security

- All signatures calculated with MD5
- No external dependencies (only Node.js crypto)
- Parameters validated before building requests
- Configuration errors throw early

## 📝 Error Handling

```typescript
try {
  const request = api.buildSubmitCardRequest({
    // Missing required parameter
    telco: "VIETTEL",
    code: "xxx",
    // Missing: serial, amount, requestId
  });
} catch (error) {
  console.error(error.message);
  // "Missing required parameters: serial, amount, requestId"
}
```

## 🧪 Examples

See [examples](./examples.js) for complete usage examples.

## 📄 API Documentation

Full API documentation: [card-api.md](./card-api.md)

## 🤝 Support

- **GitHub Issues**: https://github.com/MojiStudioVn/mojistudio-cardApi/issues
- **Email**: lephambinh05@gmail.com
- **NPM**: https://www.npmjs.com/package/mojistudio-card-api

## 📝 License

MIT

---

Made with ❤️ by [MojiStudio](https://github.com/MojiStudioVn)

Tạo file `.env` trong project của bạn:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
```

Sau đó sử dụng:

```javascript
// Cài dotenv nếu chưa có
// npm install dotenv

require("dotenv").config();
const { CardAPI } = require("mojistudio-card-api");

// Tự động đọc từ .env
const api = new CardAPI();
```

### Cách 3: Kết hợp .env + override

```javascript
require("dotenv").config();
const { CardAPI } = require("mojistudio-card-api");

// Đọc .env nhưng override một số config
const api = new CardAPI({
  domainTopup: "http://different-topup-api.com", // Override topup domain
});
```

## ⚙️ Cấu hình

### ✨ Linh hoạt - 3 cách config

#### 1️⃣ Config trực tiếp - Không cần .env (Đơn giản nhất)

```javascript
const api = new CardAPI({
  partnerKey: "your_key",
  partnerId: "your_id",
  domain: "http://api.example.com", // Domain chung
});
```

#### 2️⃣ Domain riêng cho từng chức năng

```javascript
const api = new CardAPI({
  partnerKey: "your_key",
  partnerId: "your_id",
  domainPost: "http://card-exchange-api.com", // Đổi thẻ
  domainBuy: "https://buy-card-api.com", // Mua thẻ
  domainTopup: "http://topup-api.com", // Nạp topup
});
```

#### 3️⃣ Dùng .env (Optional)

Tạo `.env` trong project:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
```

```javascript
require("dotenv").config();
const api = new CardAPI(); // Auto load from .env
```

### 🎯 Scale với nhiều instances

```javascript
// API cho môi trường LIVE
const liveAPI = new CardAPI({
  partnerKey: "live_key",
  partnerId: "live_id",
  domain: "https://api.production.com",
});

// API cho môi trường TEST
const testAPI = new CardAPI({
  partnerKey: "test_key",
  partnerId: "test_id",
  domain: "https://api-test.staging.com",
});

// API riêng cho từng vendor
const vendor1API = new CardAPI({
  partnerKey: "vendor1_key",
  partnerId: "vendor1_id",
  domain: "https://vendor1-api.com",
});

const vendor2API = new CardAPI({
  partnerKey: "vendor2_key",
  partnerId: "vendor2_id",
  domain: "https://vendor2-api.com",
});

// Dùng song song
const [balance1, balance2] = await Promise.all([
  vendor1API.getBalance(),
  vendor2API.getBalance(),
]);
```

## 📖 API Methods

### 🎴 Đổi thẻ (Card Exchange)

```javascript
// Gửi thẻ cào lên hệ thống
const result = await api.submitCard({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "REQ" + Date.now(),
});

// Kiểm tra trạng thái thẻ đã gửi
const status = await api.checkCardStatus({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "323233",
});

// Lấy giá chiết khấu thẻ
const prices = await api.getCardPrices();
```

### ✅ Kiểm tra Seri

```javascript
// Kiểm tra seri thẻ có hợp lệ không
const serialCheck = await api.checkSerial({
  telco: "VIETTEL",
  serial: "20000203625855",
});
```

### 💳 Mua thẻ (Buy Card)

```javascript
// Mua thẻ cào điện thoại
const buyResult = await api.buyCard({
  serviceCode: "Viettel",
  walletNumber: "0081083966",
  value: "10000",
  qty: "2",
  requestId: "BUY" + Date.now(),
});

// Kiểm tra tồn kho thẻ
const availability = await api.checkCardAvailability({
  serviceCode: "Viettel",
  value: "10000",
  qty: "2",
});

// Tải lại thẻ nếu bị mất
const redownload = await api.redownloadCard({
  requestId: "113",
  orderCode: "S61797A53BCEEF",
});
```

### 📱 Nạp Topup

```javascript
// Tạo lệnh nạp tiền điện thoại
const topupOrder = await api.createTopupOrder({
  serviceCode: "vinatt",
  amount: "10000",
  qty: "1",
  requestId: "TOP" + Date.now(),
  accountInfo: { phone: "0943793984" },
});

// Kiểm tra trạng thái nạp
const topupStatus = await api.getTopupStatus({
  requestId: "116",
  orderCode: "R625931CC50F71",
});

// Lấy danh sách sản phẩm topup
const products = await api.getProductList();

// Kiểm tra số dư tài khoản
const balance = await api.getBalance();
```

## 🔧 Cấu hình nâng cao

### Tạo nhiều instance với config khác nhau

```javascript
const { CardAPI } = require("mojistudio-card-api");

// Instance cho đổi thẻ
const cardExchangeAPI = new CardAPI({
  partnerKey: "key1",
  partnerId: "id1",
  domainPost: "http://card-exchange-api.com",
});

// Instance cho mua thẻ
const buyCardAPI = new CardAPI({
  partnerKey: "key2",
  partnerId: "id2",
  domainBuy: "http://buy-api.com",
});

// Instance cho topup
const topupAPI = new CardAPI({
  partnerKey: "key3",
  partnerId: "id3",
  domainTopup: "http://topup-api.com",
});

// Sử dụng từng API riêng
await cardExchangeAPI.submitCard({...});
await buyCardAPI.buyCard({...});
await topupAPI.createTopupOrder({...});
```

### Config với timeout tùy chỉnh

```javascript
const api = new CardAPI({
  partnerKey: "your_key",
  partnerId: "your_id",
  domain: "http://api.example.com",
  timeout: 60000, // 60 seconds
});
```

### Xử lý lỗi

```javascript
try {
  const result = await api.submitCard({
    telco: "VIETTEL",
    code: "312821445892982",
    serial: "10004783347874",
    amount: "50000",
    requestId: "REQ" + Date.now(),
  });
  console.log("Success:", result);
} catch (error) {
  if (error.message.includes("Configuration Error")) {
    console.error("Config lỗi:", error.message);
    // Fix config và retry
  } else if (error.statusCode) {
    console.error("HTTP Error:", error.statusCode);
  } else {
    console.error("Error:", error.message);
  }

  if (error.response) {
    console.error("Response:", error.response);
  }
}
```

## 🔔 Callback Handler

Xử lý callback từ hệ thống bằng cách tạo endpoint trên server:

```javascript
const express = require("express");
const crypto = require("crypto");
const app = express();

app.use(express.json());

app.post("/callback/charge", (req, res) => {
  const callback = req.body;

  // Verify signature
  const sign = crypto
    .createHash("md5")
    .update(process.env.PARTNER_KEY + callback.code + callback.serial)
    .digest("hex");

  if (sign !== callback.callback_sign) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Xử lý callback
  console.log("Card status:", callback.status);
  console.log("Telco:", callback.telco);
  console.log("Amount:", callback.amount);
  console.log("Message:", callback.message);

  // Cập nhật database của bạn
  // ...

  res.json({ status: "received" });
});

app.listen(3000, () => console.log("Callback server running on port 3000"));
```

## 📋 Biến môi trường

| BIẾN            | MỤC ĐÍCH                           | BẮT BUỘC | VÍ DỤ                  |
| --------------- | ---------------------------------- | -------- | ---------------------- |
| PARTNER_KEY     | Partner key từ nhà cung cấp        | ✅       | your_key_here          |
| PARTNER_ID      | Partner ID                         | ✅       | your_id_here           |
| DOMAIN          | Domain chung cho tất cả API        | ⚠️       | http://api.example.com |
| DOMAIN_POST     | Domain riêng cho ĐỔI THẺ           | ❌       | http://card-api.com    |
| DOMAIN_BUY      | Domain riêng cho MUA THẺ           | ❌       | https://buy-api.com    |
| DOMAIN_TOPUP    | Domain riêng cho NẠP TOPUP         | ❌       | http://topup-api.com   |
| REQUEST_TIMEOUT | Timeout request (ms)               | ❌       | 30000                  |
| NODE_ENV        | Môi trường (dev/production)        | ❌       | production             |
| LOG_LEVEL       | Mức độ log (error/warn/info/debug) | ❌       | info                   |

⚠️ **Lưu ý**: Cần có ít nhất **DOMAIN** HOẶC **(DOMAIN_POST + DOMAIN_BUY + DOMAIN_TOPUP)**

## 🔧 Troubleshooting

### ❌ Lỗi: "Invalid signature"

Kiểm tra thứ tự ghép tham số khi tính MD5:

- **Card Exchange**: `md5(partner_key + code + serial)`
- **Buy Card**: `md5(partner_key + partner_id + command + request_id)`
- **Topup**: `md5(partner_key + partner_id + command + request_id)`

### ⏱️ Lỗi: Request timeout

Tăng timeout trong `.env`:

```env
REQUEST_TIMEOUT=60000  # 60 giây
```

### 🔑 Lỗi: Authentication failed

- ✅ Kiểm tra `PARTNER_KEY` và `PARTNER_ID` đúng chưa
- ✅ Xác nhận IP của server đã được whitelist
- ✅ Kiểm tra format dữ liệu gửi đi (telco, amount, serial phải đúng định dạng)

### 🌐 Lỗi: Domain not configured

Đảm bảo đã config đủ domain trong `.env`:

```env
# Cách 1: Dùng DOMAIN chung
DOMAIN=http://api.example.com

# HOẶC Cách 2: Domain riêng
DOMAIN_POST=http://card-api.com
DOMAIN_BUY=http://buy-api.com
DOMAIN_TOPUP=http://topup-api.com
```

## 📚 Tài liệu API đầy đủ

Xem file [card-api.md](./card-api.md) để biết chi tiết về tất cả các API endpoints, parameters, và response formats.

## 📝 License

MIT

## 🤝 Support

- **GitHub Issues**: [https://github.com/MojiStudioVn/mojistudio-cardApi/issues](https://github.com/MojiStudioVn/mojistudio-cardApi/issues)
- **Email**: lephambinh05@gmail.com
- **NPM**: [https://www.npmjs.com/package/mojistudio-card-api](https://www.npmjs.com/package/mojistudio-card-api)

---

Made with ❤️ by [MojiStudio](https://github.com/MojiStudioVn)
