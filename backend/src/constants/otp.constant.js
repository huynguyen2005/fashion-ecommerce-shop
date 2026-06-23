module.exports = {
  OTP_TTL_SECONDS: 180,
  OTP_COOLDOWN_SECONDS: 60,
  RESET_TOKEN_TTL_SECONDS: 600,
  MAX_VERIFY_ATTEMPTS: 5,
  getOtpKey: (email) => `forgot-password:otp:${email}`,
  getOtpCooldownKey: (email) => `forgot-password:cooldown:${email}`,
  getOtpAttemptsKey: (email) => `forgot-password:attempts:${email}`,
  getResetTokenKey: (email) => `forgot-password:reset-token:${email}`,
};
