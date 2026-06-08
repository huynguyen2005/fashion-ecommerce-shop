const { createClient } = require("redis");
const redisConfig = require("../configs/redis.config");

class RedisDatabase {
    constructor() {
        this.client = null;
    }

    getRedisUrl() {
        const { host, port, password } = redisConfig;

        if (password) {
            return `redis://:${password}@${host}:${port}`;
        }

        return `redis://${host}:${port}`;
    }

    createClient() {
        if (this.client) {
            return this.client;
        }

        this.client = createClient({
            url: this.getRedisUrl(),
            database: redisConfig.db,
        });

        this.client.on("error", (error) => {
            console.error("Redis connection error:", error);
        });

        return this.client;
    }

    async connect() {
        const client = this.createClient();

        if (!client.isOpen) {
            await client.connect();
            console.log("Connected to Redis successfully");
        }

        return client;
    }

    static getInstance() {
        if (!RedisDatabase.instance) {
            RedisDatabase.instance = new RedisDatabase();
        }

        return RedisDatabase.instance;
    }
}

const redisDatabase = RedisDatabase.getInstance();

module.exports = {
    initRedis: () => redisDatabase.connect(),
    getRedisClient: () => redisDatabase.createClient(),
};
