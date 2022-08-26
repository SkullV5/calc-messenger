import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Message, MessageStatusDetail } from 'src/app/models';
import { ServiceMessagestatusService } from 'src/app/Services/service-messagestatus.service';

@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail-chat.component.html',
  styleUrls: ['./detail-chat.component.scss'],
})
export class DetailChatComponent implements OnInit {
  @Input() mess:Message;

  leido:MessageStatusDetail[]=[];
  entregado:MessageStatusDetail[]=[];
  enviado:MessageStatusDetail[]=[];
  fechaHoy:Date;
  fechaAyer:Date;

  constructor(private modalController: ModalController, private serviceMessageStatus:ServiceMessagestatusService) {     
    this.fechaHoy=new Date()
    this.fechaHoy.setHours(0);
    this.fechaHoy.setMinutes(0);
    this.fechaHoy.setSeconds(0);
    this.fechaAyer=new Date(this.fechaHoy);
    this.fechaAyer.setDate(this.fechaAyer.getDate()-1);
  }

  ngOnInit() {
    this.getStatus();
  }

  descartar() { 
    //console.log(this.mess);
    this.modalController.dismiss();
  }
  
  getStatus(){
    this.serviceMessageStatus.getChat(this.mess.iD_M,2).subscribe(data=>{
      this.leido=data;
      this.serviceMessageStatus.getChat(this.mess.iD_M,1).subscribe(data=>{
        this.entregado=data;
        this.serviceMessageStatus.getChat(this.mess.iD_M,3).subscribe(data=>{
          this.enviado=data;
        });
      });
    });
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
  
}
