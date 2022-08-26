import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss'],
})
export class ModalUserComponent implements OnInit {
  newFile: any;
  pass:string="******";
  @Input() user:User;
  edit:boolean=false;

  constructor(public modalController: ModalController) { 
  }

  ngOnInit() {
    if(this.user.usuariO_U!=""){
      this.edit=true;
    }}

  descartar() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

  guardar(){
    this.modalController.dismiss({
      'dismissed': false,
      'user':this.user
    });
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.user.urlfotO_U = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
      }
}
}