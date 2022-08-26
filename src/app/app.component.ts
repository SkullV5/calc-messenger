import { Component, OnInit } from '@angular/core';
import { User } from './models';
import { ServiceSignalrService } from './Services/service-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  user: User;
  constructor(private serviceSignalR:ServiceSignalrService) {}

  ngOnInit(): void {
    this.serviceSignalR.startConnection();
  }
}
