const {Socket, Server} = require('socket.io');

function initWebsocket(server){
    const io = new Server(server, {
        cors: {
           origin: "*",
           methods: ['GET', 'POST']
        }
     })

     io.on('connection', async (socket) => {
        console.log(`Client: ${socket.id} connected...`)
        socket.emit('connected', {SocketId: socket.id, Message: 'Connected to Router Server socket...'});

        socket.on('get-project-id', (data) => {
            //TODO- update socket-id in redux model by data.projectId
        })

        socket.on('terminate-instance', async(data) => {
            //TODO- terminate instance by data.projectId
        })

        //when instance turn off accidentally or turned off from aws console
        socket.on('disconnect', () => {
          //TODO- terminate instance find by socket.id
          console.log(`Client: ${socket.id} disconnected...`)
        }) 
     })
}

module.exports = {
    initWebsocket
}