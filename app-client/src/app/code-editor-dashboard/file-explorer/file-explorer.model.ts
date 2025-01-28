
export type FileNode = {
    name: string;
    path: string;
    type: string;
    children?: FileNode[];
   };