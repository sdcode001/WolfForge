require('dotenv').config({path: './.env'});

const {
        GITHUB_USERNAME,
        GITHUB_TOKEN,
        GITHUB_REPO,
        NODE_APP_START_COMMAND,
    } = process.env;


const InstanceEnvSetupScript = `#!/bin/bash
                                    apt-get update -y
                                    apt-get install -y curl git build-essential
                                    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                                    apt-get install -y nodejs
                                    cd /home/ubuntu
                                    git clone https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git
                                    chown -R ubuntu:ubuntu /home/ubuntu/${GITHUB_REPO}
                                    cd ${GITHUB_REPO}
                                    sudo -u ubuntu npm install
                                    sudo -u ubuntu nohup ${NODE_APP_START_COMMAND} > /home/ubuntu/app.log 2>&1 &
                                    `;


module.exports = {
    InstanceEnvSetupScript
}