import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FileDetails } from '../file-explorer/file-explorer.model';
import { SocketServerService } from '../socket.service';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
})
export class CodeEditorComponent implements OnInit, OnChanges{
  @Input({required: true}) fileDetails?: FileDetails
  fileContent: string = ''
 
  constructor(private socketServerService: SocketServerService){}

  ngOnInit(){
    //on file content recieved
    this.socketServerService.on('file-content').subscribe({
      next: (data) => {
         this.fileContent = data.data;
      },
      error: (err) => {
         console.log(err);
      }
    })

    //load file content
    this.socketServerService.emit('get-file-content', {username: this.fileDetails?.username, projectId: this.fileDetails?.projectId, path: this.fileDetails?.path});
  }

  ngOnChanges(){
    //load file content
    this.socketServerService.emit('get-file-content', {username: this.fileDetails?.username, projectId: this.fileDetails?.projectId, path: this.fileDetails?.path});
  }


}
