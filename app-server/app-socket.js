const {Socket, Server} = require('socket.io');
const { s3Manager }  =  require('./aws-s3-service');
const { fileManager } = require('./file-manager-service');
const path = require('path');
const { fileContentQueue } = require('./bullmq-queue/queues');


function initWebsocket(server){
    const io = new Server(server, {
        cors: {
           origin: "*",
           methods: ['GET', 'POST']
        }
     })

     io.on('connection', async (socket) => {
        console.log(`Client: ${socket.id} connected...`)
        socket.emit('connected', {SocketId: socket.id, Message: 'Socket server connected...'});
    
        socket.on('createProject',async (data) => {
          //copy project form S3 bucket to local
          try{
             const result = await s3Manager.copyFromS3ProjectsToLocal(data.username, data.projectId);
             if(result.status == 1){
                const content = await fileManager.getDirectory(path.join(__dirname, `workspace/${data.username}/${data.projectId}`), '');
                socket.emit('createProjectResult', {status: 1, data: content});
             }
             else{
                socket.emit('createProjectResult', {status: 0, data: null});
             }
          }
          catch(err){
             console.log(err);
             socket.emit('createProjectResult', {status: 0, data: null});
          }
        })
    
        socket.on('get-directory', async (data) => {
          try{
             const dirContent = await fileManager.getDirectory(path.join(__dirname, `workspace/${data.username}/${data.projectId}${data.path}`), data.path);
             socket.emit('directory-content', {path: data.path, data: dirContent});
          }
          catch(err){
             socket.emit('directory-content', {path: data.path, data: []});
             console.log(err)
          }
        })
    
        socket.on('get-file-content', async(data) => {
           try{
              const fileContent = await fileManager.getFileContent(path.join(__dirname, `workspace/${data.username}/${data.projectId}${data.path}`));
              socket.emit('file-content', {path: data.path, data: fileContent});
           }
           catch(err){
             socket.emit('file-content', {path: data.path, data: ''});
             console.log(err)
           }
        })
    
    
        socket.on('update-file-content', async(data) => {
           //update local file content
           try{
              fileManager.updateFileContent(path.join(__dirname, `workspace/${data.username}/${data.projectId}${data.path}`), data.content)
              .then(async (data1) => { 
                await fileContentQueue.add(data.fileName, data);
                socket.emit('file-update-result', {status: 1});
              })
              .catch(err => {
                socket.emit('file-update-result', {status: 0});
                console.log(err)
              })
           }
           catch(err){
              socket.emit('file-update-result', {status: 0});
              console.log(err)
           }
        });
    
        socket.on('disconnect', () => {
          console.log(`Client: ${socket.id} disconnected...`)
          //TODO- clear up local project
          //TODO- update all project config files in S3 bucket
        })
    
    })
}

module.exports = {
    initWebsocket
}