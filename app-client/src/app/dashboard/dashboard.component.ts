import { Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { templateData } from '../dummy.data';
import { DashboardService } from './dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { ProjectMetaData } from '../app.model';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  @Input() userId!: string
  selectedTemplate = '';
  projectName = '';
  private readonly destroy$ = new Subject();
  templateData = templateData
  isCreating: boolean = false;

  constructor(private readonly dashboardService: DashboardService, private router: Router){}

  ngOnInit() {
     
  }

  async onCreateProject() {
    if(this.selectedTemplate!='' && this.projectName!=''){
      this.isCreating = true;
      this.dashboardService.createProject(this.userId, this.selectedTemplate).pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
           const projectData:ProjectMetaData = {
            username: this.userId,
            // projectId: result.projectId,
            projectId: 'b54671c8-250b-477f-966d-c73b6a0aef14',
            // template: this.selectedTemplate,
            template: 'angular',
            projectName: this.projectName
           }
           this.isCreating = false;
           this.router.navigate(['/editor', this.userId, projectData.template, projectData.projectId, projectData.projectName])
        },
        error: (err) => {
          console.log(err.error)
          this.isCreating = false;
        }
      })
    }
  }
  
}
