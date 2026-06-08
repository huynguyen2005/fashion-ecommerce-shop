const dev = {
    host: process.env.DEV_REDIS_HOST || "127.0.0.1",
    port: Number(process.env.DEV_REDIS_PORT) || 6379,
    password: process.env.DEV_REDIS_PASSWORD || "",
    db: Number(process.env.DEV_REDIS_DB) || 0,
};

const pro = {
    host: process.env.PRO_REDIS_HOST || "127.0.0.1",
    port: Number(process.env.PRO_REDIS_PORT) || 6379,
    password: process.env.PRO_REDIS_PASSWORD || "",
    db: Number(process.env.PRO_REDIS_DB) || 0,
};

const config = {
    dev,
    pro,
};

const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
