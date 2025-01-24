import {io, Socket} from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SocketServerService {
  private SOCKET_SERVER_URL = 'http://localhost:5000';
  private socket!: Socket
  
  connect(){
    this.socket = io(this.SOCKET_SERVER_URL);
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
