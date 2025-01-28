const fs = require('fs');
const path = require('path');


class FileManager {

   async createDirectory(dirPath) {
       return new Promise(async (resolve, reject) => {
           //when recursive=true, it will recursively create directory from parent to child.
           fs.mkdir(dirPath, {recursive: true}, (err) => {
            if (err) {
               return reject(err)
            }
            resolve()
           });
       });
    }

   async writeFile(filepath, fileContent){
       return new Promise(async (resolve, reject) => {
          //first create directories of filepath if not exists.
          await this.createDirectory(path.dirname(filepath));
          
          fs.writeFile(filepath, fileContent, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
          });
       });
    }

    async getDirectory(dirPath, basePath){
        return new Promise(async (resolve, reject) => {
            fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(files.map(file => ({type: file.isDirectory() ? 'directory' : 'file', name: file.name, path: `${basePath}/${file.name}`})));
                }
            })
        });
    }

    async getFileContent(filePath){
        return new Promise(async (resolve, reject) => {
            fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            })
        })
    }
    

}

const fileManager = new FileManager();

module.exports = {
    fileManager
}
