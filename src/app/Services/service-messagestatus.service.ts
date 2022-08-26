import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { MessageStatusDetail } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class ServiceMessagestatusService {

  urlSM = 'http://186.4.176.232:82/api/MessageStatusDetail';
  //urlSM = 'https://localhost:7179/api/MessageStatusDetail';

  constructor(public http: HttpClient) { }

  public getChat(idm:number,idem:number): Observable<MessageStatusDetail[]> {
    return this.http.get<MessageStatusDetail[]>(this.urlSM+"/"+idm+","+idem);
  }

  public marcarLLegado(idu:number):Observable<any>{
    return this.http.put(this.urlSM+"/"+idu,null);
  }

  public marcarVisto(ids:number,idu:number):Observable<any>{
    return this.http.put(this.urlSM+"/"+ids+", "+idu,null);
  }
}
