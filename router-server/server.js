const { ec2Manager } = require('./aws-ec2-manager');
const http = require('http');
const express = require('express')
const cors = require('cors')
const { initHttp } = require('./app-http')
const { initWebsocket } = require('./app-socket')
require('dotenv').config({path: './.env'})
const { orchestrator } = require('./orchestrator')



async function initEC2Instances() {
    console.log('Waiting for instances to launch....')
    const credentials = await orchestrator.launchInitialInstances();
    console.log('Started worker instances---> ', credentials);
}

async function Start(){
    const APP_SERVER_PORT = process.env.APP_SERVER_PORT;

    const app = express();
    const server = http.createServer(app);

    app.use(cors());
    app.use(express.json());

    initWebsocket(server);

    initHttp(app);

    server.listen(APP_SERVER_PORT, '0.0.0.0', ()=>{
        console.log(`Router server listening on PORT: ${APP_SERVER_PORT}`)
    })

    //spin up warm pool instances
    await initEC2Instances();
    
}

Start();

