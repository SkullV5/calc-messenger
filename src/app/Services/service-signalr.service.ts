import { Injectable } from '@angular/core';
import { User } from '../models';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ServiceLocalstorageService } from './service-localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceSignalrService {
  public user:User;
  public hubConnection: HubConnection;

  ssSubj=new Subject<any>();
  ssObs():Observable<any>{
    return this.ssSubj.asObservable();
  }

  constructor(public router:Router,public localStorageService: ServiceLocalstorageService) {}
  
  startConnection = () =>{
    this.hubConnection = new HubConnectionBuilder()// https://localhost:7179/cnn
    .withUrl("http://186.4.176.232:82/cnn").withAutomaticReconnect().build();
    this.hubConnection.start().then(()=>{
      console.log("Conectado");
      this.ssSubj.next({type:"HubConnStarted"});
    }).catch(error=>{console.log("Error"+error);
      setTimeout(this.startConnection, 5000);
    }
    );
  }
}
