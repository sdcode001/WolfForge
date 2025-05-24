import { Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { templateData } from '../dummy.data';
import { DashboardService } from './dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { ProjectMetaData } from '../app.model';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EncryptionService } from '../../utils/encrypt-decrypt-util';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, HeaderComponent, MatSnackBarModule],
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
  isLaunching: boolean = false;

  constructor(
    private readonly dashboardService: DashboardService, 
    private router: Router,
    private snackBar: MatSnackBar,
    private encryptionService: EncryptionService
  ){}

  ngOnInit() {
     
  }

  async onCreateProject() {
    if(this.selectedTemplate!='' && this.projectName!=''){
      this.isCreating = true;
      this.dashboardService.createProject(this.userId, this.selectedTemplate).pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
          this.isCreating = false;
          if(result.status==1){
              const projectData:ProjectMetaData = {
              username: this.userId,
              // projectId: 'b54671c8-250b-477f-966d-c73b6a0aef14',
              projectId: result.projectId,
              // template: 'angular',
              template: this.selectedTemplate,
              projectName: this.projectName
            }

            this.snackBar.open(result.message, 'Close', {
                    duration: 2000,
                    panelClass: ['snackbar-success'],
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
            });

            //request for worker instance
            this.isLaunching = true;
            this.dashboardService.getWorkerInstance(projectData.projectId).pipe(takeUntil(this.destroy$)).subscribe({
              next: async (result) => {
                this.isLaunching = false;
                if(result.status==1){
                  //save instance_ip, instance_id to local storage with encryption.
                  const encrypt_instance_ip = await this.encryptionService.encrypt(result.instance_ip)
                  const encrypt_instance_id = await this.encryptionService.encrypt(result.instance_id)

                  localStorage.setItem('instance_ip', encrypt_instance_ip);
                  localStorage.setItem('instance_id', encrypt_instance_id);

                  this.snackBar.open(result.message, 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-success'],
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                  });
                  this.router.navigate(['/editor', this.userId, projectData.template, projectData.projectId, projectData.projectName])
                }
                else{
                  this.snackBar.open(result.message, 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-error'],
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                  });
                }
              },
              error: (err) => {
                console.log(err.error)
                this.isLaunching = false;
                this.snackBar.open('Something went wrong!', 'Close', {
                  duration: 3000,
                  panelClass: ['snackbar-error'],
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                });
              }
            })

            
          }
          else{
             this.snackBar.open(result.message, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
          }    
        },
        error: (err) => {
          console.log(err.error)
          this.snackBar.open('Something went wrong!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.isCreating = false;
        }
      })
    }
  }
  
}
