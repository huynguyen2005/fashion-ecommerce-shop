const crypto = require("crypto");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../core/error.response");
const CacheService = require("./cache.service");

const {
  OTP_TTL_SECONDS,
  OTP_COOLDOWN_SECONDS,
  RESET_TOKEN_TTL_SECONDS,
  MAX_VERIFY_ATTEMPTS,
  getOtpKey,
  getOtpCooldownKey,
  getOtpAttemptsKey,
  getResetTokenKey,
} = require("../constants/otp.constant");
const { clearOtpSession } = require("../helpers/cache.helper");

class OtpService {
  static async saveForgotPasswordOtp({ email, otp }) {
    const client = CacheService.getRedis();
    const cooldownTtl = await client.ttl(getOtpCooldownKey(email)); // nghiệp vụ chờ một khoảng thời gian nào đó mới được thực hiện hành động

    if (cooldownTtl > 0) {
      throw new BadRequestError(
        `Error: Please wait ${cooldownTtl}s before requesting a new OTP`,
      );
    }

    const otpHash = await bcrypt.hash(otp, 10);

    await client
      .multi() //khai báo để thực hiện nhiều lệnh redis cùng 1 lúc
      .set(getOtpKey(email), JSON.stringify(otpHash), { EX: OTP_TTL_SECONDS })
      .set(getOtpCooldownKey(email), "1", { EX: OTP_COOLDOWN_SECONDS })
      .set(getOtpAttemptsKey(email), "0", { EX: OTP_TTL_SECONDS }) // reset số lần nhập sai OTP về 0
      .del(getResetTokenKey(email))
      .exec();
  }

  static async verifyForgotPasswordOtp({ email, otp }) {
    const client = CacheService.getRedis();
    const otpHash = await CacheService.getCache(getOtpKey(email));

    if (!otpHash) {
      throw new NotFoundError("Error: OTP expired or not found");
    }

    const attempts = await CacheService.incr(getOtpAttemptsKey(email)); // tăng số lần verify OTP lên

    if (attempts > MAX_VERIFY_ATTEMPTS) {
      await clearOtpSession(email); // xóa session OTP nếu vượt quá số lần cho phép
      throw new UnauthorizedError("Error: OTP verification attempts exceeded");
    }

    const isValidOtp = await bcrypt.compare(otp, otpHash);
    if (!isValidOtp) {
      throw new UnauthorizedError("Error: Invalid OTP");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await client
      .multi()
      .set(getResetTokenKey(email), JSON.stringify(resetToken), {
        EX: RESET_TOKEN_TTL_SECONDS,
      })
      .del(getOtpKey(email))
      .del(getOtpCooldownKey(email))
      .del(getOtpAttemptsKey(email))
      .exec();

    return {
      resetToken,
      expiresIn: RESET_TOKEN_TTL_SECONDS,
    };
  }

  static async verifyResetToken({ email, resetToken }) {
    const storedResetToken = await CacheService.getCache(
      getResetTokenKey(email),
    );

    if (!storedResetToken || storedResetToken !== resetToken) {
      throw new UnauthorizedError("Error: Invalid or expired reset token");
    }
  }

  static async clearResetToken(email) {
    await CacheService.delCache(getResetTokenKey(email));
  }
}

module.exports = OtpService;
