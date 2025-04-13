import { Component, Input, OnInit } from '@angular/core';
import { ProjectMetaData } from '../app.model';
import { SocketServerService } from './socket.service';
import { FileDetails, FileNode } from './file-explorer/file-explorer.model';
import { FileExplorerComponent } from "./file-explorer/file-explorer.component";
import { CodeEditorComponent } from "./code-editor/code-editor.component";
import { FileTransferService } from './file-transfer.service';
import { Store } from '@ngrx/store';
import { IAppState } from '../../redux-store/IAppState';
import * as reduxActions from '../../redux-store/actions'
import { TerminalComponent } from "./terminal/terminal.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-code-editor-dashboard',
  standalone: true,
  imports: [FileExplorerComponent, CodeEditorComponent, TerminalComponent, CommonModule],
  templateUrl: './code-editor-dashboard.component.html',
  styleUrl: './code-editor-dashboard.component.css'
})
export class CodeEditorDashboardComponent implements OnInit {
  @Input() userId!: string;
  @Input() template!: string;
  @Input() projectId!: string;
  @Input() projectName!: string;
  ServerSocketId: any
  isFilesLoaded = 0 //0=loading, 1=loaded, 2=failed to load
  fileDataSource!: FileNode
  fileDetails?: FileDetails
  isTerminalOpen: boolean = false;
  projectData!: ProjectMetaData;
  

  constructor(private socketService: SocketServerService, private fileTransferService: FileTransferService, private reduxStore: Store<IAppState>){}
   
  ngOnInit(){
    this.projectData = {
      username: this.userId,
      projectId: this.projectId,
      projectName: this.projectName,
      template: this.template
    }
    
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
    
    //register window event listener that will trigger before page- reload, close tab, navigate away
    window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
  }

  ngOnDestroy(){
    //clean up window event listeners- good practice
    window.removeEventListener('beforeunload', this.beforeUnloadHandler.bind(this));

    this.socketService.disconnect();
    this.reduxStore.dispatch(reduxActions.removeAllFilesContent({projectId: this.projectData.projectId}))
    //stop loading spinner 
  }

  beforeUnloadHandler(event: BeforeUnloadEvent){
    this.socketService.emit('disconnecting-project', { projectId: this.projectId, username: this.userId });
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

  toggleTerminal() {
    this.isTerminalOpen = !this.isTerminalOpen;
  }

  removeChildNode(node: FileNode) {
    this.fileDataSource.children = this.fileDataSource.children?.filter(v => v.path != node.path);
  }
  
}
