const {v4 : uuidv4} = require('uuid')
const { s3Manager }  =  require('./aws-s3-service');

function initHttp(app){
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
}

module.exports = {
    initHttp
}