import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models';
import { ServiceAuthService } from 'src/app/Services/service-auth.service';
import { ServiceMessagestatusService } from 'src/app/Services/service-messagestatus.service';
import { ServiceSignalrService } from 'src/app/Services/service-signalr.service';

@Component({
  selector: 'app-premiun',
  templateUrl: './premiun.component.html',
  styleUrls: ['./premiun.component.scss'],
})
export class PremiunComponent implements OnInit, OnDestroy {
  user:string;
  pass:string;

  contIntento:number=0;

  constructor(private serviceSignalR:ServiceSignalrService, public authService:ServiceAuthService,
    public toastController: ToastController, private modalController: ModalController,
    private MessagestatusService:ServiceMessagestatusService) { }

  ngOnInit() {
    this.authMeListenerSuccess();
    this.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.serviceSignalR.hubConnection.off("authMeResponseSuccess");
    this.serviceSignalR.hubConnection.off("authMeResponseFail");
  }

  VerifyCredencial() {
    if(this.contIntento<2){
      this.authService.authMe(this.user, this.pass);
      this.contIntento++;
    } else {
      this.serviceSignalR.localStorageService.removeall();
      this.presentToast("Al parecer estamos sin servicio, gracias por preferirnos");
      this.descartar();
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }

  descartar() {
    this.modalController.dismiss();
  }

  
  public authMeListenerSuccess(){
    this.serviceSignalR.hubConnection.on("authMeResponseSuccess",(user:User)=>{
      console.log("Logeado");
      //localStorage.setItem("userActive",user.iD_U+"");
      this.serviceSignalR.localStorageService.set('userActive',user).then(data=>{
        console.log(user);
        this.authService.isAuthenticated=true;
        this.serviceSignalR.user={...user};
        this.MessagestatusService.marcarLLegado(user.iD_U);
        this.serviceSignalR.router.navigateByUrl("/home/chats");
        this.descartar();
      });
    })
  }

  public authMeListenerFail(){
    return this.serviceSignalR.hubConnection.on("authMeResponseFail",()=>{
      console.log("Error");
      this.presentToast("No se ha validado su correo, intente más tarde");
    })
  }
}
