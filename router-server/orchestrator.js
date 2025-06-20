const {
    addInstance,
    removeInstance,
    updateInstanceProjectId,
    updateInstanceState
} = require('./redux-store/Actions');
const {
    getInstanceByProjectId,
    getInstanceByStatus,
    getTotalInstancesCount
} = require('./redux-store/Selectors');
const { store } = require('./redux-store/Store');
const { InstanceState } = require('./redux-store/InstanceState');
require('dotenv').config({path: './.env'})
const { ec2Manager } = require('./aws-ec2-manager');


class Orchestrator {

   //Return {ip, id, message}
   async getAvailableInstance(projectId){
      const currentState = store.getState();

      //check instance with projectId exists or not
      const instance1 = getInstanceByProjectId(currentState, projectId)
      if(instance1){
         store.dispatch(updateInstanceState(instance1[0], 1));
         return {ip: instance1[0], id: instance1[1].instance_id, message: 'Successfully get a worker instance.'};
      }

      //check for a idle instance
      const instance2 = getInstanceByStatus(currentState, 0);
      if(instance2){
         store.dispatch(updateInstanceState(instance2[0], 1));
         store.dispatch(updateInstanceProjectId(instance2[0], projectId));
         return {ip: instance2[0], id: instance2[1].instance_id, message: 'Successfully get a worker instance.'};
      }

      //spin up new instance if total instances < max limit
      if(getTotalInstancesCount(currentState) < process.env.MAX_INSTANCES_LIMIT){
         const credentials = await ec2Manager.launchInstances(1);
         if(credentials){
           console.log('Started worker instances---> ', credentials);
           credentials.forEach(v => {
              this.addNewInstance(v.PublicIpAddress, v.InstanceId);
              store.dispatch(updateInstanceState(v.PublicIpAddress, 1));
              store.dispatch(updateInstanceProjectId(v.PublicIpAddress, projectId));
           })

           return {ip: credentials[0].PublicIpAddress, id: credentials[0].InstanceId, message: 'Successfully get a worker instance.'};           
         }
         else{
           return {ip: null, id: null, message: 'Unable to launch a new worker instance. Please try after sometime!'};
         }
      }

      return {ip: null, id: null, message: 'Currently all worker instances are busy. Please try after sometime!'};
   }


   async launchInitialInstances(){
      const credentials = await ec2Manager.launchInstances(process.env.WARM_POOL_COUNT);
      credentials.forEach(v => {
       this.addNewInstance(v.PublicIpAddress, v.InstanceId);
      })
      return credentials;
   }


   addNewInstance(ip, id){
      const newInstance = new InstanceState(id, '', 0, 0);
      store.dispatch(addInstance(ip, newInstance));
   }

   //Terminate instance when get notification from worker server.
   async terminateInstance(instanceId, ip, isDirectly=false){
      //terminate a instance if number of active instances > WARM_POOL_COUNT else make it idle
      const currentState = store.getState();
      const WARM_POOL_COUNT = process.env.WARM_POOL_COUNT;
      if(isDirectly || getTotalInstancesCount(currentState) > WARM_POOL_COUNT){
         await ec2Manager.terminateInstances([instanceId]);
         store.dispatch(removeInstance(ip));
      }
      else{
         store.dispatch(updateInstanceState(ip, 0));
      }
   }

   
}

const orchestrator = new Orchestrator();


module.exports = {
  orchestrator
}