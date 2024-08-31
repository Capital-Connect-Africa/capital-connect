import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/list/list.component').then(c => c.ListComponent)},
  { path: ':id', loadComponent: () => import('../pages/single-investor/single-investor.component').then(c => c.SingleInvestorComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessInvestorsRoutingModule { }