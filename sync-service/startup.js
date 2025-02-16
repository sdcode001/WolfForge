const { fileSyncWorker } = require('./worker')
const { UI } = require('bullmq')

//monitor queues
router.use('/admin/queues', UI)


try{
  fileSyncWorker.run();
}
catch(err){
   console.error(err);
}
