import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class FileExplorerService {
     private readonly WORKER_SOCKET_SERVER_PORT = 5000;
     private WORKER_INSTANCE_IP: string = '';

     constructor(private http: HttpClient){ }

     connect(instance_ip: string){
        this.WORKER_INSTANCE_IP = instance_ip;
     }

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

          return this.http.post<{status: number, path: string}>(`http://${this.WORKER_INSTANCE_IP}:${this.WORKER_SOCKET_SERVER_PORT}/create-file-folder`, body);
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

          return this.http.delete<{status: number}>(`http://${this.WORKER_INSTANCE_IP}:${this.WORKER_SOCKET_SERVER_PORT}/delete-file-folder`, httpOptions);
     }

}
