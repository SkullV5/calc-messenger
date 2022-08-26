import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ServiceAuthService } from '../Services/service-auth.service';
import { ServiceSignalrService } from '../Services/service-signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public authService:ServiceAuthService, public signalRService:ServiceSignalrService){}
  canActivate():  boolean{
    if(!this.authService.isAuthenticated){
      this.signalRService.router.navigateByUrl("calculadora");
      return false;
    }
    return true;
  }
}
