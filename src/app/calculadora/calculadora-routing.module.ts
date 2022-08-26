import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculadoraPage } from './calculadora.page';
import { PremiunComponent } from './premiun/premiun.component';

const routes: Routes = [
  {
    path: '',
    component: CalculadoraPage,
  },
  {
    path: 'registro',
    component: PremiunComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculadoraPageRoutingModule {}
