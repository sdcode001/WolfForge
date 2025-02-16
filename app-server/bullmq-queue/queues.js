const { Queue } = require('bullmq');
const { redisConnection } =  require('./redis-connection');


const fileContentQueue = new Queue(
    'file-content-queue',
    {
        connection: redisConnection
    }
)

module.exports = {
    fileContentQueue
}