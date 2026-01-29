# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-01-29

### 🚨 BREAKING CHANGES

- **Config không còn bắt buộc .env file**: Constructor không còn require .env file bắt buộc
- **dotenv chuyển sang peerDependency**: `dotenv` giờ là optional dependency thay vì required
- **Constructor không còn process.exit()**: Lỗi config giờ throw Error thay vì exit process

### ✨ NEW FEATURES

- **Config trực tiếp qua constructor**: Có thể pass config trực tiếp vào constructor
  ```javascript
  new CardAPI({
    partnerKey: 'xxx',
    partnerId: 'yyy',
    domain: 'http://...'
  })
  ```
- **.env là optional**: Không bắt buộc phải có .env file
- **Tăng tính scale**: Dễ dàng tạo nhiều instances với configs khác nhau
- **Better validation**: Error messages rõ ràng và hướng dẫn fix

### 🎯 IMPROVEMENTS

- Không cần copy `.env.example` từ `node_modules` nữa
- Dễ sử dụng với nhiều môi trường (test/staging/production)
- Hỗ trợ tốt cho microservices architecture
- Config linh hoạt hơn nhiều

### 🐛 FIXES

- Fix: Khách hàng phàn nàn phải copy .env từ node_modules
- Fix: Package không có tính scale

### 📝 Migration Guide

**Cách cũ (v1.x):**
```javascript
// Bắt buộc phải có .env file
require('dotenv').config();
const api = new CardAPI();
```

**Cách mới (v2.x) - Khuyến nghị:**
```javascript
// Config trực tiếp, không cần .env
const api = new CardAPI({
  partnerKey: 'your_key',
  partnerId: 'your_id',
  domain: 'http://api.example.com'
});
```

**Vẫn có thể dùng .env (backward compatible):**
```javascript
require('dotenv').config();
const api = new CardAPI(); // Auto load from .env
```

---

## [1.0.1] - 2026-01-29

### 📖 Documentation
- Cập nhật README với formatting tốt hơn
- Thêm badges NPM
- Cải thiện examples

---

## [1.0.0] - 2026-01-29

### 🎉 Initial Release

- ✅ Hỗ trợ API Đổi thẻ cào
- ✅ Hỗ trợ API Kiểm tra seri
- ✅ Hỗ trợ API Mua thẻ
- ✅ Hỗ trợ API Nạp topup
- ✅ Tự động tính chữ ký MD5
- ✅ Cấu hình qua .env file
- ✅ Hỗ trợ domain riêng cho từng chức năng
