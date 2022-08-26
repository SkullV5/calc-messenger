import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatActive, User } from 'src/app/models';
import { ServiceAuthService } from 'src/app/Services/service-auth.service';
import { ServiceChatService } from 'src/app/Services/service-chat.service';
import { ServiceSignalrService } from 'src/app/Services/service-signalr.service';
import { ServiceUserService } from 'src/app/Services/service-user.service';
import { ChatComponent } from '../../components/chat/chat.component';
import { UserConfigComponent } from '../../components/user-config/user-config.component';
import { HubConnectionState } from '@microsoft/signalr';
import { ServiceMessagestatusService } from 'src/app/Services/service-messagestatus.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  arrayChat: ChatActive[] = [];
  user: User;
  searchTerm: string="";

  fechaHoy: Date;
  fechaAyer: Date;
  
  //chatSubscription: Subscription;

  constructor(public modalController: ModalController, public navCtrl: NavController, 
    public chatServices: ServiceChatService,public serviceSignalR:ServiceSignalrService,
    public userServices:ServiceUserService, public router: Router,
    public authService:ServiceAuthService) {
    this.fechaHoy = new Date()
    this.fechaHoy.setHours(0);
    this.fechaHoy.setMinutes(0);
    this.fechaHoy.setSeconds(0);
    this.fechaAyer = new Date(this.fechaHoy);
    this.fechaAyer.setDate(this.fechaAyer.getDate() - 1);
  }

  ngOnInit() {
    this.user={
      iD_U:0,
      iD_EU:0,
      nombrE_U:"",
      usuariO_U:"",
      contraseniA_U:"",
      habilitadO_U:false,
      urlfotO_U:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      administrA_U:false,
      ultimaconeX_U:new Date(),
      signaliD_U: ""
    };
    this.authService.logOutList();  //respuesta de salida
    this.getChatActivos();
    this.updateChatActivos();
  }
  
  
  ionViewDidEnter() {
    this.serviceSignalR.localStorageService.get('userActive').then(data=>{
      this.user = data;
      if(this.serviceSignalR.hubConnection.state==HubConnectionState.Connected){
        this.getChatActivosInv();
      } else {
        this.serviceSignalR.ssSubj.subscribe((obj:any)=>{
          if(obj.type=="HubConnStarted"){
              this.getChatActivosInv();
          }
        });
      }
    });
  }
  
  ngOnDestroy() {
    //this.chatSubscription.unsubscribe();
    console.log("Sale de chats");
  }
/*
  getChats(id: number) {
    this.chatSubscription=this.chatServices.pollChat(id)
      .subscribe(data => {
        this.arrayChat = data;
      });
  }*/

  getUltimaConexion(ultimaco: Date) {
    ultimaco = new Date(ultimaco);
    if (ultimaco > this.fechaHoy) { //hoy
      return ultimaco.getHours() + ":" + ultimaco.getMinutes();
    } else if (ultimaco > this.fechaAyer) { //Ayer
      return "Ayer " + ultimaco.getHours() + ((ultimaco.getMinutes()<10)?(":0" + ultimaco.getMinutes()):(":" + ultimaco.getMinutes()));
    } else {
      return ultimaco.getDate() + "/" + (ultimaco.getMonth()) + "/" + (ultimaco.getFullYear() + "").slice(-2);
    }
  }

  async presentModal(sala: ChatActive) {
    const modal = await this.modalController.create({
      component: ChatComponent,
      componentProps: {
        'chat': sala,
        'idu': this.user.iD_U,
        'idcnn':this.user.signaliD_U
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        //const resultado = data['data'];
      });
    return await modal.present();
  }
  async presentModalPerfil() {
    const modal = await this.modalController.create({
      component: UserConfigComponent,
      componentProps: {
        'user': this.user
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        //const resultado = data['data'];
      });
    return await modal.present();
  }
/*
  salir(){
      this.serviceSignalR.localStorageService.removeall();
      this.router.navigate(['/calculadora']);
  }*/
  
  admin(){
    this.router.navigate(['/admin']);
  }

  ////////////////////////

  getChatActivosInv(){
    this.serviceSignalR.hubConnection.invoke("getChatActive",this.user.iD_U)
    .catch(err=>console.error(err));
  }

  getChatActivos(): void {
    this.serviceSignalR.hubConnection.on("getChatActiveResponse",(chatAct: Array<ChatActive>)=>{
      this.arrayChat=[...chatAct];
    });
  }
  updateChatActivos(): void {
    this.serviceSignalR.hubConnection.on("updateChatActiveResponse",(chatAct: Array<ChatActive>)=>{
      this.arrayChat=[...chatAct];
      console.log("AActualizacion de chats");
    });
  }
  
}
