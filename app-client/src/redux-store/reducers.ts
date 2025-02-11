import { createReducer, on } from '@ngrx/store';
import * as Actions from './actions';
import { IAppState, IProject } from './IAppState';

export const initialState: IAppState = {
    project: new Map()
}

export const reducers = createReducer(
    initialState,

    on(Actions.getFileContent, (state, action) => {
        return { ...state }; //No state change, just return the current state
    }),

    on(Actions.addOrUpdateFileContent, (state, action) => {
       const myProject = state.project.get(action.projectId);
       if(myProject!=undefined){
         myProject.files.set(action.filePath, action.content);
         state.project.set(action.projectId, myProject);
       }
       else{
         const newProjectState = new IProject()
         newProjectState.files.set(action.filePath, action.content);
         state.project.set(action.projectId, newProjectState);
       }
       return state;
    }),

    on(Actions.removeAllFilesContent, (state, action) => {
        if(state.project.has(action.projectId)){
            state.project.delete(action.projectId);
        }
        return state;
    }),

    on(Actions.removeFileContent, (state, action) => {
        if(state.project.has(action.projectId)){
            const myProject = state.project.get(action.projectId);
            if(myProject!=undefined && myProject?.files.has(action.filePath)){
               myProject.files.delete(action.filePath);
               state.project.set(action.projectId, myProject);
            }  
        }
        return state;
    })

);
