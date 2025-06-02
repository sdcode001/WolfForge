const {v4 : uuidv4} = require('uuid')
const { s3Manager }  =  require('./aws-s3-service');
const axios = require('axios')
require('dotenv').config({path: './.env'})


function initHttp(app){
    //example GET- http://localhost:3000/create?template=angular&username=sdcode001
    app.get('/create', async (req, res) => {
        const username = req.query.username;
        const template = req.query.template;
        const id = uuidv4();
        
        if(username && template && id){
            const result = await s3Manager.copyFromS3TemplateToProject(username, template, id);
            if(result.status === 1){
                return res.status(200).json({status: 1, projectId: id, message: 'Project created'});
            }
            return res.status(500).json({status: 0, projectId: null, message: 'Error occurred while creating project!'});
        }
        else{
            return res.status(404).json({status: 0, projectId: null, message: 'Missing parameters!'});
        } 
    })

    
    //example GET- http://localhost:3000/request-worker-instance?projectId=djwwe23323nbwnwd
    //Response- {status, instance_ip, instance_id, message}
    app.get('/request-worker-instance', async(req, res) => {
       const projectId = req.query.projectId;

       //request to router server
       try{
         const API_URL = process.env.ROUTER_SERVER + '/request-worker-instance';
         const response = await axios.get(API_URL, {
            params: {
                projectId: projectId
            }
         })

         return res.status(200).json(response.data);
       }
       catch(err){
         console.log(err.response.data)
         return res.status(500).json(err.response.data);
       }
    })
}


module.exports = {
    initHttp
}