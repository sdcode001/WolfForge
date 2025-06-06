import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, signal} from '@angular/core';
import { FileDetails, FileNode } from './file-explorer.model';
import { ProjectMetaData } from '../../app.model';
import { SocketServerService } from '../socket.service';
import { getFileIcon } from './file-explorer.util';
import { FileTransferService } from '../file-transfer.service';
import { FormsModule } from '@angular/forms';
import { FileExplorerService } from './file-explorer.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.css'
})
export class FileExplorerComponent implements OnInit{
  @Input({required: true}) dataSource!: FileNode 
  @Input({required: true}) projectData!: ProjectMetaData
  @Output() remove = new EventEmitter<FileNode>();

  isExpanded = signal(false);
  fileContent = ''
  getFileIcon = getFileIcon
  showActions = false;
  showNewFolderOrFileInput = false;  
  newFolderOrFileName = '';
  newResourceType = '';
  private readonly destroy$ = new Subject();


  constructor(private socketServerService: SocketServerService, 
              private fileTransferService: FileTransferService, 
              private elRef: ElementRef,
              private fileExplorerService: FileExplorerService
            ){}


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

  }

  toggleDirectory = () => {
    //load node childern data
    if(this.dataSource?.children?.length == 0){
      this.socketServerService.emit('get-directory', {username: this.projectData.username, projectId: this.projectData.projectId, path: this.dataSource?.path})
    }
    this.isExpanded.update(prev => !prev);
  }

  onFileClick = () => {
    const fileDetails: FileDetails = {
      name: this.dataSource?.name,
      path: this.dataSource?.path,
      projectId: this.projectData.projectId,
      username: this.projectData.username
    }
    
    this.fileTransferService.setSelectedFile(fileDetails);
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


    createNewFolder() {
      this.showNewFolderOrFileInput = true;
      this.newResourceType = 'directory';
      if(!this.isExpanded()){
        this.toggleDirectory();
      }
      this.newFolderOrFileName = '';
    }

    createNewFile(){
      this.showNewFolderOrFileInput = true;
      this.newResourceType = 'file';
      if(!this.isExpanded()){
        this.toggleDirectory();
      }
      this.newFolderOrFileName = '';
    }
  
    async saveNewFolderOrFolder() {
      if (!this.newFolderOrFileName.trim() || this.newResourceType == '') {
        this.showNewFolderOrFileInput = false;
        return;
      }

      this.fileExplorerService.createFileOrFolder(this.projectData.username, this.projectData.projectId, this.dataSource.path, this.newResourceType, this.newFolderOrFileName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if(result.status==1){
            const newFolder: FileNode = {
              type: this.newResourceType,
              name: this.newFolderOrFileName,
              path: result.path,
              children: []
            };
        
            this.dataSource.children = this.dataSource.children || [];
            this.dataSource.children.push(newFolder);

            this.showNewFolderOrFileInput = false;
            this.newResourceType = '';
          }
          else{
            console.log('Unable to create new Folder or File...')
          }
        },
        error: (err) => {
          console.log(err);
          this.showNewFolderOrFileInput = false;
          this.newResourceType = '';
        }
      })
    }


    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
      if (this.showNewFolderOrFileInput && !this.elRef.nativeElement.contains(event.target)) {
        this.showNewFolderOrFileInput = false;
      }
    }

    async deleteFolderOrFile(){
      const isConfirmed = window.confirm(`Are you sure you want to delete ${this.dataSource.name}?`);
      if (isConfirmed) {
        await this.deleteResource();
      }
    }

    async deleteResource(){
         this.fileExplorerService.deleteFileOrFolder(this.projectData.username, this.projectData.projectId, this.dataSource.path, this.dataSource.type)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
            next: (result) => {
                if(result.status==1){
                    this.remove.emit(this.dataSource);
                }
            },
            error: (err) => {
               console.log(err)
            }
         })
    }

    removeChildNode(node: FileNode) {
      this.dataSource.children = this.dataSource.children?.filter(v => v.path != node.path);
    }

}
