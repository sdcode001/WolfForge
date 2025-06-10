const {Socket, Server} = require('socket.io');
const { orchestrator } = require('./orchestrator')
const {
    updateInstanceSocketId
} = require('./redux-store/Actions');
const {
    getInstanceByProjectId,
    getInstanceBySocketId
} = require('./redux-store/Selectors');
const { store } = require('./redux-store/Store');


function initWebsocket(server){
    const io = new Server(server, {
        cors: {
           origin: "*",
           methods: ['GET', 'POST']
        }
     })

     io.on('connection', async (socket) => {
        console.log(`Worker client: ${socket.id} connected...`)
        socket.emit('connected', {SocketId: socket.id, Message: 'Connected to Router Server socket...'});

        socket.on('get-project-id', (data) => {
            //update worker-socket-id in redux model by data.projectId
            const socketId = socket.id;
            const currentState = store.getState();
            const instance = getInstanceByProjectId(currentState, data.projectId)
            if(instance){
               const ip = instance[0];
               store.dispatch(updateInstanceSocketId(ip, socketId));
            }
        })

        socket.on('terminate-instance', async(data) => {
            //terminate instance by data.projectId
            const currentState = store.getState();
            const instance = getInstanceByProjectId(currentState, data.projectId)
            if(instance){
                const ip = instance[0];
                const instanceInfo = instance[1];
                await orchestrator.terminateInstance(instanceInfo.instance_id, ip, false);
            }
        })

        //when instance turn off accidentally or turned off from aws console
        socket.on('disconnect', async() => {
          //terminate instance find by socket.id
          console.log(`Worker client: ${socket.id} disconnected...`)
          const currentState = store.getState();
          const instance = getInstanceBySocketId(currentState, socket.id)
          if(instance){
                const ip = instance[0];
                const instanceInfo = instance[1];
                await orchestrator.terminateInstance(instanceInfo.instance_id, ip, true);
            }
        }) 
     })
}

module.exports = {
    initWebsocket
}