import { createAction, props } from "@ngrx/store";


export const getFileContent = createAction(
    'GET_FILE_CONTENT',
    props<{projectId: string, filePath: string}>()
)

export const addOrUpdateFileContent = createAction(
    'ADD_OR_UPDATE_FILE_CONTENT',
    props<{projectId: string, filePath: string, content: string}>()
)

export const removeFileContent = createAction(
    'REMOVE_FILE_CONTENT',
    props<{projectId: string, filePath: string}>()
)

export const removeAllFilesContent = createAction(
    'REMOVE_ALL_FILES_CONTENT',
    props<{projectId: string}>()
)