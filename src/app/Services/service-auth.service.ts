import { Injectable } from '@angular/core';
import { HubConnectionState } from '@microsoft/signalr';
import { User } from '../models';
import { ServiceLocalstorageService } from './service-localstorage.service';
import { ServiceSignalrService } from './service-signalr.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceAuthService {

  public isAuthenticated:boolean=false;

  constructor(public serviceSignalR:ServiceSignalrService) { 
    let temUser:User;
    this.serviceSignalR.localStorageService.init().then(()=>{
      this.serviceSignalR.localStorageService.get('userActive').then(data => {
        temUser = data;
        console.log("auth service");
        console.log(temUser);
        if(temUser){
          console.log("pasa auth");
          if(this.serviceSignalR.hubConnection.state==HubConnectionState.Connected){
            this.reauthMeListener();
            this.reauthMe(temUser.iD_U);
          }else{
            this.serviceSignalR.ssObs().subscribe((obj: any) => {
              if (obj.type == "HubConnStarted") {
                this.reauthMeListener();
                this.reauthMe(temUser.iD_U);
              }
          });
          }
        }
      });
    });
  }
    
  async authMe(user:string, pass:string){
    await this.serviceSignalR.hubConnection.invoke("authMe",user, pass).then(()=>{
      console.log("auth invoke");
    }).catch(err=>console.log(err));
  }
/*
  public authMeListenerSuccess(){
    this.serviceSignalR.hubConnection.on("authMeResponseSuccess",(user:User)=>{
      console.log("Logeado");
      localStorage.setItem("userActive",user.iD_U+"");
      this.isAuthenticated=true;
      this.serviceSignalR.user={...user};
      this.serviceSignalR.router.navigateByUrl("/home/chat");
    })
  }

  public authMeListenerFail(){
    return this.serviceSignalR.hubConnection.on("authMeResponseFail",()=>{
      console.log("Logeo fallido");
    })
  }*/

  async reauthMe(id:number){
    await this.serviceSignalR.hubConnection.invoke("reauthMe",id)
    .then(()=>console.log("Reconectado"))
    .catch(err=>console.log(err));
  }

  reauthMeListener() {
    this.serviceSignalR.hubConnection.on("reauthMeResponse", (user:User) => {
        this.serviceSignalR.user = {...user};
        this.isAuthenticated = true;
        console.log("Re-authenticated!");
        //if (this.serviceSignalR.router.url == "/calculadora") this.serviceSignalR.router.navigateByUrl("home/chats");
    });
  }

  ////Salir
  logOut(){
    this.serviceSignalR.hubConnection.invoke("logOut", this.serviceSignalR.user.iD_U)
    .catch(err=>console.error(err));
  }
  logOutList(){
    this.serviceSignalR.hubConnection.on("logoutResponse",()=>{
      this.serviceSignalR.localStorageService.removeall();
      location.reload();

    });
  }
}
