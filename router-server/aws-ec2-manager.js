const AWS = require('aws-sdk');
require('dotenv').config({path: './.env'});


const GITHUB_USERNAME = 'sdcode001';
const GITHUB_TOKEN = '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'; 
const GITHUB_REPO = 'WolfForge-Worker-Server';
const EC2_SECURITY_GROUP_ID = 'sg-010f01d0a964c969e'; // Should allow 5000 and 5001
const NODE_APP_START_COMMAND = 'npm start'


AWS.config.update({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_BUCKET_REGION
});

const ec2 = new AWS.EC2();

class EC2Manager {

    async launchInstance() {
        const instanceEnvSetupScript = `#!/bin/bash
                                apt-get update -y
                                apt-get install -y curl git
                                curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                                apt-get install -y nodejs
                                cd /home/ubuntu
                                git clone https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git
                                cd ${GITHUB_REPO}
                                npm install
                                ${NODE_APP_START_COMMAND}
                                `;
      
        const params = {
          ImageId: 'ami-006a6296aa17e4546', // Ubuntu 20.04 LTS AMI ID for eu-north-1
          InstanceType: 't2.micro', //CPUs- 1, RAM- 1 GiB, Architecture- x86_64, Storage- EBS only(Elastic Block Storage, no local disk)
          MinCount: 1,
          MaxCount: 1,
          SecurityGroupIds: [EC2_SECURITY_GROUP_ID],
          UserData: Buffer.from(instanceEnvSetupScript).toString('base64'),
          TagSpecifications: [
            {
              ResourceType: 'instance',
              Tags: [
                { Key: 'Name', Value: 'WolfForgeWorkerServer' }
              ]
            }
          ]
        };
      
        const data = await ec2.runInstances(params).promise();
        const instanceId = data.Instances[0].InstanceId;
        console.log('Launched instance:', instanceId);
      
        await ec2.waitFor('instanceRunning', { InstanceIds: [instanceId] }).promise();
      
        const desc = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
        const publicIp = desc.Reservations[0].Instances[0].PublicIpAddress;
        console.log('Public IP:', publicIp);
      
        return { instanceId, publicIp };
    }

    async terminateInstance(instanceId) {
        const params = {
          InstanceIds: [instanceId]
        };
        await ec2.terminateInstances(params).promise();
        console.log('Terminated instance:', instanceId);
    }

}

const ec2Manager = new EC2Manager();

module.exports = {
    ec2Manager
}