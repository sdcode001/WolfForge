const IORedis = require('ioredis');
require('dotenv').config({ path: '../.env' }); // or use '.env' if in same dir

const redisConfig = {
  port: Number(process.env.BULLMQ_REDIS_PORT),
  host: process.env.BULLMQ_REDIS_HOST,
  maxRetriesPerRequest: null,
};


module.exports = { redisConfig };
