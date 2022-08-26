import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models';
import { ServiceLocalstorageService } from 'src/app/Services/service-localstorage.service';
import { ServiceUserService } from 'src/app/Services/service-user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  auxUser: User = null;
  pass: string;
  newUserName: string;
  verifyNewUserName: string;

  constructor(public userServices: ServiceUserService, public localStorageService: ServiceLocalstorageService,
    public toastController: ToastController) { }

  ngOnInit() {
    this.localStorageService.get('userActive').then(data => {
      this.auxUser = data;
    });
  }

  changeUserName() {
    if (this.pass === this.auxUser.contraseniA_U && this.newUserName === this.verifyNewUserName) {
      this.auxUser.usuariO_U = this.newUserName;
      this.userServices.updateUser(this.auxUser).subscribe(data => {
        this.presentToast('Usuario actualizado');
        this.clearInput();
      }, error=>{
        this.presentToastError('Usuario no actualizado');
      });
    } else {
      this.presentToastError('La información no coincide, intente nuevamente');
      this.clearInput();
    }
  }

  clearInput() {
    this.pass = '';
    this.newUserName = '';
    this.verifyNewUserName = '';
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 1750,
      color: 'light',
    });
    toast.present();
  }

  async presentToastError(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 1750,
      color: 'danger',
    });
    toast.present();
  }

}
