import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FileDetails } from '../file-explorer/file-explorer.model';
import { SocketServerService } from '../socket.service';
import { fileExtensionToLanguage } from './code-editor.util';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
})
export class CodeEditorComponent implements OnInit, OnChanges{
  @Input({required: true}) fileDetails?: FileDetails
  fileContent: string = ''
  language?: string = ''

  editorOptions = {
    theme: 'vs-dark',   
    language: 'javascript',  //default language
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    fontSize: 14,
    lineHeight: 20
  };
  
  constructor(private socketServerService: SocketServerService){}

  
  ngOnInit(){
    this.setEditorOptions();
    //on file content recieved
    this.socketServerService.on('file-content').subscribe({
      next: (data) => {
         this.fileContent = data.data.toString();
      },
      error: (err) => {
         console.log(err);
      }
    })

    //load file content
    this.socketServerService.emit('get-file-content', {username: this.fileDetails?.username, projectId: this.fileDetails?.projectId, path: this.fileDetails?.path});
  }


  ngOnChanges(){
    this.setEditorOptions();
    //load file content
    this.socketServerService.emit('get-file-content', {username: this.fileDetails?.username, projectId: this.fileDetails?.projectId, path: this.fileDetails?.path});
  }


  getLanguage(fileName?: string){
     const items = fileName?.split('.');
     const ext = items?.at(items.length-1) || 'js';
     return fileExtensionToLanguage[ext] || 'plaintext'
  }
 
  setEditorOptions(){
    this.language = this.getLanguage(this.fileDetails?.name);
    this.editorOptions = {
      theme: 'vs-dark',   
      language: this.language,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      fontSize: 14,
      lineHeight: 20
    };
  }

}
