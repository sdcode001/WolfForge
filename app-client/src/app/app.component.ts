import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProjectMetaData } from './app.model';
import { CodeEditorDashboardComponent } from "./code-editor-dashboard/code-editor-dashboard.component";


/* If you dynamically load a child component (e.g., via *ngIf, ngSwitch, or component outlet), Angular 
destroys the previously rendered child component when switching to another. The parent component is not 
destroyed unless explicitly removed or the parent route/component is destroyed. */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, DashboardComponent, CodeEditorDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  projectMetaData: ProjectMetaData = {username: 'sdcode001', projectId: 'b54671c8-250b-477f-966d-c73b6a0aef14', projectName: 'angular', template: 'Hello'};

  onCreateProject(data: ProjectMetaData) {
    this.projectMetaData = data;
  }

}
