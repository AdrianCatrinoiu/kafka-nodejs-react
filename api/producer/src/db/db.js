const redis = require("redis");

let redisClient;

redisClient = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST,
  {
    no_ready_check: true,
  }
);

module.exports = redisClient;
