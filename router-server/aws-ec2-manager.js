const AWS = require('aws-sdk');
require('dotenv').config({ path: './.env' });
const { InstanceEnvSetupScript } = require('./scripts')


AWS.config.update({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_BUCKET_REGION
});

const ec2 = new AWS.EC2();

class EC2Manager {

    async launchInstances(warmPoolCount) {

        const {
            EC2_SECURITY_GROUP_ID
        } = process.env;


        const params = {
            ImageId: 'ami-006a6296aa17e4546', // Ubuntu 20.04 in eu-north-1
            InstanceType: 't3.micro',
            MinCount: 1,
            MaxCount: warmPoolCount,
            KeyName: 'wolfforge-worker-key',
            SecurityGroupIds: [EC2_SECURITY_GROUP_ID],
            UserData: Buffer.from(InstanceEnvSetupScript).toString('base64'),
            TagSpecifications: [
                {
                    ResourceType: 'instance',
                    Tags: [
                        { Key: 'Name', Value: 'WolfForgeWorkerServerGroup' }
                    ]
                }
            ]
        };
 
        const data = await ec2.runInstances(params).promise();
        const instanceIds = data.Instances.map(v => v.InstanceId);

        await ec2.waitFor('instanceRunning', { InstanceIds: instanceIds }).promise();

        const desc = await ec2.describeInstances({ InstanceIds: instanceIds }).promise();
        const publicIps = desc.Reservations[0].Instances.map(v => v.PublicIpAddress);

        return { instanceIds, publicIps };
    }


    async terminateInstance(instanceIds) {
        const params = {
            InstanceIds: instanceIds
        };
        await ec2.terminateInstances(params).promise();
        console.log('Terminated instance:', instanceIds);
    }

}

const ec2Manager = new EC2Manager();

module.exports = {
    ec2Manager
}