# Card Partner API Documentation

## Mục lục

- [ĐỔI THẺ (Card Exchange)](#đổi-thẻ)
- [KIỂM TRA SERI (Serial Check)](#kiểm-tra-seri)
- [MUA THẺ (Buy Card)](#mua-thẻ)
- [NẠP TOPUP](#nạp-topup)

---

## ĐỔI THẺ

Api dành cho đối tác bán thẻ cào cho hệ thống

### 1. Gửi thẻ lên hệ thống

**Endpoint:** `POST` `http://{{domain_post}}/chargingws/v2`

**Mô tả:** Gửi thẻ cào lên hệ thống để xử lý

**Headers:**

```
Content-Type: application/json
```

**Body Parameters:**

| Tham số    | Giá trị                          | Mô tả      |
| ---------- | -------------------------------- | ---------- |
| telco      | MOBIFONE, VIETTEL, VINAPHONE     | Nhà mạng   |
| code       | 664196324427                     | Mã thẻ     |
| serial     | 089801001443088                  | Số seri    |
| amount     | 50000                            | Mệnh giá   |
| request_id | 32323333                         | ID yêu cầu |
| partner_id | 8740404061                       | ID đối tác |
| sign       | md5(partner_key + code + serial) | Chữ ký     |
| command    | charging                         | Lệnh       |

**Chữ ký:** `md5(partner_key + code + serial)`

**Mã lỗi:**

| Code | Ý nghĩa                                             |
| ---- | --------------------------------------------------- |
| 1    | Thẻ thành công đúng mệnh giá                        |
| 2    | Thẻ thành công sai mệnh giá                         |
| 3    | Thẻ lỗi                                             |
| 4    | Hệ thống bảo trì                                    |
| 99   | Thẻ chờ xử lý                                       |
| 100  | Gửi thẻ thất bại - Có lý do đi kèm ở phần thông báo |

**Example Request:**

```bash
curl --location -g 'http://{{domain_post}}/chargingws/v2' \
--header 'Content-Type: application/json' \
--form 'telco="VIETTEL"' \
--form 'code="312821445892982"' \
--form 'serial="10004783347874"' \
--form 'amount="50000"' \
--form 'request_id="323233"' \
--form 'partner_id="3681148751"' \
--form 'sign="19db4f1670100764069dba47429a9d94"' \
--form 'command="charging"'
```

**Example Response:**

```json
{
  "trans_id": 8,
  "request_id": "323233",
  "amount": 35000,
  "value": null,
  "declared_value": 50000,
  "telco": "VIETTEL",
  "serial": "10004783347874",
  "code": "312821445892982",
  "status": 99,
  "message": "PENDING"
}
```

---

### 2. Kiểm tra trạng thái thẻ

**Endpoint:** `POST/GET` `http://{{domain_post}}/chargingws/v2`

**Mô tả:** Kiểm tra trạng thái xử lý của thẻ. Hỗ trợ cả phương thức GET và POST

**Headers:**

```
Content-Type: application/json
```

**Body/Query Parameters:**

| Tham số    | Giá trị                          | Mô tả      |
| ---------- | -------------------------------- | ---------- |
| telco      | VIETTEL                          | Nhà mạng   |
| code       | 312821445892982                  | Mã thẻ     |
| serial     | 10004783347874                   | Số seri    |
| amount     | 50000                            | Mệnh giá   |
| request_id | 323233                           | ID yêu cầu |
| partner_id | 3681148751                       | ID đối tác |
| sign       | md5(partner_key + code + serial) | Chữ ký     |
| command    | check                            | Lệnh       |

**Chữ ký:** `md5(partner_key + code + serial)`

**Example Request:**

```bash
curl --location -g 'http://{{domain_post}}/chargingws/v2' \
--header 'Content-Type: application/json' \
--form 'telco="VIETTEL"' \
--form 'code="312821445892982"' \
--form 'serial="10004783347874"' \
--form 'amount="50000"' \
--form 'request_id="323233"' \
--form 'partner_id="3681148751"' \
--form 'sign="19db4f1670100764069dba47429a9d94"' \
--form 'command="check"'
```

**Example Response:**

```json
{
  "trans_id": 8,
  "request_id": "323233",
  "status": 99,
  "message": "PENDING",
  "telco": "VIETTEL",
  "code": "312821445892982",
  "serial": "10004783347874",
  "declared_value": 50000,
  "value": null,
  "amount": 35000
}
```

---

### 3. Callback - POST JSON

**Endpoint:** `POST` `http://yourdomain.com/charge/callback`

**Mô tả:** Nhận callback kết quả xử lý thẻ từ chúng tôi bằng phương thức POST. Hệ thống gửi dữ liệu dưới dạng JSON

**Request Method:** POST JSON

**Chữ ký:** `callback_sign = md5(partner_key + code + serial)`

**Callback Body (JSON):**

| Tham số        | Mô tả                     |
| -------------- | ------------------------- |
| status         | Trạng thái giao dịch      |
| message        | Thông báo kết quả         |
| request_id     | ID yêu cầu                |
| declared_value | Mệnh giá khai báo         |
| value          | Mệnh giá tính tiền        |
| amount         | Số tiền nhận được         |
| code           | Mã thẻ                    |
| serial         | Số seri                   |
| telco          | Nhà mạng                  |
| trans_id       | Mã giao dịch bên hệ thống |
| callback_sign  | Chữ ký bảo vệ             |

**Example Callback:**

```bash
curl --location 'http://yourdomain.com/charge/callback' \
--header 'Content-Type: application/json' \
--data '{
  "status": 1,
  "message": "Thành công",
  "request_id": "989876",
  "declared_value": 50000,
  "value": 50000,
  "amount": 25000,
  "code": "314688440422676",
  "serial": "10003395125761",
  "telco": "VIETTEL",
  "trans_id": 54180,
  "callback_sign": "17b118fe86852c52ea126c9537617f6d"
}'
```

**Callback Payload:**

```json
{
  "status": 1,
  "message": "Thành công",
  "request_id": "989876",
  "declared_value": 50000,
  "value": 50000,
  "amount": 25000,
  "code": "314688440422676",
  "serial": "10003395125761",
  "telco": "VIETTEL",
  "trans_id": 54180,
  "callback_sign": "17b118fe86852c52ea126c9537617f6d"
}
```

---

### 4. Callback - GET

**Endpoint:** `GET` `http://yourdomain.com/charge/callback`

**Mô tả:** Nhận callback kết quả xử lý thẻ từ chúng tôi bằng phương thức GET

**Chữ ký:** `callback_sign = md5(partner_key + code + serial)`

**Query Parameters:**

| Tham số        | Mô tả                      |
| -------------- | -------------------------- |
| status         | Trạng thái giao dịch       |
| message        | Thông báo kết quả          |
| request_id     | ID yêu cầu                 |
| declared_value | Mệnh giá khai báo          |
| card_value     | Mệnh giá thực của thẻ      |
| value          | Mệnh giá tính tiền         |
| amount         | Số tiền nhận được          |
| code           | Mã thẻ                     |
| serial         | Số seri                    |
| telco          | Nhà mạng                   |
| trans_id       | Mã giao dịch bên chúng tôi |
| callback_sign  | Chữ ký bảo vệ              |

**Example Callback:**

```bash
curl --location 'http://yourdomain.com/charge/callback?status=1&message=Thành%20công&request_id=989876&declared_value=50000&card_value=50000&value=50000&amount=25000&code=314688440422676&serial=10003395125761&telco=VIETTEL&trans_id=343424&callback_sign=17b118fe86852c52ea126c9537617f6d'
```

**Example Callback URL:**

```
http://yourdomain.com/charge/callback?status=1&message=Thành công&request_id=989876&declared_value=50000&card_value=50000&value=50000&amount=25000&code=314688440422676&serial=10003395125761&telco=VIETTEL&trans_id=343424&callback_sign=17b118fe86852c52ea126c9537617f6d
```

---

---

### 5. Lấy giá tẩy thẻ

**Endpoint:** `GET` `http://{{domain_post}}/chargingws/v2/getfee`

**Mô tả:** Lấy thông tin giá và phí đổi thẻ cho các mệnh giá khác nhau

**Query Parameters:**

| Tham số    | Mô tả      | Ví dụ      |
| ---------- | ---------- | ---------- |
| partner_id | ID đối tác | 0299338261 |

**Example Request:**

```bash
curl --location -g 'http://{{domain_post}}/chargingws/v2/getfee?partner_id=0299338261'
```

**Example Response:**

```json
{
  "VIETTEL": [
    {
      "telco": "VIETTEL",
      "value": 10000,
      "fees": 30,
      "penalty": 20
    },
    {
      "telco": "VIETTEL",
      "value": 20000,
      "fees": 30,
      "penalty": 20
    },
    {
      "telco": "VIETTEL",
      "value": 50000,
      "fees": 30,
      "penalty": 20
    },
    {
      "telco": "VIETTEL",
      "value": 100000,
      "fees": 30,
      "penalty": 20
    }
  ],
  "VINAPHONE": [],
  "MOBIFONE": [],
  "GATE": [],
  "ZING": []
}
```

---

## KIỂM TRA SERI

Api dành cho đối tác kiểm tra seri thẻ cào

### 1. Kiểm tra seri

**Endpoint:** `POST` `http://{{domain_post}}/api/checkcard`

**Mô tả:** Kiểm tra tính hợp lệ của seri thẻ cào

**Query/Body Parameters:**

| Tham số    | Mô tả      | Ví dụ                            |
| ---------- | ---------- | -------------------------------- |
| telco      | Nhà mạng   | VIETTEL                          |
| serial     | Số seri    | 20000203625855                   |
| partner_id | ID đối tác | 44492838431                      |
| sign       | Chữ ký     | 77453e6def6c29d40fa6e2536f31c552 |

**Chữ ký:** `md5(partner_key + serial)` - Ghép liền 2 dữ liệu

**Example Request:**

```bash
curl --location --request POST 'http://{{domain_post}}/api/checkcard?telco=VIETTEL&serial=20000203625855&partner_id=44492838431&sign=77453e6def6c29d40fa6e2536f31c552'
```

---

## MUA THẺ

API dành cho đối tác mua thẻ cào từ hệ thống

### 1. Mua thẻ cào

**Endpoint:** `POST` `https://tenmien.com/api/cardws`

**Mô tả:** Mua thẻ cào từ hệ thống

**Request Method:** POST (hỗ trợ JSON, URL_ENCODE, FORM_PARAMS)

**Chữ ký:** `md5(partner_key + partner_id + command + request_id)` - Ghép liền các dữ liệu

> **Lưu ý:** Các dữ liệu được ghép liền nhau. Đối với các hàm không có request_id (như check available, get balance), sử dụng giá trị rỗng ""

> **Bảo mật:** Dữ liệu thẻ trả về không được mã hóa. Khuyến cáo sử dụng SSL cho website của bạn để bảo vệ thẻ khi truyền qua internet

> **Thay đổi domain:** Thay `tenmien.com` thành tên miền bạn đang muốn đấu nối

**Query/Body Parameters:**

| Tham số       | Mô tả              | Ví dụ      |
| ------------- | ------------------ | ---------- |
| partner_id    | ID đối tác         | 0299338261 |
| command       | Lệnh               | buycard    |
| request_id    | ID yêu cầu của bạn | 113        |
| service_code  | Mã dịch vụ         | Viettel    |
| wallet_number | Số ví điện tử      | 0081083966 |
| value         | Mệnh giá thẻ       | 10000      |
| qty           | Số lượng           | 2          |
| sign          | Chữ ký             | md5(...)   |

**Mã lỗi:**

| Code | Ý nghĩa                                                                  |
| ---- | ------------------------------------------------------------------------ |
| 1    | Mua thẻ thành công                                                       |
| 2    | Thanh toán thành công. Lấy thẻ thất bại, vui lòng redownload sau ít phút |
| 100  | Sản phẩm không tồn tại                                                   |
| 101  | Ví điện tử không tồn tại                                                 |
| 102  | Số dư ví không đủ                                                        |
| 103  | Không có dữ liệu gửi lên                                                 |
| 104  | Dữ liệu gửi lên không đúng                                               |
| 105  | Sản phẩm không đúng                                                      |
| 106  | Loại thẻ đang ngừng cung cấp                                             |
| 107  | Lỗi mua hàng, bạn chưa bị trừ tiền                                       |
| 108  | Không tồn tại tài khoản merchant                                         |
| 109  | Mã yêu cầu request_id đã tồn tại                                         |
| 110  | Yêu cầu không hợp lệ                                                     |
| 111  | Địa chỉ ví không tồn tại                                                 |
| 112  | Địa chỉ ví không hoạt động                                               |
| 113  | Tài khoản bị khóa                                                        |
| 114  | Merchant sai IP đăng ký                                                  |
| 115  | Merchant không hoạt động                                                 |
| 116  | Sai chữ ký                                                               |
| 117  | Yêu cầu không đúng. Thiếu tham số command                                |
| 118  | Sản phẩm nay đã hết                                                      |
| 119  | Địa chỉ IP không được quyền truy cập                                     |
| 120  | Lỗi Exception                                                            |
| 121  | Thanh toán thất bại                                                      |
| 122  | Không mua được hàng                                                      |
| 123  | Giá sản phẩm không đúng                                                  |
| 124  | Đơn hàng thất bại vì bị giới hạn                                         |
| 125  | Số lượng không hợp lệ                                                    |
| 126  | Số lượng phải là số nguyên dương                                         |

**Example Request:**

```bash
curl --location --request POST 'https://tenmien.com/api/cardws?partner_id=0299338261&command=buycard&request_id=113&service_code=Viettel&wallet_number=0081083966&value=10000&qty=2&sign=ourfyhwoeu234ouyh324o23h4'
```

**Example Response (Error):**

```json
{
  "status": 114,
  "message": "Merchant sai IP dang ky",
  "data": false
}
```

---

### 2. Kiểm tra tồn kho

**Endpoint:** `POST` `https://tenmien.com/api/cardws`

**Mô tả:** Kiểm tra tính sẵn có của thẻ cào trong kho

**Query/Body Parameters:**

| Tham số      | Mô tả        | Ví dụ          |
| ------------ | ------------ | -------------- |
| partner_id   | ID đối tác   | 0299338261     |
| command      | Lệnh         | checkavailable |
| service_code | Mã dịch vụ   | Viettel        |
| value        | Mệnh giá thẻ | 10000          |
| qty          | Số lượng     | 2              |

**Example Request:**

```bash
curl --location --request POST 'https://tenmien.com/api/cardws?partner_id=0299338261&command=checkavailable&service_code=Viettel&value=10000&qty=2'
```

**Example Response:**

```json
{
  "stock_available": false,
  "message": "Hết hàng"
}
```

---

### 3. Tải lại thẻ

**Endpoint:** `POST` `https://tenmien.com/api/cardws`

**Mô tả:** Tải lại thẻ theo mã đơn hàng. Hàm này không phát sinh giao dịch mới

**Query/Body Parameters:**

| Tham số    | Mô tả       | Ví dụ                     |
| ---------- | ----------- | ------------------------- |
| partner_id | ID đối tác  | 0299338261                |
| command    | Lệnh        | redownload                |
| request_id | ID yêu cầu  | 113                       |
| order_code | Mã đơn hàng | S61797A53BCEEF            |
| sign       | Chữ ký      | idsgh2i34gdlsfdskfgdfjkfd |

**Chữ ký:** `md5(partner_key + partner_id + command + request_id)` - Ghép liền các dữ liệu

**Example Request:**

```bash
curl --location --request POST 'https://tenmien.com/api/cardws?partner_id=0299338261&command=redownload&request_id=113&order_code=S61797A53BCEEF&sign=idsgh2i34gdlsfdskfgdfjkfd'
```

---

## NẠP TOPUP

### 1. Lấy số dư

**Endpoint:** `POST` `https://tenmien.com/api/cardws`

**Mô tả:** Lấy số dư hiện tại của ví điện tử

**Query/Body Parameters:**

| Tham số       | Mô tả         | Ví dụ                      |
| ------------- | ------------- | -------------------------- |
| partner_id    | ID đối tác    | 0299338261                 |
| wallet_number | Số ví điện tử | 0081083966                 |
| command       | Lệnh          | getbalance                 |
| sign          | Chữ ký        | 2342364dghr234fhfdsdsfsdfd |

**Chữ ký:** `md5(partner_key + partner_id + command + "")` - Ghép liền các dữ liệu, request_id để rỗng

> **Lưu ý:** Hàm này không có request_id, nên sử dụng giá trị rỗng "" khi tính chữ ký

**Example Request:**

```bash
curl --location --request POST 'https://tenmien.com/api/cardws?partner_id=0299338261&wallet_number=0081083966&command=getbalance&sign=2342364dghr234fhfdsdsfsdfd'
```

---

### 1. Tạo lệnh nạp

**Endpoint:** `POST` `http://{{domain_post}}/api/rechargews`

**Mô tả:** Tạo lệnh nạp tiền/topup cho tài khoản điện thoại

**Request Method:** POST JSON

**Chữ ký:** `md5(partner_key + partner_id + command + request_id)` - Ghép liền các dữ liệu

> **Lưu ý:** `privateKey` được cung cấp bởi chúng tôi khi tạo tài khoản API

> **Hỗ trợ:** Nếu gặp khó khăn trong tích hợp, vui lòng liên hệ Skype: **wmt24h**

**Body Parameters (JSON):**

| Tham số      | Mô tả                        | Ví dụ                  |
| ------------ | ---------------------------- | ---------------------- |
| partner_id   | ID đối tác                   | 3681148751             |
| command      | Lệnh                         | topup                  |
| request_id   | ID yêu cầu                   | 116                    |
| service_code | Mã dịch vụ                   | vinatt                 |
| amount       | Số tiền                      | 10000                  |
| qty          | Số lượng                     | 1                      |
| account_info | Thông tin tài khoản (object) | {"phone":"0943793984"} |
| sign         | Chữ ký                       | md5(...)               |

**Example Request:**

```bash
curl --location 'http://{{domain_post}}/api/rechargews' \
--header 'Content-Type: application/json' \
--data '{
    "partner_id": "3681148751",
    "command": "topup",
    "request_id": "116",
    "service_code": "vinatt",
    "amount": "10000",
    "qty": "1",
    "account_info": {
        "phone": "0943793984"
    },
    "sign": "43567456546dfs3246"
}'
```

---

### 2. Lấy trạng thái

**Endpoint:** `POST` `http://{{domain_post}}/api/rechargews`

**Mô tả:** Lấy trạng thái của lệnh nạp theo mã đơn hàng. Hàm này không phát sinh giao dịch mới

**Request Method:** POST JSON

**Chữ ký:** `md5(partner_key + partner_id + command + request_id)` - Ghép liền các dữ liệu

**Body Parameters (JSON):**

| Tham số    | Mô tả       | Ví dụ                       |
| ---------- | ----------- | --------------------------- |
| partner_id | ID đối tác  | 3681148751                  |
| command    | Lệnh        | getstatus                   |
| request_id | ID yêu cầu  | 116                         |
| order_code | Mã đơn hàng | R625931CC50F71              |
| sign       | Chữ ký      | 43567456546dfs32465asdkg123 |

**Example Request:**

```bash
curl --location 'http://{{domain_post}}/api/rechargews' \
--header 'Content-Type: application/json' \
--data '{
    "partner_id": "3681148751",
    "command": "getstatus",
    "request_id": "116",
    "order_code": "R625931CC50F71",
    "sign": "43567456546dfs32465asdkg123"
}'
```

---

### 2. Lấy danh sách thẻ

**Endpoint:** `GET` `https://tenmien.com/api/cardws/products`

**Mô tả:** Lấy danh sách các sản phẩm thẻ cào có sẵn

**Query Parameters:**

| Tham số    | Mô tả      | Ví dụ      |
| ---------- | ---------- | ---------- |
| partner_id | ID đối tác | 6322520361 |

**Example Request:**

```bash
curl --location 'https://tenmien.com/api/cardws/products?partner_id=6322520361'
```

---

### 3. Lấy danh sách sản phẩm

**Endpoint:** `POST` `http://{{domain_post}}/api/rechargews`

**Mô tả:** Lấy tất cả thông tin về sản phẩm nạp tiền mà chúng tôi đang bán

**Request Method:** POST JSON

**Chữ ký:** `md5(partner_key + partner_id + command)` - Ghép liền các dữ liệu (không có request_id)

**Body Parameters (JSON):**

| Tham số    | Mô tả      | Ví dụ                       |
| ---------- | ---------- | --------------------------- |
| partner_id | ID đối tác | 45974491332                 |
| command    | Lệnh       | productlist                 |
| sign       | Chữ ký     | 43567456546dfs32465asdkg123 |

**Example Request:**

```bash
curl --location 'http://{{domain_post}}/api/rechargews' \
--header 'Content-Type: application/json' \
--data '{
    "partner_id": "45974491332",
    "command": "productlist",
    "sign": "43567456546dfs32465asdkg123"
}'
```

---

### 4. Lấy số dư

**Endpoint:** `POST` `http://{{domain_post}}/api/rechargews`

**Mô tả:** Lấy số dư hiện tại của tài khoản nạp tiền. Hàm này không phát sinh giao dịch mới

**Request Method:** POST JSON

**Chữ ký:** `md5(partner_key + partner_id + command)` - Ghép liền các dữ liệu (không có request_id)

**Body Parameters (JSON):**

| Tham số    | Mô tả      | Ví dụ                       |
| ---------- | ---------- | --------------------------- |
| partner_id | ID đối tác | 3681148751                  |
| command    | Lệnh       | getbalance                  |
| sign       | Chữ ký     | 43567456546dfs32465asdkg123 |

**Example Request:**

```bash
curl --location 'http://{{domain_post}}/api/rechargews' \
--header 'Content-Type: application/json' \
--data '{
    "partner_id": "3681148751",
    "command": "getbalance",
    "sign": "43567456546dfs32465asdkg123"
}'
```

---

**Last Updated:** 2026-01-29
