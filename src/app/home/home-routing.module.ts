import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DetailChatComponent } from './components/detail-chat/detail-chat.component';
import { UserConfigComponent } from './components/user-config/user-config.component';
import { HomePage } from './home.page';
import { ChatsComponent } from './tabs/chats/chats.component';
import { ContactosComponent } from './tabs/contactos/contactos.component';
import { LlamadasComponent } from './tabs/llamadas/llamadas.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'contactos',
        component: ContactosComponent
      },
      {
        path: 'llamadas',
        component: LlamadasComponent
      },
      {
        path: 'chats',
        component: ChatsComponent
      },
      {
        path: 'chat',
        component: ChatComponent
      },

    ]
  },
  {
    path: 'user-config',
    component: UserConfigComponent,
  },
  {
    path: 'contacto',
    component: ContactoComponent,
  },
  {
    path: 'detalle',
    component: DetailChatComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
