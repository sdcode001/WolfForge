import { Component, Input, OnInit } from '@angular/core';
import { ProjectMetaData } from '../app.model';
import { SocketServerService } from './socket.service';
import { FileDetails, FileNode } from './file-explorer/file-explorer.model';
import { FileExplorerComponent } from "./file-explorer/file-explorer.component";
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { FileTransferService } from './file-transfer.service';


@Component({
  selector: 'app-code-editor-dashboard',
  standalone: true,
  imports: [FileExplorerComponent, CodeEditorComponent],
  templateUrl: './code-editor-dashboard.component.html',
  styleUrl: './code-editor-dashboard.component.css'
})
export class CodeEditorDashboardComponent implements OnInit {
  @Input({required: true}) projectData!: ProjectMetaData
  ServerSocketId: any
  isFilesLoaded = 0 //0=loading, 1=loaded, 2=failed to load
  fileDataSource!: FileNode
  fileDetails?: FileDetails
  
  constructor(private socketService: SocketServerService, private fileTransferService: FileTransferService){}
   
  ngOnInit(){
    this.socketService.connect();
    
    this.socketService.on('connected').subscribe({
      next: async (data) => {
        //TODO-start loading spinner 
        this.ServerSocketId = data.SocketId
        console.log(data.Message);
        this.socketService.emit('createProject', this.projectData);
      },
      error: (err) => {
        //TODO-stop loading spinner 
        this.isFilesLoaded = 2
        console.log(err);
      }
    });

    this.socketService.on('createProjectResult').subscribe({
      next: async (data) => {
        //TODO-stop loading spinner 
        if(data.status==1){
          this.fileDataSource = {
            name: this.projectData?.projectName,
            type: 'directory',
            path: '',
            children: this.createRootFileNode(data.data)
          }
          this.isFilesLoaded = 1
        }
        else{
          this.isFilesLoaded = 2
          console.log(data);
        }
      },
      error: (err) => {
        //TODO- stop loading spinner 
        this.isFilesLoaded = 2
        console.log(err);
      }
    })

    this.fileTransferService.selectedFile$.subscribe({
      next: (data) => {
        this.fileDetails = data!;
      }
    })
    
  }

  ngOnDestroy(){
    this.socketService.disconnect();
    //stop loading spinner 
  }

  createRootFileNode(data: {type:string, name: string, path:string}[]): FileNode[]{
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
