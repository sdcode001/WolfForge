import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { FileNode } from './file-explorer.model';
import { ProjectMetaData } from '../../app.model';
import { SocketServerService } from '../socket.service';
import { getFileIcon } from './file-explorer.util';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.css'
})
export class FileExplorerComponent implements OnInit{
  @Input({required: true}) dataSource!: FileNode 
  @Input({required: true}) projectData!: ProjectMetaData

  isExpanded = signal(false);
  fileContent = ''
  getFileIcon = getFileIcon

  constructor(private socketServerService: SocketServerService){}

  ngOnInit(){
    //If root node then expand it
    if(this.dataSource?.name==this.projectData.projectName){
      this.isExpanded.update(prev => !prev);
    }

    if(this.dataSource?.type == 'directory'){
      this.socketServerService.on('directory-content').subscribe({
        next: (data) => {
          if(data.path == this.dataSource?.path){
            this.dataSource.children = this.createFileNode(data.data);
          }
        },
        error: (err) => {
           console.log(err);
        }
      })
    };

    if(this.dataSource.type == 'file'){
      this.socketServerService.on('file-content').subscribe({
        next: (data) => {
          if(data.path == this.dataSource?.path){
            this.fileContent = data.data;
            //TODO- send file content to file-editor
            console.log(this.fileContent)
          }
        },
        error: (err) => {
           console.log(err);
        }
      })
    }

  }

  toggleDirectory = () => {
    //load node childern data
    if(this.dataSource?.children?.length == 0){
      this.socketServerService.emit('get-directory', {username: this.projectData.username, projectId: this.projectData.projectId, path: this.dataSource?.path})
    }
    this.isExpanded.update(prev => !prev);
  }

  onFileClick = () => {
    //load file content
    if(this.fileContent == ''){
      this.socketServerService.emit('get-file-content', {username: this.projectData.username, projectId: this.projectData.projectId, path: this.dataSource?.path})
    }
    else{
      //TODO- send file content to file-editor
      console.log(this.fileContent)
    }
  }

  createFileNode(data: {type:string, name: string, path:string}[]): FileNode[]{
      let result: FileNode[] = []
      data.forEach(ele => {
          let node: FileNode = {
            type: ele.type,
            name: ele.name,
            path: ele.path     
          }
          if(ele.type == 'directory'){
            node.children = []
          }
          else{
            node.children = undefined
          }
          result.push(node)
      })
      return result;
    }

}
