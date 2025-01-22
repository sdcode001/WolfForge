const http = require('http');
const {Socket, Server} = require('socket.io');
const express = require('express')
const cors = require('cors')
const {v4 : uuidv4} = require('uuid')
const { s3Manager }  =  require('./aws-s3-service');


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
    
})


server.listen(PORT, () => {
    console.log('Server listening to PORT:',PORT);
})