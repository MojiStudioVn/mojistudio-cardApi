# mojistudio-card-api

Card Partner API Client - Thư viện hỗ trợ các chức năng đổi thẻ, kiểm tra seri, mua thẻ, và nạp topup

## Cài đặt

```bash
npm install mojistudio-card-api
```

## Khởi động nhanh

### 1. Tạo file cấu hình

Copy file `.env.example` thành `.env` và điền thông tin của bạn:

```bash
cp .env.example .env
```

## Cấu hình

### Cách 1: Dùng chung 1 domain cho tất cả (Khuyến nghị)

Nếu tất cả API dùng cùng một domain:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
```

### Cách 2: Dùng domain riêng cho từng chức năng

Nếu các chức năng dùng domain khác nhau:

````env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN_POST=http://card-exchange-api.com
DOMAIN_BUY=https://buy-card-api.comDOMAIN_TOPUP=http://topup-api.com```

Hoặc chỉ override một phần:

```env
PARTNER_KEY=your_partner_key_here
PARTNER_ID=your_partner_id_here
DOMAIN=http://api.example.com
DOMAIN_BUY=https://different-buy-api.com
````

### Các biến khác (Tùy chọn)

```env
# Timeout cho request (milliseconds)
REQUEST_TIMEOUT=30000

# Môi trường (development, production)
NODE_ENV=development

# Log level (error, warn, info, debug)
LOG_LEVEL=info
```

### 3. Sử dụng trong ứng dụng

```javascript
const { CardAPI, config } = require("mojistudio-card-api");

// Tự động đọc từ .env
const api = new CardAPI();

// Hoặc tạo instance mới với config tùy chỉnh
const api = new CardAPI({
  partnerKey: "your_key",
  partnerId: "your_id",
  domainPost: "http://your-domain.com",
});

// Sử dụng các API
async function example() {
  try {
    // Lấy danh sách sản phẩm
    const products = await api.getProductList();
    console.log(products);

    // Lấy số dư
    const balance = await api.getBalance();
    console.log(balance);

    // Kiểm tra seri thẻ
    const serial = await api.checkSerial({
      telco: "VIETTEL",
      serial: "20000203625855",
    });
    console.log(serial);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

example();
```

## API Methods

### ĐỔI THẺ (Card Exchange)

```javascript
// Gửi thẻ lên hệ thống
await api.submitCard({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "323233",
});

// Kiểm tra trạng thái thẻ
await api.checkCardStatus({
  telco: "VIETTEL",
  code: "312821445892982",
  serial: "10004783347874",
  amount: "50000",
  requestId: "323233",
});

// Lấy giá tẩy thẻ
await api.getCardPrices();
```

### KIỂM TRA SERI

```javascript
// Kiểm tra seri
await api.checkSerial({
  telco: "VIETTEL",
  serial: "20000203625855",
});
```

### MUA THẺ (Buy Card)

```javascript
// Mua thẻ cào
await api.buyCard({
  serviceCode: "Viettel",
  walletNumber: "0081083966",
  value: "10000",
  qty: "2",
  requestId: "113",
});

// Kiểm tra tồn kho
await api.checkCardAvailability({
  serviceCode: "Viettel",
  value: "10000",
  qty: "2",
});

// Tải lại thẻ
await api.redownloadCard({
  requestId: "113",
  orderCode: "S61797A53BCEEF",
});
```

### NẠP TOPUP

```javascript
// Tạo lệnh nạp
await api.createTopupOrder({
  serviceCode: "vinatt",
  amount: "10000",
  qty: "1",
  requestId: "116",
  accountInfo: { phone: "0943793984" },
});

// Lấy trạng thái nạp
await api.getTopupStatus({
  requestId: "116",
  orderCode: "R625931CC50F71",
});

// Lấy danh sách sản phẩm
await api.getProductList();

// Lấy số dư
await api.getBalance();
```

## Cấu hình nâng cao

### Tạo nhiều instance với domain khác nhau

```javascript
const { CardAPI } = require("mojistudio-card-api");

const apiCardExchange = new CardAPI({
  partnerKey: "key1",
  partnerId: "id1",
  domainPost: "http://card-exchange-api.com",
});

const apiTopup = new CardAPI({
  partnerKey: "key2",
  partnerId: "id2",
  domainPost: "http://topup-api.com",
});
```

### Xử lý lỗi

```javascript
try {
  const result = await api.submitCard({...});
} catch (error) {
  console.error('Status Code:', error.statusCode);
  console.error('Message:', error.message);
  console.error('Response:', error.response);
}
```

## Callback Handler

Để xử lý callback từ hệ thống, tạo một endpoint trên server của bạn:

```javascript
// Express example
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
  console.log("Message:", callback.message);

  res.json({ status: "success" });
});
```

## Biến môi trường

| BIẾN            | MỤC ĐÍCH                            | BẮTBUỘC | VÍ DỤ                  |
| --------------- | ----------------------------------- | ------- | ---------------------- |
| PARTNER_KEY     | Partner key từ nhà cung cấp         | ✅      | your_key_here          |
| PARTNER_ID      | Partner ID                          | ✅      | your_id_here           |
| DOMAIN          | Domain chung cho tất cả API         | ⚠️      | http://api.example.com |
| DOMAIN_POST     | Domain riêng cho ĐỔI THẺ            | ❌      | http://card-api.com    |
| DOMAIN_BUY      | Domain riêng cho MUA THẺ            | ❌      | https://buy-api.com    |
| DOMAIN_TOPUP    | Domain riêng cho NẠP TOPUP          | ❌      | http://topup-api.com   |
| REQUEST_TIMEOUT | Timeout (ms)                        | ❌      | 30000                  |
| NODE_ENV        | Môi trường (development/production) | ❌      | development            |
| LOG_LEVEL       | Log level                           | ❌      | info                   |

⚠️ = Cần ít nhất DOMAIN hoặc (DOMAIN_POST + DOMAIN_BUY + DOMAIN_TOPUP)

## Troubleshooting

### Lỗi signature không đúng

Kiểm tra thứ tự ghép các tham số:

- Card Exchange: `md5(partner_key + code + serial)`
- Buy Card: `md5(partner_key + partner_id + command + request_id)`
- Topup: `md5(partner_key + partner_id + command + request_id)`

### Request timeout

Tăng timeout trong file `.env`:

```env
REQUEST_TIMEOUT=30000
```

### Xác thực API không thành công

- Kiểm tra PARTNER_KEY và PARTNER_ID trong .env
- Kiểm tra IP whitelist với nhà cung cấp
- Kiểm tra format dữ liệu gửi

## License

MIT

## Support

Liên hệ: [Your Contact Info]
