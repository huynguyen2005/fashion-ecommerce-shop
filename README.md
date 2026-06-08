# fashion-ecommerce-shop

## Auth API

Phần `auth` của dự án đang được mount tại prefix:

```txt
/api/v1/auth
```

Ví dụ base URL khi chạy local:

```txt
http://localhost:3000/api/v1/auth
```

Swagger UI:

```txt
http://localhost:3000/api/v1/docs
```

### Chức năng hiện có

- Đăng ký tài khoản
- Đăng nhập
- Refresh access token bằng refresh token
- Đăng xuất
- Quên mật khẩu bằng OTP gửi qua email
- Xác thực OTP để lấy `resetToken`
- Đặt lại mật khẩu bằng `resetToken`

### Yêu cầu để auth hoạt động

Auth hiện phụ thuộc vào:

- MongoDB: lưu thông tin user
- Redis: lưu OTP, cooldown và reset token tạm thời
- Mail server SMTP: gửi OTP qua email
- JWT: tạo `accessToken` và `refreshToken`

### Biến môi trường cần có

Tối thiểu backend cần các biến sau:

```env
PORT=3000
NODE_ENV=dev

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

DEV_DB_HOST=localhost
DEV_DB_PORT=27017
DEV_DB_NAME=fashion_ecommerce

DEV_REDIS_HOST=localhost
DEV_REDIS_PORT=6379
DEV_REDIS_PASSWORD=
DEV_REDIS_DB=0

DEV_MAIL_HOST=smtp.gmail.com
DEV_MAIL_PORT=587
DEV_MAIL_SECURE=false
DEV_MAIL_USER=your_email
DEV_MAIL_PASSWORD=your_app_password
DEV_MAIL_FROM=your_email
```

Lưu ý:

- `OTP` có hiệu lực `180 giây`
- Cooldown gửi lại OTP là `60 giây`
- `resetToken` có hiệu lực `600 giây`
- Route `logout` yêu cầu `Authorization: Bearer <accessToken>`

### Format response

Response thành công có dạng chung:

```json
{
  "message": "Success message",
  "status": 200,
  "metadata": {}
}
```

Response lỗi có dạng chung:

```json
{
  "status": "error",
  "code": 400,
  "message": "Error message"
}
```

Với lỗi validation, `message` là một mảng lỗi theo field.

---

## 1. Đăng ký

**Endpoint**

```http
POST /api/v1/auth/register
```

**Body**

```json
{
  "fullName": "Nguyen Van A",
  "email": "vana@example.com",
  "password": "123456",
  "repeatPassword": "123456"
}
```

**Validate**

- `fullName`: bắt buộc, từ `3-30` ký tự
- `email`: bắt buộc, đúng định dạng email
- `password`: bắt buộc, từ `6-20` ký tự
- `repeatPassword`: phải trùng với `password`

**Response mẫu**

```json
{
  "message": "User registration successful",
  "status": 201,
  "metadata": {
    "user": {
      "_id": "68458d7d0b9f0b3b9947a111",
      "fullName": "Nguyen Van A",
      "email": "vana@example.com"
    },
    "tokens": {
      "accessToken": "access_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
}
```

---

## 2. Đăng nhập

**Endpoint**

```http
POST /api/v1/auth/login
```

**Body**

```json
{
  "email": "vana@example.com",
  "password": "123456"
}
```

**Validate**

- `email`: bắt buộc, đúng định dạng email
- `password`: bắt buộc, từ `6-20` ký tự

**Response mẫu**

```json
{
  "message": "User login successful",
  "status": 200,
  "metadata": {
    "user": {
      "_id": "68458d7d0b9f0b3b9947a111",
      "fullName": "Nguyen Van A",
      "email": "vana@example.com"
    },
    "tokens": {
      "accessToken": "access_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
}
```

---

## 3. Refresh Token

**Endpoint**

```http
POST /api/v1/auth/refresh-token
```

**Body**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Mô tả**

- Dùng `refreshToken` hiện tại để lấy cặp token mới
- Nếu refresh token đã từng dùng trước đó, hệ thống sẽ từ chối
- Nếu refresh token không khớp với token đang lưu, hệ thống sẽ từ chối

**Response mẫu**

```json
{
  "message": "Token refresh successful",
  "status": 200,
  "metadata": {
    "accessToken": "new_access_token_here",
    "refreshToken": "new_refresh_token_here"
  }
}
```

---

## 4. Đăng xuất

**Endpoint**

```http
POST /api/v1/auth/logout
```

**Headers**

```http
Authorization: Bearer <accessToken>
```

**Mô tả**

- Route này yêu cầu user đã đăng nhập
- Khi logout, record token của user sẽ bị xóa khỏi hệ thống

**Response mẫu**

```json
{
  "message": "Logout successful",
  "status": 200,
  "metadata": true
}
```

---

## 5. Quên mật khẩu - gửi OTP

**Endpoint**

```http
POST /api/v1/auth/forgot-password
```

**Body**

```json
{
  "email": "vana@example.com"
}
```

**Mô tả**

- Nếu email tồn tại, hệ thống gửi OTP gồm `6 chữ số` qua email
- OTP có hiệu lực `180 giây`
- Chỉ được gửi lại OTP sau `60 giây`

**Response mẫu**

```json
{
  "message": "Forgot password request successful",
  "status": 200,
  "metadata": {
    "message": "OTP has been sent to the registered email",
    "expiresIn": 180
  }
}
```

---

## 6. Xác thực OTP quên mật khẩu

**Endpoint**

```http
POST /api/v1/auth/verify-otp
```

**Body**

```json
{
  "email": "vana@example.com",
  "otp": "123456"
}
```

**Validate**

- `otp`: bắt buộc, đúng `6` chữ số

**Mô tả**

- Sau khi OTP hợp lệ, hệ thống trả về `resetToken`
- `resetToken` có hiệu lực `600 giây`
- Tối đa `5` lần nhập sai OTP, vượt quá sẽ bị hủy phiên OTP hiện tại

**Response mẫu**

```json
{
  "message": "OTP verified successfully",
  "status": 200,
  "metadata": {
    "resetToken": "generated_reset_token_here",
    "expiresIn": 600
  }
}
```

---

## 7. Đặt lại mật khẩu

**Endpoint**

```http
POST /api/v1/auth/reset-password
```

**Body**

```json
{
  "email": "vana@example.com",
  "resetToken": "generated_reset_token_here",
  "newPassword": "newpassword123",
  "repeatPassword": "newpassword123"
}
```

**Validate**

- `email`: bắt buộc, đúng định dạng
- `resetToken`: bắt buộc, tối thiểu `32` ký tự
- `newPassword`: bắt buộc, từ `6-20` ký tự
- `repeatPassword`: phải trùng `newPassword`

**Response mẫu**

```json
{
  "message": "Password reset successful",
  "status": 200,
  "metadata": true
}
```

---

## 8. Flow quên mật khẩu

Thứ tự gọi API:

1. Gọi `POST /api/v1/auth/forgot-password` để nhận OTP qua email
2. Gọi `POST /api/v1/auth/verify-otp` để đổi OTP lấy `resetToken`
3. Gọi `POST /api/v1/auth/reset-password` với `resetToken` để đổi mật khẩu mới

---

## 9. Header xác thực

Các route cần đăng nhập sử dụng header:

```http
Authorization: Bearer <accessToken>
```

Hiện tại trong module `auth`, route yêu cầu token là:

- `POST /api/v1/auth/logout`

---

## 10. Danh sách endpoint auth

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Đăng ký tài khoản |
| POST | `/api/v1/auth/login` | Đăng nhập |
| POST | `/api/v1/auth/refresh-token` | Cấp lại access token và refresh token |
| POST | `/api/v1/auth/logout` | Đăng xuất |
| POST | `/api/v1/auth/forgot-password` | Gửi OTP quên mật khẩu |
| POST | `/api/v1/auth/verify-otp` | Xác thực OTP để lấy reset token |
| POST | `/api/v1/auth/reset-password` | Đặt lại mật khẩu |
