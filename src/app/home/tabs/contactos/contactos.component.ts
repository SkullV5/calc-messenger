import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ServiceChatService } from 'src/app/Services/service-chat.service';
import { ServiceLocalstorageService } from 'src/app/Services/service-localstorage.service';
import { ServiceSignalrService } from 'src/app/Services/service-signalr.service';
import { ServiceUserService } from 'src/app/Services/service-user.service';
import { Chat, ChatActive, ChatUsers, User } from '../../../models';
import { ChatComponent } from '../../components/chat/chat.component';
import { ContactoComponent } from '../../components/contacto/contacto.component';

import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
})

export class ContactosComponent implements OnInit, OnDestroy {
  arrayContact:ChatUsers[]=[]; 
  useraux:User;
  searchTerm: string="";
  fechaHoy:Date;
  fechaAyer:Date;
  user:User;
  sala:Chat;
  salaux:ChatActive;
  
  contSubscription: Subscription;
  
  constructor(public modalController: ModalController, public navCtrl: NavController, public chatServices: ServiceChatService,public localStorageService: ServiceLocalstorageService,
    private serviceSignalR:ServiceSignalrService) {
    this.fechaHoy=new Date()
    this.fechaHoy.setHours(0);
    this.fechaHoy.setMinutes(0);
    this.fechaHoy.setSeconds(0);
    this.fechaAyer=new Date(this.fechaHoy);
    this.fechaAyer.setDate(this.fechaAyer.getDate()-1);

  }

  ngOnInit() {
  }
  
  ionViewDidEnter() {
    this.localStorageService.get('userActive').then(data=>{
      this.user = data;
      this.userOnList();
      this.userOffList();
      this.getOnlineUserList();
      this.newContact();
      this.actualizado();
      if(this.serviceSignalR.hubConnection.state==HubConnectionState.Connected){
        this.getOnLineUsersInv();
      } else {
        this.serviceSignalR.ssSubj.subscribe((obj:any)=>{
          if(obj.type=="HubConnStarted"){
              this.getOnLineUsersInv();
          }
        });
      }
    });
  }
  
  ngOnDestroy() {
    this.serviceSignalR.hubConnection.off("userOn");
    this.serviceSignalR.hubConnection.off("userOff");
    this.serviceSignalR.hubConnection.off("getOnlineUserResponse");
    this.serviceSignalR.hubConnection.off("newUserResponse");
    this.serviceSignalR.hubConnection.off("updateUserResponse");
  }
  //////////////////////////
  
  userOnList(){
    this.serviceSignalR.hubConnection.on("userOn",(newUser:User)=>{
    const indice = this.arrayContact.findIndex((elemento) => {
      if (elemento.iD_U === newUser.iD_U) {
        return true;
      }
    });
    if(indice!=-1){
      this.arrayContact[indice]=newUser;
    }
    //this.users.push(newUser);
    });
  }

  userOffList(){
    this.serviceSignalR.hubConnection.on("userOff",(idUser:number)=>{
      const indice = this.arrayContact.findIndex((elemento) => {
        if (elemento.iD_U === idUser) {
          return true;
        }
      });
      if(indice!=-1){
        this.arrayContact[indice].iD_EU=2;
      }
      });
  }

  getOnLineUsersInv(){
    this.serviceSignalR.hubConnection.invoke("getOnlineUsers")
    .catch(err=>console.error(err));
  }

  getOnlineUserList(): void {
    this.serviceSignalR.hubConnection.on("getOnlineUserResponse",(onlineUsers: Array<ChatUsers>)=>{
      this.arrayContact=[...onlineUsers];
    });
  }
  
  newContact(){
    this.serviceSignalR.hubConnection.on("newUserResponse",(newUser:User)=>{
      this.arrayContact.push({
        iD_U:newUser.iD_U,
        iD_EU:newUser.iD_EU,
        nombrE_U:newUser.nombrE_U,
        ultimaconeX_U:newUser.ultimaconeX_U,
        habilitadO_U:newUser.habilitadO_U,
        urlfotO_U:newUser.urlfotO_U,
        signaliD_U:newUser.signaliD_U
      });
    })
  }

  
  actualizado(){
    this.serviceSignalR.hubConnection.on("updateUserResponse",(newUser:User)=>{
      const indice = this.arrayContact.findIndex((elemento) => {
        if (elemento.iD_U === newUser.iD_U) {
          return true;
        }
      });
      if(indice!=-1){
        if(!newUser.habilitadO_U){
          this.arrayContact.splice(indice, 1);
        } else {
          this.arrayContact[indice].nombrE_U=newUser.nombrE_U;
          this.arrayContact[indice].urlfotO_U=newUser.urlfotO_U;
        }
      } else {
        this.arrayContact.push({
          iD_U:newUser.iD_U,
          iD_EU:newUser.iD_EU,
          nombrE_U:newUser.nombrE_U,
          ultimaconeX_U:newUser.ultimaconeX_U,
          habilitadO_U:newUser.habilitadO_U,
          urlfotO_U:newUser.urlfotO_U,
          signaliD_U:newUser.signaliD_U
        });
      }
    });
  }
  /////////////////////////

  getUltimaConexion(ultimaco:Date){
    ultimaco=new Date(ultimaco);
    if(ultimaco>this.fechaHoy){ //hoy
      return ultimaco.getHours()+":"+ultimaco.getMinutes();
    } else if(ultimaco>this.fechaAyer){ //Ayer
      return "Ayer " + ultimaco.getHours() + ((ultimaco.getMinutes()<10)?(":0" + ultimaco.getMinutes()):(":" + ultimaco.getMinutes()));
    } else {
      return ultimaco.getDate()+"/"+(ultimaco.getMonth())+"/"+(ultimaco.getFullYear()+"").slice(-2)+" "+ultimaco.getHours()+((ultimaco.getMinutes()<10)?(":0" + ultimaco.getMinutes()):(":" + ultimaco.getMinutes()));
    }
  }
  
  
  getChatByContact(user2: ChatUsers) { //llamamos a la funcion getPost de nuestro servicio.
    this.chatServices.GetChatByContact(this.user.iD_U,user2.iD_U)
      .subscribe(data => {
        this.sala = data;
        if(this.sala.iD_TS=1){
          this.sala.urlfotO_S=user2.urlfotO_U;
          this.sala.nombrE_S=user2.nombrE_U;
        }
        this.presentModal();
      }, 
      error=>{

      }
      );
  }
  
  async presentModal() {
    this.salaux = {
      iD_S: this.sala.iD_S,
      urlfotO_S: this.sala.urlfotO_S,
      iD_TS: this.sala.iD_TS,
      nombrE_S: this.sala.nombrE_S,
      contenidO_M:"",
      nummensajessinleeR_S:0,
      fechA_M:null,
      iD_TM:0,
      nombrE_U:""
    }
    const modal = await this.modalController.create({
      component: ChatComponent,
      componentProps: { 
        'chat': this.sala,
        'idu': this.user.iD_U,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      //const resultado = data['data'];
    });
    return await modal.present();
  }


  async presentModalDetalleContacto(contact: ChatUsers) {
    const modal = await this.modalController.create({
      component: ContactoComponent,
      componentProps: { 
        'user': contact
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        //const resultado = data['data'];
      });
    return await modal.present();
  }

}
