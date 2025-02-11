import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IAppState } from './IAppState';

export const selectAppState = createFeatureSelector<IAppState>('appState');

export const selectFileContent = (projectId: string, filePath: string) => 
    createSelector(
        selectAppState,
        (state) => state.project.get(projectId)?.files.get(filePath) ?? undefined
    );