const { ec2Manager } = require('./aws-ec2-manager');
const http = require('http');
const express = require('express')
const cors = require('cors')
const { initHttp } = require('./app-http')
require('dotenv').config({path: './.env'})
const { orchestrator } = require('./orchestrator')



async function initEC2Instances() {
    const credentials = await orchestrator.launchInitialInstances();
    console.log('Started worker instances---> ', credentials);
    
    // Shutdown after 2 minutes
    // setTimeout(async () => {
    //    await ec2Manager.terminateInstance(credentials.map(v => v.InstanceId));
    // }, 5 * 60 * 1000); // 2 minutes
}

async function Start(){
    const APP_SERVER_PORT = process.env.APP_SERVER_PORT;

    const app = express();
    const server = http.createServer(app);

    app.use(cors());
    app.use(express.json());

    //spin up warm pool instances
    await initEC2Instances();

    initHttp(app);

    server.listen(APP_SERVER_PORT, ()=>{
        console.log(`Router server listening on PORT: ${APP_SERVER_PORT}...`)
    })
}


Start();

