import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChatComponent } from './components/chat/chat.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DetailChatComponent } from './components/detail-chat/detail-chat.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { UserConfigComponent } from './components/user-config/user-config.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ChatsComponent } from './tabs/chats/chats.component';
import { ContactosComponent } from './tabs/contactos/contactos.component';
import { LlamadasComponent } from './tabs/llamadas/llamadas.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    Ng2SearchPipeModule,
  ],
  declarations: [HomePage, ChatsComponent, ContactosComponent, LlamadasComponent, ChatComponent, UserConfigComponent, ContactoComponent, DetailChatComponent, NewPasswordComponent, EditUserComponent]
})
export class HomePageModule {}
