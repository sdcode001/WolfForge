const {io, Socket} = require('socket.io-client');
require('dotenv').config({path: './.env'});
const { fileManager }  = require('./file-manager-service')


class ExternalSocketClient {
    routerIO = null
    routerClientSocketId = null;

    initRouterServerClient(){
        const url = process.env.ROUTER_SERVER_URL;
        try{
           this.routerIO = io(url);

           this.routerIO.on('connected', (data) => {
              this.routerClientSocketId = data.SocketId;
              console.log(data.Message);
              const projectId = fileManager.getProjectId();
              if(projectId){
                this.emitRouterServerClient('get-project-id', {projectId: projectId});
              }
           })
           
        }
        catch(ex){
          console.log(ex);
        }    
    }

    emitRouterServerClient(event, data){
       if(this.routerIO != null){
          this.routerIO.emit(event, data);
       }
       else{
          console.log('Failed to emit on Router server socket...')
       }
    }

}

const externalSocketClient = new ExternalSocketClient();

module.exports = {
    externalSocketClient
}