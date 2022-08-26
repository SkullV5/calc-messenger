import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonContent, ModalController, ViewDidEnter } from '@ionic/angular';
import { ChatActive, ChatUsers, Message, User } from 'src/app/models';
import { ServiceChatService } from 'src/app/Services/service-chat.service';
import { ServiceMessageService } from 'src/app/Services/service-message.service';
import { ServiceMessagestatusService } from 'src/app/Services/service-messagestatus.service';
import { ServiceSignalrService } from 'src/app/Services/service-signalr.service';
import { DetailChatComponent } from '../detail-chat/detail-chat.component';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, ViewDidEnter {
  @Input() idu: number;
  @Input() idcnn: string;
  @Input() chat: ChatActive;

  //@ViewChild(IonContent) content: IonContent;
  @ViewChild(IonContent, {read: IonContent, static: false}) content: IonContent;

  arrayMessage:Message[]=[];
  arrayUser:ChatUsers[]=[];

  newMess:Message;
  contMessage:string="";

  messageIni:number=0;
  messageCant:number=10;

  
  fechaHoy:Date;
  fechaAyer:Date;
  //menSubscription: Subscription;

  scrolled = false;

  constructor(public chatServices:ServiceChatService,private modalController: ModalController,
    public serviceSignalR:ServiceSignalrService) { 
      this.fechaHoy=new Date()
      this.fechaHoy.setHours(0);
      this.fechaHoy.setMinutes(0);
      this.fechaHoy.setSeconds(0);
      this.fechaAyer=new Date(this.fechaHoy);
      this.fechaAyer.setDate(this.fechaAyer.getDate()-1);
    }

  ngOnInit() {
    this.marcarLeido();
    if(this.chat.iD_TS!=1){
      this.getUserInChat();
    } else {
      this.getMessagesInit();
    }
    this.getMessages();
    this.getNewMessage();
  }

  ionViewDidEnter(): void {
    this.content.scrollToBottom();
  }

  ngOnDestroy() {
    this.serviceSignalR.hubConnection.off("getMessageResponse");
    this.serviceSignalR.hubConnection.off("postResponse");
  }
  
  marcarLeido(){
    this.serviceSignalR.hubConnection.invoke("marcarLeido",this.chat.iD_S,this.idu)
    .catch(err=>console.error(err));
  } 
  
  getUserInChat() { 
    this.chatServices.getUserInChat(this.chat.iD_S)
    .subscribe(data => {
      this.arrayUser = data;
      this.getMessagesInit();
    });
  }

  getMessagesInit(){
    if(this.serviceSignalR.hubConnection.state==HubConnectionState.Connected){
      this.getMessagesInv();
    } else {
      this.serviceSignalR.ssSubj.subscribe((obj:any)=>{
        if(obj.type=="HubConnStarted"){
            this.getMessagesInv();
        }
      });
    }
  }

  newMessage(){
    this.newMess={
      iD_M: 0,
      iD_S: this.chat.iD_S,
      meN_ID_M: null,
      iD_TM: 1,
      iD_U: this.idu,
      contenidO_M: this.contMessage,
      fechA_M: new Date(),
      urL_M: null
    }
    this.postMessagesInv(this.newMess);
  }

  devolverUsuario(idu:number){
    var nomUser:ChatUsers = this.arrayUser.find(x => x.iD_U === idu);
    return nomUser.nombrE_U;
  }

  descartar() {
    this.modalController.dismiss();
  }

  async presentModal(mess:Message) {
    const modal = await this.modalController.create({
      component: DetailChatComponent,
      componentProps: {
        'mess': mess,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
    });
    return await modal.present();
  }

  ////////
  
  getMessagesInv(){
    this.serviceSignalR.hubConnection.invoke("getMessage",this.chat.iD_S,this.idu)
    .catch(err=>console.error(err));
  }

  getMessages(): void {
    this.serviceSignalR.hubConnection.on("getMessageResponse",(mess: Array<Message>)=>{
      this.arrayMessage=[...mess];
    });
    //
  }

  postMessagesInv(msg:Message){
    this.serviceSignalR.hubConnection.invoke("postMessages",msg,this.chat.iD_S,this.idu).then(()=>{
      this.arrayMessage.push(msg);
      this.contMessage="";
    })
    .catch(err=>console.error(err));
    this.ScrollToBottom(200,300);
  }

  ScrollToBottom(t:number,ta:number){
    setTimeout(() => {
      this.content.scrollToBottom(ta);
   }, t);
  }

  getNewMessage(){
    this.serviceSignalR.hubConnection.on("postResponse",(msg:Message)=>{
      this.arrayMessage.push(msg);
      this.marcarLeido();
      this.ScrollToBottom(100,300);
    });
    //
  }

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

  getContent() {
    return document.querySelector('ion-content');
  }


}
