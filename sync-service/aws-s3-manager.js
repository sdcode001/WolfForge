const path = require('path');
const { S3 } = require('aws-sdk');
require('dotenv').config({path: './.env'});


const s3_manager_driver = new S3({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_BUCKET_REGION
})

class S3BucketManager {
    async fileContentUpdateToS3(projectId, filePath, fileContent){
         const sourcePath = `projects/${projectId}`;
         const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
            Key: `${sourcePath}${filePath}`,
            Body: fileContent
         }

         try{
             await s3_manager_driver.putObject(params).promise();
         }
         catch(err){
            console.error('Error copying folder to server:', err);
         }
    }
}

const s3Manager = new S3BucketManager();

module.exports = {
    s3Manager
}