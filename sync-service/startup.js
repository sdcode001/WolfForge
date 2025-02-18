const { fileSyncWorker } = require('./worker')
const { UI } = require('bullmq')

//monitor queues
//router.use('/admin/queues', UI)

//for fileSyncWorker
try{
  if(!fileSyncWorker.isRunning()){
    fileSyncWorker.run();
  }
  else if(fileSyncWorker.isPaused()){
    fileSyncWorker.resume();
  }
  else{
    console.log(`${fileSyncWorker.qualifiedName} fileSyncWorker is already running...`)
  }
}
catch(err){
   console.error(err);
}
