const path = require('path');
const { S3 } = require('aws-sdk');
require('dotenv').config({path: './.env'});


const s3_manager_driver = new S3({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_BUCKET_REGION
})


class S3BucketManager {

   async copyFromS3TemplateToProject(username, project, id, continuationToken) {
      const sourcePath = `templates/${project}`;
      const destinationPath = `projects/${username}/${id}`;

      try{
         //get list of files from source directory in bucket.
         const listConfig = {
            Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
            Prefix: sourcePath,
            ContinuationToken: continuationToken
         }
 
         //when using listObjectsV2, S3 limits results to 1000 objects per response. 
         const filesList = await s3_manager_driver.listObjectsV2(listConfig).promise();

         if(!filesList.Contents || filesList.Contents.length===0){ return {status: 0}; }

         //copy all files to destination directory in parallel using Promise.all()
         await Promise.all(filesList.Contents.map( async (file) => {
            if(!file.Key){ return {status: 0}; }

            const destinationKey = file.Key.replace(sourcePath, destinationPath);
            const copyObjectConfig = {
               Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
               CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${file.Key}`,
               Key: destinationKey
            }

            //copy object
            await s3_manager_driver.copyObject(copyObjectConfig).promise();

         }));

         // When using listObjectsV2, S3 limits results to 1000 objects per response. 
         // If more objects exist, IsTruncated is true, and NextContinuationToken is provided to fetch the next batch. 
         // Call this method to copy the next batch.
         let result = 1;
         if(filesList.IsTruncated){
            listConfig.ContinuationToken = filesList.ContinuationToken;
            result = await this.copyFromS3TemplateToProject(username, project, id, listConfig.ContinuationToken).status;
         }   

         return {status: result};
      }
      catch(ex) {
         console.error('Error copying folder to S3 bucket:', ex);
         return {status: 0};
      }
   }

   
};


const s3Manager = new S3BucketManager();

module.exports = {
   s3Manager
}