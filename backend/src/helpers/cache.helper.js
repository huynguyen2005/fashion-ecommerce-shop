const {
  CATEGORY_LIST,
  CATEGORY_DETAIL,
} = require("../constants/cache.constant");
const {
  getOtpKey,
  getOtpCooldownKey,
  getOtpAttemptsKey,
  getResetTokenKey,
} = require("../constants/otp.constant");
const CacheService = require("../services/cache.service");

module.exports = {
  clearCategoryCache: async (slugCategory) => {
    await Promise.all([
      CacheService.delCache(CATEGORY_LIST),
      CacheService.delCache(CATEGORY_DETAIL(slugCategory)),
    ]);
  },
  clearOtpSession: async (email) => {
    await Promise.all([
      CacheService.delCache(getOtpKey(email)),
      CacheService.delCache(getOtpCooldownKey(email)),
      CacheService.delCache(getOtpAttemptsKey(email)),
      CacheService.delCache(getResetTokenKey(email)),
    ]);
  },
};
