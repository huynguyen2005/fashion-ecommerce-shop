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

  // static async delByPattern(pattern) {
  //   const redis = this.getRedis();

  //   let cursor = "0";

  //   do {
  //     const result = await redis.scan(cursor, {
  //       MATCH: pattern,
  //       COUNT: 100,
  //     });

  //     cursor = String(result.cursor);

  //     if (result.keys.length > 0) {
  //       await redis.del(result.keys);
  //     }
  //   } while (cursor !== "0");
  // }
}

module.exports = CacheService;
