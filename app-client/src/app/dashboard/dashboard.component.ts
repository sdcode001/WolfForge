import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { templateData, profileData } from '../dummy.data';
import { DashboardService } from './dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { ProjectMetaData } from '../app.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @Output () create = new EventEmitter<ProjectMetaData>();
  selectedTemplate = '';
  projectName = '';
  private readonly destroy$ = new Subject();
  templateData = templateData
  profileData = profileData;
  isCreating: boolean = false;

  constructor(private readonly dashboardService: DashboardService){}

  async onCreateProject() {
    if(this.selectedTemplate!='' && this.projectName!=''){
      this.isCreating = true;
      this.dashboardService.createProject(profileData.username, this.selectedTemplate).pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
           const projectData:ProjectMetaData = {
            username: profileData.username,
            projectId: result.projectId,
            template: this.selectedTemplate,
            projectName: this.projectName
           }
           this.isCreating = false;
           this.create.emit(projectData);
        },
        error: (err) => {
          console.log(err.error)
          this.isCreating = false;
        }
      })
    }
  }
  
}
