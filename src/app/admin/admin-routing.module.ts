import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPage } from './admin.page';
import { ModalUserComponent } from './components/modal-user/modal-user.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
