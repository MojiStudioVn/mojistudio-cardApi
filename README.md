# mojistudio-card-api

[![npm version](https://img.shields.io/npm/v/mojistudio-card-api.svg)](https://www.npmjs.com/package/mojistudio-card-api)
[![npm downloads](https://img.shields.io/npm/dm/mojistudio-card-api.svg)](https://www.npmjs.com/package/mojistudio-card-api)
[![license](https://img.shields.io/npm/l/mojistudio-card-api.svg)](https://github.com/MojiStudioVn/mojistudio-cardApi/blob/main/LICENSE)

Card Partner API Client - Thư viện Node.js hỗ trợ tích hợp API đổi thẻ cào, kiểm tra seri, mua thẻ, và nạp topup.

## ✨ Tính năng

- ✅ **Đổi thẻ cào**: Gửi thẻ, kiểm tra trạng thái, nhận callback
- ✅ **Kiểm tra seri**: Xác thực tính hợp lệ của seri thẻ
- ✅ **Mua thẻ**: Mua thẻ cào, kiểm tra tồn kho, tải lại thẻ
- ✅ **Nạp topup**: Tạo lệnh nạp, lấy trạng thái, quản lý sản phẩm
- ✅ **Tự động tính chữ ký MD5**
- ✅ **Hỗ trợ cấu hình linh hoạt qua .env**
- ✅ **TypeScript ready**

## 📦 Cài đặt

```bash
npm install mojistudio-card-api
```

## 🚀 Khởi động nhanh

### 1. Tạo file `.env`

```bash
# Sao chép template
cp node_modules/mojistudio-card-api/.env.example .env
```

Hoặc tạo file `.env` mới:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
```

### 2. Sử dụng trong code

```javascript
const { CardAPI } = require("mojistudio-card-api");

// Tự động đọc từ .env
const api = new CardAPI();

// Sử dụng API
async function main() {
  try {
    // Lấy số dư
    const balance = await api.getBalance();
    console.log("Số dư:", balance);

    // Kiểm tra seri thẻ
    const result = await api.checkSerial({
      telco: "VIETTEL",
      serial: "20000203625855",
    });
    console.log("Kết quả:", result);
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
}

main();
```

## ⚙️ Cấu hình

### Cách 1: Domain chung (Đơn giản nhất)

Sử dụng 1 domain cho tất cả các API:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
```

### Cách 2: Domain riêng cho từng chức năng

Nếu mỗi chức năng sử dụng domain khác nhau:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN_POST=http://card-exchange-api.com
DOMAIN_BUY=https://buy-card-api.com
DOMAIN_TOPUP=http://topup-api.com
```

### Cách 3: Override một phần

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
DOMAIN_TOPUP=http://different-topup-api.com  # Chỉ override Topup
```

### Cấu hình nâng cao (Tùy chọn)

```env
REQUEST_TIMEOUT=30000       # Timeout (ms)
NODE_ENV=production         # Môi trường
LOG_LEVEL=info             # Log level
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
  if (error.statusCode) {
    console.error("HTTP Error:", error.statusCode);
  }
  console.error("Message:", error.message);
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

| BIẾN            | MỤC ĐÍCH                          | BẮT BUỘC | VÍ DỤ                  |
| --------------- | --------------------------------- | -------- | ---------------------- |
| PARTNER_KEY     | Partner key từ nhà cung cấp       | ✅       | your_key_here          |
| PARTNER_ID      | Partner ID                        | ✅       | your_id_here           |
| DOMAIN          | Domain chung cho tất cả API       | ⚠️       | http://api.example.com |
| DOMAIN_POST     | Domain riêng cho ĐỔI THẺ         | ❌       | http://card-api.com    |
| DOMAIN_BUY      | Domain riêng cho MUA THẺ          | ❌       | https://buy-api.com    |
| DOMAIN_TOPUP    | Domain riêng cho NẠP TOPUP        | ❌       | http://topup-api.com   |
| REQUEST_TIMEOUT | Timeout request (ms)              | ❌       | 30000                  |
| NODE_ENV        | Môi trường (dev/production)       | ❌       | production             |
| LOG_LEVEL       | Mức độ log (error/warn/info/debug)| ❌       | info                   |

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
