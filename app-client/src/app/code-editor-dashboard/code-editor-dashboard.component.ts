import { Component, Input, OnInit } from '@angular/core';
import { ProjectMetaData } from '../app.model';
import { SocketServerService } from './socket.service';


@Component({
  selector: 'app-code-editor-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './code-editor-dashboard.component.html',
  styleUrl: './code-editor-dashboard.component.css'
})
export class CodeEditorDashboardComponent implements OnInit {
  @Input({required: true}) projectData?: ProjectMetaData
  ServerSocketId: any

  constructor(private socketService: SocketServerService){}
   
  ngOnInit(){
    this.socketService.connect();
    
    this.socketService.on('connected').subscribe({
      next: async (data) => {
        //start loading spinner 
        this.ServerSocketId = data.SocketId
        console.log(data.Message);
        this.socketService.emit('createProject', this.projectData);
      },
      error: (err) => {
        //stop loading spinner 
        console.log(err);
      }
    });

    this.socketService.on('createProjectResult').subscribe({
      next: async (data) => {
        //stop loading spinner 
        console.log(data);
      },
      error: (err) => {
        //stop loading spinner 
        console.log(err);
      }
    })

  }

  ngOnDestroy(){
    this.socketService.disconnect();
    //stop loading spinner 
  }
  
}
