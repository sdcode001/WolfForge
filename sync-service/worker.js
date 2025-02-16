const { Worker } = require("bullmq");
const { redisConnection } =  require("./redis-connection");

const fileSyncWorker = new Worker(
    'file-content-queue',
    async (job) => {
        //TODO- update file content in S3
    },
    {
      connection: redisConnection,
      concurrency: 5, //process max 5 jobs concurrently
      removeOnComplete: { count: 5 }, // keep up to latest 5 jobs and remove all older jobs
      limiter: { max: 10, duration: 1000} //max of 10 jobs per second
    }
);

module.exports = {
    fileSyncWorker
}