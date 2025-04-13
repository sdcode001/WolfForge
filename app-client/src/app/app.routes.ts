import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CodeEditorDashboardComponent } from './code-editor-dashboard/code-editor-dashboard.component';

export const routes: Routes = [
    {
        path: 'dashboard/:userId',
        component: DashboardComponent,
        canMatch: [ ]
    },
    {
        path: 'editor/:userId/:template/:projectId/:projectName',
        component: CodeEditorDashboardComponent,
        canMatch: [ ]
    }
];
