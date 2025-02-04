
export type FileNode = {
    name: string;
    path: string;
    type: string;
    children?: FileNode[];
   };

export type FileDetails = {
    name: string;
    path: string;
    projectId: string;
    username: string;
}