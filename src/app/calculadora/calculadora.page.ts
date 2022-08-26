import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ServiceUserService } from 'src/app/Services/service-user.service';
import { ServiceAuthService } from '../Services/service-auth.service';
import { PremiunComponent } from './premiun/premiun.component';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
})
export class CalculadoraPage implements OnInit {

  display = 0;
  memory = 0;
  state = 'number';
  operator = '+';
  decimal = false;
  decimals = 0;

  codigo:string="";//código de acceso
  isCodigo:boolean=false;


  clickNumber(n: number) {
    switch (this.state) {
      case 'number':
        if (this.decimal) {
          this.decimals++;
          this.display = this.display + n * Math.pow(10, -this.decimals);
        } else {
          this.display = this.display * 10 + n;
        }
        break;
      case 'operator':
        this.display = n;
        this.state = 'number';
        break;
      case 'result':
        this.memory = 0;
        this.display = n;
        this.state = 'number';
    }
  }

  clickOperator(o: string) {
    // console.log('clickOperator inicio');
    this.calculate();
    this.operator = o;
    this.memory = this.display;
    this.state = 'operator';
    // console.log('clickOperator fin');
  }

  calculate() {
    // tslint:disable-next-line:no-eval
    // console.log('calculate inicio');
    // console.log('' + '' + this.memory + this.operator + '(' + this.display + ')');
    this.display = eval('' + this.memory + this.operator + '(' + this.display + ')');
    this.memory = 0;
    this.state = 'result';
    this.operator = '+';
    this.decimal = false;
    this.decimals = 0;
    // console.log('calculate fin');
  }

  resetLastNumber() {
    this.display = 0;
    this.state = 'number';
    this.decimal = false;
    this.decimals = 0;
  }

  reset() {
    this.display = 0;
    this.memory = 0;
    this.state = 'number';
    this.operator = '+';
    this.decimal = false;
    this.decimals = 0;
  }

  changeSign() {
    this.display = this.display * -1;
  }

  setDecimal() {
    this.decimal = true;
  }

  constructor(private modalController: ModalController, private userServices:ServiceUserService,public toastController: ToastController,
    public authService:ServiceAuthService) { }

  ngOnInit() {
  }

  
async presentModalPublicidad() {
  const modal = await this.modalController.create({
    component: PremiunComponent
  });
  modal.onDidDismiss().then(() => {
    this.codigo="";
  });
  return await modal.present();
}

iniCodigo(){
    this.codigo="";
}

concatCodigo(cod:string){
  this.codigo=this.codigo+cod;
}

VerifyAccess() { 
  this.userServices.VerifyAccess(this.codigo)
  .subscribe(data => {
    this.isCodigo = data;
    if(this.isCodigo){
      if (this.authService.isAuthenticated) {
        this.authService.serviceSignalR.router.navigateByUrl("home/chats");
      } else {
        this.presentModalPublicidad();
      }
    } else {
      this.codigo="";
    }
  }, error=>{
    //this.presentToast(error);
    //console.log(error);
  });
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



}


