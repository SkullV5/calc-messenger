import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Message } from 'src/app/models';
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operators';

const TIME=2000; //milisegundos

@Injectable({
  providedIn: 'root'
})
export class ServiceMessageService {

  urlMessage = 'http://186.4.176.232:82/api/Message';
  //urlMessage = 'https://localhost:7179/api/Message';

  constructor(public http: HttpClient) { 
  }

  public getMessage(ids:number,idu:number,inicio:number,cantidad:number): Observable<Message[]> {
    return this.http.get<Message[]>(this.urlMessage+"/"+ids+","+idu+","+inicio+","+cantidad);
  }
  
  public pollMessage(ids:number,idu:number,inicio:number,cantidad:number): Observable<Message[]> {
    return timer(0,TIME).pipe(switchMap(() => this.getMessage(ids,idu,inicio,cantidad)));
  }

  
  public getMessageType(ids:number,tipo:number,inicio:number,cantidad:number): Observable<Message[]> {
    return this.http.get<Message[]>(this.urlMessage+"/Type"+ids+","+tipo+","+inicio+","+cantidad);
  }

  public newMessage(message:Message){
    return this.http.post(this.urlMessage,message);
  }
}
