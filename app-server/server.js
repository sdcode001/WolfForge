const http = require('http');
const {Socket, Server} = require('socket.io');
const express = require('express')
const cors = require('cors')
const {v4 : uuidv4} = require('uuid')
const { s3Manager }  =  require('./aws-s3-service');
const { fileManager } = require('./file-manager-service');
const path = require('path');
const { console } = require('inspector');
const { dir } = require('console');


const app = express();
const server = http.createServer(app);
const PORT = 5000;

const io = new Server(server, {
   cors: {
      origin: "*",
      methods: ['GET', 'POST']
   }
})

app.use(cors());

//example GET- http://localhost:5000/create?template=angular&username=sdcode001
app.get('/create', async (req, res) => {
   const username = req.query.username;
   const template = req.query.template;
   const id = uuidv4();
   
   if(username && template && id){
    const result = await s3Manager.copyFromS3TemplateToProject(username, template, id);
    if(result.status === 1){
       return res.status(200).json({status: 1, projectId: id, message: 'project created'});
    }
    return res.status(500).json({status: 0, projectId: null, message: 'Error occurred while creating project!'});
   }
   else{
    return res.status(404).json({status: 0, projectId: null, message: 'missing parameters!'});
   } 
})


io.on('connection', async (socket) => {
    console.log(`Client: ${socket.id} connected...`)
    socket.emit('connected', {SocketId: socket.id, Message: 'Socket server connected'});

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
      console.log(data)
       //TODO- update local file content
       //TODO- upfate aws project file content(using sync service)
    });

    socket.on('disconnect', () => {
      console.log(`Client: ${socket.id} disconnected...`)
      //clear up local project
      //update all project config files in S3 bucket
    })

})


server.listen(PORT, () => {
    console.log('Server listening to PORT:',PORT);
})