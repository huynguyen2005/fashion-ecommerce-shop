const { getRedisClient } = require("../dbs/init.redis");

class CacheService {
  static getRedis() {
    return getRedisClient();
  }

  static async getCache(key) {
    const redis = this.getRedis();

    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async setCache(key, value, ttl = 3600) {
    const redis = this.getRedis();

    await redis.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  static async delCache(key) {
    const redis = this.getRedis();

    await redis.del(key);
  }

  static async incr(key) {
    const redis = this.getRedis();
    return await redis.incr(key);
  }
}

module.exports = CacheService;
