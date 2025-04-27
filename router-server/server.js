const { ec2Manager } = require('./aws-ec2-manager');


async function Start() {
    const { instanceId, publicIp } = await ec2Manager.launchInstance();
    console.log(`✅ Your Node app is accessible at: http://${publicIp}:5000 or http://${publicIp}:5001`);
  
    // Example: Shutdown after 2 minutes
    setTimeout(async () => {
      await ec2Manager.terminateInstance(instanceId);
    }, 2 * 60 * 1000); // 2 minutes
}

Start();