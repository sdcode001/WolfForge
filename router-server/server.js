const { ec2Manager } = require('./aws-ec2-manager');


async function Start() {
    const { instanceIds, publicIps } = await ec2Manager.launchInstances(5);
    console.log('Launched instances:', instanceIds);
    console.log('Public IPs:', publicIps);
    //Shutdown after 2 minutes
    setTimeout(async () => {
       await ec2Manager.terminateInstance(instanceIds);
    }, 2 * 60 * 1000); // 2 minutes
}

Start();