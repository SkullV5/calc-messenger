import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatUsers } from 'src/app/models';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent implements OnInit {
  @Input() user: ChatUsers;
  
  constructor(private modalController: ModalController) { 
  }

  ngOnInit() { }

  
  descartar() {
    this.modalController.dismiss();
  }
}
