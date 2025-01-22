import { Component, Input, OnInit } from '@angular/core';
import { ProjectMetaData } from '../app.model';


@Component({
  selector: 'app-code-editor-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './code-editor-dashboard.component.html',
  styleUrl: './code-editor-dashboard.component.css'
})
export class CodeEditorDashboardComponent implements OnInit {
  @Input({required: true}) projectData?: ProjectMetaData
   
  ngOnInit(){
    console.log(this.projectData)
  }
  
}
