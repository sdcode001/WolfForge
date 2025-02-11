export interface IAppState {
    project: Map<string, IProject>; //Map<project-id, IProject>
}

export class IProject {
    files: Map<string, string> = new Map(); //Map<file-path, file-content>
    //Add more states
}
