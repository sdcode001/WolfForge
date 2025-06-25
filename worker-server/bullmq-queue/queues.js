const { Queue } = require('bullmq');
const { redisConfig } =  require('./redis-connection');


const fileContentQueue = new Queue('file-content-queue',
    {
        connection: redisConfig
    }
);

fileContentQueue.on('error', (err)=> {
    console.error('Redis connection error:', err);
})

module.exports = {
    fileContentQueue
}