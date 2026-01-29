# 🚀 Hướng dẫn Build và Publish lên NPM

## 📋 Chuẩn bị

### 1. Tạo tài khoản NPM (nếu chưa có)

- Truy cập: https://www.npmjs.com/signup
- Đăng ký tài khoản

### 2. Login vào NPM CLI

```bash
npm login
```

Nhập:

- Username
- Password
- Email
- OTP (nếu bật 2FA)

Kiểm tra đã login:

```bash
npm whoami
```

## 🔍 Kiểm tra trước khi publish

### 1. Cập nhật thông tin package.json

```json
{
  "name": "mojistudio-card-api", // Tên package (phải unique)
  "version": "1.0.0", // Version
  "description": "...", // Mô tả
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/repo.git"
  }
}
```

### 2. Kiểm tra file nào sẽ được publish

```bash
npm pack --dry-run
```

Hoặc xem danh sách files:

```bash
npm publish --dry-run
```

### 3. Test package locally

```bash
# Tạo tarball
npm pack

# Cài test
npm install ./mojistudio-card-api-1.0.0.tgz

# Hoặc link local
npm link
cd /path/to/test-project
npm link mojistudio-card-api
```

## 📦 Build và Publish

### Bước 1: Kiểm tra version

Kiểm tra version hiện tại:

```bash
npm version
```

Tăng version (chọn một):

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### Bước 2: Commit code (nếu dùng git)

```bash
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

### Bước 3: Publish lên NPM

#### Public package (miễn phí):

```bash
npm publish --access public
```

#### Private package (cần trả phí):

```bash
npm publish
```

### Bước 4: Verify

Kiểm tra đã publish thành công:

```bash
npm view mojistudio-card-api
```

Hoặc truy cập:

```
https://www.npmjs.com/package/mojistudio-card-api
```

## 🔄 Update phiên bản mới

### 1. Sửa code

### 2. Update version

```bash
npm version patch
```

### 3. Publish

```bash
npm publish
```

## ⚠️ Lưu ý quan trọng

### Files được publish

Chỉ các file trong `files` field của package.json:

- ✅ index.js
- ✅ cardApi.js
- ✅ config.js
- ✅ .env.example
- ✅ README.md
- ✅ card-api.md

### Files bị ignore (tự động)

- ❌ node_modules/
- ❌ .env
- ❌ .git/
- ❌ examples.js
- ❌ card.txt

### Kiểm tra .npmignore

File `.npmignore` đã được tạo để loại bỏ:

- Development files (.env, logs)
- IDE settings (.vscode, .idea)
- Test files
- Temporary files

## 🛠️ Commands hữu ích

```bash
# Xem thông tin package
npm view mojistudio-card-api

# Xem versions
npm view mojistudio-card-api versions

# Unpublish (trong 72h)
npm unpublish mojistudio-card-api@1.0.0

# Deprecate version
npm deprecate mojistudio-card-api@1.0.0 "Please use version 1.0.1"

# Xem downloads
npm view mojistudio-card-api downloads
```

## 📊 Quản lý versions

### Semantic Versioning (MAJOR.MINOR.PATCH)

- **PATCH** (1.0.X): Bug fixes, không breaking changes
- **MINOR** (1.X.0): Thêm features mới, backward compatible
- **MAJOR** (X.0.0): Breaking changes

### Pre-release versions

```bash
npm version prerelease --preid=alpha  # 1.0.0-alpha.0
npm version prerelease --preid=beta   # 1.0.0-beta.0
npm version prerelease --preid=rc     # 1.0.0-rc.0
```

## 🔐 Bảo mật

### 1. Bật 2FA (Two-Factor Authentication)

```bash
npm profile enable-2fa auth-and-writes
```

### 2. Tạo access token cho CI/CD

```
npm token create
```

### 3. Audit dependencies

```bash
npm audit
npm audit fix
```

## 📝 Checklist trước khi publish

- [ ] Cập nhật version trong package.json
- [ ] Cập nhật CHANGELOG.md (nếu có)
- [ ] Test kỹ code
- [ ] Kiểm tra .npmignore
- [ ] Cập nhật README.md
- [ ] Commit code lên git
- [ ] Tạo git tag
- [ ] Run `npm publish --dry-run`
- [ ] Publish: `npm publish --access public`
- [ ] Verify trên npmjs.com
- [ ] Test cài package: `npm install mojistudio-card-api`

## 🎯 Quick Start cho lần đầu

```bash
# 1. Login
npm login

# 2. Kiểm tra package name có available không
npm view mojistudio-card-api  # Nếu lỗi 404 = tên còn trống

# 3. Test build
npm pack --dry-run

# 4. Publish
npm publish --access public

# 5. Verify
npm view mojistudio-card-api

# 6. Test install
npm install mojistudio-card-api
```

## 🔧 Troubleshooting

### Lỗi: "You do not have permission to publish"

- Kiểm tra đã login: `npm whoami`
- Kiểm tra tên package đã tồn tại chưa
- Đổi tên package trong package.json

### Lỗi: "Package name too similar to existing package"

- Đổi tên khác trong package.json

### Lỗi: "Invalid version"

- Version phải theo format: X.Y.Z
- Không dùng version đã publish

## 📚 Tài liệu tham khảo

- NPM Docs: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- Publishing packages: https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages
