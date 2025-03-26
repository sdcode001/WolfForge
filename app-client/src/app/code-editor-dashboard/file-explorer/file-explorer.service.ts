import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class FileExplorerService {
     private readonly WORKER_SERVER_API1: string = 'http://localhost:5000/create-file-folder';
     private readonly WORKER_SERVER_API2: string = 'http://localhost:5000/delete-file-folder';

     constructor(private http: HttpClient){ }


     public createFileOrFolder(username: string, projectId: string, path: string, type: string, name: string): 
     Observable<{status: number, path: string}>
     {
          const body = {
            username: username,
            projectId: projectId,
            path: path,
            type: type,
            name: name
          }

          return this.http.post<{status: number, path: string}>(this.WORKER_SERVER_API1, body);
     }

     public deleteFileOrFolder(username: string, projectId: string, path: string, type: string): 
     Observable<{status: number}>
     {
          const body = {
            username: username,
            projectId: projectId,
            path: path,
            type: type
          }

          const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: body 
          };

          return this.http.delete<{status: number}>(this.WORKER_SERVER_API2, httpOptions);
     }

}
