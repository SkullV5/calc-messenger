import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operators';
import { ChatUsers, User } from '../models';
import { ServiceSignalrService } from './service-signalr.service';

const TIME=2000; //milisegundos

@Injectable({
  providedIn: 'root'
})
export class ServiceUserService {
  urlUser = 'http://186.4.176.232:82/api/User';
  //urlUser = 'https://localhost:7179/api/User';

  constructor(public http: HttpClient) { }
 
  /*public getContact(): Observable<ChatUsers[]> {
    return this.http.get<ChatUsers[]>(this.urlUser+"/Contact");
  }

  public pollContact(): Observable<ChatUsers[]> {
    return timer(0,TIME).pipe(switchMap(() => this.getContact()));
  }*/
  
///////////////////////////////////
  /*public getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.urlUser);
  }

  public pollUser(): Observable<User[]> {
    return timer(0,TIME).pipe(switchMap(() => this.getUser()));
  }*/
/*
  public getUserById(idu:number): Observable<User> {
    return this.http.get<User>(this.urlUser+"/"+idu);
  }*//*
  public VerifyCredencial(usuario:string, contrasenia:string): Observable<User> {
    return this.http.get<User>(this.urlUser+"/"+usuario+","+contrasenia);
  }*/
  public VerifyAccess(codigo:string): Observable<boolean> {
    return this.http.get<boolean>(this.urlUser+"/VerifyAccess/"+codigo);
  }
  public VerifyConnection(): Observable<boolean> {
    return this.http.get<boolean>(this.urlUser+"/VerifyConnection");
  }

  public updateUser(user:User):Observable<any>{
    return this.http.put(this.urlUser, user);
  }

  public updateStatus(user:User):Observable<any>{
    return this.http.put(this.urlUser+"/updateStatus",user);
  }

  public updateCode(coda:string, cod:string):Observable<any>{
    return this.http.put(this.urlUser+"/updateCode/"+coda+","+cod,null);
  }

  public disabled(idu:number):Observable<any>{
    return this.http.put(this.urlUser+"/disabled/"+idu, null);
  }
/*
  public insertUser(user:User):Observable<any>{
    return this.http.post(this.urlUser, user);
  }*/

/* 
  getContact(){
    return new Promise(resolve=>{
      this.http.get(this.url).subscribe(data=>{
        console.log(data),
          resolve(data);
      },error=>{
        console.log(error);
      });
    });
  }*/
}
