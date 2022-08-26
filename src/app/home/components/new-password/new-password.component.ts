import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models';
import { ServiceLocalstorageService } from 'src/app/Services/service-localstorage.service';
import { ServiceUserService } from 'src/app/Services/service-user.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})

export class NewPasswordComponent implements OnInit {
  auxUser: User = null;
  user: string;
  pass: string;
  newPass: string;
  verifyPass: string;


  constructor(public userServices: ServiceUserService, public localStorageService: ServiceLocalstorageService, public toastController: ToastController) { }

  ngOnInit() {
    this.localStorageService.get('userActive').then(data => {
      this.auxUser = data;
    });
  }


  changePass() {
    if (this.pass == this.auxUser.contraseniA_U && this.newPass == this.verifyPass) {
      this.auxUser.contraseniA_U = this.newPass;
      this.userServices.updateUser(this.auxUser).subscribe(data => {
        this.presentToast("Contraseña actualizada","light");
        this.clearInput();
      }, error=>{
        this.presentToast("Contraseña no actualizada","danger");
      });
    } else {
      this.presentToast("La información no coincide, intente nuevamente","danger");
      this.clearInput();
    }
  }

  clearInput() {
    this.pass = "";
    this.newPass = "";
    this.verifyPass = "";
  }

  async presentToast(msg: string, col:string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 1500,
      color: col,
    });
    toast.present();
  }
}
