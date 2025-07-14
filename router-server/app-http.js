const { orchestrator } = require('./orchestrator')


function initHttp(app){

  //Test endpoint
  //example GET- http://localhost:5000/test
  app.get('/test', async(req, res) => {
      return res.status(200).json({message: 'Hi Souvik. I am up....'})
  })

  //example GET- http://localhost:5000/request-worker-instance?projectId=djwwe23323nbwnwd
  //Response- {status, instance_ip, instance_id, message}
  app.get('/request-worker-instance', async(req, res) => {
      const projectId = req.query.projectId;

      const result = await orchestrator.getAvailableInstance(projectId);

      if(result.id && result.ip){
        return res.status(200).json({status: 1, instance_ip: result.ip, instance_id: result.id, message: result.message});
      }
      return res.status(500).json({status: 0, instance_ip: null, instance_id: null, message: result.message});
  })

}

module.exports = {
    initHttp
}