const http = require('http');
const {Socket, Server} = require('socket.io');
const express = require('express')
const cors = require('cors')
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

//example GET- http://localhost:5000/create?project=angular&username=sdcode001&id=87bshfh4334bdfbdfnb
app.get('/create', async (req, res) => {
   const username = req.query.username;
   const project = req.query.project;
   const id = req.query.id;

   if(username && project && id){
    const result = await s3Manager.copyFromS3TemplateToProject(username, project, id);
    if(result.status === 1){
       return res.status(200).json({message: 'project created'});
    }
    return res.status(500).json({message: 'Error occurred while creating project!'});
   }
   else{
    return res.status(404).json({message: 'missing parameters!'});
   } 
})


io.on('connection', async (socket) => {
    
})


server.listen(PORT, () => {
    console.log('Server listening to PORT:',PORT);
})