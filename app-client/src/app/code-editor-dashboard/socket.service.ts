import {io, Socket} from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SocketServerService {
  //worker server
  private WORKER_SOCKET_SERVER_PORT = '5000';
  private socket!: Socket
  
  connect(instance_ip: string){
    const instance_url = `http://${instance_ip}:${this.WORKER_SOCKET_SERVER_PORT}`;
    this.socket = io(instance_url);
  }
  
  emit(event: string, data: any){
    if(this.socket != null){
        this.socket.emit(event, data);
    }
    else{
        console.log('Socket server not connected!')
    }
  }

  on(event: string): Observable<any>{
     return new Observable(observer => {
        this.socket.on(event, (data) => {
            observer.next(data);
        })
     })
  }

  disconnect(){
    if(this.socket != null){
        this.socket.disconnect();
    }
  }

}
