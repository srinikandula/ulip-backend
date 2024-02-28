import { Injectable } from '@angular/core';
import { Observable, subscribeOn } from 'rxjs';
import {io} from "socket.io-client"

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  readonly uri:string ="http://localhost:5000/"

  constructor() { 
    this.socket = io(this.uri)
  }
  socket:any

  listen(eventName: string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName, (data: any)=>{
        subscriber.next(data)
      })
    })
  }
  
}
