const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { getRedisClient } = require("../dbs/init.redis");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../core/error.response");

const OTP_TTL_SECONDS = 180;
const OTP_COOLDOWN_SECONDS = 60;
const RESET_TOKEN_TTL_SECONDS = 600;
const MAX_VERIFY_ATTEMPTS = 5;

const getOtpKey = (email) => `forgot-password:otp:${email}`;
const getOtpCooldownKey = (email) => `forgot-password:cooldown:${email}`;
const getOtpAttemptsKey = (email) => `forgot-password:attempts:${email}`;
const getResetTokenKey = (email) => `forgot-password:reset-token:${email}`;

class OtpService {
  static getClient() {
    return getRedisClient();
  }

  static async saveForgotPasswordOtp({ email, otp }) {
    const client = this.getClient();
    const cooldownTtl = await client.ttl(getOtpCooldownKey(email)); // nghiệp vụ chờ một khoảng thời gian nào đó mới được thực hiện hành động

    if (cooldownTtl > 0) {
      throw new BadRequestError(
        `Error: Please wait ${cooldownTtl}s before requesting a new OTP`,
      );
    }

    const otpHash = await bcrypt.hash(otp, 10);

    await client
      .multi() //khai báo để thực hiện nhiều lệnh redis cùng 1 lúc
      .set(getOtpKey(email), otpHash, { EX: OTP_TTL_SECONDS })
      .set(getOtpCooldownKey(email), "1", { EX: OTP_COOLDOWN_SECONDS })
      .set(getOtpAttemptsKey(email), "0", { EX: OTP_TTL_SECONDS }) // reset số lần nhập sai OTP về 0
      .del(getResetTokenKey(email))
      .exec();
  }

  static async verifyForgotPasswordOtp({ email, otp }) {
    const client = this.getClient();
    const otpHash = await client.get(getOtpKey(email));

    if (!otpHash) {
      throw new NotFoundError("Error: OTP expired or not found");
    }

    const attempts = await client.incr(getOtpAttemptsKey(email)); // tăng số lần verify OTP lên
    // if (attempts === 1) {
    //   await client.expire(getOtpAttemptsKey(email), OTP_TTL_SECONDS);
    // }

    if (attempts > MAX_VERIFY_ATTEMPTS) {
      await this.clearOtpSession(email);
      throw new UnauthorizedError("Error: OTP verification attempts exceeded");
    }

    const isValidOtp = await bcrypt.compare(otp, otpHash);
    if (!isValidOtp) {
      throw new UnauthorizedError("Error: Invalid OTP");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await client
      .multi()
      .set(getResetTokenKey(email), resetToken, { EX: RESET_TOKEN_TTL_SECONDS })
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
    const client = this.getClient();
    const storedResetToken = await client.get(getResetTokenKey(email));

    if (!storedResetToken || storedResetToken !== resetToken) {
      throw new UnauthorizedError("Error: Invalid or expired reset token");
    }
  }

  static async clearResetToken(email) {
    await this.getClient().del(getResetTokenKey(email));
  }

  static async clearOtpSession(email) {
    await this.getClient().del(
      getOtpKey(email),
      getOtpCooldownKey(email),
      getOtpAttemptsKey(email),
      getResetTokenKey(email),
    );
  }
}

module.exports = OtpService;
