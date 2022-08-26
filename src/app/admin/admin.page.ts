import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ServiceUserService } from 'src/app/Services/service-user.service';
import { User } from '../models';
import { ServiceAuthService } from '../Services/service-auth.service';
import { ServiceLocalstorageService } from '../Services/service-localstorage.service';
import { ServiceSignalrService } from '../Services/service-signalr.service';
import { ModalUserComponent } from './components/modal-user/modal-user.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {

  type: string = "user";
  
  arrayUser:User[]=[]; 
  useraux:User;
  searchTerm: string;
  fechaHoy:Date;
  fechaAyer:Date;
  editar:boolean=false;

  user:User;

  code:string="";
  newcode1:string="";
  newcode2:string="";
  pass:string="";

  //mostrar listas
  mostrarHabilitados:boolean=true;
  mostrarDeshabilitados:boolean=false;

  
  //contSubscription: Subscription;

  constructor(public toastController: ToastController, public navCtrl: NavController, public userServices:ServiceUserService,public modalController: ModalController,public authService:ServiceAuthService,
    public serviceSignalR:ServiceSignalrService) {
    this.fechaHoy=new Date()
    this.fechaHoy.setHours(0);
    this.fechaHoy.setMinutes(0);
    this.fechaHoy.setSeconds(0);
    this.fechaAyer=new Date(this.fechaHoy);
    this.fechaAyer.setDate(this.fechaAyer.getDate()-1);

  }

  ngOnInit() {
    this.getUsers();
    this.getUsersInv();
    this.serviceSignalR.localStorageService.get('userActive').then(data => {
      this.user = data;
    });
    
    this.authService.logOutList();  //respuesta de salida
    this.guardado();
    this.errorGuardando();
    this.actualizado();
    this.errorActualizando();
  }
  
  ngOnDestroy() {
    //this.contSubscription.unsubscribe();
    //console.log("Sale de admin");
    this.serviceSignalR.hubConnection.off("getUserResponse");
    this.serviceSignalR.hubConnection.off("newUserResponse");
    this.serviceSignalR.hubConnection.off("newUserResponseFail");
    this.serviceSignalR.hubConnection.off("updateUserResponse");
    this.serviceSignalR.hubConnection.off("updateUserResponseFail");
  }


  //USER---------------------
  
  
  getUsersInv() { 
    this.serviceSignalR.hubConnection.invoke("getUser")
    .catch(err=>console.error(err));
  }

  getUsers(){
    this.serviceSignalR.hubConnection.on("getUserResponse",(onlineUsers: Array<User>)=>{
      this.arrayUser=[...onlineUsers];
    });
  }

  guardar(){
    this.serviceSignalR.hubConnection.invoke("newUser",this.useraux)
    .catch(err=>console.error(err));
  }

  guardado(){
    this.serviceSignalR.hubConnection.on("newUserResponse",(newUser:User)=>{
      this.arrayUser.push(newUser);
      this.presentToast("Se ha agregado un usuario");
    })
  }

  errorGuardando(){
    this.serviceSignalR.hubConnection.on("newUserResponseFail",()=>{
      this.presentToast("Se ha producido un error");
    })
  }
  
  actualizar(){
    this.serviceSignalR.hubConnection.invoke("updateUser",this.useraux)
    .catch(err=>console.error(err));
  }
  
  actualizado(){
    this.serviceSignalR.hubConnection.on("updateUserResponse",(newUser:User)=>{
      this.arrayUser.push(newUser);
      this.presentToast("Se ha actualizado un usuario");
    })
  }

  errorActualizando(){
    this.serviceSignalR.hubConnection.on("updateUserResponseFail",()=>{
      this.presentToast("Se ha producido un error");
    })
  }

  updateCode(){
    if(this.user.contraseniA_U==this.pass){
      if(this.newcode1==this.newcode2){
        this.userServices.updateCode(this.code,this.newcode1).subscribe(data=>{
          this.code="";
          this.newcode1="";
          this.newcode2="";
          this.pass="";
          this.presentToast("Código actualizado con exito");
        },error=>{
          this.presentToast("No coincide el código anterior");
        });
      } else {
        this.presentToast("No coincide el nuevo código");
      }
    } else {
      this.presentToast("La contraseña ingresada es incorrecta");
    }
  }

  getUltimaConexion(ultimaco:Date){
    ultimaco=new Date(ultimaco);
    if(ultimaco>this.fechaHoy){ //hoy
      return ultimaco.getHours()+":"+ultimaco.getMinutes();
    } else if(ultimaco>this.fechaAyer){ //Ayer
      return "Ayer "+ultimaco.getHours()+":"+ultimaco.getMinutes();
    } else {
      return ultimaco.getDate()+"/"+(ultimaco.getMonth())+"/"+(ultimaco.getFullYear()+"").slice(-2);
    }
  }

  nuevo(){
    this.editar=false;
    this.useraux={
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
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalUserComponent,
      componentProps: {
        'user': this.useraux,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      const resultado = data['data'];
      if(!resultado['dismissed']){
        this.useraux=resultado['user'];
        if(!this.editar){
          this.guardar();
        } else {
          this.actualizar();
        }
      }
    });
    return await modal.present();
  }
  
  chat(){
    this.serviceSignalR.router.navigate(['/home/chats']);
  }
  
 /* salir(){
    var user:User;
    this.localStorageService.get('userActive').then(data => {
      user = data;
      user.iD_EU=2;
      this.userServices.updateStatus(user).subscribe((data)=>{
        this.localStorageService.removeall();
        this.router.navigate(['/calculadora']);
      },
      (error)=>{console.log(error);}
      );
    });
  }*/
  
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }

}
