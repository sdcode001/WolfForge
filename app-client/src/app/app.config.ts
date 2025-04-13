import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withRouterConfig } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { provideStore } from '@ngrx/store';
import { reducers } from '../redux-store/reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMonacoEditor(),
    importProvidersFrom(HttpClientModule), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withHashLocation(), withComponentInputBinding(), withRouterConfig({paramsInheritanceStrategy: 'always'})),
    provideStore({appState: reducers})
  ]
};
