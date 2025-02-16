import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FileDetails } from '../file-explorer/file-explorer.model';
import { SocketServerService } from '../socket.service';
import { fileExtensionToLanguage } from './code-editor.util';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import * as monaco from 'monaco-editor';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../../redux-store/IAppState';
import * as reduxActions from '../../../redux-store/actions'
import { firstValueFrom } from 'rxjs';
import { selectFileContent } from '../../../redux-store/selectors';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule, CommonModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
})
export class CodeEditorComponent implements OnInit, OnChanges, OnDestroy{
  @Input({required: true}) fileDetails!: FileDetails
  editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
  fileContent: string = ''
  language?: string = ''
  lastChangeTimeStamp?: Date = undefined
  intervalId?: number | ReturnType<typeof setInterval> = undefined;
  syncDelay = 1000;
  lastSyncIntervalSecond = 2;
  autoFileSyncStatus = 0; //0 = stop, 1 = start
  autoSaveStatus = 1; //0 = failed, 1 = saved, 2 = saving..


  editorOptions = {
    theme: 'vs-dark',   
    language: 'javascript', //default language
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    fontSize: 14,
    lineHeight: 20
  };
  
  constructor(
    private socketServerService: SocketServerService, 
    private reduxStore: Store<IAppState>
  ){}

  
  ngOnInit(){
    this.setEditorOptions();
    //on file content recieved
    this.socketServerService.on('file-content').subscribe({
      next: (data) => {
         this.fileContent = data.data.toString();
         this.autoFileSyncStatus = 0;
         //save to redux state
         this.reduxStore.dispatch(reduxActions.addOrUpdateFileContent(
          {
            projectId: this.fileDetails.projectId,
            filePath: this.fileDetails.path,
            content: this.fileContent
          }
        ))
      },
      error: (err) => {
         console.log(err);
      }
    })


    this.socketServerService.on('file-update-result').subscribe({
      next: (data) => {
         this.autoFileSyncStatus = 0;
         if(data.status == 1){
            this.autoSaveStatus = 1;
         }
         else{
           this.autoSaveStatus = 0;
         }
      },
      error: (err) => {
        this.autoFileSyncStatus = 0;
        this.autoSaveStatus = 0;
        console.log(err);
      }
    })

    this.startCodeSync()
  }


  ngOnDestroy() {
    this.stopCodeSync();
    this.reduxStore.dispatch(reduxActions.removeFileContent({
      projectId: this.fileDetails.projectId,
      filePath: this.fileDetails.path
    }))
  }


  async ngOnChanges(){
    this.setEditorOptions();
    this.lastChangeTimeStamp = undefined;
    this.autoFileSyncStatus = 1;
    this.autoSaveStatus = 1;
    this.fileContent = ''
    //check it file content already saved in redux state or not
    const fileContentState = await this.getFileContentFromReduxState(this.fileDetails.projectId, this.fileDetails.path);
    if(fileContentState != undefined){
      this.fileContent = fileContentState;
      this.autoFileSyncStatus = 0;
    }
    else{
      //send event to load file content
      this.socketServerService.emit('get-file-content', {
        username: this.fileDetails?.username, 
        projectId: this.fileDetails?.projectId, 
        path: this.fileDetails?.path
      });
    }
  }

  getAutoSaveText() {
    if(this.autoSaveStatus==1){return 'Saved';}
    else if(this.autoSaveStatus==0){return 'Failed to save';}
    return 'Saving...';
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
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      fontSize: 14,
      lineHeight: 20
    };
  }


  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editorInstance = editor;

    // Event Listener: Content Change
    editor.onDidChangeModelContent(() => {
      this.autoFileSyncStatus = 1;
      this.autoSaveStatus = 2;
      this.fileContent = editor.getValue();
      this.lastChangeTimeStamp = new Date(); 
      //save file-content state to redux
      this.reduxStore.dispatch(reduxActions.addOrUpdateFileContent(
        {
          projectId: this.fileDetails.projectId,
          filePath: this.fileDetails.path,
          content: this.fileContent
        }
      ))
    });

    // Event Listener: Cursor Position Change
    editor.onDidChangeCursorPosition((e) => {
      console.log('Cursor moved to:', e.position);
    });

    // Event Listener: Blur
    editor.onDidBlurEditorWidget(() => {
      console.log('Editor lost focus');
    });

  }

  async getFileContentFromReduxState(projectId: string, filePath: string): Promise<string | undefined> { 
      return await firstValueFrom(this.reduxStore.pipe(select(selectFileContent(projectId, filePath))))
  }

  //It will only send socket event for code change for last lastSyncIntervalSecond seconds
  //Reducing unnecessary network call
  startCodeSync(){
     this.intervalId = setInterval(() => {
        if(this.lastChangeTimeStamp != undefined){
          const timeDiff = new Date().getSeconds() - this.lastChangeTimeStamp.getSeconds();
          //check last code change lastSyncIntervalSecond seconds ao or not
          if(timeDiff == this.lastSyncIntervalSecond){
            //send event to socket Server
            this.socketServerService.emit('update-file-content', {
              username: this.fileDetails?.username, 
              projectId: this.fileDetails?.projectId, 
              path: this.fileDetails?.path, 
              content: this.fileContent
            });
          }
        }
     }, this.syncDelay)
  }

  stopCodeSync(){
    if(this.intervalId != undefined){
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }


}
