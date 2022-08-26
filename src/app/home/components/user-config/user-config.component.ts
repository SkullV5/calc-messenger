import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models';
import { ServiceAuthService } from 'src/app/Services/service-auth.service';
import { ServiceSignalrService } from 'src/app/Services/service-signalr.service';
import { ServiceUserService } from 'src/app/Services/service-user.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss'],
})
export class UserConfigComponent implements OnInit {
  @Input() user: User;
  mostrarEditUser = false;
  mostrarNewPassword = false;
  mostrarDeshabilitar=false;

  constructor(private modalController: ModalController, private serviceUser:ServiceUserService,
    public alertController: AlertController,public authService:ServiceAuthService, public signalService:ServiceSignalrService) { }

  ngOnInit() { 
    this.authService.logOutList();  //respuesta de salida
  }

  descartar() {
    this.modalController.dismiss();
  }

  async deshabilitar(){
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: ' Seguro desea <strong>deshabilitar</strong> esta cuenta',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.serviceUser.disabled(this.user.iD_U).subscribe(()=>{
              this.signalService.hubConnection.invoke("Disabled",this.user);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  
}
