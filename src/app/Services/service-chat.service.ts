import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operators';
import { Chat, ChatActive, ChatUsers } from 'src/app/models';

const TIME=2000; //milisegundos

@Injectable({
  providedIn: 'root'
})
export class ServiceChatService {

  urlChat = 'http://186.4.176.232:82/api/Chat';
  //urlChat = 'https://localhost:7179/api/Chat';

  constructor(public http: HttpClient) { }

  public getChat(idu:number): Observable<ChatActive[]> {
    return this.http.get<ChatActive[]>(this.urlChat+"/"+idu);
  }
  
  public pollChat(idu:number): Observable<ChatActive[]> {
    return timer(0,TIME).pipe(switchMap(() => this.getChat(idu)));
  }

  public getUserInChat(ids:number): Observable<ChatUsers[]> {
    return this.http.get<ChatUsers[]>(this.urlChat+"/usersInChat/"+ids);
  }

  public pollUserInChat(ids:number): Observable<ChatUsers[]> {
    return timer(0,TIME).pipe(switchMap(() => this.getUserInChat(ids)));
  }

  public GetChatByContact(idu1:number,idu2:number): Observable<Chat> {
    return this.http.get<Chat>(this.urlChat+"/"+idu1+","+idu2);
  }
}
