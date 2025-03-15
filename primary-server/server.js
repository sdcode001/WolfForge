const http = require('http');
const express = require('express')
const cors = require('cors')
const { initHttp } = require('./app-http')
require('dotenv').config({path: './.env'})


const app = express();
const server = http.createServer(app);

const APP_SERVER_PORT = process.env.APP_SERVER_PORT;

app.use(cors());

initHttp(app);

server.listen(APP_SERVER_PORT, () => {
    console.log('Primary Server listening to PORT:',APP_SERVER_PORT);
})
