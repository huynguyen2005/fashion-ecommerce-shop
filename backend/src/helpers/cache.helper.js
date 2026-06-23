const {
  CATEGORY_LIST,
  CATEGORY_DETAIL,
} = require("../constants/cache.constant");
const CacheService = require("../services/cache.service");

module.exports = {
  clearCategoryCache: async (slugCategory) => {
    await Promise.all([
      CacheService.delCache(CATEGORY_LIST),
      CacheService.delCache(CATEGORY_DETAIL(slugCategory)),
    ]);
  },
};
